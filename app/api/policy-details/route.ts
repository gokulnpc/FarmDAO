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
    const { searchParams } = new URL(request.url);
    const policyId = searchParams.get("policyId");

    if (!policyId) {
      return NextResponse.json(
        { error: "Policy ID is required" },
        { status: 400 }
      );
    }
    console.log("Policy ID:", policyId);

    const body = await request.json();
    const { status, lastUpdated, updatedBy, resolutionDetails } = body;

    // Validate status
    if (
      !["Active", "Inactive", "Redeemed", "Expired", "Claimed"].includes(status)
    ) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    // Convert timestamps to Date objects
    const updateData = {
      status,
      lastUpdated: new Date(lastUpdated * 1000), // Convert Unix timestamp to Date
      updatedBy,
      resolutionDetails: resolutionDetails
        ? {
            ...resolutionDetails,
            resolvedAt: new Date(resolutionDetails.resolvedAt * 1000), // Convert Unix timestamp to Date
          }
        : undefined,
      updatedAt: new Date(), // Update the updatedAt timestamp
    };

    // Update policy details
    const updatedPolicy = await PolicyDetails.findOneAndUpdate(
      { policyId },
      {
        $set: updateData,
      },
      {
        new: true, // Return the updated document
        runValidators: true, // Run schema validations on update
      }
    );

    if (!updatedPolicy) {
      return NextResponse.json({ error: "Policy not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, policy: updatedPolicy });
  } catch (error: any) {
    console.error("Error updating policy details:", error);
    // Return more detailed error message
    return NextResponse.json(
      {
        error: "Failed to update policy details",
        details: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
