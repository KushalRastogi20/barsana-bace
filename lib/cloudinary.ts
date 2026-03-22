import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  secure: true,
});

export default cloudinary;

/** Upload a file buffer to Cloudinary under a given folder path */
export async function uploadToCloudinary(
  buffer: Buffer,
  options: {
    folder: string;         // e.g. "krishna-gallery/janmashtami"
    resourceType?: "image" | "video" | "auto";
    publicId?: string;
  }
): Promise<{
  publicId: string;
  url: string;
  secureUrl: string;
  resourceType: string;
  format: string;
  width?: number;
  height?: number;
  duration?: number;
  bytes: number;
}> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder,
        resource_type: options.resourceType ?? "auto",
        public_id: options.publicId,
        transformation:
          options.resourceType === "image"
            ? [{ quality: "auto", fetch_format: "auto" }]
            : undefined,
      },
      (error, result) => {
        if (error || !result) return reject(error ?? new Error("Upload failed"));
        resolve({
          publicId: result.public_id,
          url: result.url,
          secureUrl: result.secure_url,
          resourceType: result.resource_type,
          format: result.format,
          width: result.width,
          height: result.height,
          duration: (result as any).duration,
          bytes: result.bytes,
        });
      }
    );
    uploadStream.end(buffer);
  });
}

/** Delete a Cloudinary asset by publicId */
export async function deleteFromCloudinary(
  publicId: string,
  resourceType: "image" | "video" = "image"
) {
  return cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
}
