import React, { useRef } from "react";
import { motion, useInView } from "motion/react";
import { MapPin, IndianRupee, Calendar, Layers, ArrowUpRight } from "lucide-react";
import { Project } from "../types";

interface TimelineViewProps {
  projects: Project[];
  onSelect: (project: Project) => void;
}

const CATEGORY_COLORS = {
  "Consultancy / Engineering": {
    badge: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
    dot: "bg-sky-500",
    glow: "from-sky-500/10",
  },
  "Contracting": {
    badge: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
    dot: "bg-emerald-500",
    glow: "from-emerald-500/10",
  },
};

// Sort projects chronologically by start year
function sortByYear(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => {
    const ya = parseInt(a.duration.split("-")[0]);
    const yb = parseInt(b.duration.split("-")[0]);
    return ya - yb;
  });
}

// Group projects by year period
function getYearLabel(duration: string): string {
  return duration.split("-")[0];
}

interface TimelineCardProps {
  key?: string;
  project: Project;
  side: "left" | "right";
  index: number;
  onSelect: (p: Project) => void;
}

function TimelineCard({ project, side, index, onSelect }: TimelineCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const colors = CATEGORY_COLORS[project.category];

  return (
    <div
      ref={ref}
      className={`relative flex items-center gap-0 ${
        side === "left" ? "flex-row-reverse md:pr-8" : "flex-row md:pl-8"
      } md:w-1/2 ${side === "left" ? "md:self-start md:ml-auto" : "md:self-start"} w-full pl-12 md:pl-0`}
    >
      {/* Timeline node */}
      <div
        className={`absolute ${
          side === "left" ? "md:right-[-17px]" : "md:left-[-17px]"
        } left-[18px] md:left-auto top-1/2 -translate-y-1/2 z-10 flex items-center justify-center`}
      >
        <div
          className={`relative w-8 h-8 rounded-full ${colors.dot} flex items-center justify-center shadow-lg ${
            project.isCurrent ? "node-ping" : ""
          }`}
        >
          <span className="text-white text-[10px] font-black font-mono">
            {getYearLabel(project.duration).slice(2)}
          </span>
        </div>
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, x: side === "left" ? 40 : -40 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ delay: 0.05 * index, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        onClick={() => onSelect(project)}
        className={`group cursor-pointer bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 w-full max-w-md`}
      >
        {/* Image strip */}
        {project.url && !project.url.startsWith("https://qualitasgepl") && !project.url.startsWith("https://goldenkey") ? (
          <div className="relative h-36 overflow-hidden bg-slate-100 dark:bg-slate-700">
            <img
              src={project.url}
              alt={project.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <div className={`absolute inset-0 bg-gradient-to-t ${colors.glow} to-transparent`} />
            {project.isCurrent && (
              <div className="absolute top-2 left-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                Active
              </div>
            )}
            {project.isLargest && (
              <div className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                ★ Portfolio Peak
              </div>
            )}
          </div>
        ) : (
          <div className={`h-2 bg-gradient-to-r ${colors.glow.replace("from-", "from-").replace("/10", "")} to-transparent`} />
        )}

        <div className="p-4">
          {/* Category + duration */}
          <div className="flex items-center justify-between mb-2 gap-2">
            <span className={`text-[10px] font-semibold font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border ${colors.badge}`}>
              {project.category}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {project.duration}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-snug group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors mb-1">
            {project.title}
          </h3>

          {/* Location */}
          <p className="text-slate-400 dark:text-slate-500 text-xs flex items-center gap-1 mb-3">
            <MapPin className="w-3 h-3 shrink-0" />
            {project.location}
          </p>

          {/* Metrics */}
          <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-700 pt-3">
            <div className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 text-xs font-bold font-mono">
              <IndianRupee className="w-3.5 h-3.5" />
              {project.projectValue}
            </div>
            {project.builtUpArea && (
              <div className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                <Layers className="w-3 h-3" />
                {project.builtUpArea}
              </div>
            )}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-amber-500 text-white p-1 rounded-lg">
              <ArrowUpRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function TimelineView({ projects, onSelect }: TimelineViewProps) {
  const sorted = sortByYear(projects);

  return (
    <div id="timeline-view" className="relative w-full px-4 md:px-0">
      {/* Section heading */}
      <div className="text-center mb-10">
        <p className="text-xs text-amber-600 font-mono uppercase tracking-widest mb-2">Timeline</p>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white font-display tracking-tight">
          2008 to present
        </h2>
        <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">
          All our projects, in order.
        </p>
      </div>

      {/* Timeline container */}
      <div className="relative max-w-4xl mx-auto">
        {/* Vertical spine — hidden on mobile, visible on md */}
        <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-amber-500/60 via-slate-200 dark:via-slate-700 to-amber-500/20" />

        {/* Year start label */}
        <div className="hidden md:flex justify-center mb-6">
          <span className="bg-amber-500 text-white text-xs font-black font-mono px-4 py-1.5 rounded-full shadow-md tracking-widest">
            Founded 2008
          </span>
        </div>

        {/* Cards */}
        <div className="flex flex-col gap-8">
          {sorted.map((project, i) => (
            <TimelineCard
              key={project.id}
              project={project}
              side={i % 2 === 0 ? "right" : "left"}
              index={i}
              onSelect={onSelect}
            />
          ))}
        </div>

        {/* Year end label */}
        <div className="hidden md:flex justify-center mt-8">
          <span className="bg-emerald-600 text-white text-xs font-black font-mono px-4 py-1.5 rounded-full shadow-md tracking-widest animate-pulse">
            Active
          </span>
        </div>
      </div>
    </div>
  );
}
