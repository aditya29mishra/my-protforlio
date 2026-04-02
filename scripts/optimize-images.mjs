import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

const SOURCE_DIR = path.resolve(repoRoot, "src", "assets");
const OUTPUT_DIR = path.resolve(repoRoot, "optimized-assets");
const OUTPUT_ASSETS_DIR = path.resolve(OUTPUT_DIR, "assets");
const REPORT_PATH = path.resolve(OUTPUT_DIR, "report.json");

const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp"]);
const MAX_FILE_SIZE_BYTES = 150 * 1024;
const QUALITY_MAX = 78;
const QUALITY_MIN = 70;
const THUMBNAIL_MAX_WIDTH = 800;
const BANNER_MAX_WIDTH = 1600;

function isImageFile(filePath) {
  return IMAGE_EXTENSIONS.has(path.extname(filePath).toLowerCase());
}

async function walkFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const absolutePath = path.resolve(directory, entry.name);

      if (entry.isDirectory()) {
        return walkFiles(absolutePath);
      }

      return absolutePath;
    })
  );

  return files.flat();
}

function isBannerAsset(fileName, metadata) {
  const lowerName = fileName.toLowerCase();
  const bannerHint =
    lowerName.includes("banner") ||
    lowerName.includes("background") ||
    lowerName.includes("hero");

  const isWideLandscape =
    (metadata.width || 0) >= 1600 &&
    (metadata.width || 0) / Math.max(metadata.height || 1, 1) >= 1.6;

  return bannerHint || isWideLandscape;
}

function getOptimizedRelativePath(relativeSourcePath) {
  const parsed = path.parse(relativeSourcePath);
  return path
    .join("assets", parsed.dir, `${parsed.name}.webp`)
    .replace(/\\/g, "/");
}

async function encodeWebp(sourcePath, maxWidth) {
  let currentWidth = maxWidth;
  let quality = QUALITY_MAX;
  let buffer = null;
  let metadata = null;

  while (quality >= QUALITY_MIN) {
    buffer = await sharp(sourcePath)
      .rotate()
      .resize({
        width: currentWidth,
        withoutEnlargement: true,
      })
      .webp({
        quality,
        effort: 6,
      })
      .toBuffer();

    metadata = await sharp(buffer).metadata();

    if (buffer.length <= MAX_FILE_SIZE_BYTES) {
      return { buffer, metadata, quality, width: currentWidth };
    }

    if (quality > QUALITY_MIN) {
      quality = Math.max(QUALITY_MIN, quality - 4);
      continue;
    }

    const smallerWidth = Math.floor(currentWidth * 0.9);

    if (smallerWidth < 480 || smallerWidth === currentWidth) {
      return { buffer, metadata, quality, width: currentWidth };
    }

    currentWidth = smallerWidth;
  }

  return { buffer, metadata, quality, width: currentWidth };
}

export function isOptimizableAsset(filePath) {
  return isImageFile(filePath);
}

export function toOptimizedStoragePath(storagePath) {
  if (!storagePath) {
    return "";
  }

  const parsed = path.posix.parse(storagePath);
  return path.posix.join(parsed.dir, `${parsed.name}.webp`);
}

export async function optimizeImages({ quiet = false } = {}) {
  const sourceFiles = (await walkFiles(SOURCE_DIR)).filter(isImageFile);

  await fs.rm(OUTPUT_DIR, { recursive: true, force: true });
  await fs.mkdir(OUTPUT_ASSETS_DIR, { recursive: true });

  const report = [];

  for (const sourcePath of sourceFiles) {
    const relativeSourcePath = path.relative(SOURCE_DIR, sourcePath);
    const sourceMetadata = await sharp(sourcePath).metadata();
    const maxWidth = isBannerAsset(relativeSourcePath, sourceMetadata)
      ? BANNER_MAX_WIDTH
      : THUMBNAIL_MAX_WIDTH;
    const optimizedRelativePath = getOptimizedRelativePath(relativeSourcePath);
    const outputPath = path.resolve(OUTPUT_DIR, optimizedRelativePath);

    await fs.mkdir(path.dirname(outputPath), { recursive: true });

    const { buffer, metadata, quality, width } = await encodeWebp(
      sourcePath,
      maxWidth
    );

    await fs.writeFile(outputPath, buffer);

    const reportEntry = {
      source: path.relative(repoRoot, sourcePath).replace(/\\/g, "/"),
      output: path.relative(repoRoot, outputPath).replace(/\\/g, "/"),
      width: metadata?.width || width,
      height: metadata?.height || sourceMetadata.height || 0,
      quality,
      sizeKB: Number((buffer.length / 1024).toFixed(1)),
    };

    report.push(reportEntry);

    if (!quiet) {
      console.log(
        `Optimized ${reportEntry.source} -> ${reportEntry.output} (${reportEntry.sizeKB} KB)`
      );
    }
  }

  await fs.writeFile(REPORT_PATH, JSON.stringify(report, null, 2));

  if (!quiet) {
    console.log(`Optimized ${report.length} images into optimized-assets/`);
  }

  return report;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await optimizeImages();
}
