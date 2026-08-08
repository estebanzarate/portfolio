import 'dotenv/config';
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

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
  writeups: {
    output: join(DATA_DIR, 'writeups.json'),
  },
};

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
  const scriptPath = join(__dirname, 'fetch_thm.py');
  execSync(`python3 "${scriptPath}"`, { stdio: 'inherit' });
}

function processWriteups() {
  console.log('📝 Updating writeups...');
  const writeupsPath = CONFIG.writeups.output;
  const machinesPath = CONFIG.machines.output;
  const roomsPath = join(DATA_DIR, 'rooms.json');
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