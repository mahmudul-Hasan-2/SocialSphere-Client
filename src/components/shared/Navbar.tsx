"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Home,
  Compass,
  PlusSquare,
  User,
  Menu,
  X,
  Sparkles,
  Sun,
  Moon,
  LogOut,
  LayoutDashboard,
  ChevronDown,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const { data: session, isPending } = useSession();
  const router = useRouter();

  // Hydration fix for next-themes
  useEffect(() => setMounted(true), []);

  const handleLogout = async () => {
    await signOut();
    setUserMenuOpen(false);
    setIsOpen(false);
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-zinc-950/70 border-b border-zinc-200 dark:border-zinc-800 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-xl text-white shadow-md group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            SocialSphere
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6 font-medium text-zinc-600 dark:text-zinc-300">
          <Link
            href="/"
            className="flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <Home className="w-4 h-4" /> Home
          </Link>
          <Link
            href="/feed"
            className="flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <Compass className="w-4 h-4" /> Feed
          </Link>
          <Link
            href="/feed/create"
            className="flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <PlusSquare className="w-4 h-4" /> Create
          </Link>
        </nav>

        {/* Action Buttons, Dynamic Auth & Theme Toggle */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Toggle Button */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>
          )}

          {/* Dynamic Auth Area */}
          {!isPending && session?.user ? (
            /* Logged In: User Profile Dropdown */
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-2xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors border border-zinc-200 dark:border-zinc-800"
              >
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name}
                      className="w-full h-full rounded-xl object-cover"
                    />
                  ) : (
                    session.user.name?.charAt(0).toUpperCase() || "U"
                  )}
                </div>
                <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 max-w-[100px] truncate">
                  {session.user.name}
                </span>
                <ChevronDown className="w-4 h-4 text-zinc-500" />
              </button>

              {/* User Dropdown Menu */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-800">
                    <p className="text-xs text-zinc-400 font-medium">
                      Signed in as
                    </p>
                    <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
                      {session.user.email}
                    </p>
                  </div>

                  <Link
                    href="/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <User className="w-4 h-4 text-indigo-600" /> My Profile
                  </Link>

                  <Link
                    href="/activity"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-indigo-600" />{" "}
                    Activity Dashboard
                  </Link>

                  <div className="border-t border-zinc-100 dark:border-zinc-800 mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Logged Out: Auth Buttons */
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-semibold text-zinc-700 dark:text-zinc-200 hover:text-indigo-600 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-500/25 transition-all"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu & Theme Toggle */}
        <div className="flex md:hidden items-center gap-2">
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-zinc-600 dark:text-zinc-300 focus:outline-none"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 p-4 shadow-xl flex flex-col gap-4 animate-in slide-in-from-top duration-200">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg"
          >
            <Home className="w-5 h-5 text-indigo-600" /> Home
          </Link>
          <Link
            href="/feed"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg"
          >
            <Compass className="w-5 h-5 text-indigo-600" /> Feed
          </Link>
          <Link
            href="/feed/create"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg"
          >
            <PlusSquare className="w-5 h-5 text-indigo-600" /> Create Post
          </Link>

          {session?.user ? (
            <>
              <Link
                href="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg"
              >
                <User className="w-5 h-5 text-indigo-600" /> Profile (
                {session.user.name})
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left flex items-center gap-2 p-2 text-red-600 font-semibold hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg"
              >
                <LogOut className="w-5 h-5" /> Logout
              </button>
            </>
          ) : (
            <div className="flex gap-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-2.5 font-semibold border border-zinc-300 dark:border-zinc-700 rounded-xl"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-2.5 font-semibold text-white bg-indigo-600 rounded-xl shadow-md"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
