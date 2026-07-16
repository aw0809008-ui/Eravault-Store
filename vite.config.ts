import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function pushPlugin() {
  let done = false;
  return {
    name: 'push',
    buildStart() {
      if (done) return;
      done = true;
      try { execSync('node github-push.mjs', { stdio: 'inherit', cwd: __dirname }); }
      catch { console.log('Push skipped'); }
    }
  };
}

export default defineConfig({
  plugins: [pushPlugin(), react(), tailwindcss(), viteSingleFile()],
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
});
