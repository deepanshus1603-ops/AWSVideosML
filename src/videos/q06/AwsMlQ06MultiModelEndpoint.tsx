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
  left: 76,
  right: 76,
  top: 155,
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
          'radial-gradient(circle at 76% 18%, rgba(3,105,161,0.11), transparent 28%), radial-gradient(circle at 18% 76%, rgba(4,120,87,0.08), transparent 31%), linear-gradient(180deg,#ffffff 0%,#f7fbff 52%,#fffdf8 100%)',
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
      <div style={{fontSize: 24, fontWeight: 800, color: COLORS.muted}}>Q6</div>
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
      camera={{fov: 42, position: [0, 0.8, 12.4]}}
      gl={{antialias: true, alpha: true}}
    >
      <ambientLight intensity={2.6} />
      <directionalLight position={[5, 8, 9]} intensity={2.8} />
      <pointLight position={[-4, 3, 5]} intensity={18} color="#38bdf8" distance={12} />
      <pointLight position={[4, 2, 5]} intensity={14} color="#10b981" distance={12} />
      {children}
    </ThreeCanvas>
  </div>
);

const ModelBox: React.FC<{position: [number, number, number]; color?: string; scale?: number}> = ({
  position,
  color = '#38bdf8',
  scale = 1,
}) => (
  <group position={position} scale={scale}>
    <mesh>
      <boxGeometry args={[1.15, 1.15, 1.15]} />
      <meshStandardMaterial color="#ffffff" roughness={0.33} metalness={0.03} />
    </mesh>
    <mesh position={[0, 0, 0.59]}>
      <boxGeometry args={[0.72, 0.16, 0.04]} />
      <meshBasicMaterial color={color} />
    </mesh>
    <mesh position={[0, -0.32, 0.59]}>
      <boxGeometry args={[0.48, 0.1, 0.04]} />
      <meshBasicMaterial color="#94a3b8" />
    </mesh>
  </group>
);

const EndpointTower: React.FC<{x?: number; activeColor?: string}> = ({x = 0, activeColor = '#10b981'}) => {
  const frame = useCurrentFrame();
  const pulse = 1 + Math.sin(frame / 10) * 0.025;
  return (
    <group position={[x, 0, 0]} scale={pulse}>
      <mesh position={[0, -1.1, 0]}>
        <cylinderGeometry args={[1.4, 1.55, 0.45, 32]} />
        <meshStandardMaterial color="#dbeafe" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[2.65, 2.3, 1.3]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.6, 0.68]}>
        <boxGeometry args={[1.85, 0.22, 0.06]} />
        <meshBasicMaterial color={activeColor} />
      </mesh>
      <mesh position={[0, 0.08, 0.68]}>
        <boxGeometry args={[1.35, 0.16, 0.06]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>
      <mesh position={[0, -0.42, 0.68]}>
        <boxGeometry args={[0.95, 0.16, 0.06]} />
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
      <div style={{...SAFE, top: 185}}>
        <div style={{fontSize: 29, fontWeight: 900, color: COLORS.cyan, letterSpacing: 1}}>THE COST PROBLEM</div>
        <div style={{fontSize: 69, fontWeight: 1000, lineHeight: 1.04, marginTop: 14}}>
          Thousands of models.
          <br />
          <span style={{color: COLORS.red}}>Very little traffic.</span>
        </div>
        <div style={{fontSize: 33, color: COLORS.muted, fontWeight: 750, marginTop: 22, lineHeight: 1.35}}>
          One dedicated SageMaker endpoint per model would waste money.
        </div>
      </div>
      <ThreeStage top={710} height={650}>
        {Array.from({length: 7}).map((_, i) => {
          const row = Math.floor(i / 4);
          const col = i % 4;
          const x = -4.2 + col * 2.7 + (row ? 1.35 : 0);
          const y = 1.35 - row * 2.5;
          const pop = spring({frame: frame - i * 3, fps: FPS, config: {damping: 18, stiffness: 120}});
          return (
            <group key={i} position={[x, y, 0]} scale={0.55 + pop * 0.23}>
              <ModelBox position={[0, 0, 0]} color={i % 2 ? '#10b981' : '#38bdf8'} />
              <mesh position={[0, -1.15, 0]}>
                <boxGeometry args={[1.65, 0.23, 0.6]} />
                <meshStandardMaterial color="#fee2e2" roughness={0.55} />
              </mesh>
            </group>
          );
        })}
      </ThreeStage>
      <div style={{position: 'absolute', left: 120, right: 120, top: 1500, borderRadius: 30, background: '#fff1f2', border: '2px solid rgba(190,18,60,.18)', padding: '26px 30px', textAlign: 'center', fontSize: 37, fontWeight: 1000, color: COLORS.red}}>
        MANY IDLE ENDPOINTS = HIGH COST
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
      <div style={{...SAFE, top: 245, textAlign: 'center'}}>
        <div style={{fontSize: 30, fontWeight: 900, color: COLORS.green}}>ANSWER</div>
        <div style={{fontSize: 79, fontWeight: 1000, lineHeight: 1.02, marginTop: 20, transform: `scale(${0.86 + pop * 0.14})`}}>
          SageMaker
          <br />
          <span style={{color: COLORS.green}}>Multi-Model Endpoint</span>
        </div>
        <div style={{margin: '58px auto 0', maxWidth: 820, borderRadius: 32, background: '#ecfdf5', border: '2px solid rgba(4,120,87,.2)', padding: '30px 32px', fontSize: 35, fontWeight: 900, lineHeight: 1.3, color: COLORS.green}}>
          Many models share the same inference infrastructure.
        </div>
      </div>
    </AbsoluteFill>
  );
};

const SharingScene: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{opacity: fade(frame, duration)}}>
      <Header />
      <div style={{...SAFE, top: 185}}>
        <div style={{fontSize: 29, fontWeight: 900, color: COLORS.cyan}}>ONE ENDPOINT, MANY MODELS</div>
        <div style={{fontSize: 66, fontWeight: 1000, lineHeight: 1.05, marginTop: 14}}>
          Share compute instead of
          <br />
          <span style={{color: COLORS.cyan}}>running everything separately.</span>
        </div>
      </div>
      <ThreeStage top={690} height={650}>
        <EndpointTower />
        {Array.from({length: 6}).map((_, i) => {
          const angle = (i / 6) * Math.PI * 2;
          const r = 4.4;
          const x = Math.cos(angle) * r;
          const y = Math.sin(angle) * 2.15;
          const z = -0.25 + Math.sin(angle) * 0.2;
          const pop = spring({frame: frame - 6 - i * 4, fps: FPS, config: {damping: 17, stiffness: 125}});
          return (
            <group key={i} scale={0.34 + pop * 0.24}>
              <ModelBox position={[x, y, z]} color={i % 2 ? '#10b981' : '#38bdf8'} />
            </group>
          );
        })}
      </ThreeStage>
      <div style={{position: 'absolute', left: 100, right: 100, top: 1465, borderRadius: 30, background: '#eff6ff', border: '2px solid rgba(3,105,161,.18)', padding: '26px 30px', textAlign: 'center', fontSize: 35, fontWeight: 950, color: COLORS.cyan}}>
        SHARED ENDPOINT INFRASTRUCTURE
      </div>
    </AbsoluteFill>
  );
};

const LoadScene: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [10, Math.max(20, duration - 10)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const x = THREE.MathUtils.lerp(-4.1, 0, progress);
  return (
    <AbsoluteFill style={{opacity: fade(frame, duration)}}>
      <Header accent={COLORS.orange} />
      <div style={{...SAFE, top: 185}}>
        <div style={{fontSize: 29, fontWeight: 900, color: COLORS.orange}}>WHEN A REQUEST ARRIVES</div>
        <div style={{fontSize: 64, fontWeight: 1000, lineHeight: 1.05, marginTop: 14}}>
          Load the required model
          <br />
          <span style={{color: COLORS.orange}}>only when it is needed.</span>
        </div>
      </div>
      <ThreeStage top={710} height={620}>
        <group position={[-4.1, 0, 0]} scale={0.78}>
          <ModelBox position={[0, 0, 0]} color="#e8790a" />
        </group>
        <EndpointTower x={2.15} activeColor="#e8790a" />
        <group position={[x, 0, 0]} scale={0.62}>
          <ModelBox position={[0, 0, 0]} color="#e8790a" />
        </group>
        <mesh position={[-1, -2.25, 0]}>
          <boxGeometry args={[6.7, 0.1, 0.35]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
        </mesh>
      </ThreeStage>
      <div style={{position: 'absolute', left: 115, right: 115, top: 1450, display: 'grid', gap: 18}}>
        <div style={{borderRadius: 26, background: '#fff7ed', border: '2px solid rgba(232,121,10,.2)', padding: '22px 28px', fontSize: 31, fontWeight: 900, color: COLORS.orange}}>1. Request identifies the model</div>
        <div style={{borderRadius: 26, background: '#ffffff', border: `2px solid ${COLORS.line}`, padding: '22px 28px', fontSize: 31, fontWeight: 900}}>2. SageMaker loads it onto shared compute</div>
      </div>
    </AbsoluteFill>
  );
};

const CostScene: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const appear = spring({frame: frame - 4, fps: FPS, config: {damping: 18, stiffness: 120}});
  return (
    <AbsoluteFill style={{opacity: fade(frame, duration)}}>
      <Header accent={COLORS.green} />
      <div style={{...SAFE, top: 190}}>
        <div style={{fontSize: 29, fontWeight: 900, color: COLORS.green}}>WHY USE IT?</div>
        <div style={{fontSize: 67, fontWeight: 1000, lineHeight: 1.05, marginTop: 14}}>
          Best when each model has
          <br />
          <span style={{color: COLORS.green}}>low or infrequent traffic.</span>
        </div>
        <div style={{marginTop: 70, display: 'grid', gap: 26}}>
          <div style={{opacity: appear, borderRadius: 34, background: '#fff1f2', border: '2px solid rgba(190,18,60,.16)', padding: '34px 34px'}}>
            <div style={{fontSize: 29, fontWeight: 850, color: COLORS.muted}}>SEPARATE ENDPOINTS</div>
            <div style={{fontSize: 48, fontWeight: 1000, color: COLORS.red, marginTop: 12}}>$$$$$$$$</div>
            <div style={{fontSize: 30, fontWeight: 800, marginTop: 12}}>Idle capacity for thousands of models</div>
          </div>
          <div style={{opacity: appear, borderRadius: 34, background: '#ecfdf5', border: '2px solid rgba(4,120,87,.2)', padding: '34px 34px'}}>
            <div style={{fontSize: 29, fontWeight: 850, color: COLORS.muted}}>MULTI-MODEL ENDPOINT</div>
            <div style={{fontSize: 48, fontWeight: 1000, color: COLORS.green, marginTop: 12}}>$$</div>
            <div style={{fontSize: 30, fontWeight: 800, marginTop: 12}}>Shared infrastructure reduces cost</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const TradeoffScene: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const meter = interpolate(frame, [5, Math.max(12, duration - 6)], [0.18, 0.88], {
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill style={{opacity: fade(frame, duration)}}>
      <Header accent={COLORS.orange} />
      <div style={{...SAFE, top: 195}}>
        <div style={{fontSize: 29, fontWeight: 900, color: COLORS.orange}}>THE TRADE-OFF</div>
        <div style={{fontSize: 66, fontWeight: 1000, lineHeight: 1.05, marginTop: 14}}>
          First request can have
          <br />
          <span style={{color: COLORS.orange}}>higher latency.</span>
        </div>
        <div style={{fontSize: 33, fontWeight: 760, color: COLORS.muted, lineHeight: 1.35, marginTop: 28}}>
          If the model is not already loaded in memory, SageMaker must load it first.
        </div>
        <div style={{marginTop: 70, borderRadius: 34, background: '#ffffff', border: `2px solid ${COLORS.line}`, padding: '38px 34px'}}>
          <div style={{fontSize: 27, fontWeight: 850, color: COLORS.muted}}>FIRST REQUEST LATENCY</div>
          <div style={{height: 34, borderRadius: 999, background: '#e2e8f0', marginTop: 28, overflow: 'hidden'}}>
            <div style={{height: '100%', width: `${meter * 100}%`, borderRadius: 999, background: 'linear-gradient(90deg,#38bdf8,#fb923c,#e11d48)'}} />
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 14, fontSize: 25, fontWeight: 850, color: COLORS.muted}}>
            <span>Already loaded</span>
            <span style={{color: COLORS.orange}}>Needs loading</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const MemoryScene: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const items = [
    'Many models',
    'Low traffic per model',
    'Reduce endpoint cost',
  ];
  return (
    <AbsoluteFill style={{opacity: fade(frame, duration)}}>
      <Header accent={COLORS.green} />
      <div style={{...SAFE, top: 180}}>
        <div style={{fontSize: 30, color: COLORS.green, fontWeight: 900}}>EXAM MEMORY RULE</div>
        <div style={{fontSize: 67, fontWeight: 1000, lineHeight: 1.05, marginTop: 14}}>
          See these clues?
          <br />
          <span style={{color: COLORS.green}}>Think MME.</span>
        </div>
        <div style={{marginTop: 58, display: 'grid', gap: 20}}>
          {items.map((item, i) => {
            const appear = spring({frame: frame - i * 6, fps: FPS, config: {damping: 17, stiffness: 125}});
            return (
              <div key={item} style={{opacity: appear, transform: `translateY(${(1 - appear) * 22}px)`, borderRadius: 28, background: '#ffffff', border: `2px solid ${COLORS.line}`, padding: '25px 30px', fontSize: 34, fontWeight: 900, display: 'flex', gap: 18, alignItems: 'center'}}>
                <span style={{fontSize: 36, color: COLORS.green, fontWeight: 1000}}>✓</span>
                {item}
              </div>
            );
          })}
        </div>
        <div style={{marginTop: 48, borderRadius: 34, background: '#ecfdf5', border: '2px solid rgba(4,120,87,.2)', padding: '34px 30px', textAlign: 'center'}}>
          <div style={{fontSize: 29, color: COLORS.muted, fontWeight: 850}}>ANSWER</div>
          <div style={{fontSize: 49, color: COLORS.green, fontWeight: 1000, marginTop: 10}}>MULTI-MODEL ENDPOINT</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const AwsMlQ06MultiModelEndpoint: React.FC = () => {
  const hookEnd = f(14.30);
  const answerEnd = f(21.33);
  const sharingEnd = f(30.12);
  const loadEnd = f(43.08);
  const costEnd = f(52.51);
  const tradeoffEnd = f(58.21);
  const total = 1898;

  return (
    <AbsoluteFill style={{fontFamily: FONT_FAMILY, color: COLORS.text}}>
      <Background />
      <Audio src={staticFile('audio/q06-multi-model-endpoint.mp3')} />

      <Sequence from={0} durationInFrames={hookEnd}>
        <HookScene duration={hookEnd} />
      </Sequence>
      <Sequence from={hookEnd} durationInFrames={answerEnd - hookEnd}>
        <AnswerScene duration={answerEnd - hookEnd} />
      </Sequence>
      <Sequence from={answerEnd} durationInFrames={sharingEnd - answerEnd}>
        <SharingScene duration={sharingEnd - answerEnd} />
      </Sequence>
      <Sequence from={sharingEnd} durationInFrames={loadEnd - sharingEnd}>
        <LoadScene duration={loadEnd - sharingEnd} />
      </Sequence>
      <Sequence from={loadEnd} durationInFrames={costEnd - loadEnd}>
        <CostScene duration={costEnd - loadEnd} />
      </Sequence>
      <Sequence from={costEnd} durationInFrames={tradeoffEnd - costEnd}>
        <TradeoffScene duration={tradeoffEnd - costEnd} />
      </Sequence>
      <Sequence from={tradeoffEnd} durationInFrames={total - tradeoffEnd}>
        <MemoryScene duration={total - tradeoffEnd} />
      </Sequence>
    </AbsoluteFill>
  );
};
