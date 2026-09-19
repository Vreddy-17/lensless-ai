'use client';

import React from 'react';
import { PipelineStatus } from '@/types';

interface PipelineFlowBarProps { status: PipelineStatus; }

type Stage = { id: string; short: string; states: PipelineStatus[]; passed: PipelineStatus[] };

export const PipelineFlowBar: React.FC<PipelineFlowBarProps> = ({ status }) => {
  const stages: Stage[] = [
    { id: '01', short: 'INPUT', states: ['uploading'], passed: ['validating','preprocessing','simulating','measurement_ready','reconstructing','postprocessing','evaluating','completed'] },
    { id: '02', short: 'VALIDATE', states: ['validating'], passed: ['preprocessing','simulating','measurement_ready','reconstructing','postprocessing','evaluating','completed'] },
    { id: '03', short: 'PREP', states: ['preprocessing'], passed: ['simulating','measurement_ready','reconstructing','postprocessing','evaluating','completed'] },
    { id: '04', short: 'ENCODE', states: ['simulating','measurement_ready'], passed: ['reconstructing','postprocessing','evaluating','completed'] },
    { id: '05', short: 'INVERSE', states: ['reconstructing'], passed: ['postprocessing','evaluating','completed'] },
    { id: '06', short: 'RESTORE', states: ['postprocessing'], passed: ['evaluating','completed'] },
    { id: '07', short: 'VERIFY', states: ['evaluating'], passed: ['completed'] },
    { id: '08', short: 'RESULT', states: ['completed'], passed: [] },
  ];

  return (
    <div className="border border-white/15 bg-[#0c0c0a] overflow-x-auto">
      <div className="min-w-[900px] grid grid-cols-8">
        {stages.map((stage, index) => {
          const active = stage.states.includes(status);
          const passed = stage.passed.includes(status);
          return (
            <div key={stage.id} className={`relative min-h-[72px] px-3 py-3 border-r last:border-r-0 border-white/10 ${active ? 'bg-[#efede6] text-[#0a0a09]' : ''}`}>
              <div className={`font-mono text-[9px] ${active ? 'text-[#ff5b35]' : passed ? 'text-[#8bd450]' : 'text-[#5f5b53]'}`}>{stage.id}</div>
              <div className={`font-mono text-[10px] tracking-[.1em] mt-2 ${active ? 'font-semibold' : passed ? 'text-[#c6c2b8]' : 'text-[#77736b]'}`}>{stage.short}</div>
              <div className="absolute left-3 right-3 bottom-2 h-px bg-white/10 overflow-hidden">
                <div className={`h-full ${active ? 'w-full bg-[#ff5b35] animate-status-blink' : passed ? 'w-full bg-[#8bd450]' : 'w-0'}`} />
              </div>
              {index < stages.length - 1 && <span className="absolute -right-[3px] top-1/2 -translate-y-1/2 w-[5px] h-[5px] bg-[#0a0a09] border border-white/20 z-10" />}
            </div>
          );
        })}
      </div>
    </div>
  );
};
