"use client";
import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";
import useInfluencersInfo from "@/store/influencerPanel/OwnersInfo";

import { db } from "@/firebase";
import StreamAnalytics from "@/components/InfluencerPanel/analyticsChart";

function AdminPage() {
  const { uid, name, email, channel, estimatedEarnings, followers } =
    useInfluencersInfo();
  console.log("User id is", uid);
  // const [analytics, setAnalytics] = useState({
  //   totalStreamTime: 0,
  //   totalViews: 0,
  //   lastActive: "N/A",
  //   streams: [],
  // });

  // useEffect(() => {
  //   if (!uid) return;

  //   const fetchAnalytics = async () => {
  //     const streamsRef = doc(db, "streams", uid);
  //     const querySnapshot = await getDoc(streamsRef);
  //     let totalTime = 0;
  //     let totalViews = 0;
  //     let lastActive = "N/A";
  //     let streamData: any = [];

  //     //@ts-ignore
  //     Object.values(querySnapshot.data()).forEach((data) => {
  //       console.log(data);
  //       totalTime += data.streamDuration || 0;
  //       totalViews += data.totalViews || 0;
  //       lastActive = data.lastActiveTime || lastActive;
  //       streamData.push({
  //         title: data.title,
  //         duration: data.streamDuration || 0,
  //         views: data.totalViews || 0,
  //       });
  //     });

  //     setAnalytics({
  //       totalStreamTime: Number((totalTime / 3600).toFixed(1)),
  //       totalViews: totalViews,
  //       lastActive: lastActive,
  //       streams: streamData,
  //     });
  //   };

  //   fetchAnalytics();
  // }, [uid]);
  // console.log(analytics);
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

      {/* <Card className="p-6 rounded-lg my-5">
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Your Dashboard Overview
        </Typography>
        <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={4}>
          <Card className="p-4">Total Views: {analytics?.totalViews}</Card>
          <Card className="p-4">
            Total Stream Time: {analytics?.totalStreamTime} h
          </Card>
          <Card className="p-4">
            Last Active: {new Date(analytics?.lastActive).toDateString()}
          </Card>
        </Box>
      </Card> */}
      <StreamAnalytics />

      {/* <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={[{ name: "Total Streams", value: analytics?.streams.length }]}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer> */}

      {/* <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={[
            {
              name: "Total Stream Time (mins)",
              value: analytics?.totalStreamTime,
            },
          ]}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer> */}

      {/* <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={[{ name: "Total Views", value: analytics?.totalViews }]}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#f97316" />
        </BarChart>
      </ResponsiveContainer> */}
    </Box>
  );
}

export default AdminPage;
