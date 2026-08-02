import 'dotenv/config';
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '../src/data');
const SAMPLE_DIR = join(__dirname, '../.data');

const CONFIG = {
  academy: {
    base: 'https://academy.hackthebox.com/api/v2',
    output: join(DATA_DIR, 'academy.json'),
    headers: {
      Accept: 'application/json',
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:148.0) Gecko/20100101 Firefox/148.0',
      Referer: 'https://academy.hackthebox.com/app/dashboard',
      Cookie: `htb_academy_session=${process.env.HTB_ACADEMY_SESSION}`,
    },
  },
  machines: {
    base: 'https://labs.hackthebox.com/api/v5',
    output: join(DATA_DIR, 'machines.json'),
    headers: {
      Accept: 'application/json',
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:148.0) Gecko/20100101 Firefox/148.0',
      Authorization: `Bearer ${process.env.HTB_API_TOKEN}`,
      Origin: 'https://app.hackthebox.com',
      Referer: 'https://app.hackthebox.com/',
    },
  },
  thm: {
    base: 'https://tryhackme.com/api/v2',
    output: join(DATA_DIR, 'rooms.json'),
    headers: {
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US',
      'Accept-Encoding': 'gzip, deflate, br',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:152.0) Gecko/20100101 Firefox/152.0',
      'Sec-Gpc': '1',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'Te': 'trailers',
      Cookie: process.env.THM_COOKIES,
    },
  },
  writeups: {
    output: join(DATA_DIR, 'writeups.json'),
  },
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchWithRetry(url, options, { retries = 3, baseDelay = 8000 } = {}) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const res = await fetch(url, options);
    if (res.status === 429) {
      if (attempt === retries) {
        const body = await res.text().catch(() => '(no body)');
        throw new Error(`429 Too Many Requests after ${retries} attempts — body: ${body.slice(0, 200)}`);
      }
      const delay = baseDelay * attempt;
      console.log(`   ⏳ Rate limited (429). Retrying in ${delay / 1000}s... (attempt ${attempt}/${retries})`);
      await sleep(delay);
      continue;
    }
    return res;
  }
}

async function processAcademy() {
  console.log('🎓 Processing HTB Academy...');
  const [statsRes, modulesRes] = await Promise.all([
    fetch(`${CONFIG.academy.base}/modules/statistics`, { headers: CONFIG.academy.headers }),
    fetch(`${CONFIG.academy.base}/modules?per_page=200`, { headers: CONFIG.academy.headers }),
  ]);
  if (!statsRes.ok || !modulesRes.ok) throw new Error('HTB Academy API error');
  const statsRaw = await statsRes.json();
  const modulesRaw = await modulesRes.json();
  const items = statsRaw.data.completion_statistics.by_category;
  const byCategory = {};
  let totalCompleted = 0, totalModules = 0;
  for (const item of items) {
    const name = item.category.title;
    const completed = item.statistics.total_completed;
    const total = completed + item.statistics.total_remaining;
    byCategory[name] = { completed, total, percentage: item.statistics.completion_percentage };
    totalCompleted += completed;
    totalModules += total;
  }
  const output = {
    last_updated: new Date().toISOString(),
    statistics: {
      total_modules: totalModules,
      completed: totalCompleted,
      completion_percentage: totalModules > 0 ? Math.round((totalCompleted / totalModules) * 1000) / 10 : 0,
      by_category: byCategory,
    },
    modules: modulesRaw.data.map(m => ({
      id: m.id, name: m.name, slug: m.slug, description: m.description, progress: m.progress,
    })),
  };
  writeFileSync(CONFIG.academy.output, JSON.stringify(output, null, 2));
  console.log(`✅ Academy: ${output.modules.length} modules saved.`);
}

async function processMachines() {
  console.log('🖥️  Processing HTB Machines...');
  const res = await fetch(`${CONFIG.machines.base}/machines?per_page=1000`, { headers: CONFIG.machines.headers });
  if (!res.ok) throw new Error('HTB Machines API error');
  const raw = await res.json();

  mkdirSync(SAMPLE_DIR, { recursive: true });
  writeFileSync(join(SAMPLE_DIR, 'htb.json'), JSON.stringify(raw.data[0] ?? {}, null, 2));

  const machines = raw.data.map(m => ({
    id: m.id, name: m.name, os: m.os, difficulty: m.difficultyText,
    user_owned: m.authUserInUserOwns, root_owned: m.authUserInRootOwns,
  }));
  const owned = raw.data.filter(m => m.authUserInRootOwns);
  const byOS = {}, byDifficulty = {};
  for (const m of owned) {
    byOS[m.os] = (byOS[m.os] ?? 0) + 1;
    byDifficulty[m.difficultyText] = (byDifficulty[m.difficultyText] ?? 0) + 1;
  }
  const output = {
    last_updated: new Date().toISOString(),
    statistics: {
      total: raw.data.length,
      user_owns: raw.data.filter(m => m.authUserInUserOwns).length,
      root_owns: owned.length,
      by_os: byOS,
      by_difficulty: byDifficulty,
    },
    machines,
  };
  writeFileSync(CONFIG.machines.output, JSON.stringify(output, null, 2));
  console.log(`✅ Machines: ${machines.length} saved.`);
  console.log(`   📄 Sample saved to .data/htb.json`);
}

async function processTHM() {
  console.log('🚪 Processing TryHackMe...');
  let page = 1, allDocs = [], totalPages = 1;
  while (page <= totalPages) {
    const res = await fetchWithRetry(
      `${CONFIG.thm.base}/rooms/my-rooms?page=${page}&limit=200`,
      { headers: CONFIG.thm.headers },
      { retries: 3, baseDelay: 8000 }
    );
    if (!res.ok) {
      const body = await res.text().catch(() => '(no body)');
      throw new Error(`THM API error on page ${page} — status: ${res.status} ${res.statusText} — body: ${body.slice(0, 300)}`);
    }
    const json = await res.json();
    allDocs = allDocs.concat(json.data.docs);
    totalPages = json.data.totalPages;
    page++;
  }

  mkdirSync(SAMPLE_DIR, { recursive: true });
  writeFileSync(join(SAMPLE_DIR, 'thm.json'), JSON.stringify(allDocs[0] ?? {}, null, 2));

  const completed = allDocs.filter(r => r.userCompleted);
  const byDifficulty = {}, byType = {};
  for (const r of completed) {
    byDifficulty[r.difficulty] = (byDifficulty[r.difficulty] ?? 0) + 1;
    byType[r.type] = (byType[r.type] ?? 0) + 1;
  }
  const output = {
    last_updated: new Date().toISOString(),
    statistics: {
      total_rooms: allDocs.length,
      completed: completed.length,
      completion_percentage: allDocs.length > 0 ? Math.round((completed.length / allDocs.length) * 1000) / 10 : 0,
      by_difficulty: byDifficulty,
      by_type: byType,
    },
    rooms: allDocs.map(r => ({
      id: r._id, title: r.title, code: r.code, description: r.description,
      difficulty: r.difficulty, type: r.type, completed: r.userCompleted,
      tags: r.tagEntities.map(t => t.tagLabel), imageURL: r.imageURL,
    })),
  };
  writeFileSync(CONFIG.thm.output, JSON.stringify(output, null, 2));
  console.log(`✅ THM: ${output.rooms.length} rooms saved.`);
  console.log(`   📄 Sample saved to .data/thm.json`);
}

function processWriteups() {
  console.log('📝 Updating writeups...');
  const writeupsPath = CONFIG.writeups.output;
  const machinesPath = CONFIG.machines.output;
  const roomsPath = CONFIG.thm.output;
  const existing = existsSync(writeupsPath)
    ? JSON.parse(readFileSync(writeupsPath, 'utf-8'))
    : { machines: {}, rooms: {} };
  let addedMachines = 0, addedRooms = 0;
  if (existsSync(machinesPath)) {
    const { machines } = JSON.parse(readFileSync(machinesPath, 'utf-8'));
    for (const m of machines) {
      const key = String(m.id);
      if (!existing.machines[key]) { existing.machines[key] = { name: m.name, writeup: null }; addedMachines++; }
    }
  }
  if (existsSync(roomsPath)) {
    const { rooms } = JSON.parse(readFileSync(roomsPath, 'utf-8'));
    for (const r of rooms) {
      const key = r.code;
      if (!existing.rooms[key]) { existing.rooms[key] = { title: r.title, writeup: null }; addedRooms++; }
    }
  }
  writeFileSync(writeupsPath, JSON.stringify(existing, null, 2));
  console.log(`✅ Writeups: +${addedMachines} machines, +${addedRooms} rooms added.`);
}

async function main() {
  mkdirSync(DATA_DIR, { recursive: true });

  const results = await Promise.allSettled([
    processAcademy(),
    processMachines(),
    processTHM(),
  ]);

  const labels = ['Academy', 'Machines', 'THM'];
  let hasErrors = false;

  results.forEach((result, i) => {
    if (result.status === 'rejected') {
      console.error(`\n❌ ${labels[i]} failed: ${result.reason?.message ?? result.reason}`);
      hasErrors = true;
    }
  });

  processWriteups();

  if (hasErrors) {
    console.warn('\n⚠️  Sync completed with errors. Some data may be stale.');
    process.exit(1);
  } else {
    console.log('\n🚀 All data synchronized successfully!');
  }
}

main();