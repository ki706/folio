'use client';
import { useEffect, useState, useCallback } from 'react';
import { getProjects, Project } from '@/lib/store';
import ProjectCard from '@/components/projects/ProjectCard';
import AddProjectSheet from '@/components/projects/AddProjectSheet';
import { Plus, Briefcase } from 'lucide-react';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const ps = await getProjects();
    setProjects(ps);
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, [refresh]);

  const handleEdit = (p: Project) => {
    setEditingProject(p);
    setIsSheetOpen(true);
  };

  const closeSheet = () => {
    setIsSheetOpen(false);
    setEditingProject(null);
  };

  return (
    <div className="max-w-[var(--max-width-page)] mx-auto pb-32 animate-fade-in px-6 lg:px-8">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-8">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 text-[11px] font-bold tracking-[0.2em] mb-4 text-[var(--green)] uppercase">
            <Briefcase size={14} className="animate-pulse" /> Architecture
          </div>
          <h1 className="text-[clamp(40px,5vw,64px)] font-[900] tracking-[-0.05em] leading-none text-white flex flex-wrap gap-x-4">
            Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[var(--muted)]">Fleet.</span>
          </h1>
        </div>
        <button className="group relative flex items-center gap-2 h-12 px-6 rounded-xl bg-white text-black font-bold tracking-tight hover:bg-[#f0f0f0] transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95" onClick={() => setIsSheetOpen(true)}>
          <Plus size={18} className="group-hover:rotate-90 transition-transform" />
          <span>Add New Project</span>
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(340px, 100%), 1fr))', gap: 20 }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton" style={{ height: 200, borderRadius: 16 }} />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="glass-card relative overflow-hidden flex flex-col items-center p-16 sm:p-24 text-center border border-[rgba(0,204,255,0.1)] bg-[#0A0A0A]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,204,255,0.05)_0%,_transparent_60%)] pointer-events-none" />
          
          <div className="relative w-40 h-40 mb-10 group cursor-pointer" onClick={() => setIsSheetOpen(true)}>
            <div className="absolute inset-0 border border-[rgba(0,255,136,0.2)] rounded-[2rem] rotate-12 bg-[#111] group-hover:rotate-45 transition-transform duration-700 ease-in-out" />
            <div className="absolute inset-0 border border-[rgba(255,255,255,0.1)] rounded-[2rem] -rotate-6 bg-[rgba(255,255,255,0.02)] backdrop-blur-md flex items-center justify-center shadow-[0_20px_40px_rgba(0,0,0,0.4)] group-hover:-rotate-12 transition-transform duration-700 ease-in-out">
              <Briefcase size={48} className="text-[var(--green)] drop-shadow-[0_0_15px_rgba(0,255,136,0.5)] group-hover:scale-110 transition-transform" />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[var(--green)] opacity-0 group-hover:opacity-10 blur-[50px] transition-opacity duration-700 pointer-events-none rounded-full" />
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-[900] text-white tracking-tight mb-4 relative z-10">Initialize the Grid</h2>
          <p className="text-[#888] text-sm sm:text-base max-w-[460px] mb-10 leading-relaxed font-medium relative z-10">
            Your fleet is currently empty. Mount your active repositories to grant the neural engine structural context for content synthesis.
          </p>
          <button 
            className="relative z-10 flex items-center gap-3 h-14 px-8 rounded-xl bg-white text-black font-black uppercase tracking-widest text-xs hover:opacity-90 transition-opacity shadow-[0_0_30px_rgba(255,255,255,0.1)]" 
            onClick={() => setIsSheetOpen(true)}
          >
            <Plus size={16} /> Mount First Project
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(340px, 100%), 1fr))', gap: 20 }}>
          {projects.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              onEdit={() => handleEdit(p)}
              onDelete={refresh}
            />
          ))}
        </div>
      )}

      {isSheetOpen && (
        <AddProjectSheet
          project={editingProject}
          onClose={closeSheet}
          onSaved={refresh}
        />
      )}
    </div>
  );
}
