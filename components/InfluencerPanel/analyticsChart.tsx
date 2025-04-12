import { useEffect, useState } from "react";
import { db } from "@/firebase"; // Firebase config
import { doc, getDoc } from "firebase/firestore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import useInfluencersInfo from "@/store/influencerPanel/OwnersInfo";

import { Card, CardContent, Typography, Grid, Box } from "@mui/material";
import moment from "moment"; // To format timestamps

const StreamAnalytics = () => {
  const [analytics, setAnalytics] = useState<any>({
    totalStreams: 0,
    totalViews: 0,
    totalStreamTime: 0,
    mostViewedStream: "",
    mostViewedCount: 0,
    lastActiveTime: "",
    mostStreamedCategory: "",
    categoryChartData: [],
    chartData: [],
  });

  const { uid } = useInfluencersInfo();

  useEffect(() => {
    const fetchStreamData = async () => {
      if (!uid) return;

      try {
        const userStreamsRef = doc(db, "streams", uid);
        const userStreamsSnap = await getDoc(userStreamsRef);

        if (userStreamsSnap.exists()) {
          const streams = Object.values(userStreamsSnap.data());

          let totalStreams = streams.length;
          let totalViews = 0;
          let totalStreamTime = 0;
          let mostViewedStream = "";
          let mostViewedCount = 0;
          let lastActiveTime = "";
          let categoryCounts: Record<string, number> = {};

          streams.forEach((stream) => {
            totalViews += stream.totalViews || 0;
            totalStreamTime += stream.streamDuration || 0;

            if (stream.totalViews > mostViewedCount) {
              mostViewedCount = stream.totalViews;
              mostViewedStream = stream.title;
            }

            if (stream.category) {
              categoryCounts[stream.category] =
                (categoryCounts[stream.category] || 0) + 1;
            }

            if (stream.timestamp) {
              const streamDate = moment(stream.timestamp.toDate());
              if (!lastActiveTime || streamDate.isAfter(lastActiveTime)) {
                lastActiveTime = streamDate.format("MMMM D, YYYY h:mm A");
              }
            }
          });

          const mostStreamedCategory = Object.keys(categoryCounts).reduce(
            (a, b) => (categoryCounts[a] > categoryCounts[b] ? a : b),
            ""
          );

          const categoryChartData = Object.keys(categoryCounts).map(
            (category) => ({
              category,
              value: categoryCounts[category],
            })
          );

          const chartData = [
            {
              category: "Total Views",
              value: totalViews,
            },
            {
              category: "Total Duration (mins)",
              value: totalStreamTime,
            },
          ];

          setAnalytics({
            totalStreams,
            totalViews,
            totalStreamTime,
            mostViewedStream,
            mostViewedCount,
            lastActiveTime,
            mostStreamedCategory,
            categoryChartData,
            chartData,
          });
        }
      } catch (error) {
        console.error("Error fetching stream data:", error);
      }
    };

    fetchStreamData();
  }, [uid]);
  console.log(analytics);
  return (
    <Box sx={{ p: 4, bgcolor: "background.default", borderRadius: 2 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        📊 Stream Analytics
      </Typography>

      {/* Stats Grid */}
      <Grid container spacing={3}>
        {[
          { label: "Total Streams", value: analytics.totalStreams },
          { label: "Total Views", value: analytics.totalViews },
          {
            label: "Total Stream Time (mins)",
            value: analytics.totalStreamTime,
          },
          {
            label: "Most Viewed Stream",
            value: `${analytics.mostViewedStream} (${analytics.mostViewedCount} views)`,
          },
          //   {
          //     label: "Last Active Time",
          //     value: analytics.lastActiveTime || "No Data",
          //   },
          {
            label: "Most Streamed Category",
            value: analytics.mostStreamedCategory || "No Data",
          },
        ].map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ bgcolor: "grey.900", color: "white", p: 2 }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold">
                  {stat.label}
                </Typography>
                <Typography variant="h6">{stat.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* 📊 Combined Bar Chart for Total Views & Total Duration */}
      <Box mt={4}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Overall Stream Statistics
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analytics.chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </Box>

      {/* 📊 Bar Chart for Most Streamed Categories */}
      <Box mt={4}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Most Streamed Categories
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analytics.categoryChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default StreamAnalytics;
