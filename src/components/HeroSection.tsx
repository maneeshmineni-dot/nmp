import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring } from "motion/react";
import { Building2, ChevronDown } from "lucide-react";

// ─── Animated counter hook ──────────────────────────────────────
function useCountUp(target: number, inView: boolean, duration = 1.8) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start: number | null = null;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target, duration]);
  return display;
}

// ─── Building silhouette SVG ────────────────────────────────────
function BuildingSilhouette() {
  return (
    <svg
      viewBox="0 0 900 420"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-hidden="true"
    >
      {/* Far background skyline */}
      <rect x="0"   y="280" width="60"  height="140" fill="currentColor" opacity="0.06" rx="2"/>
      <rect x="65"  y="240" width="80"  height="180" fill="currentColor" opacity="0.07" rx="2"/>
      <rect x="150" y="200" width="55"  height="220" fill="currentColor" opacity="0.08" rx="2"/>
      <rect x="210" y="260" width="45"  height="160" fill="currentColor" opacity="0.05" rx="2"/>
      <rect x="780" y="270" width="60"  height="150" fill="currentColor" opacity="0.06" rx="2"/>
      <rect x="790" y="220" width="80"  height="200" fill="currentColor" opacity="0.07" rx="2"/>
      <rect x="840" y="250" width="55"  height="170" fill="currentColor" opacity="0.05" rx="2"/>

      {/* Central towers */}
      <rect x="320" y="80"  width="100" height="340" fill="currentColor" opacity="0.12" rx="3"/>
      <rect x="360" y="40"  width="25"  height="50"  fill="currentColor" opacity="0.12" rx="1"/>

      <rect x="440" y="50"  width="130" height="370" fill="currentColor" opacity="0.15" rx="3"/>
      <rect x="493" y="20"  width="22"  height="40"  fill="currentColor" opacity="0.15" rx="1"/>

      <rect x="585" y="100" width="90"  height="320" fill="currentColor" opacity="0.10" rx="3"/>
      <rect x="620" y="70"  width="18"  height="38"  fill="currentColor" opacity="0.10" rx="1"/>

      {/* Window grids - main tower */}
      {Array.from({ length: 8 }).map((_, row) =>
        Array.from({ length: 4 }).map((_, col) => (
          <rect
            key={`w1-${row}-${col}`}
            x={452 + col * 22}
            y={70 + row * 36}
            width="14"
            height="20"
            fill="#f59e0b"
            opacity={Math.random() > 0.4 ? 0.18 : 0.06}
            rx="1"
          />
        ))
      )}
      {/* Window grids - left tower */}
      {Array.from({ length: 7 }).map((_, row) =>
        Array.from({ length: 3 }).map((_, col) => (
          <rect
            key={`w2-${row}-${col}`}
            x={332 + col * 22}
            y={100 + row * 36}
            width="14"
            height="20"
            fill="#f59e0b"
            opacity={Math.random() > 0.4 ? 0.14 : 0.05}
            rx="1"
          />
        ))
      )}

      {/* Ground horizon */}
      <rect x="0" y="415" width="900" height="5" fill="currentColor" opacity="0.15" rx="1"/>
      <rect x="0" y="410" width="900" height="3" fill="#f59e0b" opacity="0.25" rx="1"/>
    </svg>
  );
}

// ─── Stat Counter Card ──────────────────────────────────────────
interface StatProps {
  value: number;
  suffix: string;
  prefix?: string;
  label: string;
  delay: number;
}

function StatCounter({ value, suffix, prefix = "", label, delay }: StatProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const count = useCountUp(value, inView);
  const formattedCount = Number.isInteger(value)
    ? Math.round(count).toLocaleString("en-IN")
    : count.toFixed(1);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center px-6 py-4 min-w-[120px]"
    >
      <span className="text-3xl md:text-4xl font-black font-display tracking-tight text-white leading-none">
        {prefix}{formattedCount}{suffix}
      </span>
      <span className="text-amber-400/80 text-[10px] font-mono uppercase tracking-widest mt-2.5 text-center leading-tight">
        {label}
      </span>
    </motion.div>
  );
}

// ─── Main Hero Component ────────────────────────────────────────
export default function HeroSection() {
  const words = ["Quality,", "Affordable", "Homes", "for", "the", "Upward", "Mobile", "Professional."];

  return (
    <section
      id="home"
      className="relative w-full min-h-[82vh] flex flex-col items-center justify-center overflow-hidden bg-slate-950 rounded-3xl border border-slate-900 shadow-sm"
    >
      {/* Ambient glow blobs */}
      <div
        className="ambient-glow absolute -top-32 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(245,158,11,0.18) 0%, transparent 70%)" }}
      />
      <div
        className="ambient-glow absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(245,158,11,0.10) 0%, transparent 70%)", animationDelay: "3s" }}
      />

      {/* Building silhouette */}
      <div className="absolute bottom-0 left-0 right-0 h-[42%] text-white pointer-events-none select-none">
        <BuildingSilhouette />
      </div>

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 text-center flex flex-col items-center gap-6">

        {/* Eyebrow chip */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "backOut" }}
          className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-mono font-semibold tracking-widest uppercase px-4 py-2 rounded-full"
        >
          Leading Construction &amp; Civil Engineering in Telangana
        </motion.div>

        {/* Animated headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black font-display tracking-tight text-white leading-[1.08] max-w-4xl">
          {words.map((word, i) => (
            <motion.span
              key={`${word}-${i}`}
              initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.15 + i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className={`inline-block mr-[0.25em] ${word === "Homes" || word === "Professional." ? "text-amber-400" : ""}`}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        {/* Sub-tagline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.6, ease: "easeOut" }}
          className="text-slate-400 text-sm md:text-base max-w-3xl leading-relaxed font-sans"
        >
          We build contemporary, value-for-money spaces that reflect warmth and a sense of belonging. With comprehensive design, project management, and construction services, we deliver your vision on time, every time.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.5 }}
          className="flex flex-wrap justify-center gap-3.5 mt-2"
        >
          <button
            onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs py-3 px-6 rounded-xl cursor-pointer shadow-md transition-all duration-200"
          >
            Explore Our Projects
          </button>
          <button
            onClick={() => document.getElementById("our-services")?.scrollIntoView({ behavior: "smooth" })}
            className="bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs py-3 px-6 rounded-xl cursor-pointer transition-all duration-200"
          >
            View Our Services
          </button>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.15, duration: 0.6 }}
          className="mt-6 flex flex-wrap justify-center divide-x divide-white/10 bg-white/5 backdrop-blur-xs border border-white/10 rounded-2xl overflow-hidden"
        >
          <StatCounter value={1.7} suffix=" Lakh+ sq.ft" label="Completed Construction" delay={1.25} />
          <StatCounter value={100} suffix="+" label="Satisfied Customers" delay={1.35} />
          <StatCounter value={8} suffix="+" label="Landmark Projects" delay={1.45} />
          <StatCounter value={2017} suffix="" label="Year Established" delay={1.55} />
        </motion.div>
      </div>
    </section>
  );
}
