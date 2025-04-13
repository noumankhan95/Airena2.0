"use client";

import {
  Box,
  Typography,
  CircularProgress,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useEffect, useState } from "react";
import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import useVendorstore from "@/store/vendorPanel/VendorsInfo";

export default function VendorAnalytics() {
  const {
    info: { uid, name },
  } = useVendorstore();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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
  }, [uid, name]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <CircularProgress />
      </div>
    );
  }

  if (!data || !data.orders) {
    return (
      <Box className="flex justify-center items-center h-64">
        <Typography>No Analytics Data Found</Typography>
      </Box>
    );
  }

  const filteredOrders = data.orders.filter(
    (order: any) =>
      order.influencerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.influencerId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.orderId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp.toDate();
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <Box className="p-4">
      <Typography variant="h4" gutterBottom>
        Vendor Analytics
      </Typography>

      <TextField
        label="Search by Influencer Name, ID, or Order ID"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ margin: "16px 0" }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Order ID</strong>
              </TableCell>
              <TableCell>
                <strong>Influencer Name</strong>
              </TableCell>
              <TableCell>
                <strong>Influencer ID</strong>
              </TableCell>
              <TableCell>
                <strong>Commission</strong>
              </TableCell>
              <TableCell>
                <strong>Total Price</strong>
              </TableCell>
              <TableCell>
                <strong>Created At</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.map((order: any, idx: number) => (
              <TableRow key={idx}>
                <TableCell>{order.orderId}</TableCell>
                <TableCell>{order.influencerName}</TableCell>
                <TableCell>{order.influencerId}</TableCell>
                <TableCell>₹{order.influencerCommission}</TableCell>
                <TableCell>₹{order.totalPrice}</TableCell>
                <TableCell>
                  {new Date(order.createdAt).toDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
