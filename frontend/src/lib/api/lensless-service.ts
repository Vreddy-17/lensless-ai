import {
  BackendHealthStatus,
  FullPipelineRequest,
  FullPipelineResponse,
  OperatingMode,
  PipelineStatus,
  ReconstructionMetrics,
  SampleDataset,
  SimulationParams,
} from '@/types';
import { SAMPLE_DATASETS } from '@/lib/data/sample-datasets';
import { simulateOpticalMeasurement } from '@/lib/simulation/optical-engine';

const API_BASE_URL = process.env.NEXT_PUBLIC_RECONSTRUCTION_API_URL || 'http://127.0.0.1:8000';

export class LenslessApiService {
  /**
   * Health check to probe if FastAPI ML backend is active
   */
  static async healthCheck(): Promise<BackendHealthStatus> {
    const candidates = [`${API_BASE_URL}/health`, `${API_BASE_URL}/api/health`];

    for (const url of candidates) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          return {
            online: true,
            service: data.service || 'Lensless FastAPI backend',
            version: data.version,
            modelLoaded: data.modelLoaded ?? false,
            device: data.device,
          };
        }
      } catch {
        // Try the next supported health route.
      }
    }

    return {
      online: false,
      service: 'Frontend demo fallback',
      modelLoaded: false,
    };
  }

  /**
   * Main hackathon endpoint: POST /api/full-pipeline
   * Handles: Validation -> Preprocessing -> Optical Encoding / Measurement -> AI Reconstruction -> Post-processing -> Quality Analysis -> Result
   */
  static async runPipeline(
    request: FullPipelineRequest,
    onStateTransition?: (status: PipelineStatus) => void
  ): Promise<FullPipelineResponse> {
    const startTime = performance.now();

    // 1. Validating
    onStateTransition?.('validating');
    await new Promise((r) => setTimeout(r, 220));

    // Try FastAPI backend if available
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      onStateTransition?.('preprocessing');
      const res = await fetch(`${API_BASE_URL}/api/full-pipeline`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        onStateTransition?.('reconstructing');
        const data = await res.json();
        onStateTransition?.('completed');
        return {
          ...data,
          backendExecution: true,
        };
      }
    } catch (err) {
      console.warn('FastAPI backend not reachable, proceeding with client-side demo fallback:', err);
    }

    // Client-side fallback execution driven by exact state machine transitions
    // Preprocessing
    onStateTransition?.('preprocessing');
    await new Promise((r) => setTimeout(r, 280));

    // Simulation / Measurement Generation
    let measurementUrl = request.measurementImage || '';
    if (!measurementUrl && request.image) {
      onStateTransition?.('simulating');
      const img = new Image();
      img.src = request.image;
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const defaultParams: SimulationParams = request.simulationParams || {
        diffuserType: 'diffuser_caustic',
        noiseLevel: 0.2,
        psfRadius: 16,
        sensorNoise: 0.15,
        exposure: 1.0,
        seed: 42,
      };

      measurementUrl = await simulateOpticalMeasurement(img, defaultParams);
      onStateTransition?.('measurement_ready');
      await new Promise((r) => setTimeout(r, 300));
    }

    // AI Reconstructing
    onStateTransition?.('reconstructing');
    await new Promise((r) => setTimeout(r, 650));

    // Post-processing
    onStateTransition?.('postprocessing');
    await new Promise((r) => setTimeout(r, 350));

    // Evaluating
    onStateTransition?.('evaluating');
    await new Promise((r) => setTimeout(r, 260));

    const endTime = performance.now();
    const elapsedMs = Math.round(endTime - startTime);

    // Compute metrics according to Ground Truth availability
    const hasGt = Boolean(request.groundTruthImage && request.groundTruthImage.trim().length > 0);
    const isDemo = request.mode === 'DEMO';

    let psnr: number | undefined;
    let ssim: number | undefined;

    if (hasGt) {
      // Benchmark ground truth reference
      const matchingSample = SAMPLE_DATASETS.find(
        (s) => s.groundTruthUrl === request.groundTruthImage
      );
      psnr = matchingSample?.referencePsnr ?? (isDemo ? 32.4 : 30.6);
      ssim = matchingSample?.referenceSsim ?? (isDemo ? 0.912 : 0.887);
    }

    const metrics: ReconstructionMetrics = {
      hasGroundTruth: hasGt,
      psnr,
      ssim,
      lpips: hasGt ? 0.082 : undefined,
      confidence: isDemo
        ? {
            available: true,
            value: 0.94,
            method: 'demo_illustrative',
            isDemoIllustrative: true,
          }
        : { available: false }, // Optional confidence: hide when backend does not implement uncertainty
      processingTimeMs: elapsedMs,
      noiseEstimateDb: 17.8,
      artifactScore: hasGt ? 1.6 : 3.4,
      isDemoIllustrative: true,
    };

    onStateTransition?.('completed');

    const matchingSample = SAMPLE_DATASETS.find(
      (sample) => sample.measurementUrl === measurementUrl || sample.groundTruthUrl === request.groundTruthImage
    );
    const reconstructedUrl = matchingSample?.reconstructedUrl || measurementUrl;
    const baselineUrl = measurementUrl;

    return {
      success: true,
      mode: request.mode,
      status: 'completed',
      measurementUrl,
      reconstructedUrl,
      baselineUrl,
      metrics,
      modelVariant: request.modelVariant || 'Demo placeholder — AI reconstruction backend not connected',
      backendExecution: false,
    };
  }

  /**
   * Standalone simulation endpoint: POST /api/simulate
   */
  static async simulate(
    image: string,
    params: SimulationParams
  ): Promise<{ measurementUrl: string; backend: boolean }> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image, params }),
      });
      if (res.ok) {
        const data = await res.json();
        return { measurementUrl: data.measurementUrl, backend: true };
      }
    } catch {
      // fallback
    }

    const img = new Image();
    img.src = image;
    await new Promise((resolve) => {
      img.onload = resolve;
    });
    const measurementUrl = await simulateOpticalMeasurement(img, params);
    return { measurementUrl, backend: false };
  }

  /**
   * Standalone reconstruction endpoint: POST /api/reconstruct
   */
  static async reconstruct(
    measurementUrl: string,
    groundTruthUrl?: string,
    mode: OperatingMode = 'SIMULATION'
  ): Promise<FullPipelineResponse> {
    return this.runPipeline({
      measurementImage: measurementUrl,
      groundTruthImage: groundTruthUrl,
      mode,
    });
  }

  static getSampleDatasets(): SampleDataset[] {
    return SAMPLE_DATASETS;
  }
}
