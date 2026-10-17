<div align="center">

# 🎬 MovieNexus
### Enterprise-Grade 4K Ultra HD Cinematic Video Streaming Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.1-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.1-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![HLS.js](https://img.shields.io/badge/HLS.js-Adaptive_Bitrate-FF6C37?style=for-the-badge)](https://github.com/video-dev/hls.js/)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg?style=for-the-badge)](LICENSE)

<p align="center">
  <b>A next-generation streaming engine delivering fluid 4K Ultra HD playback, enterprise-grade Role-Based Access Control (RBAC), an interactive Admin Studio, in-browser offline downloading, and dynamic homepage curation.</b>
</p>

[Key Features](#-key-features) •
[Architecture](#-system-architecture) •
[Tech Stack](#-tech-stack) •
[Quickstart](#-getting-started) •
[Admin Studio](#-admin-credentials--studio) •
[Database Schema](#-database-schema) •
[Contributing](#-contributing)

---

</div>

## 🌟 Key Features

### 🎥 1. Cinematic HLS Video Engine
* **Adaptive Bitrate Streaming (ABR)**: Seamlessly alternates playback resolutions (`Auto`, `360p`, `720p`, `1080p FHD`, `4K UHD`) depending on client bandwidth.
* **Smart Playback Controls**: Variable playback speeds (`0.5x` to `2.0x`), volume normalization, theater mode, and full-screen gestures.
* **Resume & Watch Points**: Real-time position tracking synchronizes watch history so users can pick up right where they left off.
* **Anti-Hotlink Security**: Token-authenticated video segment delivery prevents external link hijacking.

### 🛡️ 2. Enterprise Admin Studio & RBAC
* **Protected Authentication**: Encrypted credentials with bcrypt hashing, signed JWT sessions, and inactivity auto-logout.
* **Brute-Force Guard**: Progressive lockouts (5 consecutive failed attempts result in an automated 15-minute freeze).
* **Multi-Tiered Roles**:
  * **Super Admin**: Complete master control, role provisioning, system telemetry, and audit inspection.
  * **Content Admin**: Video publishing, metadata management, transcode queues, and section priority reordering.
  * **Moderator**: Review uploads, verify reported media, and inspect audit activity streams.

### 🎛️ 3. Homepage Section & Priority Controller (`/admin/sections`)
* Direct visual control over homepage layout without touching code.
* Reorder, pin, or hide sections (*Billboard Hero*, *Trending Now*, *MovieNexus Originals*, *Top Rated*).
* Dynamic ranking algorithm assigns custom priority weights to movies.

### 📥 4. In-App Offline Downloads Engine (`/downloads`)
* **IndexedDB Chunk Storage**: Store streaming files within the browser's persistent storage quota (up to 50 GB).
* **Download Controls**: Granular pause, resume, cancel, and clear options with real-time download speed meters.
* **Protected Offline Playback**: Encrypted offline playback exclusively inside the MovieNexus player without exposing raw media URLs.

### 🔍 5. Instant Live Search & Catalog Discovery
* Sub-second fuzzy search across titles, cast, directors, genres, and release years.
* Categorical filtering (`Movies`, `Series`, `Originals`, `4K UHD HDR`).
* Fluid modal previews with high-definition backdrop artwork and trailers.

### 📊 6. Health Telemetry & Audit Logs (`/admin/health`, `/admin/logs`)
* **Telemetry Diagnostics**: Real-time graphs for API latency, edge CDN distribution status, memory load, and blocked intrusion requests.
* **Comprehensive Audit Trail**: Timestamped activity logs tracking logins, video uploads, metadata edits, and administrative actions.

---

## 🏗️ System Architecture

```mermaid
graph TD
    Client["Modern Web Client (Next.js 15 App Router)"]
    
    subgraph Frontend["Frontend Layer"]
        Hero["Hero & Content Carousels"]
        Player["Custom HLS.js 4K Video Player"]
        OfflineEngine["Offline IndexedDB Storage"]
        AdminStudio["Admin Studio & RBAC Dashboard"]
    end
    
    subgraph API["Next.js Server & API Routes"]
        AuthMiddleware["JWT & Brute-Force Auth Guard"]
        VideoRoutes["/api/videos & Transcode Queue"]
        TokenRoutes["/api/token (Anti-Hotlink)"]
        Sitemap["/api/sitemap & SEO Dynamic Generator"]
    end
    
    subgraph Persistence["Storage & Database"]
        Prisma["Prisma ORM 6.1"]
        Postgres[(PostgreSQL Database)]
        CDN["Edge CDN & HLS Video Bucket"]
    end

    Client --> Frontend
    Frontend --> API
    API --> Prisma
    Prisma --> Postgres
    Player --> CDN
    OfflineEngine <--> Player
```

---

## 💻 Tech Stack

| Domain | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | [Next.js 15 (App Router)](https://nextjs.org/) | Hybrid Server Components, Edge API routes, and Server Actions |
| **Library** | [React 19](https://react.dev/) | Concurrent rendering, modern hooks, and transition primitives |
| **Language** | [TypeScript 5.7](https://www.typescriptlang.org/) | Strict type-safety across all components, models, and APIs |
| **Styling** | [Tailwind CSS 3.4](https://tailwindcss.com/) | Custom Obsidian dark palette, glassy blurs, and keyframe animations |
| **Video Engine** | [HLS.js](https://github.com/video-dev/hls.js/) | Adaptive HTTP Live Streaming with dynamic bitrate switching |
| **ORM & Database**| [Prisma 6.1](https://www.prisma.io/) + [PostgreSQL](https://www.postgresql.org/) | Type-safe schema migrations, relation queries, and connection pooling |
| **Icons & Motion** | [Lucide React](https://lucide.dev/) + [Framer Motion](https://www.framer.com/motion/) | Slick iconography and hardware-accelerated animations |

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: v18.18.0 or later
* **npm**: v9.0.0 or later
* **Git**: v2.30+
* **PostgreSQL Database** (Local, Neon, Supabase, or Railway)

### 1. Clone the Repository
```bash
git clone https://github.com/hasim2006/MovieNexus.git
cd MovieNexus
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Duplicate `.env.example` to create your local `.env`:
```bash
cp .env.example .env.local
```

Configure your environment variables:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/movienexus_db?schema=public"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
JWT_SECRET="super-secret-jwt-signing-key-movienexus-2026"
CDN_EDGE_HOST="https://cdn.movienexus.app"
CORS_ORIGIN="http://localhost:3000"
```

### 4. Database Setup & Prisma Migration
```bash
npx prisma generate
npx prisma db push
```

### 5. Launch Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 🔑 Admin Credentials & Studio

Access the protected management portal at `http://localhost:3000/admin/login`:

| Role | Username | Password | Privileges |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin` | `admin123` | Full access, system telemetry, admin provisioning, section ranking |
| **Content Admin** | `content_mgr` | `admin123` | Video uploads, transcoding queue, metadata editing, category tags |
| **Moderator** | `mod_alex` | `admin123` | Audit log monitoring, review uploads, security inspection |

> **Security Note**: In production, initialize default administrator accounts with strong, unique credentials and define appropriate IP whitelisting.

---

## 🗄️ Database Schema

The core relational database model managed via Prisma (`prisma/schema.prisma`):

```prisma
model User {
  id            String         @id @default(uuid())
  email         String         @unique
  name          String?
  role          String         @default("USER") // USER, ADMIN, SUPER_ADMIN
  watchHistory  WatchHistory[]
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
}

model Movie {
  id            String         @id @default(uuid())
  title         String
  description   String
  backdropUrl   String
  posterUrl     String
  videoUrl      String
  duration      Int            // Duration in minutes
  rating        Float          @default(0.0)
  releaseYear   Int
  genre         String[]
  isOriginal    Boolean        @default(false)
  is4K          Boolean        @default(true)
  priority      Int            @default(0)
  watchCount    Int            @default(0)
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
}

model WatchHistory {
  id            String         @id @default(uuid())
  userId        String
  movieId       String
  progressSec   Int            @default(0)
  durationSec   Int            @default(0)
  completed     Boolean        @default(false)
  user          User           @relation(fields: [userId], references: [id])
  movie         Movie          @relation(fields: [movieId], references: [id])
  updatedAt     DateTime       @updatedAt
}
```

---

## 📁 Directory Structure

```
MovieNexus/
├── prisma/
│   └── schema.prisma             # PostgreSQL Prisma models & relations
├── public/                       # Static public assets, posters & icons
├── src/
│   ├── app/
│   │   ├── admin/                # Admin Studio (Dashboard, Upload, Logs, Sections, Health)
│   │   ├── api/                  # API routes (videos, tokens, sitemap, uploads)
│   │   ├── browse/               # Catalog filtering & category shelf
│   │   ├── downloads/            # In-App Offline Download Manager
│   │   ├── profile/              # User profiles & continue watching history
│   │   ├── search/               # Real-time instant search page
│   │   ├── watch/[id]/           # Fullscreen 4K HLS player route
│   │   ├── globals.css           # Tailwind custom styles & obsidian tokens
│   │   ├── layout.tsx            # Root layout with navbar & audio context
│   │   └── page.tsx              # Homepage with Billboard Hero & Content Rows
│   ├── components/
│   │   ├── auth/                 # Auth & OTP login modals
│   │   ├── home/                 # HeroBanner, MovieCard, ContentRow, DetailModal
│   │   ├── player/               # Adaptive Bitrate HLS Custom Video Player
│   │   ├── share/                # Social sharing & dynamic QR code modals
│   │   ├── Footer.tsx            # Cinematic footer with legal & site links
│   │   └── Navbar.tsx            # Sticky navigation with glassmorphism
│   ├── lib/
│   │   ├── auth.ts               # RBAC, bcrypt auth & brute-force guard
│   │   ├── db.ts                 # Storage adapters & data abstraction layer
│   │   ├── downloads-db.ts       # Client-side IndexedDB download engine
│   │   ├── sample-data.ts        # Production 4K video feeds & metadata
│   │   ├── security.ts           # Anti-hotlink token generator
│   │   └── seo.ts                # OpenGraph & JSON-LD structured data
│   └── types/
│       └── index.ts              # TypeScript domain types & interfaces
├── .env.example                  # Environment configuration template
├── .gitignore                    # Optimized production ignore rules
├── next.config.js                # Next.js configuration & headers
├── package.json                  # Dependencies and execution scripts
├── tailwind.config.ts            # Obsidian dark theme and animation tokens
└── tsconfig.json                 # TypeScript strict compiler options
```

---

## 🤝 Contributing

Contributions make the open-source community an inspiring place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the Apache License 2.0. See [`LICENSE`](LICENSE) for more information.

---

<div align="center">
  <sub>Engineered with precision by <a href="https://github.com/hasim2006">Mohammad Hasim</a>.</sub>
</div>
