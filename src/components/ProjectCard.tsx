import { Project } from "../types";
import { Calendar, MapPin, Minimize2, IndianRupee, Layers, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";

interface ProjectCardProps {
  key?: string;
  project: Project;
  onSelect: (project: Project) => void;
  index?: number;
}

export default function ProjectCard({ project, onSelect, index = 0 }: ProjectCardProps) {
  const categoryColors = {
    "Consultancy / Engineering": "border-sky-500/30 text-sky-700 dark:text-sky-400 bg-sky-50/50 dark:bg-sky-900/20",
    "Contracting": "border-emerald-500/30 text-emerald-700 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/20",
  };

  const categoryBorderAccent = {
    "Consultancy / Engineering": "group-hover:border-sky-300 dark:group-hover:border-sky-700",
    "Contracting": "group-hover:border-emerald-300 dark:group-hover:border-emerald-700",
  };

  const getCategoryImage = (cat: string) => {
    switch (cat) {
      case "Consultancy / Engineering":
        return "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800";
      case "Contracting":
        return "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800";
      default:
        return "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => onSelect(project)}
      className={`group bg-white dark:bg-slate-800/80 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700/60 shadow-xs hover:shadow-xl dark:hover:shadow-slate-900/50 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col h-full ${categoryBorderAccent[project.category]}`}
    >
      {/* Visual Header */}
      <div className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-slate-700">
        <img
          src={project.url || getCategoryImage(project.category)}
          alt={project.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = getCategoryImage(project.category);
          }}
        />

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 pointer-events-none">
          <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full border shadow-2xs backdrop-blur-md ${categoryColors[project.category]}`}>
            {project.category}
          </span>
          {project.isCurrent && (
            <span className="bg-emerald-600 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full border border-emerald-500/20 shadow-2xs animate-pulse">
              Active Project
            </span>
          )}
          {project.isLargest && (
            <span className="bg-amber-500 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full border border-amber-400/20 shadow-2xs">
              Largest Project
            </span>
          )}
        </div>

        {/* Action Indicator */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-amber-500 text-white p-2 rounded-full shadow-md flex items-center justify-center scale-75 group-hover:scale-100">
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>

      {/* Card Information Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata String */}
          <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500 font-medium mb-1.5 uppercase tracking-wider font-mono">
            <span>{project.location.split(",")[0]}</span>
            <span>•</span>
            <span>{project.duration}</span>
          </div>

          <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors duration-200 font-sans tracking-tight">
            {project.title}
          </h3>

          <p className="text-slate-500 dark:text-slate-400 text-xs mt-2 line-clamp-2 leading-relaxed">
            {project.details}
          </p>
        </div>

        {/* Metric Grid */}
        <div className="grid grid-cols-2 gap-2.5 border-t border-slate-100 dark:border-slate-700 pt-4 mt-4 text-[13px]">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <Minimize2 className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
            <div className="truncate">
              <span className="block text-[10px] uppercase text-slate-400 dark:text-slate-500 font-mono font-medium leading-none">Area</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 leading-normal">{project.builtUpArea || "N/A"}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <IndianRupee className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <span className="block text-[10px] uppercase text-slate-400 dark:text-slate-500 font-mono font-medium leading-none">Value</span>
              <span className="font-bold text-slate-900 dark:text-white leading-normal font-mono">{project.projectValue}</span>
            </div>
          </div>
        </div>

        {/* Client Label footer */}
        <div className="mt-3.5 pt-2 border-t border-slate-50 dark:border-slate-700/50 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
          <span className="truncate">Client: <strong className="text-slate-700 dark:text-slate-300 font-medium">{project.client}</strong></span>
          <span className="font-mono bg-slate-50 dark:bg-slate-700 px-1.5 py-0.5 rounded text-xs select-none">#{project.id.slice(0, 5)}</span>
        </div>
      </div>
    </motion.div>
  );
}
