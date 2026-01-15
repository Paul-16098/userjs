import eslintJs from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import userscripts from "eslint-plugin-userscripts";

export default [
  {
    ignores: [
      "node_modules/",
      "dist/",
      "build/",
      "**/*.js",
      "**/*.d.ts",
      "**/*.less",
      "**/*.css",
      "**/*.json",
      "pnpm-lock.yaml",
    ],
  },
  eslintJs.configs.recommended,
  {
    files: ["**/*.ts", "**/*.user.ts"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        // Browser APIs
        console: "readonly",
        window: "readonly",
        document: "readonly",
        location: "readonly",
        URL: "readonly",
        URLSearchParams: "readonly",
        fetch: "readonly",
        setTimeout: "readonly",
        setInterval: "readonly",
        clearTimeout: "readonly",
        clearInterval: "readonly",
        alert: "readonly",
        confirm: "readonly",
        prompt: "readonly",
        addEventListener: "readonly",
        removeEventListener: "readonly",

        // HTML Elements
        Element: "readonly",
        HTMLElement: "readonly",
        HTMLAnchorElement: "readonly",
        HTMLDivElement: "readonly",
        HTMLFormElement: "readonly",
        HTMLInputElement: "readonly",
        HTMLImageElement: "readonly",
        HTMLSpanElement: "readonly",

        // Events
        KeyboardEvent: "readonly",
        MouseEvent: "readonly",
        Event: "readonly",

        // DOM Query Results
        XPathResult: "readonly",

        // Tampermonkey APIs
        GM_getValue: "readonly",
        GM_setValue: "readonly",
        GM_addStyle: "readonly",
        GM_getResourceText: "readonly",
        GM_registerMenuCommand: "readonly",
        GM_openInTab: "readonly",
        unsafeWindow: "readonly",

        // Custom globals (from Tools.user.ts)
        removeElement: "readonly",
        setMenu: "readonly",
        setMenuFn: "readonly",
        newEval: "readonly",
        I18n: "readonly",

        // Site-specific globals
        bookinfo: "readonly",
        addbookcase: "readonly",
        bookManager: "readonly",
      },
    },
    plugins: {
      userscripts,
    },
  },
];
