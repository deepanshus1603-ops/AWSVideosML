import React from 'react';
import {ThreeCanvas} from '@remotion/three';
import {
  AbsoluteFill,
  Audio,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import {COLORS, FONT_FAMILY} from '../../shared/theme';

const FPS = 30;
const f = (seconds: number) => Math.round(seconds * FPS);

const SAFE: React.CSSProperties = {
  position: 'absolute',
  left: 76,
  right: 76,
  top: 150,
  bottom: 165,
};

const fade = (frame: number, duration: number) =>
  Math.min(
    interpolate(frame, [0, 8], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
    interpolate(frame, [Math.max(0, duration - 8), duration], [1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  );

const Background: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background:
          'radial-gradient(circle at 80% 16%, rgba(3,105,161,0.11), transparent 30%), radial-gradient(circle at 20% 76%, rgba(4,120,87,0.08), transparent 31%), linear-gradient(180deg,#ffffff 0%,#f7fbff 52%,#fffdf8 100%)',
        overflow: 'hidden',
        fontFamily: FONT_FAMILY,
        color: COLORS.text,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.3,
          backgroundImage:
            'linear-gradient(rgba(15,23,42,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,.035) 1px, transparent 1px)',
          backgroundSize: '54px 54px',
          transform: `translateY(${(frame * 0.12) % 54}px)`,
        }}
      />
    </AbsoluteFill>
  );
};

const Header: React.FC<{accent?: string}> = ({accent = COLORS.cyan}) => (
  <div
    style={{
      position: 'absolute',
      left: 78,
      top: 64,
      display: 'flex',
      alignItems: 'center',
      gap: 14,
    }}
  >
    <div
      style={{
        border: `1px solid ${accent}55`,
        background: `${accent}12`,
        borderRadius: 999,
        padding: '10px 18px',
        fontSize: 25,
        fontWeight: 850,
        letterSpacing: 1,
        color: accent,
      }}
    >
      AWS ML ASSOCIATE
    </div>
    <div style={{fontSize: 24, fontWeight: 800, color: COLORS.muted}}>Q7</div>
  </div>
);

const ThreeStage: React.FC<{children: React.ReactNode; top?: number; height?: number}> = ({
  children,
  top = 690,
  height = 650,
}) => (
  <div style={{position: 'absolute', left: 42, right: 42, top, height}}>
    <ThreeCanvas
      width={996}
      height={height}
      camera={{fov: 42, position: [0, 0.6, 12.4]}}
      gl={{antialias: true, alpha: true}}
    >
      <ambientLight intensity={2.5} />
      <directionalLight position={[5, 8, 9]} intensity={2.6} />
      <pointLight position={[-4, 3, 6]} intensity={16} color="#38bdf8" distance={13} />
      <pointLight position={[4, 1, 5]} intensity={13} color="#10b981" distance={12} />
      {children}
    </ThreeCanvas>
  </div>
);

const DataCube: React.FC<{position: [number, number, number]; scale?: number; color?: string}> = ({
  position,
  scale = 1,
  color = '#38bdf8',
}) => (
  <group position={position} scale={scale}>
    <mesh>
      <boxGeometry args={[0.72, 0.72, 0.72]} />
      <meshStandardMaterial color="#ffffff" roughness={0.28} />
    </mesh>
    <mesh position={[0, 0, 0.37]}>
      <boxGeometry args={[0.42, 0.12, 0.04]} />
      <meshBasicMaterial color={color} />
    </mesh>
  </group>
);

const Bucket: React.FC<{x: number; labelColor?: string}> = ({x, labelColor = '#38bdf8'}) => (
  <group position={[x, -0.25, 0]}>
    <mesh>
      <cylinderGeometry args={[1.4, 1.6, 2.2, 32]} />
      <meshStandardMaterial color="#ffffff" roughness={0.38} />
    </mesh>
    <mesh position={[0, 0.45, 1.17]}>
      <boxGeometry args={[1.75, 0.26, 0.06]} />
      <meshBasicMaterial color={labelColor} />
    </mesh>
    <mesh position={[0, -0.05, 1.17]}>
      <boxGeometry args={[1.15, 0.18, 0.06]} />
      <meshBasicMaterial color="#94a3b8" />
    </mesh>
  </group>
);

const Compute: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = 1 + Math.sin(frame / 8) * 0.025;
  return (
    <group position={[0, 0, 0]} scale={pulse}>
      <mesh>
        <boxGeometry args={[2.6, 2.35, 1.25]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.62, 0.66]}>
        <boxGeometry args={[1.75, 0.22, 0.05]} />
        <meshBasicMaterial color="#047857" />
      </mesh>
      <mesh position={[0, 0.08, 0.66]}>
        <boxGeometry args={[1.25, 0.16, 0.05]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>
      <mesh position={[0, -0.46, 0.66]}>
        <boxGeometry args={[0.86, 0.16, 0.05]} />
        <meshBasicMaterial color="#94a3b8" />
      </mesh>
    </group>
  );
};

const HookScene: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{opacity: fade(frame, duration)}}>
      <Header />
      <div style={{...SAFE, top: 182}}>
        <div style={{fontSize: 29, fontWeight: 900, color: COLORS.cyan, letterSpacing: 1}}>
          OFFLINE INFERENCE
        </div>
        <div style={{fontSize: 67, fontWeight: 1000, lineHeight: 1.04, marginTop: 14}}>
          Millions of records.
          <br />
          <span style={{color: COLORS.green}}>Every night.</span>
        </div>
        <div style={{fontSize: 33, color: COLORS.muted, fontWeight: 750, marginTop: 22, lineHeight: 1.38}}>
          Data is already in S3, and the predictions do not need to come back immediately.
        </div>
      </div>

      <ThreeStage top={720} height={610}>
        <Bucket x={-3.9} />
        {Array.from({length: 14}).map((_, i) => {
          const col = i % 5;
          const row = Math.floor(i / 5);
          const pop = spring({frame: frame - i * 2, fps: FPS, config: {damping: 18, stiffness: 120}});
          return (
            <DataCube
              key={i}
              position={[-1.6 + col * 0.78, 1.4 - row * 0.84, -0.1]}
              scale={0.18 + pop * 0.34}
              color={i % 3 === 0 ? '#10b981' : '#38bdf8'}
            />
          );
        })}
        <Bucket x={4.2} labelColor="#10b981" />
      </ThreeStage>

      <div
        style={{
          position: 'absolute',
          left: 118,
          right: 118,
          top: 1490,
          borderRadius: 30,
          background: '#eff6ff',
          border: '2px solid rgba(3,105,161,.18)',
          padding: '26px 30px',
          textAlign: 'center',
          fontSize: 34,
          fontWeight: 1000,
          color: COLORS.cyan,
        }}
      >
        Which SageMaker inference option fits?
      </div>
    </AbsoluteFill>
  );
};

const AnswerScene: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const pop = spring({frame, fps: FPS, config: {damping: 14, stiffness: 110}});
  return (
    <AbsoluteFill style={{opacity: fade(frame, duration)}}>
      <Header accent={COLORS.green} />
      <div style={{...SAFE, top: 250, textAlign: 'center'}}>
        <div style={{fontSize: 30, fontWeight: 900, color: COLORS.green}}>ANSWER</div>
        <div
          style={{
            fontSize: 88,
            fontWeight: 1000,
            lineHeight: 1,
            marginTop: 24,
            transform: `scale(${0.86 + pop * 0.14})`,
          }}
        >
          Batch
          <br />
          <span style={{color: COLORS.green}}>Transform</span>
        </div>
        <div
          style={{
            margin: '64px auto 0',
            maxWidth: 830,
            borderRadius: 32,
            background: '#ecfdf5',
            border: '2px solid rgba(4,120,87,.20)',
            padding: '30px 34px',
            fontSize: 36,
            fontWeight: 900,
            lineHeight: 1.32,
            color: COLORS.green,
          }}
        >
          Large-scale, offline inference without keeping a real-time endpoint running.
        </div>
      </div>
    </AbsoluteFill>
  );
};

const PipelineScene: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{opacity: fade(frame, duration)}}>
      <Header />
      <div style={{...SAFE, top: 178}}>
        <div style={{fontSize: 29, fontWeight: 900, color: COLORS.cyan}}>WHAT HAPPENS</div>
        <div style={{fontSize: 62, fontWeight: 1000, lineHeight: 1.06, marginTop: 14}}>
          SageMaker processes the dataset
          <br />
          <span style={{color: COLORS.green}}>as a job.</span>
        </div>
      </div>

      <ThreeStage top={700} height={650}>
        <Bucket x={-4.1} />
        <Compute />
        <Bucket x={4.1} labelColor="#10b981" />

        {Array.from({length: 7}).map((_, i) => {
          const progress = ((frame * 0.026 + i / 7) % 1);
          const x = -3.0 + progress * 2.1;
          return <DataCube key={`in-${i}`} position={[x, 0.2 + Math.sin(i) * 0.45, 0.1]} scale={0.38} />;
        })}
        {Array.from({length: 7}).map((_, i) => {
          const progress = ((frame * 0.024 + i / 7) % 1);
          const x = 1.1 + progress * 1.95;
          return (
            <DataCube
              key={`out-${i}`}
              position={[x, -0.15 + Math.cos(i) * 0.4, 0.1]}
              scale={0.38}
              color="#10b981"
            />
          );
        })}
      </ThreeStage>

      <div style={{position: 'absolute', left: 72, right: 72, top: 1450, display: 'flex', gap: 18}}>
        {[
          ['1', 'Read dataset', 'S3'],
          ['2', 'Start compute', 'Process'],
          ['3', 'Write results', 'S3'],
          ['4', 'Job ends', 'No idle endpoint'],
        ].map(([n, title, sub]) => (
          <div
            key={n}
            style={{
              flex: 1,
              minHeight: 178,
              background: '#ffffff',
              border: `2px solid ${COLORS.line}`,
              borderRadius: 24,
              padding: '20px 14px',
              textAlign: 'center',
            }}
          >
            <div style={{fontSize: 26, fontWeight: 1000, color: COLORS.cyan}}>{n}</div>
            <div style={{fontSize: 26, fontWeight: 1000, lineHeight: 1.12, marginTop: 6}}>{title}</div>
            <div style={{fontSize: 20, fontWeight: 800, color: COLORS.muted, marginTop: 8}}>{sub}</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const CompareScene: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const asyncScale = spring({frame: frame - 8, fps: FPS, config: {damping: 18, stiffness: 120}});
  const batchScale = spring({frame: frame - 18, fps: FPS, config: {damping: 18, stiffness: 120}});
  return (
    <AbsoluteFill style={{opacity: fade(frame, duration)}}>
      <Header />
      <div style={{...SAFE, top: 190}}>
        <div style={{fontSize: 29, fontWeight: 900, color: COLORS.red}}>DO NOT CONFUSE THESE</div>
        <div style={{fontSize: 64, fontWeight: 1000, lineHeight: 1.05, marginTop: 14}}>
          Async vs Batch Transform
        </div>
      </div>

      <div style={{position: 'absolute', left: 76, right: 76, top: 620, display: 'flex', flexDirection: 'column', gap: 30}}>
        <div
          style={{
            borderRadius: 34,
            border: '2px solid rgba(190,18,60,.18)',
            background: '#fff1f2',
            padding: '34px 38px',
            transform: `scale(${0.94 + asyncScale * 0.06})`,
          }}
        >
          <div style={{fontSize: 33, fontWeight: 1000, color: COLORS.red}}>ASYNCHRONOUS INFERENCE</div>
          <div style={{fontSize: 37, fontWeight: 900, marginTop: 14, lineHeight: 1.32}}>
            Individual request
            <br />
            <span style={{color: COLORS.muted}}>Large payload or long processing time</span>
          </div>
        </div>

        <div
          style={{
            borderRadius: 34,
            border: '3px solid rgba(4,120,87,.24)',
            background: '#ecfdf5',
            padding: '34px 38px',
            transform: `scale(${0.94 + batchScale * 0.06})`,
          }}
        >
          <div style={{fontSize: 33, fontWeight: 1000, color: COLORS.green}}>BATCH TRANSFORM</div>
          <div style={{fontSize: 37, fontWeight: 900, marginTop: 14, lineHeight: 1.32}}>
            Large dataset in bulk
            <br />
            <span style={{color: COLORS.muted}}>Offline processing, results written to S3</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const FinalScene: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const pop = spring({frame: frame - 8, fps: FPS, config: {damping: 14, stiffness: 115}});
  return (
    <AbsoluteFill style={{opacity: fade(frame, duration)}}>
      <Header accent={COLORS.green} />
      <div style={{...SAFE, top: 220, textAlign: 'center'}}>
        <div style={{fontSize: 30, fontWeight: 900, color: COLORS.green}}>EXAM MEMORY</div>
        <div style={{fontSize: 76, fontWeight: 1000, marginTop: 25, lineHeight: 1.02}}>
          Think
          <br />
          <span style={{color: COLORS.green}}>Batch Transform</span>
        </div>

        <div style={{marginTop: 78, display: 'flex', flexDirection: 'column', gap: 22}}>
          {[
            'Millions of records',
            'Offline prediction',
            'No immediate response needed',
          ].map((item, i) => (
            <div
              key={item}
              style={{
                background: '#ffffff',
                border: '2px solid rgba(15,23,42,.12)',
                borderRadius: 27,
                padding: '25px 30px',
                fontSize: 38,
                fontWeight: 950,
                transform: `translateY(${(1 - Math.min(1, Math.max(0, pop - i * 0.04))) * 14}px)`,
              }}
            >
              ✓ {item}
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 65,
            background: '#ecfdf5',
            border: '3px solid rgba(4,120,87,.24)',
            borderRadius: 34,
            padding: '30px 28px',
            fontSize: 44,
            fontWeight: 1000,
            color: COLORS.green,
            transform: `scale(${0.94 + pop * 0.06})`,
          }}
        >
          BULK + OFFLINE = BATCH TRANSFORM
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const AwsMlQ07BatchTransform: React.FC = () => {
  const hookEnd = f(20.54);
  const answerEnd = f(27.02);
  const pipelineEnd = f(37.99);
  const compareEnd = f(51.40);
  const total = 1856;

  return (
    <AbsoluteFill style={{fontFamily: FONT_FAMILY, color: COLORS.text}}>
      <Background />
      <Audio src={staticFile('audio/q07-batch-transform.mp3')} />

      <Sequence from={0} durationInFrames={hookEnd}>
        <HookScene duration={hookEnd} />
      </Sequence>

      <Sequence from={hookEnd} durationInFrames={answerEnd - hookEnd}>
        <AnswerScene duration={answerEnd - hookEnd} />
      </Sequence>

      <Sequence from={answerEnd} durationInFrames={pipelineEnd - answerEnd}>
        <PipelineScene duration={pipelineEnd - answerEnd} />
      </Sequence>

      <Sequence from={pipelineEnd} durationInFrames={compareEnd - pipelineEnd}>
        <CompareScene duration={compareEnd - pipelineEnd} />
      </Sequence>

      <Sequence from={compareEnd} durationInFrames={total - compareEnd}>
        <FinalScene duration={total - compareEnd} />
      </Sequence>
    </AbsoluteFill>
  );
};
