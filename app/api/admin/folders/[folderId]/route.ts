import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/adminAuth";
import { deleteFromCloudinary } from "@/lib/cloudinary";
import Folder from "@/models/Folder";
import Media from "@/models/Media";

type Params = { params: { folderId: string } };

// GET /api/admin/folders/:folderId
export async function GET(_req: NextRequest, { params }: Params) {
  const { error } = await requireAdmin();
  if (error) return error;

  await connectDB();
  const folder = await Folder.findById(params.folderId).lean();
  if (!folder) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(folder);
}

// PATCH /api/admin/folders/:folderId — update metadata
export async function PATCH(req: NextRequest, { params }: Params) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json();
  const allowed = ["name", "description", "emoji", "color", "tag", "isPublished", "coverImage", "coverPublicId"];
  const update: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) update[key] = body[key];
  }

  await connectDB();
  const folder = await Folder.findByIdAndUpdate(
    params.folderId,
    { $set: update },
    { new: true, runValidators: true }
  ).lean();

  if (!folder) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(folder);
}

// DELETE /api/admin/folders/:folderId — delete folder + all its media from Cloudinary + DB
export async function DELETE(_req: NextRequest, { params }: Params) {
  const { error } = await requireAdmin();
  if (error) return error;

  await connectDB();
  const folder = await Folder.findById(params.folderId);
  if (!folder) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Delete all media from Cloudinary and DB
  const mediaItems = await Media.find({ folderId: params.folderId });
  await Promise.allSettled(
    mediaItems.map((m) =>
      deleteFromCloudinary(m.cloudinaryPath, m.resourceType as "image" | "video")
    )
  );
  await Media.deleteMany({ folderId: params.folderId });

  // Delete cover if present
  if (folder.coverPublicId) {
    await deleteFromCloudinary(folder.coverPublicId, "image").catch(() => {});
  }

  await folder.deleteOne();

  return NextResponse.json({ success: true });
}
