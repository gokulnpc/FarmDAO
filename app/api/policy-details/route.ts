import { NextResponse } from "next/server";
import { connectToDatabase as connectDB } from "@/app/lib/mongodb";
import { PolicyDetails } from "@/app/models/PolicyDetails";

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      userAddress,
      policyId,
      location,
      premium,
      coverageAmount,
      tier,
      address,
    } = body;

    // Validate required fields
    if (
      !userAddress ||
      !policyId ||
      !location ||
      !premium ||
      !coverageAmount ||
      !tier ||
      !address
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate tier
    if (!["Basic", "Standard", "Premium"].includes(tier)) {
      return NextResponse.json(
        { error: "Invalid tier value" },
        { status: 400 }
      );
    }

    // Calculate start and end dates
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 6); // 6 months coverage

    // Create policy details with enhanced data
    const policyDetails = await PolicyDetails.create({
      userAddress,
      policyId,
      location: {
        type: "Point",
        coordinates: location.coordinates,
        address,
      },
      premium,
      coverageAmount,
      tier,
      startDate,
      endDate,
      weatherHistory: [], // Will be populated by weather service
      claims: [], // Will be populated when claims are made
      status: "Active",
    });

    return NextResponse.json({ success: true, policyDetails }, { status: 201 });
  } catch (error) {
    console.error("Error creating policy details:", error);
    return NextResponse.json(
      { error: "Failed to create policy details" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const address = searchParams.get("address");
    const policyId = searchParams.get("policyId");

    if (!address && !policyId) {
      return NextResponse.json(
        { error: "Either address or policyId parameter is required" },
        { status: 400 }
      );
    }

    let query = {};
    if (address) {
      query = { userAddress: address };
    } else if (policyId) {
      query = { policyId };
    }

    const policyDetails = await PolicyDetails.find(query);
    return NextResponse.json({ success: true, policyDetails });
  } catch (error) {
    console.error("Error fetching policy details:", error);
    return NextResponse.json(
      { error: "Failed to fetch policy details" },
      { status: 500 }
    );
  }
}

// Update weather data for a policy
export async function PATCH(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { policyId, weatherData } = body;

    if (!policyId || !weatherData) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const policy = await PolicyDetails.findOne({ policyId });
    if (!policy) {
      return NextResponse.json({ error: "Policy not found" }, { status: 404 });
    }

    // Add weather data to history
    policy.weatherHistory.push({
      date: new Date(),
      ...weatherData,
    });
    policy.lastWeatherUpdate = new Date();
    await policy.save();

    return NextResponse.json({ success: true, policy });
  } catch (error) {
    console.error("Error updating policy weather data:", error);
    return NextResponse.json(
      { error: "Failed to update policy weather data" },
      { status: 500 }
    );
  }
}
