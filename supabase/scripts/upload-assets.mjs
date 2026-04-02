import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import {
  isOptimizableAsset,
  optimizeImages,
  toOptimizedStoragePath,
} from "../../scripts/optimize-images.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..", "..");
const manifestPath = path.resolve(__dirname, "..", "storage", "upload-manifest.json");

const supabaseUrl =
  process.env.SUPABASE_URL ||
  process.env.REACT_APP_SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL;

const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error(
    "Missing Supabase credentials. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before uploading assets."
  );
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
const sourceAssetsRoot = path.resolve(repoRoot, "src", "assets");
const optimizedAssetsRoot = path.resolve(repoRoot, "optimized-assets", "assets");

await optimizeImages({ quiet: true });

for (const asset of manifest) {
  const absoluteSourcePath = path.resolve(repoRoot, asset.localPath);
  const isOptimizedImage = isOptimizableAsset(asset.localPath);
  const relativeToAssets = path.relative(sourceAssetsRoot, absoluteSourcePath);
  const optimizedRelativePath = relativeToAssets.replace(/\.(png|jpe?g|webp)$/i, ".webp");
  const absolutePath = isOptimizedImage
    ? path.resolve(optimizedAssetsRoot, optimizedRelativePath)
    : absoluteSourcePath;
  const fileBuffer = await fs.readFile(absolutePath);
  const storagePath = isOptimizedImage
    ? toOptimizedStoragePath(asset.storagePath)
    : asset.storagePath;
  const contentType = isOptimizedImage ? "image/webp" : asset.contentType;

  const { error } = await supabase.storage
    .from(asset.bucket)
    .upload(storagePath, fileBuffer, {
      contentType,
      upsert: true,
    });

  if (error) {
    throw new Error(
      `Failed to upload ${asset.localPath} -> ${asset.bucket}/${storagePath}: ${error.message}`
    );
  }

  console.log(`Uploaded ${asset.localPath} -> ${asset.bucket}/${storagePath}`);
}
