import React from "react";
import { HardHat, Compass, ClipboardCheck, ScanLine, ArrowUpRight } from "lucide-react";

export default function ServicesSection() {
  const SERVICES = [
    {
      icon: <HardHat className="w-6 h-6 text-amber-500" />,
      title: "Contracting & Construction",
      desc: "End-to-end execution of gated communities, luxury villas, commercial high-rises, and major infrastructure including roads, bridges, and irrigation channels.",
      features: ["Turnkey Construction", "Infrastructure Works", "Gated Projects", "High-Rise Development"]
    },
    {
      icon: <Compass className="w-6 h-6 text-amber-550 dark:text-amber-400" />,
      title: "Design Consultancy",
      desc: "Comprehensive structural & architectural planning including concept layouts, complete engineering blueprints, 3D visualizations, and tender finalization.",
      features: ["Site Layouts & Planning", "Architectural Blueprints", "Structural Engineering", "Tender Drafting"]
    },
    {
      icon: <ClipboardCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
      title: "Project Management (PMC)",
      desc: "Strict quality assurance, comprehensive material testing, running account audits, cost control pipelines, and regular site safety compliance audits.",
      features: ["Continuous Quality Control", "Cost & Material Audits", "Timeline Inspections", "Billing Supervision"]
    },
    {
      icon: <ScanLine className="w-6 h-6 text-blue-500" />,
      title: "Advanced Surveying",
      desc: "Precision boundary mapping, contour plotting, and detailed topographical surveys utilizing state-of-the-art total stations and LiDAR technology.",
      features: ["Topographical Mapping", "LiDAR Surveying", "Contour Plotting", "Boundary Alignment"]
    }
  ];

  return (
    <section
      id="our-services"
      className="py-16 bg-white dark:bg-slate-800/60 rounded-3xl border border-slate-100 dark:border-slate-700/50 p-6 md:p-10 shadow-sm"
    >
      {/* Heading */}
      <div className="text-center mb-12">
        <span className="text-xs text-amber-600 dark:text-amber-400 font-mono font-bold uppercase tracking-widest mb-2 block">
          Our Specializations
        </span>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white font-display tracking-tight">
          Comprehensive Engineering Services
        </h2>
        <p className="text-slate-400 dark:text-slate-500 text-sm mt-2 max-w-xl mx-auto">
          We bring precision, compliance, and structural integrity to every service line across Telangana's landscape.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SERVICES.map((service, i) => (
          <div
            key={i}
            className="group relative bg-slate-50 dark:bg-slate-700/20 border border-slate-100 dark:border-slate-700/40 p-6 rounded-2xl hover:border-amber-500/30 dark:hover:border-amber-500/20 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Header: Icon + Arrow */}
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white dark:bg-slate-700 border border-slate-100 dark:border-slate-650 rounded-xl shadow-2xs group-hover:scale-105 transition-transform">
                  {service.icon}
                </div>
                <div className="text-slate-300 dark:text-slate-650 group-hover:text-amber-500 transition-colors">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                {service.title}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-2.5 leading-relaxed">
                {service.desc}
              </p>
            </div>

            {/* Micro Feature Tags */}
            <div className="flex flex-wrap gap-1.5 mt-5 pt-4 border-t border-slate-200/40 dark:border-slate-750">
              {service.features.map((feat, idx) => (
                <span
                  key={idx}
                  className="bg-white dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-md border border-slate-100 dark:border-slate-700 font-medium"
                >
                  {feat}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
