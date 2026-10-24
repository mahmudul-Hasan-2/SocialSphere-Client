"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  FileText,
  ArrowLeft,
  Mail,
  Shield,
  UserCheck,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  mediaUrl?: string;
}

export default function ProfilePage() {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // ইউজারের পোস্টগুলো ফেচ করা
  const fetchMyPosts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/v1/posts/my-posts", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setMyPosts(data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user) {
      fetchMyPosts();
    }
  }, [session]);

  if (sessionLoading || loading) {
    return (
      <div className="text-center py-32 text-zinc-500">Loading profile...</div>
    );
  }

  if (!session?.user) {
    return (
      <div className="text-center py-32 space-y-4">
        <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-200">
          Please log in to view your profile
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

  const user = session.user;

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* Back Button */}
      <Link
        href="/feed"
        className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Feed
      </Link>

      {/* User Info Header Card (Dynamic User + Static Badges) */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center gap-6">
        {user.image ? (
          <img
            src={user.image}
            alt={user.name}
            className="w-24 h-24 rounded-full object-cover shadow-md border-2 border-indigo-500/30"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-extrabold text-4xl shadow-inner">
            {user.name?.charAt(0) || "U"}
          </div>
        )}
        <div className="text-center sm:text-left space-y-2 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">
              {user.name}
            </h1>
            <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 inline-flex items-center gap-1.5 justify-center">
              <UserCheck className="w-3.5 h-3.5" /> Verified User
            </span>
          </div>
          <p className="text-sm text-zinc-500 flex items-center gap-1.5 justify-center sm:justify-start">
            <Mail className="w-4 h-4 text-zinc-400" /> {user.email}
          </p>
          <p className="text-xs text-zinc-400 pt-1">
            Passionate full-stack developer & open-source contributor building
            modern web applications.
          </p>
        </div>
      </div>

      {/* User's Created Posts Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-600" /> My Contributions (
          {myPosts.length})
        </h2>

        {myPosts.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 space-y-3">
            <Sparkles className="w-8 h-8 text-indigo-500 mx-auto animate-bounce" />
            <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">
              No posts created yet
            </h3>
            <p className="text-sm text-zinc-500">
              Share your thoughts with the community!
            </p>
            <Link
              href="/feed/create"
              className="inline-block mt-4 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-md text-sm hover:bg-indigo-700 transition-colors"
            >
              Create Post
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {myPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl shadow-sm space-y-2 hover:border-indigo-500/50 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                    {post.category}
                  </span>
                  <span className="text-xs text-zinc-400">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <Link href={`/posts/${post.id}`} className="block">
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 hover:text-indigo-600 transition-colors">
                    {post.title}
                  </h3>
                </Link>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                  {post.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
