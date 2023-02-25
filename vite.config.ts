import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import monkey from "vite-plugin-monkey";
import configs from "./src/configs";

const baseUrl = configs.baseUrl;
const pages = configs.pages;
const excludedPages = configs.excludedPages;

export default defineConfig({
  plugins: [
    solidPlugin(),
    monkey({
      entry: "src/index.tsx",
      userscript: {
        icon: "https://www.google.com/s2/favicons?sz=64&domain=pobre.wtf",
        namespace: "pobretv-enhanced",
        match: [
          baseUrl,
          ...pages.map((page) => `${baseUrl}/${page}`),
          ...pages.map((page) => `${baseUrl}/${page}/*`),
        ].sort(),
        exclude: [
          ...excludedPages.map((page) => `${baseUrl}/${page}`),
          ...excludedPages.map((page) => `${baseUrl}/${page}/*`),
        ],
        description: "Pobretv enhanced",
        version: "0.0.1",
        name: "Pobreflix",
        downloadURL:
          "https://raw.githubusercontent.com/joelcc97/pobreflix/c017af5e7176f4460521430b295452f0866ee2db/dist/pobretv.user.js",
        updateURL:
          "https://raw.githubusercontent.com/joelcc97/pobreflix/c017af5e7176f4460521430b295452f0866ee2db/dist/pobretv.user.js",
      },
    }),
  ],
});
