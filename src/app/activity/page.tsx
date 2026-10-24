"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BarChart2,
  FileText,
  MessageSquare,
  Heart,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function ActivityPage() {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const [totalPosts, setTotalPosts] = useState(0);
  const [loading, setLoading] = useState(true);

  // ইউজারের পোস্টের সংখ্যা ডাইনামিকালি আনার জন্য
  const fetchActivityStats = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/v1/posts/my-posts", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setTotalPosts(data.data?.length || 0);
      }
    } catch (err) {
      console.error("Failed to fetch activity stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user) {
      fetchActivityStats();
    }
  }, [session]);

  if (sessionLoading || loading) {
    return (
      <div className="text-center py-32 text-zinc-500">
        Loading activity dashboard...
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="text-center py-32 space-y-4">
        <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-200">
          Please log in to view your activity
        </h2>
        <Link
          href="/sign-in"
          className="inline-block px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-sm"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* Back Button */}
      <Link
        href="/feed"
        className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Feed
      </Link>

      {/* Header Section */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-3xl shadow-xl flex items-center justify-between flex-wrap gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <BarChart2 className="w-7 h-7 text-indigo-600" /> Activity Dashboard
          </h1>
          <p className="text-sm text-zinc-500">
            Overview of your contributions and community engagement.
          </p>
        </div>
        <span className="px-4 py-2 rounded-2xl text-xs font-bold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1.5">
          <TrendingUp className="w-4 h-4" /> Live Insights
        </span>
      </div>

      {/* Stats Grid Cards (Dynamic Posts count + Static Static Metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Total Posts Card (Dynamic) */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-zinc-500 font-medium">
              Total Posts Created
            </p>
            <h3 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
              {totalPosts}
            </h3>
          </div>
        </div>

        {/* Total Comments Card (Static Mock) */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-zinc-500 font-medium">Comments Given</p>
            <h3 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
              12
            </h3>
          </div>
        </div>

        {/* Total Reactions Card (Static Mock) */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/50 flex items-center justify-center text-red-500">
            <Heart className="w-6 h-6 fill-red-500/20" />
          </div>
          <div>
            <p className="text-sm text-zinc-500 font-medium">
              Reactions Received
            </p>
            <h3 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
              48
            </h3>
          </div>
        </div>
      </div>

      {/* Summary Banner */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <h2 className="text-xl font-bold flex items-center gap-2 justify-center sm:justify-start">
            <Sparkles className="w-5 h-5 text-amber-300" /> Keep the
            conversation going!
          </h2>
          <p className="text-indigo-100 text-sm max-w-xl">
            Your active participation helps SocialSphere grow into a vibrant
            community for developers and tech enthusiasts.
          </p>
        </div>
        <Link
          href="/feed/create"
          className="px-6 py-3 bg-white text-indigo-600 font-extrabold rounded-2xl shadow-lg text-sm hover:bg-indigo-50 transition-colors whitespace-nowrap"
        >
          Create New Post
        </Link>
      </div>
    </div>
  );
}
