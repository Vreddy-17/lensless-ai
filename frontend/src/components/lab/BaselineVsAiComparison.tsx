'use client';

import React from 'react';

interface BaselineVsAiComparisonProps {
  reconstructedUrl?: string;
  baselineUrl?: string;
  hasGroundTruth: boolean;
  baselineName?: string;
  aiModelName?: string;
}

export const BaselineVsAiComparison: React.FC<BaselineVsAiComparisonProps> = ({
  reconstructedUrl,
  baselineUrl,
  hasGroundTruth,
  baselineName = 'Classical reconstruction baseline',
  aiModelName = 'AI reconstruction model',
}) => {
  return (
    <section className="mt-6 border border-white/15 bg-[#0d0d0b]">
      <div className="grid lg:grid-cols-[230px_1fr]">
        <div className="p-5 border-b lg:border-b-0 lg:border-r border-white/15">
          <div className="tech-label"><strong>BASELINE CHECK</strong></div>
          <p className="text-[11px] leading-5 text-[#77736b] mt-3">The classical method gives the project a reference point before claiming an AI improvement.</p>
          <span className="badge-tech mt-5" data-variant="data">COMPARE METHODS</span>
        </div>

        <div className="grid md:grid-cols-2">
          {[
            { id: 'B01', title: 'Classical baseline', subtitle: baselineName, url: baselineUrl },
            { id: 'B02', title: 'AI reconstruction', subtitle: aiModelName, url: reconstructedUrl },
          ].map((item, index) => (
            <div key={item.id} className={`${index === 0 ? 'border-b md:border-b-0 md:border-r' : ''} border-white/15`}>
              <div className="h-14 px-4 border-b border-white/15 flex items-center justify-between gap-4">
                <div>
                  <div className="font-mono text-[9px] text-[#5f5b53]">{item.id}</div>
                  <div className="font-mono text-[10px] uppercase tracking-[.1em] text-[#b8b4aa] mt-1">{item.title}</div>
                </div>
                <span className="font-mono text-[8px] text-[#5f5b53] max-w-[190px] truncate">{item.subtitle}</span>
              </div>
              <div className="relative aspect-[4/3] bg-[#050504] measurement-surface overflow-hidden">
                {item.url ? <img src={item.url} alt={item.title} className="w-full h-full object-contain" /> : <div className="absolute inset-0 grid place-items-center"><span className="tech-label">RESULT NOT AVAILABLE</span></div>}
              </div>
              <div className="grid grid-cols-3 border-t border-white/15">
                {['PSNR', 'SSIM', 'RUNTIME'].map((label) => (
                  <div key={label} className="p-3 border-r last:border-r-0 border-white/15">
                    <div className="font-mono text-[8px] text-[#5f5b53]">{label}</div>
                    <div className="font-mono text-xs mt-1 text-[#b8b4aa]">{hasGroundTruth ? 'backend' : 'N/A'}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="px-5 py-3 border-t border-white/15 text-[9px] text-[#5f5b53] font-mono">No fabricated comparison values are shown. Populate this panel only with results produced by the baseline and AI pipelines.</div>
    </section>
  );
};
