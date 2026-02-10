import React, { useMemo, useState, useEffect, useRef } from 'react';
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
  ChevronLeft,
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
  Sun,
  Menu,
  LogOut,
  Pencil
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
  DragEndEvent,
  DragOverEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import confetti from 'canvas-confetti';

// --- Helper Components ---

const DifficultyBadge = ({ level }: { level: Difficulty }) => {
  const styles = {
    Easy: 'text-emerald-600 bg-emerald-100 border-emerald-200 dark:text-easy dark:bg-easy/5 dark:border-easy/20 shadow-none dark:shadow-[0_0_10px_-2px_rgba(52,211,153,0.3)]',
    Medium: 'text-amber-600 bg-amber-100 border-amber-200 dark:text-medium dark:bg-medium/5 dark:border-medium/20 shadow-none dark:shadow-[0_0_10px_-2px_rgba(251,191,36,0.3)]',
    Hard: 'text-rose-600 bg-rose-100 border-rose-200 dark:text-hard dark:bg-hard/5 dark:border-hard/20 shadow-none dark:shadow-[0_0_10px_-2px_rgba(251,113,133,0.3)]'
  };

  return (
    <span className={`px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-widest border transition-all duration-300 ${styles[level]}`}>
      {level}
    </span>
  );
};

const StatusButton = ({ status, onClick }: { status: Status, onClick: () => void }) => {
  if (status === 'Solved') {
    return (
      <button onClick={onClick} className="group relative overflow-hidden flex items-center gap-1.5 md:gap-2 px-2 py-1 md:px-3 md:py-1.5 rounded-lg bg-emerald-100 text-emerald-600 border-emerald-200 dark:bg-easy/10 dark:text-easy text-[10px] md:text-xs font-bold border dark:border-easy/20 hover:bg-emerald-200 dark:hover:bg-easy/20 transition-all shadow-sm">
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
        <CheckCircle2 size={14} className="fill-current md:w-4 md:h-4" />
        Solved
      </button>
    );
  }
  if (status === 'Revision') {
    return (
      <button onClick={onClick} className="flex items-center gap-1.5 md:gap-2 px-2 py-1 md:px-3 md:py-1.5 rounded-lg bg-amber-100 text-amber-600 border-amber-200 dark:bg-medium/10 dark:text-medium text-[10px] md:text-xs font-bold border dark:border-medium/20 hover:bg-amber-200 dark:hover:bg-medium/20 transition-all">
        <Clock size={14} className="md:w-4 md:h-4" />
        Revision
      </button>
    );
  }
  return (
    <button onClick={onClick} className="flex items-center gap-1.5 md:gap-2 px-2 py-1 md:px-3 md:py-1.5 rounded-lg bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800/50 dark:text-slate-400 text-[10px] md:text-xs font-bold border dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-all">
      <Circle size={14} className="md:w-4 md:h-4" />
      To Do
    </button>
  );
};

const Checkbox = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
  <button
    onClick={(e) => { e.stopPropagation(); onChange(); }}
    className={`w-5 h-5 md:w-6 md:h-6 rounded-lg border-2 flex-shrink-0 flex items-center justify-center transition-all duration-300 ${
      checked
        ? 'bg-emerald-500 border-emerald-500 text-white dark:bg-easy dark:border-easy dark:text-black shadow-md scale-110'
        : 'bg-transparent border-slate-300 dark:border-slate-600 hover:border-primary/50 hover:bg-primary/5'
    }`}
  >
    {checked && <Check size={12} strokeWidth={4} className="md:w-[14px] md:h-[14px]" />}
  </button>
);

const ProgressBar = ({ total, solved }: { total: number, solved: number }) => {
  const percentage = total === 0 ? 0 : Math.round((solved / total) * 100);
  return (
    <div className="flex flex-col items-end min-w-[120px] md:min-w-[160px] group cursor-default">
      <div className="flex justify-between w-full mb-1.5 md:mb-2 text-[9px] md:text-[10px] font-bold uppercase tracking-wider">
        <span className="text-slate-500 group-hover:text-primary transition-colors">Progress</span>
        <span className="text-slate-900 dark:text-white text-glow">{percentage}%</span>
      </div>
      <div className="w-full bg-slate-200 dark:bg-slate-800/50 rounded-full h-1.5 md:h-2 overflow-hidden border border-slate-200 dark:border-slate-700/50 relative">
        <div 
          className="bg-gradient-to-r from-primary via-secondary to-accent h-full rounded-full transition-all duration-1000 ease-out shadow-lg dark:shadow-[0_0_15px_rgba(99,102,241,0.5)] relative overflow-hidden" 
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.3)_50%,transparent_100%)] w-full h-full animate-[shimmer_2s_infinite]"></div>
        </div>
      </div>
      <span className="text-[9px] md:text-[10px] font-bold text-slate-500 mt-1 md:mt-2 flex gap-1">
        <span className="text-slate-900 dark:text-white">{solved}</span> <span className="text-slate-400 dark:text-slate-600">/</span> {total} Solved
      </span>
    </div>
  );
};

// --- View Components ---

const PerformanceView = ({ stats }: { stats: any }) => {
  return (
    <div className="p-4 md:p-10 space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="glass-card p-6 rounded-3xl bg-gradient-to-br from-primary/10 to-transparent border-primary/20 relative group overflow-hidden">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/10 dark:bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-all"></div>
          <div className="flex items-center gap-4 mb-4 relative z-10">
            <div className="p-3 rounded-2xl bg-primary/20 text-primary shadow-inner shadow-primary/10">
              <Trophy size={24} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Total Solved</p>
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">{stats.solvedQuestions} <span className="text-sm text-slate-400 dark:text-slate-500 font-medium">/ {stats.totalQuestions}</span></h3>
            </div>
          </div>
          <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mt-2">
            <div className="h-full bg-primary shadow-sm dark:shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all duration-1000 ease-out" style={{ width: `${(stats.solvedQuestions / stats.totalQuestions) * 100}%` }}></div>
          </div>
        </div>
        {/* ... (Other Stats Cards Remain Same) ... */}
        <div className="glass-card p-6 rounded-3xl bg-gradient-to-br from-easy/10 to-transparent border-easy/20 relative group overflow-hidden">
           <div className="absolute -right-10 -top-10 w-32 h-32 bg-easy/10 dark:bg-easy/20 rounded-full blur-3xl group-hover:bg-easy/20 dark:group-hover:bg-easy/30 transition-all"></div>
          <div className="flex items-center gap-4 mb-4 relative z-10">
            <div className="p-3 rounded-2xl bg-easy/20 text-emerald-600 dark:text-easy shadow-inner shadow-easy/10">
              <Target size={24} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Easy</p>
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">{stats.easy}</h3>
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
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">{stats.medium}</h3>
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
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">{stats.hard}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Sortable Item Components ---

interface SortableItemProps {
  id: string;
  data: any;
  children: (listeners: any, attributes: any) => React.ReactNode;
  key?: React.Key;
}

const SortableItem = ({ id, data, children }: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id, data });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    zIndex: isDragging ? 50 : 'auto',
    position: 'relative' as const,
  };

  return (
    <div ref={setNodeRef} style={style} className="touch-none">
      {children(listeners, attributes)}
    </div>
  );
};

// --- Main App Component ---

function App() {
  const store = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null);
  const [expandedDescId, setExpandedDescId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  const [modalConfig, setModalConfig] = useState<{
    type: 'topic' | 'subTopic' | 'question';
    title: string;
    topicId?: string;
    subTopicId?: string;
    questionId?: string;
    initialData?: any;
    mode: 'create' | 'edit';
  }>({ type: 'topic', title: '', mode: 'create' });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfig, setDeleteConfig] = useState<{
    type: 'topic' | 'subTopic' | 'question';
    title: string;
    topicId: string;
    subTopicId?: string;
    questionId?: string;
  } | null>(null);

  // Stats calculation
  const stats = useMemo(() => {
    let totalQuestions = 0;
    let solvedQuestions = 0;
    let easy = 0;
    let medium = 0;
    let hard = 0;

    store.topics.forEach(topic => {
      topic.subTopics.forEach(sub => {
        sub.questions.forEach(q => {
          totalQuestions++;
          if (q.status === 'Solved') {
            solvedQuestions++;
            if (q.difficulty === 'Easy') easy++;
            if (q.difficulty === 'Medium') medium++;
            if (q.difficulty === 'Hard') hard++;
          }
        });
      });
    });

    return { totalQuestions, solvedQuestions, easy, medium, hard };
  }, [store.topics]);

  // Confetti Logic
  const [completedTopics, setCompletedTopics] = useState<Set<string>>(new Set());
  const isFirstRender = useRef(true);

  useEffect(() => {
    // ... (Confetti logic remains same)
    const newCompleted = new Set<string>();
    store.topics.forEach(topic => {
      let total = 0;
      let solved = 0;
      topic.subTopics.forEach(st => {
        total += st.questions.length;
        solved += st.questions.filter(q => q.status === 'Solved').length;
      });
      if (total > 0 && total === solved) {
        newCompleted.add(topic.id);
      }
    });

    if (isFirstRender.current) {
      setCompletedTopics(newCompleted);
      isFirstRender.current = false;
      return;
    }

    const hasNewCompletion = Array.from(newCompleted).some(id => !completedTopics.has(id));
    if (hasNewCompletion) {
      confetti({ particleCount: 150, spread: 60 });
    }
    setCompletedTopics(newCompleted);
  }, [store.topics]);

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
    
    if (!over) return;
    if (active.id === over.id) return;

    const activeType = active.data.current?.type;
    const overType = over.data.current?.type;

    // Reorder Topics
    if (activeType === 'topic' && overType === 'topic') {
      const oldIndex = store.topics.findIndex((t) => t.id === active.id);
      const newIndex = store.topics.findIndex((t) => t.id === over.id);
      store.reorderTopics(oldIndex, newIndex);
    } 
    // Reorder SubTopics
    else if (activeType === 'subTopic' && overType === 'subTopic') {
       const topicId = active.data.current?.topicId;
       const targetTopicId = over.data.current?.topicId;
       
       if (topicId === targetTopicId && topicId) {
         const topic = store.topics.find(t => t.id === topicId);
         if (topic) {
           const oldIndex = topic.subTopics.findIndex(st => st.id === active.id);
           const newIndex = topic.subTopics.findIndex(st => st.id === over.id);
           store.reorderSubTopics(topicId, oldIndex, newIndex);
         }
       }
    }
    // Reorder Questions
    else if (activeType === 'question' && overType === 'question') {
      const subTopicId = active.data.current?.subTopicId;
      const targetSubTopicId = over.data.current?.subTopicId;
      const topicId = active.data.current?.topicId;

      if (subTopicId === targetSubTopicId && subTopicId && topicId) {
        const topic = store.topics.find(t => t.id === topicId);
        const subTopic = topic?.subTopics.find(st => st.id === subTopicId);
        if (subTopic) {
          const oldIndex = subTopic.questions.findIndex(q => q.id === active.id);
          const newIndex = subTopic.questions.findIndex(q => q.id === over.id);
          store.reorderQuestions(topicId, subTopicId, oldIndex, newIndex);
        }
      }
    }
  };

  // Modals Handlers
  const openAddTopic = () => {
    setModalConfig({ type: 'topic', title: 'Create New Topic', mode: 'create' });
    setIsModalOpen(true);
  };

  const openAddSubTopic = (topicId: string) => {
    setModalConfig({ type: 'subTopic', title: 'Add Sub-Topic', topicId, mode: 'create' });
    setIsModalOpen(true);
  };

  const openAddQuestion = (topicId: string, subTopicId: string) => {
    setModalConfig({ type: 'question', title: 'Add New Question', topicId, subTopicId, mode: 'create' });
    setIsModalOpen(true);
  };

  // Edit Handlers
  const openEditTopic = (e: React.MouseEvent, topic: any) => {
    e.stopPropagation();
    setModalConfig({ 
      type: 'topic', 
      title: 'Edit Topic', 
      topicId: topic.id, 
      initialData: { title: topic.title }, 
      mode: 'edit' 
    });
    setIsModalOpen(true);
  };

  const openEditSubTopic = (topicId: string, subTopic: any) => {
    setModalConfig({ 
      type: 'subTopic', 
      title: 'Edit Sub-Topic', 
      topicId, 
      subTopicId: subTopic.id, 
      initialData: { title: subTopic.title }, 
      mode: 'edit' 
    });
    setIsModalOpen(true);
  };

  const openEditQuestion = (e: React.MouseEvent, topicId: string, subTopicId: string, question: any) => {
    e.stopPropagation();
    setModalConfig({ 
      type: 'question', 
      title: 'Edit Question', 
      topicId, 
      subTopicId, 
      questionId: question.id, 
      initialData: question, 
      mode: 'edit' 
    });
    setIsModalOpen(true);
  };

  const handleModalSubmit = (data: any) => {
    if (modalConfig.mode === 'create') {
      if (modalConfig.type === 'topic') {
        store.addTopic(data.title);
      } else if (modalConfig.type === 'subTopic' && modalConfig.topicId) {
        store.addSubTopic(modalConfig.topicId, data.title);
      } else if (modalConfig.type === 'question' && modalConfig.topicId && modalConfig.subTopicId) {
        store.addQuestion(modalConfig.topicId, modalConfig.subTopicId, data);
      }
    } else {
      // Edit Mode
       if (modalConfig.type === 'topic' && modalConfig.topicId) {
        store.updateTopic(modalConfig.topicId, data.title);
      } else if (modalConfig.type === 'subTopic' && modalConfig.topicId && modalConfig.subTopicId) {
        store.updateSubTopic(modalConfig.topicId, modalConfig.subTopicId, data.title);
      } else if (modalConfig.type === 'question' && modalConfig.topicId && modalConfig.subTopicId && modalConfig.questionId) {
        store.updateQuestion(modalConfig.topicId, modalConfig.subTopicId, modalConfig.questionId, data);
      }
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

  const requestDeleteSubTopic = (topicId: string, subTopic: any) => {
    setDeleteConfig({
      type: 'subTopic',
      title: subTopic.title,
      topicId: topicId,
      subTopicId: subTopic.id
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
    } else if (deleteConfig.type === 'subTopic' && deleteConfig.subTopicId) {
      store.deleteSubTopic(deleteConfig.topicId, deleteConfig.subTopicId);
    } else if (deleteConfig.type === 'question' && deleteConfig.subTopicId && deleteConfig.questionId) {
      store.deleteQuestion(deleteConfig.topicId, deleteConfig.subTopicId, deleteConfig.questionId);
    }
    setIsDeleteModalOpen(false);
    setDeleteConfig(null);
  };

  // Navigation Helper (No changes needed)
  const NavItem = ({ id, label, icon: Icon, colorClass }: { id: ViewType, label: string, icon: any, colorClass: string }) => (
    <button 
      onClick={() => {
        store.setActiveView(id);
        setIsSidebarOpen(false);
      }}
      title={isSidebarCollapsed ? label : undefined}
      className={`relative w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-2' : 'gap-3 px-4'} py-3.5 rounded-xl transition-all duration-300 group overflow-hidden ${
        store.activeView === id 
        ? 'bg-gradient-to-r from-primary/10 to-transparent dark:from-white/10 dark:to-transparent text-slate-900 dark:text-white shadow-sm dark:shadow-lg border-l-4 border-primary' 
        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
      }`}
    >
      <div className={`absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-0 transition-opacity duration-300 ${store.activeView === id ? 'opacity-100' : 'group-hover:opacity-30'}`}></div>
      <Icon size={20} className={`relative z-10 transition-colors flex-shrink-0 ${store.activeView === id ? colorClass : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-white'}`} />
      {!isSidebarCollapsed && (
        <span className="relative z-10 text-sm font-semibold tracking-wide whitespace-nowrap overflow-hidden transition-all duration-300 opacity-100">{label}</span>
      )}
    </button>
  );

  return (
    <div className="flex h-screen w-full font-sans bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 transition-colors duration-300 relative">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Responsive Drawer */}
      <aside className={`
        fixed md:relative inset-y-0 left-0 z-40
        ${isSidebarCollapsed ? 'md:w-20' : 'md:w-80'} w-80
        glass-panel border-r border-slate-200 dark:border-slate-800/50 
        flex flex-col flex-shrink-0 shadow-xl dark:shadow-[4px_0_24px_-2px_rgba(0,0,0,0.3)]
        transform transition-all duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Toggle Button */}
        <button 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="hidden md:flex absolute -right-3 top-10 w-6 h-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full items-center justify-center text-slate-500 hover:text-primary transition-colors shadow-sm z-50 hover:scale-110"
        >
          {isSidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        <div className={`p-8 ${isSidebarCollapsed ? 'px-4 flex justify-center' : ''} transition-all duration-300`}>
          <div className="flex items-center gap-3 mb-1">
            <div className="relative w-10 h-10 flex-shrink-0">
              <div className="absolute inset-0 bg-primary/40 rounded-xl blur-lg animate-pulse-slow"></div>
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white border border-white/10 shadow-xl">
                <Code2 size={24} />
              </div>
            </div>
            {!isSidebarCollapsed && (
              <div className="min-w-0 overflow-hidden transition-all duration-300 opacity-100">
                <h1 className="text-xl font-display font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1 whitespace-nowrap">
                  Code<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Master</span>
                </h1>
                <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">v2.1.0 • Pro</p>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-6 overflow-y-auto custom-scrollbar py-2 overflow-x-hidden">
          <div>
            {!isSidebarCollapsed && (
              <p className="px-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2 transition-opacity duration-300">
                <Layers size={10} /> Problem Sets
              </p>
            )}
            <div className="space-y-1">
              <NavItem id="striver" label="Striver SDE Sheet" icon={Bolt} colorClass="text-primary" />
              <NavItem id="neetcode" label="NeetCode 150" icon={Zap} colorClass="text-secondary" />
              <NavItem id="babbar" label="Love Babbar 450" icon={FolderOpen} colorClass="text-accent" />
            </div>
          </div>

          <div>
             {!isSidebarCollapsed && (
                <p className="px-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2 transition-opacity duration-300">
                  <BarChart2 size={10} /> Analytics
                </p>
             )}
            <div className="space-y-1">
              <NavItem id="performance" label="Performance" icon={Trophy} colorClass="text-medium" />
            </div>
          </div>
        </nav>

        {/* Footer actions */}
        <div className="p-6 border-t border-slate-200 dark:border-white/5">
          <button 
            onClick={() => store.setTheme(store.theme === 'dark' ? 'light' : 'dark')}
            title={isSidebarCollapsed ? "Toggle Theme" : undefined}
            className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between px-4'} py-3 mb-4 rounded-xl bg-slate-100 dark:bg-white/5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors`}
          >
            {isSidebarCollapsed ? (
               store.theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />
            ) : (
              <>
                <span className="flex items-center gap-3">
                  {store.theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                  {store.theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </span>
                <div className={`w-10 h-5 rounded-full p-1 transition-colors ${store.theme === 'dark' ? 'bg-primary' : 'bg-slate-300'}`}>
                  <div className={`w-3 h-3 rounded-full bg-white transition-transform ${store.theme === 'dark' ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </div>
              </>
            )}
          </button>
          
           <div className={`glass-card p-3 rounded-2xl flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-4'} hover:border-primary/30 transition-colors group cursor-pointer bg-white/50 dark:bg-transparent`}>
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 border border-slate-200 dark:border-white/10 overflow-hidden">
                 <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-full h-full" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 dark:bg-easy border-2 border-white dark:border-surface rounded-full shadow-sm"></div>
            </div>
            {!isSidebarCollapsed && (
              <>
                <div className="flex-1 min-w-0 overflow-hidden">
                  <p className="text-sm font-bold truncate text-slate-800 dark:text-white group-hover:text-primary transition-colors">Alex Johnson</p>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Pro Member</p>
                </div>
                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                  <Settings size={18} />
                </button>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative w-full min-w-0">
        {/* Header (Same as before) */}
        <header className="h-auto md:h-24 glass-panel border-b-0 border-r-0 border-l-0 border-slate-200 dark:border-slate-800/50 flex flex-col md:flex-row md:items-center justify-between px-4 py-4 md:px-10 flex-shrink-0 z-10 gap-4">
           {/* ... Header Content ... */}
           <div className="flex items-center justify-between w-full md:w-auto">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden p-2 -ml-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg"
              >
                <Menu size={24} />
              </button>

              <h2 className="text-xl md:text-3xl font-display font-bold tracking-tight text-slate-900 dark:text-white drop-shadow-sm truncate">
                {store.activeView === 'striver' && 'Striver SDE Sheet'}
                {store.activeView === 'neetcode' && 'NeetCode 150'}
                {store.activeView === 'babbar' && 'Love Babbar 450'}
                {store.activeView === 'performance' && 'Performance Analytics'}
              </h2>
            </div>
          </div>

          {store.activeView !== 'performance' && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-8 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
               {/* Filters and Search - same as original */}
               <div className="flex items-center gap-3 bg-white/50 dark:bg-black/20 p-1.5 rounded-2xl border border-slate-200 dark:border-white/5 flex-shrink-0">
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

                 <div className="relative group hidden sm:block">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Search size={16} className="text-slate-400 dark:text-slate-500 group-focus-within:text-primary transition-colors" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    value={store.searchQuery}
                    onChange={(e) => store.setSearchQuery(e.target.value)}
                    className="block w-32 lg:w-48 pl-10 pr-4 py-2 rounded-xl bg-transparent text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:bg-slate-100 dark:focus:bg-white/5 transition-all text-sm font-medium"
                  />
                </div>
              </div>
              
              <div className="hidden sm:block">
                <ProgressBar total={stats.totalQuestions} solved={stats.solvedQuestions} />
              </div>
            </div>
          )}
        </header>

        {/* Dynamic Content View */}
        <div className="flex-1 overflow-y-auto custom-scrollbar scroll-smooth">
          {store.activeView === 'performance' ? (
            <PerformanceView stats={stats} />
          ) : (
            <div className="p-4 md:p-10 max-w-7xl mx-auto space-y-6 pb-32">
              
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
                    // Filter Logic
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
                      <SortableItem 
                        key={topic.id} 
                        id={topic.id}
                        data={{ type: 'topic' }}
                        children={(dragListeners, dragAttributes) => (
                          <div className="glass-card rounded-2xl group/topic border-l-4 border-l-transparent hover:border-l-primary transition-all duration-300">
                          {/* Topic Header */}
                          <div 
                            className="p-4 md:p-5 flex items-center justify-between cursor-pointer select-none"
                            onClick={() => store.toggleTopic(topic.id)}
                          >
                            <div className="flex items-center gap-3 md:gap-6 flex-1 mr-2 md:mr-6 overflow-hidden">
                              {/* Drag Handle */}
                              <div 
                                className="hidden md:flex flex-col gap-1 opacity-0 group-hover/topic:opacity-100 transition-opacity" 
                                onClick={e => e.stopPropagation()}
                                {...dragListeners}
                                {...dragAttributes}
                              >
                                <div className="cursor-grab active:cursor-grabbing text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-white p-1 rounded hover:bg-slate-100 dark:hover:bg-white/10">
                                  <GripVertical size={18} />
                                </div>
                              </div>
                              
                              <div className="flex-1 flex items-center gap-3 md:gap-4 overflow-hidden">
                                <div className={`p-2 md:p-3 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 transition-all duration-300 ${topic.isExpanded ? 'bg-primary/10 dark:bg-primary/20 text-primary border-primary/30 rotate-90' : 'text-slate-400'}`}>
                                  <ChevronRight size={16} className="md:w-5 md:h-5" />
                                </div>
                                <div className="flex-1 overflow-hidden">
                                  <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3 mb-1 md:mb-2">
                                      <h3 className="text-base md:text-xl font-bold tracking-tight text-slate-900 dark:text-white group-hover/topic:text-primary transition-colors truncate">{topic.title}</h3>
                                      {/* Edit Topic Button */}
                                      <button 
                                        onClick={(e) => openEditTopic(e, topic)} 
                                        className="opacity-0 group-hover/topic:opacity-100 p-1 text-slate-400 hover:text-primary transition-opacity"
                                      >
                                        <Pencil size={12} />
                                      </button>
                                      <span className="self-start px-2 py-0.5 rounded text-[9px] md:text-[10px] font-bold bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/5 whitespace-nowrap">{topicTotal} Questions</span>
                                  </div>
                                  
                                  {/* Mini Progress Bar */}
                                  <div className="flex items-center gap-3 max-w-md">
                                      <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div 
                                          className={`h-full rounded-full transition-all duration-700 ease-out ${topicProgress === 100 ? 'bg-emerald-500 dark:bg-easy shadow-sm dark:shadow-[0_0_10px_rgba(52,211,153,0.5)]' : 'bg-gradient-to-r from-primary to-secondary'}`} 
                                          style={{ width: `${topicProgress}%` }}
                                        />
                                      </div>
                                      <span className={`text-[10px] font-bold ${topicProgress === 100 ? 'text-emerald-600 dark:text-easy' : 'text-slate-500'}`}>{topicProgress}%</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 md:gap-3 md:opacity-0 group-hover/topic:opacity-100 transition-all md:transform md:translate-x-4 group-hover/topic:translate-x-0" onClick={e => e.stopPropagation()}>
                              <button onClick={() => requestDeleteTopic(topic)} className="p-2 text-slate-400 hover:text-rose-500 dark:hover:text-hard hover:bg-rose-50 dark:hover:bg-hard/10 rounded-lg transition-colors hidden md:block"><Trash2 size={18} /></button>
                              <button onClick={() => openAddSubTopic(topic.id)} className="bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary hover:text-primary-700 dark:hover:text-white px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-[10px] md:text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-primary/10">
                                <Plus size={14} className="md:w-4 md:h-4" /> <span className="hidden sm:inline">Sub-topic</span> <span className="sm:hidden">Add</span>
                              </button>
                            </div>
                          </div>

                          {/* Topic Body */}
                          {topic.isExpanded && (
                            <div className="border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/20 animate-in slide-in-from-top-2 duration-300">
                              {filteredSubTopics.length === 0 ? (
                                <div className="p-8 md:p-12 flex flex-col items-center justify-center text-slate-500 gap-3">
                                    <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800/50 flex items-center justify-center text-slate-400 dark:text-slate-600"><Search size={24} /></div>
                                    <p className="text-sm font-medium">No matching questions found.</p>
                                </div>
                              ) : (
                                <SortableContext items={filteredSubTopics.map(st => st.id)} strategy={verticalListSortingStrategy}>
                                {filteredSubTopics.map(subTopic => {
                                  const originalSubTopic = topic.subTopics.find(t => t.id === subTopic.id) || subTopic;
                                  const subTopicTotal = originalSubTopic.questions.length;
                                  const subTopicSolved = originalSubTopic.questions.filter(q => q.status === 'Solved').length;
                                  const subTopicProgress = subTopicTotal === 0 ? 0 : Math.round((subTopicSolved / subTopicTotal) * 100);

                                  return (
                                    <SortableItem
                                      key={subTopic.id}
                                      id={subTopic.id}
                                      data={{ type: 'subTopic', topicId: topic.id }}
                                      children={(subDragListeners, subDragAttributes) => (
                                      <div className="border-b border-slate-100 dark:border-white/5 last:border-0">
                                        {/* SubTopic Header */}
                                        <div className="px-4 py-3 md:px-5 md:py-3 bg-slate-100/50 dark:bg-white/[0.02] border-b border-slate-200 dark:border-white/5 flex items-center justify-between group/sub">
                                          <div className="flex items-center gap-2 md:gap-4 pl-4 md:pl-6">
                                            {/* SubTopic Drag Handle */}
                                            <div 
                                                className="cursor-grab active:cursor-grabbing text-slate-300 dark:text-slate-600 hover:text-slate-600 dark:hover:text-white opacity-0 group-hover/sub:opacity-100 transition-opacity"
                                                {...subDragListeners}
                                                {...subDragAttributes}
                                            >
                                                <GripVertical size={14} />
                                            </div>

                                            <div className="flex items-center gap-2 text-slate-400">
                                              <CornerDownRight size={14} className="opacity-50" />
                                              <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-300 group-hover/sub:text-slate-900 dark:group-hover/sub:text-white transition-colors">{subTopic.title}</span>
                                              
                                              <div className="flex items-center gap-1 opacity-0 group-hover/sub:opacity-100 transition-opacity">
                                                  {/* Edit SubTopic */}
                                                  <button onClick={() => openEditSubTopic(topic.id, subTopic)} className="p-1 hover:text-primary"><Pencil size={10} /></button>
                                                  {/* Delete SubTopic */}
                                                  <button onClick={() => requestDeleteSubTopic(topic.id, subTopic)} className="p-1 hover:text-red-500"><Trash2 size={10} /></button>
                                              </div>
                                            </div>
                                            
                                            {subTopicTotal > 0 && (
                                              <div className="hidden sm:flex items-center gap-3 opacity-0 group-hover/sub:opacity-100 transition-all duration-300">
                                                <div className="w-16 h-1 bg-slate-300 dark:bg-slate-700/50 rounded-full overflow-hidden">
                                                    <div className={`h-full rounded-full transition-all duration-500 ease-out ${subTopicProgress === 100 ? 'bg-emerald-500 dark:bg-easy' : 'bg-slate-400'}`} style={{ width: `${subTopicProgress}%` }} />
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">{subTopicSolved}/{subTopicTotal}</span>
                                              </div>
                                            )}
                                          </div>
                                          <button onClick={() => openAddQuestion(topic.id, subTopic.id)} className="text-[10px] font-bold text-primary hover:text-white hover:bg-primary transition-all flex items-center gap-1 bg-primary/10 px-2 py-1 md:px-3 md:py-1.5 rounded-lg border border-primary/20">
                                            <Plus size={12} /> <span className="hidden sm:inline">Add Question</span><span className="sm:hidden">Add</span>
                                          </button>
                                        </div>

                                        {/* Questions List */}
                                        <div className="flex flex-col">
                                          <SortableContext items={subTopic.questions.map(q => q.id)} strategy={verticalListSortingStrategy}>
                                          {subTopic.questions.map(question => (
                                            <SortableItem
                                              key={question.id}
                                              id={question.id}
                                              data={{ type: 'question', topicId: topic.id, subTopicId: subTopic.id }}
                                              children={(qDragListeners, qDragAttributes) => (
                                              <div className="group/q relative border-b border-slate-100 dark:border-white/5 last:border-0 hover:bg-white dark:hover:bg-white/[0.03] transition-colors">
                                                {/* Highlight Bar */}
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary opacity-0 group-hover/q:opacity-100 transition-opacity"></div>
                                                
                                                {/* Question Layout - Responsive Grid/Flex */}
                                                <div className="flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-4 px-4 py-3 md:px-6 md:py-4 md:items-center">
                                                  
                                                  {/* Mobile Row 1: Checkbox + Title + External Link */}
                                                  <div className="flex items-start md:items-center gap-3 md:gap-4 md:col-span-5 md:pl-2">
                                                    
                                                    {/* Question Drag Handle */}
                                                    <div 
                                                        className="mt-1 md:mt-0 cursor-grab active:cursor-grabbing text-slate-300 dark:text-slate-600 hover:text-slate-600 dark:hover:text-white opacity-0 group-hover/q:opacity-100 transition-opacity"
                                                        {...qDragListeners}
                                                        {...qDragAttributes}
                                                    >
                                                        <GripVertical size={16} />
                                                    </div>

                                                    <Checkbox 
                                                      checked={question.status === 'Solved'} 
                                                      onChange={() => store.markQuestionComplete(topic.id, subTopic.id, question.id, question.status !== 'Solved')}
                                                    />
                                                    <div className="flex items-center gap-2 min-w-0 flex-1">
                                                      <a 
                                                        href={question.url} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className={`text-sm font-semibold truncate transition-colors flex items-center gap-2 ${question.status === 'Solved' ? 'text-slate-400 line-through decoration-slate-400 dark:decoration-slate-600' : 'text-slate-700 dark:text-slate-200 group-hover/q:text-primary'}`}
                                                      >
                                                        {question.title}
                                                      </a>
                                                      {/* Edit Question Trigger */}
                                                      <button 
                                                        onClick={(e) => openEditQuestion(e, topic.id, subTopic.id, question)}
                                                        className="opacity-0 group-hover/q:opacity-100 p-1 text-slate-400 hover:text-primary"
                                                      >
                                                        <Pencil size={12} />
                                                      </button>

                                                      <a href={question.url} target="_blank" rel="noopener noreferrer" className="md:opacity-0 md:group-hover/q:opacity-100 p-1 hover:bg-slate-100 dark:hover:bg-white/10 rounded-md text-slate-400 hover:text-slate-900 dark:hover:text-white transition-opacity"><ExternalLink size={14} /></a>
                                                    </div>
                                                  </div>
                                                  
                                                  {/* Mobile Row 2: Status + Difficulty (and Actions on right for mobile) */}
                                                  <div className="flex items-center justify-between md:contents">
                                                    <div className="flex items-center gap-3 md:contents">
                                                        <div className="md:col-span-2">
                                                            <StatusButton 
                                                            status={question.status} 
                                                            onClick={() => store.toggleStatus(topic.id, subTopic.id, question.id)} 
                                                            />
                                                        </div>
                                                        
                                                        <div className="md:col-span-2">
                                                            <DifficultyBadge level={question.difficulty} />
                                                        </div>
                                                    </div>

                                                    {/* Actions - Bottom right on mobile, Col 3 on Desktop */}
                                                    <div className="flex items-center justify-end gap-1 md:gap-2 md:col-span-3">
                                                        {/* Note */}
                                                        <button 
                                                        onClick={(e) => { e.stopPropagation(); setExpandedNoteId(expandedNoteId === question.id ? null : question.id); }}
                                                        className={`p-1.5 md:p-2 rounded-lg transition-colors ${question.note ? 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'text-slate-400 hover:text-blue-500 hover:bg-slate-100 dark:hover:bg-white/5'}`}
                                                        title="Notes"
                                                        >
                                                        <StickyNote size={16} className="md:w-[18px] md:h-[18px]" fill={question.note ? "currentColor" : "none"} />
                                                        </button>

                                                        {/* Description */}
                                                        <button 
                                                        onClick={(e) => { e.stopPropagation(); setExpandedDescId(expandedDescId === question.id ? null : question.id); }}
                                                        className={`p-1.5 md:p-2 rounded-lg transition-colors ${expandedDescId === question.id || question.description ? 'text-purple-500 bg-purple-50 dark:bg-purple-900/20' : 'text-slate-400 hover:text-purple-500 hover:bg-slate-100 dark:hover:bg-white/5'}`}
                                                        title="Problem Description"
                                                        >
                                                        <Info size={16} className="md:w-[18px] md:h-[18px]" fill={question.description ? "currentColor" : "none"} />
                                                        </button>

                                                        {/* Bookmark */}
                                                        <button 
                                                        onClick={(e) => { e.stopPropagation(); store.toggleBookmark(topic.id, subTopic.id, question.id); }}
                                                        className={`p-1.5 md:p-2 rounded-lg transition-colors ${question.isBookmarked ? 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-white/5'}`}
                                                        title="Bookmark"
                                                        >
                                                        <Bookmark size={16} className="md:w-[18px] md:h-[18px]" fill={question.isBookmarked ? "currentColor" : "none"} />
                                                        </button>

                                                        {/* Separator */}
                                                        <div className="hidden md:block w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1"></div>

                                                        {/* Delete */}
                                                        <button 
                                                        onClick={() => requestDeleteQuestion(topic.id, subTopic.id, question)} 
                                                        className="p-1.5 md:p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors md:opacity-0 md:group-hover/q:opacity-100"
                                                        title="Delete"
                                                        >
                                                        <Trash2 size={16} className="md:w-[18px] md:h-[18px]" />
                                                        </button>
                                                    </div>
                                                  </div>
                                                </div>

                                                {/* Expanded Content: Description & Notes */}
                                                {(expandedDescId === question.id || expandedNoteId === question.id) && (
                                                  <div className="px-6 md:px-16 pb-6 pt-2 animate-in fade-in slide-in-from-top-1 duration-200 bg-slate-50 dark:bg-black/20 inner-shadow-lg">
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
                                              )}
                                            />
                                          ))}
                                          </SortableContext>
                                        </div>
                                      </div>
                                      )}
                                    />
                                  );
                                })}
                                </SortableContext>
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
        <div className="absolute bottom-6 right-6 md:bottom-10 md:right-24 z-30">
           {store.activeView !== 'performance' && (
              <button 
                onClick={openAddTopic}
                className="group relative flex items-center gap-2 md:gap-3 pl-4 pr-5 py-3 md:pl-5 md:pr-6 md:py-4 bg-primary text-white rounded-full shadow-[0_10px_30px_-10px_rgba(99,102,241,0.6)] hover:shadow-[0_20px_40px_-10px_rgba(99,102,241,0.8)] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 flex items-center gap-2 md:gap-3">
                   <div className="bg-white/20 p-1 rounded-full group-hover:rotate-90 transition-transform duration-500"><Plus size={18} strokeWidth={3} className="md:w-5 md:h-5" /></div>
                   <span className="font-bold tracking-wide text-xs md:text-sm">NEW TOPIC</span>
                </div>
              </button>
           )}
        </div>
        
        <ChatBot />

        <AddModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onConfirm={handleModalSubmit}
          title={modalConfig.title}
          type={modalConfig.type}
          initialData={modalConfig.initialData}
          mode={modalConfig.mode}
        />
        
        <ConfirmationModal 
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          title={`Delete ${deleteConfig?.type === 'topic' ? 'Topic' : deleteConfig?.type === 'subTopic' ? 'Sub-Topic' : 'Question'}`}
          message={`Are you sure you want to delete "${deleteConfig?.title}"? This action cannot be undone.`}
        />
      </main>
    </div>
  );
}

export default App;