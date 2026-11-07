import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const nodeModulesDir = path.resolve(__dirname, "../node_modules");

function walkAndPatch(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkAndPatch(fullPath);
    } else if (entry.name === "decompress.js" && fullPath.includes("undici")) {
      try {
        const content = fs.readFileSync(fullPath, "utf8");
        const target = "zstd: createZstdDecompress.bind(null, { params: { [constants.ZSTD_d_windowLogMax]: 23 } })";
        const replacement = "zstd: createZstdDecompress ? createZstdDecompress.bind(null, { params: { [constants?.ZSTD_d_windowLogMax]: 23 } }) : undefined";
        if (content.includes(target)) {
          fs.writeFileSync(fullPath, content.replace(target, replacement), "utf8");
          console.log(`[patch-undici] Patched Node 22.14 zstd compatibility in: ${fullPath}`);
        }
      } catch (err) {
        // Ignore read/write permission errors during walk
      }
    }
  }
}

walkAndPatch(nodeModulesDir);
