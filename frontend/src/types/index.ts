export type OperatingMode = 'DATASET' | 'SIMULATION' | 'RAW_MEASUREMENT' | 'DEMO';

export type PipelineStatus =
  | 'idle'
  | 'uploading'
  | 'validating'
  | 'preprocessing'
  | 'simulating'
  | 'measurement_ready'
  | 'reconstructing'
  | 'postprocessing'
  | 'evaluating'
  | 'completed'
  | 'error';

export type DiffuserType = 'diffuser_caustic' | 'coded_aperture' | 'gaussian_psf' | 'random_phase';

export interface SimulationParams {
  diffuserType: DiffuserType;
  noiseLevel: number; // 0 to 1
  psfRadius: number; // 2 to 32
  sensorNoise: number; // 0 to 1
  exposure: number; // 0.2 to 2.0
  seed: number;
}

export interface MetricConfidence {
  available: boolean;
  value?: number; // 0 to 1
  method?: string; // e.g., 'mc_dropout', 'ensemble', 'demo_illustrative'
  isDemoIllustrative?: boolean;
}

export interface ReconstructionMetrics {
  hasGroundTruth: boolean;
  psnr?: number; // dB (only when ground truth is available)
  ssim?: number; // 0 to 1 (only when ground truth is available)
  lpips?: number; // Learned Perceptual Image Patch Similarity (optional)
  confidence?: MetricConfidence;
  processingTimeMs: number;
  noiseEstimateDb?: number;
  artifactScore?: number; // 0 to 10
  isDemoIllustrative?: boolean;
}

export interface SampleDataset {
  id: string;
  name: string;
  category: 'REAL_DIFFUSERCAM' | 'OPTICAL_BENCH' | 'MICROSCOPY';
  description: string;
  groundTruthUrl?: string; // undefined in raw measurement samples
  measurementUrl: string;
  reconstructedUrl: string;
  baselineUrl?: string;
  mode: OperatingMode;
  defaultParams: SimulationParams;
  referencePsnr?: number;
  referenceSsim?: number;
  psfType: string;
  sourceAttribution?: string;
}

export interface ExperimentRecord {
  id: string;
  timestamp: string;
  title: string;
  mode: OperatingMode;
  inputSource: 'dataset' | 'simulation' | 'webcam' | 'raw_measurement';
  hasGroundTruth: boolean;
  psnr?: number;
  ssim?: number;
  confidenceValue?: number;
  processingTimeMs: number;
  thumbnailUrl: string;
  reconstructedUrl: string;
  measurementUrl: string;
  modelVariant: string;
  isDemoIllustrative?: boolean;
}

export interface BackendHealthStatus {
  online: boolean;
  service: string;
  version?: string;
  modelLoaded?: boolean;
  device?: string; // 'cuda' | 'cpu' | 'mps'
}

export interface FullPipelineRequest {
  image?: string; // base64 / data URL
  measurementImage?: string; // for dataset or raw measurement
  groundTruthImage?: string; // optional paired ground truth
  mode: OperatingMode;
  simulationParams?: SimulationParams;
  modelVariant?: string;
}

export interface FullPipelineResponse {
  success: boolean;
  mode: OperatingMode;
  status: PipelineStatus;
  measurementUrl: string;
  reconstructedUrl: string;
  baselineUrl?: string;
  metrics: ReconstructionMetrics;
  modelVariant: string;
  backendExecution: boolean;
  errorMessage?: string;
}
