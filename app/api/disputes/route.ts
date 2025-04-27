import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";

interface Voter {
  address: string;
  vote: boolean;
  amount: number;
  timestamp: number;
}

interface DisputeUpdate {
  votesFor: number;
  votesAgainst: number;
  voter: Voter;
}

export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase();
    const body = await request.json();
    const { disputeId, policyId, creator, startTime } = body;

    if (!disputeId || !policyId || !creator || !startTime) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const dispute = await db.collection("disputes").insertOne({
      disputeId,
      policyId,
      creator,
      startTime,
      status: "Active",
      votesFor: 0,
      votesAgainst: 0,
      voters: [],
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, dispute }, { status: 201 });
  } catch (error) {
    console.error("Error creating dispute:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create dispute" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const disputes = await db.collection("disputes").find().toArray();
    console.log(disputes);
    return NextResponse.json({ success: true, disputes });
  } catch (error) {
    console.error("Error fetching disputes:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch disputes" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { db } = await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const disputeId = searchParams.get("disputeId");

    if (!disputeId) {
      return NextResponse.json(
        { success: false, message: "Dispute ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { votesFor, votesAgainst, voter } = body as DisputeUpdate;

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

    // First, check if voter has already voted
    const existingDispute = await db.collection("disputes").findOne({
      disputeId,
      "voters.address": voter.address,
    });

    if (existingDispute) {
      return NextResponse.json(
        { success: false, message: "Voter has already cast a vote" },
        { status: 400 }
      );
    }

    // Update vote counts and add voter to the voters array
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

    // Get updated dispute
    const updatedDispute = await db
      .collection("disputes")
      .findOne({ disputeId });

    return NextResponse.json(
      { success: true, dispute: updatedDispute },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating votes:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update votes" },
      { status: 500 }
    );
  }
}
