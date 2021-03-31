module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "react-app",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/recommended", 
    "plugin:prettier/recommended"
  ],
  parserOptions: {
    ecmaVersion: 2020, 
    ecmaFeatures: {
      jsx: true
    },
    sourceType: "module"
  },
  ignorePatterns: ["node_modules/**/*"],
  rules: {
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/ban-types": "warn",
    "prettier/prettier": "warn",
    "prefer-const": "warn"
  },
  settings: {
    react: {
      version: "detect"
    }
  }
};