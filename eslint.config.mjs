import globals from "globals";
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
			globals: globals.browser,
		},
		plugins: {
			userscripts,
		},
	},
];
