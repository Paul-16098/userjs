/// <reference path="./types/esbuild-plugin-replace-regex.d.ts"/>
import * as fs from "node:fs";
import * as path from "node:path";
import { build } from "esbuild";
import replacePlugin from "esbuild-plugin-replace-regex";

// 掃描第一層子資料夾中的 *.user.ts
function findUserTsFiles(rootDir: string): string[] {
  const entries = fs.readdirSync(rootDir, { withFileTypes: true });
  const files: string[] = [];
  for (const ent of entries) {
    if (!ent.isDirectory()) continue;
    if (["node_modules", ".git", ".vscode"].includes(ent.name)) continue;
    const dir = path.join(rootDir, ent.name);
    const dirFiles = fs.readdirSync(dir, { withFileTypes: true });
    for (const f of dirFiles) {
      if (f.isFile() && f.name.endsWith(".user.ts"))
        files.push(path.join(dir, f.name));
    }
  }
  return files;
}

async function tryBuildWithEsbuild(files: string[]): Promise<boolean> {
  await build({
    entryPoints: files,
    outdir: ".",
    bundle: true,
    format: "iife",
    minify: true,
    platform: "browser",
    target: "ESNext",
    sourcemap: true,
    logLevel: "info",
    plugins: [replacePlugin({ patterns: [] })],
  });
  console.log("[build] done (esbuild)");
  return true;
}

async function main() {
  const root = process.cwd();
  const files = findUserTsFiles(root);
  if (files.length === 0) {
    console.log("[build] no *.user.ts found");
    return;
  }
  // 先嘗試使用 esbuild
  await tryBuildWithEsbuild(files);
  for (const f of files) {
    const metaPath = f.replace(/\.ts$/i, ".metadate");
    const jsPath = f.replace(/\.ts$/i, ".js");
    fs.readFile(metaPath, "utf8", (err, meta) => {
      if (err) {
        console.warn(
          `[build] skip meta for ${path.basename(f)}: ${err.message}`
        );
        return;
      }
      fs.readFile(jsPath, "utf8", (e, js) => {
        if (e) {
          console.warn(
            `[build] failed to read js for ${path.basename(f)}: ${e.message}`
          );
          return;
        }
        fs.writeFile(jsPath, meta + js, "utf8", (wErr) => {
          if (wErr)
            console.warn(
              `[build] failed to write for ${path.basename(f)}: ${wErr.message}`
            );
        });
      });
    });
  }
  console.log("[build] done (ts transpile)");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
