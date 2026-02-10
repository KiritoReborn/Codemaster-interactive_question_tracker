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
  deleteQuestion: (topicId: string, subTopicId: string, questionId: string) => void;
  addQuestion: (topicId: string, subTopicId: string, question: Omit<Question, 'id'>) => void;
  addTopic: (title: string) => void;
  deleteTopic: (topicId: string) => void;
  moveTopicUp: (index: number) => void;
  moveTopicDown: (index: number) => void;
  addSubTopic: (topicId: string, title: string) => void;
  reorderTopics: (oldIndex: number, newIndex: number) => void;
}

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

      addTopic: (title) => set((state) => ({
        topics: [...state.topics, {
          id: uuidv4(),
          title,
          isExpanded: true,
          subTopics: []
        }]
      })),

      deleteTopic: (topicId) => set((state) => ({
        topics: state.topics.filter(t => t.id !== topicId)
      })),

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

      moveTopicUp: (index) => set((state) => {
        if (index === 0) return state;
        const newTopics = [...state.topics];
        [newTopics[index - 1], newTopics[index]] = [newTopics[index], newTopics[index - 1]];
        return { topics: newTopics };
      }),

      moveTopicDown: (index) => set((state) => {
        if (index === state.topics.length - 1) return state;
        const newTopics = [...state.topics];
        [newTopics[index + 1], newTopics[index]] = [newTopics[index], newTopics[index + 1]];
        return { topics: newTopics };
      }),

      reorderTopics: (oldIndex, newIndex) => set((state) => {
        const newTopics = [...state.topics];
        const [removed] = newTopics.splice(oldIndex, 1);
        newTopics.splice(newIndex, 0, removed);
        return { topics: newTopics };
      })
    }),
    {
      name: 'codemaster-storage',
    }
  )
);