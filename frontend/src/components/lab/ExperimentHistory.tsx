'use client';

import React, { useEffect, useState } from 'react';
import { ArrowRight, Trash2 } from 'lucide-react';
import { ExperimentRecord } from '@/types';

interface ExperimentHistoryProps {
  onLoadExperiment: (exp: ExperimentRecord) => void;
  currentExperiment?: ExperimentRecord | null;
}

export const ExperimentHistory: React.FC<ExperimentHistoryProps> = ({ onLoadExperiment, currentExperiment }) => {
  const [history, setHistory] = useState<ExperimentRecord[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = window.localStorage.getItem('lensless_experiment_history');
      if (stored) setHistory(JSON.parse(stored));
    } catch {}
  }, []);

  useEffect(() => {
    if (!currentExperiment) return;
    const timer = window.setTimeout(() => {
      setHistory((previous) => {
        if (previous.some((item) => item.id === currentExperiment.id)) return previous;
        const next = [currentExperiment, ...previous].slice(0, 10);
        try { window.localStorage.setItem('lensless_experiment_history', JSON.stringify(next)); } catch {}
        return next;
      });
    }, 0);
    return () => window.clearTimeout(timer);
  }, [currentExperiment]);

  if (!mounted || !history.length) return null;

  const clear = () => {
    setHistory([]);
    try { localStorage.removeItem('lensless_experiment_history'); } catch {}
  };

  return (
    <section className="mt-6 border border-white/15 bg-[#0d0d0b]">
      <div className="h-14 px-4 flex items-center justify-between border-b border-white/15">
        <div className="tech-label"><strong>LOCAL EXPERIMENT HISTORY</strong></div>
        <button type="button" onClick={clear} className="font-mono text-[9px] uppercase tracking-[.1em] text-[#77736b] hover:text-[#ff6666] flex items-center gap-2"><Trash2 className="w-3.5 h-3.5" /> Clear</button>
      </div>
      <div className="divide-y divide-white/10">
        {history.map((exp, index) => (
          <button type="button" key={exp.id} onClick={() => onLoadExperiment(exp)} className="w-full grid grid-cols-[46px_52px_1fr_auto] items-center gap-4 p-3 text-left hover:bg-white/[.025] transition-colors">
            <span className="font-mono text-[9px] text-[#5f5b53]">{String(index + 1).padStart(2, '0')}</span>
            <div className="w-12 h-12 bg-black border border-white/15 overflow-hidden"><img src={exp.reconstructedUrl || exp.thumbnailUrl} alt="Experiment result" className="w-full h-full object-cover" /></div>
            <div className="min-w-0">
              <div className="text-xs text-[#efede6] truncate">{exp.title}</div>
              <div className="font-mono text-[9px] text-[#5f5b53] mt-1">{exp.timestamp} / {exp.mode} / {exp.processingTimeMs} ms</div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#77736b]" />
          </button>
        ))}
      </div>
    </section>
  );
};
