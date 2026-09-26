import React from 'react';
import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {COLORS, FONT_FAMILY} from '../../shared/theme';
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const FPS = 30;
const f = (seconds: number) => Math.round(seconds * FPS);


const safe: React.CSSProperties = {
  position: 'absolute',
  left: 86,
  right: 86,
  top: 145,
  bottom: 190,
};

const fade = (frame: number, duration: number) =>
  Math.min(
    interpolate(frame, [0, 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
    interpolate(frame, [Math.max(0, duration - 8), duration], [1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  );

const Header: React.FC<{accent?: string}> = ({accent = COLORS.cyan}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: 'absolute',
        left: 86,
        top: 68,
        display: 'flex',
        gap: 14,
        alignItems: 'center',
        opacity: interpolate(frame, [0, 12], [0, 1], {extrapolateRight: 'clamp'}),
      }}
    >
      <div
        style={{
          border: `1px solid ${accent}66`,
          background: `${accent}18`,
          color: accent,
          borderRadius: 999,
          padding: '10px 18px',
          fontSize: 25,
          fontWeight: 800,
          letterSpacing: 1.1,
        }}
      >
        AWS ML ASSOCIATE
      </div>
      <div style={{fontSize: 24, color: COLORS.muted, fontWeight: 700}}>Q1</div>
    </div>
  );
};

const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const glow = 0.34 + Math.sin(frame / 45) * 0.05;
  return (
    <AbsoluteFill
      style={{
        background:
          'radial-gradient(circle at 50% 34%, rgba(14,165,233,0.16), transparent 34%), linear-gradient(180deg, #f8fbff 0%, #eef7ff 55%, #f8fbff 100%)',
        overflow: 'hidden',
        fontFamily: FONT_FAMILY,
        color: COLORS.text,
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: 780,
          height: 780,
          left: 150,
          top: 370,
          borderRadius: '50%',
          background: `rgba(14,165,233,${glow * 0.11})`,
          filter: 'blur(110px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.42,
          backgroundImage:
            'linear-gradient(rgba(15,23,42,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,.035) 1px, transparent 1px)',
          backgroundSize: '54px 54px',
          transform: `translateY(${(frame * 0.18) % 54}px)`,
        }}
      />
    </AbsoluteFill>
  );
};

const S3Bucket: React.FC<{position?: [number, number, number]; scale?: number}> = ({
  position = [-2.8, 0, 0],
  scale = 1,
}) => {
  return (
    <group position={position} scale={scale}>
      <mesh>
        <cylinderGeometry args={[1.1, 1.1, 1.7, 48]} />
        <meshStandardMaterial color={COLORS.orange} roughness={0.38} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0.87, 0]}>
        <torusGeometry args={[0.93, 0.08, 12, 48]} />
        <meshStandardMaterial color="#ffc056" emissive="#8a4e00" emissiveIntensity={0.35} />
      </mesh>
    </group>
  );
};

const TrainingNode: React.FC<{position?: [number, number, number]; glow?: boolean}> = ({
  position = [2.8, 0, 0],
  glow = false,
}) => {
  const frame = useCurrentFrame();
  const pulse = glow ? 0.7 + Math.sin(frame / 6) * 0.12 : 0.28;
  return (
    <group position={position}>
      <mesh rotation={[0.12, -0.35, 0]}>
        <boxGeometry args={[2.25, 1.55, 0.7]} />
        <meshStandardMaterial
          color={glow ? '#d1fae5' : '#dbeafe'}
          emissive={glow ? '#34d399' : '#60a5fa'}
          emissiveIntensity={pulse}
          roughness={0.32}
        />
      </mesh>
      {[-0.55, 0, 0.55].map((y) => (
        <mesh key={y} position={[0, y * 0.74, 0.39]}>
          <boxGeometry args={[1.58, 0.12, 0.05]} />
          <meshBasicMaterial color={glow ? '#047857' : '#334155'} />
        </mesh>
      ))}
    </group>
  );
};

const Packet: React.FC<{
  progress: number;
  from?: [number, number, number];
  to?: [number, number, number];
  color?: string;
  yWave?: number;
}> = ({
  progress,
  from = [-1.8, 0, 0],
  to = [1.8, 0, 0],
  color = COLORS.cyan,
  yWave = 0,
}) => {
  const p = Math.max(0, Math.min(1, progress));
  const x = THREE.MathUtils.lerp(from[0], to[0], p);
  const y = THREE.MathUtils.lerp(from[1], to[1], p) + Math.sin(p * Math.PI) * yWave;
  const z = THREE.MathUtils.lerp(from[2], to[2], p);
  const s = 0.22 + Math.sin(p * Math.PI) * 0.06;
  return (
    <mesh position={[x, y, z]} rotation={[p * 2, p * 4, p * 1.4]} scale={s}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.9} />
    </mesh>
  );
};

const ThreeStage: React.FC<{children: React.ReactNode; cameraZ?: number}> = ({children, cameraZ = 9.2}) => (
  <div style={{position: 'absolute', left: 50, right: 50, top: 520, height: 760}}>
    <ThreeCanvas
      width={980}
      height={760}
      camera={{fov: 42, position: [0, 0.3, cameraZ]}}
      gl={{antialias: true, alpha: true}}
    >
      <ambientLight intensity={1.9} />
      <directionalLight position={[3, 5, 7]} intensity={2.4} />
      <pointLight position={[-4, -2, 3]} intensity={28} color={COLORS.orange} distance={9} />
      <pointLight position={[4, 1, 4]} intensity={20} color={COLORS.cyan} distance={9} />
      {children}
    </ThreeCanvas>
  </div>
);

const TitleBlock: React.FC<{
  kicker?: string;
  title: string;
  emphasis?: string;
  sub?: string;
  duration: number;
}> = ({kicker, title, emphasis, sub, duration}) => {
  const frame = useCurrentFrame();
  const y = interpolate(frame, [0, 16], [24, 0], {extrapolateRight: 'clamp'});
  return (
    <div
      style={{
        ...safe,
        opacity: fade(frame, duration),
        transform: `translateY(${y}px)`,
      }}
    >
      {kicker ? (
        <div style={{fontSize: 28, fontWeight: 800, color: COLORS.cyan, letterSpacing: 1.5, marginBottom: 14}}>
          {kicker}
        </div>
      ) : null}
      <div style={{fontSize: 74, fontWeight: 900, lineHeight: 1.04, maxWidth: 900}}>
        {title}{' '}
        {emphasis ? <span style={{color: COLORS.green}}>{emphasis}</span> : null}
      </div>
      {sub ? (
        <div style={{fontSize: 33, lineHeight: 1.25, color: COLORS.muted, fontWeight: 650, marginTop: 22, maxWidth: 870}}>
          {sub}
        </div>
      ) : null}
    </div>
  );
};

const HookScene: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const pop = spring({frame, fps: FPS, config: {damping: 13, stiffness: 120}});
  return (
    <AbsoluteFill style={{opacity: fade(frame, duration)}}>
      <Header />
      <div style={{...safe, top: 210}}>
        <div style={{fontSize: 33, color: COLORS.cyan, fontWeight: 800}}>EXAM QUESTION</div>
        <div style={{fontSize: 77, lineHeight: 1.02, fontWeight: 950, marginTop: 16, maxWidth: 870}}>
          Terabytes of training data in <span style={{color: COLORS.orange}}>Amazon S3</span>
        </div>
        <div style={{fontSize: 35, color: COLORS.muted, marginTop: 25, fontWeight: 650}}>
          How do you avoid waiting for the entire dataset to download?
        </div>
      </div>
      <ThreeStage>
        <group scale={0.9 + pop * 0.1} rotation={[0, frame / 180, 0]}>
          <S3Bucket position={[0, 0.2, 0]} scale={1.25} />
          {Array.from({length: 15}).map((_, i) => {
            const a = (i / 15) * Math.PI * 2 + frame / 60;
            const r = 2.15 + (i % 3) * 0.25;
            return (
              <mesh key={i} position={[Math.cos(a) * r, Math.sin(a * 1.6) * 0.9, Math.sin(a) * 0.65]} rotation={[a, a / 2, a]}>
                <boxGeometry args={[0.28, 0.28, 0.28]} />
                <meshStandardMaterial color={i % 2 ? COLORS.cyan : '#ffffff'} emissive={COLORS.cyan} emissiveIntensity={0.28} />
              </mesh>
            );
          })}
        </group>
      </ThreeStage>
      <div
        style={{
          position: 'absolute',
          left: 370,
          top: 1185,
          fontSize: 50,
          fontWeight: 950,
          color: COLORS.text,
          transform: `scale(${0.86 + pop * 0.14})`,
        }}
      >
        3.2 TB
      </div>
    </AbsoluteFill>
  );
};

const AnswerRevealScene: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const pop = spring({frame, fps: FPS, config: {damping: 10, stiffness: 150}});
  return (
    <AbsoluteFill style={{opacity: fade(frame, duration)}}>
      <Header accent={COLORS.green} />
      <div style={{...safe, top: 320, textAlign: 'center'}}>
        <div style={{fontSize: 39, color: COLORS.muted, fontWeight: 750}}>Think:</div>
        <div
          style={{
            marginTop: 18,
            fontSize: 116,
            lineHeight: 1,
            fontWeight: 1000,
            color: COLORS.green,
            letterSpacing: -4,
            transform: `scale(${0.72 + pop * 0.28})`,
            textShadow: '0 0 44px rgba(67,230,161,.22)',
          }}
        >
          FASTFILE
        </div>
        <div style={{fontSize: 35, color: COLORS.text, marginTop: 28, fontWeight: 750}}>
          Start training without waiting for a full local copy.
        </div>
      </div>
      <ThreeStage cameraZ={8.7}>
        <S3Bucket position={[-2.7, 0, 0]} />
        <TrainingNode position={[2.7, 0, 0]} glow />
        {Array.from({length: 6}).map((_, i) => {
          const p = ((frame * 0.025 + i / 6) % 1.15) - 0.05;
          return <Packet key={i} progress={p} from={[-1.6, 0, 0]} to={[1.6, 0, 0]} color={COLORS.green} yWave={0.45} />;
        })}
      </ThreeStage>
    </AbsoluteFill>
  );
};

const FileModeScene: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, duration - 12], [0.04, 0.62], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill style={{opacity: fade(frame, duration)}}>
      <Header accent={COLORS.red} />
      <TitleBlock
        duration={duration}
        kicker="FILE MODE"
        title="Download first."
        emphasis="Train later."
        sub="SageMaker copies the training data to local storage before the training code consumes it."
      />
      <ThreeStage>
        <S3Bucket position={[-2.8, 0, 0]} />
        <TrainingNode position={[2.8, 0, 0]} />
        {Array.from({length: 7}).map((_, i) => {
          const p = ((frame * 0.018 + i / 7) % 1.18) - 0.08;
          return <Packet key={i} progress={p} color={COLORS.red} yWave={0.15} />;
        })}
      </ThreeStage>
      <div style={{position: 'absolute', left: 150, right: 150, top: 1280}}>
        <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 27, fontWeight: 800, color: COLORS.muted}}>
          <span>Downloading 3.2 TB...</span>
          <span>{Math.round(progress * 100)}%</span>
        </div>
        <div style={{height: 20, borderRadius: 999, background: 'rgba(15,23,42,.10)', overflow: 'hidden', marginTop: 12}}>
          <div style={{height: '100%', width: `${progress * 100}%`, background: `linear-gradient(90deg, ${COLORS.red}, #ffb266)`}} />
        </div>
        <div style={{fontSize: 34, fontWeight: 850, marginTop: 24, color: COLORS.red}}>TRAINING LOCKED</div>
      </div>
    </AbsoluteFill>
  );
};

const FastFileScene: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{opacity: fade(frame, duration)}}>
      <Header accent={COLORS.green} />
      <TitleBlock
        duration={duration}
        kicker="FASTFILE MODE"
        title="Looks like files."
        emphasis="Fetches as needed."
        sub="Your training code uses a normal file interface while S3 data is streamed into the job on demand."
      />
      <ThreeStage>
        <S3Bucket position={[-2.9, 0, 0]} />
        <TrainingNode position={[2.9, 0, 0]} glow />
        {Array.from({length: 9}).map((_, i) => {
          const p = ((frame * 0.029 + i / 9) % 1.14) - 0.05;
          return <Packet key={i} progress={p} color={COLORS.green} yWave={0.55} />;
        })}
      </ThreeStage>
      <div
        style={{
          position: 'absolute',
          top: 1265,
          left: 118,
          right: 118,
          padding: '25px 30px',
          borderRadius: 28,
          border: `1px solid ${COLORS.green}55`,
          background: 'rgba(209,250,229,.92)',
          fontSize: 33,
          fontWeight: 850,
          textAlign: 'center',
          color: COLORS.text,
        }}
      >
        Training is already running <span style={{color: COLORS.green}}>✓</span>
      </div>
    </AbsoluteFill>
  );
};

const PipeScene: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{opacity: fade(frame, duration)}}>
      <Header accent={COLORS.cyan} />
      <TitleBlock
        duration={duration}
        kicker="PIPE MODE"
        title="Direct"
        emphasis="streaming"
        sub="Data flows through named pipes. Your training algorithm must be designed to consume the stream."
      />
      <ThreeStage>
        <S3Bucket position={[-2.9, 0, 0]} />
        <TrainingNode position={[2.9, 0, 0]} glow />
        <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.24, 0.24, 3.5, 28]} />
          <meshStandardMaterial color="#163749" emissive={COLORS.cyan} emissiveIntensity={0.4} transparent opacity={0.9} />
        </mesh>
        {Array.from({length: 8}).map((_, i) => {
          const p = ((frame * 0.032 + i / 8) % 1.08) - 0.04;
          return <Packet key={i} progress={p} color={COLORS.cyan} yWave={0} />;
        })}
      </ThreeStage>
      <div
        style={{
          position: 'absolute',
          top: 1238,
          left: 285,
          right: 285,
          borderRadius: 999,
          border: `1px solid ${COLORS.cyan}77`,
          background: 'rgba(224,242,254,.94)',
          padding: '15px 20px',
          fontSize: 31,
          fontWeight: 900,
          textAlign: 'center',
          color: COLORS.cyan,
          letterSpacing: 2,
        }}
      >
        NAMED PIPE
      </div>
    </AbsoluteFill>
  );
};

const RememberIntro: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const pop = spring({frame, fps: FPS, config: {damping: 12, stiffness: 120}});
  return (
    <AbsoluteFill style={{opacity: fade(frame, duration)}}>
      <Header />
      <div style={{...safe, top: 500, textAlign: 'center'}}>
        <div style={{fontSize: 35, color: COLORS.cyan, fontWeight: 900, letterSpacing: 2}}>EXAM MEMORY</div>
        <div style={{fontSize: 102, fontWeight: 1000, marginTop: 24, transform: `scale(${0.78 + pop * 0.22})`}}>
          Remember this.
        </div>
      </div>
    </AbsoluteFill>
  );
};

const MemoryCard: React.FC<{
  title: string;
  line: string;
  color: string;
  active?: boolean;
  delay?: number;
}> = ({title, line, color, active = false, delay = 0}) => {
  const frame = useCurrentFrame();
  const p = spring({frame: frame - delay, fps: FPS, config: {damping: 14, stiffness: 125}});
  return (
    <div
      style={{
        height: 225,
        borderRadius: 32,
        padding: '31px 34px',
        border: `2px solid ${active ? color : 'rgba(15,23,42,.12)'}`,
        background: active ? `${color}16` : COLORS.card,
        boxShadow: active ? `0 18px 45px ${color}1f` : '0 12px 28px rgba(15,23,42,.08)',
        transform: `translateY(${(1 - p) * 46}px) scale(${0.94 + p * 0.06})`,
        opacity: p,
      }}
    >
      <div style={{fontSize: 42, fontWeight: 1000, color}}>{title}</div>
      <div style={{fontSize: 31, marginTop: 18, lineHeight: 1.18, color: active ? COLORS.text : COLORS.muted, fontWeight: 750}}>
        {line}
      </div>
    </div>
  );
};

const MemoryScene: React.FC<{duration: number; focus: 'file' | 'fastfile' | 'pipe' | 'final'}> = ({duration, focus}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{opacity: fade(frame, duration)}}>
      <Header accent={focus === 'fastfile' || focus === 'final' ? COLORS.green : COLORS.cyan} />
      <div style={{...safe, top: 215}}>
        <div style={{fontSize: 60, fontWeight: 1000}}>File vs FastFile vs Pipe</div>
        <div style={{display: 'grid', gap: 20, marginTop: 48}}>
          <MemoryCard title="FILE" line="Download the dataset first" color={COLORS.red} active={focus === 'file'} delay={0} />
          <MemoryCard title="FASTFILE" line="File-like access while data is fetched as needed" color={COLORS.green} active={focus === 'fastfile' || focus === 'final'} delay={4} />
          <MemoryCard title="PIPE" line="Direct stream through named pipes" color={COLORS.cyan} active={focus === 'pipe'} delay={8} />
        </div>
        {focus === 'final' ? (
          <div
            style={{
              marginTop: 42,
              fontSize: 39,
              lineHeight: 1.2,
              fontWeight: 900,
              textAlign: 'center',
              padding: '26px 30px',
              borderRadius: 30,
              background: 'rgba(209,250,229,.92)',
              border: `1px solid ${COLORS.green}55`,
              transform: `scale(${0.96 + spring({frame, fps: FPS, config: {damping: 12}}) * 0.04})`,
            }}
          >
            Large S3 data + normal file-based code → <span style={{color: COLORS.green}}>FASTFILE</span>
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

export const AwsMlQ01FastFile: React.FC = () => {
  // Timings are derived from the actual 54.02s voice file, using its pauses.
  // The few short gaps are intentionally left to the outgoing scene fade so the video breathes.
  return (
    <AbsoluteFill
      style={{
        background: COLORS.bg0,
        color: COLORS.text,
        fontFamily: FONT_FAMILY,
      }}
    >
      <Background />
      <Audio src={staticFile('audio/q01-fastfile.mp3')} />

      <Sequence from={0} durationInFrames={f(11.56)} name="Hook">
        <HookScene duration={f(11.56)} />
      </Sequence>

      <Sequence from={f(11.56)} durationInFrames={f(5.02)} name="Answer reveal">
        <AnswerRevealScene duration={f(5.02)} />
      </Sequence>

      <Sequence from={f(16.58)} durationInFrames={f(6.70)} name="File mode">
        <FileModeScene duration={f(6.70)} />
      </Sequence>

      <Sequence from={f(23.28)} durationInFrames={f(7.45)} name="FastFile mode">
        <FastFileScene duration={f(7.45)} />
      </Sequence>

      <Sequence from={f(30.73)} durationInFrames={f(7.12)} name="Pipe mode">
        <PipeScene duration={f(7.12)} />
      </Sequence>

      <Sequence from={f(37.85)} durationInFrames={f(1.80)} name="Remember">
        <RememberIntro duration={f(1.80)} />
      </Sequence>

      <Sequence from={f(39.65)} durationInFrames={f(2.45)} name="Remember file">
        <MemoryScene duration={f(2.45)} focus="file" />
      </Sequence>

      <Sequence from={f(42.10)} durationInFrames={f(4.61)} name="Remember fastfile">
        <MemoryScene duration={f(4.61)} focus="fastfile" />
      </Sequence>

      <Sequence from={f(46.71)} durationInFrames={f(2.38)} name="Remember pipe">
        <MemoryScene duration={f(2.38)} focus="pipe" />
      </Sequence>

      <Sequence from={f(49.09)} durationInFrames={1621 - f(49.09)} name="Final takeaway">
        <MemoryScene duration={1621 - f(49.09)} focus="final" />
      </Sequence>
    </AbsoluteFill>
  );
};
