// Local provider-integration rehearsal; never run on the public host.
// node --env-file=.env --env-file=.env.test scripts/sandbox-server.mjs
import { randomBytes } from 'node:crypto';
import { PGlite } from '@electric-sql/pglite';
import { PGLiteSocketServer } from '@electric-sql/pglite-socket';

if (!/^(sk|rk)_test_/.test(process.env.STRIPE_SECRET_KEY || ''))
  throw Error('A Stripe test key is required; live keys are refused.');
if (process.env.PAYPAL_ENVIRONMENT !== 'sandbox')
  throw Error('PayPal must use sandbox.');
process.env.SITE_URL = 'http://127.0.0.1:4174';
process.env.DATABASE_URL = 'postgresql://postgres:postgres@127.0.0.1:5441/postgres';
process.env.COMMERCE_ENABLED = 'true';
process.env.PAYPAL_CHECKOUT_ENABLED = 'true';
process.env.PRINTFUL_AUTO_CONFIRM = 'false';
process.env.STRIPE_WEBHOOK_SECRET ||= 'whsec_' + randomBytes(32).toString('hex');
const db = await PGlite.create('output/pre-moonlit/sandbox-db');
const socket = new PGLiteSocketServer({ db, host: '127.0.0.1', port: 5441 });
await socket.start();
const { database, schema, rateSchema, formsSchema } = await import('../server/db.mjs');
await database().query(schema + rateSchema + formsSchema);
const { storefrontServer } = await import('../server/http.mjs');
const http = storefrontServer();
http.listen(4174, '127.0.0.1', () => console.log('Sandbox checkout ready at http://127.0.0.1:4174'));
async function stop() {
  http.close();
  await database().end();
  await socket.stop();
  await db.close();
  process.exit(0);
}
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
