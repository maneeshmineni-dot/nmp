import React from "react";
import { Quote, Users, Sparkles, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";

export default function AboutSection() {
  return (
    <section
      id="about-us"
      className="py-16 md:py-24 bg-white dark:bg-slate-800/40 rounded-3xl border border-slate-100 dark:border-slate-700/50 p-6 md:p-12 shadow-sm overflow-hidden"
    >
      <div className="flex flex-col lg:flex-row gap-12 items-center">
        {/* Left Side: Content */}
        <div className="flex-1 space-y-8">
          <div className="space-y-3">
            <span className="text-xs text-amber-600 dark:text-amber-400 font-mono font-bold uppercase tracking-widest block">
              About NME Group
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white font-display tracking-tight leading-tight">
              Crafting Safe, Sustainable & contemporary Spaces
            </h2>
            <div className="w-16 h-1 bg-amber-500 rounded" />
          </div>

          {/* The Vision (Quote Box) */}
          <div className="relative bg-slate-50 dark:bg-slate-700/30 border-l-4 border-amber-500 rounded-xl p-6 md:p-8 shadow-xs">
            <Quote className="absolute right-4 top-4 w-12 h-12 text-amber-500/10 pointer-events-none" />
            <h4 className="text-xs text-amber-700 dark:text-amber-400 font-mono font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Our Vision
            </h4>
            <p className="text-slate-700 dark:text-slate-350 text-sm md:text-base italic leading-relaxed font-serif">
              "NME Group combines the experience and sagacity of the older generation with the dynamism and motivation of the younger one. We treat each new project as if it were our first, and each new customer with the enthusiasm of a beginner."
            </p>
          </div>

          {/* The Team */}
          <div className="space-y-3">
            <h4 className="text-xs text-amber-750 dark:text-amber-400 font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-amber-600 dark:text-amber-400" /> Professional Strength
            </h4>
            <p className="text-slate-650 dark:text-slate-400 text-sm leading-relaxed">
              Our operations are backed by highly dedicated engineers, proficient supervisors, and a vast network of skilled workers and specialized consultants. This synergistic network ensures precision execution across every phase of drafting, development, and inspection.
            </p>
          </div>

          {/* The Promise */}
          <div className="space-y-4">
            <h4 className="text-xs text-amber-750 dark:text-amber-400 font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> The NME Promise
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { title: "Transparent Dealings", desc: "No hidden clauses, absolute clarity in billing and agreements." },
                { title: "Competitively Priced", desc: "Premium quality developments optimized for high cost-efficiency." },
                { title: "Quality Obsessed", desc: "Rigorous standards for materials, engineering, and maintenance." }
              ].map((promise, i) => (
                <div
                  key={i}
                  className="bg-slate-50 dark:bg-slate-700/20 border border-slate-100 dark:border-slate-700/50 p-4 rounded-xl hover:border-amber-500/20 transition-all duration-300"
                >
                  <span className="block font-bold text-slate-800 dark:text-slate-200 text-xs tracking-tight">
                    {promise.title}
                  </span>
                  <span className="block text-[11px] text-slate-500 dark:text-slate-500 mt-1 leading-normal">
                    {promise.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Visual Graphic (Project Image Overlay) */}
        <div className="w-full lg:w-5/12 max-w-md lg:max-w-none relative">
          {/* Decorative Background Blob */}
          <div className="absolute -inset-4 bg-gradient-to-tr from-amber-500/10 to-yellow-500/5 rounded-3xl blur-2xl opacity-80 pointer-events-none" />

          <div className="relative rounded-2xl overflow-hidden border border-slate-200/60 dark:border-slate-700/60 shadow-xl bg-slate-900 aspect-[4/5] group">
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800"
              alt="Nirmaanmitra Construction Completed Villa"
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
            />
            {/* Floating Label Card */}
            <div className="absolute bottom-6 left-6 right-6 bg-slate-950/85 backdrop-blur-md border border-slate-850 p-4 rounded-xl text-white shadow-lg flex items-center justify-between">
              <div>
                <span className="text-[10px] text-amber-500 font-bold font-mono tracking-wider uppercase block">
                  Completed Landmark
                </span>
                <span className="text-sm font-bold tracking-tight block mt-0.5">
                  Luxury Gated Villa
                </span>
              </div>
              <div className="bg-amber-500 text-slate-950 font-mono text-[10px] font-bold px-2 py-1 rounded">
                Est. 2017
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
