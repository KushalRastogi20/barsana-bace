import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/adminAuth";
import Folder from "@/models/Folder";

// GET /api/admin/folders — list all folders (admin)
export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  await connectDB();
  const folders = await Folder.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(folders);
}

// POST /api/admin/folders — create a new folder
export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json();
  const { name, description, emoji, color, tag } = body;

  if (!name?.trim()) {
    return NextResponse.json({ error: "Folder name is required" }, { status: 400 });
  }

  await connectDB();

  // Build slug from name
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  // Check slug uniqueness
  const existing = await Folder.findOne({ slug });
  if (existing) {
    return NextResponse.json(
      { error: "A folder with this name already exists." },
      { status: 409 }
    );
  }

  const folder = await Folder.create({
    name: name.trim(),
    description: description?.trim() ?? "",
    slug,
    cloudinaryFolder: `krishna-gallery/${slug}`,
    emoji: emoji ?? "🪷",
    color: color ?? "#f0b429",
    tag: tag?.trim() ?? "Gallery",
  });

  return NextResponse.json(folder, { status: 201 });
}
