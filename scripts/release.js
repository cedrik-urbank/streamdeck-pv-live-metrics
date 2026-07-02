/* eslint-disable jsdoc/require-jsdoc */
import { execSync } from "child_process";
import fs from "fs";

function run(cmd) {
	console.log(`> ${cmd}`);
	execSync(cmd, { stdio: "inherit" });
}

// Read version from manifest.json
const manifestPath = "de.cedrik.pv-live-metrics.sdPlugin/manifest.json";

if (!fs.existsSync(manifestPath)) {
	console.error("manifest.json not found at:", manifestPath);
	process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const version = manifest.Version;

if (!version) {
	console.error("No Version field found in manifest.json");
	process.exit(1);
}

const tag = `v${version}`;

console.log(`Releasing version ${tag}`);

// Safety checks
run("npm run validate");
run("npm run build");

// Optional: ensure working tree is clean
try {
	run("git diff --quiet");
} catch {
	console.error("You have uncommitted changes. Commit first.");
	process.exit(1);
}

// Create tag
run(`git tag ${tag}`);

// Push branch (optional but safe)
run("git push origin main");

// Push tag (triggers GitHub Actions release)
run(`git push origin ${tag}`);

console.log(`Release ${tag} pushed successfully`);
