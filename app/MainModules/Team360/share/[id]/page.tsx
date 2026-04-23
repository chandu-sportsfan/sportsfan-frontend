import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_PUBLIC_ADMIN_URL ||
  "https://sportsfan360.vercel.app";

type CategoryField = {
  title: string;
  image: string;
};

type CatField = {
  label: string;
  logo: string;
};

type Post = {
  id: string;
  teamName: string;
  title: string;
  category: CategoryField[];
  likes: number;
  comments: number;
  live: number;
  shares: number;
  image: string;
  logo: string;
  catlogo: CatField[];
  hasVideo?: boolean;
  createdAt: number;
};

async function getPosts() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/team360`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return [] as Post[];
    }

    const data = await res.json();
    return data.posts || [];
  } catch {
    return [] as Post[];
  }
}

function resolveImageUrl(image?: string) {
  if (!image) return `${APP_URL}/images/share.png`;
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  return `${APP_URL}${image.startsWith("/") ? "" : "/"}${image}`;
}

async function getPost(id: string) {
  const posts = await getPosts();
  return posts.find((post) => post.id === id) || null;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    return {
      title: "Team 360 World | Sportsfan",
      description: "Share Team 360 World cards on Sportsfan.",
    };
  }

  const imageUrl = resolveImageUrl(post.image || post.logo);
  const title = `${post.teamName} | Team 360 World - Sportsfan`;
  const description = `${post.title}. ${post.category?.map((cat) => cat.title).filter(Boolean).join(", ") || "Latest Team 360 World post."}`;
  const url = `${APP_URL}/MainModules/Team360/share/${id}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "Sportsfan",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.teamName,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function Team360SharePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    notFound();
  }

  const imageUrl = resolveImageUrl(post.image || post.logo);
  const shareUrl = `${APP_URL}/MainModules/Team360/share/${id}`;
  const teamProfileUrl = `${APP_URL}/MainModules/ClubsProfile?teamProfile=${encodeURIComponent(post.teamName)}`;

  return (
    <div className="min-h-screen bg-[#0d0d10] text-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl rounded-[28px] border border-white/10 bg-[#111114] shadow-2xl overflow-hidden">
        <div className="relative h-56 sm:h-72 bg-gradient-to-br from-pink-600/20 via-[#111114] to-orange-500/20">
          <img src={imageUrl} alt={post.teamName} className="absolute inset-0 w-full h-full object-cover opacity-85" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d10] via-[#0d0d10]/30 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <span className="inline-flex items-center rounded-full bg-pink-600 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              Team 360 World
            </span>
            <h1 className="mt-3 text-2xl sm:text-4xl font-bold leading-tight">{post.teamName}</h1>
            <p className="mt-2 text-white/80 max-w-xl">{post.title}</p>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="grid gap-3 sm:grid-cols-3 mb-5">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <p className="text-xs uppercase tracking-wide text-white/50">Likes</p>
              <p className="mt-1 text-xl font-bold">{post.likes.toLocaleString()}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <p className="text-xs uppercase tracking-wide text-white/50">Comments</p>
              <p className="mt-1 text-xl font-bold">{post.comments.toLocaleString()}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <p className="text-xs uppercase tracking-wide text-white/50">Live</p>
              <p className="mt-1 text-xl font-bold">{post.live.toLocaleString()}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 mb-5">
            <p className="text-sm text-white/70">
              {post.category?.map((cat) => cat.title).filter(Boolean).join(", ") || "Latest Team 360 World post."}
            </p>
            <p className="mt-2 text-xs text-white/45">
              {new Date(post.createdAt).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
            <a
              href={shareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-xs text-pink-300 break-all underline underline-offset-4 hover:text-pink-200"
            >
              {shareUrl}
            </a>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href={teamProfileUrl}
              className="inline-flex items-center justify-center rounded-full px-5 py-3 font-semibold text-white"
              style={{ background: "linear-gradient(90deg, #e91e63, #ff5722)" }}
            >
              Open Team Profile
            </Link>
            <Link
              href="/MainModules/HomePage"
              className="inline-flex items-center justify-center rounded-full px-5 py-3 font-semibold text-white border border-white/15 bg-white/5 hover:bg-white/10 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}