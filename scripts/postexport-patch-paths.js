const fs = require("fs");
const path = require("path");

const outDir = path.join(__dirname, "..", "dist");

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(fullPath));
    } else if (
      entry.isFile() &&
      (fullPath.endsWith(".html") ||
        fullPath.endsWith(".js") ||
        fullPath.endsWith(".txt"))
    ) {
      files.push(fullPath);
    }
  }
  return files;
}

function patchFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  const replacements = [
    { from: /="\/_next\//g, to: '="./_next/' },
    { from: /='\/_next\//g, to: "='./_next/" },
    { from: /"\/redactosaurus/g, to: '"./redactosaurus' },
    { from: /'\/redactosaurus/g, to: "'./redactosaurus" },
    { from: /="\//g, to: '="./' },
    { from: /='\//g, to: "='./" },
  ];

  for (const { from, to } of replacements) {
    content = content.replace(from, to);
  }

  fs.writeFileSync(filePath, content, "utf8");
}

if (!fs.existsSync(outDir)) {
  console.warn(
    `Skipping post-export path patch: out directory does not exist (${outDir})`,
  );
  process.exit(0);
}

const files = walk(outDir);
for (const file of files) {
  patchFile(file);
}

console.log(
  `Patched ${files.length} files in ${outDir} for relative asset paths.`,
);
