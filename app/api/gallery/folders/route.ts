import { NextResponse } from "next/server";
import { GALLERY_ITEMS } from "@/lib/data";

/**
 * GET /api/gallery/folders
 *
 * Returns all gallery folders / albums.
 * Replace GALLERY_ITEMS with your real DB / S3 / storage query.
 *
 * Example with AWS S3:
 *   const { Contents } = await s3.listObjectsV2({ Bucket: "...", Delimiter: "/" }).promise();
 *
 * Example with Cloudinary:
 *   const { resources } = await cloudinary.api.resources({ type: "upload", prefix: "gallery/" });
 */
export async function GET() {
  try {
    // ── Replace this block with your real data source ──────────────────
    const folders = GALLERY_ITEMS;
    // ────────────────────────────────────────────────────────────────────

    return NextResponse.json(folders, {
      headers: {
        "Cache-Control": "s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("[/api/gallery/folders] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch gallery folders" },
      { status: 500 }
    );
  }
}
