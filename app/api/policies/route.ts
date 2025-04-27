import { NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import { Policy } from "@/app/models/Policy";

export async function POST(request: Request) {
  try {
    await connectDB();

    const {
      userAddress,
      policyId,
      latitude,
      longitude,
      premium,
      coverageAmount,
      tier,
    } = await request.json();

    if (
      !userAddress ||
      !policyId ||
      !latitude ||
      !longitude ||
      !premium ||
      !coverageAmount ||
      !tier
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const policy = await Policy.create({
      userAddress,
      policyId,
      location: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
      premium,
      coverageAmount,
      tier,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, policy }, { status: 201 });
  } catch (error) {
    console.error("Error creating policy:", error);
    return NextResponse.json(
      { error: "Failed to create policy" },
      { status: 500 }
    );
  }
}
