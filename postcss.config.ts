/* eslint-disable @typescript-eslint/no-require-imports */
// postcss.config.js
const tailwindcss = require("tailwindcss");
const autoprefixer = require("autoprefixer");

module.exports = {
  plugins: [
    tailwindcss(),
    autoprefixer(),
    // other plugins like autoprefixer can go here
  ],
};
