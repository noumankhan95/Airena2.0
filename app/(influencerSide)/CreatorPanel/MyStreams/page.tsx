"use client";

import { useEffect, useState } from "react";
import { db, storage } from "@/firebase"; // make sure you export storage from firebase.js
import { collection, doc, getDoc } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
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
      // if (!stream.videoPath) {
      //   toast.error("Video path not found");
      //   return;
      // }
      // const videoRef = ref(storage, stream.videoPath);
      // const url = await getDownloadURL(videoRef);
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

  return (
    <Container className="p-6 bg-gradient-to-b min-h-screen">
      <Typography variant="h4" className="text-white text-center mb-6">
        Discover Amazing Streams
      </Typography>

      {/* Search Bar */}
      <TextField
        variant="outlined"
        placeholder="Search streams, creators, or categories..."
        fullWidth
        onChange={(e) => setSearch(e.target.value)}
        className="!mb-6 rounded-md text-white"
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
            <div className="aspect-w-16 aspect-h-9 w-full">
              <ReactPlayer
                url={videoUrl}
                controls
                width="100%"
                height="100%"
                playing
              />
            </div>
          ) : (
            <Typography className="text-white">Loading video...</Typography>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
}
