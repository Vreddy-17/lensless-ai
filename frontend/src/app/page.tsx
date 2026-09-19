'use client';

import React, { useState } from 'react';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/home/HeroSection';
import { ReconstructionLab } from '@/components/lab/ReconstructionLab';
import { OpticalExplorerScrolly } from '@/components/research/OpticalExplorerScrolly';
import { EquationExplorer } from '@/components/research/EquationExplorer';
import { ModelArchitectureViewer } from '@/components/research/ModelArchitectureViewer';
import { ApplicationsGrid } from '@/components/research/ApplicationsGrid';
import { PresentationModeModal } from '@/components/presentation/PresentationModeModal';
import { Footer } from '@/components/layout/Footer';

export default function Home() {
  const [presentationOpen, setPresentationOpen] = useState(false);
  const [demoTrigger, setDemoTrigger] = useState(false);

  const handleLaunchDemoFromNav = () => {
    // Scroll smoothly to the lab section and trigger demo
    const labEl = document.getElementById('lab');
    if (labEl) {
      labEl.scrollIntoView({ behavior: 'smooth' });
    }
    setDemoTrigger(true);
  };

  return (
    <main className="min-h-screen bg-[#0a0a09] text-[#efede6] instrument-grid relative">
      {/* Desktop Optical Cursor */}
      <CustomCursor />

      {/* Floating Transparent Glass Navbar */}
      <Navbar
        onOpenPresentation={() => setPresentationOpen(true)}
        onLaunchDemo={handleLaunchDemoFromNav}
      />

      {/* Hero Section with Interactive 3D WebGL Canvas */}
      <HeroSection
        onStartExperiment={() => {
          document.getElementById('lab')?.scrollIntoView({ behavior: 'smooth' });
        }}
        onExplorePipeline={() => {
          document.getElementById('pipeline')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Core Workstation: Reconstruction Lab */}
      <ReconstructionLab initialDemoTrigger={demoTrigger} />

      {/* Educational Narrative: How Lensless Imaging Works */}
      <OpticalExplorerScrolly />

      {/* Mathematical & Deep Learning Architecture Explorer */}
      <section id="research" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <EquationExplorer />
        <ModelArchitectureViewer />
      </section>

      {/* Frontier Applications */}
      <ApplicationsGrid />

      {/* Fullscreen Hackathon Judges Presentation Deck */}
      <PresentationModeModal
        isOpen={presentationOpen}
        onClose={() => setPresentationOpen(false)}
        onJumpToLab={() => {
          setPresentationOpen(false);
          document.getElementById('lab')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Scientific Research Footer */}
      <Footer />
    </main>
  );
}
