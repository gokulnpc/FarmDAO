"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Clock,
  Facebook,
  Instagram,
  ThumbsDown,
  ThumbsUp,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DisputeCenter() {
  const [disputes, setDisputes] = useState([
    {
      id: "DISP-1234",
      policyId: "FARM-5678-2025",
      farmer: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
      description: "Drought damage claim disputed by oracle data inconsistency",
      requestedAmount: 7500,
      votesFor: 65,
      votesAgainst: 35,
      timeRemaining: "23 hours",
      status: "Active",
    },
    {
      id: "DISP-5678",
      policyId: "FARM-9012-2024",
      farmer: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
      description:
        "Flood damage claim disputed due to policy coverage limitations",
      requestedAmount: 5000,
      votesFor: 48,
      votesAgainst: 52,
      timeRemaining: "12 hours",
      status: "Active",
    },
    {
      id: "DISP-9012",
      policyId: "FARM-3456-2024",
      farmer: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
      description: "Hail damage claim disputed by insufficient evidence",
      requestedAmount: 3500,
      votesFor: 75,
      votesAgainst: 25,
      timeRemaining: "Ended",
      status: "Approved",
    },
  ]);

  const [userStake, setUserStake] = useState(50);

  const handleVote = (disputeId: string, voteType: "for" | "against") => {
    setDisputes(
      disputes.map((dispute) => {
        if (dispute.id === disputeId) {
          if (voteType === "for") {
            return {
              ...dispute,
              votesFor: dispute.votesFor + 5,
              votesAgainst: dispute.votesAgainst - 5,
            };
          } else {
            return {
              ...dispute,
              votesFor: dispute.votesFor - 5,
              votesAgainst: dispute.votesAgainst + 5,
            };
          }
        }
        return dispute;
      })
    );
  };

  return (
    <div className="min-h-screen bg-neutral-800 text-white p-4">
      <div className="max-w-7xl mx-auto rounded-3xl bg-[#1a1a1a] overflow-hidden p-6 md:p-10">
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-serif mb-4">Dispute Center</h1>
          <p className="text-neutral-400">
            Vote on open disputes using your staked FDAO tokens. Help ensure
            fair outcomes for all farmers.
          </p>
        </div>

        {/* Staking Info */}
        <Card className="bg-green-900/20 border border-green-900/30 rounded-3xl mb-10">
          <CardContent className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold mb-2">Your Voting Power</h3>
                <p className="text-green-400 mb-1">
                  <span className="text-2xl font-bold">{userStake} FDAO</span>{" "}
                  staked for voting
                </p>
                <p className="text-sm text-neutral-300">
                  Stake more FDAO tokens to increase your voting influence
                </p>
              </div>
              <Button className="bg-green-600 hover:bg-green-700 text-white rounded-full">
                Stake More FDAO
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Open Disputes */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Open Disputes</h2>
        </div>

        <div className="space-y-6">
          {disputes.map((dispute) => (
            <div
              key={dispute.id}
              className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold">Dispute {dispute.id}</h3>
                  <p className="text-neutral-400">Policy {dispute.policyId}</p>
                </div>
                <Badge className="bg-blue-500/20 text-blue-400 text-sm px-3 py-1">
                  {dispute.status}
                </Badge>
              </div>

              <p className="text-lg mb-6">{dispute.description}</p>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Farmer</span>
                    <span>
                      {dispute.farmer.substring(0, 6)}...
                      {dispute.farmer.substring(dispute.farmer.length - 4)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-neutral-400">Requested Amount</span>
                    <span className="font-bold">
                      {dispute.requestedAmount.toLocaleString()} FUSD
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-neutral-400">Time Remaining</span>
                    <span className="flex items-center text-orange-400">
                      <Clock className="h-4 w-4 mr-2" />
                      {dispute.timeRemaining}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="mb-4">
                    <div className="flex justify-between mb-2">
                      <span>Current Vote</span>
                      <span>
                        {dispute.votesFor}% Approve / {dispute.votesAgainst}%
                        Reject
                      </span>
                    </div>
                    <div className="h-2 bg-red-900/30 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${dispute.votesFor}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      onClick={() => handleVote(dispute.id, "for")}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl py-4"
                    >
                      <ThumbsUp className="h-5 w-5 mr-2" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleVote(dispute.id, "against")}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl py-4"
                    >
                      <ThumbsDown className="h-5 w-5 mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-800">
                <Link
                  href="#"
                  className="text-neutral-400 hover:text-white flex items-center"
                >
                  View evidence and oracle data
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
