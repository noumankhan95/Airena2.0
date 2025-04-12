import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { adminMessaging } from "../firebaseadmin";

export async function POST(req: NextRequest) {
  try {
    const { fcmToken, influencerId } = await req.json();

    if (!fcmToken || !influencerId) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    await adminMessaging.subscribeToTopic(fcmToken, influencerId);

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
