'use client';

import React, { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export const OpticalExplorerScrolly: React.FC = () => {
  const [active, setActive] = useState(0);
  const steps = [
    { num: '01', label: 'CONVENTIONAL IMAGE FORMATION', title: 'A lens maps scene light to a recognisable sensor image.', body: 'In a conventional camera, the lens controls and focuses incoming light so spatial scene information becomes a recognisable image on the sensor.', note: 'SCENE → LENS → SENSOR → IMAGE' },
    { num: '02', label: 'LENSLESS ENCODING', title: 'The optical element encodes instead of directly forming a normal image.', body: 'A diffuser or coded mask can spread scene information across the sensor. The resulting measurement can look unlike the original scene.', note: 'SCENE → ENCODER H → MEASUREMENT y' },
    { num: '03', label: 'FORWARD MODEL', title: 'We describe the software prototype with y = Hx + n.', body: 'x represents the scene, H the optical encoding operator, y the measured pattern, and n noise. This is a simplified model used to reason about the system.', note: 'y = Hx + n' },
    { num: '04', label: 'INVERSE PROBLEM', title: 'The reconstruction task runs the problem in reverse.', body: 'Given y and knowledge learned from training data or a forward model, the system estimates the scene x. Noise and model mismatch make the inversion difficult.', note: 'MEASUREMENT y → ESTIMATE x̂' },
    { num: '05', label: 'COMPUTATIONAL LENS', title: 'AI performs reconstruction, not ordinary photo enhancement.', body: 'The network receives encoded optical information and estimates a recognisable scene. Restoration can happen after reconstruction, but it is a separate stage.', note: 'fθ(y) → x̂' },
  ];
  const item = steps[active];

  return (
    <section id="pipeline" className="section-shell">
      <div className="grid lg:grid-cols-[160px_1fr] gap-8 lg:gap-12 mb-10">
        <div>
          <div className="section-index">03 / OPTICS</div>
          <div className="tech-label mt-3">FROM ZERO</div>
        </div>
        <div>
          <h2 className="section-title">What happens<br />to the light?</h2>
          <p className="max-w-2xl text-sm leading-6 text-[#8e8a80] mt-5">A five-step explanation you can also use during your review: normal imaging, lensless encoding, the forward model, the inverse problem, and AI reconstruction.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[360px_1fr] border border-white/15 bg-[#0d0d0b]">
        <div className="border-b lg:border-b-0 lg:border-r border-white/15">
          {steps.map((step, index) => (
            <button
              type="button"
              key={step.num}
              onClick={() => setActive(index)}
              className={`w-full min-h-[82px] grid grid-cols-[42px_1fr] items-center text-left border-b last:border-b-0 border-white/10 px-4 transition-colors ${active === index ? 'bg-[#efede6] text-[#0a0a09]' : 'hover:bg-white/[.025]'}`}
            >
              <span className={`font-mono text-[9px] ${active === index ? 'text-[#ff5b35]' : 'text-[#5f5b53]'}`}>{step.num}</span>
              <span className="font-mono text-[10px] tracking-[.1em] leading-4">{step.label}</span>
            </button>
          ))}
        </div>

        <div className="min-h-[440px] p-6 sm:p-10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-4 pb-5 border-b border-white/15">
              <span className="tech-label"><strong>STEP {item.num} / 05</strong></span>
              <span className="badge-tech" data-variant="signal">OPTICS CONCEPT</span>
            </div>
            <h3 className="text-3xl sm:text-5xl tracking-[-.045em] leading-[1.02] font-medium mt-9 max-w-3xl">{item.title}</h3>
            <p className="text-sm sm:text-base leading-7 text-[#9a968c] mt-7 max-w-3xl">{item.body}</p>
            <div className="mt-9 border-l-2 border-[#ff5b35] pl-5 font-mono text-[11px] tracking-[.08em] text-[#efede6]">{item.note}</div>
          </div>
          <div className="flex items-center justify-between mt-10 pt-5 border-t border-white/15">
            <button type="button" onClick={() => setActive((active - 1 + steps.length) % steps.length)} className="btn-secondary"><ArrowLeft className="w-4 h-4" /> Previous</button>
            <span className="font-mono text-[9px] text-[#5f5b53]">{String(active + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')}</span>
            <button type="button" onClick={() => setActive((active + 1) % steps.length)} className="btn-primary">Next <ArrowRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </section>
  );
};
