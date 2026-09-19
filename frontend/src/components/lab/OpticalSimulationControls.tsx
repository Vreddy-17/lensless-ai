'use client';

import React from 'react';
import { DiffuserType, SimulationParams } from '@/types';
import { Disc3, Grid3X3, Scan, RefreshCw } from 'lucide-react';

interface OpticalSimulationControlsProps {
  params: SimulationParams;
  onChange: (params: SimulationParams) => void;
  onSimulate: () => void;
  isSimulating: boolean;
  disabled?: boolean;
}

export const OpticalSimulationControls: React.FC<OpticalSimulationControlsProps> = ({
  params,
  onChange,
  onSimulate,
  isSimulating,
  disabled = false,
}) => {
  const encoders: { id: DiffuserType; label: string; icon: React.ReactNode }[] = [
    { id: 'diffuser_caustic', label: 'Diffuser PSF', icon: <Disc3 className="w-4 h-4" /> },
    { id: 'coded_aperture', label: 'Coded mask', icon: <Grid3X3 className="w-4 h-4" /> },
    { id: 'gaussian_psf', label: 'Gaussian PSF', icon: <Scan className="w-4 h-4" /> },
  ];

  const sliders: { key: keyof Pick<SimulationParams, 'noiseLevel' | 'psfRadius' | 'sensorNoise' | 'exposure'>; label: string; min: number; max: number; step: number; format: (v: number) => string }[] = [
    { key: 'noiseLevel', label: 'Optical noise', min: 0, max: 1, step: 0.01, format: (v) => v.toFixed(2) },
    { key: 'psfRadius', label: 'PSF radius', min: 2, max: 32, step: 1, format: (v) => `${v}px` },
    { key: 'sensorNoise', label: 'Sensor noise', min: 0, max: 1, step: 0.01, format: (v) => v.toFixed(2) },
    { key: 'exposure', label: 'Exposure', min: 0.2, max: 2, step: 0.05, format: (v) => `${v.toFixed(2)}×` },
  ];

  return (
    <div className="instrument-frame border border-white/15">
      <div className="grid lg:grid-cols-[270px_1fr]">
        <div className="p-5 border-b lg:border-b-0 lg:border-r border-white/15">
          <div className="tech-label"><strong>FORWARD MODEL</strong></div>
          <div className="font-mono text-xl mt-4 tracking-tight">y = Hx + n</div>
          <p className="text-[11px] leading-5 text-[#77736b] mt-4">Simulation controls are an approximation for the software demo, not a claim of calibrated physical hardware.</p>
          <span className="badge-tech mt-5" data-variant="warn">SOFTWARE SIMULATION</span>
        </div>

        <div>
          <div className="grid sm:grid-cols-3 border-b border-white/15">
            {encoders.map((encoder) => {
              const active = params.diffuserType === encoder.id;
              return (
                <button
                  type="button"
                  key={encoder.id}
                  disabled={disabled}
                  onClick={() => onChange({ ...params, diffuserType: encoder.id })}
                  className={`min-h-[70px] px-4 border-r last:border-r-0 border-white/15 flex items-center gap-3 text-left transition-colors ${active ? 'bg-[#efede6] text-[#0a0a09]' : 'hover:bg-white/[.025] text-[#b8b4aa]'}`}
                >
                  <span className={active ? 'text-[#ff5b35]' : 'text-[#77736b]'}>{encoder.icon}</span>
                  <span className="font-mono text-[10px] uppercase tracking-[.1em]">{encoder.label}</span>
                </button>
              );
            })}
          </div>

          <div className="px-5">
            {sliders.map((item) => {
              const value = params[item.key];
              return (
                <div className="control-row" key={item.key}>
                  <div>
                    <div className="font-mono text-[10px] tracking-[.08em] uppercase text-[#b8b4aa]">{item.label}</div>
                    <div className="font-mono text-[9px] text-[#5f5b53] mt-1">PARAM / {item.key}</div>
                  </div>
                  <div className="grid grid-cols-[1fr_58px] gap-4 items-center">
                    <input
                      aria-label={item.label}
                      type="range"
                      min={item.min}
                      max={item.max}
                      step={item.step}
                      value={value}
                      disabled={disabled}
                      onChange={(e) => onChange({ ...params, [item.key]: Number(e.target.value) })}
                    />
                    <div className="font-mono text-[10px] text-right text-[#efede6]">{item.format(value)}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="font-mono text-[9px] text-[#5f5b53]">SEED / {params.seed.toString().padStart(4, '0')}</div>
            <button type="button" onClick={onSimulate} disabled={disabled || isSimulating} className="btn-primary">
              {isSimulating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Scan className="w-4 h-4" />}
              {isSimulating ? 'Generating y' : 'Generate measurement'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
