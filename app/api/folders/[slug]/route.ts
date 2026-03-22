import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Folder from "@/models/Folder";
import Media from "@/models/Media";

type Params = { params: { slug: string } };

// GET /api/folders/:slug — public folder detail + paginated media
export async function GET(req: NextRequest, { params }: Params) {
  const { searchParams } = new URL(req.url);
  const page  = Math.max(1, Number(searchParams.get("page")  ?? 1));
  const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? 24)));
  const skip  = (page - 1) * limit;

  await connectDB();

  const folder = await Folder.findOne({ slug: params.slug, isPublished: true })
    .select("-cloudinaryFolder -__v")
    .lean();

  if (!folder) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const [media, total] = await Promise.all([
    Media.find({ folderId: folder._id, isPublished: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("secureUrl resourceType format width height duration caption altText cloudinaryPath createdAt")
      .lean(),
    Media.countDocuments({ folderId: folder._id, isPublished: true }),
  ]);

  return NextResponse.json(
    { folder, media, pagination: { page, limit, total, pages: Math.ceil(total / limit) } },
    { headers: { "Cache-Control": "s-maxage=30, stale-while-revalidate=60" } }
  );
}
