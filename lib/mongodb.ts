import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI || MONGODB_URI.trim() === "") {
  throw new Error(
    `Invalid or missing MONGODB_URI. Got: "${MONGODB_URI}". Please define MONGODB_URI in your .env.local file starting with "mongodb://" or "mongodb+srv://"`
  );
}

/** Global cache to avoid re-connecting on every hot reload in dev */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: MongooseCache;
}

if (!global._mongooseCache) {
  global._mongooseCache = { conn: null, promise: null };
}

const cache = global._mongooseCache;

export async function connectDB(): Promise<typeof mongoose> {
  if (cache.conn) return cache.conn;

  if (!cache.promise) {
    console.log("Connecting to MongoDB...",MONGODB_URI);
    cache.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  cache.conn = await cache.promise;
  // console.log("MongoDB connected:", cache.conn.connection.host);
  return cache.conn;
}
