'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight, Play } from 'lucide-react';

interface HeroSectionProps {
  onStartExperiment?: () => void;
  onExplorePipeline?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartExperiment, onExplorePipeline }) => {
  return (
    <section
      id="overview"
      className="relative min-h-screen flex flex-col justify-between pt-20 pb-6 px-4 sm:px-8 lg:px-12 bg-[#07080a] bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{
        backgroundImage: "url('/images/page_bg_clean.png')",
        backgroundPosition: 'center top',
        backgroundSize: 'cover',
      }}
    >
      {/* Subtle vignette/contrast overlay so text always stays ultra-readable */}
      <div className="absolute inset-0 bg-[#07080a]/30 pointer-events-none z-0" />

      <div className="w-full max-w-[1580px] mx-auto relative z-10 flex-1 flex flex-col justify-between">
        {/* Top Hero Layout: Left Headline + Right 3-Stage Pipeline */}
        <div className="grid lg:grid-cols-[0.88fr_1.12fr] xl:grid-cols-[0.8fr_1.2fr] gap-8 xl:gap-12 items-center pt-2">
          {/* Left Column: Heading, description, and CTA */}
          <div className="flex flex-col justify-center">
            <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8e8a80] mb-3 sm:mb-4">
              SENSE MORE WITH LESS
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[56px] xl:text-[64px] font-black text-white leading-[1.02] tracking-[-0.03em]">
              AI AS THE<br />
              <span className="text-[#ff5a36]">COMPUTATIONAL</span><br />
              LENS.
            </h1>

            <p className="text-[13px] sm:text-[14px] xl:text-[15px] text-[#9e9a90] leading-[1.65] max-w-lg mt-5">
              We reconstruct a recognizable scene from an encoded lensless measurement. The input is not a photograph to enhance; it is optical information that must be inverted computationally.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 mt-6">
              <button
                type="button"
                onClick={onStartExperiment}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-semibold text-xs tracking-wide hover:bg-[#efede6] hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] transition-all cursor-pointer"
              >
                OPEN RECONSTRUCTION BENCH
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={onExplorePipeline}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/35 text-white font-medium text-xs tracking-wide transition-all cursor-pointer"
              >
                EXPLORE THE SCIENCE
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="font-mono text-[10px] sm:text-[11px] tracking-[0.26em] text-[#6e6a62] mt-6 sm:mt-8">
              REAL OPTICS.&nbsp;&nbsp;REAL SCENES.&nbsp;&nbsp;REAL IMPACT.
            </div>
          </div>

          {/* Right Column: 3-Stage Pipeline with Horizontal Laser Beam */}
          <div className="relative">
            {/* The Horizontal Laser Beam Connecting the Cards */}
            <div className="hidden md:block absolute top-[47.5%] left-[28%] right-[2%] -translate-y-1/2 z-20 pointer-events-none">
              <div className="relative w-full h-[2px]">
                {/* Glowing laser line */}
                <div className="w-full h-full bg-gradient-to-r from-[#ff5a36] via-[#ff7a45] to-[#ff5a36] shadow-[0_0_10px_#ff5a36,0_0_20px_rgba(255,90,54,0.7)]" />

                {/* Laser pulse at first junction */}
                <div className="absolute left-[36%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_12px_#ff5a36,0_0_24px_#ff5a36]" />

                {/* Arrow Head pointing into Card 3 */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center">
                  <div className="w-2.5 h-2.5 border-t-2 border-r-2 border-[#ff7a45] rotate-45 shadow-[0_0_8px_#ff5a36]" />
                </div>
              </div>
            </div>

            {/* 3 Pipeline Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 xl:gap-4 relative z-10">
              {/* Card 01: Lensless Measurement */}
              <div className="rounded-2xl border border-white/10 bg-[#0d0e12]/92 backdrop-blur-md p-3.5 sm:p-4 flex flex-col justify-between shadow-xl hover:border-white/20 transition-all">
                <div>
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <span className="font-mono text-xs font-bold text-[#ff5a36]">01</span>
                    <span className="font-mono text-[10px] font-semibold tracking-wider text-white uppercase">
                      LENSLESS MEASUREMENT
                    </span>
                  </div>

                  {/* Measurement Image Container */}
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-black border border-white/10 group">
                    {/* Corner viewfinder brackets */}
                    <div className="absolute top-2 left-2 w-2.5 h-2.5 border-t-2 border-l-2 border-white/40 pointer-events-none z-10" />
                    <div className="absolute top-2 right-2 w-2.5 h-2.5 border-t-2 border-r-2 border-white/40 pointer-events-none z-10" />
                    <div className="absolute bottom-2 left-2 w-2.5 h-2.5 border-b-2 border-l-2 border-white/40 pointer-events-none z-10" />
                    <div className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b-2 border-r-2 border-white/40 pointer-events-none z-10" />

                    <Image
                      src="/images/speckle.png"
                      alt="Encoded lensless intensity speckle pattern"
                      fill
                      sizes="(max-width: 768px) 100vw, 300px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>

                {/* Footer specs */}
                <div className="flex items-center justify-between text-[9px] font-mono text-[#8e8a80] mt-3 pt-2 border-t border-white/5">
                  <span className="tracking-wider">ENCODED INTENSITY</span>
                  <span className="text-white/60">256 × 256</span>
                </div>
              </div>

              {/* Card 02: Computational Reconstruction */}
              <div className="rounded-2xl border border-white/10 bg-[#0d0e12]/92 backdrop-blur-md p-3.5 sm:p-4 flex flex-col justify-between shadow-xl hover:border-[#ff5a36]/30 transition-all">
                <div>
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <span className="font-mono text-xs font-bold text-[#ff5a36]">02</span>
                    <span className="font-mono text-[10px] font-semibold tracking-wider text-white uppercase">
                      COMPUTATIONAL RECONSTRUCTION
                    </span>
                  </div>

                  {/* Reconstruction Optical Slabs Container */}
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-black border border-white/10 group flex items-center justify-center">
                    <Image
                      src="/images/optical_slabs.png"
                      alt="Multi-scale neural optical inversion layers"
                      fill
                      sizes="(max-width: 768px) 100vw, 300px"
                      className="object-contain p-1 group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>

                {/* Footer specs */}
                <div className="flex items-start justify-between text-[9px] font-mono text-[#8e8a80] mt-3 pt-2 border-t border-white/5">
                  <div>
                    <div className="text-white/70">INVERSE PROBLEM</div>
                    <div className="text-[#8e8a80]">SOLVED WITH AI</div>
                    <div className="w-12 h-[2px] bg-[#ff5a36] mt-1 rounded-full shadow-[0_0_8px_#ff5a36]" />
                  </div>
                  <div className="text-right">
                    <div className="text-white/70">MULTI-SCALE</div>
                    <div className="text-[#8e8a80]">RECONSTRUCTION</div>
                  </div>
                </div>
              </div>

              {/* Card 03: Reconstructed Scene (The Kingfisher Bird) */}
              <div className="rounded-2xl border border-white/10 bg-[#0d0e12]/92 backdrop-blur-md p-3.5 sm:p-4 flex flex-col justify-between shadow-xl hover:border-white/20 transition-all">
                <div>
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <span className="font-mono text-xs font-bold text-[#ff5a36]">03</span>
                    <span className="font-mono text-[10px] font-semibold tracking-wider text-white uppercase">
                      RECONSTRUCTED SCENE
                    </span>
                  </div>

                  {/* Kingfisher Bird Image Container */}
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-black border border-white/10 group">
                    {/* Corner viewfinder brackets */}
                    <div className="absolute top-2 left-2 w-2.5 h-2.5 border-t-2 border-l-2 border-white/40 pointer-events-none z-10" />
                    <div className="absolute top-2 right-2 w-2.5 h-2.5 border-t-2 border-r-2 border-white/40 pointer-events-none z-10" />
                    <div className="absolute bottom-2 left-2 w-2.5 h-2.5 border-b-2 border-l-2 border-white/40 pointer-events-none z-10" />
                    <div className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b-2 border-r-2 border-white/40 pointer-events-none z-10" />

                    <Image
                      src="/images/bird.png"
                      alt="Reconstructed Kingfisher bird photo from lensless measurement"
                      fill
                      sizes="(max-width: 768px) 100vw, 300px"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>

                {/* Footer specs */}
                <div className="flex items-start justify-between text-[9px] font-mono text-[#8e8a80] mt-3 pt-2 border-t border-white/5">
                  <div>
                    <div className="text-white/80">RECONSTRUCTED IMAGE</div>
                    <div className="text-[#8e8a80]">256 × 256</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[#8bd450] font-semibold">PSNR 34.1 dB</div>
                    <div className="text-white/70">SSIM 0.92</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lower Row: 4 Feature / Overview Cards (Earth Horizon Card + 3 Standard Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 mt-8 sm:mt-10">
          {/* Card 1: Wide Earth Sunrise Horizon Card (Spans 6 of 12 columns) */}
          <div className="lg:col-span-6 rounded-2xl border border-white/10 overflow-hidden relative min-h-[220px] sm:min-h-[240px] p-6 sm:p-7 flex flex-col justify-between shadow-2xl group">
            {/* Background Image: Earth Horizon */}
            <div className="absolute inset-0 z-0">
              <Image
                src="/images/earth_horizon.png"
                alt="Earth sunrise horizon in deep space"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              {/* Dark gradient overlay for text contrast on the left side */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#07080a] via-[#07080a]/85 to-transparent" />
            </div>

            {/* Left Content */}
            <div className="relative z-10 max-w-xs sm:max-w-sm">
              <div className="w-7 h-[3px] bg-[#ff5a36] rounded-full mb-4" />

              <h2 className="font-serif text-2xl sm:text-3xl lg:text-[34px] text-white font-normal leading-[1.15] tracking-tight">
                From<br />
                measurements<br />
                to meaning.
              </h2>

              <p className="text-[11px] sm:text-xs text-[#c4c0b4] mt-2 font-sans leading-relaxed">
                Computational imaging<br />
                for a brighter, clearer world.
              </p>

              <div className="mt-5">
                <button
                  type="button"
                  onClick={onStartExperiment}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/20 bg-black/50 hover:bg-black/80 hover:border-white/40 text-white text-[10px] font-mono tracking-wider transition-all cursor-pointer"
                >
                  <Play className="w-2.5 h-2.5 fill-white text-white" />
                  <span>WATCH FILM</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </button>
              </div>
            </div>

            {/* Right Side Vertical Tracked Typography */}
            <div className="absolute right-6 sm:right-8 top-1/2 -translate-y-1/2 hidden sm:flex flex-col text-right font-mono text-[8px] sm:text-[9px] tracking-[0.2em] text-[#8e8a80] leading-[1.8] z-10 pointer-events-none">
              <div>MORE INFORMATION</div>
              <div>FEWER OPTICS</div>
              <div>BIGGER POSSIBILITIES</div>
              <div className="my-1.5 text-white/20">—————</div>
              <div>A CLEARER</div>
              <div>TOMORROW</div>
              <div>THROUGH AI.</div>
            </div>
          </div>

          {/* Card 2: No Lens. New Possibilities. (Spans 2 of 12 columns) */}
          <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-[#0c0d10]/95 backdrop-blur-md p-5 sm:p-6 flex flex-col justify-between hover:border-white/25 transition-all shadow-xl">
            <div>
              {/* Concentric Aperture Circles Icon */}
              <div className="w-8 h-8 flex items-center justify-center text-white/80">
                <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="16" cy="16" r="13" />
                  <circle cx="16" cy="16" r="7" />
                </svg>
              </div>

              <h3 className="text-xs sm:text-[13px] font-bold text-white tracking-wide mt-5 leading-snug">
                NO LENS.<br />
                NEW POSSIBILITIES.
              </h3>

              <p className="text-[11px] text-[#8e8a80] mt-2 leading-relaxed">
                Compact, robust imaging for the real world.
              </p>
            </div>

            <a
              href="#lab"
              className="mt-6 text-[10px] font-mono uppercase tracking-wider text-[#d7d2c7] hover:text-[#ff5a36] flex items-center gap-1 transition-colors cursor-pointer"
            >
              LEARN MORE <ArrowRight className="w-3 h-3" />
            </a>
          </div>

          {/* Card 3: AI Native Optics. (Spans 2 of 12 columns) */}
          <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-[#0c0d10]/95 backdrop-blur-md p-5 sm:p-6 flex flex-col justify-between hover:border-white/25 transition-all shadow-xl">
            <div>
              {/* 3x3 Dot Matrix Sensor Icon */}
              <div className="w-8 h-8 flex items-center justify-center text-white/80">
                <svg className="w-7 h-7" viewBox="0 0 32 32" fill="currentColor">
                  <circle cx="10" cy="10" r="1.5" />
                  <circle cx="16" cy="10" r="1.5" />
                  <circle cx="22" cy="10" r="1.5" />
                  <circle cx="10" cy="16" r="1.5" />
                  <circle cx="16" cy="16" r="2.2" className="text-[#ff5a36]" />
                  <circle cx="22" cy="16" r="1.5" />
                  <circle cx="10" cy="22" r="1.5" />
                  <circle cx="16" cy="22" r="1.5" />
                  <circle cx="22" cy="22" r="1.5" />
                </svg>
              </div>

              <h3 className="text-xs sm:text-[13px] font-bold text-white tracking-wide mt-5 leading-snug">
                AI NATIVE<br />
                OPTICS.
              </h3>

              <p className="text-[11px] text-[#8e8a80] mt-2 leading-relaxed">
                End-to-end reconstruction from physical measurements.
              </p>
            </div>

            <a
              href="#pipeline"
              className="mt-6 text-[10px] font-mono uppercase tracking-wider text-[#d7d2c7] hover:text-[#ff5a36] flex items-center gap-1 transition-colors cursor-pointer"
            >
              SEE HOW <ArrowRight className="w-3 h-3" />
            </a>
          </div>

          {/* Card 4: Real-World Impact. (Spans 2 of 12 columns) */}
          <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-[#0c0d10]/95 backdrop-blur-md p-5 sm:p-6 flex flex-col justify-between hover:border-white/25 transition-all shadow-xl">
            <div>
              {/* Intersecting Circles Icon */}
              <div className="w-8 h-8 flex items-center justify-center text-white/80">
                <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="16" r="8" />
                  <circle cx="20" cy="16" r="8" />
                </svg>
              </div>

              <h3 className="text-xs sm:text-[13px] font-bold text-white tracking-wide mt-5 leading-snug">
                REAL-WORLD<br />
                IMPACT.
              </h3>

              <p className="text-[11px] text-[#8e8a80] mt-2 leading-relaxed">
                From healthcare to space, a clearer tomorrow.
              </p>
            </div>

            <a
              href="#applications"
              className="mt-6 text-[10px] font-mono uppercase tracking-wider text-[#d7d2c7] hover:text-[#ff5a36] flex items-center gap-1 transition-colors cursor-pointer"
            >
              OUR VISION <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Bottom Bar: LENSLESS.AI / 2026 + IMAGINE A MORE PERCEPTIVE TOMORROW */}
        <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono tracking-[0.22em] text-[#6e6a62] mt-8 pt-4 border-t border-white/10">
          <div>LENSLESS.AI&nbsp;&nbsp;/&nbsp;&nbsp;2026</div>
          <div className="hidden sm:block">IMAGINE A MORE PERCEPTIVE TOMORROW.</div>
        </div>
      </div>
    </section>
  );
};
