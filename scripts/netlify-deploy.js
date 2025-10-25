#!/usr/bin/env node

// Netlify deployment script
const { execSync } = require("child_process");
const fs = require("fs");

console.log("🚀 Preparing Amazon Clone for Netlify deployment...");

// Check if we're in the right directory
if (!fs.existsSync("package.json")) {
  console.error(
    "❌ Error: package.json not found. Please run this from the project root."
  );
  process.exit(1);
}

console.log("🔧 Building for Netlify...");
execSync("npm run build:netlify", { stdio: "inherit" });

console.log("✅ Netlify build complete!");
console.log("📁 Build files are in the 'dist' directory");
console.log("🌐 Ready for Netlify deployment!");
console.log("");
console.log("Next steps:");
console.log("1. Push your code to GitHub");
console.log("2. Connect your GitHub repo to Netlify");
console.log("3. Netlify will automatically deploy using netlify.toml");
console.log("4. Your app will be available at your Netlify URL");
