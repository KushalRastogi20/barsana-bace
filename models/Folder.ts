import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFolder extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  slug: string;                 // URL-safe identifier
  cloudinaryFolder: string;     // e.g. "krishna-gallery/janmashtami-2024"
  coverImage?: string;          // Cloudinary secure_url of cover
  coverPublicId?: string;       // Cloudinary public_id of cover
  emoji: string;                // Display emoji
  color: string;                // Accent hex color
  tag: string;                  // Short tag label
  mediaCount: number;           // Cached count
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FolderSchema = new Schema<IFolder>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    cloudinaryFolder: { type: String, required: true },
    coverImage: { type: String },
    coverPublicId: { type: String },
    emoji: { type: String, default: "🪷" },
    color: { type: String, default: "#f0b429" },
    tag: { type: String, default: "Gallery" },
    mediaCount: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Auto-generate slug from name if not provided
FolderSchema.pre("validate", function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  // Auto-set cloudinaryFolder if not set
  if (!this.cloudinaryFolder && this.slug) {
    this.cloudinaryFolder = `krishna-gallery/${this.slug}`;
  }
  next();
});

const Folder: Model<IFolder> =
  mongoose.models.Folder ?? mongoose.model<IFolder>("Folder", FolderSchema);

export default Folder;
