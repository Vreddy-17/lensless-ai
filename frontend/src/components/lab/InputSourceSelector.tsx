'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Camera, Database, FileImage, Radio, Upload } from 'lucide-react';
import { OperatingMode, SampleDataset } from '@/types';
import { SAMPLE_DATASETS } from '@/lib/data/sample-datasets';

interface InputSourceSelectorProps {
  mode: OperatingMode;
  setMode: (mode: OperatingMode) => void;
  selectedSample: SampleDataset | null;
  onSelectSample: (sample: SampleDataset) => void;
  onCustomImageLoaded: (dataUrl: string, hasGroundTruth: boolean, measurementUrl?: string) => void;
}

type Tab = 'dataset' | 'simulation' | 'webcam' | 'raw_measurement';

const tabs: { id: Tab; num: string; title: string; icon: React.ReactNode; desc: string }[] = [
  { id: 'dataset', num: 'A', title: 'Dataset pair', icon: <Database className="w-4 h-4" />, desc: 'Measurement + ground truth' },
  { id: 'simulation', num: 'B', title: 'Scene upload', icon: <FileImage className="w-4 h-4" />, desc: 'Generate simulated measurement' },
  { id: 'webcam', num: 'C', title: 'Webcam frame', icon: <Camera className="w-4 h-4" />, desc: 'Live source, simulated optics' },
  { id: 'raw_measurement', num: 'D', title: 'Raw measurement', icon: <Radio className="w-4 h-4" />, desc: 'No reference image required' },
];

export const InputSourceSelector: React.FC<InputSourceSelectorProps> = ({
  mode,
  setMode,
  selectedSample,
  onSelectSample,
  onCustomImageLoaded,
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('dataset');
  const [dragOver, setDragOver] = useState(false);
  const [webcamStream, setWebcamStream] = useState<MediaStream | null>(null);
  const [webcamError, setWebcamError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const simInput = useRef<HTMLInputElement>(null);
  const rawInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (activeTab !== 'webcam' && webcamStream) {
      webcamStream.getTracks().forEach((track) => track.stop());
    }
  }, [activeTab, webcamStream]);

  const chooseTab = async (tab: Tab) => {
    setActiveTab(tab);
    if (tab === 'dataset') setMode('DATASET');
    if (tab === 'simulation' || tab === 'webcam') setMode('SIMULATION');
    if (tab === 'raw_measurement') setMode('RAW_MEASUREMENT');
    if (tab === 'webcam') {
      setWebcamError(null);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 960, height: 720 } });
        setWebcamStream(stream);
        requestAnimationFrame(() => {
          if (videoRef.current) videoRef.current.srcObject = stream;
        });
      } catch {
        setWebcamError('Camera access was not granted. You can continue with image upload or dataset mode.');
      }
    }
  };

  const readFile = (file: File, groundTruth: boolean) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const value = event.target?.result;
      if (typeof value !== 'string') return;
      if (groundTruth) {
        setMode('SIMULATION');
        onCustomImageLoaded(value, true);
      } else {
        setMode('RAW_MEASUREMENT');
        onCustomImageLoaded(value, false, value);
      }
    };
    reader.readAsDataURL(file);
  };

  const capture = () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const vw = video.videoWidth || 640;
    const vh = video.videoHeight || 480;
    const side = Math.min(vw, vh);
    ctx.drawImage(video, (vw - side) / 2, (vh - side) / 2, side, side, 0, 0, 512, 512);
    onCustomImageLoaded(canvas.toDataURL('image/png'), true);
    setMode('SIMULATION');
  };

  return (
    <div className="instrument-frame border border-white/15">
      <div className="grid lg:grid-cols-[270px_1fr]">
        <aside className="border-b lg:border-b-0 lg:border-r border-white/15">
          <div className="p-4 border-b border-white/15">
            <div className="tech-label"><strong>INPUT CHANNEL</strong></div>
            <p className="text-[11px] text-[#77736b] mt-2">Choose what enters the computational imaging pipeline.</p>
          </div>
          <div>
            {tabs.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  type="button"
                  key={tab.id}
                  onClick={() => chooseTab(tab.id)}
                  className={`w-full min-h-[76px] grid grid-cols-[30px_1fr_20px] items-center text-left px-4 border-b border-white/10 transition-colors ${active ? 'bg-[#efede6] text-[#0a0a09]' : 'hover:bg-white/[.025] text-[#b8b4aa]'}`}
                >
                  <span className={`font-mono text-[9px] ${active ? 'text-[#ff5b35]' : 'text-[#5f5b53]'}`}>{tab.num}</span>
                  <span>
                    <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.1em]">{tab.icon}{tab.title}</span>
                    <span className={`block text-[10px] mt-1 ${active ? 'text-[#5a574f]' : 'text-[#68645c]'}`}>{tab.desc}</span>
                  </span>
                  <span className={`w-2 h-2 ${active ? 'bg-[#ff5b35]' : 'border border-[#4f4c45]'}`} />
                </button>
              );
            })}
          </div>
          <div className="p-4">
            <div className="tech-label">ACTIVE MODE</div>
            <div className="font-mono text-xs mt-2 text-[#efede6]">{mode.replace('_', ' ')}</div>
          </div>
        </aside>

        <div className="min-h-[360px]">
          {activeTab === 'dataset' && (
            <div className="p-4 sm:p-6">
              <div className="flex items-end justify-between gap-4 pb-4 border-b border-white/15">
                <div>
                  <div className="tech-label"><strong>PAIRED DATA / REFERENCE MODE</strong></div>
                  <p className="text-xs text-[#8e8a80] mt-2 max-w-2xl">Use a lensless measurement together with its reference image so reconstruction quality can be evaluated.</p>
                </div>
                <span className="badge-tech" data-variant="ok">GT AVAILABLE</span>
              </div>

              <div className="grid md:grid-cols-3 mt-4 border-t border-l border-white/15">
                {SAMPLE_DATASETS.map((sample, index) => {
                  const selected = selectedSample?.id === sample.id;
                  return (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => { setMode('DATASET'); onSelectSample(sample); }}
                      className={`text-left border-r border-b border-white/15 p-3 sm:p-4 transition-colors ${selected ? 'bg-white/[.055]' : 'hover:bg-white/[.025]'}`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-mono text-[9px] text-[#77736b]">PAIR / {String(index + 1).padStart(2, '0')}</span>
                        <span className={`w-2 h-2 ${selected ? 'bg-[#ff5b35]' : 'border border-[#555149]'}`} />
                      </div>
                      <div className="grid grid-cols-2 gap-px bg-white/15 border border-white/15">
                        <div className="relative aspect-square bg-[#050504] overflow-hidden">
                          {sample.groundTruthUrl && <img src={sample.groundTruthUrl} alt="Reference scene" className="w-full h-full object-cover" />}
                          <span className="image-stage-label">x / ref</span>
                        </div>
                        <div className="relative aspect-square bg-[#050504] overflow-hidden">
                          <img src={sample.measurementUrl} alt="Lensless measurement" className="w-full h-full object-cover" />
                          <span className="image-stage-label">y / meas</span>
                        </div>
                      </div>
                      <h4 className="text-xs font-medium text-[#efede6] mt-3 line-clamp-1">{sample.name}</h4>
                      <p className="text-[10px] leading-4 text-[#77736b] mt-1 line-clamp-2">{sample.description}</p>
                    </button>
                  );
                })}
              </div>
              <p className="text-[9px] text-[#5f5b53] font-mono mt-3">Note: bundled visual samples are interface/demo assets; connect verified DLMD files for measured benchmark claims.</p>
            </div>
          )}

          {activeTab === 'simulation' && (
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                  <div className="tech-label"><strong>SIMULATED OPTICAL ENCODING</strong></div>
                  <p className="text-xs text-[#8e8a80] mt-2">Upload a conventional image. The backend forward model produces a software lensless measurement.</p>
                </div>
                <span className="badge-tech" data-variant="warn">SIMULATION</span>
              </div>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); const file = e.dataTransfer.files?.[0]; if (file) readFile(file, true); }}
                onClick={() => simInput.current?.click()}
                className={`min-h-[260px] measurement-surface grid place-items-center cursor-pointer transition-colors ${dragOver ? 'bg-[#18110e]' : ''}`}
              >
                <input ref={simInput} type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && readFile(e.target.files[0], true)} />
                <div className="text-center max-w-md px-8">
                  <Upload className="w-7 h-7 mx-auto text-[#ff5b35]" />
                  <div className="font-mono text-[11px] uppercase tracking-[.12em] mt-5">Drop scene image / click to browse</div>
                  <p className="text-[11px] leading-5 text-[#77736b] mt-2">Accepted image becomes x. The simulator applies the approximate forward model y = Hx + n.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'webcam' && (
            <div className="p-4 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-white/15">
                <div>
                  <div className="tech-label"><strong>LIVE COMPUTATIONAL DEMO</strong></div>
                  <p className="text-xs text-[#8e8a80] mt-2 max-w-2xl">The Mac webcam remains a normal lensed camera. A captured frame is sent through simulated lensless encoding before reconstruction.</p>
                </div>
                <span className="badge-tech" data-variant="warn">NOT A PHYSICAL LENSLESS CAMERA</span>
              </div>
              {webcamError ? (
                <div className="mt-4 border border-[#ff6666]/40 p-5 text-xs text-[#ff8b8b]">{webcamError}</div>
              ) : (
                <div className="mt-4 grid md:grid-cols-[minmax(0,1fr)_220px] border border-white/15">
                  <div className="relative min-h-[330px] bg-black overflow-hidden">
                    <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover grayscale" />
                    <span className="image-stage-label">LIVE / CONVENTIONAL FRAME</span>
                  </div>
                  <div className="p-5 border-t md:border-t-0 md:border-l border-white/15 flex flex-col justify-between">
                    <div>
                      <div className="tech-label">PIPELINE</div>
                      <div className="font-mono text-[10px] leading-7 mt-3 text-[#b8b4aa]">FRAME<br/>↓<br/>SIMULATE H<br/>↓<br/>MEASUREMENT y<br/>↓<br/>RECONSTRUCT x̂</div>
                    </div>
                    <button type="button" onClick={capture} className="btn-primary mt-5"><Camera className="w-4 h-4" /> Capture frame</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'raw_measurement' && (
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                  <div className="tech-label"><strong>RAW MEASUREMENT INPUT</strong></div>
                  <p className="text-xs text-[#8e8a80] mt-2">Upload an encoded measurement directly. PSNR / SSIM stay unavailable unless a matching reference image is supplied.</p>
                </div>
                <span className="badge-tech" data-variant="data">y ONLY</span>
              </div>
              <button type="button" onClick={() => rawInput.current?.click()} className="w-full min-h-[260px] measurement-surface grid place-items-center">
                <input ref={rawInput} type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && readFile(e.target.files[0], false)} />
                <div className="text-center max-w-md px-8">
                  <Radio className="w-7 h-7 mx-auto text-[#5d73ff]" />
                  <div className="font-mono text-[11px] uppercase tracking-[.12em] mt-5">Select encoded measurement</div>
                  <p className="text-[11px] leading-5 text-[#77736b] mt-2">No reference is assumed. The UI will not invent full-reference metrics.</p>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
