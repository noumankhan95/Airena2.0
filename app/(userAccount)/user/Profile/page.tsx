"use client";
import React, { useEffect, useState } from "react";
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
import { doc, getDoc, updateDoc } from "firebase/firestore";
import useOwnersStore from "@/store/dealersPanel/OwnersInfo";
import { db, storage } from "@/firebase";
import { toast } from "react-toastify";
import { link } from "fs";
import { useRouter } from "next/navigation";
import { Avatar } from "@mui/material";
import { styled } from "@mui/system";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { getDownloadURL, listAll, ref } from "firebase/storage";
const Onboarding = () => {
  const { info } = useOwnersStore();
  if (!info) return null; // Prevents crash if info is undefined
  console.log(info);
  const {
    uid: user,
    interests: savedInterests,
    notificationPreferences,
    contactDetails,
    following,
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
        backgroundColor: "transparent",
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
      <Subs following={following} />
      <Typography variant="h6" sx={{ mt: 4 }}>
        Notification Preferences
      </Typography>
      <Card sx={{ backgroundColor: "#1A1A1A !important", p: 2, mt: 2 }}>
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
            sx={{ py: 1, backgroundColor: "#202020" }}
            className="!space-x-4 px-2 rounded-md my-3"
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

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#212121" : "#121212",
  color: theme.palette.mode === "dark" ? "#fff" : "#fff",

  padding: theme.spacing(3),
}));

const SidebarBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const ContentBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const VideoCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#303030" : "#303030",
  borderRadius: theme.spacing(1),
  overflow: "hidden",
  marginBottom: theme.spacing(2),
  position: "relative",
}));

const VideoThumbnail = styled("img")({
  width: "100%",
  height: "auto",
  display: "block",
  objectFit: "cover",
  objectPosition: "center",
  maxHeight: "150px",
});

const VideoInfo = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
}));

const WatchNowButton = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  color: "white",
  padding: theme.spacing(0.5, 1),
  borderRadius: theme.spacing(0.5),
  display: "flex",
  alignItems: "center",
  opacity: 0,
  transition: "opacity 0.3s ease-in-out",
  "&:hover": {
    opacity: 1,
  },
  zIndex: 1,
}));

const Subs = ({ following }: any) => {
  // const videoData = [
  //   {
  //     title: "Ultimate Gaming Setup Tour 2024",
  //     channel: "Tech Reviews",
  //     views: "45K",
  //     time: "2 hours ago",
  //     thumbnail:
  //       "https://www.seoclerk.com/pics/000/938/565/1ae9c77cca311faf4fa313caa54ff0f8.jpg",
  //   },
  //   {
  //     title: "Digital Art Masterclass",
  //     channel: "Art & Design",
  //     views: "32K",
  //     time: "4 hours ago",
  //     thumbnail:
  //       "https://www.seoclerk.com/pics/000/938/565/1ae9c77cca311faf4fa313caa54ff0f8.jpg",
  //   },
  //   {
  //     title: "Live Concert Highlights",
  //     channel: "Music Channel",
  //     views: "28K",
  //     time: "6 hours ago",
  //     thumbnail:
  //       "https://www.seoclerk.com/pics/000/938/565/1ae9c77cca311faf4fa313caa54ff0f8.jpg",
  //   },
  //   {
  //     title: "Exploring Hidden Gems",
  //     channel: "Travel Vlogs",
  //     views: "67K",
  //     time: "12 hours ago",
  //     thumbnail:
  //       "https://www.seoclerk.com/pics/000/938/565/1ae9c77cca311faf4fa313caa54ff0f8.jpg",
  //   },
  //   {
  //     title: "Pro Gaming Tournament",
  //     channel: "Sarah Gaming",
  //     views: "112K",
  //     time: "1 day ago",
  //     thumbnail:
  //       "https://www.seoclerk.com/pics/000/938/565/1ae9c77cca311faf4fa313caa54ff0f8.jpg",
  //   },
  //   {
  //     title: "Street Photography Tips",
  //     channel: "Art & Design",
  //     views: "23K",
  //     time: "1 day ago",
  //     thumbnail:
  //       "https://www.seoclerk.com/pics/000/938/565/1ae9c77cca311faf4fa313caa54ff0f8.jpg",
  //   },
  // ];

  // const subscriptionData = [
  //   {
  //     name: "Sarah Gaming",
  //     viewers: "2.5K",
  //     live: true,
  //     avatar: "https://avatar.iran.liara.run/public/92",
  //   },
  //   {
  //     name: "Tech Reviews",
  //     time: "2h ago",
  //     avatar: "https://avatar.iran.liara.run/public/92",
  //   },
  //   {
  //     name: "Art & Design",
  //     viewers: "856",
  //     live: true,
  //     avatar: "https://avatar.iran.liara.run/public/92",
  //   },
  //   {
  //     name: "Music Channel",
  //     time: "1h ago",
  //     avatar: "https://avatar.iran.liara.run/public/92",
  //   },
  //   {
  //     name: "Travel Vlogs",
  //     viewers: "1.2K",
  //     live: true,
  //     avatar: "https://avatar.iran.liara.run/public/92",
  //   },
  // ];
  console.log(following, "FOllowiernsfd");
  const [subscriptionData, setSubscriptionData] = useState<any[]>([]);
  const [videoData, setVideoData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const newSubscriptions: any[] = [];
      const newVideos: any[] = [];

      for (const uid of following) {
        // 1. Fetch influencer info from Firestore
        const docRef = doc(db, "influencers", uid);
        const snapshot = await getDoc(docRef);

        if (snapshot.exists()) {
          const data = snapshot.data();
          newSubscriptions.push({ ...data, uid });

          // 2. Fetch video thumbnails from Firebase Storage
          const videoRef = ref(storage, `savedVideos/${uid}`);
          try {
            const items = await listAll(videoRef);

            const videoThumbs = await Promise.all(
              items.items.map(async (itemRef) => {
                const url = await getDownloadURL(itemRef);
                return {
                  thumbnail: url,
                  title: itemRef.name,
                  channel: data.name,
                  views: Math.floor(Math.random() * 100) + "K",
                  time: "Just now",
                };
              })
            );

            newVideos.push(...videoThumbs);
          } catch (err) {
            console.log(`No videos for ${uid}`, err);
          }
        }
      }

      setSubscriptionData(newSubscriptions);
      setVideoData(newVideos);
    };

    if (following && following.length > 0) {
      fetchData();
    }
  }, [following]);
  return (
    <StyledBox className="!my-16 rounded-md !p-0">
      <Grid container p={0}>
        <Grid item xs={12} sm={3}>
          <SidebarBox sx={{ backgroundColor: "#121212", height: "100%" }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontSize: "18px", color: "white !important" }}
            >
              Subscriptions
            </Typography>
            {subscriptionData?.map((sub, index) => (
              <Box key={index} display="flex" alignItems="center" mb={1}>
                <Avatar
                  src={sub.profilePic}
                  sx={{ width: 40, height: 40, mr: 1 }}
                />
                <Box>
                  <Typography variant="body1">{sub.name}</Typography>
                  {sub.live ? (
                    <Typography variant="caption" color="error">
                      Live • {sub.viewers} watching
                    </Typography>
                  ) : (
                    <Typography variant="caption">{sub.time}</Typography>
                  )}
                </Box>
              </Box>
            ))}
          </SidebarBox>
        </Grid>
        <Grid item xs={12} sm={9}>
          <ContentBox>
            <Typography
              variant="h6"
              gutterBottom
              color="white"
              sx={{ fontSize: "18px", color: "white !important" }}
            >
              Recent Uploads
            </Typography>
            <Grid container spacing={2}>
              {videoData.map((video, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <VideoCard>
                    <Box sx={{ position: "relative" }}>
                      <VideoThumbnail
                        src={
                          "https://www.seoclerk.com/pics/000/938/565/1ae9c77cca311faf4fa313caa54ff0f8.jpg"
                        }
                        alt={video.title}
                      />
                      <WatchNowButton>
                        <PlayArrowIcon /> Watch Now
                      </WatchNowButton>
                    </Box>
                    <VideoInfo>
                      <Typography
                        variant="subtitle1"
                        sx={{ color: "white !important" }}
                      >
                        {video.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ color: "gray !important" }}
                      >
                        {video.channel}
                      </Typography>
                      <Box display="flex" alignItems="center">
                        <VisibilityIcon
                          fontSize="small"
                          // color="textSecondary"
                          sx={{ mr: 0.5 }}
                        />
                        <Typography
                          variant="caption"
                          color="textSecondary"
                          sx={{ color: "gray !important" }}
                        >
                          {video.views} views
                        </Typography>
                        <Typography
                          variant="caption"
                          color="textSecondary"
                          ml={1}
                        >
                          {video.time}
                        </Typography>
                      </Box>
                    </VideoInfo>
                  </VideoCard>
                </Grid>
              ))}
            </Grid>
          </ContentBox>
        </Grid>
      </Grid>
    </StyledBox>
  );
};
