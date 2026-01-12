/*
 * Compile all .less files in the repository to matching .css files.
 * - Minifies output (compress: true)
 * - Embeds inline source maps (data URI) for easier debugging
 *
 * This script is intentionally dependency-free except for 'less'.
 */
const fsp = require("node:fs/promises");
const path = require("node:path");
const less = require("less");

/**
 * Recursively walk a directory and return all .less files.
 * @param {string} dir
 * @returns {Promise<string[]>}
 */
async function findLessFiles(dir) {
  const entries = await fsp.readdir(dir, { withFileTypes: true });
  const results = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    // Skip common folders we don't need
    if (entry.isDirectory()) {
      if (
        entry.name === "node_modules" ||
        entry.name === ".git" ||
        entry.name === ".github"
      )
        continue;
      results.push(...(await findLessFiles(fullPath)));
    } else if (entry.isFile() && entry.name.endsWith(".less")) {
      results.push(fullPath);
    }
  }
  return results;
}

/**
 * Compile a single less file to css next to it.
 * @param {string} filePath
 */
async function compileFile(filePath) {
  const src = await fsp.readFile(filePath, "utf8");
  const { css } = await less.render(src, {
    filename: filePath, // important for relative imports and sourcemaps
    compress: true,
    sourceMap: {
      sourceMapFileInline: true,
      outputSourceFiles: true,
    },
  });
  const outPath = filePath.replace(/\.less$/i, ".css");
  await fsp.writeFile(outPath, css, "utf8");
  return { in: filePath, out: outPath };
}

async function run() {
  const root = process.cwd();
  const lessFiles = await findLessFiles(root);
  if (lessFiles.length === 0) {
    console.log("No .less files found.");
    return;
  }
  console.log(`Found ${lessFiles.length} .less file(s). Compiling...`);
  const results = [];
  for (const file of lessFiles) {
    const res = await compileFile(file);
    results.push(res);
    console.log(`✔ ${path.relative(root, res.out)}`);
  }
  console.log(`Compiled ${results.length} file(s).`);
}

run().catch((err) => {
  console.error("Less compilation failed:", err && err.stack ? err.stack : err);
  process.exitCode = 1;
});
