import js from "@eslint/js"
import prettier from "eslint-config-prettier"
import lit from "eslint-plugin-lit"
import perfectionist from "eslint-plugin-perfectionist"
import globals from "globals"
import tseslint from "typescript-eslint"

export default tseslint.config(
  {
    ignores: ["dist", "dev", "node_modules"]
  },
  js.configs.recommended,
  perfectionist.configs["recommended-natural"],
  ...tseslint.configs.recommended,
  lit.configs["flat/recommended"],
  {
    files: ["src/**"],
    languageOptions: {
      globals: globals.browser
    },
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }]
    }
  },
  {
    files: ["*.config.js"],
    languageOptions: {
      globals: globals.node
    }
  },
  prettier
)
