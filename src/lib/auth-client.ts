import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // তোমার ব্যাকএন্ড সার্ভার ইউআরএল
});

export const { signIn, signUp, useSession } = authClient;
