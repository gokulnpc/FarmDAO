"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ethers } from "ethers";
import { useWallet } from "@/app/providers/WalletProvider";
import { DisputeManager } from "@/app/abi/DisputeManager";
import { FDAO } from "@/app/abi/FDAO";
import { toast } from "sonner";
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
import { Input } from "@/components/ui/input";
import { GovernanceDAO } from "@/app/abi/GovernanceDAO";

interface Dispute {
  id: string;
  disputeId: string;
  policyId: string;
  farmer?: string;
  creator: string;
  description?: string;
  requestedAmount?: number;
  votesFor: number;
  votesAgainst: number;
  timeRemaining?: string;
  status: "Active" | "Approved" | "Rejected";
  startTime: number;
}

export default function DisputeCenter() {
  const { currentAccount, provider } = useWallet();
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [userStake, setUserStake] = useState(50);
  const [isLoading, setIsLoading] = useState(false);
  const [newPolicyId, setNewPolicyId] = useState("");

  const createDispute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!provider) {
      toast.error("Please connect your wallet");
      return;
    }

    if (!newPolicyId) {
      toast.error("Please enter a policy ID");
      return;
    }

    try {
      setIsLoading(true);
      const signer = await provider.getSigner();
      const signerAddress = await signer.getAddress();
      console.log("Signer Address:", signerAddress);

      // First, call DisputeManager to initiate the dispute
      const disputeManager = new ethers.Contract(
        DisputeManager.address,
        DisputeManager.abi,
        signer
      );

      // Also get reference to GovernanceDAO to listen for its events
      const governanceDAO = new ethers.Contract(
        GovernanceDAO.address,
        GovernanceDAO.abi,
        provider
      );

      console.log("Creating dispute for policy:", newPolicyId);

      // Call initiateDispute on DisputeManager
      const tx = await disputeManager.initiateDispute(newPolicyId, {
        gasLimit: 1000000,
      });

      console.log("Dispute initiation transaction sent:", tx.hash);
      const receipt = await tx.wait();
      console.log("Dispute initiation receipt:", receipt);

      // Find DisputeInitiated event from DisputeManager
      const initiatedEvent = receipt.logs.find(
        (log: any) => log.eventName === "DisputeInitiated"
      );

      if (!initiatedEvent) {
        throw new Error("DisputeInitiated event not found");
      }

      // Wait for a few blocks to ensure the GovernanceDAO has processed the dispute
      await new Promise((resolve) => setTimeout(resolve, 5000));

      // Get the latest dispute ID from GovernanceDAO
      const disputeCount = await governanceDAO.disputeCount();
      const latestDisputeId = (disputeCount - BigInt(1)).toString();

      // Verify the dispute exists and matches our policy ID
      const disputeData = await governanceDAO.disputes(latestDisputeId);
      console.log("Created dispute data:", disputeData);

      if (disputeData.policyId.toString() !== newPolicyId) {
        throw new Error("Created dispute does not match policy ID");
      }

      // Store in MongoDB with the correct dispute ID
      const response = await fetch("/api/disputes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          disputeId: latestDisputeId,
          policyId: newPolicyId,
          creator: signerAddress,
          startTime: Math.floor(Date.now() / 1000),
          status: "Active",
          votesFor: 0,
          votesAgainst: 0,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to store dispute in database");
      }

      toast.success("Dispute created successfully!");
      setNewPolicyId(""); // Clear input
      fetchDisputes();
    } catch (error: any) {
      console.error("Error creating dispute:", error);
      let errorMessage = "Failed to create dispute";

      if (error.reason) {
        errorMessage = error.reason;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(`Dispute creation failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVote = async (dispute: Dispute, approve: boolean) => {
    if (!provider) {
      toast.error("Please connect your wallet");
      return;
    }

    try {
      setIsLoading(true);
      const signer = await provider.getSigner();
      const signerAddress = await signer.getAddress();
      console.log("Signer Address:", signerAddress);

      const governanceDAO = new ethers.Contract(
        GovernanceDAO.address,
        GovernanceDAO.abi,
        signer
      );
      const fdaoToken = new ethers.Contract(FDAO.address, FDAO.abi, signer);

      // Get dispute ID from the dispute object
      const disputeId = dispute.disputeId;

      // Check if dispute exists and get its data
      const disputeData = await governanceDAO.disputes(disputeId);
      console.log("Dispute data:", disputeData);

      // Check if dispute is resolved
      if (disputeData.resolved) {
        toast.error("This dispute has already been resolved");
        return;
      }

      // Check if voting period has ended
      const votingPeriod = await governanceDAO.VOTING_PERIOD();
      const currentTime = Math.floor(Date.now() / 1000);
      if (currentTime > disputeData.startTime + votingPeriod) {
        toast.error("Voting period has ended for this dispute");
        return;
      }

      // Check if user has already voted
      const hasVoted = await governanceDAO
        .disputes(disputeId)
        .then((d: any) => d.hasVoted && d.hasVoted[signerAddress]);
      if (hasVoted) {
        toast.error("You have already voted on this dispute");
        return;
      }

      // FDAO has 18 decimals, minimum stake is 100 FDAO
      const stakeAmount = ethers.parseUnits("100", 0);

      // Check FDAO balance
      const fdaoBalance = await fdaoToken.balanceOf(signerAddress);
      console.log("FDAO Balance:", ethers.formatUnits(fdaoBalance, 0), "FDAO");

      if (fdaoBalance < stakeAmount) {
        console.log("Insufficient FDAO balance");
        toast.error(
          "Insufficient FDAO balance. You need at least 100 FDAO to vote."
        );
        return;
      }

      // Check current allowance
      const currentAllowance = await fdaoToken.allowance(
        signerAddress,
        GovernanceDAO.address
      );

      // If allowance is insufficient, request approval
      if (currentAllowance < stakeAmount) {
        console.log("Requesting FDAO approval...");
        const approveTx = await fdaoToken.approve(
          GovernanceDAO.address,
          stakeAmount,
          {
            gasLimit: 100000,
          }
        );
        const approvalReceipt = await approveTx.wait();
        if (approvalReceipt.status === 0) {
          throw new Error("FDAO approval failed");
        }
        console.log("FDAO approved successfully");
      }

      console.log("Voting parameters:", {
        disputeId,
        approve,
        stakeAmount: stakeAmount,
        voter: signerAddress,
      });

      // Cast vote using GovernanceDAO contract
      const voteTx = await governanceDAO.vote(disputeId, approve, stakeAmount);

      console.log("Vote transaction sent:", voteTx.hash);
      const receipt = await voteTx.wait();
      console.log("Vote transaction receipt:", receipt);

      // Check transaction status
      if (receipt.status === 0) {
        throw new Error("Transaction failed");
      }

      // Check for VoteCast event
      const voteCastEvent = receipt.logs.find(
        (log: any) => log.eventName === "VoteCast"
      );

      if (voteCastEvent) {
        // Get updated vote counts from contract
        const updatedDisputeData = await governanceDAO.disputes(disputeId);
        const approvalVotes = updatedDisputeData.approvalVotes;
        const rejectionVotes = updatedDisputeData.rejectionVotes;

        // Update MongoDB with new vote counts and voter
        const response = await fetch(`/api/disputes/${disputeId}/`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            votesFor: Number(approvalVotes),
            votesAgainst: Number(rejectionVotes),
            voter: {
              address: signerAddress,
              vote: approve,
              amount: Number(stakeAmount),
              timestamp: Math.floor(Date.now() / 1000),
            },
          }),
        });

        if (!response.ok) {
          console.error(
            "Failed to update vote in database:",
            await response.text()
          );
          // Don't throw error here as the blockchain vote was successful
        }

        toast.success(`Vote cast successfully! Staked 100 FDAO`);
      } else {
        console.log("No VoteCast event found in logs:", receipt.logs);
        toast.error("Vote transaction completed but no event found");
      }

      fetchDisputes();
    } catch (error: any) {
      console.error("Error voting:", error);
      let errorMessage = "Failed to cast vote";

      if (error.reason) {
        errorMessage = error.reason;
      } else if (error.message) {
        if (error.message.includes("Dispute already resolved")) {
          errorMessage = "This dispute has already been resolved";
        } else if (error.message.includes("Voting period ended")) {
          errorMessage = "The voting period has ended for this dispute";
        } else if (error.message.includes("Already voted")) {
          errorMessage = "You have already voted on this dispute";
        } else if (error.message.includes("Insufficient stake")) {
          errorMessage =
            "Stake amount is below the minimum required (100 FDAO)";
        } else if (error.message.includes("Stake transfer failed")) {
          errorMessage = "Failed to transfer FDAO tokens for staking";
        } else {
          errorMessage = error.message;
        }
      }

      toast.error(`Voting failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const resolveDispute = async (dispute: Dispute) => {
    if (!provider) {
      toast.error("Please connect your wallet");
      return;
    }

    try {
      setIsLoading(true);
      const signer = await provider.getSigner();
      const signerAddress = await signer.getAddress();
      console.log("Signer Address:", signerAddress);

      const governanceDAO = new ethers.Contract(
        GovernanceDAO.address,
        GovernanceDAO.abi,
        signer
      );

      const disputeId = dispute.disputeId;
      console.log("Resolving dispute:", disputeId);

      // Get dispute data to check status
      const disputeData = await governanceDAO.disputes(disputeId);
      console.log("Dispute data:", disputeData);

      if (disputeData.resolved) {
        toast.error("Dispute is already resolved");
        return;
      }

      // Call resolveDispute function
      const tx = await governanceDAO.resolveDispute(disputeId);

      console.log("Resolution transaction sent:", tx.hash);
      const receipt = await tx.wait();
      console.log("Resolution receipt:", receipt);

      if (receipt.status === 0) {
        throw new Error("Resolution transaction failed");
      }

      // Check for DisputeResolved event
      const resolvedEvent = receipt.logs.find(
        (log: any) => log.eventName === "DisputeResolved"
      );

      if (resolvedEvent) {
        const approved = resolvedEvent.args[1]; // Second argument is the approved status

        // Update MongoDB with resolved status
        const response = await fetch(`/api/disputes/${disputeId}/`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "Resolved",
            outcome: approved ? "Approved" : "Rejected",
            resolvedAt: Math.floor(Date.now() / 1000),
            resolvedBy: signerAddress,
          }),
        });

        if (!response.ok) {
          console.error(
            "Failed to update dispute status in database:",
            await response.text()
          );
        }

        toast.success(
          `Dispute resolved successfully! Outcome: ${
            approved ? "Approved" : "Rejected"
          }`
        );
      } else {
        console.log("No DisputeResolved event found in logs:", receipt.logs);
        toast.error("Resolution transaction completed but no event found");
      }

      fetchDisputes();
    } catch (error: any) {
      console.error("Error resolving dispute:", error);
      let errorMessage = "Failed to resolve dispute";

      if (error.reason) {
        errorMessage = error.reason;
      } else if (error.message) {
        if (error.message.includes("already resolved")) {
          errorMessage = "This dispute has already been resolved";
        } else if (error.message.includes("voting period")) {
          errorMessage = "Cannot resolve dispute before voting period ends";
        } else {
          errorMessage = error.message;
        }
      }

      toast.error(`Resolution failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDisputes = async () => {
    try {
      const response = await fetch("/api/disputes");
      console.log("response: ", response);
      const data = await response.json();
      if (data.success) {
        setDisputes(data.disputes);
      }
    } catch (error) {
      console.error("Error fetching disputes:", error);
    }
  };

  useEffect(() => {
    if (currentAccount) {
      fetchDisputes();
    }
  }, [currentAccount]);

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

        {/* Create Dispute Form */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 mb-10">
          <h2 className="text-2xl font-bold mb-4">Create New Dispute</h2>
          <form onSubmit={createDispute} className="flex gap-4">
            <Input
              type="text"
              placeholder="Enter Policy ID"
              value={newPolicyId}
              onChange={(e) => setNewPolicyId(e.target.value)}
              className="flex-1 bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500"
            />
            <Button
              type="submit"
              disabled={isLoading || !currentAccount}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl"
            >
              {isLoading ? "Creating..." : "Create Dispute"}
            </Button>
          </form>
          <p className="text-sm text-neutral-400 mt-2">
            Enter the Policy ID to create a new dispute for review by the DAO
          </p>
        </div>

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

              {dispute.description && (
                <p className="text-lg mb-6">{dispute.description}</p>
              )}

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Creator</span>
                    <span>
                      {(dispute.creator || "").substring(0, 6)}...
                      {(dispute.creator || "").substring(
                        dispute.creator?.length - 4
                      )}
                    </span>
                  </div>

                  {dispute.requestedAmount && (
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Requested Amount</span>
                      <span className="font-bold">
                        {dispute.requestedAmount.toLocaleString()} FUSD
                      </span>
                    </div>
                  )}

                  {dispute.timeRemaining && (
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Time Remaining</span>
                      <span className="flex items-center text-orange-400">
                        <Clock className="h-4 w-4 mr-2" />
                        {dispute.timeRemaining}
                      </span>
                    </div>
                  )}
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
                      onClick={() => handleVote(dispute, true)}
                      disabled={isLoading || dispute.status !== "Active"}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl py-4"
                    >
                      <ThumbsUp className="h-5 w-5 mr-2" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleVote(dispute, false)}
                      disabled={isLoading || dispute.status !== "Active"}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl py-4"
                    >
                      <ThumbsDown className="h-5 w-5 mr-2" />
                      Reject
                    </Button>
                  </div>
                  {dispute.status === "Active" && (
                    <Button
                      onClick={() => resolveDispute(dispute)}
                      disabled={isLoading}
                      className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-4"
                    >
                      Resolve Dispute
                    </Button>
                  )}
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
