import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";

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
