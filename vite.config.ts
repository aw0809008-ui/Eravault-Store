import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// GitHub push plugin — runs once during build
function githubPushPlugin() {
  let pushed = false;
  return {
    name: 'github-push',
    buildStart() {
      if (pushed) return;
      pushed = true;
      try {
        console.log('\n📤 Pushing to GitHub...\n');
        execSync('node github-push.mjs', { stdio: 'inherit', cwd: __dirname });
      } catch (e) {
        console.log('⚠️ GitHub push encountered an issue, continuing build...');
      }
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [githubPushPlugin(), react(), tailwindcss(), viteSingleFile()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
