'use client';

import React, { useRef, useState } from 'react';
import { Download, Columns3, SplitSquareHorizontal } from 'lucide-react';

interface ImageComparisonViewerProps {
  originalUrl?: string | null;
  measurementUrl?: string | null;
  reconstructedUrl?: string | null;
  hasGroundTruth: boolean;
  confidenceAvailable?: boolean;
}

export const ImageComparisonViewer: React.FC<ImageComparisonViewerProps> = ({
  originalUrl,
  measurementUrl,
  reconstructedUrl,
  hasGroundTruth,
}) => {
  const [view, setView] = useState<'triptych' | 'split'>('triptych');
  const [splitMode, setSplitMode] = useState<'reference' | 'measurement'>(hasGroundTruth ? 'reference' : 'measurement');
  const [position, setPosition] = useState(50);
  const [dragging, setDragging] = useState(false);
  const splitRef = useRef<HTMLDivElement>(null);

  const setFromClientX = (x: number) => {
    const node = splitRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    setPosition(Math.max(0, Math.min(100, ((x - rect.left) / rect.width) * 100)));
  };

  const leftUrl = splitMode === 'reference' && hasGroundTruth ? originalUrl : measurementUrl;
  const rightUrl = reconstructedUrl;

  const download = () => {
    if (!reconstructedUrl) return;
    const a = document.createElement('a');
    a.href = reconstructedUrl;
    a.download = `lensless-reconstruction-${Date.now()}.png`;
    a.click();
  };

  const imageCell = (num: string, title: string, subtitle: string, url?: string | null) => (
    <div className="border-r last:border-r-0 border-white/15 min-w-0">
      <div className="h-12 border-b border-white/15 px-3 flex items-center justify-between gap-3">
        <span className="font-mono text-[9px] text-[#5f5b53]">{num}</span>
        <div className="min-w-0 text-right">
          <div className="font-mono text-[9px] tracking-[.1em] uppercase text-[#b8b4aa] truncate">{title}</div>
          <div className="text-[9px] text-[#5f5b53] truncate">{subtitle}</div>
        </div>
      </div>
      <div className="relative aspect-square bg-[#050504] overflow-hidden measurement-surface">
        {url ? <img src={url} alt={title} className="absolute inset-0 w-full h-full object-contain" /> : (
          <div className="absolute inset-0 grid place-items-center"><span className="tech-label">NO DATA</span></div>
        )}
      </div>
    </div>
  );

  return (
    <section className="mt-6 border border-white/15 bg-[#0d0d0b]">
      <div className="min-h-[64px] flex flex-wrap items-center justify-between gap-4 px-4 border-b border-white/15">
        <div>
          <div className="tech-label"><strong>IMAGE INSPECTION</strong></div>
          <div className="text-[10px] text-[#5f5b53] mt-1">Compare what entered the system, what the sensor-like measurement contains, and what reconstruction returns.</div>
        </div>
        <div className="flex items-stretch self-stretch">
          <button type="button" onClick={() => setView('triptych')} className={`px-4 border-l border-white/15 font-mono text-[9px] uppercase tracking-[.1em] flex items-center gap-2 ${view === 'triptych' ? 'bg-[#efede6] text-[#0a0a09]' : 'text-[#8e8a80] hover:text-white'}`}><Columns3 className="w-3.5 h-3.5" /> Three views</button>
          <button type="button" onClick={() => setView('split')} className={`px-4 border-l border-white/15 font-mono text-[9px] uppercase tracking-[.1em] flex items-center gap-2 ${view === 'split' ? 'bg-[#efede6] text-[#0a0a09]' : 'text-[#8e8a80] hover:text-white'}`}><SplitSquareHorizontal className="w-3.5 h-3.5" /> Split</button>
          <button type="button" onClick={download} disabled={!reconstructedUrl} className="px-4 border-l border-white/15 text-[#8e8a80] hover:text-white disabled:opacity-30" aria-label="Download reconstruction"><Download className="w-4 h-4" /></button>
        </div>
      </div>

      {view === 'triptych' ? (
        <div className="grid md:grid-cols-3">
          {imageCell('V01', hasGroundTruth ? 'Reference scene x' : 'Reference unavailable', hasGroundTruth ? 'ground truth / source scene' : 'no paired ground truth', originalUrl)}
          {imageCell('V02', 'Lensless measurement y', 'encoded optical information', measurementUrl)}
          {imageCell('V03', 'Reconstruction x̂', 'model output', reconstructedUrl)}
        </div>
      ) : (
        <div>
          <div className="h-12 border-b border-white/15 flex items-center justify-between px-4">
            <div className="flex gap-2">
              {hasGroundTruth && <button type="button" onClick={() => setSplitMode('reference')} className={`badge-tech ${splitMode === 'reference' ? '!border-[#ff5b35] !text-[#ff8469]' : ''}`}>REFERENCE ↔ RECON</button>}
              <button type="button" onClick={() => setSplitMode('measurement')} className={`badge-tech ${splitMode === 'measurement' ? '!border-[#ff5b35] !text-[#ff8469]' : ''}`}>MEASUREMENT ↔ RECON</button>
            </div>
            <span className="font-mono text-[9px] text-[#5f5b53]">DRAG / {position.toFixed(0)}%</span>
          </div>
          <div
            ref={splitRef}
            className="relative aspect-[16/8] min-h-[340px] max-h-[680px] bg-[#050504] overflow-hidden select-none cursor-ew-resize measurement-surface"
            onMouseDown={(e) => { setDragging(true); setFromClientX(e.clientX); }}
            onMouseMove={(e) => dragging && setFromClientX(e.clientX)}
            onMouseUp={() => setDragging(false)}
            onMouseLeave={() => setDragging(false)}
            onTouchStart={(e) => { setDragging(true); if (e.touches[0]) setFromClientX(e.touches[0].clientX); }}
            onTouchMove={(e) => dragging && e.touches[0] && setFromClientX(e.touches[0].clientX)}
            onTouchEnd={() => setDragging(false)}
          >
            {leftUrl && <img src={leftUrl} alt="Comparison left" className="absolute inset-0 w-full h-full object-contain" />}
            {rightUrl ? (
              <img
                src={rightUrl}
                alt="Reconstruction"
                className="absolute inset-0 w-full h-full object-contain"
                style={{ clipPath: `inset(0 0 0 ${position}%)` }}
              />
            ) : null}
            <div className="absolute inset-y-0 w-px bg-[#ff5b35]" style={{ left: `${position}%` }}>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 bg-[#ff5b35] text-[#0a0a09] grid place-items-center font-mono text-[9px]">↔</div>
            </div>
            <span className="image-stage-label">{splitMode === 'reference' ? 'LEFT / REFERENCE' : 'LEFT / MEASUREMENT'}</span>
            <span className="image-stage-label !left-auto right-0">RIGHT / RECONSTRUCTION</span>
          </div>
        </div>
      )}
    </section>
  );
};
