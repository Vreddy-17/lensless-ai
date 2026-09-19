import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/15 bg-[#070706]">
      <div className="page-shell py-10">
        <div className="grid md:grid-cols-[1fr_auto] gap-8 items-end">
          <div>
            <div className="flex items-center gap-3"><span className="w-3 h-3 bg-[#ff5b35]" /><span className="font-mono text-xs tracking-[.16em]">LENSLESS.AI</span></div>
            <p className="max-w-xl text-xs leading-5 text-[#77736b] mt-4">Software-only AI lensless reconstruction prototype for PRISMTECH 2026. The hackathon MVP demonstrates simulation, inverse reconstruction workflow, and evaluation; physical lensless hardware remains future scope.</p>
          </div>
          <div className="font-mono text-[9px] leading-5 text-[#5f5b53] md:text-right">
            <div>COMPUTER VISION / COMPUTATIONAL IMAGING</div>
            <div>FORWARD MODEL / y = Hx + n</div>
            <div>INVERSE / fθ(y) → x̂</div>
          </div>
        </div>
        <div className="mt-8 pt-5 border-t border-white/10 flex flex-wrap justify-between gap-4 font-mono text-[8px] tracking-[.1em] text-[#4e4b45]">
          <span>PRISMTECH 2026 / OPTICS STREAM</span>
          <span>NO PHYSICAL LENSLESS HARDWARE CLAIMED IN MVP</span>
        </div>
      </div>
    </footer>
  );
};
