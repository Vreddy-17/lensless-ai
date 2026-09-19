'use client';

import React from 'react';
import { ReconstructionMetrics } from '@/types';

interface QualityMetricsGridProps { metrics?: ReconstructionMetrics | null; }

export const QualityMetricsGrid: React.FC<QualityMetricsGridProps> = ({ metrics }) => {
  if (!metrics) {
    return (
      <div className="mt-6 border border-white/15 min-h-[120px] grid place-items-center bg-[#0d0d0b]">
        <div className="text-center">
          <div className="tech-label">QUALITY ANALYSIS</div>
          <p className="text-[11px] text-[#5f5b53] mt-2">Metrics appear after a reconstruction result is available.</p>
        </div>
      </div>
    );
  }

  const items = [
    { id: 'M01', label: 'PSNR', value: metrics.hasGroundTruth && metrics.psnr != null ? `${metrics.psnr.toFixed(2)} dB` : 'N/A', note: metrics.hasGroundTruth ? 'full-reference' : 'ground truth required' },
    { id: 'M02', label: 'SSIM', value: metrics.hasGroundTruth && metrics.ssim != null ? metrics.ssim.toFixed(3) : 'N/A', note: metrics.hasGroundTruth ? 'structural similarity' : 'ground truth required' },
    { id: 'M03', label: 'Runtime', value: `${Math.round(metrics.processingTimeMs)} ms`, note: 'pipeline elapsed' },
    { id: 'M04', label: 'Confidence', value: metrics.confidence?.available && metrics.confidence.value != null ? `${Math.round(metrics.confidence.value * 100)}%` : '—', note: metrics.confidence?.available ? metrics.confidence.method || 'model supplied' : 'not implemented' },
  ];

  return (
    <section className="mt-6 border border-white/15 bg-[#0d0d0b]">
      <div className="grid md:grid-cols-[230px_1fr]">
        <div className="p-5 border-b md:border-b-0 md:border-r border-white/15">
          <div className="tech-label"><strong>QUALITY / METRICS</strong></div>
          <p className="text-[11px] leading-5 text-[#77736b] mt-3">PSNR and SSIM are shown only when a matching reference image exists.</p>
          <div className="mt-5">
            <span className="badge-tech" data-variant={metrics.isDemoIllustrative ? 'warn' : metrics.hasGroundTruth ? 'ok' : 'neutral'}>
              {metrics.isDemoIllustrative ? 'DEMO / ILLUSTRATIVE' : metrics.hasGroundTruth ? 'REFERENCE AVAILABLE' : 'NO REFERENCE'}
            </span>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 xl:grid-cols-4">
          {items.map((item) => (
            <div key={item.id} className="min-h-[150px] p-5 border-b sm:border-r border-white/15 last:border-r-0 relative">
              <div className="font-mono text-[9px] text-[#5f5b53]">{item.id}</div>
              <div className="font-mono text-[9px] tracking-[.13em] uppercase text-[#8e8a80] mt-6">{item.label}</div>
              <div className="font-mono text-2xl sm:text-3xl tracking-[-.05em] text-[#efede6] mt-2">{item.value}</div>
              <div className="text-[10px] text-[#5f5b53] mt-2">{item.note}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
