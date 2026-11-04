// Copies the standalone apps in apps/<name>/ into public/<name>/ so Next.js
// serves them at youssefrajeh.com/<name>/. The apps stay independent: no
// shared code with the portfolio, and public/<name>/ is generated (gitignored).
// Runs automatically before `npm run dev` and `npm run build`.
import { cpSync, rmSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");

// Each entry must also be listed in .gitignore as /public/<name>/.
// Explicit on purpose: the target folder is wiped before copying.
const APPS = ["millionaire", "nagham"];

// Source-only files that should not be published with the app.
const EXCLUDE = new Set(["README.md", "README.txt", "tools", "api", ".git"]);

for (const name of APPS) {
  const src = join(root, "apps", name);
  const dest = join(root, "public", name);
  rmSync(dest, { recursive: true, force: true });
  cpSync(src, dest, {
    recursive: true,
    filter: (path) => !EXCLUDE.has(path.slice(src.length + 1).split(/[\\/]/)[0]),
  });
  console.log(`synced apps/${name} -> public/${name}`);
}
