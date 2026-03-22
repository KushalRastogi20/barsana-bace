import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/adminAuth";
import Media from "@/models/Media";

type Params = { params: { folderId: string } };

// GET /api/admin/folders/:folderId/media
export async function GET(req: NextRequest, { params }: Params) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const page  = Math.max(1, Number(searchParams.get("page")  ?? 1));
  const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? 24)));
  const skip  = (page - 1) * limit;

  await connectDB();

  const [media, total] = await Promise.all([
    Media.find({ folderId: params.folderId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Media.countDocuments({ folderId: params.folderId }),
  ]);

  return NextResponse.json({
    media,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
}
