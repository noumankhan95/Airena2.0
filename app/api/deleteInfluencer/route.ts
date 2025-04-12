// pages/api/createAdmin.js

import { adminAuth } from "../firebaseadmin.js";

import { NextResponse } from "next/server";
import admin from "firebase-admin";
import { Timestamp } from "firebase-admin/firestore";
const db = admin.firestore();
export async function POST(req: Request) {
  try {
    const { uid, adminUid } = await req.json();
    if (!uid) throw "No User Account Received";

    const adminUser = await adminAuth.getUser(adminUid);

    if (!adminUser.customClaims?.admin || !adminUid) {
      throw new Error("Permission denied. Only admins can delete users.");
    }
    await adminAuth.deleteUser(uid);
    await db.collection("influencers").doc(uid).delete();
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
