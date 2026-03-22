import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Folder from "@/models/Folder";

export async function GET() {
  try {
    await connectDB();

    const folders = await Folder.find({ isPublished: true })
      .sort({ createdAt: -1 })
      .select("name description slug emoji color tag coverImage mediaCount createdAt")
      .lean();

    return NextResponse.json(folders, {
      headers: { "Cache-Control": "s-maxage=30, stale-while-revalidate=60" },
    });
  } catch (error) {
    console.error("Error fetching folders:", error);
    return NextResponse.json([], { status: 500 });
  }
}
