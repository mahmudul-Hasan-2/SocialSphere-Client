import Link from "next/link";
import { Sparkles } from "lucide-react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { cacheLife } from "next/cache";

// ১. বছরটিকে বিল্ড টাইমে ক্যাশ করার জন্য একটি ফাংশন (Prerender ফিক্স)
async function getCurrentYear() {
  "use cache";
  cacheLife("max");
  return new Date().getFullYear();
}

// ২. কম্পোনেন্টটিকে async হিসেবে ডিফাইন করুন
export default async function Footer() {
  const currentYear = await getCurrentYear();

  return (
    <footer className="bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Info */}
        <div className="space-y-4 md:col-span-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-xl text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              SocialSphere
            </span>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm">
            A next-generation micro-social platform built for developers,
            creators, and tech enthusiasts to share ideas seamlessly.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
            Quick Links
          </h4>
          <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
            <li>
              <Link
                href="/"
                className="hover:text-indigo-600 transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/feed"
                className="hover:text-indigo-600 transition-colors"
              >
                Explore Feed
              </Link>
            </li>
            <li>
              <Link
                href="/feed/create"
                className="hover:text-indigo-600 transition-colors"
              >
                Create Post
              </Link>
            </li>
            <li>
              <Link
                href="/profile"
                className="hover:text-indigo-600 transition-colors"
              >
                My Profile
              </Link>
            </li>
          </ul>
        </div>

        {/* Social / Connect */}
        <div>
          <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
            Connect With Us
          </h4>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 bg-zinc-200/60 dark:bg-zinc-900 rounded-xl hover:text-indigo-600 transition-colors"
            >
              <FaGithub className="w-4 h-4" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 bg-zinc-200/60 dark:bg-zinc-900 rounded-xl hover:text-indigo-600 transition-colors"
            >
              <FaTwitter className="w-4 h-4" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 bg-zinc-200/60 dark:bg-zinc-900 rounded-xl hover:text-indigo-600 transition-colors"
            >
              <FaLinkedin className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* ৩. এখানে সরাসরি ডাইনামিক ডেটের বদলে currentYear ভেরিয়েবলটি বসানো হয়েছে */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-zinc-200 dark:border-zinc-900 text-center text-xs text-zinc-400">
        © {currentYear} SocialSphere. All rights reserved. Built with Next.js &
        Tailwind CSS.
      </div>
    </footer>
  );
}
