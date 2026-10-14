import { build } from './build.mjs';
await build();
if (process.env.DATABASE_URL) {
  const { database, schema, rateSchema, formsSchema } = await import('../server/db.mjs');
  const db = database();
  try {
    await db.query(schema + rateSchema + formsSchema);
    console.log('Commerce database schema ready.');
  } finally {
    await db.end();
  }
}
