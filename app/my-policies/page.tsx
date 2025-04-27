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
  };
  createdAt: string;
}

interface WeatherInfo {
  temperature: number;
  weatherText: string;
}

interface PolicyWithWeather extends Policy {
  weather?: WeatherInfo;
  endDate?: string;
}

export default function MyPolicies() {
  const { currentAccount } = useWallet();
  const [activeTab, setActiveTab] = useState("active");
  const [policies, setPolicies] = useState<PolicyWithWeather[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPolicy, setSelectedPolicy] =
    useState<PolicyWithWeather | null>(null);
  const weatherService = new WeatherService();

  useEffect(() => {
    if (currentAccount) {
      fetchPolicies();
    }
  }, [currentAccount]);

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/policies/user?address=${currentAccount}`
      );
      const data = await response.json();

      if (data.success) {
        // Add end date (6 months from creation) and fetch weather for each policy
        const policiesWithDates = await Promise.all(
          data.policies.map(async (policy: Policy) => {
            const startDate = new Date(policy.createdAt);
            const endDate = new Date(startDate);
            endDate.setMonth(endDate.getMonth() + 6);

            // Fetch weather data
            try {
              const weatherData = await weatherService.getWeatherByCoordinates(
                policy.location.coordinates[1], // latitude
                policy.location.coordinates[0] // longitude
              );

              return {
                ...policy,
                endDate: endDate.toISOString(),
                weather: {
                  temperature: weatherData.Temperature.Metric.Value,
                  weatherText: weatherData.WeatherText,
                },
              };
            } catch (error) {
              console.error("Error fetching weather for policy:", error);
              return {
                ...policy,
                endDate: endDate.toISOString(),
              };
            }
          })
        );

        setPolicies(policiesWithDates);
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
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
        <div className="bg-neutral-900 rounded-3xl max-w-2xl w-full p-6 space-y-6">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold">Policy Details</h2>
            <button
              onClick={() => setSelectedPolicy(null)}
              className="text-neutral-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="grid gap-6">
            <div>
              <p className="text-neutral-400 mb-1">Policy ID</p>
              <p className="text-lg font-mono">{policy.policyId}</p>
            </div>

            <div>
              <p className="text-neutral-400 mb-1">Location</p>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-green-400" />
                <p className="text-lg">
                  {policy.location.coordinates[1].toFixed(6)}°N,{" "}
                  {policy.location.coordinates[0].toFixed(6)}°E
                </p>
              </div>
            </div>

            {policy.weather && (
              <div className="bg-neutral-800 rounded-xl p-4">
                <p className="text-neutral-400 mb-2">Current Weather</p>
                <div className="flex items-center gap-4">
                  <ThermometerSun className="h-8 w-8 text-orange-400" />
                  <div>
                    <p className="text-xl font-bold">
                      {policy.weather.temperature}°C
                    </p>
                    <p className="text-neutral-400">
                      {policy.weather.weatherText}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-neutral-400 mb-1">Start Date</p>
                <p className="text-lg">{formatDate(policy.createdAt)}</p>
              </div>
              <div>
                <p className="text-neutral-400 mb-1">End Date</p>
                <p className="text-lg">{formatDate(policy.endDate || "")}</p>
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
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-6">
                        <h3 className="text-2xl font-bold">
                          Policy #{policy.policyId.slice(-4)}
                        </h3>
                        {getStatusBadge(policy.endDate || "")}
                      </div>

                      <div className="space-y-4 mb-6">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-green-400" />
                          <p>
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
