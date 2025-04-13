"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  CircularProgress,
  Box,
  Typography,
  Button,
} from "@mui/material";
import useVendorstore from "@/store/vendorPanel/VendorsInfo";

interface Order {
  orderId: number;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  productTitle: string;
  quantity: number;
  price: number;
  total: number;
}

export default function VendorOrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(null); // URL for next page
  const [prevPageUrl, setPrevPageUrl] = useState<string | null>(null); // URL for previous page
  const {
    info: { uid, name: vendorName },
  } = useVendorstore();
  const fetchVendorOrders = async (url?: string) => {
    try {
      setLoading(true);
      const requestUrl =
        url ||
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/vendor/fetch_analytics?vendor=${vendorName}`; // Use provided URL or default URL
      const response = await fetch(requestUrl);
      const data = await response.json();

      // Set the fetched orders and pagination URLs
      setOrders(data.orders || []);
      setFilteredOrders(data.orders || []);
      setNextPageUrl(data.nextPageUrl);
      setPrevPageUrl(data.prevPageUrl);
    } catch (error) {
      console.error("Error fetching vendor orders:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (vendorName) {
      fetchVendorOrders();
    }
  }, [vendorName]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    const filtered = orders.filter(
      (order) =>
        order.customerName.toLowerCase().includes(value) ||
        order.customerEmail.toLowerCase().includes(value) ||
        order.productTitle.toLowerCase().includes(value)
    );
    setFilteredOrders(filtered);
  };

  const loadNextPage = () => {
    if (nextPageUrl) {
      fetchVendorOrders(nextPageUrl);
    }
  };

  const loadPreviousPage = () => {
    if (prevPageUrl) {
      fetchVendorOrders(prevPageUrl);
    }
  };

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-64">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="p-4">
      <Typography variant="h6" gutterBottom>
        Orders for Brand: {vendorName}
      </Typography>

      <TextField
        label="Search by product"
        variant="outlined"
        fullWidth
        value={search}
        onChange={handleSearchChange}
        className="mb-4"
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Qty</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.map((order, index) => (
              <TableRow key={index}>
                <TableCell>{order.orderId}</TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>{order.productTitle}</TableCell>
                <TableCell>{order.quantity}</TableCell>
                <TableCell>₹{order.price.toFixed(2)}</TableCell>
                <TableCell>₹{order.total.toFixed(2)}</TableCell>
              </TableRow>
            ))}
            {filteredOrders.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No orders found for the Brand.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box className="flex justify-between mt-4">
        <Button
          variant="outlined"
          onClick={loadPreviousPage}
          disabled={!prevPageUrl}
        >
          Previous
        </Button>
        <Button
          variant="outlined"
          onClick={loadNextPage}
          disabled={!nextPageUrl}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
}
