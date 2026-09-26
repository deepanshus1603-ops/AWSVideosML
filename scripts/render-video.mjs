import {spawnSync} from 'node:child_process';

const videos = {
  q1: {
    composition: 'Q01-FastFile',
    output: 'out/q01-fastfile.mp4',
  },
  q2: {
    composition: 'Q02-Recall',
    output: 'out/q02-recall.mp4',
  },
  q3: {
    composition: 'Q03-Serverless',
    output: 'out/q03-serverless.mp4',
  },
  q4: {
    composition: 'Q04-SpotTraining',
    output: 'out/q04-spot-training.mp4',
  },
  q5: {
    composition: 'Q05-ModelMonitor',
    output: 'out/q05-model-monitor.mp4',
  },
  q6: {
    composition: 'Q06-MultiModelEndpoint',
    output: 'out/q06-multi-model-endpoint.mp4',
  },
  q7: {
    composition: 'Q07-BatchTransform',
    output: 'out/q07-batch-transform.mp4',
  },
  q8: {
    composition: 'Q08-Clarify',
    output: 'out/q08-clarify.mp4',
  },
};

const key = process.argv[2]?.toLowerCase();

if (!key || !videos[key]) {
  console.log('');
  console.log(`Usage: npm run render:video -- <${Object.keys(videos).join('|')}>`);
  console.log(`Available videos: ${Object.keys(videos).join(', ')}`);
  console.log('');
  process.exit(1);
}

const {composition, output} = videos[key];

console.log(`Rendering ${composition}`);
console.log(`Output: ${output}`);

const executable =
  process.platform === 'win32'
    ? '.\\node_modules\\.bin\\remotion.cmd'
    : './node_modules/.bin/remotion';

const result = spawnSync(
  executable,
  [
    'render',
    'src/index.ts',
    composition,
    output,
    '--codec=h264',
    '--crf=18',
  ],
  {
    stdio: 'inherit',
    shell: false,
  },
);

if (result.error) {
  console.error(result.error);
  process.exit(1);
}

process.exit(result.status ?? 0);
