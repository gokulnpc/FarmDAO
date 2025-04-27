import { NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import { Policy } from "@/app/models/Policy";

export async function GET(req: Request) {
  try {
    await connectDB();

    // Get user address from query params
    const { searchParams } = new URL(req.url);
    const userAddress = searchParams.get("address");

    if (!userAddress) {
      return NextResponse.json(
        { success: false, error: "User address is required" },
        { status: 400 }
      );
    }

    // Find all policies for the user
    const policies = await Policy.find({
      userAddress: userAddress.toLowerCase(),
    }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, policies }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch policies:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch policies" },
      { status: 500 }
    );
  }
}
