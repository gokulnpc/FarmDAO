"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, ExternalLink, Shield } from "lucide-react";

export default function MyPolicies() {
  const [activeTab, setActiveTab] = useState("active");

  const activePolicies = [
    {
      id: "FARM-1234-2025",
      number: "1234",
      coverage: 5000,
      premium: 250,
      startDate: "2025-01-15",
      endDate: "2025-07-15",
      status: "Active",
      nftUrl: "/digital-farm-assurance.png",
    },
    {
      id: "FARM-5678-2025",
      number: "5678",
      coverage: 10000,
      premium: 500,
      startDate: "2025-02-28",
      endDate: "2025-08-31",
      status: "Active",
      nftUrl: "/farm-insurance-nft.png",
    },
  ];

  const pastPolicies = [
    {
      id: "FARM-9012-2024",
      number: "9012",
      coverage: 2500,
      premium: 125,
      startDate: "2024-07-01",
      endDate: "2024-12-31",
      status: "Expired",
      nftUrl: "/blockchain-farm-insurance-nft.png",
    },
    {
      id: "FARM-3456-2024",
      number: "3456",
      coverage: 7500,
      premium: 375,
      startDate: "2024-04-15",
      endDate: "2024-10-15",
      status: "Paid Out",
      payout: 7500,
      nftUrl: "/blockchain-farm-insurance-nft.png",
    },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return (
          <div className="bg-green-900/50 text-green-400 px-3 py-1 rounded-full text-sm">
            Active
          </div>
        );
      case "Expired":
        return (
          <div className="bg-neutral-700/50 text-neutral-400 px-3 py-1 rounded-full text-sm">
            Expired
          </div>
        );
      case "Paid Out":
        return (
          <div className="bg-orange-900/50 text-orange-400 px-3 py-1 rounded-full text-sm">
            Paid Out
          </div>
        );
      default:
        return (
          <div className="bg-neutral-700/50 text-neutral-400 px-3 py-1 rounded-full text-sm">
            {status}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-neutral-800 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto rounded-3xl bg-[#1a1a1a] overflow-hidden p-6 md:p-10">
        {/* Navigation */}
        <nav className="flex flex-wrap items-center justify-between gap-4 mb-16">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center">
              <div className="text-white font-semibold text-xl flex items-center">
                <div className="w-8 h-8 mr-2">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M3 9H7V21H3V9Z" fill="white" />
                    <path d="M10 3H21V7H10V3Z" fill="white" />
                    <path d="M10 10H21V21H17V14H10V10Z" fill="white" />
                  </svg>
                </div>
                FarmDAO
              </div>
            </Link>
            <div className="bg-neutral-700 text-neutral-400 px-4 py-2 rounded-full text-xs">
              DEFI
              <br />
              INSURANCE
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="bg-neutral-700 text-white px-6 py-3 rounded-full"
            >
              Dashboard
            </Link>
            <Link
              href="/buy-insurance"
              className="border border-white text-white px-6 py-3 rounded-full"
            >
              Buy Insurance
            </Link>
            <Link
              href="/my-policies"
              className="bg-green-600 text-white px-6 py-3 rounded-full"
            >
              My Policies
            </Link>
            <Link
              href="/dispute-center"
              className="border border-white text-white px-6 py-3 rounded-full"
            >
              Dispute Center
            </Link>
          </div>
        </nav>

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

          {activeTab === "active" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activePolicies.map((policy) => (
                <div
                  key={policy.id}
                  className="bg-neutral-900 rounded-3xl overflow-hidden"
                >
                  <div className="grid md:grid-cols-2">
                    <div className="aspect-square">
                      <Image
                        src={policy.nftUrl || "/placeholder.svg"}
                        alt={`Policy ${policy.id}`}
                        width={400}
                        height={400}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-6">
                        <h3 className="text-2xl font-bold">
                          Policy #{policy.number}
                        </h3>
                        {getStatusBadge(policy.status)}
                      </div>

                      <div className="space-y-4 mb-6">
                        <div>
                          <p className="text-neutral-400 mb-1">
                            Coverage Amount
                          </p>
                          <p className="text-xl font-bold">
                            {policy.coverage.toLocaleString()} FUSD
                          </p>
                        </div>
                        <div>
                          <p className="text-neutral-400 mb-1">Premium Paid</p>
                          <p className="text-lg">{policy.premium} FUSD</p>
                        </div>
                        <div>
                          <p className="text-neutral-400 mb-1">Policy Period</p>
                          <p className="text-lg">
                            {formatDate(policy.startDate)} -{" "}
                            {formatDate(policy.endDate)}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <button className="flex-1 bg-white text-black py-3 px-4 rounded-full flex items-center justify-center">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View NFT
                        </button>
                        <button className="flex-1 bg-green-600 text-white py-3 px-4 rounded-full flex items-center justify-center">
                          <Shield className="h-4 w-4 mr-2" />
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pastPolicies.map((policy) => (
                <div
                  key={policy.id}
                  className="bg-neutral-900 rounded-3xl overflow-hidden"
                >
                  <div className="grid md:grid-cols-2">
                    <div className="aspect-square">
                      <Image
                        src={policy.nftUrl || "/placeholder.svg"}
                        alt={`Policy ${policy.id}`}
                        width={400}
                        height={400}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-6">
                        <h3 className="text-2xl font-bold">
                          Policy #{policy.number}
                        </h3>
                        {getStatusBadge(policy.status)}
                      </div>

                      <div className="space-y-4 mb-6">
                        <div>
                          <p className="text-neutral-400 mb-1">
                            Coverage Amount
                          </p>
                          <p className="text-xl font-bold">
                            {policy.coverage.toLocaleString()} FUSD
                          </p>
                        </div>
                        <div>
                          <p className="text-neutral-400 mb-1">Premium Paid</p>
                          <p className="text-lg">{policy.premium} FUSD</p>
                        </div>
                        <div>
                          <p className="text-neutral-400 mb-1">Policy Period</p>
                          <p className="text-lg">
                            {formatDate(policy.startDate)} -{" "}
                            {formatDate(policy.endDate)}
                          </p>
                        </div>
                        {policy.payout && (
                          <div>
                            <p className="text-neutral-400 mb-1">
                              Payout Amount
                            </p>
                            <p className="text-xl font-bold text-orange-400">
                              {policy.payout.toLocaleString()} FUSD
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-4">
                        <button className="flex-1 bg-white text-black py-3 px-4 rounded-full flex items-center justify-center">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View NFT
                        </button>
                        <button className="flex-1 bg-neutral-700 text-white py-3 px-4 rounded-full flex items-center justify-center">
                          <Shield className="h-4 w-4 mr-2" />
                          Details
                        </button>
                      </div>
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
    </div>
  );
}
