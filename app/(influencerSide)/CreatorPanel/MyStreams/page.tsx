"use client";

import { useEffect, useState } from "react";
import { db, storage } from "@/firebase"; // make sure you export storage from firebase.js
import { collection, doc, getDoc } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { deleteObject } from "firebase/storage";
import { setDoc } from "firebase/firestore";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Grid,
  TextField,
  CircularProgress,
  Container,
  Dialog,
  DialogContent,
  Box,
  Button,
} from "@mui/material";
import useInfluencersInfo from "@/store/influencerPanel/OwnersInfo";
import ReactPlayer from "react-player";
import { toast } from "react-toastify";
import { v4 } from "uuid";
export default function StreamsPage() {
  const [streams, setStreams] = useState<any>();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedStream, setSelectedStream] = useState<any>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const { uid } = useInfluencersInfo();

  useEffect(() => {
    const fetchStreams = async () => {
      if (!uid) return;

      try {
        const userDocRef = doc(db, "savedStreams", uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          setStreams(userDocSnap.data().streams || []);
        } else {
          toast.error("No streams found for this user.");
        }
      } catch (error) {
        toast.error("Error fetching streams");
      }
    };

    fetchStreams();
  }, [uid]);

  // Function to handle video fetch and modal opening
  const handleStreamClick = async (stream: any) => {
    try {
      setVideoUrl(stream.videoURL);
      setSelectedStream(stream);
    } catch (error) {
      toast.error("Failed to load video");
    }
  };

  // Filter streams based on search input
  const filteredStreams = streams?.filter((stream: any) =>
    stream?.title?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDeleteStream = async (stream: any) => {
    if (!uid || !stream) return;

    try {
      // Step 1: Delete video from Firebase Storage (optional if you store the path)
      const videoRef = ref(
        storage,
        `savedVideos/${uid}/${stream.videoName}`
      );
      await deleteObject(videoRef);

      const thumbRef = ref(
        storage,
        `savedThumbnails/${uid}/${stream.thumbnailName}`
      );
      await deleteObject(thumbRef);
      // Step 2: Remove stream from Firestore array
      const userDocRef = doc(db, "savedStreams", uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const updatedStreams = (userDocSnap.data().streams || []).filter(
          (item: any) => item.videoURL !== stream.videoURL
        );

        await setDoc(userDocRef, { streams: updatedStreams });
        setStreams(updatedStreams);

        toast.success("Stream deleted successfully!");
      }

      // Step 3: Close modal
      setSelectedStream(null);
      setVideoUrl(null);
    } catch (error) {
      console.error("Error deleting stream: ", error);
      toast.error("Failed to delete stream.");
    }
  };
  console.log("STreams", streams);

  return (
    <Box className="p-6  min-h-screen">
      <Typography variant="h4" className="text-white text-center my-6">
        Discover Amazing Streams
      </Typography>

      {/* Search Bar */}
      <TextField
        variant="outlined"
        placeholder="Search streams, creators, or categories..."
        fullWidth
        onChange={(e) => setSearch(e.target.value)}
        className="!my-6 rounded-md text-white"
        InputProps={{ style: { color: "white" } }}
      />

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-96">
          <CircularProgress />
        </div>
      ) : (
        <Grid container spacing={3} className="hover:cursor-pointer">
          {filteredStreams?.map((stream: any) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              key={v4()}
              sx={{ display: "flex" }}
            >
              <Card
                className="bg-gray-800 shadow-lg"
                sx={{
                  height: "100%", // Let card stretch to match grid item
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
                onClick={() => handleStreamClick(stream)}
              >
                <CardMedia
                  component="img"
                  image={stream.thumbnailURL}
                  alt={stream.title}
                  sx={{
                    height: 180,
                    objectFit: "cover",
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                  }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" className="text-white mt-2" noWrap>
                    {stream.title}
                  </Typography>
                  {stream.name && (
                    <Typography
                      variant="body2"
                      className="text-white mt-1"
                      noWrap
                    >
                      By {stream.name}
                    </Typography>
                  )}
                  <Typography variant="body2" className="text-gray-400" noWrap>
                    {stream.category}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Modal for Video */}
      <Dialog
        open={Boolean(selectedStream)}
        onClose={() => {
          setSelectedStream(null);
          setVideoUrl(null);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogContent className="bg-black">
          <Typography variant="h6" className="text-white mb-2">
            {selectedStream?.title}
          </Typography>
          {videoUrl ? (
            <Box
              sx={{
                position: "relative",
                backgroundColor: "black",
                borderRadius: "8px",
                overflow: "hidden",
                margin: "auto",
              }}
              className="aspect-video p-5 max-w-[640px] mx-auto"
            >
              <ReactPlayer
                url={videoUrl}
                controls
                playing
                width="100%"
                height="100%"
                style={{
                  objectFit: "contain",
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
              />
            </Box>
          ) : (
            <Typography className="text-white">Loading video...</Typography>
          )}
          <Button
            variant="contained"
            color="error"
            onClick={() => handleDeleteStream(selectedStream)}
            className="my-4 "
          >
            Delete Stream
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
