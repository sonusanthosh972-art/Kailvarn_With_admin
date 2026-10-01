import 'server-only';
import { MongoClient } from 'mongodb';

// One MongoClient per server process. In dev, Next re-evaluates modules on
// every edit, so the client is cached on globalThis to avoid piling up
// connections.
const globalForMongo = globalThis;

function getClientPromise() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not set');
  if (!globalForMongo._kvMongo) {
    const client = new MongoClient(uri, { maxPoolSize: 10, serverSelectionTimeoutMS: 10000 });
    globalForMongo._kvMongo = client.connect().then(async (c) => {
      await ensureIndexes(c.db(process.env.MONGODB_DB || 'kailvarn'));
      return c;
    });
    // Let a failed connect be retried on the next request.
    globalForMongo._kvMongo.catch(() => { globalForMongo._kvMongo = undefined; });
  }
  return globalForMongo._kvMongo;
}

export async function getDb() {
  const client = await getClientPromise();
  return client.db(process.env.MONGODB_DB || 'kailvarn');
}

export async function col(name) {
  return (await getDb()).collection(name);
}

export function isDbConfigured() {
  return Boolean(process.env.MONGODB_URI);
}

async function ensureIndexes(db) {
  await Promise.all([
    db.collection('admins').createIndex({ email: 1 }, { unique: true }),
    db.collection('projects').createIndex({ slug: 1 }, { unique: true }),
    db.collection('projects').createIndex({ status: 1, category: 1, publishedAt: -1 }),
    db.collection('images').createIndex({ projectId: 1, order: 1 }),
    db.collection('images').createIndex({ b2Key: 1 }, { unique: true }),
    ...['quotes', 'consultations', 'contacts'].map((c) =>
      db.collection(c).createIndex({ status: 1, createdAt: -1 })
    ),
  ]);
}
