"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Switch,
  Box,
  IconButton,
} from "@mui/material";
import {
  Videocam,
  Person,
  ShoppingBag,
  SportsEsports,
  SportsSoccer,
  Notifications,
} from "@mui/icons-material";
import { doc, updateDoc } from "firebase/firestore";
import useOwnersStore from "@/store/dealersPanel/OwnersInfo";
import { db } from "@/firebase";
import { toast } from "react-toastify";
import { link } from "fs";
import { useRouter } from "next/navigation";

const Onboarding = () => {
  const { info } = useOwnersStore();
  if (!info) return null; // Prevents crash if info is undefined
  console.log(info);
  const {
    uid: user,
    interests: savedInterests,
    notificationPreferences,
    contactDetails,
  } = info;
  const userDocRef = user ? doc(db, "users", user) : null;
  console.log(notificationPreferences);
  const [interests, setInterests] = useState(savedInterests);
  const [notifications, setNotifications] = useState({
    liveStream: notificationPreferences?.liveStream || false,
    newContent: notificationPreferences?.newContent || false,
    specialOffers: notificationPreferences?.specialOffers || false,
    recommendations: notificationPreferences?.recommendations || false,
  });
  const router = useRouter();
  const toggleInterest = (interest: any) => {
    setInterests((prev = []) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleToggle = (key: any) => {
    //@ts-ignore
    setNotifications((prev = {}) => ({
      ...prev,
      //@ts-ignore

      [key]: !prev[key],
    }));
  };

  const handleSave = async () => {
    if (!userDocRef) {
      toast.error("User not found");
      return;
    }

    const id = toast.loading("Saving...");
    try {
      await updateDoc(userDocRef, {
        interests,
        notificationPreferences: notifications,
        onboardingCompleted: true,
      });
      toast.update(id, {
        render: "Saved",
        isLoading: false,
        closeButton: true,
        autoClose: 5000,
        type: "success",
      });
      router.replace("/user/myAccount");
    } catch (error) {
      console.error("Error updating document:", error);
      toast.update(id, {
        //@ts-ignore

        render: error.message,
        isLoading: false,
        closeButton: true,
        autoClose: 5000,
        type: "error",
      });
    }
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        color: "white",
        backgroundColor: "#121212",
        minHeight: "100vh",
        py: 4,
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Welcome to AIRENA
      </Typography>
      <Typography variant="subtitle1" align="center" gutterBottom>
        Your ultimate streaming destination for entertainment, shopping, and
        more
      </Typography>

      {/* <Grid container spacing={3} justifyContent="center" sx={{ my: 3 }}>
        {[
          {
            title: "Live Streaming",
            icon: <Videocam />,
            desc: "Watch live content with interactive features",
          },
          {
            title: "Personalized Content",
            icon: <Person />,
            desc: "Get recommendations based on your interests",
          },
          {
            title: "Interactive Shopping",
            icon: <ShoppingBag />,
            desc: "Shop products featured in streams",
          },
        ].map((feature, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Card
              sx={{ backgroundColor: "#1e1e1e", textAlign: "center", py: 3 }}
            >
              <CardContent>
                <IconButton sx={{ color: "#00c853", fontSize: 40 }}>
                  {feature.icon}
                </IconButton>
                <Typography variant="h6" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2">{feature.desc}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid> */}

      <Grid container spacing={3} justifyContent="center" sx={{ my: 3 }}>
        {[
          {
            title: "Live Streaming",
            icon: <Videocam />,
            desc: "Watch live content with interactive features",
            link: true, // Adding a link flag for Live Streaming card
          },
          {
            title: "Personalized Content",
            icon: <Person />,
            desc: "Get recommendations based on your interests",
            link: false, // No link for this card
          },
          {
            title: "Interactive Shopping",
            icon: <ShoppingBag />,
            desc: "Shop products featured in streams",
            link: false, // No link for this card
          },
        ].map((feature, index) => (
          <Grid item xs={12} sm={4} key={index}>
            {feature.link ? (
              // Wrap only the Live Streaming card with the Link component
              // <Link href="/#categorypills" passHref>
              <Card
                sx={{
                  backgroundColor: "#111111",
                  textAlign: "center",
                  py: 3,
                }}
              >
                <CardContent>
                  <IconButton sx={{ color: "#46c190", fontSize: 40 }}>
                    {feature.icon}
                  </IconButton>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ color: "white !important" }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography variant="body1">{feature.desc}</Typography>
                </CardContent>
              </Card>
            ) : (
              // </Link>
              // For the other cards, just display the Card without the Link
              <Card
                sx={{ backgroundColor: "#111111", textAlign: "center", py: 3 }}
              >
                <CardContent>
                  <IconButton sx={{ color: "#46c190", fontSize: 40 }}>
                    {feature.icon}
                  </IconButton>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ color: "white !important" }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography variant="body1">{feature.desc}</Typography>
                </CardContent>
              </Card>
            )}
          </Grid>
        ))}
      </Grid>

      <Typography variant="h6" gutterBottom>
        Select Your Interests
      </Typography>
      <Grid container spacing={2}>
        {[
          { title: "Gaming", viewers: "450K viewers", icon: <SportsEsports /> },
          { title: "Sports", viewers: "280K viewers", icon: <SportsSoccer /> },
        ].map((interest, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Card
              onClick={() => toggleInterest(interest.title)}
              sx={{
                backgroundColor: interests?.includes(interest.title)
                  ? "#0fbf78"
                  : "#111111",
                display: "flex",
                alignItems: "center",
                py: 5,
                cursor: "pointer",
              }}
            >
              <IconButton
                sx={{
                  color: interests?.includes(interest.title)
                    ? "white"
                    : "#46c190",
                }}
              >
                {interest.icon}
              </IconButton>
              <Box sx={{ ml: 2 }}>
                <Typography variant="body1" sx={{ color: "white" }}>
                  {interest.title}
                </Typography>
                <Typography variant="body2" sx={{ color: "white" }}>
                  {interest.viewers}
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Typography variant="h6" sx={{ mt: 4 }}>
        Notification Preferences
      </Typography>
      <Card sx={{ backgroundColor: "#1e1e1e", p: 2, mt: 2 }}>
        {[
          { label: "Live stream notifications", key: "liveStream" },
          { label: "New content alerts", key: "newContent" },
          { label: "Special offers", key: "specialOffers" },
          { label: "Personalized recommendations", key: "recommendations" },
        ].map((pref, index) => (
          <Box
            key={index}
            display="flex"
            justifyContent="start"
            alignItems="center"
            sx={{ py: 1 }}
            className="!space-x-4"
          >
            <Notifications style={{ color: "#46c190" }} />
            <Box className="flex justify-between w-full items-center">
              <Typography>{pref.label}</Typography>
              <Switch
                //@ts-ignore
                value={notifications[pref.key]}
                //@ts-ignore

                checked={notifications[pref.key]}
                onChange={() => handleToggle(pref.key)}
                color="success"
              />
            </Box>
          </Box>
        ))}
      </Card>
      <Box textAlign="center" sx={{ mt: 4 }}>
        <Button
          variant="contained"
          color="success"
          size="large"
          onClick={handleSave}
        >
          Complete Onboarding
        </Button>
      </Box>
    </Container>
  );
};

export default Onboarding;
