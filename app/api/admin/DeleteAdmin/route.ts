// app/api/deleteInfluencer/route.ts

import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminFirestore } from "../../firebaseadmin";

export async function DELETE(req: NextRequest) {
  try {
    const { adminId } = await req.json(); // Parse the incoming JSON body

    // Check if both adminId an are provided
    if (!adminId) {
      return NextResponse.json({ error: "Brand Id required" }, { status: 400 });
    }

    const superAdminUID = "O0NilSIp8eVvBhlcar8DgYtAL0x2"; // Replace with actual Super Admin UID
    if (adminId == superAdminUID) {
      return NextResponse.json(
        { error: "Can Not Delete Super Admin" },
        { status: 400 }
      );
    }
    //@ts-ignore
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

    const decodedToken = await adminAuth.verifyIdToken(token);

    if (decodedToken.uid !== superAdminUID)
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    // Step 1: Delete the influencer document from Firestore
    await adminFirestore.collection("admins").doc(adminId).delete();

    // Step 2: Delete the Firebase Authentication user account
    await adminAuth.deleteUser(adminId);

    // Respond with a success message
    return NextResponse.json({
      message: "Brand and account deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting Brand and account:", error);
    return NextResponse.json(
      { error: "Error deleting Brand and account" },
      { status: 500 }
    );
  }
}
