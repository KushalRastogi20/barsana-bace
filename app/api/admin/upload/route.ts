import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/adminAuth";
import { uploadToCloudinary } from "@/lib/cloudinary";
import Folder from "@/models/Folder";
import Media from "@/models/Media";

const MAX_SIZE_MB = 100;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

// POST /api/admin/upload
// Body: multipart/form-data  { folderId: string, files: File[] }
export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  await connectDB();

  const formData = await req.formData();
  const folderId = formData.get("folderId")?.toString();
  const files = formData.getAll("files") as File[];

  if (!folderId) {
    return NextResponse.json({ error: "folderId is required" }, { status: 400 });
  }
  if (!files || files.length === 0) {
    return NextResponse.json({ error: "No files provided" }, { status: 400 });
  }

  // Validate folder exists
  const folder = await Folder.findById(folderId);
  if (!folder) {
    return NextResponse.json({ error: "Folder not found" }, { status: 404 });
  }

  const results: { success: boolean; name: string; url?: string; error?: string }[] = [];

  for (const file of files) {
    // Size guard
    if (file.size > MAX_SIZE_BYTES) {
      results.push({ success: false, name: file.name, error: `Exceeds ${MAX_SIZE_MB}MB limit` });
      continue;
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const isVideo = file.type.startsWith("video/");

    try {
      const uploaded = await uploadToCloudinary(buffer, {
        folder: folder.cloudinaryFolder,
        resourceType: isVideo ? "video" : "image",
      });

      const media = await Media.create({
        folderId: folder._id,
        folderSlug: folder.slug,
        cloudinaryPath: uploaded.publicId,   // ← the Cloudinary "path"
        secureUrl: uploaded.secureUrl,
        url: uploaded.url,
        resourceType: isVideo ? "video" : "image",
        format: uploaded.format,
        width: uploaded.width,
        height: uploaded.height,
        duration: uploaded.duration,
        bytes: uploaded.bytes,
      });

      results.push({ success: true, name: file.name, url: media.secureUrl });
    } catch (err: any) {
      results.push({ success: false, name: file.name, error: err?.message ?? "Upload failed" });
    }
  }

  // Update mediaCount on folder
  const count = await Media.countDocuments({ folderId: folder._id, isPublished: true });
  await Folder.findByIdAndUpdate(folderId, { mediaCount: count });

  const allOk = results.every((r) => r.success);
  return NextResponse.json({ results }, { status: allOk ? 200 : 207 });
}
