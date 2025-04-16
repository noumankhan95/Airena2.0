'use client';

import { createStream } from "../../../lib/actions";
import useInfluencersInfo from "@/store/influencerPanel/OwnersInfo";
import { Box, Card } from "@mui/material";
import { toast } from "react-hot-toast";

function LivePage() {
  const { uid, name } = useInfluencersInfo();

  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent the default form submission behavior

    const formData = new FormData(e.target);  // Create a FormData object from the form

    console.log([...formData.entries()], "formData");

    if (!uid) {
      toast.error('Please wait while we load your account information...');
      return;
    }

    await fetch("/api/sendNotifications", {
      method: "POST",
      body: JSON.stringify({
        influencerId: uid,
        influencerName: name,
      }),
      headers: {
        'Content-Type': 'application/json',
      }
    });

    formData.append('influencerId', uid);
    formData.append("influencerName", name)
    await createStream(formData);  // Create the stream with the form data

    toast.success('Your stream has been created!');
  };

  if (!uid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0A1A0E] to-[#07150A] px-4">
        <div className="max-w-md w-full space-y-8 p-8 bg-[#0D1F12] rounded-2xl shadow-lg border border-gray-700">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">Loading...</h2>
            <p className="mt-2 text-gray-400">Please wait while we load your account information</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="max-w-md w-full space-y-8 p-8">
        <div>
          <h2 className="text-3xl font-bold text-white text-center">
            Start Streaming
          </h2>
          <p className="mt-2 text-gray-400 text-center">
            Set up your stream details to go live
          </p>
        </div>

        {/* Use onSubmit for form handling */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-400">
              Stream Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              className="mt-1 block w-full px-4 py-3 bg-[#111D14] text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter your stream title..."
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-400">
              Stream Category
            </label>
            <select
              id="category"
              name="category"
              required
              className="mt-1 block w-full px-4 py-3 bg-[#111D14] text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="Gaming">Gaming</option>
              <option value="Sports">Sports</option>
            </select>
          </div>

          {/* Submit Button */}
          <button type="submit" className="w-full py-3 bg-green-500 text-white font-semibold rounded-lg focus:ring-2 focus:ring-green-500">
            Go Live
          </button>
        </form>
      </Card>
    </div>
  );
}

export default LivePage;
