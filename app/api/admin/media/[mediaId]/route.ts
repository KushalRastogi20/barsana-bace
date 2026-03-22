import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/adminAuth";
import { deleteFromCloudinary } from "@/lib/cloudinary";
import Media from "@/models/Media";
import Folder from "@/models/Folder";

type Params = { params: { mediaId: string } };

// GET /api/admin/media/:mediaId — single media detail
export async function GET(_req: NextRequest, { params }: Params) {
  const { error } = await requireAdmin();
  if (error) return error;

  await connectDB();
  const media = await Media.findById(params.mediaId).lean();
  if (!media) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(media);
}

// PATCH /api/admin/media/:mediaId — update caption / altText / isPublished
export async function PATCH(req: NextRequest, { params }: Params) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json();
  const allowed = ["caption", "altText", "isPublished"];
  const update: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) update[key] = body[key];
  }

  await connectDB();
  const media = await Media.findByIdAndUpdate(
    params.mediaId,
    { $set: update },
    { new: true }
  ).lean();

  if (!media) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(media);
}

// DELETE /api/admin/media/:mediaId — remove from Cloudinary + DB
export async function DELETE(_req: NextRequest, { params }: Params) {
  const { error } = await requireAdmin();
  if (error) return error;

  await connectDB();
  const media = await Media.findById(params.mediaId);
  if (!media) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Delete from Cloudinary
  await deleteFromCloudinary(
    media.cloudinaryPath,
    media.resourceType as "image" | "video"
  ).catch(() => {});

  const folderId = media.folderId;
  await media.deleteOne();

  // Refresh folder mediaCount
  const count = await Media.countDocuments({ folderId, isPublished: true });
  await Folder.findByIdAndUpdate(folderId, { mediaCount: count });

  return NextResponse.json({ success: true });
}
