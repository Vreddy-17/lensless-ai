'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { ArrowRight, Play, RefreshCw, Server, WifiOff } from 'lucide-react';
import {
  BackendHealthStatus,
  ExperimentRecord,
  OperatingMode,
  PipelineStatus,
  ReconstructionMetrics,
  SampleDataset,
  SimulationParams,
} from '@/types';
import { LenslessApiService } from '@/lib/api/lensless-service';
import { SAMPLE_DATASETS } from '@/lib/data/sample-datasets';
import { InputSourceSelector } from './InputSourceSelector';
import { OpticalSimulationControls } from './OpticalSimulationControls';
import { PipelineFlowBar } from './PipelineFlowBar';
import { ProcessingAnimation } from './ProcessingAnimation';
import { ImageComparisonViewer } from './ImageComparisonViewer';
import { QualityMetricsGrid } from './QualityMetricsGrid';
import { BaselineVsAiComparison } from './BaselineVsAiComparison';
import { ExperimentHistory } from './ExperimentHistory';

interface ReconstructionLabProps { initialDemoTrigger?: boolean; }

export const ReconstructionLab: React.FC<ReconstructionLabProps> = ({ initialDemoTrigger = false }) => {
  const initial = SAMPLE_DATASETS[0];
  const [mode, setMode] = useState<OperatingMode>('DATASET');
  const [backendStatus, setBackendStatus] = useState<BackendHealthStatus>({ online: false, service: 'Checking backend' });
  const [status, setStatus] = useState<PipelineStatus>('idle');
  const [selectedSample, setSelectedSample] = useState<SampleDataset | null>(initial);
  const [originalSceneUrl, setOriginalSceneUrl] = useState<string | null>(initial.groundTruthUrl || null);
  const [measurementUrl, setMeasurementUrl] = useState<string | null>(initial.measurementUrl || null);
  const [reconstructedUrl, setReconstructedUrl] = useState<string | null>(null);
  const [baselineUrl, setBaselineUrl] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<ReconstructionMetrics | null>(null);
  const [hasGroundTruth, setHasGroundTruth] = useState(Boolean(initial.groundTruthUrl));
  const [simParams, setSimParams] = useState<SimulationParams>(initial.defaultParams);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isBackendExecution, setIsBackendExecution] = useState(false);
  const [currentExp, setCurrentExp] = useState<ExperimentRecord | null>(null);

  useEffect(() => { LenslessApiService.healthCheck().then(setBackendStatus); }, []);

  const resetOutputs = () => {
    setReconstructedUrl(null);
    setBaselineUrl(null);
    setMetrics(null);
  };

  const handleSelectSample = (sample: SampleDataset) => {
    setSelectedSample(sample);
    setMode(sample.mode);
    setOriginalSceneUrl(sample.groundTruthUrl || null);
    setMeasurementUrl(sample.measurementUrl || null);
    setHasGroundTruth(Boolean(sample.groundTruthUrl));
    setSimParams(sample.defaultParams);
    resetOutputs();
    setStatus('idle');
  };

  const handleCustomImageLoaded = (dataUrl: string, gtAvailable: boolean, measUrl?: string) => {
    setSelectedSample(null);
    setHasGroundTruth(gtAvailable);
    resetOutputs();
    if (gtAvailable) {
      setOriginalSceneUrl(dataUrl);
      setMeasurementUrl(measUrl || null);
      setStatus('idle');
    } else {
      setOriginalSceneUrl(null);
      setMeasurementUrl(dataUrl);
      setStatus('measurement_ready');
    }
  };

  const handleSimulateForwardModel = async () => {
    if (!originalSceneUrl) return;
    setIsSimulating(true);
    setStatus('simulating');
    try {
      const res = await LenslessApiService.simulate(originalSceneUrl, simParams);
      setMeasurementUrl(res.measurementUrl);
      setStatus('measurement_ready');
    } catch (error) {
      console.error(error);
      setStatus('error');
    } finally {
      setIsSimulating(false);
    }
  };

  const saveExperiment = (res: Awaited<ReturnType<typeof LenslessApiService.runPipeline>>) => {
    setCurrentExp({
      id: `exp_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title: selectedSample?.name || (hasGroundTruth ? 'Custom scene simulation' : 'Raw measurement reconstruction'),
      mode,
      inputSource: selectedSample ? 'dataset' : hasGroundTruth ? 'simulation' : 'raw_measurement',
      hasGroundTruth,
      psnr: res.metrics.psnr,
      ssim: res.metrics.ssim,
      processingTimeMs: res.metrics.processingTimeMs,
      thumbnailUrl: res.reconstructedUrl,
      reconstructedUrl: res.reconstructedUrl,
      measurementUrl: res.measurementUrl,
      modelVariant: res.modelVariant,
      isDemoIllustrative: res.metrics.isDemoIllustrative,
    });
  };

  const handleRunReconstruction = async () => {
    setStatus('uploading');
    try {
      const res = await LenslessApiService.runPipeline(
        {
          image: originalSceneUrl || undefined,
          measurementImage: measurementUrl || undefined,
          groundTruthImage: hasGroundTruth ? originalSceneUrl || undefined : undefined,
          mode,
          simulationParams: simParams,
        },
        setStatus
      );
      setMeasurementUrl(res.measurementUrl);
      setReconstructedUrl(res.reconstructedUrl);
      setBaselineUrl(res.baselineUrl || res.reconstructedUrl);
      setMetrics(res.metrics);
      setIsBackendExecution(res.backendExecution);
      setStatus('completed');
      saveExperiment(res);
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  const handleLaunchDemo = useCallback(async () => {
    const sample = SAMPLE_DATASETS[0];
    setMode('DEMO');
    setSelectedSample(sample);
    setOriginalSceneUrl(sample.groundTruthUrl || null);
    setMeasurementUrl(sample.measurementUrl || null);
    setHasGroundTruth(Boolean(sample.groundTruthUrl));
    setSimParams(sample.defaultParams);
    resetOutputs();
    setStatus('uploading');
    try {
      const res = await LenslessApiService.runPipeline(
        { measurementImage: sample.measurementUrl, groundTruthImage: sample.groundTruthUrl, mode: 'DEMO' },
        setStatus
      );
      setMeasurementUrl(res.measurementUrl);
      setReconstructedUrl(res.reconstructedUrl);
      setBaselineUrl(res.baselineUrl || res.reconstructedUrl);
      setMetrics(res.metrics);
      setIsBackendExecution(res.backendExecution);
      setStatus('completed');
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    if (!initialDemoTrigger) return;
    const timer = window.setTimeout(() => { void handleLaunchDemo(); }, 0);
    return () => window.clearTimeout(timer);
  }, [initialDemoTrigger, handleLaunchDemo]);

  const handleLoadExperiment = (exp: ExperimentRecord) => {
    setMode(exp.mode);
    setMeasurementUrl(exp.measurementUrl);
    setReconstructedUrl(exp.reconstructedUrl);
    setBaselineUrl(exp.reconstructedUrl);
    setHasGroundTruth(exp.hasGroundTruth);
    setStatus('completed');
  };

  const isProcessing = !['idle', 'completed', 'error', 'measurement_ready'].includes(status);

  return (
    <section id="lab" className="section-shell">
      <div className="grid lg:grid-cols-[160px_1fr] gap-8 lg:gap-12 items-start mb-10">
        <div>
          <div className="section-index">02 / BENCH</div>
          <div className="tech-label mt-3">INTERACTIVE PROTOTYPE</div>
        </div>
        <div className="grid xl:grid-cols-[1fr_auto] gap-8 items-end">
          <div>
            <h2 className="section-title">Reconstruction<br />workbench.</h2>
            <p className="max-w-2xl text-sm leading-6 text-[#8e8a80] mt-5">Run the software pipeline as a controlled experiment: choose input, generate or load a measurement, reconstruct it, then inspect what the model actually returned.</p>
          </div>
          <div className="grid grid-cols-2 border border-white/15 min-w-[320px]">
            <div className="p-3 border-r border-white/15">
              <div className="tech-label">BACKEND</div>
              <div className="flex items-center gap-2 mt-2 font-mono text-[10px]">
                {backendStatus.online ? <><span className="ok-dot" /> ONLINE</> : <><WifiOff className="w-3 h-3 text-[#77736b]" /> DEMO FALLBACK</>}
              </div>
            </div>
            <div className="p-3">
              <div className="tech-label">MODE</div>
              <div className="font-mono text-[10px] mt-2 text-[#efede6]">{mode}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="instrument-frame">
        <div className="grid md:grid-cols-[1fr_auto] border border-white/15 border-b-0">
          <div className="px-4 py-3 flex items-center gap-3">
            <Server className="w-4 h-4 text-[#77736b]" />
            <span className="tech-label"><strong>PIPELINE CONTROL / RUN 001</strong></span>
          </div>
          <button type="button" onClick={handleLaunchDemo} disabled={isProcessing} className="min-h-[46px] px-5 border-t md:border-t-0 md:border-l border-white/15 font-mono text-[9px] uppercase tracking-[.12em] hover:bg-[#efede6] hover:text-[#0a0a09] transition-colors">
            Run one-click demo <ArrowRight className="inline w-3.5 h-3.5 ml-2" />
          </button>
        </div>

        <PipelineFlowBar status={status} />
        <ProcessingAnimation status={status} reconstructedUrl={reconstructedUrl || undefined} isBackendExecution={isBackendExecution} />
      </div>

      <div className="mt-6">
        <InputSourceSelector
          mode={mode}
          setMode={setMode}
          selectedSample={selectedSample}
          onSelectSample={handleSelectSample}
          onCustomImageLoaded={handleCustomImageLoaded}
        />
      </div>

      {mode === 'SIMULATION' && (
        <div className="mt-6">
          <OpticalSimulationControls params={simParams} onChange={setSimParams} onSimulate={handleSimulateForwardModel} isSimulating={isSimulating} disabled={isProcessing} />
        </div>
      )}

      <div className="mt-6 grid lg:grid-cols-[1fr_auto] border border-white/15 bg-[#0d0d0b]">
        <div className="p-4 sm:p-5">
          <div className="tech-label">RECONSTRUCTION COMMAND</div>
          <div className="flex flex-wrap gap-x-8 gap-y-2 mt-2 text-[11px] text-[#8e8a80]">
            <span>Input: <strong className="font-normal text-[#efede6]">{measurementUrl ? 'measurement ready' : 'measurement required'}</strong></span>
            <span>Method: <strong className="font-normal text-[#efede6]">backend reconstruction model</strong></span>
            <span>Reference: <strong className="font-normal text-[#efede6]">{hasGroundTruth ? 'available' : 'unavailable'}</strong></span>
          </div>
        </div>
        <button type="button" onClick={handleRunReconstruction} disabled={isProcessing || !measurementUrl} className="btn-primary min-w-[260px] !min-h-[72px] border-0 border-t lg:border-t-0 lg:border-l border-white/15">
          {isProcessing ? <><RefreshCw className="w-4 h-4 animate-spin" /> Processing pipeline</> : <><Play className="w-4 h-4" /> Reconstruct measurement</>}
        </button>
      </div>

      <ImageComparisonViewer originalUrl={originalSceneUrl} measurementUrl={measurementUrl} reconstructedUrl={reconstructedUrl} hasGroundTruth={hasGroundTruth} confidenceAvailable={metrics?.confidence?.available ?? false} />
      <QualityMetricsGrid metrics={metrics} />
      <BaselineVsAiComparison reconstructedUrl={reconstructedUrl || undefined} baselineUrl={baselineUrl || undefined} hasGroundTruth={hasGroundTruth} />
      <ExperimentHistory onLoadExperiment={handleLoadExperiment} currentExperiment={currentExp} />
    </section>
  );
};
