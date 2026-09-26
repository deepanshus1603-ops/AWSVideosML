# AWS ML Associate Shorts

One Remotion repository for the AWS ML Associate video series.

## Q1 visual update

Q1 now uses the shared light theme:
- light background
- dark high-contrast text
- darker accent colors
- light memory cards
- light FastFile / Pipe callouts

## Install

```powershell
npm install
```

## Preview all available compositions

```powershell
npm run studio
```

Current composition: `Q01-FastFile`

## Render only Q1

```powershell
npm run render:video -- q1
```

Output:

`out/q01-fastfile.mp4`

## Series structure

Future videos go under `src/videos/qXX/` and their audio under `public/audio/`.
The shared light theme is in `src/shared/theme.ts`.
