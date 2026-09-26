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
          'radial-gradient(circle at 80% 15%, rgba(124,58,237,0.10), transparent 30%), radial-gradient(circle at 18% 77%, rgba(3,105,161,0.08), transparent 32%), linear-gradient(180deg,#ffffff 0%,#f8fbff 55%,#fffdf8 100%)',
        overflow: 'hidden',
        fontFamily: FONT_FAMILY,
        color: COLORS.text,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.28,
          backgroundImage:
            'linear-gradient(rgba(15,23,42,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,.035) 1px, transparent 1px)',
          backgroundSize: '54px 54px',
          transform: `translateY(${(frame * 0.12) % 54}px)`,
        }}
      />
    </AbsoluteFill>
  );
};

const Header: React.FC<{accent?: string}> = ({accent = '#7c3aed'}) => (
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
    <div style={{fontSize: 24, fontWeight: 800, color: COLORS.muted}}>Q8</div>
  </div>
);

const ThreeStage: React.FC<{children: React.ReactNode; top?: number; height?: number}> = ({
  children,
  top = 690,
  height = 620,
}) => (
  <div style={{position: 'absolute', left: 42, right: 42, top, height}}>
    <ThreeCanvas
      width={996}
      height={height}
      camera={{fov: 42, position: [0, 0.6, 12.5]}}
      gl={{antialias: true, alpha: true}}
    >
      <ambientLight intensity={2.8} />
      <directionalLight position={[5, 8, 9]} intensity={2.8} />
      <pointLight position={[-4, 4, 6]} intensity={13} color="#7c3aed" distance={13} />
      <pointLight position={[4, 1, 5]} intensity={12} color="#38bdf8" distance={12} />
      {children}
    </ThreeCanvas>
  </div>
);

const FeatureBars3D: React.FC = () => {
  const frame = useCurrentFrame();
  const bars = [
    {x: -3.5, h: 2.8, color: '#7c3aed'},
    {x: -1.7, h: 1.8, color: '#0ea5e9'},
    {x: 0.1, h: 3.6, color: '#059669'},
    {x: 1.9, h: 1.35, color: '#f59e0b'},
    {x: 3.7, h: 2.2, color: '#e11d48'},
  ];
  return (
    <group position={[0, -1.35, 0]}>
      {bars.map((b, i) => {
        const p = spring({frame: frame - i * 4, fps: FPS, config: {damping: 15, stiffness: 110}});
        return (
          <group key={b.x} position={[b.x, (b.h * p) / 2, 0]}>
            <mesh scale={[1, p, 1]}>
              <boxGeometry args={[1.15, b.h, 1.1]} />
              <meshStandardMaterial color="#ffffff" roughness={0.28} />
            </mesh>
            <mesh position={[0, (b.h * p) / 2 + 0.03, 0.56]} scale={[1, p, 1]}>
              <boxGeometry args={[0.92, 0.13, 0.04]} />
              <meshBasicMaterial color={b.color} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

const Balance3D: React.FC = () => {
  const frame = useCurrentFrame();
  const sway = Math.sin(frame / 16) * 0.08;
  return (
    <group rotation={[0, 0, sway]} position={[0, -0.4, 0]}>
      <mesh>
        <boxGeometry args={[0.35, 3.5, 0.55]} />
        <meshStandardMaterial color="#ffffff" roughness={0.25} />
      </mesh>
      <mesh position={[0, 1.45, 0]}>
        <boxGeometry args={[6.6, 0.28, 0.45]} />
        <meshStandardMaterial color="#ffffff" roughness={0.25} />
      </mesh>
      {[-2.45, 2.45].map((x, i) => (
        <group key={x} position={[x, 0.35, 0]}>
          <mesh position={[0, 0.55, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 1.55, 16]} />
            <meshBasicMaterial color="#64748b" />
          </mesh>
          <mesh position={[0, -0.2, 0]}>
            <cylinderGeometry args={[1.05, 1.05, 0.18, 32]} />
            <meshStandardMaterial color={i === 0 ? '#ede9fe' : '#e0f2fe'} roughness={0.4} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, -2.2, 0]}>
        <cylinderGeometry args={[1.35, 1.75, 0.42, 32]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>
    </group>
  );
};

const HookScene: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{opacity: fade(frame, duration)}}>
      <Header />
      <div style={{...SAFE, top: 190}}>
        <div style={{fontSize: 29, fontWeight: 900, color: '#7c3aed', letterSpacing: 1}}>
          CLASSIFICATION MODEL
        </div>
        <div style={{fontSize: 69, fontWeight: 1000, lineHeight: 1.03, marginTop: 16}}>
          The model is deployed.
          <br />
          <span style={{color: COLORS.cyan}}>Now explain it.</span>
        </div>
        <div style={{fontSize: 34, color: COLORS.muted, fontWeight: 760, marginTop: 24, lineHeight: 1.38}}>
          The team wants to understand what is happening behind its predictions.
        </div>
      </div>

      <ThreeStage top={760} height={560}>
        <FeatureBars3D />
      </ThreeStage>

      <div
        style={{
          position: 'absolute',
          left: 118,
          right: 118,
          top: 1490,
          borderRadius: 30,
          background: '#f5f3ff',
          border: '2px solid rgba(124,58,237,.18)',
          padding: '26px 30px',
          textAlign: 'center',
          fontSize: 34,
          fontWeight: 1000,
          color: '#6d28d9',
        }}
      >
        Which SageMaker capability should you use?
      </div>
    </AbsoluteFill>
  );
};

const GoalsScene: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const p = spring({frame, fps: FPS, config: {damping: 15, stiffness: 110}});
  return (
    <AbsoluteFill style={{opacity: fade(frame, duration)}}>
      <Header />
      <div style={{...SAFE, top: 195}}>
        <div style={{fontSize: 31, fontWeight: 950, color: COLORS.cyan}}>TWO QUESTIONS</div>
        <div style={{fontSize: 65, fontWeight: 1000, marginTop: 18, lineHeight: 1.04}}>
          What does the team
          <br />
          need to know?
        </div>

        <div style={{marginTop: 70, display: 'flex', flexDirection: 'column', gap: 30}}>
          <div
            style={{
              background: '#f5f3ff',
              border: '3px solid rgba(124,58,237,.20)',
              borderRadius: 34,
              padding: '34px 38px',
              transform: `translateX(${(1 - p) * -38}px)`,
            }}
          >
            <div style={{fontSize: 28, fontWeight: 1000, color: '#7c3aed'}}>1. BIAS</div>
            <div style={{fontSize: 43, fontWeight: 950, marginTop: 12, lineHeight: 1.25}}>
              Is the model treating groups differently?
            </div>
          </div>
          <div
            style={{
              background: '#eff6ff',
              border: '3px solid rgba(3,105,161,.18)',
              borderRadius: 34,
              padding: '34px 38px',
              transform: `translateX(${(1 - p) * 38}px)`,
            }}
          >
            <div style={{fontSize: 28, fontWeight: 1000, color: COLORS.cyan}}>2. EXPLAINABILITY</div>
            <div style={{fontSize: 43, fontWeight: 950, marginTop: 12, lineHeight: 1.25}}>
              Which features influenced this prediction?
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const AnswerScene: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const pop = spring({frame, fps: FPS, config: {damping: 14, stiffness: 112}});
  return (
    <AbsoluteFill style={{opacity: fade(frame, duration)}}>
      <Header accent="#7c3aed" />
      <div style={{...SAFE, top: 280, textAlign: 'center'}}>
        <div style={{fontSize: 31, fontWeight: 950, color: '#7c3aed'}}>ANSWER</div>
        <div
          style={{
            fontSize: 93,
            fontWeight: 1000,
            lineHeight: 1,
            marginTop: 28,
            transform: `scale(${0.86 + pop * 0.14})`,
          }}
        >
          SageMaker
          <br />
          <span style={{color: '#7c3aed'}}>Clarify</span>
        </div>
        <div
          style={{
            margin: '72px auto 0',
            maxWidth: 830,
            borderRadius: 34,
            background: '#f5f3ff',
            border: '3px solid rgba(124,58,237,.18)',
            padding: '34px 36px',
            fontSize: 38,
            fontWeight: 950,
            lineHeight: 1.34,
          }}
        >
          Bias detection <span style={{color: '#7c3aed'}}>+</span> model explainability
        </div>
      </div>
    </AbsoluteFill>
  );
};

const ExplainScene: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const features = [
    {name: 'Debt ratio', value: 0.93, color: '#7c3aed'},
    {name: 'Credit history', value: 0.76, color: '#0369a1'},
    {name: 'Income', value: 0.53, color: '#047857'},
  ];
  return (
    <AbsoluteFill style={{opacity: fade(frame, duration)}}>
      <Header />
      <div style={{...SAFE, top: 182}}>
        <div style={{fontSize: 30, fontWeight: 950, color: '#7c3aed'}}>EXPLAIN A PREDICTION</div>
        <div style={{fontSize: 64, fontWeight: 1000, marginTop: 15, lineHeight: 1.05}}>
          Why was this loan
          <br />
          <span style={{color: COLORS.red}}>rejected?</span>
        </div>
        <div
          style={{
            marginTop: 44,
            borderRadius: 32,
            background: '#fff1f2',
            border: '3px solid rgba(190,18,60,.16)',
            padding: '25px 32px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{fontSize: 32, fontWeight: 900}}>Loan application</div>
          <div style={{fontSize: 35, fontWeight: 1000, color: COLORS.red}}>REJECTED</div>
        </div>

        <div style={{marginTop: 54}}>
          {features.map((item, i) => {
            const progress = spring({frame: frame - 12 - i * 7, fps: FPS, config: {damping: 16, stiffness: 105}});
            return (
              <div key={item.name} style={{marginBottom: 31}}>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 31, fontWeight: 900}}>
                  <span>{item.name}</span>
                  <span style={{color: item.color}}>{Math.round(item.value * 100)}%</span>
                </div>
                <div style={{height: 24, borderRadius: 999, background: '#e2e8f0', marginTop: 12, overflow: 'hidden'}}>
                  <div
                    style={{
                      height: '100%',
                      width: `${item.value * progress * 100}%`,
                      borderRadius: 999,
                      background: item.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            marginTop: 30,
            background: '#eff6ff',
            border: '2px solid rgba(3,105,161,.16)',
            borderRadius: 28,
            padding: '26px 30px',
            fontSize: 34,
            fontWeight: 900,
            color: COLORS.cyan,
            textAlign: 'center',
          }}
        >
          Clarify helps show which features pushed the prediction.
        </div>
      </div>
    </AbsoluteFill>
  );
};

const BiasScene: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const pop = spring({frame, fps: FPS, config: {damping: 15, stiffness: 110}});
  return (
    <AbsoluteFill style={{opacity: fade(frame, duration)}}>
      <Header />
      <div style={{...SAFE, top: 185}}>
        <div style={{fontSize: 30, fontWeight: 950, color: '#7c3aed'}}>BIAS ANALYSIS</div>
        <div style={{fontSize: 64, fontWeight: 1000, marginTop: 16, lineHeight: 1.05}}>
          Are different groups
          <br />
          receiving different outcomes?
        </div>
      </div>
      <ThreeStage top={690} height={650}>
        <Balance3D />
      </ThreeStage>
      <div
        style={{
          position: 'absolute',
          left: 118,
          right: 118,
          top: 1455,
          borderRadius: 32,
          background: '#f5f3ff',
          border: '3px solid rgba(124,58,237,.18)',
          padding: '30px 34px',
          textAlign: 'center',
          fontSize: 37,
          fontWeight: 950,
          transform: `scale(${0.94 + pop * 0.06})`,
        }}
      >
        Clarify can help analyze <span style={{color: '#7c3aed'}}>systematic differences</span> in outcomes.
      </div>
    </AbsoluteFill>
  );
};

const CompareScene: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const p = spring({frame, fps: FPS, config: {damping: 15, stiffness: 110}});
  return (
    <AbsoluteFill style={{opacity: fade(frame, duration)}}>
      <Header />
      <div style={{...SAFE, top: 190}}>
        <div style={{fontSize: 30, fontWeight: 950, color: COLORS.red}}>DON'T CONFUSE THEM</div>
        <div style={{fontSize: 64, fontWeight: 1000, marginTop: 18, lineHeight: 1.04}}>
          Clarify vs
          <br />
          Model Monitor
        </div>

        <div style={{marginTop: 65, display: 'flex', flexDirection: 'column', gap: 28}}>
          <div
            style={{
              borderRadius: 34,
              background: '#f5f3ff',
              border: '3px solid rgba(124,58,237,.20)',
              padding: '34px 38px',
              transform: `translateX(${(1 - p) * -35}px)`,
            }}
          >
            <div style={{fontSize: 34, fontWeight: 1000, color: '#7c3aed'}}>SAGEMAKER CLARIFY</div>
            <div style={{fontSize: 38, fontWeight: 900, marginTop: 14, lineHeight: 1.3}}>
              Bias detection
              <br />
              <span style={{color: COLORS.muted}}>Explain why a prediction happened</span>
            </div>
          </div>
          <div
            style={{
              borderRadius: 34,
              background: '#ecfdf5',
              border: '3px solid rgba(4,120,87,.20)',
              padding: '34px 38px',
              transform: `translateX(${(1 - p) * 35}px)`,
            }}
          >
            <div style={{fontSize: 34, fontWeight: 1000, color: COLORS.green}}>MODEL MONITOR</div>
            <div style={{fontSize: 38, fontWeight: 900, marginTop: 14, lineHeight: 1.3}}>
              Production monitoring
              <br />
              <span style={{color: COLORS.muted}}>Data drift and model quality changes</span>
            </div>
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
      <Header accent="#7c3aed" />
      <div style={{...SAFE, top: 220, textAlign: 'center'}}>
        <div style={{fontSize: 30, fontWeight: 950, color: '#7c3aed'}}>EXAM MEMORY</div>
        <div style={{fontSize: 75, fontWeight: 1000, marginTop: 25, lineHeight: 1.03}}>
          Remember the
          <br />
          <span style={{color: '#7c3aed'}}>question being asked</span>
        </div>

        <div style={{marginTop: 78, display: 'flex', flexDirection: 'column', gap: 26}}>
          <div
            style={{
              background: '#f5f3ff',
              border: '3px solid rgba(124,58,237,.20)',
              borderRadius: 32,
              padding: '31px 34px',
              fontSize: 39,
              fontWeight: 950,
              lineHeight: 1.3,
              transform: `scale(${0.95 + pop * 0.05})`,
            }}
          >
            Bias or explainability
            <br />
            <span style={{color: '#7c3aed'}}>→ CLARIFY</span>
          </div>
          <div
            style={{
              background: '#ecfdf5',
              border: '3px solid rgba(4,120,87,.20)',
              borderRadius: 32,
              padding: '31px 34px',
              fontSize: 39,
              fontWeight: 950,
              lineHeight: 1.3,
              transform: `scale(${0.95 + pop * 0.05})`,
            }}
          >
            Production drift or monitoring
            <br />
            <span style={{color: COLORS.green}}>→ MODEL MONITOR</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const AwsMlQ08Clarify: React.FC = () => {
  const hookEnd = f(6.57);
  const goalsEnd = f(16.02);
  const answerEnd = f(21.52);
  const explainEnd = f(36.94);
  const biasEnd = f(45.47);
  const compareEnd = f(53.90);
  const total = 1939;

  return (
    <AbsoluteFill style={{fontFamily: FONT_FAMILY, color: COLORS.text}}>
      <Background />
      <Audio src={staticFile('audio/q08-clarify.mp3')} />

      <Sequence from={0} durationInFrames={hookEnd}>
        <HookScene duration={hookEnd} />
      </Sequence>

      <Sequence from={hookEnd} durationInFrames={goalsEnd - hookEnd}>
        <GoalsScene duration={goalsEnd - hookEnd} />
      </Sequence>

      <Sequence from={goalsEnd} durationInFrames={answerEnd - goalsEnd}>
        <AnswerScene duration={answerEnd - goalsEnd} />
      </Sequence>

      <Sequence from={answerEnd} durationInFrames={explainEnd - answerEnd}>
        <ExplainScene duration={explainEnd - answerEnd} />
      </Sequence>

      <Sequence from={explainEnd} durationInFrames={biasEnd - explainEnd}>
        <BiasScene duration={biasEnd - explainEnd} />
      </Sequence>

      <Sequence from={biasEnd} durationInFrames={compareEnd - biasEnd}>
        <CompareScene duration={compareEnd - biasEnd} />
      </Sequence>

      <Sequence from={compareEnd} durationInFrames={total - compareEnd}>
        <FinalScene duration={total - compareEnd} />
      </Sequence>
    </AbsoluteFill>
  );
};
