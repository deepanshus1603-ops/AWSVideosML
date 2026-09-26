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
          'radial-gradient(circle at 50% 32%, rgba(14,165,233,0.16), transparent 32%), linear-gradient(180deg,#fbfdff 0%,#eef7ff 50%,#ffffff 100%)',
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

const Header: React.FC<{accent?: string}> = ({accent = COLORS.cyan}) => {
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
      <div style={{fontSize: 24, fontWeight: 800, color: COLORS.muted}}>Q3</div>
    </div>
  );
};

const ThreeStage: React.FC<{children: React.ReactNode; top?: number; height?: number}> = ({
  children,
  top = 620,
  height = 690,
}) => (
  <div style={{position: 'absolute', left: 42, right: 42, top, height}}>
    <ThreeCanvas
      width={996}
      height={height}
      camera={{fov: 42, position: [0, 0.3, 11.5]}}
      gl={{antialias: true, alpha: true}}
    >
      <ambientLight intensity={2.4} />
      <directionalLight position={[4, 6, 8]} intensity={2.7} />
      <pointLight position={[-4, 1, 5]} intensity={25} color="#38bdf8" distance={11} />
      <pointLight position={[4, 0, 4]} intensity={22} color="#34d399" distance={10} />
      {children}
    </ThreeCanvas>
  </div>
);

const RequestDots: React.FC<{sparse?: boolean}> = ({sparse = true}) => {
  const frame = useCurrentFrame();
  const count = sparse ? 6 : 15;
  return (
    <group>
      {Array.from({length: count}).map((_, i) => {
        const cycle = (frame * 0.018 + i / count) % 1;
        const x = THREE.MathUtils.lerp(-4.6, 4.6, cycle);
        const yBase = sparse ? ((i % 3) - 1) * 0.8 : ((i % 5) - 2) * 0.55;
        const y = yBase + Math.sin(cycle * Math.PI * 2 + i) * 0.15;
        const scale = 0.22 + Math.sin(cycle * Math.PI) * 0.06;
        return (
          <mesh key={i} position={[x, y, 0]} scale={scale} rotation={[cycle * 2, cycle * 4, 0]}>
            <icosahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.8} />
          </mesh>
        );
      })}
    </group>
  );
};

const ServerRack: React.FC<{x: number; active?: boolean; label?: string}> = ({x, active = false}) => {
  const frame = useCurrentFrame();
  const pulse = active ? 0.65 + Math.sin(frame / 6) * 0.12 : 0.08;
  return (
    <group position={[x, 0, 0]}>
      <mesh rotation={[0.06, -0.22, 0]}>
        <boxGeometry args={[2.2, 3.1, 0.85]} />
        <meshStandardMaterial
          color={active ? '#d1fae5' : '#dbeafe'}
          emissive={active ? '#34d399' : '#93c5fd'}
          emissiveIntensity={pulse}
          roughness={0.35}
        />
      </mesh>
      {[-0.9, -0.3, 0.3, 0.9].map((y, i) => (
        <mesh key={i} position={[0, y, 0.46]}>
          <boxGeometry args={[1.48, 0.18, 0.05]} />
          <meshBasicMaterial color={active ? '#047857' : '#334155'} />
        </mesh>
      ))}
    </group>
  );
};

const ServerlessOrb: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = 1 + Math.sin(frame / 7) * 0.045;
  return (
    <group scale={pulse}>
      <mesh>
        <sphereGeometry args={[1.75, 48, 48]} />
        <meshStandardMaterial color="#d1fae5" emissive="#34d399" emissiveIntensity={0.52} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0, 1.55]}>
        <torusGeometry args={[1.15, 0.14, 16, 64]} />
        <meshStandardMaterial color="#047857" emissive="#10b981" emissiveIntensity={0.6} />
      </mesh>
      {[-0.7, 0, 0.7].map((x, i) => (
        <mesh key={i} position={[x, 0, 1.7]} rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[0.18, 0.9, 0.12]} />
          <meshBasicMaterial color="#047857" />
        </mesh>
      ))}
    </group>
  );
};

const HookScene: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{opacity: fade(frame, duration)}}>
      <Header />
      <div style={{...SAFE, top: 195}}>
        <div style={{fontSize: 29, fontWeight: 850, color: COLORS.cyan, letterSpacing: 1.3}}>INFERENCE TRAFFIC</div>
        <div style={{fontSize: 76, fontWeight: 950, lineHeight: 1.03, marginTop: 14}}>
          Only a few requests
          <br />
          <span style={{color: COLORS.cyan}}>per day.</span>
        </div>
        <div style={{fontSize: 34, color: COLORS.muted, fontWeight: 680, marginTop: 22}}>
          Long stretches with zero traffic.
        </div>
      </div>
      <ThreeStage top={660} height={620}>
        <RequestDots sparse />
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
          color: COLORS.text,
          boxShadow: '0 16px 55px rgba(15,23,42,.08)',
        }}
      >
        Traffic pattern: <span style={{color: COLORS.orange}}>SPORADIC</span>
      </div>
    </AbsoluteFill>
  );
};

const ConstraintsScene: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{opacity: fade(frame, duration)}}>
      <Header accent={COLORS.orange} />
      <div style={{...SAFE, top: 205}}>
        <div style={{fontSize: 30, fontWeight: 850, color: COLORS.orange}}>THE REQUIREMENT</div>
        <div style={{fontSize: 72, fontWeight: 1000, lineHeight: 1.04, marginTop: 16}}>
          Fast enough,
          <br />
          <span style={{color: COLORS.green}}>but not expensive.</span>
        </div>
      </div>
      <div style={{position: 'absolute', left: 82, right: 82, top: 665, display: 'grid', gap: 24}}>
        {[
          ['FEW REQUESTS', 'Only a handful of predictions each day', COLORS.cyan],
          ['SECONDS LATENCY', 'The app still needs a response quickly', COLORS.green],
          ['MINIMIZE COST', 'Do not pay for idle infrastructure', COLORS.orange],
        ].map(([title, sub, color], i) => {
          const enter = spring({frame: frame - i * 9, fps: FPS, config: {damping: 14, stiffness: 125}});
          return (
            <div
              key={title}
              style={{
                background: '#fff',
                border: `2px solid ${color}33`,
                borderRadius: 32,
                padding: '31px 34px',
                boxShadow: '0 15px 50px rgba(15,23,42,.07)',
                transform: `translateX(${(1 - enter) * 80}px)`,
                opacity: Math.max(0, enter),
              }}
            >
              <div style={{fontSize: 37, fontWeight: 1000, color}}>{title}</div>
              <div style={{fontSize: 29, fontWeight: 680, color: COLORS.muted, marginTop: 8}}>{sub}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const AnswerScene: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const pop = spring({frame, fps: FPS, config: {damping: 12, stiffness: 145}});
  return (
    <AbsoluteFill style={{opacity: fade(frame, duration)}}>
      <Header accent={COLORS.green} />
      <div style={{...SAFE, top: 220, textAlign: 'center'}}>
        <div style={{fontSize: 31, fontWeight: 850, color: COLORS.green}}>BEST DEPLOYMENT OPTION</div>
        <div
          style={{
            fontSize: 103,
            lineHeight: 0.98,
            fontWeight: 1000,
            color: COLORS.green,
            marginTop: 42,
            transform: `scale(${0.9 + pop * 0.1})`,
          }}
        >
          SERVERLESS
          <br />
          INFERENCE
        </div>
        <div style={{fontSize: 36, color: COLORS.muted, fontWeight: 720, marginTop: 42}}>
          Built for intermittent or unpredictable traffic.
        </div>
      </div>
      <ThreeStage top={875} height={520}>
        <ServerlessOrb />
      </ThreeStage>
    </AbsoluteFill>
  );
};

const RealTimeCostScene: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const dollars = interpolate(frame, [0, duration - 10], [0, 100], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{opacity: fade(frame, duration)}}>
      <Header accent={COLORS.red} />
      <div style={{...SAFE, top: 200}}>
        <div style={{fontSize: 30, fontWeight: 850, color: COLORS.red}}>NORMAL REAL-TIME ENDPOINT</div>
        <div style={{fontSize: 68, lineHeight: 1.06, fontWeight: 1000, marginTop: 15}}>
          Instances stay running.
          <br />
          <span style={{color: COLORS.red}}>Even when idle.</span>
        </div>
      </div>
      <ThreeStage top={680} height={560}>
        <ServerRack x={-2.7} />
        <ServerRack x={0} />
        <ServerRack x={2.7} />
      </ThreeStage>
      <div
        style={{
          position: 'absolute',
          left: 102,
          right: 102,
          top: 1320,
          borderRadius: 30,
          background: '#fff1f2',
          border: '2px solid #fecdd3',
          padding: '26px 30px',
          textAlign: 'center',
        }}
      >
        <div style={{fontSize: 32, fontWeight: 850, color: '#9f1239'}}>IDLE INFRASTRUCTURE COST</div>
        <div style={{fontSize: 55, fontWeight: 1000, color: COLORS.red, marginTop: 8}}>
          {'$'.repeat(Math.max(1, Math.min(5, Math.floor(dollars / 20) + 1)))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const ScaleScene: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const wave = Math.sin(frame / 16);
  const active = wave > -0.2;
  return (
    <AbsoluteFill style={{opacity: fade(frame, duration)}}>
      <Header accent={COLORS.green} />
      <div style={{...SAFE, top: 200}}>
        <div style={{fontSize: 30, fontWeight: 850, color: COLORS.green}}>SERVERLESS INFERENCE</div>
        <div style={{fontSize: 70, lineHeight: 1.04, fontWeight: 1000, marginTop: 15}}>
          Capacity follows
          <br />
          <span style={{color: COLORS.green}}>demand.</span>
        </div>
        <div style={{fontSize: 33, lineHeight: 1.25, color: COLORS.muted, fontWeight: 690, marginTop: 22}}>
          SageMaker manages the infrastructure so you are not maintaining always-on endpoint instances.
        </div>
      </div>
      <ThreeStage top={760} height={560}>
        <group position={[-2.8, 0, 0]} scale={0.78}>
          <ServerlessOrb />
        </group>
        <RequestDots sparse />
        <group position={[3.2, 0, 0]} scale={0.85}>
          <ServerRack x={0} active={active} />
        </group>
      </ThreeStage>
      <div
        style={{
          position: 'absolute',
          left: 170,
          right: 170,
          top: 1360,
          borderRadius: 28,
          padding: '24px 28px',
          background: '#dcfce7',
          border: '2px solid #86efac',
          textAlign: 'center',
          fontSize: 36,
          fontWeight: 1000,
          color: '#166534',
        }}
      >
        Pay for usage — not long idle periods
      </div>
    </AbsoluteFill>
  );
};

const ComparisonScene: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const cards = [
    ['REAL-TIME', 'Steady low-latency traffic', COLORS.cyan, false],
    ['SERVERLESS', 'Sporadic / unpredictable traffic', COLORS.green, true],
    ['BATCH', 'Large offline datasets', COLORS.orange, false],
    ['ASYNC', 'Large payloads / long requests', COLORS.red, false],
  ] as const;
  return (
    <AbsoluteFill style={{opacity: fade(frame, duration)}}>
      <Header accent={COLORS.cyan} />
      <div style={{...SAFE, top: 195}}>
        <div style={{fontSize: 30, fontWeight: 850, color: COLORS.cyan}}>EXAM MEMORY MAP</div>
        <div style={{fontSize: 72, fontWeight: 1000, lineHeight: 1.03, marginTop: 15}}>
          Pick inference by
          <br />
          <span style={{color: COLORS.cyan}}>traffic pattern.</span>
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 72,
          right: 72,
          top: 620,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 24,
        }}
      >
        {cards.map(([title, sub, color, highlight], i) => {
          const enter = spring({frame: frame - i * 8, fps: FPS, config: {damping: 14, stiffness: 125}});
          return (
            <div
              key={title}
              style={{
                minHeight: 275,
                background: highlight ? '#ecfdf5' : '#fff',
                border: `${highlight ? 4 : 2}px solid ${highlight ? '#6ee7b7' : `${color}35`}`,
                borderRadius: 34,
                padding: '31px 28px',
                boxShadow: highlight ? '0 20px 60px rgba(4,120,87,.13)' : '0 14px 45px rgba(15,23,42,.06)',
                transform: `scale(${0.93 + Math.max(0, enter) * 0.07})`,
                opacity: Math.max(0, enter),
              }}
            >
              <div style={{fontSize: 35, fontWeight: 1000, color}}>{title}</div>
              <div style={{fontSize: 28, lineHeight: 1.24, color: COLORS.text, fontWeight: 720, marginTop: 16}}>{sub}</div>
              {highlight ? (
                <div style={{fontSize: 26, fontWeight: 950, color: '#166534', marginTop: 24}}>★ THIS QUESTION</div>
              ) : null}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const FinalScene: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const pop = spring({frame, fps: FPS, config: {damping: 13, stiffness: 125}});
  return (
    <AbsoluteFill style={{opacity: fade(frame, duration)}}>
      <Header accent={COLORS.green} />
      <div style={{...SAFE, top: 225, textAlign: 'center'}}>
        <div style={{fontSize: 31, fontWeight: 850, color: COLORS.green}}>FINAL EXAM RULE</div>
        <div style={{fontSize: 70, lineHeight: 1.08, fontWeight: 1000, marginTop: 35}}>
          Few requests per day
          <br />
          + long idle periods
        </div>
        <div style={{fontSize: 58, fontWeight: 1000, color: COLORS.muted, marginTop: 28}}>↓</div>
        <div
          style={{
            fontSize: 88,
            lineHeight: 1,
            fontWeight: 1000,
            color: COLORS.green,
            marginTop: 24,
            transform: `scale(${0.92 + pop * 0.08})`,
          }}
        >
          SERVERLESS
          <br />
          INFERENCE
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 95,
          right: 95,
          top: 1240,
          borderRadius: 34,
          padding: '34px 36px',
          background: '#ffffff',
          border: '3px solid #a7f3d0',
          boxShadow: '0 20px 65px rgba(4,120,87,.11)',
          textAlign: 'center',
          fontSize: 34,
          fontWeight: 850,
          color: COLORS.text,
        }}
      >
        Intermittent traffic + cost focus = <span style={{color: COLORS.green}}>Serverless</span>
      </div>
    </AbsoluteFill>
  );
};

const Scene: React.FC<{from: number; to: number; children: React.ReactNode}> = ({from, to, children}) => (
  <Sequence from={f(from)} durationInFrames={f(to - from)}>
    {children}
  </Sequence>
);

export const AwsMlQ03Serverless: React.FC = () => {
  return (
    <AbsoluteFill style={{fontFamily: FONT_FAMILY, background: COLORS.bg0, color: COLORS.text}}>
      <Background />
      <Audio src={staticFile('audio/q03-serverless.mp3')} />

      <Scene from={0} to={9.25}>
        <HookScene duration={f(9.25)} />
      </Scene>
      <Scene from={9.25} to={15.52}>
        <ConstraintsScene duration={f(15.52 - 9.25)} />
      </Scene>
      <Scene from={15.52} to={21.07}>
        <AnswerScene duration={f(21.07 - 15.52)} />
      </Scene>
      <Scene from={21.07} to={31.60}>
        <RealTimeCostScene duration={f(31.60 - 21.07)} />
      </Scene>
      <Scene from={31.60} to={42.00}>
        <ScaleScene duration={f(42.00 - 31.60)} />
      </Scene>
      <Scene from={42.00} to={58.95}>
        <ComparisonScene duration={f(58.95 - 42.00)} />
      </Scene>
      <Scene from={58.95} to={64.13}>
        <FinalScene duration={f(64.13 - 58.95)} />
      </Scene>
    </AbsoluteFill>
  );
};
