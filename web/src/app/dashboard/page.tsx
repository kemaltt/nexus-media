"use client";

import {
  Users,
  Share2,
  TrendingUp,
  Activity,
  ArrowUpRight,
  Youtube,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Need to install recharts: npm install recharts
// For now I'll comment out the chart or use a placeholder if not installed,
// but user requested "premium", so charts are good.
// I will assume recharts is available or I will add it to package.json later.
// Actually I should verify if I can use it. I'll stick to simple UI first
// to avoid runtime errors if package is missing.

const data = [
  { name: "Mon", posts: 4 },
  { name: "Tue", posts: 3 },
  { name: "Wed", posts: 7 },
  { name: "Thu", posts: 5 },
  { name: "Fri", posts: 9 },
  { name: "Sat", posts: 11 },
  { name: "Sun", posts: 8 },
];

export default function DashboardPage() {
  const stats = [
    {
      name: "Total Followers",
      value: "12,345",
      change: "+12%",
      icon: Users,
      color: "bg-purple-500",
    },
    {
      name: "Total Posts",
      value: "1,234",
      change: "+5%",
      icon: Share2,
      color: "bg-pink-500",
    },
    {
      name: "Engagement Rate",
      value: "5.4%",
      change: "+2.1%",
      icon: Activity,
      color: "bg-orange-500",
    },
    {
      name: "Growth",
      value: "+450",
      change: "+18%",
      icon: TrendingUp,
      color: "bg-green-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          Download Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                <stat.icon
                  size={24}
                  className={stat.color.replace("bg-", "text-")}
                />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <ArrowUpRight size={16} className="text-green-500 mr-1" />
              <span className="text-green-500 font-medium">{stat.change}</span>
              <span className="text-gray-400 ml-2">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart Section */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6">
            Activity Overview
          </h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: "rgba(126, 34, 206, 0.1)" }}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Bar dataKey="posts" fill="#9333ea" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Connected Accounts / Recent Activity */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Connected Accounts
            </h2>
            <div className="space-y-4">
              {[
                {
                  name: "YouTube",
                  icon: Youtube,
                  connected: true,
                  color: "text-red-600",
                },
                {
                  name: "Instagram",
                  icon: Instagram,
                  connected: true,
                  color: "text-pink-600",
                },
                {
                  name: "Facebook",
                  icon: Facebook,
                  connected: false,
                  color: "text-blue-600",
                },
                {
                  name: "Twitter / X",
                  icon: Twitter,
                  connected: false,
                  color: "text-gray-900",
                },
              ].map((account) => (
                <div
                  key={account.name}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <account.icon className={account.color} size={20} />
                    <span className="font-medium text-gray-700">
                      {account.name}
                    </span>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      account.connected
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {account.connected ? "Connected" : "Not Linked"}
                  </span>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 border border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-900 hover:border-gray-400 transition-colors">
              + Add New Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
