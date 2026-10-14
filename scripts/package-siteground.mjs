import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';

// Explicit allowlist keeps credentials and private migration archives out.
mkdirSync('output', { recursive: true });
execFileSync('tar', ['-czf', 'output/world-champignons-node.tgz', '--exclude=public/assets/products/design-details/*.png',
  'package.json', 'package-lock.json', 'WORLD_CHAMPIGNONS_CONTENT_SOURCE.md',
  'scripts', 'src', 'server', 'netlify/functions', 'data', 'public'],
  { stdio: 'inherit' });
console.log('Created output/world-champignons-node.tgz');
