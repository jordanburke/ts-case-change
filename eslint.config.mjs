import typescriptEslint from "@typescript-eslint/eslint-plugin"
import globals from "globals"
import tsParser from "@typescript-eslint/parser"
import path from "node:path"
import { fileURLToPath } from "node:url"
import js from "@eslint/js"
import { FlatCompat } from "@eslint/eslintrc"
import functionalEslint from "eslint-plugin-functional"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default [
  {
    ignores: ["dist/**/*", "scripts/**/*"],
  },
  ...compat.extends("eslint:recommended", "plugin:@typescript-eslint/recommended"),
  {
    plugins: {
      "@typescript-eslint": typescriptEslint,
      "functional": functionalEslint,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
      },

      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
    },

    rules: {
      "@typescript-eslint/ban-types": "off",
      "@typescript-eslint/no-explicit-any": "error",
      "no-mixed-spaces-and-tabs": "error",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-extra-semi": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-namespace": "off",
      "no-case-declarations": "off",
      "no-extra-semi": "off",
      "sonarjs/cognitive-complexity": "off",
      "sonarjs/no-all-duplicated-branches": "off",

      // Enforce immutability
      "prefer-const": "error",     // Built-in rule to prefer const when possible
      "no-var": "error",           // Built-in rule to forbid var
      "functional/no-let": "warn", // Warns when let is used
    },
  },
]
