import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";

interface Voter {
  address: string;
  vote: boolean;
  amount: number;
  timestamp: number;
}

interface DisputeUpdate {
  votesFor?: number;
  votesAgainst?: number;
  voter?: Voter;
  status?: string;
  outcome?: string;
  resolvedAt?: number;
  resolvedBy?: string;
}

export async function PATCH(
  request: Request,
  { params }: { params: { disputeId: string } }
) {
  try {
    const { db } = await connectToDatabase();
    const disputeId = params.disputeId;

    if (!disputeId) {
      return NextResponse.json(
        { success: false, message: "Dispute ID is required" },
        { status: 400 }
      );
    }

    const body = (await request.json()) as DisputeUpdate;

    // Check if this is a vote update or a status update
    if (body.voter) {
      // This is a vote update
      const { votesFor, votesAgainst, voter } = body;

      if (
        typeof votesFor !== "number" ||
        typeof votesAgainst !== "number" ||
        !voter
      ) {
        return NextResponse.json(
          { success: false, message: "Invalid vote data" },
          { status: 400 }
        );
      }

      // Check if dispute is still active
      const dispute = await db.collection("disputes").findOne({ disputeId });
      if (!dispute || dispute.status !== "Active") {
        return NextResponse.json(
          { success: false, message: "Dispute is not active" },
          { status: 400 }
        );
      }

      // Check if voter has already voted
      const existingVote = await db.collection("disputes").findOne({
        disputeId,
        "voters.address": voter.address,
      });

      if (existingVote) {
        return NextResponse.json(
          { success: false, message: "Voter has already cast a vote" },
          { status: 400 }
        );
      }

      // Update vote counts and add voter
      const result = await db.collection("disputes").updateOne(
        { disputeId },
        {
          $set: {
            votesFor,
            votesAgainst,
          } as any,
          $push: {
            voters: voter,
          } as any,
        }
      );

      if (result.matchedCount === 0) {
        return NextResponse.json(
          { success: false, message: "Dispute not found" },
          { status: 404 }
        );
      }
    } else if (body.status) {
      // This is a status update
      const { status, outcome, resolvedAt, resolvedBy } = body;

      const result = await db.collection("disputes").updateOne(
        { disputeId },
        {
          $set: {
            status,
            outcome,
            resolvedAt,
            resolvedBy,
          },
        }
      );

      if (result.matchedCount === 0) {
        return NextResponse.json(
          { success: false, message: "Dispute not found" },
          { status: 404 }
        );
      }
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid update data" },
        { status: 400 }
      );
    }

    // Get updated dispute
    const updatedDispute = await db
      .collection("disputes")
      .findOne({ disputeId });

    return NextResponse.json(
      { success: true, dispute: updatedDispute },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating dispute:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update dispute" },
      { status: 500 }
    );
  }
}
