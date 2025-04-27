"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Cloud,
  CloudLightning,
  CloudRain,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function AdminOracle() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationSuccess, setSimulationSuccess] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState("drought");
  const [affectedRegion, setAffectedRegion] = useState("midwest");
  const [affectedPolicies, setAffectedPolicies] = useState(0);
  const [totalPayout, setTotalPayout] = useState(0);

  const handleSimulate = () => {
    setIsSimulating(true);

    // Simulate oracle data processing
    setTimeout(() => {
      setIsSimulating(false);
      setSimulationSuccess(true);

      // Set random values for affected policies and payout
      const policies = Math.floor(Math.random() * 10) + 1;
      setAffectedPolicies(policies);
      setTotalPayout(policies * (Math.floor(Math.random() * 5000) + 1000));
    }, 2000);
  };

  const handleReset = () => {
    setSimulationSuccess(false);
  };

  const getEventIcon = () => {
    switch (selectedEvent) {
      case "drought":
        return <Cloud className="h-6 w-6" />;
      case "flood":
        return <CloudRain className="h-6 w-6" />;
      case "hail":
        return <CloudLightning className="h-6 w-6" />;
      default:
        return <Cloud className="h-6 w-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-800 text-white p-4">
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

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="bg-neutral-700 text-white px-6 py-3 rounded-full flex items-center gap-2"
            >
              <div className="animate-spin">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2V6M12 18V22M6 12H2M22 12H18M19.07 4.93L16.24 7.76M7.76 16.24L4.93 19.07M19.07 19.07L16.24 16.24M7.76 7.76L4.93 4.93"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
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
              className="border border-white text-white px-6 py-3 rounded-full"
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
          <h1 className="text-4xl font-serif mb-4">
            Admin / Oracle Simulation
          </h1>
          <p className="text-neutral-400">
            For demonstration purposes only. Simulate weather events to trigger
            insurance payouts.
          </p>
        </div>

        <Alert className="bg-amber-900/20 border border-amber-900/30 text-amber-400 rounded-xl mb-10">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle className="text-amber-400">Demo Environment</AlertTitle>
          <AlertDescription>
            This is a simulation tool for demonstration purposes. In production,
            Chainlink oracles would automatically detect weather events and
            trigger payouts.
          </AlertDescription>
        </Alert>

        <div className="max-w-3xl mx-auto">
          <Card className="bg-neutral-800 border border-neutral-700 rounded-3xl">
            <CardHeader>
              <CardTitle>Simulate Weather Event</CardTitle>
            </CardHeader>
            <CardContent>
              {simulationSuccess ? (
                <div className="text-center py-6">
                  <div className="bg-green-900/20 rounded-xl p-8 mb-6">
                    <div className="text-4xl font-bold mb-2 text-green-400">
                      {affectedPolicies}
                    </div>
                    <div className="text-xl mb-6">Policies Affected</div>
                    <div className="text-4xl font-bold mb-2 text-green-400">
                      {totalPayout.toLocaleString()} FUSD
                    </div>
                    <div className="text-xl">Total Payout Amount</div>
                  </div>

                  <p className="mb-6">
                    The simulated {selectedEvent} event in the {affectedRegion}{" "}
                    region has triggered automatic payouts to affected farmers.
                  </p>

                  <Button
                    onClick={handleReset}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full"
                  >
                    Simulate Another Event
                  </Button>
                </div>
              ) : (
                <div>
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Weather Event Type
                      </label>
                      <Tabs
                        defaultValue="drought"
                        onValueChange={setSelectedEvent}
                        className="w-full"
                      >
                        <TabsList className="bg-neutral-700 p-1 rounded-xl w-full grid grid-cols-3">
                          <TabsTrigger
                            value="drought"
                            className="rounded-lg data-[state=active]:bg-green-600"
                          >
                            Drought
                          </TabsTrigger>
                          <TabsTrigger
                            value="flood"
                            className="rounded-lg data-[state=active]:bg-green-600"
                          >
                            Flood
                          </TabsTrigger>
                          <TabsTrigger
                            value="hail"
                            className="rounded-lg data-[state=active]:bg-green-600"
                          >
                            Hail
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Affected Region
                      </label>
                      <Tabs
                        defaultValue="midwest"
                        onValueChange={setAffectedRegion}
                        className="w-full"
                      >
                        <TabsList className="bg-neutral-700 p-1 rounded-xl w-full grid grid-cols-3">
                          <TabsTrigger
                            value="midwest"
                            className="rounded-lg data-[state=active]:bg-green-600"
                          >
                            Midwest
                          </TabsTrigger>
                          <TabsTrigger
                            value="south"
                            className="rounded-lg data-[state=active]:bg-green-600"
                          >
                            South
                          </TabsTrigger>
                          <TabsTrigger
                            value="west"
                            className="rounded-lg data-[state=active]:bg-green-600"
                          >
                            West
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                  </div>

                  <div className="bg-neutral-700 rounded-xl p-6 mb-6">
                    <div className="flex items-center gap-4 mb-4">
                      {getEventIcon()}
                      <div>
                        <h3 className="text-lg font-bold capitalize">
                          {selectedEvent} Event
                        </h3>
                        <p className="text-sm text-neutral-400 capitalize">
                          {affectedRegion} Region
                        </p>
                      </div>
                    </div>
                    <p className="text-sm">
                      This will simulate a {selectedEvent} event in the{" "}
                      {affectedRegion} region. The oracle will detect the event
                      and automatically trigger payouts to affected farmers
                      based on their policy coverage.
                    </p>
                  </div>

                  <div className="bg-neutral-700/50 rounded-xl p-6 mb-6">
                    <h3 className="text-lg font-bold mb-2">How It Works</h3>
                    <ol className="list-decimal list-inside space-y-2 text-sm">
                      <li>
                        Oracle detects weather event data from multiple sources
                      </li>
                      <li>
                        Smart contract verifies the data against policy
                        conditions
                      </li>
                      <li>
                        If conditions are met, automatic payouts are triggered
                      </li>
                      <li>Farmers receive FUSD directly to their wallets</li>
                      <li>
                        Transaction is recorded on the blockchain for
                        transparency
                      </li>
                    </ol>
                  </div>
                </div>
              )}
            </CardContent>
            {!simulationSuccess && (
              <CardFooter>
                <Button
                  onClick={handleSimulate}
                  disabled={isSimulating}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-6 rounded-xl text-lg"
                >
                  {isSimulating ? (
                    <>
                      <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                      Simulating...
                    </>
                  ) : (
                    "Simulate Weather Event"
                  )}
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
