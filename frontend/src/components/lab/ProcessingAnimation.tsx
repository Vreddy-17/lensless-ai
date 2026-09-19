'use client';

import React from 'react';
import { PipelineStatus } from '@/types';

interface ProcessingAnimationProps {
  status: PipelineStatus;
  reconstructedUrl?: string;
  isBackendExecution?: boolean;
}

export const ProcessingAnimation: React.FC<ProcessingAnimationProps> = ({ status, isBackendExecution = false }) => {
  const copy: Record<PipelineStatus, [string, string]> = {
    idle: ['READY / WAITING FOR INPUT', 'Choose a measurement source or launch the demo pipeline.'],
    uploading: ['INPUT ACQUISITION', 'Receiving the selected scene or measurement.'],
    validating: ['INPUT VALIDATION', 'Checking file format, dimensions, and payload integrity.'],
    preprocessing: ['PREPROCESSING', 'Resize and normalise data for the reconstruction pipeline.'],
    simulating: ['FORWARD MODEL / y = Hx + n', 'Generating a software lensless measurement using the optical encoding model.'],
    measurement_ready: ['MEASUREMENT READY / y', 'Encoded measurement is available for inverse reconstruction.'],
    reconstructing: ['AI INVERSE RECONSTRUCTION / fθ(y)', 'Estimating the scene from the encoded measurement.'],
    postprocessing: ['RESTORATION', 'Preparing the reconstruction for display and artifact analysis.'],
    evaluating: ['QUALITY ANALYSIS', 'Computing available full-reference metrics when ground truth exists.'],
    completed: ['RECONSTRUCTION COMPLETE', isBackendExecution ? 'Result returned by the FastAPI reconstruction service.' : 'Demo / fallback pipeline finished.'],
    error: ['PIPELINE ERROR', 'The operation failed. Check the backend status or input format.'],
  };

  const [title, detail] = copy[status];
  const active = !['idle', 'completed', 'error', 'measurement_ready'].includes(status);

  return (
    <div className={`grid sm:grid-cols-[160px_1fr_auto] items-center border-x border-b border-white/15 min-h-[68px] ${status === 'error' ? 'bg-[#180d0d]' : 'bg-[#0d0d0b]'}`}>
      <div className="px-4 py-3 border-b sm:border-b-0 sm:border-r border-white/15 flex items-center gap-3">
        <span className={`w-2 h-2 ${status === 'error' ? 'bg-[#ff6666]' : status === 'completed' ? 'bg-[#8bd450]' : active ? 'bg-[#ff5b35] animate-status-blink' : 'border border-[#666159]'}`} />
        <span className="tech-label">SYSTEM STATE</span>
      </div>
      <div className="px-4 py-3">
        <div className="font-mono text-[10px] tracking-[.11em] text-[#efede6]">{title}</div>
        <div className="text-[11px] text-[#77736b] mt-1">{detail}</div>
      </div>
      <div className="px-4 py-3 font-mono text-[9px] text-[#5f5b53] hidden sm:block">STATE / {status.toUpperCase()}</div>
    </div>
  );
};
