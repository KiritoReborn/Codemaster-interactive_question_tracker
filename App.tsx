import React, { useMemo, useState, useEffect } from 'react';
import { useStore, ViewType } from './store';
import { 
  Terminal, 
  LayoutGrid, 
  Bolt, 
  Layers, 
  FolderOpen, 
  BarChart2, 
  Settings, 
  Search, 
  ChevronDown, 
  ChevronRight, 
  CheckCircle2, 
  Circle, 
  Clock, 
  ExternalLink,
  Trash2,
  Plus,
  GripVertical,
  ChevronUp,
  MoreVertical,
  CornerDownRight,
  Database,
  Trophy,
  Target,
  Flame,
  BrainCircuit,
  Bookmark,
  Check,
  StickyNote,
  Filter,
  Info,
  Code2,
  Sparkles,
  Zap,
  Moon,
  Sun
} from 'lucide-react';
import { AddModal } from './components/AddModal';
import { ConfirmationModal } from './components/ConfirmationModal';
import { ChatBot } from './components/ChatBot';
import { Difficulty, Status } from './types';
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// --- Helper Components ---

const DifficultyBadge = ({ level }: { level: Difficulty }) => {
  const styles = {
    Easy: 'text-emerald-600 bg-emerald-100 border-emerald-200 dark:text-easy dark:bg-easy/5 dark:border-easy/20 shadow-none dark:shadow-[0_0_10px_-2px_rgba(52,211,153,0.3)]',
    Medium: 'text-amber-600 bg-amber-100 border-amber-200 dark:text-medium dark:bg-medium/5 dark:border-medium/20 shadow-none dark:shadow-[0_0_10px_-2px_rgba(251,191,36,0.3)]',
    Hard: 'text-rose-600 bg-rose-100 border-rose-200 dark:text-hard dark:bg-hard/5 dark:border-hard/20 shadow-none dark:shadow-[0_0_10px_-2px_rgba(251,113,133,0.3)]'
  };

  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all duration-300 ${styles[level]}`}>
      {level}
    </span>
  );
};

const StatusButton = ({ status, onClick }: { status: Status, onClick: () => void }) => {
  if (status === 'Solved') {
    return (
      <button onClick={onClick} className="group relative overflow-hidden flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-600 border-emerald-200 dark:bg-easy/10 dark:text-easy text-xs font-bold border dark:border-easy/20 hover:bg-emerald-200 dark:hover:bg-easy/20 transition-all shadow-sm">
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
        <CheckCircle2 size={16} className="fill-current" />
        Solved
      </button>
    );
  }
  if (status === 'Revision') {
    return (
      <button onClick={onClick} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-100 text-amber-600 border-amber-200 dark:bg-medium/10 dark:text-medium text-xs font-bold border dark:border-medium/20 hover:bg-amber-200 dark:hover:bg-medium/20 transition-all">
        <Clock size={16} />
        Revision
      </button>
    );
  }
  return (
    <button onClick={onClick} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800/50 dark:text-slate-400 text-xs font-bold border dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-all">
      <Circle size={16} />
      To Do
    </button>
  );
};

const Checkbox = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
  <button
    onClick={(e) => { e.stopPropagation(); onChange(); }}
    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
      checked
        ? 'bg-emerald-500 border-emerald-500 text-white dark:bg-easy dark:border-easy dark:text-black shadow-md scale-110'
        : 'bg-transparent border-slate-300 dark:border-slate-600 hover:border-primary/50 hover:bg-primary/5'
    }`}
  >
    {checked && <Check size={14} strokeWidth={4} />}
  </button>
);

const ProgressBar = ({ total, solved }: { total: number, solved: number }) => {
  const percentage = total === 0 ? 0 : Math.round((solved / total) * 100);
  return (
    <div className="flex flex-col items-end min-w-[160px] group cursor-default">
      <div className="flex justify-between w-full mb-2 text-[10px] font-bold uppercase tracking-wider">
        <span className="text-slate-500 group-hover:text-primary transition-colors">Progress</span>
        <span className="text-slate-900 dark:text-white text-glow">{percentage}%</span>
      </div>
      <div className="w-full bg-slate-200 dark:bg-slate-800/50 rounded-full h-2 overflow-hidden border border-slate-200 dark:border-slate-700/50 relative">
        <div 
          className="bg-gradient-to-r from-primary via-secondary to-accent h-full rounded-full transition-all duration-1000 ease-out shadow-lg dark:shadow-[0_0_15px_rgba(99,102,241,0.5)] relative overflow-hidden" 
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.3)_50%,transparent_100%)] w-full h-full animate-[shimmer_2s_infinite]"></div>
        </div>
      </div>
      <span className="text-[10px] font-bold text-slate-500 mt-2 flex gap-1">
        <span className="text-slate-900 dark:text-white">{solved}</span> <span className="text-slate-400 dark:text-slate-600">/</span> {total} Solved
      </span>
    </div>
  );
};

// --- View Components ---

const PerformanceView = ({ stats }: { stats: any }) => {
  return (
    <div className="p-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-3xl bg-gradient-to-br from-primary/10 to-transparent border-primary/20 relative group overflow-hidden">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/10 dark:bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-all"></div>
          <div className="flex items-center gap-4 mb-4 relative z-10">
            <div className="p-3 rounded-2xl bg-primary/20 text-primary shadow-inner shadow-primary/10">
              <Trophy size={24} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Total Solved</p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white">{stats.solvedQuestions} <span className="text-sm text-slate-400 dark:text-slate-500 font-medium">/ {stats.totalQuestions}</span></h3>
            </div>
          </div>
          <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mt-2">
            <div className="h-full bg-primary shadow-sm dark:shadow-[0_0_10px_rgba(99,102,241,0.5)]" style={{ width: `${(stats.solvedQuestions / stats.totalQuestions) * 100}%` }}></div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl bg-gradient-to-br from-easy/10 to-transparent border-easy/20 relative group overflow-hidden">
           <div className="absolute -right-10 -top-10 w-32 h-32 bg-easy/10 dark:bg-easy/20 rounded-full blur-3xl group-hover:bg-easy/20 dark:group-hover:bg-easy/30 transition-all"></div>
          <div className="flex items-center gap-4 mb-4 relative z-10">
            <div className="p-3 rounded-2xl bg-easy/20 text-emerald-600 dark:text-easy shadow-inner shadow-easy/10">
              <Target size={24} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Easy</p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white">{stats.easy}</h3>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl bg-gradient-to-br from-medium/10 to-transparent border-medium/20 relative group overflow-hidden">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-medium/10 dark:bg-medium/20 rounded-full blur-3xl group-hover:bg-medium/20 dark:group-hover:bg-medium/30 transition-all"></div>
          <div className="flex items-center gap-4 mb-4 relative z-10">
            <div className="p-3 rounded-2xl bg-medium/20 text-amber-600 dark:text-medium shadow-inner shadow-medium/10">
              <Flame size={24} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Medium</p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white">{stats.medium}</h3>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl bg-gradient-to-br from-hard/10 to-transparent border-hard/20 relative group overflow-hidden">
           <div className="absolute -right-10 -top-10 w-32 h-32 bg-hard/10 dark:bg-hard/20 rounded-full blur-3xl group-hover:bg-hard/20 dark:group-hover:bg-hard/30 transition-all"></div>
          <div className="flex items-center gap-4 mb-4 relative z-10">
            <div className="p-3 rounded-2xl bg-hard/20 text-rose-600 dark:text-hard shadow-inner shadow-hard/10">
              <BrainCircuit size={24} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Hard</p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white">{stats.hard}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card p-8 rounded-3xl border-slate-200 dark:border-slate-800/50">
        <div className="flex items-center justify-between mb-8">
           <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
             <BarChart2 className="text-primary" />
             Detailed Analytics
           </h3>
           <div className="flex gap-2">
             <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-white/5 text-xs font-medium text-slate-500 dark:text-slate-400">Weekly</span>
             <span className="px-3 py-1 rounded-lg bg-primary/20 text-xs font-medium text-primary">Monthly</span>
           </div>
        </div>
        <div className="h-80 w-full flex items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-black/20 text-slate-400 dark:text-slate-500 relative overflow-hidden group">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
           <p className="z-10 font-mono text-sm tracking-widest">CHART_VISUALIZATION_MODULE_NOT_LOADED</p>
        </div>
      </div>
    </div>
  );
};

// --- Sortable Item Component ---

interface SortableTopicItemProps {
  id: string;
  children: (listeners: any) => React.ReactNode;
}

const SortableTopicItem = ({ id, children }: SortableTopicItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 'auto',
    position: 'relative' as const,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} className="touch-none">
      {children(listeners)}
    </div>
  );
};

// --- Main App Component ---

function App() {
  const store = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null);
  const [expandedDescId, setExpandedDescId] = useState<string | null>(null);
  const [modalConfig, setModalConfig] = useState<{
    type: 'topic' | 'subTopic' | 'question';
    title: string;
    topicId?: string;
    subTopicId?: string;
  }>({ type: 'topic', title: '' });

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfig, setDeleteConfig] = useState<{
    type: 'topic' | 'question';
    title: string;
    topicId: string;
    subTopicId?: string;
    questionId?: string;
  } | null>(null);

  // Sync Theme with HTML class
  useEffect(() => {
    if (store.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [store.theme]);

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
        activationConstraint: {
            distance: 8,
        },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (active.id !== over?.id) {
      const oldIndex = store.topics.findIndex((t) => t.id === active.id);
      const newIndex = store.topics.findIndex((t) => t.id === over?.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        store.reorderTopics(oldIndex, newIndex);
      }
    }
  };

  // Compute Stats
  const stats = useMemo(() => {
    let totalQuestions = 0;
    let solvedQuestions = 0;
    let easy = 0, medium = 0, hard = 0;
    
    store.topics.forEach(t => {
      t.subTopics.forEach(st => {
        st.questions.forEach(q => {
          totalQuestions++;
          if (q.status === 'Solved') solvedQuestions++;
          if (q.difficulty === 'Easy') easy++;
          if (q.difficulty === 'Medium') medium++;
          if (q.difficulty === 'Hard') hard++;
        });
      });
    });

    return { totalQuestions, solvedQuestions, easy, medium, hard };
  }, [store.topics]);

  // Modals Handlers
  const openAddTopic = () => {
    setModalConfig({ type: 'topic', title: 'Create New Topic' });
    setIsModalOpen(true);
  };

  const openAddSubTopic = (topicId: string) => {
    setModalConfig({ type: 'subTopic', title: 'Add Sub-Topic', topicId });
    setIsModalOpen(true);
  };

  const openAddQuestion = (topicId: string, subTopicId: string) => {
    setModalConfig({ type: 'question', title: 'Add New Question', topicId, subTopicId });
    setIsModalOpen(true);
  };

  const handleConfirmAdd = (data: any) => {
    if (modalConfig.type === 'topic') {
      store.addTopic(data.title);
    } else if (modalConfig.type === 'subTopic' && modalConfig.topicId) {
      store.addSubTopic(modalConfig.topicId, data.title);
    } else if (modalConfig.type === 'question' && modalConfig.topicId && modalConfig.subTopicId) {
      store.addQuestion(modalConfig.topicId, modalConfig.subTopicId, data);
    }
  };

  // Delete Handlers
  const requestDeleteTopic = (topic: any) => {
    setDeleteConfig({
      type: 'topic',
      title: topic.title,
      topicId: topic.id
    });
    setIsDeleteModalOpen(true);
  };

  const requestDeleteQuestion = (topicId: string, subTopicId: string, question: any) => {
    setDeleteConfig({
      type: 'question',
      title: question.title,
      topicId,
      subTopicId,
      questionId: question.id
    });
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteConfig) return;
    
    if (deleteConfig.type === 'topic') {
      store.deleteTopic(deleteConfig.topicId);
    } else if (deleteConfig.type === 'question' && deleteConfig.subTopicId && deleteConfig.questionId) {
      store.deleteQuestion(deleteConfig.topicId, deleteConfig.subTopicId, deleteConfig.questionId);
    }
    setIsDeleteModalOpen(false);
    setDeleteConfig(null);
  };

  // Navigation Helper
  const NavItem = ({ id, label, icon: Icon, colorClass }: { id: ViewType, label: string, icon: any, colorClass: string }) => (
    <button 
      onClick={() => store.setActiveView(id)}
      className={`relative w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group overflow-hidden ${
        store.activeView === id 
        ? 'bg-gradient-to-r from-primary/10 to-transparent dark:from-white/10 dark:to-transparent text-slate-900 dark:text-white shadow-sm dark:shadow-lg border-l-4 border-primary' 
        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
      }`}
    >
      <div className={`absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-0 transition-opacity duration-300 ${store.activeView === id ? 'opacity-100' : 'group-hover:opacity-30'}`}></div>
      <Icon size={20} className={`relative z-10 transition-colors ${store.activeView === id ? colorClass : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-white'}`} />
      <span className="relative z-10 text-sm font-semibold tracking-wide">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen w-full font-sans bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-80 glass-panel border-r border-slate-200 dark:border-slate-800/50 flex flex-col flex-shrink-0 z-20 shadow-xl dark:shadow-[4px_0_24px_-2px_rgba(0,0,0,0.3)]">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 bg-primary/40 rounded-xl blur-lg animate-pulse-slow"></div>
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white border border-white/10 shadow-xl">
                <Code2 size={24} />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-display font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
                Code<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Master</span>
              </h1>
              <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">v2.0.4 • Beta</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-6 overflow-y-auto custom-scrollbar py-2">
          <div>
            <p className="px-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
              <Layers size={10} /> Problem Sets
            </p>
            <div className="space-y-1">
              <NavItem id="striver" label="Striver SDE Sheet" icon={Bolt} colorClass="text-primary" />
              <NavItem id="neetcode" label="NeetCode 150" icon={Zap} colorClass="text-secondary" />
              <NavItem id="babbar" label="Love Babbar 450" icon={FolderOpen} colorClass="text-accent" />
            </div>
          </div>

          <div>
            <p className="px-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
              <BarChart2 size={10} /> Analytics
            </p>
            <div className="space-y-1">
              <NavItem id="performance" label="Performance" icon={Trophy} colorClass="text-medium" />
            </div>
          </div>
        </nav>

        <div className="p-6 border-t border-slate-200 dark:border-white/5">
          {/* Theme Toggle */}
          <button 
            onClick={() => store.setTheme(store.theme === 'dark' ? 'light' : 'dark')}
            className="w-full flex items-center justify-between px-4 py-3 mb-4 rounded-xl bg-slate-100 dark:bg-white/5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
          >
            <span className="flex items-center gap-3">
              {store.theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
              {store.theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
            </span>
            <div className={`w-10 h-5 rounded-full p-1 transition-colors ${store.theme === 'dark' ? 'bg-primary' : 'bg-slate-300'}`}>
              <div className={`w-3 h-3 rounded-full bg-white transition-transform ${store.theme === 'dark' ? 'translate-x-5' : 'translate-x-0'}`}></div>
            </div>
          </button>

          <div className="glass-card p-3 rounded-2xl flex items-center gap-4 hover:border-primary/30 transition-colors group cursor-pointer bg-white/50 dark:bg-transparent">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 border border-slate-200 dark:border-white/10 overflow-hidden">
                 <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-full h-full" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 dark:bg-easy border-2 border-white dark:border-surface rounded-full shadow-sm"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate text-slate-800 dark:text-white group-hover:text-primary transition-colors">Alex Johnson</p>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Pro Member</p>
            </div>
            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
              <Settings size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header */}
        <header className="h-24 glass-panel border-b-0 border-r-0 border-l-0 border-slate-200 dark:border-slate-800/50 flex items-center justify-between px-10 flex-shrink-0 z-10">
          <div>
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-display font-bold tracking-tight text-slate-900 dark:text-white drop-shadow-sm">
                {store.activeView === 'striver' && 'Striver SDE Sheet'}
                {store.activeView === 'neetcode' && 'NeetCode 150'}
                {store.activeView === 'babbar' && 'Love Babbar 450'}
                {store.activeView === 'performance' && 'Performance Analytics'}
              </h2>
              {store.activeView !== 'performance' && (
                 <div className="px-3 py-1 rounded-full bg-slate-200 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    DSA Tracker
                 </div>
              )}
            </div>
          </div>

          {store.activeView !== 'performance' && (
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3 bg-white/50 dark:bg-black/20 p-1.5 rounded-2xl border border-slate-200 dark:border-white/5">
                 {/* Difficulty Filter */}
                 <div className="relative">
                   <select
                     value={store.difficultyFilter}
                     onChange={(e) => store.setDifficultyFilter(e.target.value as any)}
                     className="pl-3 pr-8 py-2 rounded-xl bg-transparent text-slate-600 dark:text-slate-300 text-sm font-medium focus:outline-none focus:bg-slate-100 dark:focus:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-colors appearance-none cursor-pointer"
                   >
                     <option value="All">All Levels</option>
                     <option value="Easy">Easy</option>
                     <option value="Medium">Medium</option>
                     <option value="Hard">Hard</option>
                   </select>
                   <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" />
                 </div>

                 <div className="w-px h-4 bg-slate-300 dark:bg-slate-700"></div>

                 {/* Bookmark Toggle */}
                 <button 
                  onClick={() => store.setShowBookmarkedOnly(!store.showBookmarkedOnly)}
                  className={`p-2 rounded-lg transition-all ${
                    store.showBookmarkedOnly 
                    ? 'text-amber-500 bg-amber-100 dark:text-yellow-400 dark:bg-yellow-400/10' 
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                  title="Show Bookmarked Only"
                >
                  <Bookmark size={18} fill={store.showBookmarkedOnly ? "currentColor" : "none"} />
                </button>

                 {/* Search */}
                 <div className="relative group">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Search size={16} className="text-slate-400 dark:text-slate-500 group-focus-within:text-primary transition-colors" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    value={store.searchQuery}
                    onChange={(e) => store.setSearchQuery(e.target.value)}
                    className="block w-48 pl-10 pr-4 py-2 rounded-xl bg-transparent text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:bg-slate-100 dark:focus:bg-white/5 transition-all text-sm font-medium"
                  />
                </div>
              </div>
              
              <ProgressBar total={stats.totalQuestions} solved={stats.solvedQuestions} />
            </div>
          )}
        </header>

        {/* Dynamic Content View */}
        <div className="flex-1 overflow-y-auto custom-scrollbar scroll-smooth">
          {store.activeView === 'performance' ? (
            <PerformanceView stats={stats} />
          ) : (
            <div className="p-10 max-w-7xl mx-auto space-y-6 pb-32">
              
              {store.activeView !== 'striver' && store.topics.length > 0 && (
                <div className="p-4 rounded-xl bg-primary/5 dark:bg-primary/10 border border-primary/20 text-primary-700 dark:text-primary-200 text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
                   <div className="p-2 rounded-lg bg-primary/20 text-primary"><Database size={16} /></div>
                   <span><strong>Data Source:</strong> Loaded Striver's A2Z DSA Sheet from provided dataset.</span>
                </div>
              )}

              <DndContext 
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext 
                  items={store.topics.map(t => t.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {store.topics.map((topic, index) => {
                    const filteredSubTopics = topic.subTopics.map(st => ({
                      ...st,
                      questions: st.questions.filter(q => {
                        const matchesSearch = q.title.toLowerCase().includes(store.searchQuery.toLowerCase());
                        const matchesBookmark = store.showBookmarkedOnly ? q.isBookmarked : true;
                        const matchesDifficulty = store.difficultyFilter === 'All' || q.difficulty === store.difficultyFilter;
                        return matchesSearch && matchesBookmark && matchesDifficulty;
                      })
                    })).filter(st => st.questions.length > 0 || (store.searchQuery === '' && !store.showBookmarkedOnly && store.difficultyFilter === 'All'));

                    if ((store.searchQuery !== '' || store.showBookmarkedOnly || store.difficultyFilter !== 'All') && filteredSubTopics.length === 0) return null;

                    let topicTotal = 0;
                    let topicSolved = 0;
                    topic.subTopics.forEach(st => st.questions.forEach(q => {
                      topicTotal++;
                      if (q.status === 'Solved') topicSolved++;
                    }));
                    const topicProgress = topicTotal === 0 ? 0 : Math.round((topicSolved / topicTotal) * 100);

                    return (
                      <SortableTopicItem 
                        key={topic.id} 
                        id={topic.id}
                        children={(dragListeners) => (
                          <div className="glass-card rounded-2xl group/topic border-l-4 border-l-transparent hover:border-l-primary transition-all duration-300">
                          {/* Topic Header */}
                          <div 
                            className="p-5 flex items-center justify-between cursor-pointer select-none"
                            onClick={() => store.toggleTopic(topic.id)}
                          >
                            <div className="flex items-center gap-6 flex-1 mr-6">
                              {/* Drag Handle */}
                              <div 
                                className="flex flex-col gap-1 opacity-0 group-hover/topic:opacity-100 transition-opacity" 
                                onClick={e => e.stopPropagation()}
                                {...dragListeners}
                              >
                                <div className="cursor-grab active:cursor-grabbing text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-white p-1 rounded hover:bg-slate-100 dark:hover:bg-white/10">
                                  <GripVertical size={18} />
                                </div>
                              </div>
                              
                              <div className="flex-1 flex items-center gap-4">
                                <div className={`p-3 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 transition-all duration-300 ${topic.isExpanded ? 'bg-primary/10 dark:bg-primary/20 text-primary border-primary/30 rotate-90' : 'text-slate-400'}`}>
                                  <ChevronRight size={20} />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                      <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white group-hover/topic:text-primary transition-colors">{topic.title}</h3>
                                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/5">{topicTotal} Questions</span>
                                  </div>
                                  
                                  {/* Mini Progress Bar */}
                                  <div className="flex items-center gap-3 max-w-md">
                                      <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div 
                                          className={`h-full rounded-full transition-all duration-700 ${topicProgress === 100 ? 'bg-emerald-500 dark:bg-easy shadow-sm dark:shadow-[0_0_10px_rgba(52,211,153,0.5)]' : 'bg-gradient-to-r from-primary to-secondary'}`} 
                                          style={{ width: `${topicProgress}%` }}
                                        />
                                      </div>
                                      <span className={`text-[10px] font-bold ${topicProgress === 100 ? 'text-emerald-600 dark:text-easy' : 'text-slate-500'}`}>{topicProgress}%</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 opacity-0 group-hover/topic:opacity-100 transition-all transform translate-x-4 group-hover/topic:translate-x-0" onClick={e => e.stopPropagation()}>
                              <button onClick={() => requestDeleteTopic(topic)} className="p-2 text-slate-400 hover:text-rose-500 dark:hover:text-hard hover:bg-rose-50 dark:hover:bg-hard/10 rounded-lg transition-colors"><Trash2 size={18} /></button>
                              <button onClick={() => openAddSubTopic(topic.id)} className="bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary hover:text-primary-700 dark:hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-primary/10">
                                <Plus size={16} /> Sub-topic
                              </button>
                            </div>
                          </div>

                          {/* Topic Body */}
                          {topic.isExpanded && (
                            <div className="border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/20 animate-in slide-in-from-top-2 duration-300">
                              {filteredSubTopics.length === 0 ? (
                                <div className="p-12 flex flex-col items-center justify-center text-slate-500 gap-3">
                                    <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800/50 flex items-center justify-center text-slate-400 dark:text-slate-600"><Search size={24} /></div>
                                    <p className="text-sm font-medium">No matching questions found.</p>
                                </div>
                              ) : (
                                filteredSubTopics.map(subTopic => {
                                  const originalSubTopic = topic.subTopics.find(t => t.id === subTopic.id) || subTopic;
                                  const subTopicTotal = originalSubTopic.questions.length;
                                  const subTopicSolved = originalSubTopic.questions.filter(q => q.status === 'Solved').length;
                                  const subTopicProgress = subTopicTotal === 0 ? 0 : Math.round((subTopicSolved / subTopicTotal) * 100);

                                  return (
                                    <div key={subTopic.id} className="border-b border-slate-100 dark:border-white/5 last:border-0">
                                      {/* SubTopic Header */}
                                      <div className="px-5 py-3 bg-slate-100/50 dark:bg-white/[0.02] border-b border-slate-200 dark:border-white/5 flex items-center justify-between group/sub">
                                        <div className="flex items-center gap-4 pl-12">
                                          <div className="flex items-center gap-2 text-slate-400">
                                            <CornerDownRight size={14} className="opacity-50" />
                                            <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-300 group-hover/sub:text-slate-900 dark:group-hover/sub:text-white transition-colors">{subTopic.title}</span>
                                          </div>
                                          
                                          {subTopicTotal > 0 && (
                                            <div className="flex items-center gap-3 opacity-0 group-hover/sub:opacity-100 transition-all duration-300">
                                              <div className="w-16 h-1 bg-slate-300 dark:bg-slate-700/50 rounded-full overflow-hidden">
                                                  <div className={`h-full rounded-full ${subTopicProgress === 100 ? 'bg-emerald-500 dark:bg-easy' : 'bg-slate-400'}`} style={{ width: `${subTopicProgress}%` }} />
                                              </div>
                                              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">{subTopicSolved}/{subTopicTotal}</span>
                                            </div>
                                          )}
                                        </div>
                                        <button onClick={() => openAddQuestion(topic.id, subTopic.id)} className="text-[10px] font-bold text-primary hover:text-white hover:bg-primary transition-all flex items-center gap-1 bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20">
                                          <Plus size={12} /> Add Question
                                        </button>
                                      </div>

                                      {/* Questions List */}
                                      <div className="flex flex-col">
                                        {subTopic.questions.map(question => (
                                          <div key={question.id} className="group/q relative border-b border-slate-100 dark:border-white/5 last:border-0 hover:bg-white dark:hover:bg-white/[0.03] transition-colors">
                                            {/* Highlight Bar */}
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary opacity-0 group-hover/q:opacity-100 transition-opacity"></div>
                                            
                                            <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center">
                                              <div className="col-span-5 flex items-center gap-4 pl-8">
                                                
                                                <Checkbox 
                                                  checked={question.status === 'Solved'} 
                                                  onChange={() => store.markQuestionComplete(topic.id, subTopic.id, question.id, question.status !== 'Solved')}
                                                />

                                                <div className="flex items-center gap-2 min-w-0">
                                                  <a 
                                                    href={question.url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className={`text-sm font-semibold truncate transition-colors flex items-center gap-2 ${question.status === 'Solved' ? 'text-slate-400 line-through decoration-slate-400 dark:decoration-slate-600' : 'text-slate-700 dark:text-slate-200 group-hover/q:text-primary'}`}
                                                  >
                                                    {question.title}
                                                  </a>
                                                  
                                                  <a href={question.url} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-slate-100 dark:hover:bg-white/10 rounded-md text-slate-400 hover:text-slate-900 dark:hover:text-white"><ExternalLink size={14} /></a>
                                                </div>
                                              </div>
                                              
                                              <div className="col-span-2">
                                                <StatusButton 
                                                  status={question.status} 
                                                  onClick={() => store.toggleStatus(topic.id, subTopic.id, question.id)} 
                                                />
                                              </div>
                                              
                                              <div className="col-span-2">
                                                <DifficultyBadge level={question.difficulty} />
                                              </div>
                                              
                                              <div className="col-span-3 flex items-center justify-end gap-2">
                                                {/* Note */}
                                                <button 
                                                  onClick={(e) => { e.stopPropagation(); setExpandedNoteId(expandedNoteId === question.id ? null : question.id); }}
                                                  className={`p-2 rounded-lg transition-colors ${question.note ? 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'text-slate-400 hover:text-blue-500 hover:bg-slate-100 dark:hover:bg-white/5'}`}
                                                  title="Notes"
                                                >
                                                  <StickyNote size={18} fill={question.note ? "currentColor" : "none"} />
                                                </button>

                                                {/* Description */}
                                                <button 
                                                  onClick={(e) => { e.stopPropagation(); setExpandedDescId(expandedDescId === question.id ? null : question.id); }}
                                                  className={`p-2 rounded-lg transition-colors ${expandedDescId === question.id || question.description ? 'text-purple-500 bg-purple-50 dark:bg-purple-900/20' : 'text-slate-400 hover:text-purple-500 hover:bg-slate-100 dark:hover:bg-white/5'}`}
                                                  title="Problem Description"
                                                >
                                                  <Info size={18} fill={question.description ? "currentColor" : "none"} />
                                                </button>

                                                {/* Bookmark */}
                                                <button 
                                                  onClick={(e) => { e.stopPropagation(); store.toggleBookmark(topic.id, subTopic.id, question.id); }}
                                                  className={`p-2 rounded-lg transition-colors ${question.isBookmarked ? 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-white/5'}`}
                                                  title="Bookmark"
                                                >
                                                  <Bookmark size={18} fill={question.isBookmarked ? "currentColor" : "none"} />
                                                </button>

                                                {/* Separator */}
                                                <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1"></div>

                                                {/* Delete */}
                                                <button 
                                                  onClick={() => requestDeleteQuestion(topic.id, subTopic.id, question)} 
                                                  className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors opacity-0 group-hover/q:opacity-100"
                                                  title="Delete"
                                                >
                                                  <Trash2 size={18} />
                                                </button>
                                              </div>
                                            </div>

                                            {/* Expanded Content: Description & Notes */}
                                            {(expandedDescId === question.id || expandedNoteId === question.id) && (
                                              <div className="px-16 pb-6 pt-2 animate-in fade-in slide-in-from-top-1 duration-200 bg-slate-50 dark:bg-black/20 inner-shadow-lg">
                                                {expandedDescId === question.id && (
                                                    <div className="mb-4 bg-white dark:bg-slate-900/50 rounded-xl p-5 border border-purple-200 dark:border-purple-500/20 relative overflow-hidden shadow-sm">
                                                      <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
                                                      <h4 className="text-xs font-bold text-purple-500 dark:text-purple-400 uppercase tracking-wider mb-2 flex items-center gap-2"><Info size={14} /> Problem Description</h4>
                                                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-light">{question.description || "No description provided."}</p>
                                                      <button onClick={() => setExpandedDescId(null)} className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white"><Zap size={12} /></button>
                                                    </div>
                                                )}
                                                
                                                {expandedNoteId === question.id && (
                                                    <div className="bg-white dark:bg-slate-900/50 rounded-xl p-1 border border-blue-200 dark:border-blue-500/20 shadow-sm">
                                                      <div className="px-4 py-2 flex items-center gap-2 border-b border-slate-100 dark:border-white/5">
                                                          <StickyNote size={14} className="text-blue-500 dark:text-blue-400" />
                                                          <span className="text-xs font-bold text-blue-500 dark:text-blue-400 uppercase tracking-wider">Your Notes</span>
                                                      </div>
                                                      <textarea
                                                          value={question.note || ''}
                                                          onChange={(e) => store.updateNote(topic.id, subTopic.id, question.id, e.target.value)}
                                                          className="w-full bg-transparent text-sm text-slate-700 dark:text-slate-200 p-4 focus:outline-none min-h-[100px] resize-y placeholder:text-slate-400 dark:placeholder:text-slate-600 font-mono"
                                                          placeholder="Write your intuition, time complexity analysis, or reminders here..."
                                                          autoFocus
                                                      />
                                                      <div className="flex justify-end px-2 py-2">
                                                          <button onClick={() => setExpandedNoteId(null)} className="px-3 py-1 bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold rounded hover:bg-blue-500 hover:text-white transition-colors">Save Note</button>
                                                      </div>
                                                    </div>
                                                )}
                                              </div>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          )}
                        </div>
                        )}
                      />
                    );
                  })}
                </SortableContext>
              </DndContext>
            </div>
          )}
        </div>

        {/* Floating Action Button */}
        <div className="absolute bottom-10 right-24 z-30">
           {store.activeView !== 'performance' && (
              <button 
                onClick={openAddTopic}
                className="group relative flex items-center gap-3 pl-5 pr-6 py-4 bg-primary text-white rounded-full shadow-[0_10px_30px_-10px_rgba(99,102,241,0.6)] hover:shadow-[0_20px_40px_-10px_rgba(99,102,241,0.8)] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 flex items-center gap-3">
                   <div className="bg-white/20 p-1 rounded-full group-hover:rotate-90 transition-transform duration-500"><Plus size={20} strokeWidth={3} /></div>
                   <span className="font-bold tracking-wide text-sm">NEW TOPIC</span>
                </div>
              </button>
           )}
        </div>
        
        <ChatBot />

        <AddModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onConfirm={handleConfirmAdd}
          title={modalConfig.title}
          type={modalConfig.type}
        />
        
        <ConfirmationModal 
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          title={`Delete ${deleteConfig?.type === 'topic' ? 'Topic' : 'Question'}`}
          message={`Are you sure you want to delete "${deleteConfig?.title}"? This action cannot be undone.`}
        />
      </main>
    </div>
  );
}

export default App;