module.exports = {
    extends: ["@hono/eslint-config", "plugin:prettier/recommended",
   "prettier"],
    plugins: ["prettier"],
    rules: {
    "prettier/prettier": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-var-requires": "error",
    }
   };