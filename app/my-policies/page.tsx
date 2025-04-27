"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  ExternalLink,
  Shield,
  MapPin,
  ThermometerSun,
} from "lucide-react";
import { useWallet } from "@/app/providers/WalletProvider";
import { WeatherService } from "@/services/WeatherService";
import { toast } from "sonner";

interface Policy {
  _id: string;
  userAddress: string;
  policyId: string;
  location: {
    type: string;
    coordinates: [number, number]; // [longitude, latitude]
    address: string;
  };
  premium: number;
  coverageAmount: number;
  tier: "Basic" | "Standard" | "Premium";
  status: "Active" | "Expired" | "Claimed";
  weatherHistory: Array<{
    date: string;
    temperature: number;
    weatherText: string;
    humidity: number;
    precipitation: number;
  }>;
  claims: Array<{
    date: string;
    amount: number;
    status: "Pending" | "Approved" | "Rejected";
    reason: string;
    weatherData: {
      temperature: number;
      weatherText: string;
      humidity: number;
      precipitation: number;
    };
  }>;
  startDate: string;
  endDate: string;
  lastWeatherUpdate: string;
  createdAt: string;
  updatedAt: string;
}

interface WeatherInfo {
  temperature: number;
  weatherText: string;
  humidity?: number;
  precipitation?: number;
}

interface LocationInfo {
  address: string;
  coordinates: [number, number];
}

interface PolicyWithWeather extends Policy {
  weather?: WeatherInfo;
  locationInfo?: LocationInfo;
}

const getTierImage = (tier: string) => {
  switch (tier.toLowerCase()) {
    case "premium":
      return "/premium.jpeg";
    case "standard":
      return "/standard.jpeg";
    case "basic":
    default:
      return "/basic.jpeg";
  }
};

export default function MyPolicies() {
  const { currentAccount } = useWallet();
  const [activeTab, setActiveTab] = useState("active");
  const [policies, setPolicies] = useState<PolicyWithWeather[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPolicy, setSelectedPolicy] =
    useState<PolicyWithWeather | null>(null);
  const weatherService = new WeatherService();

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

  useEffect(() => {
    if (currentAccount) {
      fetchPolicies();
    }
  }, [currentAccount]);

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/policy-details/user?address=${currentAccount}`
      );
      const data = await response.json();
      console.log("Response from policy-details: ", data);

      if (data.success) {
        // Add weather and location info for each policy
        const policiesWithInfo = await Promise.all(
          data.policies.map(async (policy: Policy) => {
            // Get location address if not already present
            let address = policy.location.address;
            if (!address) {
              address = await getAddressFromCoordinates(
                policy.location.coordinates[1],
                policy.location.coordinates[0]
              );
            }

            console.log("Processing policy: ", policy);

            // Fetch weather data
            try {
              const weatherData = await weatherService.getWeatherByCoordinates(
                policy.location.coordinates[1],
                policy.location.coordinates[0]
              );

              return {
                ...policy,
                locationInfo: {
                  address,
                  coordinates: policy.location.coordinates,
                },
                weather: {
                  temperature: weatherData.Temperature.Metric.Value,
                  weatherText: weatherData.WeatherText,
                },
              };
            } catch (error) {
              console.error("Error fetching weather for policy:", error);
              return {
                ...policy,
                locationInfo: {
                  address,
                  coordinates: policy.location.coordinates,
                },
              };
            }
          })
        );

        console.log("Processed policies with info:", policiesWithInfo);
        setPolicies(policiesWithInfo);
      } else {
        toast.error("Failed to fetch policies");
      }
    } catch (error) {
      console.error("Error fetching policies:", error);
      toast.error("Error fetching policies");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isPolicyActive = (endDate: string) => {
    return new Date(endDate) > new Date();
  };

  const getStatusBadge = (endDate: string) => {
    const active = isPolicyActive(endDate);
    return active ? (
      <div className="bg-green-900/50 text-green-400 px-3 py-1 rounded-full text-sm">
        Active
      </div>
    ) : (
      <div className="bg-neutral-700/50 text-neutral-400 px-3 py-1 rounded-full text-sm">
        Expired
      </div>
    );
  };

  const PolicyDetails = ({ policy }: { policy: PolicyWithWeather }) => {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-[#1a1a1a] rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold">Policy Details</h2>
            <button
              onClick={() => setSelectedPolicy(null)}
              className="text-neutral-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="aspect-square relative mb-6 rounded-xl overflow-hidden">
            <Image
              src={getTierImage(policy.tier)}
              alt={`${policy.tier} Policy NFT`}
              fill
              className="object-cover"
            />
          </div>

          <div className="grid gap-6">
            {/* Basic Info Section */}
            <div className="bg-neutral-800 rounded-xl p-4">
              <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
              <div className="grid gap-4">
                <div>
                  <p className="text-neutral-400 mb-1">Policy ID</p>
                  <p className="text-lg font-mono">{policy.policyId}</p>
                </div>
                <div>
                  <p className="text-neutral-400 mb-1">Status</p>
                  <p className="text-lg capitalize">{policy.status}</p>
                </div>
                <div>
                  <p className="text-neutral-400 mb-1">Tier</p>
                  <p className="text-lg capitalize">{policy.tier}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-neutral-400 mb-1">Premium</p>
                    <p className="text-lg">{policy.premium} FUSD</p>
                  </div>
                  <div>
                    <p className="text-neutral-400 mb-1">Coverage Amount</p>
                    <p className="text-lg">{policy.coverageAmount} FUSD</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Location Section */}
            <div className="bg-neutral-800 rounded-xl p-4">
              <h3 className="text-lg font-semibold mb-4">Location</h3>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-5 w-5 text-green-400" />
                <p className="text-lg font-medium">
                  {policy.locationInfo?.address}
                </p>
              </div>
              <p className="text-sm text-neutral-400">
                {policy.location.coordinates[1].toFixed(6)}°N,{" "}
                {policy.location.coordinates[0].toFixed(6)}°E
              </p>
            </div>

            {/* Current Weather Section */}
            {policy.weather && (
              <div className="bg-neutral-800 rounded-xl p-4">
                <h3 className="text-lg font-semibold mb-4">Current Weather</h3>
                <div className="flex items-center gap-4">
                  <ThermometerSun className="h-8 w-8 text-orange-400" />
                  <div>
                    <p className="text-xl font-bold">
                      {policy.weather.temperature}°C
                    </p>
                    <p className="text-neutral-400">
                      {policy.weather.weatherText}
                    </p>
                    {policy.weather.humidity && (
                      <p className="text-sm text-neutral-400">
                        Humidity: {policy.weather.humidity}%
                      </p>
                    )}
                    {policy.weather.precipitation && (
                      <p className="text-sm text-neutral-400">
                        Precipitation: {policy.weather.precipitation}mm
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Weather History Section */}
            {policy.weatherHistory && policy.weatherHistory.length > 0 && (
              <div className="bg-neutral-800 rounded-xl p-4">
                <h3 className="text-lg font-semibold mb-4">Weather History</h3>
                <div className="space-y-4">
                  {policy.weatherHistory.map((record, index) => (
                    <div
                      key={index}
                      className="border-b border-neutral-700 pb-4 last:border-0 last:pb-0"
                    >
                      <p className="text-sm text-neutral-400">
                        {formatDate(record.date)}
                      </p>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <p>Temperature: {record.temperature}°C</p>
                        <p>Humidity: {record.humidity}%</p>
                        <p>Weather: {record.weatherText}</p>
                        <p>Precipitation: {record.precipitation}mm</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Claims Section */}
            {policy.claims && policy.claims.length > 0 && (
              <div className="bg-neutral-800 rounded-xl p-4">
                <h3 className="text-lg font-semibold mb-4">Claims History</h3>
                <div className="space-y-4">
                  {policy.claims.map((claim, index) => (
                    <div
                      key={index}
                      className="border-b border-neutral-700 pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-sm text-neutral-400">
                          {formatDate(claim.date)}
                        </p>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            claim.status === "Approved"
                              ? "bg-green-500/20 text-green-400"
                              : claim.status === "Rejected"
                              ? "bg-red-500/20 text-red-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {claim.status}
                        </span>
                      </div>
                      <p className="mb-2">Amount: {claim.amount} FUSD</p>
                      <p className="text-sm text-neutral-400">
                        Reason: {claim.reason}
                      </p>
                      <div className="mt-2 text-sm text-neutral-400">
                        <p>Weather during claim:</p>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          <p>Temperature: {claim.weatherData.temperature}°C</p>
                          <p>Humidity: {claim.weatherData.humidity}%</p>
                          <p>Weather: {claim.weatherData.weatherText}</p>
                          <p>
                            Precipitation: {claim.weatherData.precipitation}mm
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Policy Period Section */}
            <div className="bg-neutral-800 rounded-xl p-4">
              <h3 className="text-lg font-semibold mb-4">Policy Period</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-neutral-400 mb-1">Start Date</p>
                  <p className="text-lg">{formatDate(policy.startDate)}</p>
                </div>
                <div>
                  <p className="text-neutral-400 mb-1">End Date</p>
                  <p className="text-lg">{formatDate(policy.endDate)}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-neutral-400 mb-1">Last Weather Update</p>
                <p className="text-lg">
                  {formatDate(policy.lastWeatherUpdate)}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-700">
              <button
                onClick={() => setSelectedPolicy(null)}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!currentAccount) {
    return (
      <div className="min-h-screen bg-neutral-800 text-white p-4">
        <div className="max-w-7xl mx-auto rounded-3xl bg-[#1a1a1a] overflow-hidden p-6 md:p-10 text-center">
          <h1 className="text-4xl font-serif mb-4">Connect Wallet</h1>
          <p className="text-neutral-400">
            Please connect your wallet to view your policies.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-800 text-white p-4">
      <div className="max-w-7xl mx-auto rounded-3xl bg-[#1a1a1a] overflow-hidden p-6 md:p-10">
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-serif mb-4">My Policies</h1>
          <p className="text-neutral-400">
            View and manage your insurance policies. Each policy is represented
            as an NFT on the blockchain.
          </p>
        </div>

        {/* Policies Tabs */}
        <div className="mb-10">
          <div className="inline-flex bg-neutral-900 rounded-full p-1 mb-8">
            <button
              className={`px-6 py-3 rounded-full ${
                activeTab === "active"
                  ? "bg-green-600 text-white"
                  : "text-neutral-400"
              }`}
              onClick={() => setActiveTab("active")}
            >
              Active Policies
            </button>
            <button
              className={`px-6 py-3 rounded-full ${
                activeTab === "past"
                  ? "bg-neutral-700 text-white"
                  : "text-neutral-400"
              }`}
              onClick={() => setActiveTab("past")}
            >
              Past Policies
            </button>
          </div>

          {loading ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
              <p className="text-neutral-400">Loading policies...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {policies
                .filter((policy) =>
                  activeTab === "active"
                    ? isPolicyActive(policy.endDate || "")
                    : !isPolicyActive(policy.endDate || "")
                )
                .map((policy) => (
                  <div
                    key={policy._id}
                    className="bg-neutral-900 rounded-3xl overflow-hidden"
                  >
                    <div className="aspect-square relative">
                      <Image
                        src={getTierImage(policy.tier)}
                        alt={`${policy.tier} Policy NFT`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-6">
                        <h3 className="text-2xl font-bold">
                          Policy #{policy.policyId.slice(-4)}
                        </h3>
                        {getStatusBadge(policy.endDate || "")}
                      </div>

                      <div className="space-y-4 mb-6">
                        <div className="bg-neutral-800 rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="h-5 w-5 text-green-400" />
                            <p className="font-medium">
                              {policy.locationInfo?.address}
                            </p>
                          </div>
                          <p className="text-sm text-neutral-400">
                            {policy.location.coordinates[1].toFixed(6)}°N,{" "}
                            {policy.location.coordinates[0].toFixed(6)}°E
                          </p>
                        </div>

                        {policy.weather && (
                          <div className="flex items-center gap-2">
                            <ThermometerSun className="h-5 w-5 text-orange-400" />
                            <p>
                              {policy.weather.temperature}°C -{" "}
                              {policy.weather.weatherText}
                            </p>
                          </div>
                        )}

                        <div>
                          <p className="text-neutral-400 mb-1">Policy Period</p>
                          <p className="text-lg">
                            {formatDate(policy.createdAt)} -{" "}
                            {formatDate(policy.endDate || "")}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <button
                          onClick={() => setSelectedPolicy(policy)}
                          className="flex-1 bg-green-600 text-white py-3 px-4 rounded-full flex items-center justify-center"
                        >
                          <Shield className="h-4 w-4 mr-2" />
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}

          <div className="mt-8 text-center">
            <Link
              href="/buy-insurance"
              className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full"
            >
              <Calendar className="h-5 w-5 mr-2" />
              Buy New Policy
            </Link>
          </div>
        </div>
      </div>

      {selectedPolicy && <PolicyDetails policy={selectedPolicy} />}
    </div>
  );
}
