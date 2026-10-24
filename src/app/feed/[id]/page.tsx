"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MessageSquare, Send } from "lucide-react";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: {
    name: string;
    image?: string;
  };
  replies?: Comment[];
}

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
  comments?: Comment[];
  _count?: {
    comments: number;
  };
}

// মেইন পেজ কম্পোনেন্ট - Suspense দিয়ে র‍্যাপ করা হয়েছে যাতে Next.js 16 বিল্ড এরর না দেয়
export default function PostDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center py-32 text-zinc-500">
          Loading post details...
        </div>
      }
    >
      <PostDetailsContent />
    </Suspense>
  );
}

// মূল কনটেন্ট এবং হুক লজিক কম্পোনেন্ট
function PostDetailsContent() {
  const params = useParams();
  const postId = params?.id as string;
  const router = useRouter();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);

  // post details এবং comments ফেচ করার নিরাপদ useCallback ফাংশন
  const fetchPostDetails = useCallback(async () => {
    if (!postId) return;
    try {
      const res = await fetch(`http://localhost:5000/api/v1/posts/${postId}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setPost(data.data);
      }

      const commentRes = await fetch(
        `http://localhost:5000/api/v1/comments/post/${postId}`,
        {
          credentials: "include",
        },
      );
      const commentData = await commentRes.json();
      if (commentData.success) {
        setComments(commentData.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch post details:", err);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchPostDetails();
  }, [fetchPostDetails]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setCommentLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/v1/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ postId, content: newComment }),
      });
      const data = await res.json();
      if (data.success) {
        setNewComment("");
        fetchPostDetails();
      }
    } catch (err) {
      console.error("Comment error:", err);
    } finally {
      setCommentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-32 text-zinc-500">
        Loading post details...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-32 space-y-4">
        <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-200">
          Post not found
        </h2>
        <Link
          href="/feed"
          className="text-indigo-600 underline text-sm font-semibold"
        >
          Back to Feed
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      {/* Back Button */}
      <Link
        href="/feed"
        className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Feed
      </Link>

      {/* Main Post Card */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-3xl shadow-xl space-y-6">
        {/* Author Info */}
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-base">
              {post.author?.name?.charAt(0) || "U"}
            </div>
            <div>
              <h3 className="font-bold text-zinc-900 dark:text-zinc-100">
                {post.author?.name}
              </h3>
              <p className="text-xs text-zinc-400">
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
            {post.category}
          </span>
        </div>

        {/* Title & Content */}
        <div className="space-y-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 leading-snug">
            {post.title}
          </h1>
          <p className="text-zinc-700 dark:text-zinc-300 text-base leading-relaxed whitespace-pre-wrap">
            {post.content}
          </p>
        </div>

        {/* Media Image */}
        {post.mediaUrl && (
          <div className="rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 max-h-[500px]">
            <img
              src={post.mediaUrl}
              alt="Post media"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {post.tags.map((tag: string, idx: number) => (
              <span
                key={idx}
                className="text-xs px-3 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Comment Counter Bar */}
        <div className="flex items-center gap-2 pt-6 border-t border-zinc-100 dark:border-zinc-800 text-zinc-500 font-semibold text-sm">
          <MessageSquare className="w-5 h-5 text-indigo-500" />
          <span>{comments.length} Comments</span>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-3xl shadow-xl space-y-6">
        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-indigo-600" /> Discussion &
          Comments
        </h3>

        {/* Add Comment Form */}
        <form onSubmit={handleCommentSubmit} className="flex gap-3">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write your thoughts..."
            className="flex-1 px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-indigo-600 text-sm font-medium"
          />
          <button
            type="submit"
            disabled={commentLoading}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition-all"
          >
            <Send className="w-4 h-4" />{" "}
            {commentLoading ? "Posting..." : "Reply"}
          </button>
        </form>

        {/* Comments List */}
        <div className="space-y-4 pt-4">
          {comments.length === 0 ? (
            <p className="text-sm text-zinc-400 text-center py-8">
              No comments yet. Be the first to share your thoughts!
            </p>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200/80 dark:border-zinc-800/80 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 font-bold text-xs">
                      {comment.author?.name?.charAt(0) || "U"}
                    </div>
                    <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                      {comment.author?.name}
                    </span>
                  </div>
                  <span className="text-xs text-zinc-400">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-zinc-700 dark:text-zinc-300 text-sm pl-10 leading-relaxed">
                  {comment.content}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
