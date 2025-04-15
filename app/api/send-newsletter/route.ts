import { NextRequest, NextResponse } from "next/server";
import { collection, getDocs } from "firebase/firestore";
import nodemailer from "nodemailer";
import { adminFirestore as db } from "@/app/api/firebaseadmin";

export async function POST(req: NextRequest) {
  try {
    const { subject, html } = await req.json();
    if (!subject || !html) {
      return NextResponse.json(
        { error: "Missing subject or content" },
        { status: 400 }
      );
    }
    const snapshot = await db.collection("newsLettersubscribers").get();
    const emails = snapshot.docs.map((doc) => doc.data().email);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
        pass: process.env.CONTACT_PASSWORD,
      },
    });

    for (const email of emails) {
      const emailHtml = `
        ${html}
        <br/><br/>
        <div style="text-align: center; margin-top: 20px;">
          <a href="${
            process.env.NEXT_PUBLIC_BASE_URL
          }/api/unsubscribe?email=${encodeURIComponent(email)}" 
             style="display: inline-block; padding: 10px 20px; background-color: #ef4444; color: #ffffff; text-decoration: none; border-radius: 4px; font-size: 14px;">
            Unsubscribe
          </a>
        </div>
      `;
      await transporter.sendMail({
        from: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
        to: email,
        subject,
        html: emailHtml,
      });
    }

    return NextResponse.json({ message: "Newsletter sent!" });
  } catch (error) {
    console.error("Error sending newsletter:", error);
    return NextResponse.json(
      { error: "Failed to send newsletter" },
      { status: 500 }
    );
  }
}
