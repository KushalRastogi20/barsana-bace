/**
 * Run once to create the admin user:
 *   npx ts-node --project tsconfig.json scripts/seed-admin.ts
 *
 * Or with tsx:
 *   npx tsx scripts/seed-admin.ts
 *
 * Reads ADMIN_EMAIL and ADMIN_PASSWORD from .env.local
 */

import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI!;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@iskcon.org";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "HareKrishna108!";

if (!MONGODB_URI) {
  console.error("❌  MONGODB_URI not set in .env.local");
  process.exit(1);
}

const AdminUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  name: { type: String, default: "Admin" },
  createdAt: { type: Date, default: Date.now },
});

async function seed() {
  console.log("🔌  Connecting to MongoDB…");
  await mongoose.connect(MONGODB_URI);

  const AdminUser =
    mongoose.models.AdminUser ?? mongoose.model("AdminUser", AdminUserSchema);

  const existing = await AdminUser.findOne({ email: ADMIN_EMAIL });
  if (existing) {
    console.log(`✅  Admin user already exists: ${ADMIN_EMAIL}`);
    await mongoose.disconnect();
    return;
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
  await AdminUser.create({ email: ADMIN_EMAIL, passwordHash, name: "Admin" });

  console.log(`✅  Admin user created!`);
  console.log(`    Email:    ${ADMIN_EMAIL}`);
  console.log(`    Password: ${ADMIN_PASSWORD}`);
  console.log(`    Login at: http://localhost:3000/admin/login`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("❌  Seed failed:", err);
  process.exit(1);
});
