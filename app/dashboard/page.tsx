"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Bell,
  Facebook,
  Instagram,
  Wallet,
  Building2,
  CreditCard,
  X,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useWallet } from "@/app/providers/WalletProvider";
import { FUSD } from "@/app/abi/FUSD";
import { ethers } from "ethers";
import { toast } from "sonner";

export default function Dashboard() {
  const { currentAccount, connectWallet, isLoading, provider } = useWallet();
  const [fusdBalance, setFusdBalance] = useState<string>("0");
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [buyStep, setBuyStep] = useState(0);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    const fetchFUSDBalance = async () => {
      if (provider && currentAccount) {
        try {
          const contract = new ethers.Contract(
            FUSD.address,
            FUSD.abi,
            provider
          );
          const balance = await contract.balanceOf(currentAccount);
          // Convert from wei to FUSD (assuming 18 decimals)
          const formattedBalance = ethers.formatUnits(balance, 18);
          setFusdBalance(formattedBalance);
        } catch (error) {
          console.error("Error fetching FUSD balance:", error);
        }
      }
    };

    fetchFUSDBalance();
  }, [provider, currentAccount]);

  const handleBuyFUSD = () => {
    setShowBuyModal(true);
    setBuyStep(0);
  };

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setBuyStep(1);
  };

  const mintFUSD = async (amount: number) => {
    try {
      if (!currentAccount || !provider) return;

      setProcessingPayment(true);

      // Create admin wallet from private key
      const adminWallet = new ethers.Wallet(
        "0c6aaedebed8f32db344a74f5fda724c42a1b7053450ebfecd29ba0e0922dd6b",
        provider
      );

      // Create contract instance with admin signer
      const contract = new ethers.Contract(FUSD.address, FUSD.abi, adminWallet);

      // Convert amount to wei (18 decimals)
      const amountInWei = ethers.parseUnits(amount.toString(), 18);

      // Mint FUSD tokens
      const tx = await contract.mint(currentAccount, amountInWei);
      await tx.wait();

      // Update balance after minting
      const newBalance = await contract.balanceOf(currentAccount);
      setFusdBalance(ethers.formatUnits(newBalance, 18));

      setBuyStep(2);
      toast.success("FUSD minted successfully!");

      // Auto close after success
      setTimeout(() => {
        setShowBuyModal(false);
        setBuyStep(0);
        setSelectedAmount(null);
      }, 3000);
    } catch (error) {
      console.error("Error minting FUSD:", error);
      toast.error("Failed to mint FUSD. Please try again.");
    } finally {
      setProcessingPayment(false);
    }
  };

  const simulatePayment = async () => {
    if (!selectedAmount) return;
    await mintFUSD(selectedAmount);
  };

  const BuyFUSDModal = () => {
    if (!showBuyModal) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-[#1a1a1a] rounded-3xl p-8 max-w-md w-full mx-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Buy FUSD</h2>
            <button
              onClick={() => setShowBuyModal(false)}
              className="text-neutral-400 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>

          {buyStep === 0 && (
            <div className="space-y-4">
              <p className="text-neutral-400 mb-6">Select amount to buy:</p>
              {[100, 500, 1000, 5000].map((amount) => (
                <button
                  key={amount}
                  onClick={() => handleAmountSelect(amount)}
                  className="w-full bg-neutral-700 hover:bg-neutral-600 p-4 rounded-xl flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-green-900 p-2 rounded-lg">
                      <CreditCard className="h-6 w-6 text-green-400" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">{amount} FUSD</div>
                      <div className="text-sm text-neutral-400">
                        ${amount}.00 USD
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-green-400 transform group-hover:translate-x-1 transition-transform" />
                </button>
              ))}
            </div>
          )}

          {buyStep === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="bg-neutral-700 rounded-full p-4 inline-block mb-4">
                  <Building2 className="h-8 w-8 text-green-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Connect Bank Account</h3>
                <p className="text-neutral-400 mb-6">
                  Securely connect your bank account to purchase{" "}
                  {selectedAmount} FUSD
                </p>
              </div>
              <button
                onClick={simulatePayment}
                disabled={processingPayment}
                className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed py-4 rounded-xl font-medium transition-colors"
              >
                {processingPayment ? "Processing..." : "Connect Bank & Pay"}
              </button>
            </div>
          )}

          {buyStep === 2 && (
            <div className="text-center">
              <div className="bg-green-900 rounded-full p-4 inline-block mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Purchase Successful!</h3>
              <p className="text-neutral-400">
                You have successfully purchased {selectedAmount} FUSD
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-neutral-800 text-white p-4">
      <div className="max-w-7xl mx-auto rounded-3xl bg-[#1a1a1a] overflow-hidden p-6 md:p-10">
        {/* Dashboard Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-serif mb-4">Dashboard</h1>
          <p className="text-neutral-400">
            Welcome to your FarmDAO dashboard. Manage your insurance policies
            and tokens.
          </p>
        </div>

        {currentAccount ? (
          <>
            {/* Token Balances */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              <Card className="bg-green-200 text-green-900 rounded-3xl border-0">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>FUSD Balance</span>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="M8 12H16M12 8V16"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">
                    {Number(fusdBalance).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                  <div className="text-sm mt-2">
                    Stablecoin for insurance premiums
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-neutral-700 text-white rounded-3xl border-0">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>FDAO Balance</span>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="M15 9.5C15 8.12 13.88 7 12.5 7H10V12H12.5C13.88 12 15 10.88 15 9.5Z"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="M10 12H12.5C13.88 12 15 13.12 15 14.5C15 15.88 13.88 17 12.5 17H10V12Z"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">75.50</div>
                  <div className="text-sm mt-2">
                    Governance token for voting rights
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-green-900 text-white rounded-3xl border-0">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Policy Status</span>
                    <Bell className="h-6 w-6" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">Active</div>
                  <div className="text-sm mb-2">Coverage: 5,000 FUSD</div>
                  <div className="text-sm mb-3">Expires in 45 days</div>
                  <Progress
                    value={62}
                    className="h-2 bg-green-800"
                    indicatorClassName="bg-green-400"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-10">
              <button
                onClick={handleBuyFUSD}
                className="bg-green-900 hover:bg-green-800 transition-colors rounded-3xl p-6 flex items-center justify-between"
              >
                <div>
                  <h3 className="text-xl font-bold mb-2">Buy FUSD</h3>
                  <p className="text-sm text-neutral-400">
                    Purchase FUSD with fiat
                  </p>
                </div>
                <CreditCard className="h-6 w-6 text-green-400" />
              </button>

              <Link
                href="/buy-insurance"
                className="bg-neutral-700 hover:bg-neutral-600 transition-colors rounded-3xl p-6 flex items-center justify-between"
              >
                <div>
                  <h3 className="text-xl font-bold mb-2">Buy Insurance</h3>
                  <p className="text-sm text-neutral-400">
                    Protect your crops from weather events
                  </p>
                </div>
                <ArrowRight className="h-6 w-6 text-green-400" />
              </Link>

              <Link
                href="/my-policies"
                className="bg-neutral-700 hover:bg-neutral-600 transition-colors rounded-3xl p-6 flex items-center justify-between"
              >
                <div>
                  <h3 className="text-xl font-bold mb-2">My Policies</h3>
                  <p className="text-sm text-neutral-400">
                    View your active and past policies
                  </p>
                </div>
                <ArrowRight className="h-6 w-6 text-green-400" />
              </Link>

              <Link
                href="/dispute-center"
                className="bg-neutral-700 hover:bg-neutral-600 transition-colors rounded-3xl p-6 flex items-center justify-between"
              >
                <div>
                  <h3 className="text-xl font-bold mb-2">Dispute Center</h3>
                  <p className="text-sm text-neutral-400">
                    Vote on open disputes
                  </p>
                </div>
                <ArrowRight className="h-6 w-6 text-green-400" />
              </Link>

              <Link
                href="/redeem"
                className="bg-neutral-700 hover:bg-neutral-600 transition-colors rounded-3xl p-6 flex items-center justify-between"
              >
                <div>
                  <h3 className="text-xl font-bold mb-2">Redeem FDAO</h3>
                  <p className="text-sm text-neutral-400">
                    Convert FDAO tokens to FUSD
                  </p>
                </div>
                <ArrowRight className="h-6 w-6 text-green-400" />
              </Link>
            </div>

            {/* Recent Activity */}
            <Card className="bg-neutral-800 text-white rounded-3xl border border-neutral-700">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-neutral-700 rounded-xl">
                    <div>
                      <div className="font-medium">Policy #1234 Purchased</div>
                      <div className="text-sm text-neutral-400">
                        Premium: 250 FUSD • Coverage: 5,000 FUSD
                      </div>
                    </div>
                    <div className="text-sm text-neutral-400">2 days ago</div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-neutral-700 rounded-xl">
                    <div>
                      <div className="font-medium">FDAO Staked</div>
                      <div className="text-sm text-neutral-400">
                        Amount: 25 FDAO
                      </div>
                    </div>
                    <div className="text-sm text-neutral-400">5 days ago</div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-neutral-700 rounded-xl">
                    <div>
                      <div className="font-medium">FUSD Deposited</div>
                      <div className="text-sm text-neutral-400">
                        Amount: 1,500 FUSD
                      </div>
                    </div>
                    <div className="text-sm text-neutral-400">1 week ago</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="mb-6">
              <Image
                src="/secure-digital-wallet.png"
                alt="Connect Wallet"
                width={120}
                height={120}
                className="mx-auto"
              />
            </div>
            <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
            <p className="text-neutral-400 max-w-md mx-auto mb-8">
              Connect your wallet to access your dashboard, view your policies,
              and manage your tokens.
            </p>
            <Button
              onClick={connectWallet}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 rounded-full text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <span className="animate-spin">
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </span>
                  Connecting...
                </div>
              ) : (
                "Connect Wallet"
              )}
            </Button>
          </div>
        )}
      </div>
      <BuyFUSDModal />
    </div>
  );
}
