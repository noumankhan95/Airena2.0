"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { Box, Typography, CircularProgress, Card, CardContent, Divider } from "@mui/material";

const StreamAnalyticsPage = () => {
  const searchParams = useSearchParams();
  const influencerId = searchParams.get("influencerId");
  const streamId = searchParams.get("streamId");

  const [streamData, setStreamData] = useState < any > (null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!influencerId || !streamId) {
      toast.error("Missing stream parameters");
      setLoading(false);
      return;
    }

    const fetchStreamData = async () => {
      try {
        const influencerDocRef = doc(db, "streams", influencerId);
        const influencerDoc = await getDoc(influencerDocRef);

        if (!influencerDoc.exists()) {
          toast.error("Influencer not found!");
          setLoading(false);
          return;
        }

        const influencerData = influencerDoc.data();
        const streamData = influencerData?.[streamId];

        if (streamData) {
          setStreamData(streamData);
        } else {
          toast.error("Stream not found for this influencer!");
        }
      } catch (error) {
        console.error("Error fetching stream data:", error);
        toast.error("Error fetching stream data");
      } finally {
        setLoading(false);
      }
    };

    fetchStreamData();
  }, [influencerId, streamId]);

  if (loading) {
    return (
      <Box className="flex items-center justify-center h-screen">
        <CircularProgress />
      </Box>
    );
  }

  if (!streamData) {
    return (
      <Box className="flex items-center justify-center h-screen">
        <Typography variant="h6" color="error">
          No stream data found.
        </Typography>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
        Stream Analytics
      </Typography>

      <Card sx={{ maxWidth: 600, mx: "auto", mt: 4, p: 2 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            {streamData.title || "Untitled Stream"}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Box display="flex" flexDirection="column" gap={2}>
            <Typography variant="body1">
              <strong>Stream ID:</strong> {streamId}
            </Typography>

            <Typography variant="body1">
              <strong>Playback ID:</strong> {streamData.playbackId || "N/A"}
            </Typography>

            <Typography variant="body1">
              <strong>Status:</strong> {streamData.status || "N/A"}
            </Typography>

            <Typography variant="body1">
              <strong>View Count:</strong> {streamData.viewCount || "0"}
            </Typography>

            <Typography variant="body1">
              <strong>Created At:</strong>{" "}
              {streamData.createdAt
                ? new Date(streamData.createdAt).toLocaleString()
                : "N/A"}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default StreamAnalyticsPage;
