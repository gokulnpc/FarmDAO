import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";

export async function GET(request: Request) {
  try {
    // Get the address from the URL
    const { searchParams } = new URL(request.url);
    const address = searchParams.get("address");

    if (!address) {
      return NextResponse.json(
        { success: false, message: "Address is required" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const { db } = await connectToDatabase();

    // Get all policies for the user
    const policies = await db
      .collection("policydetails")
      .find({ userAddress: address })
      .toArray();

    return NextResponse.json({ success: true, policies });
  } catch (error) {
    console.error("Error fetching policies:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch policies" },
      { status: 500 }
    );
  }
}
