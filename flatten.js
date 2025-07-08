import { promises as fs } from 'fs';
import path from 'path';

const SRC_DIR = path.resolve('src');
const PACKAGE_JSON = path.resolve('package.json');
const OUTPUT_FILE = path.resolve('public', 'flattened-source.txt');
const INCLUDE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.css', '.scss', '.json'];

async function getAllFiles(dir) {
  let entries = await fs.readdir(dir, { withFileTypes: true });
  let files = await Promise.all(entries.map(async entry => {
    let res = path.resolve(dir, entry.name);
    if (entry.isDirectory()) {
      return await getAllFiles(res);
    } else {
      return res;
    }
  }));
  return Array.prototype.concat(...files);
}

async function flatten() {
  console.log(`🔍 Scanning source files in: ${SRC_DIR}`);
  const files = await getAllFiles(SRC_DIR);

  let output = '';

  // Include package.json first
  try {
    const packageContent = await fs.readFile(PACKAGE_JSON, 'utf8');
    output += `=== package.json ===\n`;
    output += packageContent + '\n';
  } catch (err) {
    console.warn(`⚠️  Could not read package.json:`, err);
  }

  for (const file of files) {
    const ext = path.extname(file);
    if (!INCLUDE_EXTENSIONS.includes(ext)) {
      continue;
    }

    const relPath = path.relative(process.cwd(), file);
    let content = await fs.readFile(file, 'utf8');

    output += `\n=== ${relPath} ===\n`;
    output += content + '\n';
  }

  await fs.mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
  await fs.writeFile(OUTPUT_FILE, output, 'utf8');
  console.log(`✅ Flattened source written to: ${OUTPUT_FILE}`);
}

flatten().catch(err => {
  console.error(`❌ Error flattening source:`, err);
  process.exit(1);
});
