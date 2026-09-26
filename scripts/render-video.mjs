import {spawnSync} from 'node:child_process';

const videos = {
  q1: {
    composition: 'Q01-FastFile',
    output: 'out/q01-fastfile.mp4',
  },
};

const key = process.argv[2]?.toLowerCase();

if (!key || !videos[key]) {
  console.log('Usage: npm run render:video -- q1');
  console.log(`Available videos: ${Object.keys(videos).join(', ')}`);
  process.exit(1);
}

const video = videos[key];
const command = process.platform === 'win32' ? 'npx.cmd' : 'npx';

const result = spawnSync(
  command,
  [
    'remotion',
    'render',
    'src/index.ts',
    video.composition,
    video.output,
    '--codec=h264',
    '--crf=18',
  ],
  {stdio: 'inherit'},
);

process.exit(result.status ?? 1);
