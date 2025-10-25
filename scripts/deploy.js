#!/usr/bin/env node

// Deployment script for GitHub Pages
const { execSync } = require("child_process");
const fs = require("fs");

console.log("🚀 Deploying Amazon Clone to GitHub Pages...");

// Check if we're in the right directory
if (!fs.existsSync("package.json")) {
  console.error(
    "❌ Error: package.json not found. Please run this from the project root."
  );
  process.exit(1);
}

console.log("🔧 Building for production...");
execSync("npm run build:prod", { stdio: "inherit" });

console.log("📦 Deploying to GitHub Pages...");
execSync("npm run deploy", { stdio: "inherit" });

console.log("✅ Deployment complete!");
console.log(
  "🌐 Your app is available at: https://SamyAb-Ed.github.io/amazon-clone"
);
