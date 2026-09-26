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
          'radial-gradient(circle at 72% 23%, rgba(3,105,161,0.12), transparent 28%), radial-gradient(circle at 18% 72%, rgba(4,120,87,0.08), transparent 29%), linear-gradient(180deg,#ffffff 0%,#f5faff 52%,#fffdf8 100%)',
        overflow: 'hidden',
        fontFamily: FONT_FAMILY,
        color: COLORS.text,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.32,
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
      <div style={{fontSize: 24, fontWeight: 800, color: COLORS.muted}}>Q5</div>
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
      camera={{fov: 42, position: [0, 0.7, 12.2]}}
      gl={{antialias: true, alpha: true}}
    >
      <ambientLight intensity={2.5} />
      <directionalLight position={[4, 7, 8]} intensity={2.7} />
      <pointLight position={[-4, 3, 5]} intensity={20} color="#38bdf8" distance={12} />
      <pointLight position={[4, 2, 5]} intensity={16} color="#10b981" distance={12} />
      {children}
    </ThreeCanvas>
  </div>
);

const Histogram3D: React.FC<{
  values: number[];
  x?: number;
  color?: string;
  delay?: number;
}> = ({values, x = 0, color = '#38bdf8', delay = 0}) => {
  const frame = useCurrentFrame();
  return (
    <group position={[x, -1.15, 0]}>
      {values.map((value, i) => {
        const pop = spring({
          frame: frame - delay - i * 3,
          fps: FPS,
          config: {damping: 18, stiffness: 115},
        });
        const h = Math.max(0.04, value * pop);
        return (
          <mesh key={i} position={[(i - (values.length - 1) / 2) * 0.68, h / 2, 0]}>
            <boxGeometry args={[0.48, h, 0.55]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.18}
              roughness={0.35}
            />
          </mesh>
        );
      })}
      <mesh position={[0, -0.12, 0]}>
        <boxGeometry args={[values.length * 0.78, 0.12, 0.8]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.8} />
      </mesh>
    </group>
  );
};

const Scanner: React.FC = () => {
  const frame = useCurrentFrame();
  const y = THREE.MathUtils.lerp(-1.8, 1.8, (Math.sin(frame / 20) + 1) / 2);
  return (
    <group>
      <mesh position={[0, 0, 0]} rotation={[0.05, -0.1, 0]}>
        <boxGeometry args={[5.5, 4.1, 0.55]} />
        <meshStandardMaterial color="#eff6ff" roughness={0.35} metalness={0.04} />
      </mesh>
      <mesh position={[0, y, 0.34]}>
        <boxGeometry args={[5.05, 0.08, 0.08]} />
        <meshBasicMaterial color="#0284c7" />
      </mesh>
      {Array.from({length: 9}).map((_, i) => {
        const x = -2 + i * 0.5;
        const h = 0.7 + ((i * 7) % 5) * 0.28;
        return (
          <mesh key={i} position={[x, -1.55 + h / 2, 0.38]}>
            <boxGeometry args={[0.26, h, 0.12]} />
            <meshBasicMaterial color={i > 5 ? '#10b981' : '#38bdf8'} />
          </mesh>
        );
      })}
    </group>
  );
};

const HookScene: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{opacity: fade(frame, duration)}}>
      <Header />
      <div style={{...SAFE, top: 185}}>
        <div style={{fontSize: 29, fontWeight: 900, color: COLORS.cyan, letterSpacing: 1}}>PRODUCTION DRIFT</div>
        <div style={{fontSize: 70, fontWeight: 1000, lineHeight: 1.04, marginTop: 14}}>
          Months later,
          <br />
          <span style={{color: COLORS.red}}>customer behavior changes.</span>
        </div>
        <div style={{fontSize: 34, color: COLORS.muted, fontWeight: 700, marginTop: 22, lineHeight: 1.35}}>
          Incoming data no longer looks like the data used for training.
        </div>
      </div>
      <ThreeStage top={700} height={610}>
        <group position={[-2.7, 0.1, 0]} scale={0.84}>
          <Histogram3D values={[0.8, 1.7, 2.8, 3.4, 2.5, 1.3, 0.6]} color="#38bdf8" />
        </group>
        <group position={[2.7, 0.1, 0]} scale={0.84}>
          <Histogram3D values={[0.35, 0.65, 1.1, 1.9, 2.8, 3.5, 3.0]} color="#fb7185" delay={8} />
        </group>
      </ThreeStage>
      <div style={{position: 'absolute', left: 92, right: 92, top: 1320, display: 'flex', gap: 22}}>
        <div style={{flex: 1, background: '#eff6ff', border: '2px solid rgba(3,105,161,.18)', borderRadius: 26, padding: '24px 18px', textAlign: 'center', fontSize: 30, fontWeight: 900, color: COLORS.cyan}}>
          TRAINING DATA
        </div>
        <div style={{flex: 1, background: '#fff1f2', border: '2px solid rgba(190,18,60,.16)', borderRadius: 26, padding: '24px 18px', textAlign: 'center', fontSize: 30, fontWeight: 900, color: COLORS.red}}>
          PRODUCTION DATA
        </div>
      </div>
      <div style={{position: 'absolute', left: 112, right: 112, top: 1485, padding: '26px 28px', borderRadius: 28, background: '#ffffff', border: `2px solid ${COLORS.line}`, textAlign: 'center', fontSize: 34, fontWeight: 900, boxShadow: '0 14px 45px rgba(15,23,42,.06)'}}>
        Which SageMaker capability detects this?
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
      <div style={{...SAFE, top: 240, textAlign: 'center'}}>
        <div style={{fontSize: 31, fontWeight: 900, color: COLORS.green}}>ANSWER</div>
        <div style={{fontSize: 83, fontWeight: 1000, lineHeight: 1.02, marginTop: 20, transform: `scale(${0.84 + pop * 0.16})`}}>
          SageMaker
          <br />
          <span style={{color: COLORS.green}}>Model Monitor</span>
        </div>
        <div style={{margin: '58px auto 0', maxWidth: 800, background: '#ecfdf5', border: '2px solid rgba(4,120,87,.2)', borderRadius: 30, padding: '30px 34px', fontSize: 36, fontWeight: 900, color: COLORS.green, lineHeight: 1.25}}>
          Monitor production data and model behavior over time
        </div>
      </div>
    </AbsoluteFill>
  );
};

const MonitorScene: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{opacity: fade(frame, duration)}}>
      <Header />
      <div style={{...SAFE, top: 190}}>
        <div style={{fontSize: 29, fontWeight: 900, color: COLORS.cyan}}>WHAT IT DOES</div>
        <div style={{fontSize: 66, fontWeight: 1000, lineHeight: 1.06, marginTop: 14}}>
          Compare production
          <br />
          <span style={{color: COLORS.cyan}}>against a baseline.</span>
        </div>
      </div>
      <ThreeStage top={670} height={650}>
        <Scanner />
      </ThreeStage>
      <div style={{position: 'absolute', left: 95, right: 95, top: 1350, display: 'grid', gap: 16}}>
        {['Data quality changes', 'Model behavior changes', 'Constraint violations'].map((text, i) => {
          const appear = spring({frame: frame - 16 - i * 7, fps: FPS, config: {damping: 18, stiffness: 130}});
          return (
            <div key={text} style={{opacity: appear, transform: `translateY(${(1 - appear) * 18}px)`, borderRadius: 24, background: '#ffffff', border: `2px solid ${COLORS.line}`, padding: '20px 26px', fontSize: 31, fontWeight: 850, display: 'flex', alignItems: 'center', gap: 18}}>
              <span style={{color: COLORS.green, fontWeight: 1000, fontSize: 34}}>✓</span>
              {text}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const ExampleScene: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{opacity: fade(frame, duration)}}>
      <Header accent={COLORS.orange} />
      <div style={{...SAFE, top: 190}}>
        <div style={{fontSize: 29, fontWeight: 900, color: COLORS.orange}}>EXAMPLE</div>
        <div style={{fontSize: 65, fontWeight: 1000, lineHeight: 1.06, marginTop: 14}}>
          Customer age distribution
          <br />
          <span style={{color: COLORS.orange}}>moves over time.</span>
        </div>
      </div>
      <ThreeStage top={655} height={630}>
        <group position={[-2.8, 0, 0]} scale={0.86}>
          <Histogram3D values={[0.6, 1.8, 3.2, 3.6, 1.8, 0.7]} color="#38bdf8" />
        </group>
        <group position={[2.8, 0, 0]} scale={0.86}>
          <Histogram3D values={[0.35, 0.8, 1.5, 2.7, 3.8, 3.4]} color="#fb923c" delay={10} />
        </group>
      </ThreeStage>
      <div style={{position: 'absolute', left: 92, right: 92, top: 1320, display: 'flex', gap: 22}}>
        <div style={{flex: 1, background: '#eff6ff', border: '2px solid rgba(3,105,161,.18)', borderRadius: 26, padding: '24px 20px', textAlign: 'center'}}>
          <div style={{fontSize: 24, fontWeight: 800, color: COLORS.muted}}>TRAINING</div>
          <div style={{fontSize: 38, fontWeight: 1000, color: COLORS.cyan, marginTop: 7}}>20–40</div>
        </div>
        <div style={{flex: 1, background: '#fff7ed', border: '2px solid rgba(232,121,10,.18)', borderRadius: 26, padding: '24px 20px', textAlign: 'center'}}>
          <div style={{fontSize: 24, fontWeight: 800, color: COLORS.muted}}>PRODUCTION</div>
          <div style={{fontSize: 38, fontWeight: 1000, color: COLORS.orange, marginTop: 7}}>40–60</div>
        </div>
      </div>
      <div style={{position: 'absolute', left: 122, right: 122, top: 1505, borderRadius: 28, background: '#fff1f2', border: '2px solid rgba(190,18,60,.16)', padding: '25px 28px', textAlign: 'center', fontSize: 38, fontWeight: 1000, color: COLORS.red}}>
        THIS SHIFT = DATA DRIFT
      </div>
    </AbsoluteFill>
  );
};

const DriftScene: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const shift = interpolate(frame, [0, duration], [0, 1], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{opacity: fade(frame, duration)}}>
      <Header accent={COLORS.red} />
      <div style={{...SAFE, top: 205}}>
        <div style={{fontSize: 29, fontWeight: 900, color: COLORS.red}}>DATA DRIFT</div>
        <div style={{fontSize: 68, fontWeight: 1000, lineHeight: 1.04, marginTop: 14}}>
          Production data moves
          <br />
          <span style={{color: COLORS.red}}>outside expected ranges.</span>
        </div>
        <div style={{marginTop: 58, borderRadius: 34, background: '#ffffff', border: `2px solid ${COLORS.line}`, padding: '36px 36px 42px', boxShadow: '0 14px 45px rgba(15,23,42,.06)'}}>
          <div style={{fontSize: 27, fontWeight: 850, color: COLORS.muted}}>BASELINE RANGE</div>
          <div style={{position: 'relative', height: 90, marginTop: 30}}>
            <div style={{position: 'absolute', left: 0, right: 0, top: 30, height: 18, borderRadius: 999, background: '#e2e8f0'}} />
            <div style={{position: 'absolute', left: '25%', width: '48%', top: 22, height: 34, borderRadius: 999, background: '#bae6fd', border: '2px solid rgba(3,105,161,.25)'}} />
            <div style={{position: 'absolute', left: `${45 + shift * 40}%`, top: 8, width: 32, height: 62, borderRadius: 12, background: shift > 0.6 ? '#e11d48' : '#0284c7', transform: 'translateX(-50%)'}} />
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 25, color: COLORS.muted, fontWeight: 800}}>
            <span>Expected</span>
            <span style={{color: shift > 0.6 ? COLORS.red : COLORS.cyan}}>Production</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const ClarifyScene: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{opacity: fade(frame, duration)}}>
      <Header accent={COLORS.orange} />
      <div style={{...SAFE, top: 185}}>
        <div style={{fontSize: 29, fontWeight: 900, color: COLORS.orange}}>DON'T CONFUSE THESE</div>
        <div style={{fontSize: 61, fontWeight: 1000, lineHeight: 1.05, marginTop: 14}}>
          Model Monitor
          <br />
          <span style={{color: COLORS.orange}}>vs Clarify</span>
        </div>
        <div style={{marginTop: 54, display: 'grid', gap: 24}}>
          <div style={{borderRadius: 30, background: '#eff6ff', border: '2px solid rgba(3,105,161,.2)', padding: '34px 34px'}}>
            <div style={{fontSize: 36, fontWeight: 1000, color: COLORS.cyan}}>MODEL MONITOR</div>
            <div style={{fontSize: 31, fontWeight: 800, color: COLORS.text, marginTop: 12, lineHeight: 1.35}}>Production monitoring, drift, quality changes</div>
          </div>
          <div style={{borderRadius: 30, background: '#fff7ed', border: '2px solid rgba(232,121,10,.2)', padding: '34px 34px'}}>
            <div style={{fontSize: 36, fontWeight: 1000, color: COLORS.orange}}>CLARIFY</div>
            <div style={{fontSize: 31, fontWeight: 800, color: COLORS.text, marginTop: 12, lineHeight: 1.35}}>Bias detection and prediction explainability</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const MemoryScene: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const cards = [
    {label: 'Data drift / production monitoring', answer: 'MODEL MONITOR', color: COLORS.cyan, bg: '#eff6ff'},
    {label: 'Bias / explain a prediction', answer: 'CLARIFY', color: COLORS.orange, bg: '#fff7ed'},
  ];
  return (
    <AbsoluteFill style={{opacity: fade(frame, duration)}}>
      <Header accent={COLORS.green} />
      <div style={{...SAFE, top: 185}}>
        <div style={{fontSize: 30, color: COLORS.green, fontWeight: 900}}>EXAM MEMORY RULE</div>
        <div style={{fontSize: 66, fontWeight: 1000, lineHeight: 1.06, marginTop: 14}}>
          Match the clue
          <br />
          <span style={{color: COLORS.green}}>to the service.</span>
        </div>
        <div style={{marginTop: 58, display: 'grid', gap: 28}}>
          {cards.map((card, i) => {
            const appear = spring({frame: frame - i * 8, fps: FPS, config: {damping: 18, stiffness: 125}});
            return (
              <div key={card.answer} style={{opacity: appear, transform: `translateY(${(1 - appear) * 24}px)`, borderRadius: 32, background: card.bg, border: `2px solid ${card.color}33`, padding: '34px 34px', boxShadow: '0 12px 40px rgba(15,23,42,.05)'}}>
                <div style={{fontSize: 29, fontWeight: 800, color: COLORS.muted, lineHeight: 1.35}}>{card.label}</div>
                <div style={{fontSize: 44, fontWeight: 1000, color: card.color, marginTop: 14}}>{card.answer}</div>
              </div>
            );
          })}
        </div>
        <div style={{marginTop: 46, borderRadius: 34, background: '#ecfdf5', border: '2px solid rgba(4,120,87,.2)', padding: '30px 34px', textAlign: 'center', fontSize: 38, fontWeight: 1000, color: COLORS.green}}>
          DATA DRIFT → MODEL MONITOR
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const AwsMlQ05ModelMonitor: React.FC = () => {
  const hookEnd = f(14.73);
  const answerEnd = f(20.36);
  const monitorEnd = f(32.40);
  const exampleEnd = f(42.00);
  const driftEnd = f(49.33);
  const clarifyEnd = f(56.92);
  const total = 1988;

  return (
    <AbsoluteFill style={{fontFamily: FONT_FAMILY, color: COLORS.text}}>
      <Background />
      <Audio src={staticFile('audio/q05-model-monitor.mp3')} />

      <Sequence from={0} durationInFrames={hookEnd}>
        <HookScene duration={hookEnd} />
      </Sequence>
      <Sequence from={hookEnd} durationInFrames={answerEnd - hookEnd}>
        <AnswerScene duration={answerEnd - hookEnd} />
      </Sequence>
      <Sequence from={answerEnd} durationInFrames={monitorEnd - answerEnd}>
        <MonitorScene duration={monitorEnd - answerEnd} />
      </Sequence>
      <Sequence from={monitorEnd} durationInFrames={exampleEnd - monitorEnd}>
        <ExampleScene duration={exampleEnd - monitorEnd} />
      </Sequence>
      <Sequence from={exampleEnd} durationInFrames={driftEnd - exampleEnd}>
        <DriftScene duration={driftEnd - exampleEnd} />
      </Sequence>
      <Sequence from={driftEnd} durationInFrames={clarifyEnd - driftEnd}>
        <ClarifyScene duration={clarifyEnd - driftEnd} />
      </Sequence>
      <Sequence from={clarifyEnd} durationInFrames={total - clarifyEnd}>
        <MemoryScene duration={total - clarifyEnd} />
      </Sequence>
    </AbsoluteFill>
  );
};
