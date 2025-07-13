import { promises as fs } from 'fs';
import path from 'path';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const SRC_DIR = path.resolve('client');
const SERVER_DIR = path.resolve('server');
const PACKAGE_JSON = path.resolve('package.json');
const OPENAPI_YAML = path.resolve('openapi.yaml');
const OUTPUT_FILE = path.resolve('public', 'flattened-source.txt');
const INCLUDE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.css', '.scss', '.json', '.yaml', '.yml'];

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
  console.log(`🔍 Scanning source files in: ${SRC_DIR} and ${SERVER_DIR}`);
  const srcFiles = await getAllFiles(SRC_DIR);
  const serverFiles = await getAllFiles(SERVER_DIR);
  const files = [...srcFiles, ...serverFiles];

  let output = '';

  // Include package.json first
  try {
    const packageContent = await fs.readFile(PACKAGE_JSON, 'utf8');
    output += `=== package.json ===\n`;
    output += packageContent + '\n';
  } catch (err) {
    console.warn(`⚠️  Could not read package.json:`, err);
  }

  // Include openapi.yaml
  try {
    const openapiContent = await fs.readFile(OPENAPI_YAML, 'utf8');
    output += `=== openapi.yaml ===\n`;
    output += openapiContent + '\n';
  } catch (err) {
    console.warn(`⚠️  Could not read openapi.yaml:`, err);
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

  // Create zip file using system zip command
  const zipPath = path.resolve('public', 'reffile.zip');
  try {
    await execAsync(`zip -j "${zipPath}" "${OUTPUT_FILE}"`);
    console.log(`✅ Zip file created: ${zipPath}`);
  } catch (err) {
    console.warn(`⚠️  Could not create zip file:`, err.message);
    console.log(`📄 Flattened file available at: ${OUTPUT_FILE}`);
  }
}

flatten().catch(err => {
  console.error(`❌ Error flattening source:`, err);
  process.exit(1);
});
