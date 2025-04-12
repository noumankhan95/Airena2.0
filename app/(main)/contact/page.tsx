"use client";
import { useState } from "react";
import { submitContactForm } from "@/app/actions/contact";
import SubmitButton from "@/components/ContactFormSubmit";
import { TextField } from "@mui/material";

export default function ContactPage() {
  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const response = await submitContactForm(formData);
    console.log(response);
    //@ts-ignore
    if (response?.error) {
      setStatus("error");
      //@ts-ignore
      setMessage(response.error);
    } else {
      setStatus("success");
      setMessage("Your message has been sent successfully!");
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-100">
        Contact Us
      </h1>

      {status && (
        <div
          className={`mb-4 text-center p-3 rounded-lg ${
            status === "success" ? "bg-green-600" : "bg-red-600"
          } text-white`}
        >
          {message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className=" p-6 rounded-lg shadow-md !space-y-4"
      >
        <TextField
          type="text"
          name="name"
          label="Your Name"
          variant="outlined"
          className="w-full"
          required
        />
        <TextField
          type="email"
          name="email"
          label="Your Email"
          variant="outlined"
          className="w-full"
          required
        />
        <TextField
          multiline
          name="message"
          rows={5}
          label="Your Message"
          variant="outlined"
          className="w-full"
          required
        />
        <SubmitButton />
      </form>
    </div>
  );
}
