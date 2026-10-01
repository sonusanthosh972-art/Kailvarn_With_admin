#!/usr/bin/env node
// Sets (or resets) the admin login.
//
//   node tools/set-admin-password.mjs
//
// Asks for the admin email + password (typing is hidden), then writes
// ADMIN_EMAIL and a bcrypt ADMIN_PASSWORD_HASH into .env.local. The plain
// password is never stored. If that admin already exists in MongoDB (i.e.
// has logged in before), its stored hash is updated too.
//
// Non-interactive (CI): ADMIN_SET_EMAIL=... ADMIN_SET_PASSWORD=... node tools/set-admin-password.mjs
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import bcrypt from 'bcryptjs';
import { MongoClient } from 'mongodb';

const ENV_PATH = path.join(path.dirname(new URL(import.meta.url).pathname), '..', '.env.local');

function ask(question, { hidden = false } = {}) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    if (hidden) {
      rl._writeToOutput = (s) => { if (s.includes(question)) rl.output.write(s); else rl.output.write('*'); };
    }
    rl.question(question, (a) => { rl.close(); if (hidden) process.stdout.write('\n'); resolve(a.trim()); });
  });
}

function setEnvVar(content, key, value) {
  const line = `${key}=${value}`;
  const re = new RegExp(`^${key}=.*$`, 'm');
  // function replacer: "$" in the value must not be treated as a pattern
  return re.test(content) ? content.replace(re, () => line) : `${content.replace(/\n?$/, '\n')}${line}\n`;
}

const email = (process.env.ADMIN_SET_EMAIL || (await ask('Admin email: '))).toLowerCase();
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { console.error('That is not a valid email.'); process.exit(1); }
const password = process.env.ADMIN_SET_PASSWORD || (await ask('New admin password (min 10 chars): ', { hidden: true }));
if (password.length < 10) { console.error('Password must be at least 10 characters.'); process.exit(1); }
if (!process.env.ADMIN_SET_PASSWORD) {
  const again = await ask('Repeat password: ', { hidden: true });
  if (again !== password) { console.error('Passwords do not match.'); process.exit(1); }
}

const hash = await bcrypt.hash(password, 12);
let env = fs.existsSync(ENV_PATH) ? fs.readFileSync(ENV_PATH, 'utf8') : '';
env = setEnvVar(env, 'ADMIN_EMAIL', email);
// bcrypt hashes are full of "$". Next.js expands $VARS in .env files (even
// single-quoted), which would silently blank the hash — so escape each $.
// (In a hosting panel's env settings, paste the raw hash instead.)
env = setEnvVar(env, 'ADMIN_PASSWORD_HASH', hash.replace(/\$/g, '\\$'));
fs.writeFileSync(ENV_PATH, env, { mode: 0o600 });
console.log(`Saved ADMIN_EMAIL and ADMIN_PASSWORD_HASH to ${ENV_PATH}`);

// Keep MongoDB in sync if this admin already exists there.
const uriMatch = env.match(/^MONGODB_URI=(.*)$/m);
const dbMatch = env.match(/^MONGODB_DB=(.*)$/m);
if (uriMatch) {
  const client = new MongoClient(uriMatch[1].trim(), { serverSelectionTimeoutMS: 10000 });
  try {
    await client.connect();
    const r = await client.db((dbMatch?.[1] || 'kailvarn').trim()).collection('admins')
      .updateOne({ email }, { $set: { passwordHash: hash, updatedAt: new Date() } });
    console.log(r.matchedCount ? 'Updated the existing admin in MongoDB.' : 'Admin will be created in MongoDB on first login.');
  } catch (e) {
    console.warn('Could not reach MongoDB to sync the admin (it will sync on first login):', e.message);
  } finally {
    await client.close();
  }
}
console.log('Restart the site (npm run dev / your host) so it picks up the new values.');
