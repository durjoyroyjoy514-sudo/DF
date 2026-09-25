/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  loadAppData, 
  saveAppData, 
  exportAppDataFile, 
  parseImportData, 
  DEFAULT_APP_DATA 
} from './utils/storage';
import { sound } from './utils/sound';
import { 
  AppData, 
  Task, 
  Project, 
  Trade, 
  DailyGoal, 
  AppSettings, 
  FocusStats 
} from './types';

// Components
import { Navigation, NavSection } from './components/Navigation';
import { TopHeader } from './components/TopHeader';
import { DashboardOverview } from './components/DashboardOverview';
import { TasksSection } from './components/TasksSection';
import { FocusTimerSection } from './components/FocusTimerSection';
import { ProjectTrackerSection } from './components/ProjectTrackerSection';
import { TradingJournalSection } from './components/TradingJournalSection';
import { QuickNotesSection } from './components/QuickNotesSection';
import { SettingsModal } from './components/SettingsModal';
import { QuickActionsModal } from './components/QuickActionsModal';

export default function App() {
  const [appData, setAppData] = useState<AppData>(() => loadAppData());
  const [currentSection, setCurrentSection] = useState<NavSection>('dashboard');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [quickActionState, setQuickActionState] = useState<{
    isOpen: boolean;
    initialType: 'task' | 'project' | 'trade' | 'focus' | 'note';
  }>({
    isOpen: false,
    initialType: 'task',
  });
  const [focusTimerStatusText, setFocusTimerStatusText] = useState('');

  // Persist state changes to localStorage
  useEffect(() => {
    saveAppData(appData);
  }, [appData]);

  // Apply dark/light theme to document body
  useEffect(() => {
    const isDark = appData.settings.theme === 'dark';
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.className = 'bg-[#090d16] text-zinc-100 antialiased selection:bg-emerald-500/20 selection:text-emerald-300';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.className = 'bg-slate-50 text-slate-900 antialiased selection:bg-emerald-500/20 selection:text-emerald-700';
    }
  }, [appData.settings.theme]);

  // Sound triggers
  const handlePlayChime = useCallback(() => {
    if (appData.settings.soundEnabled) {
      sound.playTimerComplete();
    }
  }, [appData.settings.soundEnabled]);

  const handlePlaySuccess = useCallback(() => {
    if (appData.settings.soundEnabled) {
      sound.playTaskSuccess();
    }
  }, [appData.settings.soundEnabled]);

  // Task Handlers
  const handleAddTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
    };
    setAppData((prev) => ({
      ...prev,
      tasks: [newTask, ...prev.tasks],
    }));
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setAppData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)),
    }));
  };

  const handleDeleteTask = (taskId: string) => {
    setAppData((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== taskId),
    }));
  };

  // Project Handlers
  const handleAddProject = (projectData: Omit<Project, 'id' | 'createdAt'>) => {
    const newProject: Project = {
      ...projectData,
      id: `proj-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
    };
    setAppData((prev) => ({
      ...prev,
      projects: [newProject, ...prev.projects],
    }));
  };

  const handleUpdateProject = (updatedProject: Project) => {
    setAppData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === updatedProject.id ? updatedProject : p)),
    }));
  };

  const handleDeleteProject = (projectId: string) => {
    setAppData((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== projectId),
    }));
  };

  // Trade Handlers
  const handleAddTrade = (tradeData: Omit<Trade, 'id'>) => {
    const newTrade: Trade = {
      ...tradeData,
      id: `trade-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    };
    setAppData((prev) => ({
      ...prev,
      trades: [newTrade, ...prev.trades],
    }));
  };

  const handleDeleteTrade = (tradeId: string) => {
    setAppData((prev) => ({
      ...prev,
      trades: prev.trades.filter((t) => t.id !== tradeId),
    }));
  };

  // Daily Goal Handler
  const handleUpdateDailyGoal = (dailyGoal: DailyGoal) => {
    setAppData((prev) => ({
      ...prev,
      dailyGoal,
    }));
  };

  // Quick Notes Handler
  const handleUpdateNotes = (notes: string) => {
    setAppData((prev) => ({
      ...prev,
      notes,
    }));
  };

  // Focus Stats Handler
  const handleUpdateFocusStats = (focusStats: FocusStats) => {
    setAppData((prev) => ({
      ...prev,
      focusStats,
    }));
  };

  // Settings Handlers
  const handleUpdateSettings = (newSettings: Partial<AppSettings>) => {
    setAppData((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...newSettings,
      },
    }));
  };

  const handleExportData = () => {
    exportAppDataFile(appData);
  };

  const handleImportData = (jsonStr: string): boolean => {
    const parsed = parseImportData(jsonStr);
    if (parsed) {
      setAppData(parsed);
      saveAppData(parsed);
      return true;
    }
    return false;
  };

  const handleResetAllData = () => {
    setAppData(DEFAULT_APP_DATA);
    saveAppData(DEFAULT_APP_DATA);
  };

  // Quick Action Opener
  const handleOpenQuickAction = (actionType: 'task' | 'project' | 'trade' | 'focus' | 'note') => {
    if (actionType === 'focus') {
      setCurrentSection('focus');
    } else if (actionType === 'note') {
      setCurrentSection('notes');
    } else {
      setQuickActionState({
        isOpen: true,
        initialType: actionType,
      });
    }
  };

  const pendingTasksCount = appData.tasks.filter((t) => !t.completed).length;
  const isFocusRunning = Boolean(focusTimerStatusText && !focusTimerStatusText.includes('Paused'));

  return (
    <div className={`min-h-screen flex ${appData.settings.theme === 'light' ? 'bg-slate-50 text-slate-900' : 'bg-[#090d16] text-zinc-100'}`}>
      
      {/* Sidebar Navigation */}
      <Navigation
        currentSection={currentSection}
        onNavigate={setCurrentSection}
        pendingTasksCount={pendingTasksCount}
        isFocusRunning={isFocusRunning}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-8">
        
        {/* Top Header */}
        <TopHeader
          settings={appData.settings}
          onUpdateSettings={handleUpdateSettings}
          onOpenQuickAction={handleOpenQuickAction}
          onNavigate={setCurrentSection}
          activeFocusText={focusTimerStatusText}
        />

        {/* Viewport Content */}
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
          
          {currentSection === 'dashboard' && (
            <DashboardOverview
              tasks={appData.tasks}
              projects={appData.projects}
              trades={appData.trades}
              dailyGoal={appData.dailyGoal}
              focusStats={appData.focusStats}
              onUpdateDailyGoal={handleUpdateDailyGoal}
              onNavigate={setCurrentSection}
              onOpenQuickAction={handleOpenQuickAction}
              focusTimerStatusText={focusTimerStatusText}
              onTriggerSound={handlePlaySuccess}
            />
          )}

          {currentSection === 'tasks' && (
            <TasksSection
              tasks={appData.tasks}
              onAddTask={handleAddTask}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
              onTriggerSound={handlePlaySuccess}
            />
          )}

          {currentSection === 'focus' && (
            <FocusTimerSection
              timerDurations={appData.settings.timerDurations}
              focusStats={appData.focusStats}
              onUpdateFocusStats={handleUpdateFocusStats}
              soundEnabled={appData.settings.soundEnabled}
              onPlayChime={handlePlayChime}
              onModeChangeForHeader={setFocusTimerStatusText}
            />
          )}

          {currentSection === 'projects' && (
            <ProjectTrackerSection
              projects={appData.projects}
              onAddProject={handleAddProject}
              onUpdateProject={handleUpdateProject}
              onDeleteProject={handleDeleteProject}
            />
          )}

          {currentSection === 'trading' && (
            <TradingJournalSection
              trades={appData.trades}
              onAddTrade={handleAddTrade}
              onDeleteTrade={handleDeleteTrade}
            />
          )}

          {currentSection === 'notes' && (
            <QuickNotesSection
              notes={appData.notes}
              onUpdateNotes={handleUpdateNotes}
            />
          )}

        </main>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={appData.settings}
        onUpdateSettings={handleUpdateSettings}
        onExportData={handleExportData}
        onImportData={handleImportData}
        onResetAllData={handleResetAllData}
      />

      {/* Quick Actions Modal */}
      <QuickActionsModal
        isOpen={quickActionState.isOpen}
        onClose={() => setQuickActionState((prev) => ({ ...prev, isOpen: false }))}
        initialType={quickActionState.initialType}
        onAddTask={handleAddTask}
        onAddProject={handleAddProject}
        onAddTrade={handleAddTrade}
        onStartFocus={() => setCurrentSection('focus')}
        onFocusNotes={() => setCurrentSection('notes')}
      />

    </div>
  );
}
