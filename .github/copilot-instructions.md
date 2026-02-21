# Copilot instructions for this repo

This repo is a monorepo of Tampermonkey/Greasemonkey userscripts written in TypeScript and compiled with SWC. Keep changes pragmatic and consistent with existing patterns.

## Big picture

- One folder per site/script (e.g. `69shuba auto 書簽/`, `czbooksnet/`, `琉璃神社/`). Each contains a `*.user.ts` entry, optional CSS/JSON resources, and a local `tsconfig.json` that emits to the same folder.
- Shared utilities live in `Tools/Tools.user.ts` and are consumed by other scripts via Tampermonkey `@require` and a d.ts reference: `/// <reference path="./../Tools/Tools.user.d.ts"/>`.
- Userscript headers follow Tampermonkey conventions. Many scripts gate local-vs-remote requires using conditional directives that `update_version.py` processes from `F.json` (see below).

## Build & dev workflow

- Use VS Code tasks:
  - Build once: run task "swc: build" (compiles all `**/*.user.ts` in-place to `.user.js` and source maps).
  - Watch: run task "swc: watch" while editing.
- SWC is configured via task args (no `.swcrc` committed here): TypeScript parser, `module=commonjs`, `target=esnext`, `minify=true`, `sourceMaps=true`, `comments=all`. Write modern ES; SWC keeps comments for metadata.
- Conditional @require and version stamps:
  - `F.json` controls flags (e.g. `{ "debug": false }`).
  - `update_version.py` does two things across all `./*/*.user.ts`:
    - Cleans `// @version` to plain numeric (strips `-beta*`).
    - Processes blocks like:
      ```
      //#if debug
      // #@require file://C:\\Users\\p\\Documents\\git\\userjs\\Tools\\Tools.user.js
      //#else
      // @require https://github.com/Paul-16098/userjs/raw/dev/Tools/Tools.user.js
      //#endif
      ```
    - When `debug` is true, local `file://` lines become active; otherwise the remote `@require` remains active. Keep this exact shape in new scripts.

## Project conventions (use these in new code)

- File layout: keep all assets next to the `*.user.ts` (e.g. CSS in the same folder). Remote resources use the `dev` branch raw path, e.g. `.../raw/refs/heads/dev/<folder>/<file>`.
- TypeScript: strict settings (see each folder’s `tsconfig.json`). Other scripts reference `Tools.user.d.ts` for types of helpers and GM APIs (repo depends on `@types/tampermonkey`).
- Metadata header: include `@name`, `@namespace`, `@version`, `@description`, `@match`, relevant `@grant`s, and `@resource` when embedding CSS/JSON. Follow existing examples:
  - CSS resource + injection (from `czbooksnet/czbooksnet.user.ts`): fetch via `GM_getResourceText("css1")` then `GM_addStyle(css1)`.
  - Conditional require of `Tools.user.js` as shown above.
- Shared helpers from `Tools/Tools.user.ts`:
  - `removeElement(...selectors)` to drop unwanted DOM nodes.
  - `setMenu(name, fn?, def?, showMapping?)` to register GM menu toggles; used for per-script config (see `69shuba auto 書簽.user.ts`’s `Config` class and `Language` enum).
  - `i18n` class for simple keyed translations; create with language map and current language, then use `t(key, ...args)`.
  - `newEval(code, safety=true)` for evaluating simple math/text with a blacklist when `safety` is true.
- Page routing pattern (see `69shuba auto 書簽.user.ts`):
  - Define `SELECTORS` and a `data` object grouping URL/DOM checks (e.g. `Book/Info/End` patterns, `IsBiz/IsTwkan` flags) and helpers like `GetNextPageUrl()`.
  - Guard use of site-provided globals (e.g. `bookinfo`, `addbookcase`) and fall back to DOM when absent.
  - For keyboard/nav tweaks, clear `document.onkeydown` and attach your own listeners.

## External integration points

- Tampermonkey GM APIs: scripts grant and use `GM_addStyle`, `GM_get/SetValue`, `GM_registerMenuCommand`, `GM_openInTab`, `GM_getResourceText`, etc. The shared `setGM()` helper normalizes variations across managers; prefer using helpers where they exist.
- Remote assets are served from this repo’s `dev` branch via GitHub raw. Keep URLs consistent with existing files.

## Quick start for a new script

1. Create a folder and copy an existing `tsconfig.json` from a sibling folder.
2. Create `Your Script.user.ts` with a metadata header modeled on `czbooksnet.user.ts` or `69shuba auto 書簽.user.ts`. Add the conditional `@require` block for `Tools.user.js`.
3. If you need styles or data, add `@resource` entries and load with `GM_getResourceText` + `GM_addStyle`.
4. Run "swc: watch" and iterate. When ready, run `update_version.py` so `@version` and `@require` blocks are normalized per `F.json`.

Notes

- Tasks can also be regenerated from a `.swcrc` using `swcrc2taskjson.py` (not typical in this repo since task args are already present).
- Keep `@grant` minimal but sufficient; ensure the code only uses granted APIs.

If anything above is unclear (e.g., release steps, resource hosting paths, or additional shared utilities you want documented), tell me what’s missing and I’ll refine this file.
