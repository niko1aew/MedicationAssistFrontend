// scripts/generate-version.js
import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read version from package.json
const packageJson = JSON.parse(
  await import("fs").then((fs) =>
    fs.readFileSync(join(__dirname, "../package.json"), "utf-8")
  )
);

const versionInfo = {
  version: packageJson.version,
  buildTime: new Date().toISOString(),
};

// Write version.json to dist folder
const distPath = join(__dirname, "../dist/version.json");
writeFileSync(distPath, JSON.stringify(versionInfo, null, 2));

console.log(
  `✅ Generated version.json: v${versionInfo.version} at ${versionInfo.buildTime}`
);
