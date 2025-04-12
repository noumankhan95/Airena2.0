"use client";

import { Card, CardContent } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Bar,
  BarChart,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Charts({ analytics }: { analytics: any }) {
  const orders = analytics.orders || [];

  // Prepare data
  const revenueData = orders.map((order: any) => ({
    date: new Date(order.createdAt).toLocaleDateString(),
    revenue: Number(order.totalPrice) - order.influencerCommission,
  }));

  const ordersData = orders.reduce((acc: any, order: any) => {
    const date = new Date(order.createdAt).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const ordersChartData = Object.keys(ordersData).map((date) => ({
    date,
    orders: ordersData[date],
  }));

  const commissionsData = orders.map((order: any) => ({
    date: new Date(order.createdAt).toLocaleDateString(),
    commission: order.influencerCommission,
  }));

  const userOrderCounts = orders.reduce((acc: any, order: any) => {
    acc[order.userId] = (acc[order.userId] || 0) + 1;
    return acc;
  }, {});

  const topCustomers = Object.entries(userOrderCounts)
    .map(([userId, count]) => ({
      userId,
      count,
    }))
    //@ts-ignore
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1"];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Revenue Over Time */}
      <Card>
        <CardContent>
          <h3 className="text-lg font-semibold mb-4">Revenue Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Orders Over Time */}
      <Card>
        <CardContent>
          <h3 className="text-lg font-semibold mb-4">Orders Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ordersChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="orders" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Commission Paid Over Time */}
      <Card>
        <CardContent>
          <h3 className="text-lg font-semibold mb-4">
            Commission Paid Over Time
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={commissionsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="commission" stroke="#ff8042" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Customers */}
      <Card>
        <CardContent>
          <h3 className="text-lg font-semibold mb-4">Top Customers</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                dataKey="count"
                isAnimationActive={false}
                data={topCustomers}
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={(entry) => entry.userId.substring(0, 6)}
              >
                {topCustomers.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
