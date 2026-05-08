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
    <div className="max-w-[var(--max-width-page)] mx-auto animate-fade-in">
      <header className="page-header">
        <div>
          <div className="flex items-center gap-2.5 text-[11px] font-bold tracking-[0.2em] mb-4 text-[var(--green)] uppercase">
            <Briefcase size={14} className="animate-pulse" /> Architecture
          </div>
          <h1 className="text-[clamp(32px,5vw,56px)] font-[900] tracking-[-0.05em] leading-tight text-white flex flex-wrap gap-x-4">
            Your <span className="text-gradient">Fleet.</span>
          </h1>
        </div>
        <button className="btn-premium mb-2" onClick={() => setIsSheetOpen(true)}>
          <Plus size={18} />
          <span>Add New Project</span>
        </button>
      </header>

      {loading ? (
        <div className="dashboard-grid">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton h-[200px] rounded-2xl" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="glass-card flex flex-col items-center p-16 sm:p-24 text-center pb-32">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,255,136,0.05)_0%,_transparent_60%)] pointer-events-none" />
          
          <div className="relative w-40 h-40 mb-12 group cursor-pointer" onClick={() => setIsSheetOpen(true)}>
            <div className="absolute inset-0 border border-[rgba(0,255,136,0.2)] rounded-[2.5rem] rotate-12 bg-[#0A0A0A] group-hover:rotate-45 transition-transform duration-700 ease-in-out" />
            <div className="absolute inset-0 border border-[var(--border)] rounded-[2.5rem] -rotate-6 bg-[rgba(255,255,255,0.02)] backdrop-blur-md flex items-center justify-center shadow-2xl group-hover:-rotate-12 transition-transform duration-700 ease-in-out">
              <Briefcase size={48} className="text-[var(--green)] drop-shadow-[0_0_15px_rgba(0,255,136,0.4)] group-hover:scale-110 transition-transform" />
            </div>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-[900] text-white tracking-tight mb-4 relative z-10">Initialize the Grid</h2>
          <p className="text-[#888] text-sm sm:text-base max-w-[460px] mb-12 leading-relaxed font-medium relative z-10">
            Your fleet is currently empty. Mount your active repositories to grant the neural engine structural context for content synthesis.
          </p>
          <button 
            className="btn-premium h-14 px-10 relative z-10" 
            onClick={() => setIsSheetOpen(true)}
          >
            <Plus size={18} /> Mount First Project
          </button>
        </div>
      ) : (
        <div className="dashboard-grid pb-32">
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
