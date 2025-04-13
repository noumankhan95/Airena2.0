"use client";

import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Divider,
  Card,
  CardContent,
  Tooltip,
} from "@mui/material";
import { useEffect, useState } from "react";
import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import Charts from "@/components/VendorsPanel/Charts";
import useVendorstore from "@/store/vendorPanel/VendorsInfo";

export default function VendorAnalytics() {
  const {
    info: { uid, name, email },
  } = useVendorstore();

  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const vendorDoc = await getDoc(doc(db, "vendorAnalytics", name));
        if (vendorDoc.exists()) {
          setData(vendorDoc.data());
        } else {
          console.error("Vendor analytics not found.");
        }
      } catch (error) {
        console.error("Error fetching vendor analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    if (uid) {
      fetchAnalytics();
    }
  }, [uid]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <CircularProgress />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-8 text-gray-500">
        No analytics data found.
      </div>
    );
  }

  return (
    <Box sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h5" component="h2" fontWeight="bold">
        Vendor Analytics
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
              Vendor Name
            </Typography>
            <Typography variant="body1">{name || "N/A"}</Typography>
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
              Vendor Email
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

            <Tooltip
              title="This revenue is excluding influencer commission."
              arrow
            >
              <Typography variant="body1" sx={{ cursor: "help" }}>
                {data.totalRevenue + " INR" || "N/A"}
              </Typography>
            </Tooltip>
          </CardContent>
        </Card>
      </Box>
      <Divider sx={{ my: 3 }} />
      <Typography variant="h6" component="h3" sx={{ mt: 4 }}>
        Best-Selling Products
      </Typography>
      <Charts analytics={data} />
    </Box>
  );
}
