"use server";

export async function submitContactForm(formData: FormData) {
  const name = formData.get("name")?.toString().trim();
  const email = formData.get("email")?.toString().trim();
  const message = formData.get("message")?.toString().trim();

  if (!name || !email || !message) {
    return { error: "All fields are required." };
  }

  try {
    // 📧 Send email (Example: Using Nodemailer)
    const nodemailer = require("nodemailer");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
        pass: process.env.CONTACT_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: email,
      to: process.env.NEXT_PUBLIC_CONTACT_EMAIL, // Your business email
      subject: "New Contact Form Submission",
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    });
    console.log("here");
    return { success: "Message sent successfully!" };
  } catch (error) {
    console.error("Error sending email:", error);
    return { error: "Failed to send message. Please try again later." };
  }
}
