import React, { useState, useEffect } from "react";
import { AnimatePresence } from "motion/react";
import { Project } from "./types";
import { PROJECT_DATA, COMPANY_RECOGNITIONS } from "./data/projects";
import ProjectCard from "./components/ProjectCard";
import ProjectDetailsModal from "./components/ProjectDetailsModal";
import TimelineView from "./components/TimelineView";
import PageCurtain from "./components/PageCurtain";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import ServicesSection from "./components/ServicesSection";
import ContactSection from "./components/ContactSection";
import {
  Search, SlidersHorizontal, X,
  Moon, Sun, LayoutGrid, GitCommitVertical,
  Building2, Phone, Mail
} from "lucide-react";

// ─── Dark mode hook ──────────────────────────────────────────────
function useDarkMode() {
  const [dark, setDark] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem("nmp-dark");
      if (stored !== null) return stored === "true";
    } catch {}
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
    try { localStorage.setItem("nmp-dark", String(dark)); } catch {}
  }, [dark]);

  return [dark, setDark] as const;
}

type ViewMode = "grid" | "timeline";

export default function App() {
  const [dark, setDark] = useDarkMode();
  const [view, setView] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"value-desc" | "value-asc" | "area-desc" | "date-desc">("value-desc");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeSection, setActiveSection] = useState("home");

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "projects", "about-us", "our-services", "contact-us"];
      const scrollPosition = window.scrollY + 140; // offset for sticky header

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Filter + sort
  const filteredProjects = PROJECT_DATA.filter(p => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      p.title.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q) ||
      p.client.toLowerCase().includes(q);
    const matchesCat = selectedCategory === "All" || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === "value-desc") return b.projectValueCr - a.projectValueCr;
    if (sortBy === "value-asc") return a.projectValueCr - b.projectValueCr;
    if (sortBy === "area-desc") {
      const aA = parseFloat(a.builtUpArea?.replace(/[^0-9.]/g, "") || "0");
      const aB = parseFloat(b.builtUpArea?.replace(/[^0-9.]/g, "") || "0");
      return aB - aA;
    }
    if (sortBy === "date-desc") {
      return parseInt(b.duration.split("-")[0]) - parseInt(a.duration.split("-")[0]);
    }
    return 0;
  });

  const VIEW_TABS: { id: ViewMode; label: string; icon: React.ReactNode }[] = [
    { id: "grid", label: "Portfolio", icon: <LayoutGrid className="w-4 h-4" /> },
    { id: "timeline", label: "Timeline", icon: <GitCommitVertical className="w-4 h-4" /> },
  ];

  return (
    <div
      id="nirmanmitra-app"
      className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900 overflow-x-hidden"
    >
      {/* Amber accent top bar */}
      <div className="h-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-700 w-full shrink-0" />

      {/* ── Sticky Header & Navbar ───────────────────────────── */}
      <header className="bg-white/85 dark:bg-slate-900/85 border-b border-slate-200/60 dark:border-slate-700/60 sticky top-0 z-45 px-4 md:px-8 py-3 backdrop-blur-lg shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">

          {/* Logo Brand Container */}
          <button 
            onClick={() => scrollToSection("home")}
            className="flex items-center gap-3 shrink-0 text-left cursor-pointer bg-transparent border-none p-0"
          >
            <div className="flex flex-col select-none leading-none border-l-4 border-amber-500 pl-3.5 py-0.5">
              <span className="font-serif text-2xl font-black tracking-tight text-slate-950 dark:text-white leading-none">
                NME Group
              </span>
              <span className="text-[9px] font-bold tracking-widest text-amber-600 uppercase mt-0.5 leading-none">
                We make your homes
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            {[
              { id: "home", label: "Home" },
              { id: "projects", label: "Projects" },
              { id: "about-us", label: "About Us" },
              { id: "contact-us", label: "Contact Us" }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`text-[10px] font-mono tracking-widest uppercase transition-colors cursor-pointer py-1 border-b-2 bg-transparent ${
                  activeSection === item.id || (activeSection === "our-services" && item.id === "about-us")
                    ? "border-amber-500 text-amber-700 dark:text-amber-400 font-bold"
                    : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right side: dark mode + establishment year */}
          <div className="flex items-center gap-3">
            <span className="hidden md:block text-[9px] text-slate-400 dark:text-slate-500 font-mono uppercase tracking-wider">
              Est. 2017 · Hyderabad
            </span>
            <button
              id="dark-mode-toggle"
              onClick={() => setDark(d => !d)}
              aria-label="Toggle dark mode"
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition-all duration-200 hover:rotate-12 cursor-pointer"
            >
              {dark ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <nav className="flex md:hidden items-center justify-center gap-4 border-t border-slate-100 dark:border-slate-800 mt-2 pt-2">
          {[
            { id: "home", label: "Home" },
            { id: "projects", label: "Projects" },
            { id: "about-us", label: "About" },
            { id: "contact-us", label: "Contact" }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`text-[9px] font-mono tracking-wider uppercase transition-colors cursor-pointer px-1 py-0.5 border-b-2 bg-transparent ${
                activeSection === item.id || (activeSection === "our-services" && item.id === "about-us")
                  ? "border-amber-500 text-amber-700 dark:text-amber-400 font-bold"
                  : "border-transparent text-slate-500 dark:text-slate-400"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      {/* ── Main Content SPA ─────────────────────────────────── */}
      <main className="max-w-7xl w-full mx-auto px-4 md:px-8 py-8 flex flex-col gap-12 flex-1 min-h-0">
        
        {/* 1. Hero Section */}
        <HeroSection />

        {/* 2. About Us Section */}
        <AboutSection />

        {/* 3. Our Services Grid Section */}
        <ServicesSection />

        {/* 4. Projects Section */}
        <section
          id="projects"
          className="bg-white dark:bg-slate-800/60 rounded-3xl border border-slate-100 dark:border-slate-700/50 p-5 md:p-8 shadow-sm flex flex-col gap-6"
        >
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-700/50">
            <div>
              <span className="text-xs text-amber-600 dark:text-amber-400 font-mono font-bold uppercase tracking-widest block">
                Portfolio
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white font-display tracking-tight mt-1 leading-tight">
                Our Landmark Projects
              </h2>
            </div>
            
            {/* View switcher inside Projects Section */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1 self-start md:self-auto shrink-0 shadow-2xs">
              {VIEW_TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setView(tab.id)}
                  id={`view-tab-${tab.id}`}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    view === tab.id
                      ? "bg-white dark:bg-slate-700 text-amber-700 dark:text-amber-400 shadow-xs"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {view === "grid" ? (
            <div className="flex-1 flex flex-col gap-6">
              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-3 bg-slate-50/70 dark:bg-slate-700/30 p-3 rounded-2xl border border-slate-100 dark:border-slate-700/40">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search by city, client, or building name..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    id="project-search-input"
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200/85 dark:border-slate-600 pl-10 pr-4 py-2 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Sort */}
                <div className="flex items-center gap-2 shrink-0">
                  <SlidersHorizontal className="text-slate-400 w-4 h-4" />
                  <select
                    value={sortBy}
                    onChange={(e: any) => setSortBy(e.target.value)}
                    id="project-sort-select"
                    className="bg-white dark:bg-slate-800 hover:bg-slate-55 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 py-2 pl-3 pr-8 rounded-xl text-xs text-slate-800 dark:text-slate-200 font-semibold tracking-tight focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 cursor-pointer transition-all duration-200"
                  >
                    <option value="value-desc">Highest Value</option>
                    <option value="value-asc">Lowest Value</option>
                    <option value="area-desc">Largest Area</option>
                    <option value="date-desc">Most Recent</option>
                  </select>
                </div>
              </div>

              {/* Category pills */}
              <div className="flex flex-wrap gap-1.5 pb-3 border-b border-slate-100 dark:border-slate-700/50">
                {["All", "Consultancy / Engineering", "Contracting"].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    id={`filter-cat-${cat.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-tight transition-all duration-200 cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-amber-500/10 text-amber-800 dark:text-amber-400 border-2 border-amber-400/80"
                        : "bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-600 border border-slate-200/50 dark:border-slate-600/50"
                    }`}
                  >
                    {cat === "All" ? "All Projects" : cat}
                  </button>
                ))}
              </div>

              {/* Grid Container */}
              <div className="overflow-y-auto max-h-[64vh] pr-1">
                {sortedProjects.length === 0 ? (
                  <div className="text-center py-16 px-4 bg-slate-50 dark:bg-slate-700/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                    <Building2 className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-800 dark:text-slate-300 text-sm font-semibold">No projects found</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-sm mx-auto">
                      Try a different search or clear your filters.
                    </p>
                    <button
                      onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
                      className="mt-4 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors cursor-pointer"
                    >
                      Clear filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {sortedProjects.map((project, i) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        onSelect={p => setSelectedProject(p)}
                        index={i}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1">
              <TimelineView projects={PROJECT_DATA} onSelect={p => setSelectedProject(p)} />
            </div>
          )}
        </section>

        {/* 5. Contact Section */}
        <ContactSection />

      </main>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer className="bg-slate-900 dark:bg-slate-955 text-white border-t border-slate-800 px-4 md:px-8 py-10 mt-auto shrink-0">
        <div className="max-w-7xl mx-auto">

          {/* Stats bento grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {COMPANY_RECOGNITIONS.map((rec, i) => (
              <div key={i} className="bg-slate-955 dark:bg-black/40 border border-slate-800/50 p-5 rounded-2xl relative overflow-hidden group hover:border-amber-500/30 transition-colors duration-300">
                <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-amber-500/10 transition-colors duration-500" />
                <span className="text-amber-500 text-xs font-mono font-bold block">{rec.label}</span>
                <strong className="text-2xl md:text-3xl font-black font-display tracking-tight text-white block mt-1">{rec.metric}</strong>
                <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">{rec.desc}</p>
              </div>
            ))}
          </div>

          {/* Footer bottom */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-5 border-t border-slate-800 pt-8 text-[11px] text-slate-400">
            <div>
              <p className="font-semibold font-display text-white tracking-widest text-xs">NIRMAAN MITRA PROJECTS (NME GROUP)</p>
              <p className="mt-1">We make your homes · Structurally safe, Vaastu compliant frameworks since 2017.</p>
              <p className="mt-2 text-slate-500 font-mono flex flex-wrap gap-x-4 gap-y-1 items-center">
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  <a href="tel:+919542826610" className="hover:text-amber-400 font-semibold transition-colors">+91 9542826610</a>
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  <a href="mailto:nirmaanmitraprojects@gmail.com" className="hover:text-amber-400 font-semibold transition-colors">nirmaanmitraprojects@gmail.com</a>
                </span>
              </p>
            </div>
            <div className="font-mono text-slate-600 text-xs text-center md:text-right">
              <p>© {new Date().getFullYear()} Nirmaan Mitra Projects. All Rights Reserved.</p>
              <p className="mt-1 text-slate-700">Hyderabad, Telangana</p>
            </div>
          </div>
        </div>
      </footer>

      {/* ── Modal Portal ──────────────────────────────────────── */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectDetailsModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>

      {/* ── Page Curtain (scroll-to-open entry gate) ───────────── */}
      <PageCurtain />
    </div>
  );
}
