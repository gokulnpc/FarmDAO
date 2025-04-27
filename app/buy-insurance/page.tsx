"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/app/providers/WalletProvider";
import { InsuranceContract } from "@/app/abi/InsuranceContract";
import { FUSD } from "@/app/abi/FUSD";
import { ethers } from "ethers";
import { toast } from "sonner";

export default function BuyInsurance() {
  const { currentAccount, provider } = useWallet();
  const [selectedPlan, setSelectedPlan] = useState<string>("premium");
  const [coverageAmount, setCoverageAmount] = useState(5000);
  const [premium, setPremium] = useState(250);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [policyId, setPolicyId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePurchase = async () => {
    if (!currentAccount || !provider) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      setIsProcessing(true);

      // Get signer
      const signer = await provider.getSigner();

      // Create contract instances
      const fusdContract = new ethers.Contract(FUSD.address, FUSD.abi, signer);
      const insuranceContract = new ethers.Contract(
        InsuranceContract.address,
        InsuranceContract.abi,
        signer
      );

      // Convert amounts to wei
      const premiumInWei = ethers.parseUnits(premium.toString(), 18);
      const coverageInWei = ethers.parseUnits(coverageAmount.toString(), 18);

      // First approve FUSD transfer
      const approveTx = await fusdContract.approve(
        InsuranceContract.address,
        premiumInWei
      );
      await approveTx.wait();
      toast.success("Premium payment approved");

      // Create policy
      const createPolicyTx = await insuranceContract.createPolicy(
        premiumInWei,
        coverageInWei
      );
      const receipt = await createPolicyTx.wait();

      // Get policy ID from event
      const event = receipt.logs.find(
        (log: any) => log.fragment?.name === "PolicyCreated"
      );

      if (event) {
        const policyIdFromEvent = event.args[0];
        setPolicyId(policyIdFromEvent.toString());
        setShowConfirmation(true);
        toast.success("Policy created successfully!");
      }
    } catch (error: any) {
      console.error("Error purchasing policy:", error);
      toast.error(error.message || "Failed to purchase policy");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCoverageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const coverage = Number.parseInt(e.target.value);
    setCoverageAmount(coverage);
    // Calculate premium (5% of coverage)
    setPremium(Math.round(coverage * 0.05));
  };

  const handlePlanSelect = (plan: string, coverage: number) => {
    setSelectedPlan(plan);
    setCoverageAmount(coverage);
    setPremium(Math.round(coverage * 0.05));
  };

  return (
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
              <Check className="h-12 w-12 text-green-400" />
            </div>
            <h2 className="text-3xl font-bold mb-4">
              Policy Purchased Successfully!
            </h2>
            <p className="text-xl mb-6">Your policy NFT has been minted</p>

            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl mb-8 overflow-hidden">
              <div className="aspect-square max-w-xs mx-auto mb-4 rounded-2xl overflow-hidden p-4">
                <Image
                  src="/digital-farm-assurance.png"
                  alt="Policy NFT"
                  width={300}
                  height={300}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div className="text-left p-6 bg-neutral-800">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-neutral-400">Policy ID</p>
                    <p className="font-medium">{policyId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-400">Coverage</p>
                    <p className="font-medium">
                      {coverageAmount.toLocaleString()} FUSD
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-400">Premium Paid</p>
                    <p className="font-medium">{premium} FUSD</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-400">Status</p>
                    <p className="font-medium text-green-400">Active</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/my-policies"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full"
              >
                View My Policies
              </Link>
              <Link
                href="/dashboard"
                className="bg-neutral-700 hover:bg-neutral-600 text-white px-6 py-3 rounded-full"
              >
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
                      selectedPlan === "basic"
                        ? "border-2 border-green-500 bg-green-900/20"
                        : "border border-neutral-700 hover:border-neutral-600"
                    }`}
                    onClick={() => handlePlanSelect("basic", 2500)}
                  >
                    <div className="text-lg font-bold mb-1">Basic</div>
                    <div className="text-3xl font-bold mb-2">2,500 FUSD</div>
                    <div className="text-sm text-neutral-400">
                      Premium: 125 FUSD
                    </div>
                  </div>

                  <div
                    className={`p-6 rounded-xl cursor-pointer transition-all ${
                      selectedPlan === "standard"
                        ? "border-2 border-green-500 bg-green-900/20"
                        : "border border-neutral-700 hover:border-neutral-600"
                    }`}
                    onClick={() => handlePlanSelect("standard", 5000)}
                  >
                    <div className="text-lg font-bold mb-1">Standard</div>
                    <div className="text-3xl font-bold mb-2">5,000 FUSD</div>
                    <div className="text-sm text-neutral-400">
                      Premium: 250 FUSD
                    </div>
                  </div>

                  <div
                    className={`p-6 rounded-xl cursor-pointer transition-all ${
                      selectedPlan === "premium"
                        ? "border-2 border-green-500 bg-green-900/20"
                        : "border border-neutral-700 hover:border-neutral-600"
                    }`}
                    onClick={() => handlePlanSelect("premium", 10000)}
                  >
                    <div className="text-lg font-bold mb-1">Premium</div>
                    <div className="text-3xl font-bold mb-2">10,000 FUSD</div>
                    <div className="text-sm text-neutral-400">
                      Premium: 500 FUSD
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-neutral-900 rounded-3xl p-6">
                <h2 className="text-2xl font-bold mb-6">Customize Coverage</h2>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <label htmlFor="coverage" className="text-lg">
                        Coverage Amount (FUSD)
                      </label>
                      <span className="font-bold text-lg">
                        {coverageAmount.toLocaleString()} FUSD
                      </span>
                    </div>
                    <input
                      id="coverage"
                      type="range"
                      min="1000"
                      max="20000"
                      step="500"
                      value={coverageAmount}
                      onChange={handleCoverageChange}
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
                      {coverageAmount.toLocaleString()} FUSD
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-400">Premium</span>
                    <span className="font-bold text-lg">{premium} FUSD</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-400">Duration</span>
                    <span className="font-bold text-lg">6 months</span>
                  </div>
                  <div className="pt-4 border-t border-neutral-700">
                    <div className="flex justify-between items-center">
                      <span className="text-lg">Total</span>
                      <span className="font-bold text-xl">{premium} FUSD</span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handlePurchase}
                  disabled={isProcessing || !currentAccount}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl text-lg mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing
                    ? "Processing..."
                    : currentAccount
                    ? "Purchase Policy"
                    : "Connect Wallet to Purchase"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
