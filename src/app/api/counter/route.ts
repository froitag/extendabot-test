import { NextResponse } from "next/server";
import { getCounter, incrementCounter } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const value = await getCounter();
  return NextResponse.json({ value });
}

export async function POST() {
  const value = await incrementCounter();
  return NextResponse.json({ value });
}
