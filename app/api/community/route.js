import { NextResponse } from "next/server";
import { communityPosts } from "@/components/data";

export async function GET() {
  return NextResponse.json({
    items: communityPosts,
    total: communityPosts.length
  });
}
