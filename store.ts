import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Topic, Question, Difficulty, Status } from './types';
import { initialData } from './data';
import { v4 as uuidv4 } from 'uuid';

export type ViewType = 'striver' | 'neetcode' | 'babbar' | 'performance';
export type Theme = 'light' | 'dark';

interface AppState {
  theme: Theme;
  topics: Topic[];
  searchQuery: string;
  activeView: ViewType;
  showBookmarkedOnly: boolean;
  difficultyFilter: 'All' | Difficulty;
  setTheme: (theme: Theme) => void;
  setDifficultyFilter: (filter: 'All' | Difficulty) => void;
  setShowBookmarkedOnly: (show: boolean) => void;
  setActiveView: (view: ViewType) => void;
  setSearchQuery: (query: string) => void;
  toggleTopic: (topicId: string) => void;
  toggleStatus: (topicId: string, subTopicId: string, questionId: string) => void;
  toggleBookmark: (topicId: string, subTopicId: string, questionId: string) => void;
  updateNote: (topicId: string, subTopicId: string, questionId: string, note: string) => void;
  markQuestionComplete: (topicId: string, subTopicId: string, questionId: string, isComplete: boolean) => void;
  
  // CRUD & Reorder
  addTopic: (title: string) => void;
  updateTopic: (topicId: string, title: string) => void;
  deleteTopic: (topicId: string) => void;
  reorderTopics: (oldIndex: number, newIndex: number) => void;

  addSubTopic: (topicId: string, title: string) => void;
  updateSubTopic: (topicId: string, subTopicId: string, title: string) => void;
  deleteSubTopic: (topicId: string, subTopicId: string) => void;
  reorderSubTopics: (topicId: string, oldIndex: number, newIndex: number) => void;

  addQuestion: (topicId: string, subTopicId: string, question: Omit<Question, 'id'>) => void;
  updateQuestion: (topicId: string, subTopicId: string, questionId: string, data: Partial<Question>) => void;
  deleteQuestion: (topicId: string, subTopicId: string, questionId: string) => void;
  reorderQuestions: (topicId: string, subTopicId: string, oldIndex: number, newIndex: number) => void;
}

// Helper to reorder array
const reorder = <T>(list: T[], startIndex: number, endIndex: number): T[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'dark',
      topics: initialData,
      searchQuery: '',
      activeView: 'striver',
      showBookmarkedOnly: false,
      difficultyFilter: 'All',
      setTheme: (theme) => set({ theme }),
      setDifficultyFilter: (filter) => set({ difficultyFilter: filter }),
      setShowBookmarkedOnly: (show) => set({ showBookmarkedOnly: show }),
      setActiveView: (view) => set({ activeView: view }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      
      toggleTopic: (topicId) => set((state) => ({
        topics: state.topics.map(t => 
          t.id === topicId ? { ...t, isExpanded: !t.isExpanded } : t
        )
      })),

      toggleStatus: (topicId, subTopicId, questionId) => set((state) => ({
        topics: state.topics.map(t => {
          if (t.id !== topicId) return t;
          return {
            ...t,
            subTopics: t.subTopics.map(st => {
              if (st.id !== subTopicId) return st;
              return {
                ...st,
                questions: st.questions.map(q => {
                  if (q.id !== questionId) return q;
                  const nextStatus: Record<Status, Status> = {
                    'Todo': 'Solved',
                    'Solved': 'Revision',
                    'Revision': 'Todo'
                  };
                  return { ...q, status: nextStatus[q.status] };
                })
              };
            })
          };
        })
      })),

      toggleBookmark: (topicId, subTopicId, questionId) => set((state) => ({
        topics: state.topics.map(t => {
          if (t.id !== topicId) return t;
          return {
            ...t,
            subTopics: t.subTopics.map(st => {
              if (st.id !== subTopicId) return st;
              return {
                ...st,
                questions: st.questions.map(q => {
                  if (q.id !== questionId) return q;
                  return { ...q, isBookmarked: !q.isBookmarked };
                })
              };
            })
          };
        })
      })),

      updateNote: (topicId, subTopicId, questionId, note) => set((state) => ({
        topics: state.topics.map(t => {
          if (t.id !== topicId) return t;
          return {
            ...t,
            subTopics: t.subTopics.map(st => {
              if (st.id !== subTopicId) return st;
              return {
                ...st,
                questions: st.questions.map(q => {
                  if (q.id !== questionId) return q;
                  return { ...q, note };
                })
              };
            })
          };
        })
      })),

      markQuestionComplete: (topicId, subTopicId, questionId, isComplete) => set((state) => ({
        topics: state.topics.map(t => {
          if (t.id !== topicId) return t;
          return {
            ...t,
            subTopics: t.subTopics.map(st => {
              if (st.id !== subTopicId) return st;
              return {
                ...st,
                questions: st.questions.map(q => {
                  if (q.id !== questionId) return q;
                  return { ...q, status: isComplete ? 'Solved' : 'Todo' };
                })
              };
            })
          };
        })
      })),

      // --- Topic CRUD ---

      addTopic: (title) => set((state) => ({
        topics: [...state.topics, {
          id: uuidv4(),
          title,
          isExpanded: true,
          subTopics: []
        }]
      })),

      updateTopic: (topicId, title) => set((state) => ({
        topics: state.topics.map(t => t.id === topicId ? { ...t, title } : t)
      })),

      deleteTopic: (topicId) => set((state) => ({
        topics: state.topics.filter(t => t.id !== topicId)
      })),

      reorderTopics: (oldIndex, newIndex) => set((state) => ({
        topics: reorder(state.topics, oldIndex, newIndex)
      })),

      // --- SubTopic CRUD ---

      addSubTopic: (topicId, title) => set((state) => ({
        topics: state.topics.map(t => {
          if (t.id !== topicId) return t;
          return {
            ...t,
            subTopics: [...t.subTopics, {
              id: uuidv4(),
              title,
              questions: []
            }]
          };
        })
      })),

      updateSubTopic: (topicId, subTopicId, title) => set((state) => ({
        topics: state.topics.map(t => {
          if (t.id !== topicId) return t;
          return {
            ...t,
            subTopics: t.subTopics.map(st => st.id === subTopicId ? { ...st, title } : st)
          };
        })
      })),

      deleteSubTopic: (topicId, subTopicId) => set((state) => ({
        topics: state.topics.map(t => {
          if (t.id !== topicId) return t;
          return {
            ...t,
            subTopics: t.subTopics.filter(st => st.id !== subTopicId)
          };
        })
      })),

      reorderSubTopics: (topicId, oldIndex, newIndex) => set((state) => ({
        topics: state.topics.map(t => {
          if (t.id !== topicId) return t;
          return {
            ...t,
            subTopics: reorder(t.subTopics, oldIndex, newIndex)
          };
        })
      })),

      // --- Question CRUD ---

      addQuestion: (topicId, subTopicId, questionData) => set((state) => ({
        topics: state.topics.map(t => {
          if (t.id !== topicId) return t;
          return {
            ...t,
            subTopics: t.subTopics.map(st => {
              if (st.id !== subTopicId) return st;
              return {
                ...st,
                questions: [...st.questions, { ...questionData, id: uuidv4() }]
              };
            })
          };
        })
      })),

      updateQuestion: (topicId, subTopicId, questionId, data) => set((state) => ({
        topics: state.topics.map(t => {
          if (t.id !== topicId) return t;
          return {
            ...t,
            subTopics: t.subTopics.map(st => {
              if (st.id !== subTopicId) return st;
              return {
                ...st,
                questions: st.questions.map(q => q.id === questionId ? { ...q, ...data } : q)
              };
            })
          };
        })
      })),

      deleteQuestion: (topicId, subTopicId, questionId) => set((state) => ({
        topics: state.topics.map(t => {
          if (t.id !== topicId) return t;
          return {
            ...t,
            subTopics: t.subTopics.map(st => {
              if (st.id !== subTopicId) return st;
              return {
                ...st,
                questions: st.questions.filter(q => q.id !== questionId)
              };
            })
          };
        })
      })),

      reorderQuestions: (topicId, subTopicId, oldIndex, newIndex) => set((state) => ({
        topics: state.topics.map(t => {
          if (t.id !== topicId) return t;
          return {
            ...t,
            subTopics: t.subTopics.map(st => {
              if (st.id !== subTopicId) return st;
              return {
                ...st,
                questions: reorder(st.questions, oldIndex, newIndex)
              };
            })
          };
        })
      }))
    }),
    {
      name: 'codemaster-storage',
    }
  )
);