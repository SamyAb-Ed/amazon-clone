#!/usr/bin/env node

// Manual Netlify deployment script
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

console.log("🚀 Manual Netlify Deployment Guide");
console.log("==================================");

// Check if we're in the right directory
if (!fs.existsSync("package.json")) {
  console.error(
    "❌ Error: package.json not found. Please run this from the project root."
  );
  process.exit(1);
}

console.log("✅ Project directory found");
console.log("");

console.log("📋 Manual Deployment Steps:");
console.log("1. Build the project:");
console.log("   npm run build:netlify");
console.log("");
console.log("2. Go to https://netlify.com");
console.log("3. Sign up/Login");
console.log("4. Click 'Add new site' → 'Deploy manually'");
console.log("5. Drag and drop the 'dist' folder");
console.log("6. Your site will be live instantly!");
console.log("");

console.log("🔧 Build Configuration:");
console.log("- Build command: npm run build:netlify");
console.log("- Publish directory: dist");
console.log("- Node version: 18");
console.log("");

console.log("🌐 Your site will be available at:");
console.log("https://[random-name].netlify.app");
console.log("");

// Build the project
console.log("🔨 Building project for Netlify...");
try {
  execSync("npm run build:netlify", { stdio: "inherit" });
  console.log("✅ Build completed successfully!");
  console.log("📁 Ready to deploy: dist/ folder");
} catch (error) {
  console.error("❌ Build failed:", error.message);
  process.exit(1);
}
