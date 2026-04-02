import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..", "..");
const manifestPath = path.resolve(__dirname, "..", "storage", "upload-manifest.json");

const supabaseUrl =
  process.env.SUPABASE_URL ||
  process.env.REACT_APP_SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL;

const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.REACT_APP_SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error(
    "Missing Supabase credentials. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before uploading assets."
  );
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));

for (const asset of manifest) {
  const absolutePath = path.resolve(repoRoot, asset.localPath);
  const fileBuffer = await fs.readFile(absolutePath);

  const { error } = await supabase.storage
    .from(asset.bucket)
    .upload(asset.storagePath, fileBuffer, {
      contentType: asset.contentType,
      upsert: true,
    });

  if (error) {
    throw new Error(
      `Failed to upload ${asset.localPath} -> ${asset.bucket}/${asset.storagePath}: ${error.message}`
    );
  }

  console.log(`Uploaded ${asset.localPath} -> ${asset.bucket}/${asset.storagePath}`);
}
