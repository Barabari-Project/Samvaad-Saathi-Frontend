"use client";
import { useAuth } from "@/components/providers/auth-provider";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  const { user, loading } = useAuth();
  const userName = user?.authorizedUser?.name || "User";
  const avatarUrl = `https://avatar.iran.liara.run/username?username=${encodeURIComponent(
    userName
  )}`;

  if (loading) {
    return (
      <div className="flex flex-col">
        <div className="flex justify-between items-center py-4 relative">
          <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
        </div>

        <div className="flex items-center justify-center flex-col gap-20">
          <div className="w-72 h-72 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>

        <div className="absolute inset-x-0 bottom-20 px-6">
          <div className="w-full h-14 bg-gray-200 rounded-xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center py-4 relative">
        <h2 className="text-4xl font-bold">Hi {userName},</h2>

        <Image
          width={50}
          height={50}
          src={avatarUrl}
          alt="user avatar"
          unoptimized
          className="rounded-full object-cover"
        />
      </div>

      <div className="flex items-center justify-center flex-col gap-20">
        <Image src="/home.png" alt="home image" height={300} width={300} />
      </div>

      <div className="my-6">
        <div className="card w-full bg-base-100 card-md shadow-sm">
          <div className="card-body">
            <h2 className="card-title">Recent Interviews</h2>
            <p>
              Your recent interviews will be shown here. Complete your first
              interview to see your progress and history.
            </p>
            <div className="justify-end card-actions">
              <Link href="history">
                <button className="btn btn-primary rounded-md">
                  View History
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-32 px-6">
        <Link href="interview-start">
          <button className="w-full bg-black text-white font-bold font-xl p-4 rounded-xl">
            Get Started
          </button>
        </Link>
      </div>
    </div>
  );
}
