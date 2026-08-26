import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const files = execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard"], { encoding: "utf8" })
  .split(/\r?\n/)
  .filter(Boolean)
  .map((file) => file.replaceAll("\\", "/"));
const manifest = JSON.parse(readFileSync("public/asset-manifest.json", "utf8"));
const approvedAssets = new Map(manifest.assets.map((asset) => [asset.path, asset]));
const failures = [];
const binaryExtensions = new Set([".png", ".webp", ".jpg", ".jpeg", ".gif", ".svg", ".mp4", ".mov", ".mp3", ".wav", ".pdf", ".zip"]);
const textExtensions = new Set([".css", ".html", ".js", ".json", ".jsx", ".md", ".mjs", ".ts", ".tsx", ".txt", ".yml", ".yaml"]);
const forbiddenPaths = [
  /(^|\/)\.env(?:\.|$)/i,
  /(^|\/)(g-ads|operations?|audits?|proposals?|runbooks?|backups?|logs?)(\/|$)/i,
  /(^|\/)(google-ads\.ya?ml|\.npmrc|\.netrc)$/i,
  /\.(?:key|pem|p12|pfx)$/i,
  /(^|\/)(?:src\/)?app\/.+\/route\.(?:js|ts)$/i,
  /(^|\/)(?:src\/)?app\/components\/(?:SiteHeader|SectionNavigator|MobileMenu|SocialLinks)\.(?:jsx?|tsx?)$/i,
];
const secretPatterns = [
  ["private key material", new RegExp("BEGIN [A-Z ]*PRIVATE" + " KEY")],
  ["GitHub token", new RegExp("gh[pousr]_" + "[A-Za-z0-9]{30,}")],
  ["Google OAuth secret", new RegExp("GOCSPX-" + "[A-Za-z0-9_-]{20,}")],
  ["Google refresh token", new RegExp("1\\/\\/" + "[A-Za-z0-9_-]{20,}")],
  ["Twilio secret identifier", new RegExp("\\b(?:SK|AC)" + "[a-f0-9]{32}\\b", "i")],
  ["JWT-like token", new RegExp("eyJ[A-Za-z0-9_-]{10,}\\." + "[A-Za-z0-9_-]{10,}\\.[A-Za-z0-9_-]{10,}")],
  ["local user path", new RegExp("[A-Za-z]:\\\\" + "Users\\\\")],
  ["server action directive", new RegExp("[\"']use " + "server[\"']")],
  ["excluded third-party promotional link", /(?:bbb\.org|facebook\.com|instagram\.com)/i],
  ["production verification metadata", /(?:google-site-verification|verification\s*:)/i],
];

for (const file of files) {
  if (forbiddenPaths.some((pattern) => pattern.test(file))) failures.push(`${file}: prohibited path`);
  const dot = file.lastIndexOf(".");
  const extension = dot === -1 ? "" : file.slice(dot).toLowerCase();
  if (binaryExtensions.has(extension) && !approvedAssets.has(file)) failures.push(`${file}: binary asset is not approved in public/asset-manifest.json`);
  if (!textExtensions.has(extension) || file === "scripts/check-publication-safety.mjs") continue;
  const text = readFileSync(file, "utf8");
  for (const [label, pattern] of secretPatterns) if (pattern.test(text)) failures.push(`${file}: possible ${label}`);
}

for (const [path, asset] of approvedAssets) {
  if (!files.includes(path)) {
    failures.push(`${path}: manifest entry has no repository file`);
    continue;
  }
  const bytes = readFileSync(path);
  const digest = createHash("sha256").update(bytes).digest("hex");
  if (digest !== asset.sha256) failures.push(`${path}: content does not match approved digest`);
  if (path.endsWith(".png")) {
    const chunks = bytes.toString("latin1").match(/(?:eXIf|iTXt|tEXt|zTXt)/g) ?? [];
    if (chunks.length) failures.push(`${path}: PNG contains ancillary metadata chunk (${[...new Set(chunks)].join(", ")})`);
  }
}

if (failures.length) {
  console.error("Publication safety check failed:\n" + failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}

console.log(`Publication safety check passed for ${files.length} files and ${approvedAssets.size} approved assets.`);
