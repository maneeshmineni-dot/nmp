import { Project } from "../types";
import { X, Calendar, MapPin, Minimize2, IndianRupee, ExternalLink, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ProjectDetailsModalProps {
  project: Project;
  onClose: () => void;
}

export default function ProjectDetailsModal({ project, onClose }: ProjectDetailsModalProps) {
  const getCategoryImage = (cat: string) => {
    switch (cat) {
      case "Consultancy / Engineering":
        return "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200";
      case "Contracting":
        return "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200";
      default:
        return "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200";
    }
  };

  const categoryBadge = {
    "Consultancy / Engineering": "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/25",
    "Contracting": "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/25",
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 24 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-2xl max-w-4xl w-full border border-slate-100 dark:border-slate-700 flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh]"
          onClick={(e) => e.stopPropagation()}
          style={{ perspective: "1500px" }}
        >

          {/* ── 3D Door Opening Overlay ─────────────────────────── */}
          <div className="absolute inset-0 z-[45] flex pointer-events-none overflow-hidden" style={{ transformStyle: "preserve-3d" }}>
            {/* Left Door Panel */}
            <motion.div
              initial={{ rotateY: 0, opacity: 1, x: 0 }}
              animate={{
                rotateY: -115,
                opacity: [1, 1, 0.95, 0],
                x: -40,
              }}
              transition={{
                duration: 2.4,
                ease: [0.25, 1, 0.5, 1],
                times: [0, 0.4, 0.8, 1]
              }}
              style={{ originX: 0 }}
              className="w-1/2 h-full bg-slate-900 border-r border-amber-500/20 flex flex-col justify-between p-6 relative shadow-2xl"
            >
              {/* Grid Pattern */}
              <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(rgba(245,158,11,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.6)_1px,transparent_1px)] bg-[size:16px_16px]" />

              {/* Blueprint text */}
              <div className="relative z-10 font-mono text-[9px] text-amber-500/60 leading-tight space-y-1">
                <div>PROJECT STAGE // AUTH_SYS</div>
                <div>SCALE // 1:25 METRIC</div>
                <div>SEC_L // 0xFA48</div>
              </div>

              {/* Center logo */}
              <div className="relative z-10 my-auto flex flex-col items-center justify-center">
                <div className="w-24 h-24 rounded-full border border-dashed border-amber-500/30 flex items-center justify-center animate-[spin_20s_linear_infinite]">
                  <div className="w-16 h-16 rounded-full border border-amber-500/10 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full border border-amber-500/25" />
                  </div>
                </div>
                <span className="font-serif text-4xl font-extrabold tracking-tight text-amber-400 mt-4 leading-none">
                  NME
                </span>
                <span className="text-[9px] font-bold tracking-widest text-slate-500 uppercase mt-1 leading-none font-mono">
                  ENGINEERING GROUP
                </span>
              </div>

              {/* Left Handle */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-28 bg-slate-800 border border-amber-500/20 rounded-l-md flex items-center justify-center shadow-lg">
                <div className="w-1.5 h-16 bg-amber-500/80 rounded-full shadow-inner animate-pulse" />
              </div>

              {/* Ruler */}
              <div className="relative z-10 border-t border-dashed border-slate-700 pt-2 font-mono text-[8px] text-slate-500 flex justify-between">
                <span>0 . . . 10</span>
                <span>20 . . . 30</span>
                <span>40</span>
              </div>
            </motion.div>

            {/* Right Door Panel */}
            <motion.div
              initial={{ rotateY: 0, opacity: 1, x: 0 }}
              animate={{
                rotateY: 115,
                opacity: [1, 1, 0.95, 0],
                x: 40,
              }}
              transition={{
                duration: 2.4,
                ease: [0.25, 1, 0.5, 1],
                times: [0, 0.4, 0.8, 1]
              }}
              style={{ originX: 1 }}
              className="w-1/2 h-full bg-slate-900 border-l border-amber-500/20 flex flex-col justify-between p-6 relative shadow-2xl"
            >
              {/* Grid Pattern */}
              <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(rgba(245,158,11,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.6)_1px,transparent_1px)] bg-[size:16px_16px]" />

              {/* Blueprint text */}
              <div className="relative z-10 text-right font-mono text-[9px] text-amber-500/60 leading-tight space-y-1">
                <div>PROJECT VIEW // ARCH_A</div>
                <div>DRAFT_CODE // #{project.id}</div>
                <div>EST_VAL // {project.projectValue}</div>
              </div>

              {/* Center specs */}
              <div className="relative z-10 my-auto flex flex-col items-center justify-center">
                <div className="w-24 h-24 border border-dashed border-amber-500/30 flex flex-col items-center justify-center p-3 font-mono text-[9px] text-slate-400 gap-1 rounded-sm">
                  <div className="w-full border-b border-dashed border-amber-500/20 pb-0.5">EL: +185.0m</div>
                  <div className="w-full border-b border-dashed border-amber-500/20 pb-0.5">SLAB: 150mm</div>
                  <div className="w-full text-amber-400/80">VAASTU: 100%</div>
                </div>
                <span className="font-serif text-4xl font-extrabold tracking-tight text-white mt-4 leading-none">
                  PROJECT
                </span>
                <span className="text-[9px] font-bold tracking-widest text-slate-500 uppercase mt-1 leading-none font-mono">
                  NIRMAAN MITRA
                </span>
              </div>

              {/* Right Handle */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-28 bg-slate-800 border border-amber-500/20 rounded-r-md flex items-center justify-center shadow-lg">
                <div className="w-1.5 h-16 bg-amber-500/80 rounded-full shadow-inner animate-pulse" />
              </div>

              {/* Ruler */}
              <div className="relative z-10 border-t border-dashed border-slate-700 pt-2 font-mono text-[8px] text-slate-500 flex justify-between">
                <span>60</span>
                <span>70 . . . 80</span>
                <span>90 . . . 100</span>
              </div>
            </motion.div>
          </div>
          {/* ── End 3D Door Overlay ─────────────────────────────── */}

          {/* Close Button */}
          <button
            onClick={onClose}
            id="close-modal-btn"
            className="absolute top-4 right-4 z-[50] bg-white/90 dark:bg-slate-700/90 hover:bg-white dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 p-2.5 rounded-full shadow-lg backdrop-blur-xs transition-all hover:scale-105"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left: Image Cover */}
          <div className="md:w-5/12 bg-slate-100 dark:bg-slate-900 relative min-h-[250px] md:min-h-0">
            <motion.img
              initial={{ scale: 1.08 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              src={project.url || getCategoryImage(project.category)}
              alt={project.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = getCategoryImage(project.category);
              }}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-slate-950/10 flex flex-col justify-end p-6 md:p-8">
              <span className={`self-start text-[10px] font-semibold font-mono tracking-wider uppercase px-2.5 py-1 rounded-full border mb-2 ${categoryBadge[project.category]}`}>
                {project.category}
              </span>
              <h4 className="text-white text-2xl font-bold font-display tracking-tight leading-tight">
                {project.title}
              </h4>
              <div className="text-slate-300 text-xs mt-2 flex items-center gap-1.5 font-mono">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{project.location}</span>
              </div>
              {project.isCurrent && (
                <div className="mt-2 self-start bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full animate-pulse">
                  ● Active Project
                </div>
              )}
              {project.isLargest && (
                <div className="mt-2 self-start bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                  ★ Portfolio Peak
                </div>
              )}
            </div>
          </div>

          {/* Right: Details */}
          <div className="md:w-7/12 p-6 md:p-8 overflow-y-auto flex flex-col justify-between max-h-[60vh] md:max-h-full">
            <div>
              {/* Header row */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4 mb-5">
                <div>
                  <p className="text-slate-400 dark:text-slate-500 text-xs uppercase tracking-wider font-mono">Project ID</p>
                  <p className="text-slate-800 dark:text-slate-200 text-sm font-semibold font-mono">#{project.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-400 text-xs uppercase tracking-wider font-mono">Duration</p>
                  <p className="text-slate-900 dark:text-white font-medium text-sm flex items-center gap-1 justify-end">
                    <Calendar className="w-4 h-4 text-amber-600" />
                    {project.duration}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4 mb-6">
                <div>
                  <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">About</h5>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    {project.details || "A structurally sound and resource-optimized layout custom-built by Nirmanmitra."}
                  </p>
                </div>

                {project.serviceProvided && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-500/15 rounded-xl p-3 flex items-center gap-2">
                    <span className="text-xs font-semibold text-amber-800 dark:text-amber-400 font-mono">Service:</span>
                    <span className="text-xs text-slate-700 dark:text-slate-300 font-medium bg-white dark:bg-slate-700 px-2 py-0.5 rounded border border-amber-200/40 dark:border-amber-500/20 ml-1.5 shadow-xs">
                      {project.serviceProvided}
                    </span>
                  </div>
                )}
              </div>

              {/* Specs Grid */}
              <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3.5 font-mono">Details</h5>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { label: "Client", value: project.client },
                  { label: "Value", value: `₹${project.projectValue}`, green: true },
                  { label: "Area", value: project.builtUpArea || "N/A" },
                  { label: "Type", value: project.projectType },
                  ...(project.totalUnits ? [{ label: "Units", value: project.totalUnits }] : []),
                ].map(({ label, value, green }) => (
                  <div key={label} className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3 border border-slate-100 dark:border-slate-700/50">
                    <span className="block text-[10px] uppercase text-slate-400 dark:text-slate-500 font-mono font-medium">{label}</span>
                    <span className={`block text-xs font-bold mt-1 truncate ${green ? "text-emerald-700 dark:text-emerald-400 font-mono" : "text-slate-800 dark:text-slate-200"}`}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Additional Scope */}
              {project.additionalScope && project.additionalScope.length > 0 && (
                <div className="mb-6">
                  <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 font-mono">Additional Scope</h5>
                  <div className="flex flex-wrap gap-1.5">
                    {project.additionalScope.map((item, idx) => (
                      <span
                        key={idx}
                        className="bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[11px] px-2.5 py-1 rounded-lg border border-slate-200/55 dark:border-slate-600/40 font-medium flex items-center gap-1"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer actions */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row gap-2.5 justify-end">
              <button
                onClick={onClose}
                className="bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 text-white font-medium text-xs py-2.5 px-5 rounded-xl transition-colors"
              >
                Close
              </button>
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-amber-500 hover:bg-amber-600 text-white border border-amber-600/30 py-2.5 px-5 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Visit website</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
