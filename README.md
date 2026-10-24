# 🌐 SocialSphere (Client)

**SocialSphere** is a feature-rich, full-stack community web application frontend built for developers and tech enthusiasts to share knowledge, explore trending discussions, post interactive content, and engage in real-time comments.

## 🚀 Tech Stack

### Frontend

- **Framework:** Next.js 16 (App Router) with Turbopack
- **State Management:** Redux Toolkit
- **Styling:** Tailwind CSS & Lucide Icons
- **Authentication Client:** Better Auth Client

## 📂 Project Structure

```text
social-sphere-client/
└── src/app/
    ├── feed/             # Feed page with search & filters
    ├── posts/            # Create post & dynamic post details ([id])
    ├── profile/          # Dynamic user profile page
    └── activity/         # Activity dashboard analytics
```

## ✨ Key Features

- **Secure Authentication** — User login, signup, and Google OAuth via Better Auth
- **Interactive Feed** — Dynamic post fetching with real-time category filters and regex search
- **Rich Content Creation** — Create posts with categories, dynamic tags, and media URLs
- **Discussions & Comments** — Multi-tier nested comments and real-time discussion boards
- **User Profile & Activity** — View personalized contribution feeds and live account stats
- **Dark/Light Theme** — Fully responsive UI supporting system-wide theme toggling

## 🛠️ Getting Started Locally

### 1. Clone the Repository

```bash

git clone https://github.com/mahmudul-Hasan-2/social-sphere-client.git

cd social-sphere-client

```

### 2. Setup Frontend Client

```bash

cd /frontend

npm install

```

Run the Next.js development server:

```bash

npm run dev

```
