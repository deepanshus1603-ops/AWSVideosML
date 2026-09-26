# AWS ML Associate Shorts

Cumulative Remotion + Three.js project for AWS Certified Machine Learning Engineer - Associate revision videos.

## Videos currently included

- Q1 - SageMaker File vs FastFile vs Pipe
- Q2 - Accuracy vs Recall for imbalanced classification
- Q3 - SageMaker Serverless Inference
- Q4 - SageMaker Managed Spot Training + checkpointing
- Q5 - SageMaker Model Monitor and data drift
- Q6 - SageMaker Multi-Model Endpoint

## Install

```powershell
npm install
```

## Preview all compositions

```powershell
npm run studio
```

You should see:

- `Q01-FastFile`
- `Q02-Recall`
- `Q03-Serverless`
- `Q04-SpotTraining`
- `Q05-ModelMonitor`
- `Q06-MultiModelEndpoint`

## Render one video only

```powershell
npm run render:video -- q1
npm run render:video -- q2
npm run render:video -- q3
npm run render:video -- q4
npm run render:video -- q5
npm run render:video -- q6
```

Outputs are written to `out/`.

## Direct render commands

```powershell
npx remotion render src/index.ts Q01-FastFile out/q01-fastfile.mp4 --codec=h264 --crf=18
npx remotion render src/index.ts Q02-Recall out/q02-recall.mp4 --codec=h264 --crf=18
npx remotion render src/index.ts Q03-Serverless out/q03-serverless.mp4 --codec=h264 --crf=18
npx remotion render src/index.ts Q04-SpotTraining out/q04-spot-training.mp4 --codec=h264 --crf=18
npx remotion render src/index.ts Q05-ModelMonitor out/q05-model-monitor.mp4 --codec=h264 --crf=18
npx remotion render src/index.ts Q06-MultiModelEndpoint out/q06-multi-model-endpoint.mp4 --codec=h264 --crf=18
```


## Q7 - Batch Transform

Render only Q7:

```powershell
npm run render:video -- q7
```

Direct command:

```powershell
npx remotion render src/index.ts Q07-BatchTransform out/q07-batch-transform.mp4 --codec=h264 --crf=18
```


Render Q8:

```powershell
npm run render:video -- q8
```

Direct command:

```powershell
npx remotion render src/index.ts Q08-Clarify out/q08-clarify.mp4 --codec=h264 --crf=18
```
