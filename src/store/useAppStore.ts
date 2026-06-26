import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { calculateScores, type DomainScores } from '@/utils/scoring';

export interface TestRecord {
  id: string;
  createdAt: number;
  answers: Record<number, number>;
  scores: DomainScores;
  aiNarrative?: string; // 保存 AI 解读结果
}

export interface AppSettings {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  /** Worker 代理 URL（推荐）。设置后 API Key 存储在 Worker 上，不暴露给客户端 */
  proxyUrl: string;
  /** 本地开发备用：直连 DeepSeek，仅内存保留，不持久化 */
  deepseekApiKey: string;
  corsProxy: string;
}

interface AppState {
  currentAnswers: Record<number, number>;
  history: TestRecord[];
  settings: AppSettings;

  setAnswer: (questionId: number, value: number) => void;
  clearCurrentAnswers: () => void;
  submitTest: () => TestRecord | null;
  deleteRecord: (id: string) => void;
  clearHistory: () => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  saveNarrative: (id: string, narrative: string) => void;
  importData: (data: { history?: TestRecord[]; settings?: Partial<AppSettings> }) => void;
}

const STORAGE_KEY = 'self-explore-storage';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentAnswers: {},
      history: [],
      settings: {
        darkMode: false,
        fontSize: 'medium',
        proxyUrl: '',
        deepseekApiKey: '',
        corsProxy: '',
      },

      setAnswer: (questionId, value) =>
        set((state) => ({
          currentAnswers: { ...state.currentAnswers, [questionId]: value },
        })),

      clearCurrentAnswers: () => set({ currentAnswers: {} }),

      submitTest: () => {
        const answers = get().currentAnswers;
        const scores = calculateScores(answers);
        const record: TestRecord = {
          id: generateId(),
          createdAt: Date.now(),
          answers,
          scores,
        };
        set((state) => ({
          history: [record, ...state.history],
          currentAnswers: {},
        }));
        return record;
      },

      deleteRecord: (id) =>
        set((state) => ({
          history: state.history.filter((r) => r.id !== id),
        })),

      clearHistory: () => set({ history: [] }),

      importData: (data: { history?: TestRecord[]; settings?: Partial<AppSettings> }) => {
        set((state) => {
          const mergedHistory = data.history
            ? [
                ...data.history.filter(
                  (r) => !state.history.some((existing) => existing.id === r.id)
                ),
                ...state.history,
              ]
            : state.history;
          return {
            history: mergedHistory,
            settings: data.settings
              ? { ...state.settings, ...data.settings }
              : state.settings,
          };
        });
      },

      updateSettings: (settings) =>
        set((state) => ({
          settings: { ...state.settings, ...settings },
        })),

      saveNarrative: (id, narrative) =>
        set((state) => ({
          history: state.history.map((r) =>
            r.id === id ? { ...r, aiNarrative: narrative } : r
          ),
        })),
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({
        history: state.history,
        settings: {
          ...state.settings,
          deepseekApiKey: '', // ⚠️ API Key 不持久化到 localStorage
        },
      }),
    }
  )
);
