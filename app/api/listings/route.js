import { NextResponse } from "next/server";
import { listings } from "@/components/data";

export async function GET() {
  return NextResponse.json({
    items: listings,
    total: listings.length
  });
}
