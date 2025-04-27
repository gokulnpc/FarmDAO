"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Check, RefreshCw } from "lucide-react";
import { useWallet } from "@/app/providers/WalletProvider";
import { FDAO } from "@/app/abi/FDAO";
import { ethers } from "ethers";
import { toast } from "sonner";

export default function Redeem() {
  const { currentAccount, provider } = useWallet();
  const [fdaoAmount, setFdaoAmount] = useState<string>("0");
  const [fusdAmount, setFusdAmount] = useState<string>("0");
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");
  const [availableFdao, setAvailableFdao] = useState<string>("0");

  useEffect(() => {
    const fetchFdaoBalance = async () => {
      if (provider && currentAccount) {
        try {
          const fdaoContract = new ethers.Contract(
            FDAO.address,
            FDAO.abi,
            provider
          );
          const balance = await fdaoContract.balanceOf(currentAccount);
          console.log("FDAO Balance", balance);
          const balanceInEther = ethers.formatUnits(balance, 0);
          console.log("FDAO Balance in Ether", balanceInEther);
          setAvailableFdao(balanceInEther);
        } catch (error) {
          console.error("Error fetching FDAO balance:", error);
          toast.error("Failed to fetch FDAO balance");
        }
      }
    };

    fetchFdaoBalance();
  }, [provider, currentAccount]);

  const handleFdaoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFdaoAmount(value);
    // Calculate FUSD amount (50 FDAO = 1 FUSD)
    const fdaoValue = Number.parseFloat(value) || 0;
    const fusd = fdaoValue / 50;
    setFusdAmount(fusd.toString());
  };

  const validateAmount = (amount: number): string | null => {
    if (amount < 50) {
      return "Must redeem at least 50 FDAO";
    }
    if (amount % 50 !== 0) {
      return "Amount must be divisible by 50";
    }
    if (amount > Number(availableFdao)) {
      return "Insufficient FDAO balance";
    }
    return null;
  };

  const handleRedeem = async () => {
    console.log("handleRedeem");
    if (!currentAccount || !provider) {
      toast.error("Please connect your wallet first");
      return;
    }

    const fdaoValue = Number(fdaoAmount);
    console.log("fdaoValue", fdaoValue);
    const validationError = validateAmount(fdaoValue);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsRedeeming(true);
    console.log("redeeming");

    try {
      const signer = await provider.getSigner();
      const fdaoContract = new ethers.Contract(FDAO.address, FDAO.abi, signer);

      const amountInWei = ethers.parseUnits(fdaoAmount, 0);
      console.log("amountInWei", amountInWei);
      const tx = await fdaoContract.redeemForFUSD(amountInWei);
      const receipt = await tx.wait();

      setTransactionHash(receipt.hash);
      setIsSuccess(true);
      toast.success("Successfully redeemed FDAO for FUSD!");
    } catch (error: any) {
      console.error("Error redeeming FDAO:", error);
      toast.error(error.message || "Failed to redeem FDAO");
    } finally {
      setIsRedeeming(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setFdaoAmount("0");
    setFusdAmount("0");
    setTransactionHash("");
  };

  return (
    <div className="min-h-screen bg-neutral-800 text-white p-4">
      <div className="max-w-7xl mx-auto rounded-3xl bg-[#1a1a1a] overflow-hidden p-6 md:p-10">
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-serif mb-4">Redeem FDAO</h1>
          <p className="text-neutral-400">
            Convert your FDAO governance tokens to FUSD stablecoins. Minimum
            redemption is 50 FDAO.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {!currentAccount ? (
            <div className="text-center py-10">
              <p className="text-xl mb-4">
                Please connect your wallet to redeem FDAO
              </p>
            </div>
          ) : isSuccess ? (
            <div className="bg-neutral-900 rounded-3xl p-8 text-center">
              <div className="bg-green-900/20 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <Check className="h-12 w-12 text-green-400" />
              </div>
              <h2 className="text-3xl font-bold mb-4">
                Redemption Successful!
              </h2>
              <p className="text-xl mb-6">
                You have successfully redeemed{" "}
                <span className="text-green-400 font-bold">
                  {fdaoAmount} FDAO
                </span>{" "}
                for{" "}
                <span className="text-green-400 font-bold">
                  {fusdAmount} FUSD
                </span>
              </p>

              <div className="bg-neutral-800 rounded-xl p-4 mb-8 max-w-md mx-auto">
                <p className="text-sm text-neutral-400 mb-2">
                  Transaction Hash
                </p>
                <p className="font-mono text-sm break-all">{transactionHash}</p>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={handleReset}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full"
                >
                  Redeem More
                </button>
                <Link
                  href="/dashboard"
                  className="bg-neutral-700 hover:bg-neutral-600 text-white px-6 py-3 rounded-full inline-flex items-center"
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-neutral-900 rounded-3xl p-8">
              <h2 className="text-2xl font-bold mb-8">Redeem FDAO for FUSD</h2>

              <div className="space-y-8">
                <div>
                  <label htmlFor="fdao-amount" className="block text-xl mb-3">
                    FDAO Amount (minimum 50)
                  </label>
                  <div className="relative">
                    <input
                      id="fdao-amount"
                      type="number"
                      value={fdaoAmount}
                      onChange={handleFdaoChange}
                      min="50"
                      step="50"
                      className="w-full bg-neutral-800 border-0 rounded-xl p-4 text-xl h-16"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 text-neutral-400 text-xl">
                      FDAO
                    </div>
                  </div>
                  <p className="text-neutral-400 mt-2">
                    Available:{" "}
                    {Number(availableFdao).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    FDAO
                  </p>
                </div>

                <div className="flex justify-center my-6">
                  <div className="bg-neutral-700 p-4 rounded-full">
                    <ArrowRight className="h-6 w-6 text-neutral-400" />
                  </div>
                </div>

                <div>
                  <label htmlFor="fusd-amount" className="block text-xl mb-3">
                    FUSD Amount (Estimated)
                  </label>
                  <div className="relative">
                    <input
                      id="fusd-amount"
                      type="number"
                      value={fusdAmount}
                      disabled
                      className="w-full bg-neutral-800 border-0 rounded-xl p-4 text-xl h-16"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 text-neutral-400 text-xl">
                      FUSD
                    </div>
                  </div>
                  <p className="text-neutral-400 mt-2">
                    Exchange Rate: 50 FDAO = 1 FUSD
                  </p>
                </div>
              </div>

              <div className="mt-10">
                <button
                  onClick={handleRedeem}
                  disabled={
                    isRedeeming ||
                    Number(fdaoAmount) < 50 ||
                    Number(fdaoAmount) % 50 !== 0
                  }
                  className={`w-full bg-green-600 hover:bg-green-700 text-white text-xl py-4 rounded-xl ${
                    isRedeeming ||
                    Number(fdaoAmount) < 50 ||
                    Number(fdaoAmount) % 50 !== 0
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {isRedeeming ? (
                    <>
                      <RefreshCw className="h-5 w-5 mr-2 inline-block animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Redeem FDAO"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
