"use client";

import { useEffect, useState } from "react";
import { db, storage } from "@/firebase"; // Ensure storage is correctly exported
import { collection, getDocs } from "firebase/firestore";
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
import ReactPlayer from "react-player";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
export default function StreamsPage() {
  const [streams, setStreams] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedStream, setSelectedStream] = useState<any>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllStreams = async () => {
      setLoading(true);
      try {
        const savedStreamsRef = collection(db, "savedStreams");
        const querySnapshot = await getDocs(savedStreamsRef);

        let allStreams: any[] = [];
        querySnapshot.forEach((doc) => {
          const userStreams = doc.data().streams || [];
          allStreams = [...allStreams, ...userStreams];
        });

        setStreams(allStreams);
      } catch (error) {
        toast.error("Error fetching streams");
      } finally {
        setLoading(false);
      }
    };

    fetchAllStreams();
  }, []);

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

  return (
    <Container
      className="p-6 bg-gradient-to-b min-h-screen"
      sx={{ background: "transparent" }}
    >
      <Typography variant="h4" className="text-white text-center !mb-6">
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
          {filteredStreams?.map((stream: any) =>
            stream?.visibility === "public" ? (
              <Grid item xs={12} sm={6} md={4} lg={3} key={uuidv4()}>
                <Card
                  className="bg-gray-800 shadow-lg"
                  onClick={() => handleStreamClick(stream)}
                >
                  {/* Video Thumbnail */}
                  <CardMedia
                    component="img"
                    height="180"
                    image={stream.thumbnailURL}
                    alt={stream.title}
                    className="rounded-t-lg"
                  />

                  <CardContent>
                    {/* Title */}
                    <Typography variant="h6" className="text-white mt-2">
                      {stream.title}
                    </Typography>
                    {stream.name && (
                      <Typography variant="h6" className="text-white mt-2">
                        By {stream.name}
                      </Typography>
                    )}
                    {/* Streamer & Category */}
                    <Typography variant="body2" className="text-gray-400">
                      {stream.category}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ) : null
          )}
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
