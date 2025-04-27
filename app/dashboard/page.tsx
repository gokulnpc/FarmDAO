"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Bell, Facebook, Instagram, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function Dashboard() {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  const connectWallet = () => {
    // Simulate wallet connection
    setIsConnected(true);
    setWalletAddress("0x71C7656EC7ab88b098defB751B7401B5f6d8976F");
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

        {isConnected ? (
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
                  <div className="text-4xl font-bold">1,250.00</div>
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
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
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 rounded-full text-lg"
            >
              Connect Wallet
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
