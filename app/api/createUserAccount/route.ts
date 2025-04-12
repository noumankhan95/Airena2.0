// pages/api/createAdmin.js

import { adminAuth } from "../firebaseadmin.js";

import { NextResponse } from "next/server";
import admin from "firebase-admin";
import { Timestamp } from "firebase-admin/firestore";

const db = admin.firestore();
export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    const user = await adminAuth.createUser({ email, password });
    if (!user) throw "Couldnt Create User";
    const docRef = db.collection("users").doc(user.uid);
    await docRef.set({
      name,
      email,
      createdAt: Timestamp.now(),
    });

    const userRecord = await adminAuth.getUserByEmail(user.email?.trim()!);
    if (!userRecord) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "User Account Created",
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
