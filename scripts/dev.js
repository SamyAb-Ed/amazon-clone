#!/usr/bin/env node

// Development script to ensure proper configuration
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("🚀 Starting Amazon Clone Development Server...");
console.log("📁 Working directory:", process.cwd());

// Check if we're in the right directory
if (!fs.existsSync("package.json")) {
  console.error(
    "❌ Error: package.json not found. Please run this from the project root."
  );
  process.exit(1);
}

// Check if node_modules exists
if (!fs.existsSync("node_modules")) {
  console.log("📦 Installing dependencies...");
  execSync("npm install", { stdio: "inherit" });
}

console.log("✅ Starting development server...");
console.log("🌐 Server will be available at: http://localhost:3000");
console.log("📝 Note: Base path is disabled for local development");

// Start the development server
execSync("npm run dev", { stdio: "inherit" });
