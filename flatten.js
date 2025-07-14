// flatten.js
import { promises as fs } from 'fs';
import path from 'path';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// --- CONFIGURATION ---
const SRC_DIR         = path.resolve('client');
const SERVER_DIR      = path.resolve('server');
const PACKAGE_JSON    = path.resolve('package.json');
const OPENAPI_YAML    = path.resolve('openapi.yaml');
const OUTPUT_FILE     = path.resolve('public', 'flattened-source.txt');
const FLATTEN_ZIP     = path.resolve('public', 'flattened-source.zip');
const REPO_ZIP        = path.resolve('public', 'repo.zip');
const INCLUDE_EXTS    = ['.ts','.tsx','.js','.jsx','.css','.scss','.json','.yaml','.yml'];

// --- UTILITIES ---
async function getAllFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(entries.map(entry => {
    const res = path.resolve(dir, entry.name);
    return entry.isDirectory()
      ? getAllFiles(res)
      : Promise.resolve(res);
  }));
  return files.flat();
}

// --- FLATTEN FUNCTIONALITY ---
async function flattenSource() {
  console.log(`🔍 Scanning source in ${SRC_DIR} and ${SERVER_DIR}`);
  const srcFiles    = await getAllFiles(SRC_DIR).catch(() => []);
  const serverFiles = await getAllFiles(SERVER_DIR).catch(() => []);
  const allFiles    = [...srcFiles, ...serverFiles];

  let output = '';

  // package.json
  try {
    const pkg = await fs.readFile(PACKAGE_JSON, 'utf8');
    output += `=== package.json ===\n${pkg}\n`;
  } catch (e) {
    console.warn(`⚠️ Could not read package.json: ${e.message}`);
  }

  // openapi.yaml
  try {
    const oas = await fs.readFile(OPENAPI_YAML, 'utf8');
    output += `=== openapi.yaml ===\n${oas}\n`;
  } catch {
    console.warn('⚠️ openapi.yaml not found, skipping.');
  }

  // each source file
  for (const file of allFiles) {
    if (!INCLUDE_EXTS.includes(path.extname(file))) continue;
    const rel = path.relative(process.cwd(), file);
    const content = await fs.readFile(file, 'utf8');
    output += `\n=== ${rel} ===\n${content}\n`;
  }

  // write flattened text
  await fs.mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
  await fs.writeFile(OUTPUT_FILE, output, 'utf8');
  console.log(`✅ Flattened source written to: ${OUTPUT_FILE}`);

  // zip the flattened text (original behavior)
  try {
    await execAsync(`zip -j "${FLATTEN_ZIP}" "${OUTPUT_FILE}"`);
    console.log(`✅ Flattened archive created: ${FLATTEN_ZIP}`);
  } catch (e) {
    console.warn(`⚠️ Could not ZIP flattened file: ${e.message}`);
    console.log(`📄 Flattened file still available at ${OUTPUT_FILE}`);
  }
}

// --- GIT-ARCHIVE REPO ZIP ---
async function zipRepo() {
  console.log(`📦 Zipping full repo (HEAD) → ${REPO_ZIP}`);
  try {
    await execAsync(`git archive --format=zip --output "${REPO_ZIP}" HEAD`);
    console.log(`✅ Full-repo ZIP created: ${REPO_ZIP}`);
  } catch (e) {
    console.error(`❌ Failed to git-archive repo: ${e.stderr || e.message}`);
    process.exit(1);
  }
}

// --- MAIN ---
async function main() {
  await flattenSource();
  await zipRepo();
}

main().catch(err => {
  console.error(`❌ Unexpected error:`, err);
  process.exit(1);
});
