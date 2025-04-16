
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { Crown, Loader2, Star, Sparkles, Gamepad2, Joystick } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ParallaxProvider, Parallax } from 'react-scroll-parallax';
import { FaUser, FaGamepad, FaMobileAlt, FaEnvelope, FaLaptop, FaLink } from 'react-icons/fa';
import { db } from "@/firebase"; // Adjust the path to your Firebase setup
import { collection, addDoc } from "firebase/firestore";

const FoundersClub = () => {
  const initialState = {
    name: "",
    sportGame: "",
    mobile: "",
    email: "",
    platform: "",
    referral: "",
    channelDescription: ""
  };

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { scrollY } = useScroll();
  const titleY = useTransform(scrollY, [0, 300], [0, -50]);
  const inputScale = useTransform(scrollY, [0, 300], [1, 1.1]);

  const validateForm = () => {
    let newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name.trim())) {
      newErrors.name = "Name must contain only letters and spaces.";
    }

    if (!formData.sportGame.trim()) {
      newErrors.sportGame = "Sport/Game is required.";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.sportGame.trim())) {
      newErrors.sportGame = "Sport/Game must contain only letters and spaces.";
    }

    if (!/^[0-9]{10}$/.test(formData.mobile.trim())) {
      newErrors.mobile = "Enter a valid 10-digit mobile number.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!formData.platform.trim()) {
      newErrors.platform = "Platform is required.";
    }

    if (!formData.channelDescription.trim()) {
      newErrors.channelDescription = "Channel Description is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting.");
      return;
    }

    setIsLoading(true);

    // Save data to Firestore
    try {
      await addDoc(collection(db, "becomePartners"), formData);
      toast.success("Sign-up successful! 🎉");
      setFormData(initialState);
    } catch (error) {
      toast.error("Error submitting data. Please try again.");
      console.error("Firestore Error: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getIcon = (field) => {
    switch (field) {
      case "name":
        return <FaUser />;
      case "sportGame":
        return <FaGamepad />;
      case "mobile":
        return <FaMobileAlt />;
      case "email":
        return <FaEnvelope />;
      case "platform":
        return <FaLaptop />;
      case "referral":
        return <FaLink />;
      default:
        return null;
    }
  };

  return (
    <ParallaxProvider>
      <div id="join-now-section" className="w-full max-w-6xl mx-auto px-3 sm:px-4">
        <motion.div
          className="bg-gray-900 rounded-lg overflow-hidden mb-8 sm:mb-12 relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <section className="py-8 sm:py-12 px-3 sm:px-4 bg-black text-white relative">
            <Parallax speed={-10} className="absolute top-10 left-10">
              <Crown className="h-32 w-32 text-green-500 opacity-20" />
            </Parallax>
            <Parallax speed={15} className="absolute top-10 right-10">
              <Star className="h-24 w-24 text-yellow-500 opacity-20" />
            </Parallax>
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                className="mx-auto mb-4 sm:mb-6 flex justify-center"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Crown className="h-10 w-10 sm:h-12 sm:w-12 text-green-400" />
              </motion.div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3">
                Join the Creators Club
              </h2>
              <motion.form
                onSubmit={handleSubmit}
                className="max-w-lg mx-auto text-left"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                {Object.keys(initialState).map((field, index) => (
                  <motion.div
                    key={field}
                    className={"mb-3 " + field}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2, duration: 0.5 }}
                  >
                    <label
                      htmlFor={field}
                      className="block text-xs sm:text-sm text-gray-400 mb-1"
                    >
                      {field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()).replace("Sport Game", "Sport / Game").trim()}:
                    </label>

                    {/* Input with icon */}
                    <div className="relative">
                      {/* Input Field */}
                      <input
                        type="text"
                        id={field}
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        style={{
                          margin: '16px auto',
                          width: '100%',
                          height: '40px',
                          borderRadius: '20px',
                          borderBottom: '2px solid green',
                          textAlign: 'center',
                          color: 'white',
                          background: 'none',
                        }}
                        className={`w-full h-9 px-3 bg-transparent border rounded-md focus:ring-2 focus:ring-green-400 transition-transform duration-300 focus:scale-105 ${errors[field] ? "border-red-500" : "border-gray-700"}`}
                      />

                      {/* Icon */}
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        {getIcon(field)}
                      </div>
                    </div>

                    {/* Error message */}
                    {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
                  </motion.div>
                ))}
                <div className="text-center">
                  <Button
                    type="submit"
                    className="w-full sm:w-auto px-6 sm:px-8 py-2 bg-green-400 text-white hover:bg-green-500 rounded font-medium transition-colors"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="animate-spin h-4 w-4 sm:h-5 sm:w-5" /> Submitting...
                      </div>
                    ) : (
                      "Sign Up Early"
                    )}
                  </Button>

                </div>
              </motion.form>
            </div>
            <Parallax speed={-10} className="absolute top-150 left-10">
              <Joystick className="h-32 w-32 text-yellow-500 opacity-20" />
            </Parallax>
            <Parallax speed={15} className="absolute top-150 right-10">
              <Gamepad2 className="h-24 w-24 text-green-500 opacity-20" />
            </Parallax>
          </section>
        </motion.div>
      </div>
    </ParallaxProvider>
  );
};

export default FoundersClub;
