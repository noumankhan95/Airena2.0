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
  Typography,
  CircularProgress,
} from "@mui/material";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "@/firebase"; // make sure your firestore is initialized here
import useOwnersStore from "@/store/dealersPanel/OwnersInfo";

type Order = {
  orderId: string;
  timestamp: string;
  totalPrice: number;
  productId: string;
  productTitle: string;
  email: string;
};

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const {
    info: { uid },
  } = useOwnersStore(); // Make sure you are getting UID here instead of email now

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!uid) return;

        const ordersRef = doc(db, "order", uid);
        const snapshot = await getDoc(ordersRef);

        // const fetchedOrders = snapshot.docs.map((doc) => ({
        //   id: doc.id,
        //   ...doc.data(),
        // })) as Order[];
        if (snapshot.exists()) setOrders(snapshot.data()?.orders);
      } catch (error) {
        // console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [uid]);

  return (
    <div className="p-4">
      <Typography variant="h5" gutterBottom>
        Orders
      </Typography>

      {loading ? (
        <CircularProgress className="mx-auto" />
      ) : orders.length === 0 ? (
        <Typography>No orders found.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Order ID</strong>
                </TableCell>
                <TableCell>
                  <strong>Date</strong>
                </TableCell>
                <TableCell>
                  <strong>Total Price</strong>
                </TableCell>
                <TableCell>
                  <strong>Email</strong>
                </TableCell>
                <TableCell>
                  <strong>Fulfillment Status</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.orderId}>
                  <TableCell>{order.orderId}</TableCell>
                  <TableCell>
                    {new Date(order.timestamp).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{order.totalPrice} INR</TableCell>
                  <TableCell>{order.email}</TableCell>
                  <TableCell>Paid Through Shopify Checkout</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default OrdersPage;
