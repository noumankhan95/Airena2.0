// pages/api/createAdmin.js

import { adminAuth } from "../firebaseadmin.js";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { uid, adminUid } = await req.json();
    if (!uid) throw "No User Account Received";

    const superAdminUID = "O0NilSIp8eVvBhlcar8DgYtAL0x2"; // Replace with actual Super Admin UID
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

    const decodedToken = await adminAuth.verifyIdToken(token);

    if (decodedToken.uid !== superAdminUID) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }
    await adminAuth.deleteUser(uid);

    return NextResponse.json(
      {
        message: "Influencer Account Deleted",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("error", error);
    return NextResponse.json(
      { message: (error as any).message },
      { status: 500 }
    );
  }
}
