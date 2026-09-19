'use client';

import React, { useState } from 'react';

export const EquationExplorer: React.FC = () => {
  const [selected, setSelected] = useState<'y' | 'H' | 'x' | 'n' | 'f' | 'xh'>('H');

  const terms = {
    y: { symbol: 'y', name: 'Lensless measurement', role: 'What the sensor or software forward model produces.', detail: 'This is the encoded optical information used as reconstruction input.' },
    H: { symbol: 'H', name: 'Forward optical model', role: 'Describes how scene information is encoded before reaching the measurement.', detail: 'In the current software prototype, H is approximated with a PSF-based encoding process.' },
    x: { symbol: 'x', name: 'Original scene', role: 'The scene or reference image before lensless encoding.', detail: 'For paired training data, x is also the reconstruction target / ground truth.' },
    n: { symbol: 'n', name: 'Noise', role: 'Represents measurement and sensor disturbances.', detail: 'The current simulator adds software noise; a physical system would require calibration of real sensor behavior.' },
    f: { symbol: 'fθ', name: 'Learned inverse model', role: 'The AI reconstruction function learned from paired measurements and targets.', detail: 'A U-Net-style encoder-decoder is one possible first model, not a fixed architectural claim.' },
    xh: { symbol: 'x̂', name: 'Reconstructed estimate', role: 'The output image estimated from the encoded measurement.', detail: 'It is an estimate, so fidelity must be evaluated when ground truth is available.' },
  };

  const current = terms[selected];
  const buttons: [keyof typeof terms, string][] = [['y','y'], ['H','H'], ['x','x'], ['n','n'], ['f','fθ'], ['xh','x̂']];

  return (
    <section id="equation" className="py-20 border-t border-white/15">
      <div className="grid lg:grid-cols-[160px_1fr] gap-8 lg:gap-12">
        <div>
          <div className="section-index">04 / MODEL</div>
          <div className="tech-label mt-3">SIMPLIFIED FORWARD + INVERSE</div>
        </div>
        <div>
          <div className="grid xl:grid-cols-[1fr_360px] border border-white/15 bg-[#0d0d0b]">
            <div className="p-6 sm:p-10 border-b xl:border-b-0 xl:border-r border-white/15">
              <div className="tech-label"><strong>INTERACTIVE EQUATION</strong></div>
              <div className="mt-10 flex flex-wrap items-center gap-2 sm:gap-3 font-mono text-3xl sm:text-5xl tracking-tight">
                {(['y','=','H','x','+','n','→','f','→','xh'] as const).map((token, index) => {
                  const key = token === 'f' ? 'f' : token === 'xh' ? 'xh' : token;
                  const selectable = key === 'y' || key === 'H' || key === 'x' || key === 'n' || key === 'f' || key === 'xh';
                  if (!selectable) return <span key={`${token}-${index}`} className="text-[#5f5b53]">{token}</span>;
                  const term = terms[key];
                  return (
                    <button
                      type="button"
                      key={`${token}-${index}`}
                      onClick={() => setSelected(key)}
                      className={`px-2 py-1 border transition-colors ${selected === key ? 'bg-[#efede6] text-[#0a0a09] border-[#efede6]' : 'border-transparent hover:border-white/25 text-[#efede6]'}`}
                    >
                      {term.symbol}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-[#77736b] mt-7">Simplified project model: <span className="font-mono text-[#b8b4aa]">y = Hx + n</span>. The reconstruction model then estimates <span className="font-mono text-[#b8b4aa]">x̂</span> from <span className="font-mono text-[#b8b4aa]">y</span>.</p>

              <div className="grid grid-cols-3 sm:grid-cols-6 mt-10 border-t border-l border-white/15">
                {buttons.map(([key, label]) => (
                  <button type="button" key={key} onClick={() => setSelected(key)} className={`min-h-[58px] border-r border-b border-white/15 font-mono text-sm ${selected === key ? 'bg-[#ff5b35] text-[#0a0a09]' : 'hover:bg-white/[.025]'}`}>{label}</button>
                ))}
              </div>
            </div>

            <aside className="p-6 sm:p-8 bg-[#efede6] text-[#0a0a09]">
              <div className="font-mono text-[9px] tracking-[.14em] uppercase opacity-55">SELECTED TERM</div>
              <div className="font-mono text-6xl tracking-[-.08em] mt-5">{current.symbol}</div>
              <h3 className="text-2xl font-medium tracking-[-.035em] mt-6">{current.name}</h3>
              <p className="text-sm leading-6 mt-5 opacity-75">{current.role}</p>
              <div className="mt-8 pt-5 border-t border-black/15 font-mono text-[10px] leading-5 opacity-65">{current.detail}</div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
};
