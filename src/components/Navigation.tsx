import React, { useState } from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  Timer,
  FileEdit,
  FolderGit2,
  TrendingUp,
  Settings as SettingsIcon,
  Menu,
  X,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export type NavSection = 'dashboard' | 'tasks' | 'focus' | 'notes' | 'projects' | 'trading' | 'settings';

interface NavigationProps {
  currentSection: NavSection;
  onNavigate: (section: NavSection) => void;
  pendingTasksCount: number;
  isFocusRunning: boolean;
  onOpenSettings: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentSection,
  onNavigate,
  pendingTasksCount,
  isFocusRunning,
  onOpenSettings,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: NavSection; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string | number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { 
      id: 'tasks', 
      label: "Today's Tasks", 
      icon: CheckSquare, 
      badge: pendingTasksCount > 0 ? pendingTasksCount : undefined 
    },
    { 
      id: 'focus', 
      label: 'Focus Timer', 
      icon: Timer, 
      badge: isFocusRunning ? 'ON' : undefined 
    },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'trading', label: 'Trading Journal', icon: TrendingUp },
    { id: 'notes', label: 'Quick Notes', icon: FileEdit },
  ];

  const handleSelect = (id: NavSection) => {
    if (id === 'settings') {
      onOpenSettings();
    } else {
      onNavigate(id);
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex w-64 flex-col justify-between border-r border-zinc-800/80 bg-[#070a12]/95 backdrop-blur-md p-4 shrink-0 h-screen sticky top-0">
        
        {/* Brand Lockup */}
        <div className="space-y-6">
          <div className="px-2 pt-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30">
                <Zap className="h-4 w-4" />
              </div>
              <div>
                <h1 className="text-sm font-extrabold tracking-wider text-white">DURJOY</h1>
                <p className="text-[10px] font-mono tracking-widest text-emerald-400/90 uppercase">COMMAND CENTER</p>
              </div>
            </div>
            
            <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-zinc-500 font-mono">
              <ShieldCheck className="h-3 w-3 text-emerald-500" />
              <span>Developed by Durjoy</span>
            </div>
          </div>

          {/* Nav List */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-zinc-800/90 text-white font-semibold shadow-sm ring-1 ring-zinc-700/60'
                      : 'text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`h-4 w-4 transition-colors ${
                        isActive ? 'text-emerald-400' : 'text-zinc-500 group-hover:text-zinc-300'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`font-mono text-[10px] px-1.5 py-0.5 rounded tabular-nums ${
                        item.badge === 'ON'
                          ? 'bg-emerald-500/20 text-emerald-400 animate-pulse font-bold'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar: Settings */}
        <div className="pt-4 border-t border-zinc-800/80">
          <button
            onClick={onOpenSettings}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200 transition-colors"
          >
            <SettingsIcon className="h-4 w-4 text-zinc-500" />
            <span>Settings & Backup</span>
          </button>
        </div>
      </aside>

      {/* MOBILE TOP BAR (Brand + Hamburger) */}
      <div className="lg:hidden flex items-center justify-between border-b border-zinc-800/80 bg-[#070a12]/95 px-4 py-2.5 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/25">
            <Zap className="h-3.5 w-3.5" />
          </div>
          <div>
            <div className="text-xs font-bold tracking-wider text-white">DURJOY</div>
            <div className="text-[9px] font-mono text-emerald-400 tracking-wider">COMMAND CENTER</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSettings}
            className="p-1.5 text-zinc-400 hover:text-white"
            title="Settings"
          >
            <SettingsIcon className="h-4 w-4" />
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-1.5 text-zinc-300 hover:bg-zinc-800"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* MOBILE SLIDE-DOWN DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-12 z-30 border-b border-zinc-800 bg-[#090d16]/98 p-4 shadow-2xl backdrop-blur-xl animate-in slide-in-from-top duration-200">
          <div className="mb-3 px-2 text-[11px] font-mono text-zinc-500">
            Developed by Durjoy · Personal Operating Dashboard
          </div>
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`flex items-center gap-2.5 rounded-lg p-2.5 text-xs text-left transition-all ${
                    isActive
                      ? 'bg-zinc-800 text-white font-medium ring-1 ring-zinc-700'
                      : 'text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200'
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-emerald-400' : 'text-zinc-500'}`} />
                  <span className="truncate">{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="ml-auto font-mono text-[10px] text-emerald-400">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* MOBILE BOTTOM NAVIGATION BAR (for fast thumb access) */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 border-t border-zinc-800/90 bg-[#070a12]/95 backdrop-blur-lg px-2 py-1.5">
        <div className="flex items-center justify-around">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`relative flex flex-col items-center gap-0.5 py-1 px-2 text-[10px] font-medium transition-colors ${
                  isActive ? 'text-emerald-400 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="truncate max-w-[54px]">{item.label.split(' ')[0]}</span>
                {item.badge !== undefined && (
                  <span className="absolute top-0 right-1 h-1.5 w-1.5 rounded-full bg-emerald-400 ring-2 ring-[#070a12]" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
