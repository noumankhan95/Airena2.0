"use client";
import { useState } from "react";
import { db, storage } from "@/firebase"; // Import Firestore and Firebase Storage
import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";
import useProfileStore from "@/store/influencerPanel/OwnersInfo";
import { Box, Button, Card, TextField, Typography } from "@mui/material";
import {
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaGamepad,
  FaFootballBall,
  FaVideo,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function StreamingSetup() {
  const {
    username,
    bio,
    twitter,
    instagram,
    youtube,
    category,
    email,
    name,
    uid,
    profilePic, // Get the current profile picture from the Zustand store
  } = useProfileStore();

  const [profileData, setProfileData] = useState({
    username,
    bio,
    twitter,
    instagram,
    youtube,
    category: category || [],
  });
  const [isLoading, setisLoading] = useState<boolean>(false);

  const [newProfilePic, setNewProfilePic] = useState<File | null>(null); // State for the new profile picture
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(
    profilePic || null
  ); // Store URL for the profile picture

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleCategorySelect = (selectedCategory: string) => {
    setProfileData((prev) => {
      const currentCategories = prev.category || [];
      const isSelected = currentCategories.includes(selectedCategory);
      return {
        ...prev,
        category: isSelected
          ? currentCategories.filter((cat) => cat !== selectedCategory)
          : [...currentCategories, selectedCategory],
      };
    });
  };

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewProfilePic(file); // Set the new profile picture file
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicUrl(reader.result as string); // Update the displayed profile picture with the selected one
      };
      reader.readAsDataURL(file); // Read the file and update the state
    }
  };

  const handleSubmit = async () => {
    if (!uid) {
      toast.error("User ID is missing.");
      return;
    }
    try {
      setisLoading(true);

      let imageUrl: string | null = profilePicUrl;

      // If there is a new profile picture, upload it to Firebase Storage
      if (newProfilePic) {
        const imageRef = ref(storage, `influencers/profile_pics/${uid}`);
        try {
          // Upload the new profile picture
          await uploadBytes(imageRef, newProfilePic);
          imageUrl = await getDownloadURL(imageRef); // Get the image URL after upload
          setProfilePicUrl(imageUrl); // Store the new profile picture URL locally
        } catch (error) {
          throw error;
        }
      }

      const userRef = doc(db, "influencers", uid);

      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        // Update only specific fields
        await updateDoc(userRef, { ...profileData, profilePic: imageUrl });
      } else {
        // If document doesn't exist, create and merge
        await setDoc(
          userRef,
          { uid, name, email, ...profileData, profilePic: imageUrl },
          { merge: true }
        );
      }
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Error updating profile");
    } finally {
      setisLoading(false);
    }
  };
  console.log(profileData);
  return (
    <div className="min-h-screen p-8 text-white space-y-4">
      {/* Header */}
      <Box className="flex flex-col !space-y-4 items-center justify-center">
        <Typography variant="h2" className="font-semibold">
          Start Your Streaming Journey
        </Typography>
        <Typography variant="body1" className="font-semibold">
          Set up streaming profile in minutes
        </Typography>
      </Box>
      <Card className="flex flex-col items-start justify-center space-y-6">
        <Box className="flex flex-row items-center justify-center !space-x-4">
          <FaVideo
            className="text-indigo-300 text-3xl"
            style={{ color: "#46C190" }}
          />
          <Box className="space-y-4">
            <Typography variant="h6" className="font-semibold">
              Welcome to Airena
            </Typography>
            <Typography variant="body2" className="font-semibold">
              Learn How To Monetize Your Channel And Get Started
            </Typography>
          </Box>
        </Box>

        <Typography variant="body1">
          Set up your profile and get started.
        </Typography>
      </Card>

      {/* Category Selection */}
      <section className="my-12">
        <Typography variant="h6" className="font-semibold text-indigo-400">
          Select Your Category
        </Typography>
        <div className="grid grid-cols-2 gap-6 mt-6">
          {/* Gaming Card */}
          <Card
            onClick={() => handleCategorySelect("Gaming")}
            className={`p-6 shadow-lg flex flex-col items-start space-x-4 cursor-pointer transform transition-all duration-300 ${
              profileData.category.includes("Gaming")
                ? "border border-green-400"
                : ""
            }`}
            style={{ backgroundColor: "#141414" }}
          >
            <FaGamepad
              className="text-indigo-300 text-3xl"
              style={{ color: "#46C190" }}
            />
            <div>
              <Typography variant="h6" className="font-semibold">
                Gaming
              </Typography>
            </div>
          </Card>

          {/* Sports Card */}
          <Card
            onClick={() => handleCategorySelect("Sports")}
            className={`p-6 shadow-lg flex flex-col items-start space-x-4 cursor-pointer transform transition-all duration-300 ${
              profileData.category.includes("Sports")
                ? "border border-indigo-400"
                : ""
            }`}
            style={{ backgroundColor: "#141414" }}
          >
            <FaFootballBall
              className="text-indigo-300 text-3xl"
              style={{ color: "#46C190" }}
            />
            <div>
              <Typography variant="h6" className="font-semibold">
                Sports
              </Typography>
            </div>
          </Card>
        </div>
      </section>

      {/* Profile Setup */}
      <Card
        className="p-6 rounded-xl shadow-xl my-6"
        style={{ backgroundColor: "#020604" }}
      >
        <Typography
          variant="h6"
          className="font-semibold"
          style={{ color: "white !important" }}
        >
          Set Up Your Profile
        </Typography>
        <div className="flex space-x-6 my-5">
          {/* Upload Box */}
          <div className="w-24 h-24 bg-gray-500 flex items-center justify-center rounded-full cursor-pointer hover:bg-gray-600 transition-all duration-300">
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePicChange}
              className="hidden"
              id="profile-pic-input"
            />
            {/* Trigger the file input on click */}
            <label htmlFor="profile-pic-input" className="w-full h-full">
              <img
                src={profilePicUrl || "/default-avatar.png"} // Display the current profile picture or a default image
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            </label>
          </div>

          {/* Input Fields */}
          <div className="flex-1 !space-y-4">
            <TextField
              fullWidth
              label="Username"
              name="username"
              variant="outlined"
              value={profileData.username}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Bio"
              name="bio"
              multiline
              rows={3}
              variant="outlined"
              value={profileData.bio}
              onChange={handleChange}
            />

            {/* Social Links */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-2 rounded-lg">
                <FaTwitter className="text-blue-400 text-xl" />
                <TextField
                  fullWidth
                  label="Twitter URL"
                  name="twitter"
                  variant="outlined"
                  value={profileData.twitter}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center space-x-3 p-2 rounded-lg">
                <FaInstagram className="text-pink-400 text-xl" />
                <TextField
                  fullWidth
                  label="Instagram URL"
                  name="instagram"
                  variant="outlined"
                  value={profileData.instagram}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center space-x-3 p-2 rounded-lg">
                <FaYoutube className="text-red-500 text-xl" />
                <TextField
                  fullWidth
                  label="YouTube URL"
                  name="youtube"
                  variant="outlined"
                  value={profileData.youtube}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        <Box className="flex items-center justify-center">
          <Button
            onClick={handleSubmit}
            fullWidth
            variant="contained"
            className="bg-indigo-500 hover:bg-indigo-600 text-center self-center !-auto !w-20 text-white py-3 rounded-lg transition-all duration-300"
            disabled={isLoading}
          >
            Submit
          </Button>
        </Box>
      </Card>
    </div>
  );
}
