import 'dotenv/config';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '../src/data');

const CONFIG = {
  academy: {
    base: 'https://academy.hackthebox.com/api/v2',
    output: join(DATA_DIR, 'academy.json'),
    headers: {
      Accept: 'application/json',
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:148.0) Gecko/20100101 Firefox/148.0',
      Referer: 'https://academy.hackthebox.com/app/dashboard',
      Cookie: `htb_academy_session=${process.env.HTB_ACADEMY_SESSION}`,
    }
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
    }
  },
  thm: {
    base: 'https://tryhackme.com/api/v2',
    output: join(DATA_DIR, 'rooms.json'),
    headers: {
      Accept: 'application/json',
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:148.0) Gecko/20100101 Firefox/148.0',
      Referer: 'https://tryhackme.com/rooms?tab=saved',
      Cookie: `connect.sid=${process.env.THM_SESSION}`,
    }
  }
};

/**
 * Processes HTB Academy statistics and module progress
 */
async function processAcademy() {
  console.log('🎓 Processing HTB Academy...');
  const [statsRes, modulesRes] = await Promise.all([
    fetch(`${CONFIG.academy.base}/modules/statistics`, { headers: CONFIG.academy.headers }),
    fetch(`${CONFIG.academy.base}/modules?per_page=200`, { headers: CONFIG.academy.headers })
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
      id: m.id, name: m.name, slug: m.slug, description: m.description, progress: m.progress
    }))
  };

  writeFileSync(CONFIG.academy.output, JSON.stringify(output, null, 2));
  console.log(`✅ Academy: ${output.modules.length} modules saved.`);
}

/**
 * Processes HTB Lab Machines ownership data
 */
async function processMachines() {
  console.log('🖥️  Processing HTB Machines...');
  const res = await fetch(`${CONFIG.machines.base}/machines?per_page=1000`, { headers: CONFIG.machines.headers });
  if (!res.ok) throw new Error('HTB Machines API error');

  const raw = await res.json();
  const machines = raw.data.map(m => ({
    id: m.id, name: m.name, os: m.os, difficulty: m.difficultyText,
    user_owned: m.authUserInUserOwns, root_owned: m.authUserInRootOwns
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
    machines
  };

  writeFileSync(CONFIG.machines.output, JSON.stringify(output, null, 2));
  console.log(`✅ Machines: ${machines.length} saved.`);
}

/**
 * Processes TryHackMe user room data
 */
async function processTHM() {
  console.log('🚪 Processing TryHackMe...');
  let page = 1, allDocs = [], totalPages = 1;

  while (page <= totalPages) {
    const res = await fetch(`${CONFIG.thm.base}/rooms/my-rooms?page=${page}&limit=200`, { headers: CONFIG.thm.headers });
    if (!res.ok) throw new Error(`THM API error on page ${page}`);
    const json = await res.json();
    allDocs = allDocs.concat(json.data.docs);
    totalPages = json.data.totalPages;
    page++;
  }

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
    }))
  };

  writeFileSync(CONFIG.thm.output, JSON.stringify(output, null, 2));
  console.log(`✅ THM: ${output.rooms.length} rooms saved.`);
}

/**
 * Orchestrates the data fetching process
 */
async function main() {
  try {
    mkdirSync(DATA_DIR, { recursive: true });

    await Promise.all([
      processAcademy(),
      processMachines(),
      processTHM()
    ]);

    console.log('\n🚀 All data synchronized successfully!');
  } catch (err) {
    console.error('\n❌ Global Error:', err.message);
    process.exit(1);
  }
}

main();