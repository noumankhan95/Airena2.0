import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { adminMessaging } from "../firebaseadmin";
// Firebase Cloud Messaging server key (ensure it's stored securely)

export async function POST(req: NextRequest) {
  try {
    const { influencerId, influencerName } = await req.json();

    if (!influencerId || !influencerName) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const message = {
      topic: influencerId,
      notification: {
        title: "Tune In!",
        body: `${influencerName} is about to go Live!`,
      },
    };

    // Send notification
    const response = await adminMessaging.send(message);
    console.log(response);
    return NextResponse.json({
      success: true,
      message: "Subscribed to topic",
    });
  } catch (error) {
    console.error("Error subscribing to topic:", error);
    return NextResponse.json(
      { error: "Failed to subscribe to topic" },
      { status: 500 }
    );
  }
}
