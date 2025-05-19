// .eslintrc.js
module.exports = {
  extends: [
    "next/core-web-vitals",
    "plugin:@next/next/recommended",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  parserOptions: {
    project: "./tsconfig.json",
  },
};
