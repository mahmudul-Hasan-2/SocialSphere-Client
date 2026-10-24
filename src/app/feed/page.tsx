"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Flame,
  MessageSquare,
  Heart,
  PlusCircle,
  Sparkles,
  Filter,
  ThumbsUp,
} from "lucide-react";

interface Post {
  id: string;
  title: string;
  content: string;
  mediaUrl?: string;
  category: string;
  tags: string[];
  createdAt: string;
  author: {
    name: string;
    image?: string;
  };
  reactions?: { userId: string; type: string }[];
  _count?: {
    comments: number;
    reactions: number;
  };
}

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  // ব্যাকএন্ড থেকে পোস্ট ফেচ করা
  const fetchPosts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/v1/posts", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setPosts(data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // রিঅ্যাকশন হ্যান্ডলার (Like/Heart)
  const handleReaction = async (postId: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/v1/reactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          postId,
          type: "LIKE",
        }),
      });

      const data = await res.json();
      if (data.success) {
        // সাকসেসফুল হলে পোস্টগুলোর স্টেট আপডেট করা যাতে রিঅ্যাকশন কাউন্ট ইনস্ট্যান্ট বাড়ে
        fetchPosts();
      }
    } catch (err) {
      console.error("Failed to react:", err);
    }
  };

  // লাইভ সার্চ এবং ক্যাটাগরি ফিল্টার লজিক
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesCategory =
      selectedCategory === "ALL" || post.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <Flame className="w-7 h-7 text-indigo-600" /> Community Feed
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Discover live discussions, insights, and tech stories from
            developers.
          </p>
        </div>
        <Link
          href="/posts/create"
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
        >
          <PlusCircle className="w-5 h-5" /> Create Post
        </Link>
      </div>

      {/* 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar: Categories & Filters */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 space-y-4">
            <h3 className="text-sm font-bold tracking-wider text-zinc-400 uppercase flex items-center gap-2">
              <Filter className="w-4 h-4" /> Categories
            </h3>
            <div className="flex flex-col space-y-2">
              {["ALL", "TECHNOLOGY", "PROGRAMMING", "DESIGN", "GENERAL"].map(
                (cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-left px-4 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                      selectedCategory === cat
                        ? "bg-indigo-600 text-white shadow-md"
                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    {cat.charAt(0) + cat.slice(1).toLowerCase()}
                  </button>
                ),
              )}
            </div>
          </div>
        </div>

        {/* Center Main Feed: Posts List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Live Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts by title, content, or tags..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-indigo-600 shadow-sm text-sm transition-colors"
            />
          </div>

          {loading ? (
            <div className="text-center py-20 text-zinc-500">
              Loading live posts from database...
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 space-y-3">
              <Sparkles className="w-8 h-8 text-indigo-500 mx-auto animate-bounce" />
              <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">
                No posts found
              </h3>
              <p className="text-sm text-zinc-500">
                Be the first one to share something with the community!
              </p>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <Link
                href={`/feed/${post.id}`}
                key={post.id}
                className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4 hover:border-indigo-500/50 transition-all"
              >
                {/* Author Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                      {post.author?.name?.charAt(0) || "U"}
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                        {post.author?.name}
                      </h4>
                      <p className="text-xs text-zinc-400">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                    {post.category}
                  </span>
                </div>

                {/* Post Content */}
                <Link
                  href={`/feed/${post.id}`}
                  className="block space-y-2 group"
                >
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 group-hover:text-indigo-600 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm line-clamp-3 leading-relaxed">
                    {post.content}
                  </p>
                </Link>

                {/* Media Image if available */}
                {post.mediaUrl && (
                  <div className="rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 max-h-80">
                    <img
                      src={post.mediaUrl}
                      alt="Post attachment"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {post.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Reaction & Comment Action Bar */}
                <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800/80 text-sm">
                  {/* Reaction Button */}
                  <button
                    onClick={() => handleReaction(post.id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 hover:bg-red-50 dark:hover:bg-red-950/30 text-zinc-600 dark:text-zinc-300 hover:text-red-500 transition-colors font-medium"
                  >
                    <Heart className="w-4 h-4 text-red-500 fill-red-500/20" />
                    <span>{post._count?.reactions || 0} Reactions</span>
                  </button>

                  {/* Comment Count / Link to Details */}
                  <Link
                    href={`/feed/${post.id}`}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 text-zinc-600 dark:text-zinc-300 hover:text-indigo-600 transition-colors font-medium"
                  >
                    <MessageSquare className="w-4 h-4 text-indigo-500" />
                    <span>{post._count?.comments || 0} Comments</span>
                  </Link>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Right Sidebar: Trending & Stats */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 space-y-4">
            <h3 className="text-sm font-bold tracking-wider text-zinc-400 uppercase flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" /> Platform Stats
            </h3>
            <div className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
              <div className="flex justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
                <span>Total Live Posts</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">
                  {posts.length}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span>Active Community</span>
                <span className="font-bold text-indigo-600">Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
