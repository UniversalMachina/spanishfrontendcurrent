import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, PhoneCall, Users, FileText, Database, Hash } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Define the type for analyticsData
interface AnalyticsData {
  users: {
    total_users: number;
  };
  embeddings: {
    total_embeddings: number;
    embeddings_status: Record<string, number>;
  };
  phone_numbers: {
    total_phone_numbers: number;
  };
  files: {
    total_files_uploaded: number;
    files_by_type: Record<string, number>;
  };
  conversations: {
    total_conversations: number;
    avg_conversations_per_user: number;
  };
}

// Mock data for the chart
const mockChartData = [
  { date: 'Jan', users: 400, embeddings: 240, phone_numbers: 150, files: 200, conversations: 100 },
  { date: 'Feb', users: 300, embeddings: 139, phone_numbers: 150, files: 240, conversations: 140 },
  { date: 'Mar', users: 200, embeddings: 980, phone_numbers: 130, files: 280, conversations: 200 },
  { date: 'Apr', users: 278, embeddings: 390, phone_numbers: 140, files: 290, conversations: 190 },
  { date: 'May', users: 189, embeddings: 480, phone_numbers: 140, files: 300, conversations: 160 },
  { date: 'Jun', users: 239, embeddings: 380, phone_numbers: 160, files: 310, conversations: 150 },
  { date: 'Jul', users: 349, embeddings: 430, phone_numbers: 170, files: 320, conversations: 180 },
];

export function Dashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch analytics data
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/dashboard/analytics`)
      .then(response => setAnalyticsData(response.data as AnalyticsData))
      .catch(error => {
        console.error('Error fetching analytics data:', error);
        setError('Failed to load analytics data');
      });

  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (!analyticsData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800">Voice Agent Dashboard</h1>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            <Avatar>
              <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Users */}
          <Card className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-blue-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.users.total_users}</div>
            </CardContent>
          </Card>

          {/* Total Embeddings */}
          <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Embeddings</CardTitle>
              <Hash className="h-4 w-4 text-green-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.embeddings.total_embeddings}</div>
              <p className="text-xs text-green-100">Statuses: {JSON.stringify(analyticsData.embeddings.embeddings_status)}</p>
            </CardContent>
          </Card>

          {/* Total Phone Numbers */}
          <Card className="bg-gradient-to-br from-yellow-500 to-orange-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Phone Numbers</CardTitle>
              <PhoneCall className="h-4 w-4 text-yellow-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.phone_numbers.total_phone_numbers}</div>
            </CardContent>
          </Card>

          {/* Total Files Uploaded */}
          <Card className="bg-gradient-to-br from-pink-500 to-red-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Files Uploaded</CardTitle>
              <FileText className="h-4 w-4 text-pink-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.files.total_files_uploaded}</div>
              <p className="text-xs text-pink-100">Types: {JSON.stringify(analyticsData.files.files_by_type)}</p>
            </CardContent>
          </Card>

          {/* Total Conversations */}
          <Card className="bg-gradient-to-br from-teal-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
              <Database className="h-4 w-4 text-teal-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.conversations.total_conversations}</div>
              <p className="text-xs text-teal-100">Avg per user: {analyticsData.conversations.avg_conversations_per_user.toFixed(1)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Performance Chart */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
            <p className="text-sm text-gray-600">Mock Data - Trends over the last 7 months</p>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="users" stroke="#8884d8" strokeWidth={2} name="Users" />
                  <Line type="monotone" dataKey="embeddings" stroke="#82ca9d" strokeWidth={2} name="Embeddings" />
                  <Line type="monotone" dataKey="phone_numbers" stroke="#ffc658" strokeWidth={2} name="Phone Numbers" />
                  <Line type="monotone" dataKey="files" stroke="#ff7300" strokeWidth={2} name="Files" />
                  <Line type="monotone" dataKey="conversations" stroke="#00ff00" strokeWidth={2} name="Conversations" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
