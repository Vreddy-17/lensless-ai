import React from 'react';

export const ApplicationsGrid: React.FC = () => {
  const apps = [
    ['A01', 'Compact imaging', 'Potential direction', 'Lensless computational designs can reduce dependence on conventional image-forming optics in specialized compact systems.'],
    ['A02', 'Computational microscopy', 'Potential direction', 'Reconstruction algorithms can recover useful visual structure from encoded measurements in compact imaging setups.'],
    ['A03', 'Machine vision', 'Potential direction', 'Task-specific reconstruction could support systems where size, geometry, or optical access is constrained.'],
    ['A04', 'Robotics', 'Future scope', 'Miniaturized imaging concepts may be useful where conventional camera modules are difficult to place.'],
    ['A05', 'Research imaging', 'Immediate relevance', 'The software prototype is directly useful for studying forward models, inverse problems, datasets, and reconstruction quality.'],
    ['A06', 'Physical prototype', 'Future scope', 'A calibrated diffuser / coded-mask sensor would be the next step beyond the software-only hackathon MVP.'],
  ];

  return (
    <section id="applications" className="section-shell border-t border-white/15">
      <div className="grid lg:grid-cols-[160px_1fr] gap-8 lg:gap-12">
        <div>
          <div className="section-index">06 / SCOPE</div>
          <div className="tech-label mt-3">WHERE THIS COULD GO</div>
        </div>
        <div>
          <h2 className="section-title">Applications,<br />without overclaiming.</h2>
          <p className="text-sm leading-6 text-[#8e8a80] mt-5 max-w-2xl">These are research directions for lensless computational imaging—not claims that the current software MVP already solves each application.</p>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 mt-10 border-t border-l border-white/15">
            {apps.map(([num, title, status, desc]) => (
              <article key={num} className="min-h-[230px] p-5 border-r border-b border-white/15 flex flex-col justify-between hover:bg-white/[.02] transition-colors">
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-mono text-[9px] text-[#ff5b35]">{num}</span>
                    <span className="font-mono text-[8px] tracking-[.11em] uppercase text-[#5f5b53]">{status}</span>
                  </div>
                  <h3 className="text-xl tracking-[-.03em] mt-8">{title}</h3>
                </div>
                <p className="text-[11px] leading-5 text-[#77736b] mt-6">{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
