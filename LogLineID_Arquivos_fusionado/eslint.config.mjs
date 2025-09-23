import tseslint from "typescript-eslint";
export default tseslint.config(
  tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: { parserOptions: { project: ["tsconfig.json", "packages/*/tsconfig.json"] } },
    rules: {
      "@typescript-eslint/no-floating-promises": "warn",
      "@typescript-eslint/consistent-type-imports": "warn"
    }
  }
);
