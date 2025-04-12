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
  CircularProgress,
  Typography,
  Card,
  CardContent,
  Button,
  ButtonGroup,
} from "@mui/material";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { format, subDays, isAfter } from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import useOwnersStore from "@/store/dealersPanel/OwnersInfo";

interface Order {
  id: string;
  total_price: string;
  created_at: string;
  financial_status: string;
  fulfillment_status: string;
  line_items: { title: string; quantity: number }[];
}

export default function UserAnalyticsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRange, setSelectedRange] = useState(7); // Default to 7 days
  const {
    info: { email: userEmail },
  } = useOwnersStore();
  const [analytics, setAnalytics] = useState({
    totalSpent: 0,
    totalOrders: 0,
    avgOrderValue: 0,
    lastOrderDate: null,
    canceledOrders: 0,
    mostPurchasedItems: [] as [string, number][],
    monthlySpending: [] as { month: string; spending: number }[],
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders(selectedRange);
  }, [orders, selectedRange]);

  async function fetchOrders() {
    setLoading(true);
    try {
      const res = await fetch(`/api/user/fetchOrders?email=${userEmail}`);
      const data = await res.json();
      setOrders(data.orders);
      filterOrders(selectedRange, data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }

  function filterOrders(days: number, orderList = orders) {
    const cutoffDate = subDays(new Date(), days);
    const filtered = orderList?.filter((order) =>
      isAfter(new Date(order.created_at), cutoffDate)
    );
    setFilteredOrders(filtered);
    calculateAnalytics(filtered);
  }

  function calculateAnalytics(orders: Order[]) {
    if (!orders?.length) return;

    let totalSpent = 0;
    let canceledOrders = 0;
    let itemFrequency: Record<string, number> = {};
    let monthlySpending: Record<string, number> = {};

    orders.forEach((order) => {
      if (order.financial_status === "voided") {
        canceledOrders++;
      } else {
        totalSpent += parseFloat(order.total_price);
      }

      order.line_items.forEach((item) => {
        itemFrequency[item.title] =
          (itemFrequency[item.title] || 0) + item.quantity;
      });

      const orderMonth = format(new Date(order.created_at), "MMM yyyy");
      monthlySpending[orderMonth] =
        (monthlySpending[orderMonth] || 0) + parseFloat(order.total_price);
    });

    const totalOrders = orders?.length;
    const avgOrderValue = totalOrders ? totalSpent / totalOrders : 0;
    const lastOrderDate = orders[0]?.created_at || null;
    const mostPurchasedItems = Object.entries(itemFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3); // Top 3 most purchased items
    const formattedMonthlySpending = Object.entries(monthlySpending).map(
      ([month, spending]) => ({ month, spending })
    );

    setAnalytics({
      totalSpent,
      totalOrders,
      avgOrderValue,
      //@ts-ignore
      lastOrderDate,
      canceledOrders,
      mostPurchasedItems,
      monthlySpending: formattedMonthlySpending,
    });
  }

  return (
    <div className="p-6 min-h-screen">
      <Typography variant="h5" className="text-indigo-700 font-bold mb-6">
        User Order Analytics
      </Typography>
      <FormControl className="!my-6 w-48">
        <InputLabel>Date Range</InputLabel>
        <Select
          value={selectedRange}
          onChange={(e) => setSelectedRange(e.target.value as number)}
        >
          <MenuItem value={7}>Last 7 Days</MenuItem>
          <MenuItem value={15}>Last 15 Days</MenuItem>
          <MenuItem value={30}>Last 30 Days</MenuItem>
        </Select>
      </FormControl>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <CircularProgress />
        </div>
      ) : (
        <>
          {/* Toggle Buttons */}
          {/* Analytics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <Card className="shadow-lg">
              <CardContent>
                <Typography variant="h5" className="text-gray-600">
                  Total Spent
                </Typography>
                <Typography
                  variant="body1"
                  className="text-indigo-700 font-bold"
                >
                  INR {analytics.totalSpent.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
            <Card className="shadow-lg">
              <CardContent>
                <Typography variant="h5" className="text-gray-600">
                  Total Orders
                </Typography>
                <Typography
                  variant="body1"
                  className="text-indigo-700 font-bold"
                >
                  {analytics.totalOrders}
                </Typography>
              </CardContent>
            </Card>
            <Card className="shadow-lg">
              <CardContent>
                <Typography variant="h5" className="text-gray-600">
                  Average Order Value
                </Typography>
                <Typography
                  variant="body1"
                  className="text-indigo-700 font-bold"
                >
                  INR {analytics.avgOrderValue.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </div>
          {/* Bar Chart - Top 3 Most Purchased Items */}
          <div className="p-4 shadow-lg rounded-lg mb-6">
            <Typography variant="h6" className="text-gray-600 mb-4">
              Most Purchased Items
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={analytics.mostPurchasedItems.map(([name, sales]) => ({
                  name,
                  sales,
                }))}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1E293B", // Dark background for tooltip
                    color: "#E2E8F0", // Light text color
                    borderRadius: "8px", // Rounded corners for the tooltip
                    border: "none", // No border
                  }}
                  itemStyle={{
                    color: "#E2E8F0", // Light text color for the item
                  }}
                />
                <Bar dataKey="sales" fill="#46c190" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Line Chart - Monthly Spending Trend */}
          <div className="p-4 shadow-lg rounded-lg">
            <Typography variant="h6" className="text-gray-600 mb-4">
              Monthly Spending Trend
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.monthlySpending}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1E293B",
                    color: "#E2E8F0",
                    borderRadius: "8px",
                    border: "none",
                  }}
                />
                <Line type="monotone" dataKey="spending" stroke="#46c190" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}
