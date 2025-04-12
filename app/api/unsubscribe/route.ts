// app/api/Unsubscribe/route.ts

import { NextRequest, NextResponse } from "next/server";
import { adminFirestore as db } from "@/app/api/firebaseadmin";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const snapshot = await db
      .collection("newsLettersubscribers")
      .where("email", "==", email)
      .get();

    if (snapshot.empty) {
      return NextResponse.json({ message: "Email not found" }, { status: 404 });
    }

    // Delete all documents matching the email
    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    return NextResponse.json(
      { message: "Successfully unsubscribed" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error unsubscribing:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
