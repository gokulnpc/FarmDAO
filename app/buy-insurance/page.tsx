"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Check, MapPin, CheckCircle2, ArrowLeft, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/app/providers/WalletProvider";
import { InsuranceContract } from "@/app/abi/InsuranceContract";
import { FUSD } from "@/app/abi/FUSD";
import { ethers } from "ethers";
import { toast } from "sonner";
import Script from "next/script";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";

interface FormData {
  location: string;
  coordinates: [number, number];
  premium: number;
  coverageAmount: number;
  tier: "Basic" | "Standard" | "Premium";
}

const storePolicyInDB = async (
  userAddress: string,
  policyId: string,
  latitude: number,
  longitude: number,
  premium: number,
  coverageAmount: number,
  tier: string
) => {
  try {
    const response = await fetch("/api/policies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userAddress,
        policyId,
        latitude,
        longitude,
        premium,
        coverageAmount,
        tier,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to store policy in database");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error storing policy in database:", error);
    throw error;
  }
};

const getTierImage = (tier: string) => {
  switch (tier.toLowerCase()) {
    case "premium":
      return "/premium-farm-insurance.png";
    case "standard":
      return "/standard-farm-insurance.png";
    case "basic":
    default:
      return "/basic-farm-insurance.png";
  }
};

export default function BuyInsurance() {
  const { currentAccount, provider } = useWallet();
  const [formData, setFormData] = useState<FormData>({
    location: "",
    coordinates: [0, 0],
    premium: 125,
    coverageAmount: 2500,
    tier: "Basic",
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [policyId, setPolicyId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [locationAddress, setLocationAddress] = useState<string>("");

  const getAddressFromCoordinates = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        return data.results[0].formatted_address;
      }
      return "";
    } catch (error) {
      console.error("Error getting address:", error);
      return "";
    }
  };

  const handleSelect = async (selectedAddress: string) => {
    try {
      const results = await geocodeByAddress(selectedAddress);
      const latLng = await getLatLng(results[0]);
      setAddress(selectedAddress);
      setCoordinates(latLng);
      setLocationAddress(selectedAddress);
      console.log("Location selected:", latLng);
    } catch (error) {
      console.error("Error selecting location:", error);
      toast.error("Failed to get location coordinates");
    }
  };

  const handleTierSelect = (tier: FormData["tier"]) => {
    let premium = 0;
    let coverage = 0;

    // Set premium and coverage based on tier
    switch (tier) {
      case "Basic":
        premium = 125;
        coverage = 2500;
        break;
      case "Standard":
        premium = 250;
        coverage = 5000;
        break;
      case "Premium":
        premium = 500;
        coverage = 10000;
        break;
    }

    setFormData({
      ...formData,
      tier,
      premium,
      coverageAmount: coverage,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentAccount || !provider || !coordinates) {
      toast.error("Please connect wallet and select location");
      return;
    }

    try {
      setIsProcessing(true);

      // Get the address if we don't have it yet
      if (!locationAddress && coordinates) {
        const address = await getAddressFromCoordinates(
          coordinates.lat,
          coordinates.lng
        );
        setLocationAddress(address);
      }

      const signer = await provider.getSigner();
      const fusdContract = new ethers.Contract(FUSD.address, FUSD.abi, signer);
      const insuranceContract = new ethers.Contract(
        InsuranceContract.address,
        InsuranceContract.abi,
        signer
      );

      // Convert premium and coverage to contract values
      const premiumInWei = ethers.parseUnits(formData.premium.toString(), 0);
      const coverageInWei = ethers.parseUnits(
        formData.coverageAmount.toString(),
        0
      );

      // First approve FUSD transfer
      const approveTx = await fusdContract.approve(
        InsuranceContract.address,
        premiumInWei
      );
      await approveTx.wait();
      toast.success("Premium payment approved");

      // Create policy on blockchain
      const createPolicyTx = await insuranceContract.createPolicy(
        premiumInWei,
        coverageInWei
      );

      const receipt = await createPolicyTx.wait();

      // Get policy ID from event
      const event = receipt.logs.find(
        (log: any) => log.fragment?.name === "PolicyCreated"
      );

      if (!event) {
        throw new Error("Policy creation event not found");
      }

      const policyId = event.args[0].toString();
      setPolicyId(policyId);

      // Store policy in database
      const response = await fetch("/api/policies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userAddress: currentAccount,
          policyId,
          latitude: coordinates.lat,
          longitude: coordinates.lng,
          premium: formData.premium,
          coverageAmount: formData.coverageAmount,
          tier: formData.tier,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to store policy in database");
      }

      toast.success("Policy created successfully!");
      setShowConfirmation(true);
    } catch (error) {
      console.error("Error creating policy:", error);
      toast.error("Failed to create policy. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        onLoad={() => setScriptLoaded(true)}
      />
      <div className="min-h-screen bg-neutral-800 text-white p-4">
        <div className="max-w-7xl mx-auto rounded-3xl bg-[#1a1a1a] overflow-hidden p-6 md:p-10">
          {/* Page Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-serif mb-4">Buy Insurance</h1>
            <p className="text-neutral-400">
              Protect your crops from weather events with our blockchain-powered
              insurance policies.
            </p>
          </div>

          {showConfirmation ? (
            <div className="max-w-2xl mx-auto text-center py-10">
              <div className="bg-green-900/20 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <CheckCircle2 className="h-12 w-12 text-green-400" />
              </div>
              <h2 className="text-3xl font-bold mb-4">
                Policy Purchased Successfully!
              </h2>
              <p className="text-xl mb-6">Your policy NFT has been minted</p>

              <div className="bg-neutral-900 border border-neutral-800 rounded-3xl mb-8 overflow-hidden">
                <div className="aspect-square max-w-xs mx-auto mb-4 rounded-2xl overflow-hidden p-4">
                  <Image
                    src={getTierImage(formData.tier)}
                    alt={`${formData.tier} Policy NFT`}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                <div className="text-left p-6 bg-neutral-800">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-neutral-400">Policy ID</p>
                      <p className="font-medium">#{policyId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-400">Tier</p>
                      <p className="font-medium text-green-400">
                        {formData.tier}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-400">Premium</p>
                      <p className="font-medium">{formData.premium} FUSD</p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-400">
                        Coverage Amount
                      </p>
                      <p className="font-medium">
                        {formData.coverageAmount.toLocaleString()} FUSD
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-400">Location</p>
                      <p className="font-medium">
                        {coordinates?.lat.toFixed(6)}°N,{" "}
                        {coordinates?.lng.toFixed(6)}°E
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-400">Duration</p>
                      <p className="font-medium">6 months</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/my-policies"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full flex items-center"
                >
                  <Shield className="h-5 w-5 mr-2" />
                  View My Policies
                </Link>
                <Link
                  href="/dashboard"
                  className="bg-neutral-700 hover:bg-neutral-600 text-white px-6 py-3 rounded-full flex items-center"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back to Dashboard
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <div className="bg-neutral-900 rounded-3xl p-6 mb-6">
                  <h2 className="text-2xl font-bold mb-6">
                    Select Coverage Plan
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div
                      className={`p-6 rounded-xl cursor-pointer transition-all ${
                        formData.tier === "Basic"
                          ? "border-2 border-green-500 bg-green-900/20"
                          : "border border-neutral-700 hover:border-neutral-600"
                      }`}
                      onClick={() => handleTierSelect("Basic")}
                    >
                      <div className="text-lg font-bold mb-1">Basic</div>
                      <div className="text-3xl font-bold mb-2">2,500 FUSD</div>
                      <div className="text-sm text-neutral-400">
                        Premium: 125 FUSD
                      </div>
                    </div>

                    <div
                      className={`p-6 rounded-xl cursor-pointer transition-all ${
                        formData.tier === "Standard"
                          ? "border-2 border-green-500 bg-green-900/20"
                          : "border border-neutral-700 hover:border-neutral-600"
                      }`}
                      onClick={() => handleTierSelect("Standard")}
                    >
                      <div className="text-lg font-bold mb-1">Standard</div>
                      <div className="text-3xl font-bold mb-2">5,000 FUSD</div>
                      <div className="text-sm text-neutral-400">
                        Premium: 250 FUSD
                      </div>
                    </div>

                    <div
                      className={`p-6 rounded-xl cursor-pointer transition-all ${
                        formData.tier === "Premium"
                          ? "border-2 border-green-500 bg-green-900/20"
                          : "border border-neutral-700 hover:border-neutral-600"
                      }`}
                      onClick={() => handleTierSelect("Premium")}
                    >
                      <div className="text-lg font-bold mb-1">Premium</div>
                      <div className="text-3xl font-bold mb-2">10,000 FUSD</div>
                      <div className="text-sm text-neutral-400">
                        Premium: 500 FUSD
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-neutral-900 rounded-3xl p-6 mb-6">
                  <h2 className="text-2xl font-bold mb-6">Farm Location</h2>
                  {scriptLoaded && (
                    <PlacesAutocomplete
                      value={formData.location}
                      onChange={(address) =>
                        setFormData({ ...formData, location: address })
                      }
                      onSelect={handleSelect}
                    >
                      {({
                        getInputProps,
                        suggestions,
                        getSuggestionItemProps,
                        loading,
                      }) => (
                        <div>
                          <div className="relative">
                            <MapPin className="absolute left-4 top-5 h-6 w-6 text-neutral-400" />
                            <input
                              {...getInputProps({
                                placeholder: "Enter your farm location",
                                className:
                                  "w-full bg-neutral-800 border-0 rounded-xl p-4 pl-14 text-xl h-16",
                              })}
                            />
                          </div>
                          <div className="absolute z-10 w-full max-w-md bg-neutral-800 rounded-xl mt-2">
                            {loading && (
                              <div className="p-4 text-neutral-400">
                                Loading...
                              </div>
                            )}
                            {suggestions.map((suggestion) => {
                              const props = getSuggestionItemProps(suggestion, {
                                className: `p-4 cursor-pointer ${
                                  suggestion.active
                                    ? "bg-neutral-700"
                                    : "hover:bg-neutral-700"
                                }`,
                              });
                              return (
                                <div {...props} key={suggestion.placeId}>
                                  <span>{suggestion.description}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </PlacesAutocomplete>
                  )}
                  {locationAddress && (
                    <div className="mt-4 p-4 bg-neutral-800 rounded-xl">
                      <p className="text-green-400 font-medium mb-2">
                        Selected Location:
                      </p>
                      <p className="text-lg">{locationAddress}</p>
                      {coordinates && (
                        <p className="text-sm text-neutral-400 mt-2">
                          Coordinates: {coordinates.lat.toFixed(6)}°N,{" "}
                          {coordinates.lng.toFixed(6)}°E
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="bg-neutral-900 rounded-3xl p-6">
                  <h2 className="text-2xl font-bold mb-6">
                    Customize Coverage
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <label htmlFor="coverage" className="text-lg">
                          Coverage Amount (FUSD)
                        </label>
                        <span className="font-bold text-lg">
                          {formData.coverageAmount.toLocaleString()} FUSD
                        </span>
                      </div>
                      <input
                        id="coverage"
                        type="range"
                        min="1000"
                        max="20000"
                        step="500"
                        value={formData.coverageAmount}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            coverageAmount: Number(e.target.value),
                          })
                        }
                        className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-sm text-neutral-400 mt-2">
                        <span>1,000</span>
                        <span>20,000</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="bg-neutral-900 rounded-3xl p-6 sticky top-4">
                  <h2 className="text-2xl font-bold mb-6">Summary</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400">Coverage Amount</span>
                      <span className="font-bold text-lg">
                        {formData.coverageAmount.toLocaleString()} FUSD
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400">Premium</span>
                      <span className="font-bold text-lg">
                        {formData.premium} FUSD
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400">Duration</span>
                      <span className="font-bold text-lg">6 months</span>
                    </div>
                    <div className="pt-4 border-t border-neutral-700">
                      <div className="flex justify-between items-center">
                        <span className="text-lg">Total</span>
                        <span className="font-bold text-xl">
                          {formData.premium} FUSD
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={handleSubmit}
                    disabled={isProcessing || !currentAccount || !coordinates}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl text-lg mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing
                      ? "Processing..."
                      : !currentAccount
                      ? "Connect Wallet to Purchase"
                      : !coordinates
                      ? "Select Farm Location"
                      : "Purchase Policy"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
