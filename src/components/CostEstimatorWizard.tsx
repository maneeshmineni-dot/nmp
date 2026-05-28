import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Home, Building, Wrench, Sliders, Layers, Star,
  IndianRupee, Clock, CheckCircle, ChevronRight, ChevronLeft,
  RotateCcw, Download, Loader2
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────
interface WizardState {
  projectType: "" | "Residential" | "Commercial" | "Specialized";
  builtUpArea: number;
  floors: number;
  quality: "" | "standard" | "premium" | "luxury";
  additionalFeatures: string[];
}

interface EstimateResult {
  baseCostCrores: number;
  perSqFtRate: number;
  durationMonths: number;
  breakdown: {
    civil: number;
    finishing: number;
    mep: number;
    consultancyAndDesign: number;
    permitsAndGovt: number;
  };
  recommendations: string[];
}

const INITIAL_STATE: WizardState = {
  projectType: "",
  builtUpArea: 2000,
  floors: 1,
  quality: "",
  additionalFeatures: [],
};

const FEATURES = [
  "Solar Grid Installation",
  "Rainwater Harvesting",
  "Smart Home Automation",
  "Structural Glazing",
  "Basement Parking",
  "Swimming Pool",
  "STP / Water Treatment",
  "Vaastu Compliance Audit",
];

const PROJECT_TYPES = [
  { id: "Residential", label: "Residential", desc: "Apartments, villas, townships", icon: Home, color: "sky" },
  { id: "Commercial", label: "Commercial", desc: "Offices, retail, plazas", icon: Building, color: "violet" },
  { id: "Specialized", label: "Specialized", desc: "Hospitals, halls, complexes", icon: Wrench, color: "rose" },
] as const;

const QUALITY_TIERS = [
  {
    id: "standard",
    label: "Standard",
    rate: "~₹1,700/sq.ft",
    desc: "Solid RCC structure, standard finishes, functional MEP systems",
    icon: Layers,
    color: "slate",
  },
  {
    id: "premium",
    label: "Premium",
    rate: "~₹2,200/sq.ft",
    desc: "Enhanced finishes, premium flooring, upgraded electrical & plumbing",
    icon: Sliders,
    color: "amber",
  },
  {
    id: "luxury",
    label: "Luxury",
    rate: "~₹2,900/sq.ft",
    desc: "Italian marble, smart systems, double-height ceilings, structural glazing",
    icon: Star,
    color: "yellow",
  },
] as const;

// ─── Bar chart segment ───────────────────────────────────────────
function BreakdownBar({
  label, value, total, color, delay,
}: { key?: string; label: string; value: number; total: number; color: string; delay: number }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-600 dark:text-slate-400 font-medium">{label}</span>
        <span className="font-bold font-mono text-slate-800 dark:text-slate-200">₹{value.toFixed(2)} Cr</span>
      </div>
      <div className="h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ delay, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className={`h-full ${color} rounded-full`}
        />
      </div>
    </div>
  );
}

// ─── Step 1 ──────────────────────────────────────────────────────
function Step1({ state, setState }: { state: WizardState; setState: React.Dispatch<React.SetStateAction<WizardState>> }) {
  return (
    <div className="step-in">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">What are you building?</h3>
      <p className="text-slate-400 dark:text-slate-500 text-sm mb-6">Select the primary project type.</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {PROJECT_TYPES.map(({ id, label, desc, icon: Icon, color }) => {
          const active = state.projectType === id;
          const borderCls = active
            ? color === "sky" ? "border-sky-500 bg-sky-50 dark:bg-sky-900/20"
              : color === "violet" ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20"
              : "border-rose-500 bg-rose-50 dark:bg-rose-900/20"
            : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800";
          const iconCls = active
            ? color === "sky" ? "bg-sky-500 text-white"
              : color === "violet" ? "bg-violet-500 text-white"
              : "bg-rose-500 text-white"
            : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400";

          return (
            <button
              key={id}
              onClick={() => setState(s => ({ ...s, projectType: id as WizardState["projectType"] }))}
              className={`flex flex-col items-start gap-3 p-5 rounded-2xl border-2 transition-all duration-200 text-left ${borderCls}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconCls} transition-all`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-sm">{label}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Step 2 ──────────────────────────────────────────────────────
function Step2({ state, setState }: { state: WizardState; setState: React.Dispatch<React.SetStateAction<WizardState>> }) {
  return (
    <div className="step-in">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Project Dimensions</h3>
      <p className="text-slate-400 dark:text-slate-500 text-sm mb-6">Enter the built-up area and number of floors.</p>

      <div className="space-y-6">
        {/* Area slider */}
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-100 dark:border-slate-700">
          <div className="flex justify-between items-end mb-3">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Built-Up Area</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={state.builtUpArea}
                onChange={e => setState(s => ({ ...s, builtUpArea: Math.max(500, Math.min(1000000, Number(e.target.value))) }))}
                className="w-24 text-right text-sm font-mono font-bold bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-2 py-1 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <span className="text-xs text-slate-400 font-mono">sq.ft</span>
            </div>
          </div>
          <input
            type="range"
            min={500}
            max={100000}
            step={500}
            value={state.builtUpArea}
            onChange={e => setState(s => ({ ...s, builtUpArea: Number(e.target.value) }))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer accent-amber-500"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1.5">
            <span>500 sq.ft</span><span>1,00,000 sq.ft</span>
          </div>
        </div>

        {/* Floors counter */}
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-100 dark:border-slate-700">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-4">Number of Floors</label>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setState(s => ({ ...s, floors: Math.max(1, s.floors - 1) }))}
              className="w-10 h-10 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 font-bold text-lg transition-colors"
            >−</button>
            <div className="flex-1 text-center">
              <span className="text-4xl font-black font-display text-slate-900 dark:text-white">{state.floors}</span>
              <span className="text-slate-400 text-sm ml-2">floor{state.floors !== 1 ? "s" : ""}</span>
            </div>
            <button
              onClick={() => setState(s => ({ ...s, floors: Math.min(40, s.floors + 1) }))}
              className="w-10 h-10 rounded-xl bg-amber-500 border border-amber-600 flex items-center justify-center text-white hover:bg-amber-600 font-bold text-lg transition-colors"
            >+</button>
          </div>
        </div>

        {/* Additional features */}
        <div>
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-3">Additional Features (optional)</label>
          <div className="flex flex-wrap gap-2">
            {FEATURES.map(f => {
              const active = state.additionalFeatures.includes(f);
              return (
                <button
                  key={f}
                  onClick={() => setState(s => ({
                    ...s,
                    additionalFeatures: active
                      ? s.additionalFeatures.filter(x => x !== f)
                      : [...s.additionalFeatures, f],
                  }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150 ${
                    active
                      ? "bg-amber-500/10 border-amber-500/40 text-amber-700 dark:text-amber-400"
                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300"
                  }`}
                >
                  {active ? "✓ " : ""}{f}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Step 3 ──────────────────────────────────────────────────────
function Step3({ state, setState }: { state: WizardState; setState: React.Dispatch<React.SetStateAction<WizardState>> }) {
  return (
    <div className="step-in">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Quality & Finish Tier</h3>
      <p className="text-slate-400 dark:text-slate-500 text-sm mb-6">Choose the build quality that matches your vision.</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {QUALITY_TIERS.map(({ id, label, rate, desc, icon: Icon, color }) => {
          const active = state.quality === id;
          const borderCls = active
            ? color === "amber" ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20"
              : color === "yellow" ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20"
              : "border-slate-400 bg-slate-50 dark:bg-slate-700/50"
            : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300";
          const iconCls = active
            ? color === "amber" ? "bg-amber-500 text-white"
              : color === "yellow" ? "bg-yellow-400 text-slate-900"
              : "bg-slate-500 text-white"
            : "bg-slate-100 dark:bg-slate-700 text-slate-400";

          return (
            <button
              key={id}
              onClick={() => setState(s => ({ ...s, quality: id as WizardState["quality"] }))}
              className={`flex flex-col gap-3 p-5 rounded-2xl border-2 transition-all duration-200 text-left ${borderCls}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${iconCls}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">{label}</p>
                <p className="text-xs font-mono text-amber-600 dark:text-amber-400 font-semibold mt-0.5">{rate}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5 leading-relaxed">{desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Step 4 — Results ────────────────────────────────────────────
function Step4({ state, result, loading, error }: {
  state: WizardState;
  result: EstimateResult | null;
  loading: boolean;
  error: string | null;
}) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
        <p className="text-slate-400 text-sm font-medium">Calculating your estimate…</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
        <p className="text-red-500 font-semibold">{error || "Something went wrong."}</p>
        <p className="text-slate-400 text-sm">Please go back and try again.</p>
      </div>
    );
  }

  const total = result.baseCostCrores;
  const b = result.breakdown;

  const bars = [
    { label: "Civil & Structure", value: b.civil, color: "bg-amber-500" },
    { label: "Finishing & Interiors", value: b.finishing, color: "bg-sky-500" },
    { label: "MEP Systems", value: b.mep, color: "bg-violet-500" },
    { label: "Consultancy & Design", value: b.consultancyAndDesign, color: "bg-emerald-500" },
    { label: "Permits & Government", value: b.permitsAndGovt, color: "bg-rose-400" },
  ];

  const handleDownload = () => {
    const lines = [
      "NIRMANMITRA CONSTRUCTION — COST ESTIMATE",
      "==========================================",
      `Project Type  : ${state.projectType}`,
      `Built-Up Area : ${state.builtUpArea.toLocaleString()} sq.ft`,
      `Floors        : ${state.floors}`,
      `Quality Tier  : ${state.quality}`,
      "",
      `TOTAL ESTIMATE: ₹${total.toFixed(2)} Crores`,
      `Rate / sq.ft  : ₹${result.perSqFtRate.toLocaleString()}`,
      `Est. Duration : ${result.durationMonths} months`,
      "",
      "BREAKDOWN",
      "---------",
      ...bars.map(bar => `${bar.label.padEnd(30)} ₹${bar.value.toFixed(2)} Cr`),
      "",
      "RECOMMENDATIONS",
      "---------------",
      ...result.recommendations.map((r, i) => `${i + 1}. ${r}`),
      "",
      "Generated by Nirmanmitra AI Estimator • nirmanmitra@gmail.com",
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "nirmanmitra-estimate.txt";
    a.click();
  };

  return (
    <div className="step-in space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Your Estimate</h3>
          <p className="text-slate-400 text-sm">{state.projectType} · {state.builtUpArea.toLocaleString()} sq.ft · {state.floors}F · {state.quality}</p>
        </div>
        <button
          onClick={handleDownload}
          className="flex items-center gap-1.5 text-xs bg-slate-900 dark:bg-amber-500 text-white px-3 py-2 rounded-xl hover:bg-slate-800 dark:hover:bg-amber-400 transition-colors font-semibold"
        >
          <Download className="w-3.5 h-3.5" />
          Download
        </button>
      </div>

      {/* Hero numbers */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-amber-500 rounded-2xl p-4 text-white text-center">
          <p className="text-xs font-mono uppercase tracking-wider opacity-80 mb-1">Total Cost</p>
          <p className="text-xl font-black font-display">₹{total.toFixed(2)}</p>
          <p className="text-xs opacity-70 font-mono">Crores</p>
        </div>
        <div className="bg-slate-900 dark:bg-slate-700 rounded-2xl p-4 text-white text-center">
          <p className="text-xs font-mono uppercase tracking-wider opacity-60 mb-1">Rate/sq.ft</p>
          <p className="text-xl font-black font-display">₹{result.perSqFtRate.toLocaleString()}</p>
          <p className="text-xs opacity-50 font-mono">per sq.ft</p>
        </div>
        <div className="bg-emerald-600 rounded-2xl p-4 text-white text-center">
          <p className="text-xs font-mono uppercase tracking-wider opacity-80 mb-1">Duration</p>
          <p className="text-xl font-black font-display">{result.durationMonths}</p>
          <p className="text-xs opacity-70 font-mono">months</p>
        </div>
      </div>

      {/* Breakdown bars */}
      <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-5 border border-slate-100 dark:border-slate-700">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono mb-4">Cost Breakdown</h4>
        {bars.map((bar, i) => (
          <BreakdownBar key={bar.label} label={bar.label} value={bar.value} color={bar.color} total={total} delay={0.1 + i * 0.1} />
        ))}
      </div>

      {/* Recommendations */}
      <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-5 border border-slate-100 dark:border-slate-700">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono mb-3">Engineering Recommendations</h4>
        <ul className="space-y-2">
          {result.recommendations.map((rec, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
              {rec}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ─── Main Wizard ─────────────────────────────────────────────────
export default function CostEstimatorWizard() {
  const [state, setState] = useState<WizardState>(INITIAL_STATE);
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<EstimateResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const STEPS = ["Project Type", "Dimensions", "Quality", "Your Estimate"];

  const canNext = [
    !!state.projectType,
    state.builtUpArea >= 500 && state.floors >= 1,
    !!state.quality,
    true,
  ];

  const fetchEstimate = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectType: state.projectType,
          builtUpArea: state.builtUpArea,
          location: "Hyderabad",
          floors: state.floors,
          quality: state.quality,
          additionalFeatures: state.additionalFeatures,
        }),
      });
      const data = await res.json();
      if (data.success) setResult(data.data);
      else setError(data.error || "Estimation failed.");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [state]);

  const handleNext = () => {
    if (step === 2) {
      setStep(3);
      fetchEstimate();
    } else {
      setStep(s => s + 1);
    }
  };

  const handleBack = () => setStep(s => s - 1);

  const handleReset = () => {
    setState(INITIAL_STATE);
    setStep(0);
    setResult(null);
    setError(null);
  };

  return (
    <div id="cost-estimator-wizard" className="max-w-2xl mx-auto">
      {/* Section heading */}
      <div className="text-center mb-8">
        <p className="text-xs text-amber-600 font-mono uppercase tracking-widest mb-2">AI-Powered Tool</p>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white font-display tracking-tight">
          Construction Cost Estimator
        </h2>
        <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">
          Get an instant, detailed cost breakdown for your project.
        </p>
      </div>

      {/* Wizard card */}
      <div className="bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700 rounded-3xl shadow-xl overflow-hidden">
        {/* Step indicators */}
        <div className="flex border-b border-slate-100 dark:border-slate-700">
          {STEPS.map((label, i) => (
            <div
              key={label}
              className={`flex-1 py-3 text-center text-[10px] font-bold font-mono uppercase tracking-widest transition-all ${
                i === step
                  ? "bg-amber-500 text-white"
                  : i < step
                  ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                  : "text-slate-400 dark:text-slate-500"
              }`}
            >
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden">{i + 1}</span>
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="p-6 md:p-8 min-h-[320px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {step === 0 && <Step1 state={state} setState={setState} />}
              {step === 1 && <Step2 state={state} setState={setState} />}
              {step === 2 && <Step3 state={state} setState={setState} />}
              {step === 3 && <Step4 state={state} result={result} loading={loading} error={error} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="px-6 md:px-8 pb-6 flex items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-700 pt-4">
          {step > 0 ? (
            <button
              onClick={step === 3 ? handleReset : handleBack}
              className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-sm font-medium transition-colors"
            >
              {step === 3 ? <><RotateCcw className="w-4 h-4" /> New Estimate</> : <><ChevronLeft className="w-4 h-4" /> Back</>}
            </button>
          ) : <div />}

          {step < 3 && (
            <button
              onClick={handleNext}
              disabled={!canNext[step]}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                canNext[step]
                  ? "bg-amber-500 hover:bg-amber-600 text-white shadow-md hover:shadow-amber-500/25"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed"
              }`}
            >
              {step === 2 ? "Calculate Estimate" : "Continue"}
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
