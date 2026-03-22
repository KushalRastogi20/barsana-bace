import mongoose, { Schema, Document, Model } from "mongoose";

export type MediaType = "image" | "video";

export interface IMedia extends Document {
  _id: mongoose.Types.ObjectId;
  folderId: mongoose.Types.ObjectId;   // ref → Folder
  folderSlug: string;                   // denormalized for fast lookup
  cloudinaryPath: string;               // Cloudinary public_id (the "path")
  secureUrl: string;                    // https://res.cloudinary.com/...
  url: string;                          // http variant
  resourceType: MediaType;
  format: string;                       // jpg | mp4 | webp …
  width?: number;
  height?: number;
  duration?: number;                    // seconds, videos only
  bytes: number;
  caption?: string;
  altText?: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MediaSchema = new Schema<IMedia>(
  {
    folderId: { type: Schema.Types.ObjectId, ref: "Folder", required: true, index: true },
    folderSlug: { type: String, required: true, index: true },
    cloudinaryPath: { type: String, required: true, unique: true },  // the Cloudinary "path"
    secureUrl: { type: String, required: true },
    url: { type: String, required: true },
    resourceType: { type: String, enum: ["image", "video"], required: true },
    format: { type: String, default: "" },
    width: { type: Number },
    height: { type: Number },
    duration: { type: Number },
    bytes: { type: Number, default: 0 },
    caption: { type: String, default: "" },
    altText: { type: String, default: "" },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Media: Model<IMedia> =
  mongoose.models.Media ?? mongoose.model<IMedia>("Media", MediaSchema);

export default Media;
