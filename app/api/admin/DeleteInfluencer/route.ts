// app/api/deleteInfluencer/route.ts

import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminFirestore } from "../../firebaseadmin";

export async function DELETE(req: NextRequest) {
  try {
    const { influencerId } = await req.json(); // Parse the incoming JSON body

    // Check if both influencerId an are provided
    if (!influencerId) {
      return NextResponse.json(
        { error: "Influencer ID are required" },
        { status: 400 }
      );
    }
    const superAdminUID = "O0NilSIp8eVvBhlcar8DgYtAL0x2"; // Replace with actual Super Admin UID

    //@ts-ignore
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

    const decodedToken = await adminAuth.verifyIdToken(token);

    if (decodedToken.uid !== superAdminUID)
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    // Step 1: Delete the influencer document from Firestore
    await adminFirestore.collection("influencers").doc(influencerId).delete();

    // Step 2: Delete the Firebase Authentication user account
    await adminAuth.deleteUser(influencerId);

    // Respond with a success message
    return NextResponse.json({
      message: "Influencer and account deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting influencer and account:", error);
    return NextResponse.json(
      { error: "Error deleting influencer and account" },
      { status: 500 }
    );
  }
}
