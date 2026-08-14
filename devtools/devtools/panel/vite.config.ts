import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

const panelRoot = fileURLToPath(new URL(".", import.meta.url));
const repoRoot = fileURLToPath(new URL("../../..", import.meta.url));
const rootReact = fileURLToPath(new URL("../../../node_modules/react", import.meta.url));
const rootReactDom = fileURLToPath(
  new URL("../../../node_modules/react-dom", import.meta.url),
);

export default defineConfig({
  root: panelRoot,
  base: "./",
  plugins: [
    react(),
    {
      name: "extension-html",
      transformIndexHtml(html) {
        // chrome-extension:// pages are not CORS-enabled; Vite's crossorigin
        // attribute can break module loading in the panel.
        return html.replaceAll(" crossorigin", "");
      },
    },
  ],
  resolve: {
    // EventFlowPanel lives under site/ and would otherwise resolve site/node_modules/react
    // while the panel resolves the repo-root copy — two Reacts makes useState's dispatcher null.
    dedupe: ["react", "react-dom", "@xyflow/react"],
    alias: {
      fastrx: fileURLToPath(new URL("../../../src/index.ts", import.meta.url)),
      react: rootReact,
      "react-dom": rootReactDom,
      "@xyflow/react": fileURLToPath(
        new URL("../../../node_modules/@xyflow/react", import.meta.url),
      ),
    },
  },
  server: {
    fs: { allow: [repoRoot] },
  },
  build: {
    target: "es2022",
    outDir: fileURLToPath(new URL("./dist", import.meta.url)),
    emptyOutDir: true,
  },
});
