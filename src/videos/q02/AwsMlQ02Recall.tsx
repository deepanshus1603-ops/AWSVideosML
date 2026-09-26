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
  top: 148,
  bottom: 180,
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
          'radial-gradient(circle at 50% 33%, rgba(14,165,233,0.13), transparent 32%), linear-gradient(180deg, #fbfdff 0%, #eef7ff 54%, #ffffff 100%)',
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
          transform: `translateY(${(frame * 0.16) % 54}px)`,
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
        top: 65,
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
      <div style={{fontSize: 24, fontWeight: 800, color: COLORS.muted}}>Q2</div>
    </div>
  );
};

const ThreeStage: React.FC<{children: React.ReactNode; top?: number; height?: number}> = ({
  children,
  top = 590,
  height = 700,
}) => (
  <div style={{position: 'absolute', left: 42, right: 42, top, height}}>
    <ThreeCanvas
      width={996}
      height={height}
      camera={{fov: 42, position: [0, 0.2, 11.5]}}
      gl={{antialias: true, alpha: true}}
    >
      <ambientLight intensity={2.3} />
      <directionalLight position={[4, 6, 8]} intensity={2.7} />
      <pointLight position={[-4, 1, 5]} intensity={28} color="#38bdf8" distance={11} />
      <pointLight position={[4, 0, 4]} intensity={25} color="#fb7185" distance={10} />
      {children}
    </ThreeCanvas>
  </div>
);

const TransactionGrid: React.FC<{allNormal?: boolean; zoomFraud?: boolean}> = ({
  allNormal = false,
  zoomFraud = false,
}) => {
  const frame = useCurrentFrame();
  const columns = 10;
  const fraudIndex = 87;
  return (
    <group rotation={[-0.14, 0.06, 0]} scale={zoomFraud ? 1.08 : 1}>
      {Array.from({length: 100}).map((_, i) => {
        const row = Math.floor(i / columns);
        const col = i % columns;
        const isFraud = i === fraudIndex;
        const x = (col - 4.5) * 0.72;
        const y = (4.5 - row) * 0.54;
        const delay = i * 0.7;
        const enter = spring({frame: frame - delay, fps: FPS, config: {damping: 16, stiffness: 130}});
        const pulse = isFraud ? 1 + Math.sin(frame / 5) * 0.1 : 1;
        const color = allNormal ? '#a7c7e7' : isFraud ? '#fb7185' : '#8ecae6';
        return (
          <mesh
            key={i}
            position={[x, y, isFraud ? 0.18 : 0]}
            scale={[Math.max(0, enter) * pulse, Math.max(0, enter) * pulse, Math.max(0, enter) * pulse]}
            rotation={[0.18, 0.2, isFraud ? frame / 30 : 0]}
          >
            <boxGeometry args={[0.46, 0.34, 0.22]} />
            <meshStandardMaterial
              color={color}
              emissive={isFraud && !allNormal ? '#fb7185' : color}
              emissiveIntensity={isFraud && !allNormal ? 0.65 : 0.08}
              roughness={0.4}
            />
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
      <div style={{...SAFE, top: 195}}>
        <div style={{fontSize: 29, fontWeight: 850, color: COLORS.cyan, letterSpacing: 1.3}}>
          IMBALANCED CLASSIFICATION
        </div>
        <div style={{fontSize: 76, fontWeight: 950, lineHeight: 1.02, marginTop: 14}}>
          99,000 normal.
          <br />
          <span style={{color: COLORS.red}}>1,000 fraud.</span>
        </div>
        <div style={{fontSize: 34, color: COLORS.muted, fontWeight: 680, marginTop: 22}}>
          One class dominates the dataset.
        </div>
      </div>
      <ThreeStage top={620} height={670}>
        <TransactionGrid />
      </ThreeStage>
      <div
        style={{
          position: 'absolute',
          left: 108,
          right: 108,
          top: 1320,
          display: 'flex',
          gap: 18,
          justifyContent: 'center',
        }}
      >
        <div style={{padding: '18px 26px', borderRadius: 24, background: '#e0f2fe', color: '#075985', fontSize: 30, fontWeight: 850}}>
          99% NORMAL
        </div>
        <div style={{padding: '18px 26px', borderRadius: 24, background: '#ffe4e6', color: '#9f1239', fontSize: 30, fontWeight: 850}}>
          1% FRAUD
        </div>
      </div>
    </AbsoluteFill>
  );
};

const AccuracyTrapScene: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const pop = spring({frame, fps: FPS, config: {damping: 12, stiffness: 140}});
  return (
    <AbsoluteFill style={{opacity: fade(frame, duration)}}>
      <Header accent={COLORS.red} />
      <div style={{...SAFE, top: 210}}>
        <div style={{fontSize: 30, fontWeight: 850, color: COLORS.red}}>THE TRAP</div>
        <div style={{fontSize: 83, lineHeight: 1, fontWeight: 1000, marginTop: 18}}>
          <span style={{color: COLORS.orange}}>99% accuracy</span>
          <br />
          can still be bad.
        </div>
        <div style={{fontSize: 34, color: COLORS.muted, fontWeight: 680, marginTop: 24}}>
          The model misses most fraudulent transactions.
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 95,
          right: 95,
          top: 825,
          padding: '38px 42px',
          borderRadius: 36,
          background: 'rgba(255,255,255,0.95)',
          border: `2px solid ${COLORS.line}`,
          boxShadow: '0 20px 60px rgba(15,23,42,0.10)',
          transform: `scale(${0.9 + pop * 0.1})`,
          textAlign: 'center',
        }}
      >
        <div style={{fontSize: 34, color: COLORS.muted, fontWeight: 760}}>Which metric should you focus on?</div>
        <div style={{fontSize: 112, fontWeight: 1000, color: COLORS.green, marginTop: 20, letterSpacing: -3}}>
          RECALL
        </div>
      </div>
    </AbsoluteFill>
  );
};

const RecallFormulaScene: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const bar = interpolate(frame, [10, duration - 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill style={{opacity: fade(frame, duration)}}>
      <Header accent={COLORS.green} />
      <div style={{...SAFE, top: 205}}>
        <div style={{fontSize: 31, fontWeight: 850, color: COLORS.green}}>WHAT RECALL ASKS</div>
        <div style={{fontSize: 67, lineHeight: 1.08, fontWeight: 950, marginTop: 16}}>
          Of all <span style={{color: COLORS.red}}>actual fraud</span>,
          <br />
          how many did we catch?
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 105,
          right: 105,
          top: 730,
          borderRadius: 38,
          background: COLORS.card,
          border: `2px solid ${COLORS.line}`,
          padding: '50px 38px',
          boxShadow: '0 22px 70px rgba(15,23,42,0.09)',
          textAlign: 'center',
        }}
      >
        <div style={{fontSize: 46, fontWeight: 900, color: COLORS.text}}>Recall</div>
        <div style={{fontSize: 71, fontWeight: 1000, color: COLORS.green, marginTop: 18}}>
          TP / (TP + FN)
        </div>
        <div style={{marginTop: 42, height: 18, background: '#e2e8f0', borderRadius: 999, overflow: 'hidden'}}>
          <div style={{height: '100%', width: `${bar * 100}%`, background: 'linear-gradient(90deg,#10b981,#22c55e)', borderRadius: 999}} />
        </div>
        <div style={{marginTop: 25, display: 'flex', justifyContent: 'space-between', fontSize: 28, fontWeight: 800}}>
          <span style={{color: COLORS.green}}>TP = caught fraud</span>
          <span style={{color: COLORS.red}}>FN = missed fraud</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const PredictAllNormalScene: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const strike = interpolate(frame, [75, 105], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{opacity: fade(frame, duration)}}>
      <Header accent={COLORS.orange} />
      <div style={{...SAFE, top: 205}}>
        <div style={{fontSize: 30, fontWeight: 850, color: COLORS.orange}}>WHY ACCURACY MISLEADS</div>
        <div style={{fontSize: 68, lineHeight: 1.06, fontWeight: 950, marginTop: 15}}>
          Predict <span style={{color: COLORS.cyan}}>NORMAL</span>
          <br />
          for everything.
        </div>
        <div style={{fontSize: 34, color: COLORS.muted, fontWeight: 680, marginTop: 20}}>
          You can still score about 99% accuracy.
        </div>
      </div>
      <ThreeStage top={665} height={650}>
        <TransactionGrid allNormal />
      </ThreeStage>
      <div
        style={{
          position: 'absolute',
          left: 315,
          top: 1320,
          fontSize: 48,
          fontWeight: 1000,
          color: COLORS.red,
          opacity: strike,
          transform: `scale(${0.8 + strike * 0.2})`,
        }}
      >
        FRAUD MISSED
      </div>
    </AbsoluteFill>
  );
};

const FalseNegativeScene: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{opacity: fade(frame, duration)}}>
      <Header accent={COLORS.red} />
      <div style={{...SAFE, top: 210}}>
        <div style={{fontSize: 31, color: COLORS.red, fontWeight: 850}}>FALSE NEGATIVES ARE COSTLY</div>
        <div style={{fontSize: 76, lineHeight: 1.02, fontWeight: 1000, marginTop: 16}}>
          Actual positive.
          <br />
          Predicted negative.
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 92,
          right: 92,
          top: 690,
          display: 'grid',
          gap: 24,
        }}
      >
        {[
          ['MISSED FRAUD', 'Fraud transaction → predicted normal'],
          ['MISSED DISEASE', 'Positive case → predicted negative'],
          ['MISSED THREAT', 'Threat → predicted safe'],
        ].map(([title, sub], i) => {
          const enter = spring({frame: frame - i * 10, fps: FPS, config: {damping: 14, stiffness: 130}});
          return (
            <div
              key={title}
              style={{
                background: '#fff',
                border: '2px solid #fecdd3',
                borderRadius: 30,
                padding: '30px 34px',
                transform: `translateX(${(1 - enter) * 90}px)`,
                opacity: Math.max(0, enter),
                boxShadow: '0 15px 45px rgba(190,18,60,.08)',
              }}
            >
              <div style={{fontSize: 35, fontWeight: 950, color: COLORS.red}}>{title}</div>
              <div style={{fontSize: 28, color: COLORS.muted, fontWeight: 680, marginTop: 8}}>{sub}</div>
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 165,
          right: 165,
          top: 1375,
          textAlign: 'center',
          fontSize: 58,
          fontWeight: 1000,
          color: COLORS.green,
        }}
      >
        Think RECALL
      </div>
    </AbsoluteFill>
  );
};

const MemoryScene: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const pop = spring({frame, fps: FPS, config: {damping: 14, stiffness: 120}});
  return (
    <AbsoluteFill style={{opacity: fade(frame, duration)}}>
      <Header accent={COLORS.green} />
      <div style={{...SAFE, top: 205}}>
        <div style={{fontSize: 30, fontWeight: 850, color: COLORS.cyan}}>EXAM MEMORY TRICK</div>
        <div style={{fontSize: 76, lineHeight: 1.02, fontWeight: 1000, marginTop: 16}}>
          Precision vs Recall
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 75,
          right: 75,
          top: 560,
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 28,
        }}
      >
        <div
          style={{
            background: '#ffffff',
            border: '2px solid #bae6fd',
            borderRadius: 34,
            padding: '38px 38px',
            boxShadow: '0 18px 55px rgba(3,105,161,.08)',
          }}
        >
          <div style={{fontSize: 41, fontWeight: 1000, color: COLORS.cyan}}>PRECISION</div>
          <div style={{fontSize: 32, lineHeight: 1.25, fontWeight: 720, color: COLORS.text, marginTop: 12}}>
            “When I predicted positive,
            <br />
            how often was I right?”
          </div>
        </div>
        <div
          style={{
            background: '#ffffff',
            border: '3px solid #a7f3d0',
            borderRadius: 34,
            padding: '38px 38px',
            boxShadow: '0 18px 55px rgba(4,120,87,.10)',
            transform: `scale(${0.96 + pop * 0.04})`,
          }}
        >
          <div style={{fontSize: 41, fontWeight: 1000, color: COLORS.green}}>RECALL</div>
          <div style={{fontSize: 32, lineHeight: 1.25, fontWeight: 720, color: COLORS.text, marginTop: 12}}>
            “Of all actual positives,
            <br />
            how many did I catch?”
          </div>
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 84,
          right: 84,
          top: 1375,
          borderRadius: 28,
          padding: '24px 30px',
          background: '#dcfce7',
          border: '2px solid #86efac',
          textAlign: 'center',
          fontSize: 38,
          fontWeight: 1000,
          color: '#166534',
        }}
      >
        Miss fewer positives → RECALL
      </div>
    </AbsoluteFill>
  );
};

const Scene: React.FC<{from: number; to: number; children: React.ReactNode}> = ({from, to, children}) => (
  <Sequence from={f(from)} durationInFrames={f(to - from)}>
    {children}
  </Sequence>
);

export const AwsMlQ02Recall: React.FC = () => {
  return (
    <AbsoluteFill style={{fontFamily: FONT_FAMILY, background: COLORS.bg0, color: COLORS.text}}>
      <Background />
      <Audio src={staticFile('audio/q02-recall.mp3')} />

      <Scene from={0} to={9.34}>
        <HookScene duration={f(9.34)} />
      </Scene>
      <Scene from={9.34} to={18.57}>
        <AccuracyTrapScene duration={f(18.57 - 9.34)} />
      </Scene>
      <Scene from={18.57} to={25.44}>
        <RecallFormulaScene duration={f(25.44 - 18.57)} />
      </Scene>
      <Scene from={25.44} to={34.11}>
        <PredictAllNormalScene duration={f(34.11 - 25.44)} />
      </Scene>
      <Scene from={34.11} to={43.16}>
        <FalseNegativeScene duration={f(43.16 - 34.11)} />
      </Scene>
      <Scene from={43.16} to={54.17}>
        <MemoryScene duration={f(54.17 - 43.16)} />
      </Scene>
    </AbsoluteFill>
  );
};
