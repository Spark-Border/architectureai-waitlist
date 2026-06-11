import mongoose from "mongoose";

// Avoid throwing an error during Next.js static build module evaluation
const getMongoUri = () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "Please define MONGODB_URI in .env.local — get a free 512 MB cluster at https://mongodb.com/atlas"
    );
  }
  return uri;
};

/* cached connection across hot reloads */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cached = (globalThis as any).mongoose;
if (!cached) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cached = (globalThis as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    const uri = getMongoUri();
    cached.promise = mongoose.connect(uri, {
      bufferCommands: false,
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}