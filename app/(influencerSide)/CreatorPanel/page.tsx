"use client";
import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";
import useInfluencersInfo from "@/store/influencerPanel/OwnersInfo";

import { db } from "@/firebase";
import StreamAnalytics from "@/components/InfluencerPanel/analyticsChart";

function AdminPage() {
  const { uid, name, email, channel, estimatedEarnings, followers } =
    useInfluencersInfo();

  return (
    <Box
      sx={{
        padding: 4,
        minHeight: "100vh",
      }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        gutterBottom
        align="center"
        sx={{ marginBottom: 4 }}
      >
        Welcome to Creator's Panel
      </Typography>

      <Box display="flex" flexWrap="wrap" gap={4} justifyContent="center">
        <Card
          sx={{
            transition: "transform 0.3s ease-in-out",
            ":hover": { transform: "scale(1.05)" },
          }}
        >
          <CardContent>
            <Typography
              variant="h6"
              fontWeight="bold"
              color="primary"
              gutterBottom
            >
              Name
            </Typography>
            <Typography variant="body1">{channel || name || "N/A"}</Typography>
          </CardContent>
        </Card>

        <Card
          sx={{
            transition: "transform 0.3s ease-in-out",
            ":hover": { transform: "scale(1.05)" },
          }}
        >
          <CardContent>
            <Typography
              variant="h6"
              fontWeight="bold"
              color="primary"
              gutterBottom
            >
              Email
            </Typography>
            <Typography variant="body1">{email || "N/A"}</Typography>
          </CardContent>
        </Card>
        <Card
          sx={{
            transition: "transform 0.3s ease-in-out",
            ":hover": { transform: "scale(1.05)" },
          }}
        >
          <CardContent>
            <Typography
              variant="h6"
              fontWeight="bold"
              color="primary"
              gutterBottom
            >
              Estimated Earnings
            </Typography>
            <Typography variant="body1">
              {estimatedEarnings.toFixed(3) + " INR" || "N/A"}
            </Typography>
          </CardContent>
        </Card>
        <Card
          sx={{
            transition: "transform 0.3s ease-in-out",
            ":hover": { transform: "scale(1.05)" },
          }}
        >
          <CardContent>
            <Typography
              variant="h6"
              fontWeight="bold"
              color="primary"
              gutterBottom
            >
              Subscribed To You
            </Typography>
            <Typography variant="body1">{followers || 0}</Typography>
          </CardContent>
        </Card>
      </Box>
      <StreamAnalytics />
    </Box>
  );
}

export default AdminPage;
