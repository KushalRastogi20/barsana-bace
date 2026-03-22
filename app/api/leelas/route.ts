import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { connectDB } = await import("@/lib/mongodb");
    const Folder = (await import("@/models/Folder")).default;
    await connectDB();

    const folders = await Folder.find({ isPublished: true })
      .select("name description slug emoji color tag coverImage mediaCount")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(folders, {
      headers: { "Cache-Control": "s-maxage=30, stale-while-revalidate=60" },
    });
  } catch (error) {
    console.error("Error fetching folders:", error);
    return NextResponse.json([], { status: 500 });
  }
}
