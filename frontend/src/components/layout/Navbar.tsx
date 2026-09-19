'use client';

import React, { useEffect, useState } from 'react';
import { ArrowUpRight, Play, Search } from 'lucide-react';

interface NavbarProps {
  onOpenPresentation: () => void;
  onLaunchDemo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenPresentation, onLaunchDemo }) => {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { num: '01', label: 'SCIENCE', href: '#overview' },
    { num: '02', label: 'TECHNOLOGY', href: '#lab' },
    { num: '03', label: 'IMPACT', href: '#applications' },
    { num: '04', label: 'ABOUT', href: '#research' },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#07080a]/90 backdrop-blur-md border-b border-white/10' : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-12 h-20 flex items-center justify-between gap-6">
        {/* Logo Section */}
        <button
          type="button"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none"
        >
          <div className="w-5 h-5 bg-[#ff5a36] rounded-[3px] shadow-[0_0_12px_rgba(255,90,54,0.45)] group-hover:scale-105 transition-transform" />
          <div className="flex flex-col">
            <span className="font-mono text-xs sm:text-sm font-bold tracking-[0.22em] text-white">
              LENSLESS.AI
            </span>
            <span className="font-mono text-[8px] sm:text-[9px] tracking-[0.22em] text-[#8e8a80]">
              PRISMTECH / OPTICS
            </span>
          </div>
        </button>

        {/* Center Nav Links */}
        <nav className="hidden lg:flex items-center gap-8" aria-label="Primary navigation">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="group flex items-center gap-2 font-mono text-[11px] tracking-[0.15em] text-[#d6d3cb] hover:text-white transition-colors"
            >
              <span className="text-[#ff5a36] font-bold">{link.num}</span>
              <span className="group-hover:tracking-[0.18em] transition-all">{link.label}</span>
            </a>
          ))}
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Search Trigger */}
          <div className="relative">
            {searchOpen ? (
              <div className="flex items-center bg-[#15171b] border border-white/20 rounded-full px-3 py-1 animate-fadeIn">
                <Search className="w-3.5 h-3.5 text-[#8e8a80] mr-2" />
                <input
                  type="text"
                  placeholder="Search optics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  onBlur={() => !searchQuery && setSearchOpen(false)}
                  className="bg-transparent text-xs text-white placeholder-[#6e6b62] focus:outline-none w-28 sm:w-40"
                />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#8e8a80] hover:text-white hover:bg-white/5 transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="w-[1px] h-4 bg-white/20 hidden sm:block" />

          {/* Watch Demo Button */}
          <button
            type="button"
            onClick={onOpenPresentation}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40 text-white font-mono text-[11px] font-medium tracking-wider transition-all cursor-pointer"
          >
            <span className="w-4 h-4 rounded-full border border-white/30 flex items-center justify-center bg-white/10">
              <Play className="w-2 h-2 fill-white text-white ml-0.5" />
            </span>
            <span className="hidden sm:inline">WATCH DEMO</span>
          </button>

          {/* Run Demo Solid White Pill */}
          <button
            type="button"
            onClick={onLaunchDemo}
            className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-white text-black font-mono text-[11px] font-bold tracking-wider hover:bg-[#efede6] hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] transition-all cursor-pointer"
          >
            RUN DEMO
            <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </header>
  );
};
