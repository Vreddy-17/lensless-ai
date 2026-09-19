'use client';

import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';

interface PresentationModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToLab: () => void;
}

export const PresentationModeModal: React.FC<PresentationModeModalProps> = ({ isOpen, onClose, onJumpToLab }) => {
  const [index, setIndex] = useState(0);

  const slides = [
    {
      eyebrow: '01 / PROBLEM',
      title: 'The measurement is not a normal photograph.',
      body: 'In conventional imaging, a lens forms a recognisable image on the sensor. In lensless computational imaging, an encoder such as a diffuser or coded mask can produce a measurement that looks unlike the original scene.',
      equation: 'SCENE → OPTICAL ENCODING → MEASUREMENT',
    },
    {
      eyebrow: '02 / OPTICS',
      title: 'This project belongs to computational imaging.',
      body: 'Our optics work is not optical fiber. It studies how scene light is encoded into measurements and how computation reconstructs useful visual information from those measurements.',
      equation: 'NORMAL: scene → lens → sensor → image',
    },
    {
      eyebrow: '03 / MODEL',
      title: 'We reason with a simplified forward model.',
      body: 'x is the original scene, H is the optical encoding operator, y is the lensless measurement, and n is noise. The inverse task is to estimate the scene from the measurement.',
      equation: 'y = Hx + n   →   fθ(y) = x̂',
    },
    {
      eyebrow: '04 / SOFTWARE MVP',
      title: 'The hackathon prototype requires no physical optical hardware.',
      body: 'A normal uploaded image or webcam frame can be passed through a software PSF-based forward model to create a simulated measurement. Real public lensless measurements can also be used as reconstruction input.',
      equation: 'INPUT → SIMULATE / MEASUREMENT → RECONSTRUCT',
    },
    {
      eyebrow: '05 / DATA',
      title: 'Paired lensless data makes supervised reconstruction possible.',
      body: 'The planned dataset path uses lensless measurements as model inputs and corresponding reference images as targets. The DLMD / DiffuserCam data direction provides paired measurement and ground-truth information for training and evaluation.',
      equation: 'MEASUREMENT y + GROUND TRUTH x → TRAINING PAIR',
    },
    {
      eyebrow: '06 / RECONSTRUCTION',
      title: 'Start with a classical baseline, then evaluate the learned model.',
      body: 'A simple classical reconstruction gives the team a reference point. The AI model is then trained and compared using measured outputs rather than assumed superiority.',
      equation: 'BASELINE ↔ AI MODEL → COMPARE OUTPUTS',
    },
    {
      eyebrow: '07 / VERIFY',
      title: 'Reconstruction quality is reported only when it can be justified.',
      body: 'PSNR and SSIM require a matching reference image. Raw measurements without ground truth should not display fabricated full-reference metrics. Confidence is also optional until the ML backend provides a defensible method.',
      equation: 'REFERENCE AVAILABLE? → PSNR / SSIM',
    },
    {
      eyebrow: '08 / USP',
      title: 'AI acts as the computational lens.',
      body: 'The key distinction is reconstruction versus enhancement. We are not simply improving an already formed photograph; we are estimating a scene from encoded optical information, then optionally restoring the reconstructed output.',
      equation: 'MEASUREMENT → RECONSTRUCTION → RESTORATION',
    },
  ];

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight') setIndex((value) => Math.min(slides.length - 1, value + 1));
      if (event.key === 'ArrowLeft') setIndex((value) => Math.max(0, value - 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose, slides.length]);

  if (!isOpen) return null;
  const slide = slides[index];

  return (
    <div className="fixed inset-0 z-[90] bg-[#0a0a09] text-[#efede6]">
      <div className="h-full page-shell flex flex-col py-5">
        <div className="min-h-14 border border-white/15 grid grid-cols-[1fr_auto] items-center">
          <div className="px-4 flex items-center gap-4">
            <span className="w-3 h-3 bg-[#ff5b35]" />
            <span className="font-mono text-[10px] tracking-[.14em]">LENSLESS.AI / REVIEW MODE</span>
          </div>
          <button type="button" onClick={onClose} className="w-14 h-14 border-l border-white/15 grid place-items-center hover:bg-[#efede6] hover:text-[#0a0a09] transition-colors" aria-label="Close presentation"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 grid lg:grid-cols-[190px_1fr] border-x border-b border-white/15 min-h-0">
          <aside className="border-b lg:border-b-0 lg:border-r border-white/15 p-4 sm:p-5 flex lg:flex-col justify-between gap-4 overflow-x-auto">
            <div className="lg:space-y-1 flex lg:block">
              {slides.map((item, itemIndex) => (
                <button
                  type="button"
                  key={item.eyebrow}
                  onClick={() => setIndex(itemIndex)}
                  className={`min-w-[74px] lg:min-w-0 lg:w-full lg:min-h-[46px] px-2 lg:px-3 text-left font-mono text-[9px] border-r lg:border-r-0 lg:border-b border-white/10 ${index === itemIndex ? 'bg-[#efede6] text-[#0a0a09]' : 'text-[#77736b] hover:text-white'}`}
                >
                  {String(itemIndex + 1).padStart(2, '0')}
                </button>
              ))}
            </div>
            <div className="hidden lg:block tech-label">ARROW KEYS / NAVIGATE<br />ESC / CLOSE</div>
          </aside>

          <main className="relative min-h-0 overflow-auto p-7 sm:p-12 lg:p-16 flex flex-col justify-between">
            <div>
              <div className="section-index">{slide.eyebrow}</div>
              <h2 className="text-[clamp(42px,6vw,94px)] leading-[.92] tracking-[-.06em] font-medium mt-8 max-w-5xl">{slide.title}</h2>
              <p className="text-base sm:text-xl leading-8 text-[#9a968c] max-w-3xl mt-10">{slide.body}</p>
            </div>

            <div className="mt-12">
              <div className="border-l-2 border-[#ff5b35] pl-6 font-mono text-sm sm:text-lg tracking-[.05em] text-[#efede6]">{slide.equation}</div>
              <div className="mt-12 flex flex-wrap items-center justify-between gap-4 pt-5 border-t border-white/15">
                <div className="font-mono text-[9px] text-[#5f5b53]">SLIDE {String(index + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}</div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setIndex((value) => Math.max(0, value - 1))} disabled={index === 0} className="btn-secondary"><ArrowLeft className="w-4 h-4" /> Previous</button>
                  {index === slides.length - 1 ? (
                    <button type="button" onClick={onJumpToLab} className="btn-primary">Open lab <ArrowRight className="w-4 h-4" /></button>
                  ) : (
                    <button type="button" onClick={() => setIndex((value) => Math.min(slides.length - 1, value + 1))} className="btn-primary">Next <ArrowRight className="w-4 h-4" /></button>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
