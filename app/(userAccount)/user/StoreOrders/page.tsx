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
  Button,
} from "@mui/material";
import useOwnersStore from "@/store/dealersPanel/OwnersInfo";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const {
    info: { email: userEmail },
  } = useOwnersStore();
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `/api/user/fetchOrders?email=${userEmail}`
        );
        const data = await response.json();
        if (response.ok) {
          setOrders(data.orders);
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
      setLoading(false);
    };

    if (userEmail) fetchOrders();
  }, [userEmail]);
  console.log("Orders", orders);
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
                  <strong>Payment Status</strong>
                </TableCell>
                <TableCell>
                  <strong>Fulfillment Status</strong>
                </TableCell>
                <TableCell>
                  <strong>Actions</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order: Order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>
                    <Typography variant="body1">
                      {new Date(order.created_at).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1">
                      ${order.total_price}
                    </Typography>
                  </TableCell>
                  <TableCell>{order.financial_status}</TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      className="bg-green-500 !text-white text-center rounded-lg"
                    >
                      {order.fulfillment_status || "Pending"}
                    </Typography>{" "}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={() => {
                        const shopifyOrderUrl = `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/account/orders/${order.id}`;
                        window.open(shopifyOrderUrl, "_blank");
                      }}
                    >
                      View Details
                    </Button>
                  </TableCell>
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
