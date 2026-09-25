import React, { useState } from 'react';
import { 
  FolderGit2, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Sliders, 
  Layers,
  Calendar
} from 'lucide-react';
import { Project, ProjectStatus } from '../types';

interface ProjectTrackerSectionProps {
  projects: Project[];
  onAddProject: (project: Omit<Project, 'id' | 'createdAt'>) => void;
  onUpdateProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
}

export const ProjectTrackerSection: React.FC<ProjectTrackerSectionProps> = ({
  projects,
  onAddProject,
  onUpdateProject,
  onDeleteProject,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isAdding, setIsAdding] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  // New project state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('Building');
  const [progress, setProgress] = useState(50);

  // Edit project state
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editStatus, setEditStatus] = useState<ProjectStatus>('Building');
  const [editProgress, setEditProgress] = useState(0);

  const filteredProjects = projects.filter((p) => {
    if (filterStatus === 'all') return true;
    return p.status.toLowerCase() === filterStatus.toLowerCase();
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddProject({
      name: name.trim(),
      description: description.trim(),
      status,
      progress,
    });

    setName('');
    setDescription('');
    setProgress(50);
    setStatus('Building');
    setIsAdding(false);
  };

  const handleStartEdit = (p: Project) => {
    setEditingProjectId(p.id);
    setEditName(p.name);
    setEditDesc(p.description);
    setEditStatus(p.status);
    setEditProgress(p.progress);
  };

  const handleSaveEdit = (p: Project) => {
    if (!editName.trim()) return;
    onUpdateProject({
      ...p,
      name: editName.trim(),
      description: editDesc.trim(),
      status: editStatus,
      progress: editProgress,
      updatedAt: new Date().toISOString(),
    });
    setEditingProjectId(null);
  };

  const handleAdjustProgress = (p: Project, delta: number) => {
    const nextProgress = Math.max(0, Math.min(100, p.progress + delta));
    const nextStatus = nextProgress === 100 ? 'Completed' : p.status;
    onUpdateProject({
      ...p,
      progress: nextProgress,
      status: nextStatus,
      updatedAt: new Date().toISOString(),
    });
  };

  const getStatusColor = (st: ProjectStatus) => {
    switch (st) {
      case 'Completed':
        return 'text-emerald-400';
      case 'Building':
        return 'text-teal-400';
      case 'Planning':
        return 'text-amber-400';
    }
  };

  return (
    <div id="projects-section" className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur-md">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/10 text-teal-400 ring-1 ring-teal-500/25">
            <FolderGit2 className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold tracking-wide text-white">Project Tracker</h2>
            <p className="text-xs text-zinc-400">
              Active engineering pipelines and creative assets
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-teal-500 active:scale-95 transition-all"
        >
          {isAdding ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
          <span>{isAdding ? 'Cancel' : 'Add Project'}</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-1 rounded-lg bg-zinc-950/80 p-1 ring-1 ring-zinc-800">
          {['all', 'planning', 'building', 'completed'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`rounded-md px-3 py-1 text-xs font-medium capitalize transition-all ${
                filterStatus === st
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
        <div className="text-xs text-zinc-500 font-mono tabular-nums">
          {projects.length} Total Projects
        </div>
      </div>

      {/* Add Project Form Collapsible */}
      {isAdding && (
        <form onSubmit={handleCreate} className="mt-4 rounded-lg border border-zinc-700 bg-zinc-950/80 p-4 space-y-3 animate-in fade-in duration-200">
          <div>
            <label htmlFor="project-name-input" className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1">
              Project Name
            </label>
            <input
              id="project-name-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Algorithmic Arbitrage Bot"
              autoFocus
              className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label htmlFor="project-desc-input" className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1">
              Short Description
            </label>
            <input
              id="project-desc-input"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of the objective or deliverables"
              className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="project-status-select" className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1">
                Status
              </label>
              <select
                id="project-status-select"
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-teal-500"
              >
                <option value="Planning">Planning</option>
                <option value="Building">Building</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1">
                <label htmlFor="project-progress-slider">Progress</label>
                <span className="font-mono tabular-nums text-teal-400">{progress}%</span>
              </div>
              <input
                id="project-progress-slider"
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="w-full accent-teal-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="rounded-md px-3 py-1.5 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="rounded-md bg-teal-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-teal-500 disabled:opacity-50"
            >
              Save Project
            </button>
          </div>
        </form>
      )}

      {/* Projects Grid */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredProjects.length === 0 ? (
          <div className="col-span-full rounded-lg border border-dashed border-zinc-800 p-8 text-center text-xs text-zinc-500">
            No projects in this category.
          </div>
        ) : (
          filteredProjects.map((p) => {
            const isEditing = editingProjectId === p.id;

            if (isEditing) {
              return (
                <div key={p.id} className="rounded-xl border border-zinc-700 bg-zinc-950 p-4 space-y-3">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full rounded border border-zinc-700 bg-zinc-900 px-2.5 py-1.5 text-xs text-white"
                  />
                  <input
                    type="text"
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    placeholder="Description"
                    className="w-full rounded border border-zinc-700 bg-zinc-900 px-2.5 py-1 text-xs text-white"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as ProjectStatus)}
                      className="rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs text-zinc-300"
                    >
                      <option value="Planning">Planning</option>
                      <option value="Building">Building</option>
                      <option value="Completed">Completed</option>
                    </select>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={editProgress}
                        onChange={(e) => setEditProgress(Number(e.target.value))}
                        className="w-full accent-teal-500"
                      />
                      <span className="font-mono text-xs text-teal-400 tabular-nums">{editProgress}%</span>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      onClick={() => setEditingProjectId(null)}
                      className="rounded px-2.5 py-1 text-xs text-zinc-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSaveEdit(p)}
                      className="rounded bg-teal-600 px-3 py-1 text-xs font-medium text-white hover:bg-teal-500"
                    >
                      Save
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={p.id}
                className="group relative flex flex-col justify-between rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 transition-all hover:border-zinc-700 hover:bg-zinc-900/40"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-white transition-colors">
                        {p.name}
                      </h3>
                      {p.description && (
                        <p className="mt-1 text-xs text-zinc-400 line-clamp-2">
                          {p.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleStartEdit(p)}
                        className="rounded p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                        title="Edit Project"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteProject(p.id)}
                        className="rounded p-1 text-zinc-400 hover:bg-rose-950/60 hover:text-rose-400"
                        title="Delete Project"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Clean unboxed metadata (anti-slop) */}
                  <div className="mt-3 flex items-center gap-2 text-[11px] text-zinc-500">
                    <span className={`font-medium ${getStatusColor(p.status)}`}>
                      {p.status}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">{p.progress}% Complete</span>
                    <span aria-hidden="true">·</span>
                    <span>
                      {new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>

                {/* Progress bar + Quick adjustment controls */}
                <div className="mt-4 pt-3 border-t border-zinc-800/80">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800 mb-2.5">
                    <div
                      className={`h-full transition-all duration-300 ${
                        p.status === 'Completed' ? 'bg-emerald-500' : 'bg-teal-500'
                      }`}
                      style={{ width: `${p.progress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-zinc-400">
                    <span className="font-mono tabular-nums">{p.progress}%</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleAdjustProgress(p, -10)}
                        className="rounded bg-zinc-900 px-1.5 py-0.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
                        title="Decrease Progress by 10%"
                      >
                        -10%
                      </button>
                      <button
                        onClick={() => handleAdjustProgress(p, 10)}
                        className="rounded bg-zinc-900 px-1.5 py-0.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
                        title="Increase Progress by 10%"
                      >
                        +10%
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
