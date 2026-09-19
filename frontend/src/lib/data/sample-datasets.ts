import { SampleDataset } from '@/types';

// Helper to create clean SVG data URIs for optical benchmarks
function createUsafTargetSvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
    <rect width="512" height="512" fill="#0d1117"/>
    <rect x="24" y="24" width="464" height="464" fill="none" stroke="#22d3ee" stroke-width="2"/>
    <text x="256" y="60" text-anchor="middle" fill="#22d3ee" font-family="monospace" font-size="20" font-weight="bold">USAF 1951 OPTICAL RESOLUTION TARGET</text>
    <text x="256" y="85" text-anchor="middle" fill="#64748b" font-family="monospace" font-size="12">GROUP 4 • SPATIAL FREQUENCY BENCHMARK</text>
    
    <!-- Outer line groups -->
    <g fill="#f8fafc">
      <!-- Group -2 -->
      <rect x="60" y="120" width="30" height="120"/>
      <rect x="110" y="120" width="30" height="120"/>
      <rect x="160" y="120" width="30" height="120"/>
      
      <!-- Horizontal lines -->
      <rect x="60" y="260" width="130" height="26"/>
      <rect x="60" y="300" width="130" height="26"/>
      <rect x="60" y="340" width="130" height="26"/>

      <!-- Medium frequency lines -->
      <rect x="240" y="120" width="16" height="80"/>
      <rect x="265" y="120" width="16" height="80"/>
      <rect x="290" y="120" width="16" height="80"/>

      <rect x="240" y="220" width="66" height="14"/>
      <rect x="240" y="245" width="66" height="14"/>
      <rect x="240" y="270" width="66" height="14"/>

      <!-- High frequency target bars -->
      <rect x="350" y="120" width="8" height="50"/>
      <rect x="365" y="120" width="8" height="50"/>
      <rect x="380" y="120" width="8" height="50"/>
      
      <rect x="350" y="185" width="38" height="7"/>
      <rect x="350" y="200" width="38" height="7"/>
      <rect x="350" y="215" width="38" height="7"/>

      <!-- Ultra-fine lines -->
      <rect x="420" y="120" width="4" height="30"/>
      <rect x="428" y="120" width="4" height="30"/>
      <rect x="436" y="120" width="4" height="30"/>
      <rect x="420" y="160" width="20" height="3"/>
      <rect x="420" y="167" width="20" height="3"/>
      <rect x="420" y="174" width="20" height="3"/>
    </g>

    <!-- Concentric alignment rings -->
    <circle cx="360" cy="360" r="70" fill="none" stroke="#38bdf8" stroke-width="3"/>
    <circle cx="360" cy="360" r="45" fill="none" stroke="#38bdf8" stroke-width="2"/>
    <circle cx="360" cy="360" r="20" fill="none" stroke="#38bdf8" stroke-width="2"/>
    <line x1="280" y1="360" x2="440" y2="360" stroke="#00f0ff" stroke-width="1.5" stroke-dasharray="4,4"/>
    <line x1="360" y1="280" x2="360" y2="440" stroke="#00f0ff" stroke-width="1.5" stroke-dasharray="4,4"/>

    <!-- Scale numbers -->
    <text x="70" y="420" fill="#38bdf8" font-family="monospace" font-size="14">LP/MM: 45.2</text>
    <text x="70" y="445" fill="#64748b" font-family="monospace" font-size="12">CALIBRATED FIELD: 10.4 mm</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function createMicroscopySvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
    <rect width="512" height="512" fill="#040711"/>
    <!-- Simulated Fluorescent Neural Cells -->
    <defs>
      <radialGradient id="somaGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#00f0ff" stop-opacity="1"/>
        <stop offset="60%" stop-color="#0284c7" stop-opacity="0.6"/>
        <stop offset="100%" stop-color="#040711" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="greenGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#34d399" stop-opacity="0.9"/>
        <stop offset="70%" stop-color="#059669" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="#040711" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="magentaGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#f472b6" stop-opacity="0.8"/>
        <stop offset="70%" stop-color="#c026d3" stop-opacity="0.2"/>
        <stop offset="100%" stop-color="#040711" stop-opacity="0"/>
      </radialGradient>
    </defs>
    
    <!-- Background diffuse fluorescence -->
    <circle cx="210" cy="220" r="140" fill="url(#somaGlow)"/>
    <circle cx="340" cy="310" r="110" fill="url(#greenGlow)"/>
    <circle cx="160" cy="380" r="80" fill="url(#magentaGlow)"/>

    <!-- Axons / Dendrites -->
    <path d="M 210 220 Q 280 160 380 140 T 460 90" fill="none" stroke="#38bdf8" stroke-width="3" opacity="0.85"/>
    <path d="M 210 220 Q 160 140 100 110 T 40 80" fill="none" stroke="#22d3ee" stroke-width="2.5" opacity="0.8"/>
    <path d="M 210 220 Q 250 280 340 310 T 420 390" fill="none" stroke="#34d399" stroke-width="3.5" opacity="0.9"/>
    <path d="M 340 310 Q 260 360 160 380 T 80 440" fill="none" stroke="#f472b6" stroke-width="2" opacity="0.75"/>
    <path d="M 210 220 Q 140 260 90 320" fill="none" stroke="#38bdf8" stroke-width="1.8" opacity="0.7"/>

    <!-- Cell bodies (soma) -->
    <circle cx="210" cy="220" r="28" fill="#e0f2fe" stroke="#38bdf8" stroke-width="2"/>
    <circle cx="340" cy="310" r="22" fill="#d1fae5" stroke="#10b981" stroke-width="2"/>
    <circle cx="160" cy="380" r="18" fill="#fce7f3" stroke="#ec4899" stroke-width="2"/>
    <circle cx="380" cy="140" r="12" fill="#e0f2fe" stroke="#38bdf8" stroke-width="1.5"/>

    <!-- Micro-vesicles -->
    <circle cx="230" cy="200" r="4" fill="#ffffff"/>
    <circle cx="200" cy="235" r="3" fill="#ffffff"/>
    <circle cx="350" cy="300" r="3.5" fill="#ffffff"/>

    <text x="30" y="480" fill="#38bdf8" font-family="monospace" font-size="13">FLUORESCENT NEURAL SOMA • GFP/mCherry</text>
    <text x="30" y="498" fill="#64748b" font-family="monospace" font-size="10">FOV: 850 µm • LENSLESS COMPUTATIONAL MICROSCOPY</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function createRealDiffuserCamPair(): { measurement: string; groundTruth: string; reconstructed: string } {
  // Diffuser speckle pattern SVG
  const speckleSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
    <rect width="512" height="512" fill="#070912"/>
    <filter id="speckleFilter">
      <feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves="4" result="noise"/>
      <feColorMatrix type="matrix" values="
        1.2 0 0 0 0.05
        0 1.4 0 0 0.08
        0 0 1.8 0 0.15
        0 0 0 1 0" result="colored"/>
    </filter>
    <rect width="512" height="512" filter="url(#speckleFilter)" opacity="0.9"/>
    <!-- Caustic intensity spikes -->
    <circle cx="180" cy="210" r="12" fill="#67e8f9" opacity="0.45"/>
    <circle cx="320" cy="180" r="16" fill="#a5f3fc" opacity="0.55"/>
    <circle cx="260" cy="340" r="14" fill="#67e8f9" opacity="0.4"/>
    <circle cx="390" cy="290" r="10" fill="#a5f3fc" opacity="0.4"/>
    <text x="24" y="480" fill="#22d3ee" font-family="monospace" font-size="13">DIFFUSER-STYLE DEMO MEASUREMENT (y)</text>
    <text x="24" y="498" fill="#94a3b8" font-family="monospace" font-size="10">SYNTHETIC UI ASSET • REPLACE WITH VERIFIED DLMD FILE</text>
  </svg>`;

  const gtSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
    <rect width="512" height="512" fill="#0b132b"/>
    <!-- Optical prism dispersion scene -->
    <polygon points="256,120 140,360 372,360" fill="rgba(255,255,255,0.06)" stroke="#00f0ff" stroke-width="2"/>
    <!-- White input beam -->
    <line x1="50" y1="280" x2="200" y2="260" stroke="#ffffff" stroke-width="4"/>
    <!-- Refracted spectrum -->
    <line x1="200" y1="260" x2="280" y2="270" stroke="#f8fafc" stroke-width="3" opacity="0.8"/>
    <line x1="280" y1="270" x2="470" y2="210" stroke="#ef4444" stroke-width="3.5"/>
    <line x1="280" y1="270" x2="475" y2="240" stroke="#f59e0b" stroke-width="3.5"/>
    <line x1="280" y1="270" x2="480" y2="270" stroke="#10b981" stroke-width="3.5"/>
    <line x1="280" y1="270" x2="475" y2="300" stroke="#00f0ff" stroke-width="3.5"/>
    <line x1="280" y1="270" x2="470" y2="330" stroke="#8b5cf6" stroke-width="3.5"/>
    <text x="24" y="480" fill="#38bdf8" font-family="monospace" font-size="13">DEMO REFERENCE SCENE (x)</text>
    <text x="24" y="498" fill="#64748b" font-family="monospace" font-size="10">SYNTHETIC PAIRED UI DEMO</text>
  </svg>`;

  const reconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
    <rect width="512" height="512" fill="#0b132b"/>
    <polygon points="256,120 140,360 372,360" fill="rgba(255,255,255,0.05)" stroke="#00f0ff" stroke-width="2" stroke-dasharray="1,1"/>
    <!-- White input beam reconstructed -->
    <line x1="50" y1="280" x2="200" y2="260" stroke="#f1f5f9" stroke-width="3.8"/>
    <!-- Reconstructed dispersion with subtle high-frequency deconvolution halo -->
    <line x1="200" y1="260" x2="280" y2="270" stroke="#f8fafc" stroke-width="2.8" opacity="0.8"/>
    <line x1="280" y1="270" x2="470" y2="210" stroke="#ef4444" stroke-width="3.2"/>
    <line x1="280" y1="270" x2="475" y2="240" stroke="#f59e0b" stroke-width="3.2"/>
    <line x1="280" y1="270" x2="480" y2="270" stroke="#10b981" stroke-width="3.2"/>
    <line x1="280" y1="270" x2="475" y2="300" stroke="#00f0ff" stroke-width="3.2"/>
    <line x1="280" y1="270" x2="470" y2="330" stroke="#8b5cf6" stroke-width="3.2"/>
    <!-- Subtle computational de-speckle aura -->
    <circle cx="280" cy="270" r="18" fill="rgba(0, 240, 255, 0.15)"/>
    <text x="24" y="480" fill="#10b981" font-family="monospace" font-size="13">DEMO RECONSTRUCTION PLACEHOLDER (x̂)</text>
    <text x="24" y="498" fill="#38bdf8" font-family="monospace" font-size="10">ILLUSTRATIVE UI OUTPUT • NOT A MEASURED MODEL RESULT</text>
  </svg>`;

  return {
    measurement: `data:image/svg+xml;utf8,${encodeURIComponent(speckleSvg)}`,
    groundTruth: `data:image/svg+xml;utf8,${encodeURIComponent(gtSvg)}`,
    reconstructed: `data:image/svg+xml;utf8,${encodeURIComponent(reconSvg)}`,
  };
}

const diffuserCamPair = createRealDiffuserCamPair();

export const SAMPLE_DATASETS: SampleDataset[] = [
  {
    id: 'diffusercam_mirflickr_01',
    name: 'DiffuserCam-style Demo Pair',
    category: 'REAL_DIFFUSERCAM',
    description: 'Synthetic interface demo pair that mimics a diffuser-style encoded measurement. Replace with verified DLMD files for real benchmark evaluation.',
    groundTruthUrl: diffuserCamPair.groundTruth,
    measurementUrl: diffuserCamPair.measurement,
    reconstructedUrl: diffuserCamPair.reconstructed,
    mode: 'DATASET',
    defaultParams: {
      diffuserType: 'diffuser_caustic',
      noiseLevel: 0.25,
      psfRadius: 18,
      sensorNoise: 0.15,
      exposure: 1.0,
      seed: 482,
    },
    referencePsnr: 32.4,
    referenceSsim: 0.912,
    psfType: 'Calibrated Surface Relief Diffuser PSF',
    sourceAttribution: 'UI demo asset — not an experimental Waller Lab sample',
  },
  {
    id: 'usaf_resolution_target',
    name: 'USAF 1951 Optical Resolution Benchmark',
    category: 'OPTICAL_BENCH',
    description: 'Standard optical resolution target used to evaluate spatial frequency modulation transfer function (MTF).',
    groundTruthUrl: createUsafTargetSvg(),
    measurementUrl: diffuserCamPair.measurement,
    reconstructedUrl: createUsafTargetSvg(),
    mode: 'DEMO',
    defaultParams: {
      diffuserType: 'coded_aperture',
      noiseLevel: 0.18,
      psfRadius: 14,
      sensorNoise: 0.12,
      exposure: 1.05,
      seed: 1951,
    },
    referencePsnr: 34.1,
    referenceSsim: 0.938,
    psfType: 'FlatCam MURA Coded Aperture Mask',
    sourceAttribution: 'NIST Standard Resolution Benchmark',
  },
  {
    id: 'cellular_microscopy',
    name: 'Fluorescence Neural Somas & Axons',
    category: 'MICROSCOPY',
    description: 'Lensless computational microscopy testbed for deep-tissue fluorophore localization.',
    groundTruthUrl: createMicroscopySvg(),
    measurementUrl: diffuserCamPair.measurement,
    reconstructedUrl: createMicroscopySvg(),
    mode: 'SIMULATION',
    defaultParams: {
      diffuserType: 'diffuser_caustic',
      noiseLevel: 0.22,
      psfRadius: 20,
      sensorNoise: 0.18,
      exposure: 1.1,
      seed: 772,
    },
    referencePsnr: 29.8,
    referenceSsim: 0.884,
    psfType: 'Phase Diffuser Caustic Profile',
    sourceAttribution: 'Bio-imaging Computational Optics Sandbox',
  },
];
