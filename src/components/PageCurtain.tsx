import React, { useState, useEffect } from "react";
import { ArrowDown } from "lucide-react";

interface PageCurtainProps {
  onOpenComplete?: () => void;
}

export default function PageCurtain({ onOpenComplete }: PageCurtainProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hasOpened, setHasOpened] = useState(false);

  const unlock = () => {
    setHasOpened(true);
    if (onOpenComplete) {
      onOpenComplete();
    }
  };

  useEffect(() => {
    if (hasOpened) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const threshold = 180; // reduced from 550 for reliability across screen sizes
      const progress = Math.min(scrollY / threshold, 1);
      
      setScrollProgress(progress);

      // Check if user reached threshold OR scrolled to the absolute bottom of the page
      const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 25;

      if (progress >= 1 || isAtBottom) {
        unlock();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run once to catch initial state
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasOpened, onOpenComplete]);

  if (hasOpened) return null;

  // Compute transform styles based on scrollProgress
  const leftRotation = -110 * scrollProgress;
  const leftX = -55 * scrollProgress; // clears the screen width nicely
  const rightRotation = 110 * scrollProgress;
  const rightX = 55 * scrollProgress; // clears the screen width nicely
  const opacity = 1 - scrollProgress;

  return (
    <div
      className="fixed inset-0 z-[100] flex bg-slate-950/40 overflow-hidden select-none pointer-events-none"
      style={{ 
        perspective: "2000px",
        opacity: opacity,
        transition: "opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1)"
      }}
    >
      {/* Ambient Lighting Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.06)_0%,transparent_70%)] pointer-events-none" />

      {/* Left Curtain Door Panel */}
      <div
        style={{ 
          transform: `perspective(2000px) rotateY(${leftRotation}deg) translateX(${leftX}vw)`,
          transformOrigin: "left center",
          transition: "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
          boxShadow: "15px 0 40px rgba(0,0,0,0.8)"
        }}
        className="w-1/2 h-full bg-cyan-950/75 backdrop-blur-2xl border-r border-amber-500/25 flex flex-col justify-between p-8 md:p-12 relative"
      >
        {/* Real Architectural Vellum Grain Texture & Blur */}
        <div className="absolute inset-0 opacity-[0.22] mix-blend-overlay pointer-events-none bg-[url('data:image/svg+xml;utf8,<svg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22><filter id=%22noise%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/></filter><rect width=%22100%%22 height=%22100%%22 filter=%22url(%23noise)%22/></svg>')] bg-repeat" />
        
        {/* Elegant Blueprint Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(rgba(245,158,11,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.4)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 top-[20%] opacity-[0.03] bg-[radial-gradient(ellipse_at_bottom,rgba(245,158,11,0.25)_0%,transparent_80%)] pointer-events-none" />

        {/* Left Portion of Center Emblem */}
        <div 
          onClick={unlock}
          className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center justify-end h-44 pointer-events-auto cursor-pointer z-20"
        >
          <div className="w-22 h-44 rounded-l-full border-y border-l border-amber-500/25 bg-slate-950/90 flex items-center justify-end pr-1 shadow-inner relative">
            {/* Rotating architectural compass pattern */}
            <div className="absolute -right-11 w-22 h-22 rounded-full border border-dashed border-amber-500/20 animate-[spin_40s_linear_infinite]" />
            <span className="font-serif text-5xl font-black tracking-tighter text-amber-400 mr-2">
              NM
            </span>
          </div>
          {/* Left Handle Bar */}
          <div className="w-1 h-36 bg-gradient-to-b from-amber-600/40 via-amber-400 to-amber-600/40 rounded-l shadow-md" />
        </div>
      </div>

      {/* Right Curtain Door Panel */}
      <div
        style={{ 
          transform: `perspective(2000px) rotateY(${rightRotation}deg) translateX(${rightX}vw)`,
          transformOrigin: "right center",
          transition: "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
          boxShadow: "-15px 0 40px rgba(0,0,0,0.8)"
        }}
        className="w-1/2 h-full bg-cyan-950/75 backdrop-blur-2xl border-l border-amber-500/25 flex flex-col justify-between p-8 md:p-12 relative"
      >
        {/* Real Architectural Vellum Grain Texture & Blur */}
        <div className="absolute inset-0 opacity-[0.22] mix-blend-overlay pointer-events-none bg-[url('data:image/svg+xml;utf8,<svg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22><filter id=%22noise%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/></filter><rect width=%22100%%22 height=%22100%%22 filter=%22url(%23noise)%22/></svg>')] bg-repeat" />

        {/* Elegant Blueprint Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(rgba(245,158,11,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.4)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 top-[20%] opacity-[0.03] bg-[radial-gradient(ellipse_at_bottom,rgba(245,158,11,0.25)_0%,transparent_80%)] pointer-events-none" />

        {/* Right Portion of Center Emblem */}
        <div 
          onClick={unlock}
          className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center justify-start h-44 pointer-events-auto cursor-pointer z-20"
        >
          {/* Right Handle Bar */}
          <div className="w-1 h-36 bg-gradient-to-b from-amber-600/40 via-amber-400 to-amber-600/40 rounded-r shadow-md" />
          <div className="w-22 h-44 rounded-r-full border-y border-r border-amber-500/25 bg-slate-950/90 flex items-center justify-start pl-2 shadow-inner relative">
            {/* Rotating plan pattern */}
            <div className="absolute -left-11 w-22 h-22 rounded-full border border-dashed border-amber-500/20 animate-[spin_40s_linear_infinite]" />
            <span className="font-serif text-5xl font-black tracking-tighter text-white">
              E
            </span>
          </div>
        </div>
      </div>

      {/* Subtle Scroll Instruction Indicator */}
      <div 
        onClick={unlock}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-30 pointer-events-auto cursor-pointer font-mono"
        style={{ opacity: Math.max(1 - scrollProgress * 2.5, 0) }}
      >
        <span className="text-[10px] text-amber-500 font-bold tracking-[0.25em] uppercase animate-pulse">
          Scroll Down or Click to Unlock
        </span>
        <ArrowDown className="w-4 h-4 text-amber-500/60 animate-bounce" />
      </div>
    </div>
  );
}
