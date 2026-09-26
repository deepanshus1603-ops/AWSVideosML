import React from 'react';
import * as THREE from 'three';
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
  left: 78,
  right: 78,
  top: 150,
  bottom: 175,
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
          'radial-gradient(circle at 52% 28%, rgba(232,121,10,0.14), transparent 31%), radial-gradient(circle at 20% 68%, rgba(3,105,161,0.09), transparent 27%), linear-gradient(180deg,#fffdf9 0%,#f4f9ff 52%,#ffffff 100%)',
        overflow: 'hidden',
        fontFamily: FONT_FAMILY,
        color: COLORS.text,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.34,
          backgroundImage:
            'linear-gradient(rgba(15,23,42,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,.035) 1px, transparent 1px)',
          backgroundSize: '54px 54px',
          transform: `translateY(${(frame * 0.15) % 54}px)`,
        }}
      />
    </AbsoluteFill>
  );
};

const Header: React.FC<{accent?: string}> = ({accent = COLORS.orange}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: 'absolute',
        left: 78,
        top: 64,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        opacity: interpolate(frame, [0, 10], [0, 1], {extrapolateRight: 'clamp'}),
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
      <div style={{fontSize: 24, fontWeight: 800, color: COLORS.muted}}>Q4</div>
    </div>
  );
};

const ThreeStage: React.FC<{children: React.ReactNode; top?: number; height?: number}> = ({
  children,
  top = 650,
  height = 650,
}) => (
  <div style={{position: 'absolute', left: 42, right: 42, top, height}}>
    <ThreeCanvas
      width={996}
      height={height}
      camera={{fov: 42, position: [0, 0.35, 11.8]}}
      gl={{antialias: true, alpha: true}}
    >
      <ambientLight intensity={2.5} />
      <directionalLight position={[4, 7, 8]} intensity={2.8} />
      <pointLight position={[-4, 2, 4]} intensity={24} color="#38bdf8" distance={11} />
      <pointLight position={[4, 1, 5]} intensity={24} color="#fb923c" distance={11} />
      {children}
    </ThreeCanvas>
  </div>
);

const GpuRack: React.FC<{x?: number; progress?: number; interrupted?: boolean}> = ({
  x = 0,
  progress = 0.5,
  interrupted = false,
}) => {
  const frame = useCurrentFrame();
  const pulse = 0.38 + Math.sin(frame / 6) * 0.08;
  return (
    <group position={[x, 0, 0]}>
      <mesh rotation={[0.04, -0.24, 0]}>
        <boxGeometry args={[4.2, 3.3, 0.9]} />
        <meshStandardMaterial
          color={interrupted ? '#ffe4e6' : '#e0f2fe'}
          emissive={interrupted ? '#fb7185' : '#38bdf8'}
          emissiveIntensity={pulse}
          roughness={0.35}
        />
      </mesh>
      {[-1.05, -0.35, 0.35, 1.05].map((y, i) => (
        <React.Fragment key={i}>
          <mesh position={[-0.55, y, 0.49]}>
            <boxGeometry args={[2.25, 0.34, 0.06]} />
            <meshBasicMaterial color={interrupted ? '#9f1239' : '#075985'} />
          </mesh>
          <mesh position={[1.15, y, 0.51]}>
            <sphereGeometry args={[0.09, 18, 18]} />
            <meshBasicMaterial color={interrupted ? '#e11d48' : '#10b981'} />
          </mesh>
        </React.Fragment>
      ))}
      <mesh position={[0, -2.15, 0]}>
        <boxGeometry args={[4.5, 0.32, 0.24]} />
        <meshStandardMaterial color="#e2e8f0" />
      </mesh>
      <mesh position={[-2.25 + 4.5 * Math.max(0, Math.min(1, progress)) / 2, -2.15, 0.14]} scale={[Math.max(0.03, progress), 1, 1]}>
        <boxGeometry args={[4.5, 0.2, 0.1]} />
        <meshBasicMaterial color={interrupted ? '#e11d48' : '#047857'} />
      </mesh>
    </group>
  );
};

const CoinStream: React.FC<{discount?: boolean}> = ({discount = false}) => {
  const frame = useCurrentFrame();
  return (
    <group>
      {Array.from({length: 10}).map((_, i) => {
        const t = (frame * 0.014 + i / 10) % 1;
        const x = THREE.MathUtils.lerp(-4.8, 4.6, t);
        const y = Math.sin(t * Math.PI * 2 + i) * 0.55;
        return (
          <mesh key={i} position={[x, y, 0]} rotation={[Math.PI / 2, frame * 0.03 + i, 0]}>
            <cylinderGeometry args={[0.34, 0.34, 0.09, 30]} />
            <meshStandardMaterial
              color={discount ? '#fde68a' : '#fecaca'}
              emissive={discount ? '#f59e0b' : '#fb7185'}
              emissiveIntensity={0.45}
            />
          </mesh>
        );
      })}
    </group>
  );
};

const S3Bucket: React.FC<{x?: number; y?: number}> = ({x = 0, y = 0}) => {
  const frame = useCurrentFrame();
  const pulse = 1 + Math.sin(frame / 8) * 0.035;
  return (
    <group position={[x, y, 0]} scale={pulse}>
      <mesh>
        <cylinderGeometry args={[1.65, 1.85, 2.2, 44, 1, false]} />
        <meshStandardMaterial color="#ffedd5" emissive="#fb923c" emissiveIntensity={0.38} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.1, 1.72]} rotation={[0, 0, 0]}>
        <boxGeometry args={[1.8, 0.65, 0.12]} />
        <meshBasicMaterial color="#9a3412" />
      </mesh>
    </group>
  );
};

const TransferDots: React.FC<{fromX: number; toX: number; y?: number; color?: string}> = ({
  fromX,
  toX,
  y = 0,
  color = '#38bdf8',
}) => {
  const frame = useCurrentFrame();
  return (
    <group>
      {Array.from({length: 8}).map((_, i) => {
        const t = (frame * 0.02 + i / 8) % 1;
        return (
          <mesh key={i} position={[THREE.MathUtils.lerp(fromX, toX, t), y + Math.sin(t * Math.PI) * 0.5, 0.8]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshBasicMaterial color={color} />
          </mesh>
        );
      })}
    </group>
  );
};

const HookScene: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, duration], [0.18, 0.73], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill style={{opacity: fade(frame, duration)}}>
      <Header />
      <div style={{...SAFE, top: 190}}>
        <div style={{fontSize: 29, fontWeight: 850, color: COLORS.orange, letterSpacing: 1.2}}>TRAINING COST</div>
        <div style={{fontSize: 72, fontWeight: 1000, lineHeight: 1.04, marginTop: 14}}>
          Hours of training.
          <br />
          <span style={{color: COLORS.red}}>Expensive GPUs.</span>
        </div>
        <div style={{fontSize: 34, color: COLORS.muted, fontWeight: 690, marginTop: 22, lineHeight: 1.3}}>
          Interruptions are acceptable — but cost must come down.
        </div>
      </div>
      <ThreeStage top={690} height={620}>
        <GpuRack progress={progress} />
      </ThreeStage>
      <div
        style={{
          position: 'absolute',
          left: 108,
          right: 108,
          top: 1370,
          padding: '26px 30px',
          borderRadius: 30,
          background: '#ffffff',
          border: `2px solid ${COLORS.line}`,
          textAlign: 'center',
          fontSize: 34,
          fontWeight: 900,
          boxShadow: '0 16px 55px rgba(15,23,42,.08)',
        }}
      >
        What reduces training cost?
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
      <div style={{...SAFE, top: 235, textAlign: 'center'}}>
        <div style={{fontSize: 31, fontWeight: 900, color: COLORS.green}}>BEST FIT</div>
        <div
          style={{
            fontSize: 82,
            fontWeight: 1000,
            lineHeight: 1.02,
            marginTop: 18,
            transform: `scale(${0.84 + pop * 0.16})`,
          }}
        >
          Managed Spot
          <br />
          <span style={{color: COLORS.green}}>Training</span>
        </div>
        <div
          style={{
            margin: '52px auto 0',
            maxWidth: 770,
            background: '#ecfdf5',
            border: '2px solid rgba(4,120,87,.2)',
            borderRadius: 28,
            padding: '28px 34px',
            fontSize: 37,
            fontWeight: 900,
            color: COLORS.green,
          }}
        >
          + CHECKPOINTING
        </div>
      </div>
    </AbsoluteFill>
  );
};

const SpotScene: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{opacity: fade(frame, duration)}}>
      <Header />
      <div style={{...SAFE, top: 195}}>
        <div style={{fontSize: 29, fontWeight: 850, color: COLORS.orange}}>WHY SPOT?</div>
        <div style={{fontSize: 68, fontWeight: 1000, lineHeight: 1.05, marginTop: 15}}>
          Spare AWS capacity
          <br />
          <span style={{color: COLORS.green}}>at lower cost.</span>
        </div>
      </div>
      <ThreeStage top={650} height={610}>
        <CoinStream discount />
      </ThreeStage>
      <div style={{position: 'absolute', left: 92, right: 92, top: 1260, display: 'flex', gap: 24}}>
        <div
          style={{
            flex: 1,
            borderRadius: 28,
            border: `2px solid ${COLORS.line}`,
            background: '#ffffff',
            padding: '30px 24px',
            textAlign: 'center',
          }}
        >
          <div style={{fontSize: 28, color: COLORS.muted, fontWeight: 800}}>ON-DEMAND</div>
          <div style={{fontSize: 52, fontWeight: 1000, color: COLORS.red, marginTop: 10}}>$$$$</div>
        </div>
        <div
          style={{
            flex: 1,
            borderRadius: 28,
            border: '2px solid rgba(4,120,87,.18)',
            background: '#ecfdf5',
            padding: '30px 24px',
            textAlign: 'center',
          }}
        >
          <div style={{fontSize: 28, color: COLORS.green, fontWeight: 900}}>SPOT</div>
          <div style={{fontSize: 52, fontWeight: 1000, color: COLORS.green, marginTop: 10}}>$$</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const InterruptScene: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const cut = frame > f(2.8);
  return (
    <AbsoluteFill style={{opacity: fade(frame, duration)}}>
      <Header accent={COLORS.red} />
      <div style={{...SAFE, top: 205}}>
        <div style={{fontSize: 30, fontWeight: 900, color: COLORS.red}}>THE TRADE-OFF</div>
        <div style={{fontSize: 70, fontWeight: 1000, lineHeight: 1.04, marginTop: 14}}>
          Spot capacity can
          <br />
          <span style={{color: COLORS.red}}>be interrupted.</span>
        </div>
      </div>
      <ThreeStage top={680} height={610}>
        <GpuRack progress={0.62} interrupted={cut} />
      </ThreeStage>
      {cut ? (
        <div
          style={{
            position: 'absolute',
            left: 125,
            right: 125,
            top: 1360,
            borderRadius: 30,
            padding: '28px 34px',
            background: '#fff1f2',
            border: '2px solid rgba(190,18,60,.18)',
            textAlign: 'center',
            fontSize: 39,
            fontWeight: 1000,
            color: COLORS.red,
          }}
        >
          ⚠ CAPACITY INTERRUPTED
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

const CheckpointScene: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const switchAt = f(4.0);
  const resumed = frame > switchAt;
  return (
    <AbsoluteFill style={{opacity: fade(frame, duration)}}>
      <Header accent={COLORS.cyan} />
      <div style={{...SAFE, top: 190}}>
        <div style={{fontSize: 29, fontWeight: 850, color: COLORS.cyan}}>WHY CHECKPOINT?</div>
        <div style={{fontSize: 66, fontWeight: 1000, lineHeight: 1.05, marginTop: 14}}>
          Save state to S3.
          <br />
          <span style={{color: COLORS.green}}>Resume — don't restart.</span>
        </div>
      </div>
      <ThreeStage top={655} height={640}>
        <group position={[-2.8, 0, 0]} scale={0.72}>
          <GpuRack progress={resumed ? 0.82 : 0.6} interrupted={!resumed} />
        </group>
        <S3Bucket x={3.2} y={0.1} />
        <TransferDots fromX={-1.2} toX={2.1} y={0.5} color={resumed ? '#10b981' : '#38bdf8'} />
      </ThreeStage>
      <div
        style={{
          position: 'absolute',
          left: 100,
          right: 100,
          top: 1370,
          borderRadius: 30,
          padding: '25px 30px',
          background: resumed ? '#ecfdf5' : '#eff6ff',
          border: `2px solid ${resumed ? 'rgba(4,120,87,.2)' : 'rgba(3,105,161,.18)'}`,
          textAlign: 'center',
          fontSize: 35,
          fontWeight: 950,
          color: resumed ? COLORS.green : COLORS.cyan,
        }}
      >
        {resumed ? '✓ LOAD CHECKPOINT → CONTINUE' : 'SAVE CHECKPOINT → S3'}
      </div>
    </AbsoluteFill>
  );
};

const MemoryScene: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const rows = [
    ['Long training job', '✓'],
    ['Expensive compute', '✓'],
    ['Interruptions acceptable', '✓'],
    ['Need lower cost', '✓'],
  ];
  return (
    <AbsoluteFill style={{opacity: fade(frame, duration)}}>
      <Header accent={COLORS.green} />
      <div style={{...SAFE, top: 185}}>
        <div style={{fontSize: 30, color: COLORS.green, fontWeight: 900}}>EXAM MEMORY RULE</div>
        <div style={{fontSize: 66, fontWeight: 1000, lineHeight: 1.06, marginTop: 14}}>
          See all four?
          <br />
          <span style={{color: COLORS.green}}>Think Spot + Checkpointing.</span>
        </div>
        <div style={{marginTop: 48, display: 'grid', gap: 18}}>
          {rows.map(([label, mark], i) => {
            const appear = spring({frame: frame - i * 7, fps: FPS, config: {damping: 18, stiffness: 130}});
            return (
              <div
                key={label}
                style={{
                  opacity: appear,
                  transform: `translateY(${(1 - appear) * 22}px)`,
                  borderRadius: 24,
                  background: '#ffffff',
                  border: `2px solid ${COLORS.line}`,
                  padding: '23px 28px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: 34,
                  fontWeight: 850,
                  boxShadow: '0 10px 34px rgba(15,23,42,.05)',
                }}
              >
                <span>{label}</span>
                <span style={{color: COLORS.green, fontSize: 40, fontWeight: 1000}}>{mark}</span>
              </div>
            );
          })}
        </div>
        <div
          style={{
            marginTop: 40,
            borderRadius: 32,
            background: '#ecfdf5',
            border: '2px solid rgba(4,120,87,.2)',
            padding: '30px 34px',
            textAlign: 'center',
            fontSize: 42,
            fontWeight: 1000,
            color: COLORS.green,
          }}
        >
          MANAGED SPOT TRAINING
          <div style={{fontSize: 31, marginTop: 8}}>+ CHECKPOINTING</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const AwsMlQ04SpotTraining: React.FC = () => {
  const hookEnd = f(13.62);
  const answerEnd = f(19.44);
  const spotEnd = f(32.93);
  const interruptEnd = f(40.11);
  const checkpointEnd = f(49.41);
  const total = 1835;

  return (
    <AbsoluteFill style={{fontFamily: FONT_FAMILY, color: COLORS.text}}>
      <Background />
      <Audio src={staticFile('audio/q04-spot-training.mp3')} />

      <Sequence from={0} durationInFrames={hookEnd}>
        <HookScene duration={hookEnd} />
      </Sequence>
      <Sequence from={hookEnd} durationInFrames={answerEnd - hookEnd}>
        <AnswerScene duration={answerEnd - hookEnd} />
      </Sequence>
      <Sequence from={answerEnd} durationInFrames={spotEnd - answerEnd}>
        <SpotScene duration={spotEnd - answerEnd} />
      </Sequence>
      <Sequence from={spotEnd} durationInFrames={interruptEnd - spotEnd}>
        <InterruptScene duration={interruptEnd - spotEnd} />
      </Sequence>
      <Sequence from={interruptEnd} durationInFrames={checkpointEnd - interruptEnd}>
        <CheckpointScene duration={checkpointEnd - interruptEnd} />
      </Sequence>
      <Sequence from={checkpointEnd} durationInFrames={total - checkpointEnd}>
        <MemoryScene duration={total - checkpointEnd} />
      </Sequence>
    </AbsoluteFill>
  );
};
