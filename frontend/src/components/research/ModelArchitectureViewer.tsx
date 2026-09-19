'use client';

import React from 'react';

export const ModelArchitectureViewer: React.FC = () => {
  const blocks = [
    ['01', 'MEASUREMENT', 'Encoded lensless input y'],
    ['02', 'ENCODER', 'Multi-scale feature extraction'],
    ['03', 'LATENT', 'Compressed representation'],
    ['04', 'DECODER', 'Spatial reconstruction'],
    ['05', 'OUTPUT', 'Estimated scene x̂'],
  ];

  return (
    <section className="py-20 border-t border-white/15">
      <div className="grid lg:grid-cols-[160px_1fr] gap-8 lg:gap-12">
        <div>
          <div className="section-index">05 / AI</div>
          <div className="tech-label mt-3">CONCEPTUAL NETWORK</div>
        </div>
        <div>
          <div className="flex flex-wrap items-end justify-between gap-6 mb-8">
            <div>
              <h2 className="text-4xl sm:text-6xl tracking-[-.05em] leading-[.95] font-medium">From measurement<br />to reconstruction.</h2>
              <p className="text-sm leading-6 text-[#8e8a80] mt-5 max-w-2xl">The exact ML architecture is still a team decision. This diagram intentionally stays conceptual until the trained reconstruction network is finalised.</p>
            </div>
            <span className="badge-tech" data-variant="warn">ARCHITECTURE NOT FINAL</span>
          </div>

          <div className="border border-white/15 bg-[#0d0d0b] overflow-x-auto">
            <div className="min-w-[820px] grid grid-cols-5">
              {blocks.map(([num, title, desc], index) => (
                <div key={num} className="relative min-h-[210px] p-5 border-r last:border-r-0 border-white/15 flex flex-col justify-between">
                  <div>
                    <div className="font-mono text-[9px] text-[#ff5b35]">{num}</div>
                    <div className="font-mono text-[10px] tracking-[.12em] mt-5">{title}</div>
                    <p className="text-[11px] leading-5 text-[#77736b] mt-3">{desc}</p>
                  </div>
                  <div className="h-14 relative">
                    <div className="absolute left-0 right-0 top-1/2 h-px bg-white/20" />
                    <div className={`absolute top-1/2 -translate-y-1/2 border border-white/25 bg-[#11110f] ${index === 2 ? 'w-10 h-10 left-1/2 -translate-x-1/2 rotate-45 border-[#5d73ff]' : 'w-12 h-12 left-1/2 -translate-x-1/2'}`} />
                  </div>
                  {index < blocks.length - 1 && <div className="absolute -right-[5px] top-1/2 w-[9px] h-[9px] bg-[#ff5b35] z-10" />}
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-3 border-x border-b border-white/15">
            {[
              ['TRAINING INPUT', 'Paired lensless measurement + ground-truth image'],
              ['LOSS', 'Pixel / structural / perceptual terms as selected by ML team'],
              ['DEPLOYMENT', 'Best saved model loaded once by FastAPI for inference'],
            ].map(([title, desc]) => (
              <div key={title} className="p-5 border-b md:border-b-0 md:border-r last:border-r-0 border-white/15">
                <div className="tech-label"><strong>{title}</strong></div>
                <p className="text-[11px] leading-5 text-[#77736b] mt-3">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
