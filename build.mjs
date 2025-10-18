var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
/// <reference path="./types/esbuild-plugin-replace-regex.d.ts"/>
import * as fs from "node:fs";
import * as path from "node:path";
import { build } from "esbuild";
import replacePlugin from "esbuild-plugin-replace-regex";
// 掃描第一層子資料夾中的 *.user.ts
function findUserTsFiles(rootDir) {
    var entries = fs.readdirSync(rootDir, { withFileTypes: true });
    var files = [];
    for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
        var ent = entries_1[_i];
        if (!ent.isDirectory())
            continue;
        if (["node_modules", ".git", ".vscode"].includes(ent.name))
            continue;
        var dir = path.join(rootDir, ent.name);
        var dirFiles = fs.readdirSync(dir, { withFileTypes: true });
        for (var _a = 0, dirFiles_1 = dirFiles; _a < dirFiles_1.length; _a++) {
            var f = dirFiles_1[_a];
            if (f.isFile() && f.name.endsWith(".user.ts"))
                files.push(path.join(dir, f.name));
        }
    }
    return files;
}
function tryBuildWithEsbuild(files) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, build({
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
                    })];
                case 1:
                    _a.sent();
                    console.log("[build] done (esbuild)");
                    return [2 /*return*/, true];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var root, files, _loop_1, _i, files_1, f;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    root = process.cwd();
                    files = findUserTsFiles(root);
                    if (files.length === 0) {
                        console.log("[build] no *.user.ts found");
                        return [2 /*return*/];
                    }
                    // 先嘗試使用 esbuild
                    return [4 /*yield*/, tryBuildWithEsbuild(files)];
                case 1:
                    // 先嘗試使用 esbuild
                    _a.sent();
                    _loop_1 = function (f) {
                        var metaPath = f.replace(/\.ts$/i, ".metadate");
                        var jsPath = f.replace(/\.ts$/i, ".js");
                        fs.readFile(metaPath, "utf8", function (err, meta) {
                            if (err) {
                                console.warn("[build] skip meta for ".concat(path.basename(f), ": ").concat(err.message));
                                return;
                            }
                            fs.readFile(jsPath, "utf8", function (e, js) {
                                if (e) {
                                    console.warn("[build] failed to read js for ".concat(path.basename(f), ": ").concat(e.message));
                                    return;
                                }
                                fs.writeFile(jsPath, meta + js, "utf8", function (wErr) {
                                    if (wErr)
                                        console.warn("[build] failed to write for ".concat(path.basename(f), ": ").concat(wErr.message));
                                });
                            });
                        });
                    };
                    for (_i = 0, files_1 = files; _i < files_1.length; _i++) {
                        f = files_1[_i];
                        _loop_1(f);
                    }
                    console.log("[build] done (ts transpile)");
                    return [2 /*return*/];
            }
        });
    });
}
main().catch(function (e) {
    console.error(e);
    process.exit(1);
});
