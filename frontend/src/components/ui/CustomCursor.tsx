'use client';

import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const move = (event: MouseEvent) => {
      setPosition({ x: event.clientX, y: event.clientY });
      setVisible(true);
      const target = event.target as HTMLElement | null;
      setActive(Boolean(target?.closest('button, a, input, select, [role="button"]')));
    };
    const leave = () => setVisible(false);
    window.addEventListener('mousemove', move);
    document.documentElement.addEventListener('mouseleave', leave);
    return () => {
      window.removeEventListener('mousemove', move);
      document.documentElement.removeEventListener('mouseleave', leave);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed z-[100] hidden lg:block mix-blend-difference"
      style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)` }}
    >
      <div
        className={`absolute -translate-x-1/2 -translate-y-1/2 border border-white transition-all duration-150 ${
          active ? 'w-8 h-8 rotate-45' : 'w-4 h-4'
        }`}
      />
      <span className="absolute -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-white" />
    </div>
  );
};
