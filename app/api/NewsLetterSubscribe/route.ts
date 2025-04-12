import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { adminFirestore as db } from "@/app/api/firebaseadmin";
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Configure Nodemailer with Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
        pass: process.env.CONTACT_PASSWORD,
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
      to: email,
      subject: "Welcome to Our Newsletter!",
      html: `
      <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <div style="background-color: #4F46E5; color: #ffffff; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">Welcome to Airena!</h1>
        </div>
        <div style="padding: 30px; text-align: center;">
          <h2 style="color: #333333;">Thank You for Subscribing 🎉</h2>
          <p style="color: #666666; font-size: 16px; line-height: 1.5;">
            We're excited to have you on board! You'll be the first to know about our latest streams, exclusive offers, and new releases.
          </p>
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}" style="display: inline-block; margin-top: 20px; padding: 12px 24px; background-color: #4F46E5; color: #ffffff; text-decoration: none; border-radius: 4px; font-size: 16px;">
            Explore Airena
          </a>
          <p style="margin-top: 30px; font-size: 12px; color: #999999;">
            If you wish to unsubscribe, click the button below.
          </p>
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}/unsubscribe?email=${email}" style="display: inline-block; margin-top: 10px; padding: 10px 20px; background-color: #ef4444; color: #ffffff; text-decoration: none; border-radius: 4px; font-size: 14px;">
            Unsubscribe
          </a>
        </div>
      </div>
    </div>
      `,
    };

    // Send Email
    await transporter.sendMail(mailOptions);

    // Save email to Firestore
    await db.collection("newsLettersubscribers").add({
      email: email,
      subscribedAt: new Date(),
    });

    return NextResponse.json(
      { message: "Subscription successful!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email or saving to Firestore:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
