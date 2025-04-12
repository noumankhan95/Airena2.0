"use client";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#d88484"];

export default function ShopifyAnalytics() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [daysFilter, setDaysFilter] = useState<number>(7); // Default filter: Last 7 days

  // Fetch data based on filter
  useEffect(() => {
    fetch(`/api/admin/fetchOrderAnalytics?days=${daysFilter}`)
      .then((res) => res.json())
      .then((data) => setAnalytics(data));
  }, [daysFilter]); // Re-fetch when filter changes

  if (!analytics) return <p className="text-white">Loading analytics...</p>;

  return (
    <div className="p-4 bg-black text-white">
      {/* Filter Selection */}
      <div className="mb-4 flex items-center gap-4">
        <span className="text-lg font-semibold">Filter by:</span>
        <select
          value={daysFilter}
          onChange={(e) => setDaysFilter(Number(e.target.value))}
          className="p-2 rounded bg-gray-800 text-white border border-gray-600"
        >
          <option value={7}>Last 7 Days</option>
          <option value={30}>Last 30 Days</option>
          <option value={90}>Last 90 Days</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Orders Over Time */}
        <div className="p-4 rounded-xl shadow ">
          <h2 className="text-xl font-bold mb-2">Orders Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.ordersPerTime}>
              <XAxis dataKey="date" tick={{ fill: "white" }} />
              <YAxis tick={{ fill: "white" }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#222", color: "#fff" }}
              />
              <Line type="monotone" dataKey="count" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Over Time */}
        <div className="p-4 rounded-xl shadow ">
          <h2 className="text-xl font-bold mb-2">Revenue Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.revenuePerTime}>
              <XAxis dataKey="date" tick={{ fill: "white" }} />
              <YAxis tick={{ fill: "white" }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#222", color: "#fff" }}
              />
              <Line type="monotone" dataKey="revenue" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Selling Products */}
        <div className="p-4 rounded-xl shadow ">
          <h2 className="text-xl font-bold mb-2">Top Selling Products</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.mostSoldItems}>
              <XAxis dataKey="title" tick={{ fill: "white" }} />
              <YAxis tick={{ fill: "white" }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#222", color: "#fff" }}
              />
              <Bar dataKey="quantity" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Methods Distribution */}
        <div className="p-4 rounded-xl shadow ">
          <h2 className="text-xl font-bold mb-2">Payment Methods</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.paymentMethods}
                dataKey="count"
                nameKey="method"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={{ fill: "white" }}
              >
                {analytics.paymentMethods.map((entry: any, index: number) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "white", color: "black" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Orders by Country */}
        <div className="p-4 rounded-xl shadow ">
          <h2 className="text-xl font-bold mb-2">Orders by Country</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.countries}>
              <XAxis dataKey="country" tick={{ fill: "white" }} />
              <YAxis tick={{ fill: "white" }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#222", color: "#fff" }}
              />
              <Bar dataKey="count" fill="#d88484" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
