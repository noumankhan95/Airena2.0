"use client";
import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Grid } from "@mui/material";
import useOwnersStore from "@/store/dealersPanel/OwnersInfo";
import useAdminOwnerStore from "@/store/adminPanel/AdminOwnersInfo";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import { toast } from "react-toastify";
import AdminAnalytics from "@/components/AdminPanel/Charts";

function AdminPage() {
  const {
    info: { name, email },
  } = useAdminOwnerStore();
  const [registeredDealers, setregisteredDealers] = useState<number>(0);
  const [registeredBrands, setregisteredBrands] = useState<number>(0);

  const fetchdealers = async () => {
    try {
      const dealers = await getDocs(collection(db, "influencers"));
      const brands = await getDocs(collection(db, "vendors"));

      setregisteredDealers(dealers.docs.length);
      setregisteredBrands(brands.docs.length);
    } catch (e) {
      toast.error("couldnt Fetch Information");
    }
  };
  useEffect(() => {
    fetchdealers();
  }, []);
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
        sx={{ color: "#333", marginBottom: 4 }}
      >
        Welcome to Admin Panel
      </Typography>
      <Grid container spacing={4}>
        {/* Name */}
        {/* <Grid item xs={12} sm={6} md={4}>
          <Paper
            sx={{
              padding: 4,
              textAlign: "center",
              borderRadius: "16px",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
            
              height: 160,
            }}
          >
            <Typography
              variant="h4"
              fontWeight="bold"
              color="primary"
              gutterBottom
            >
              Name
            </Typography>
            <Typography variant="body1">
              {name || "N/A"}
            </Typography>
          </Paper>
        </Grid> */}

        {/* Email */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper
            sx={{
              padding: 4,
              textAlign: "center",
              borderRadius: "16px",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
              backgroundColor: "#040907",
              height: 160,
            }}
          >
            <Typography
              variant="h4"
              fontWeight="bold"
              color="primary"
              gutterBottom
            >
              Logged In as
            </Typography>
            <Typography variant="body1">{email || "N/A"}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper
            sx={{
              padding: 4,
              textAlign: "center",
              borderRadius: "16px",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
              backgroundColor: "#040907",
              height: 160,
            }}
          >
            <Typography
              variant="h4"
              fontWeight="bold"
              color="primary"
              gutterBottom
            >
              Total Registered Creators
            </Typography>
            <Typography variant="body1">{registeredDealers}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper
            sx={{
              padding: 4,
              textAlign: "center",
              borderRadius: "16px",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
              backgroundColor: "#040907",
              height: 160,
            }}
          >
            <Typography
              variant="h4"
              fontWeight="bold"
              color="primary"
              gutterBottom
            >
              Total Registered Brands
            </Typography>
            <Typography variant="body1">{registeredBrands}</Typography>
          </Paper>
        </Grid>
      </Grid>
      <AdminAnalytics />
    </Box>
  );
}

export default AdminPage;
