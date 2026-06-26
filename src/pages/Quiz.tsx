import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, List, X, RotateCcw } from 'lucide-react';
import {
  ALL_QUESTIONS,
  QUESTIONS,
  SECTION_BOUNDARIES,
  getOptionsForCategory,
  getOptionsForSleepFacet,
} from '@/data/questions';
import { useAppStore } from '@/store/useAppStore';
import { isComplete, getAnsweredCount } from '@/utils/scoring';

export function Quiz() {
  const navigate = useNavigate();
  const { currentAnswers, setAnswer, clearCurrentAnswers, submitTest } = useAppStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [showNav, setShowNav] = useState(false);

  // Resume from last answered question if returning (runs only on mount)
  useEffect(() => {
    const state = useAppStore.getState();
    const answered = getAnsweredCount(state.currentAnswers);
    if (answered > 0 && answered < QUESTIONS.length) {
      const firstUnanswered = ALL_QUESTIONS.findIndex((q) => state.currentAnswers[q.id] === undefined);
      if (firstUnanswered !== -1) {
        setCurrentIndex(firstUnanswered);
      }
    }
  }, []);

  const question = ALL_QUESTIONS[currentIndex];
  const selected = currentAnswers[question.id];
  const progress = ((currentIndex + 1) / ALL_QUESTIONS.length) * 100;

  // Determine current section label
  const currentSectionLabel = useMemo(() => {
    let label = '';
    for (const boundary of SECTION_BOUNDARIES) {
      if (currentIndex >= boundary.startIndex) {
        label = boundary.label;
      }
    }
    return label;
  }, [currentIndex]);

  // Check if this question starts a new section (show header)
  const isSectionStart = useMemo(() => {
    return SECTION_BOUNDARIES.some((b) => b.startIndex === currentIndex);
  }, [currentIndex]);

  // Get correct options for current question
  const options = useMemo(() => {
    if (question.category === 'sleep') {
      return getOptionsForSleepFacet(question.facet);
    }
    return getOptionsForCategory(question.category);
  }, [question.category, question.facet]);

  const finishTest = useCallback(() => {
    if (!isComplete(currentAnswers)) {
      setShowWarning(true);
      return;
    }
    const record = submitTest();
    if (record) {
      navigate(`/result/${record.id}`);
    }
  }, [currentAnswers, submitTest, navigate]);

  const handleNext = useCallback(() => {
    if (selected === undefined) {
      setShowWarning(true);
      return;
    }
    if (currentIndex < ALL_QUESTIONS.length - 1) {
      setDirection(1);
      setCurrentIndex((i) => i + 1);
    } else {
      finishTest();
    }
  }, [selected, currentIndex, finishTest]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((i) => i - 1);
    }
  }, [currentIndex]);

  const handleSelect = useCallback((value: number) => {
    setAnswer(question.id, value);
    setShowWarning(false);
    if (currentIndex < ALL_QUESTIONS.length - 1) {
      setTimeout(() => {
        setDirection(1);
        setCurrentIndex((i) => i + 1);
      }, 250);
    }
  }, [question.id, currentIndex, setAnswer]);

  const handleRestart = useCallback(() => {
    if (window.confirm('确定要重新开始吗？当前进度将丢失。')) {
      clearCurrentAnswers();
      setCurrentIndex(0);
      setDirection(0);
      setShowWarning(false);
    }
  }, [clearCurrentAnswers]);

  const jumpToQuestion = useCallback((idx: number) => {
    setDirection(idx > currentIndex ? 1 : -1);
    setCurrentIndex(idx);
    setShowNav(false);
  }, [currentIndex]);

  // Stable refs for callbacks to avoid re-registering the keyboard listener
  const handleNextRef = useRef(handleNext);
  handleNextRef.current = handleNext;
  const handlePrevRef = useRef(handlePrev);
  handlePrevRef.current = handlePrev;
  const setAnswerRef = useRef(setAnswer);
  setAnswerRef.current = setAnswer;
  const currentIndexRef = useRef(currentIndex);
  currentIndexRef.current = currentIndex;

  // Keyboard shortcuts (only re-attach when showNav toggles)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showNav) {
        if (e.key === 'Escape') {
          setShowNav(false);
        }
        return;
      }
      // For options with values 1-5 (likert), map number keys
      if (e.key >= '1' && e.key <= '5') {
        const q = ALL_QUESTIONS[currentIndexRef.current];
        const opts = q.category === 'sleep'
          ? getOptionsForSleepFacet(q.facet)
          : getOptionsForCategory(q.category);
        const maxVal = opts.length; // 4 or 5
        const num = parseInt(e.key, 10);
        if (num <= maxVal) {
          setAnswerRef.current(q.id, opts[num - 1].value);
          setShowWarning(false);
          if (currentIndexRef.current < ALL_QUESTIONS.length - 1) {
            setTimeout(() => {
              setDirection(1);
              setCurrentIndex((i) => i + 1);
            }, 200);
          }
        }
      } else if (e.key === 'Enter' || e.key === 'ArrowRight') {
        handleNextRef.current();
      } else if (e.key === 'ArrowLeft') {
        handlePrevRef.current();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showNav]);

  return (
    <main className="animate-fade-in-up px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-2xl">
        {/* Progress Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between font-display text-sm font-bold uppercase tracking-wide">
            <div className="flex items-center gap-2">
              <span>第 {currentIndex + 1} / {ALL_QUESTIONS.length}</span>
              <span className="text-xs font-normal text-[var(--text-secondary)]">
                {currentSectionLabel}
              </span>
            </div>
            <span className="text-[var(--text-secondary)]">
              {Math.round(progress)}%
            </span>
          </div>

          {/* Simple progress bar */}
          <div className="mt-3 flex h-3 w-full border-2 border-[var(--border-color)] bg-[var(--bg-card)] overflow-hidden sm:h-4">
            <div
              className="h-full bg-[var(--accent-blue)] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
            <div
              className="h-full bg-[var(--bg-card)] transition-all duration-300"
              style={{ width: `${100 - progress}%` }}
            />
          </div>

          <div className="mt-2 flex items-center justify-between">
            <p className="text-xs text-[var(--text-secondary)]">
              {currentSectionLabel}
            </p>
            <button
              onClick={() => setShowNav(true)}
              className="flex items-center gap-1 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <List size={14} />
              题目列表
            </button>
          </div>
        </div>

        {/* Section Header */}
        {isSectionStart && (
          <div className="mb-4 border-l-[3px] border-[var(--accent-blue)] pl-4 animate-fade-in-up">
            <p className="font-display text-sm font-bold uppercase tracking-[0.2em] text-[var(--accent-blue)]">
              {currentSectionLabel}
            </p>
          </div>
        )}

        {/* Question Card */}
        <div
          className={`bauhaus-card p-6 sm:p-10 lg:p-12 ${
            direction > 0 ? 'animate-slide-in-right' : direction < 0 ? 'animate-slide-in-left' : ''
          }`}
          onAnimationEnd={() => setDirection(0)}
        >
          <h2 className="font-display text-xl font-bold leading-snug sm:text-2xl lg:text-3xl">
            {question.text}
          </h2>

          <div className="mt-8 grid gap-2 sm:gap-3 sm:mt-10">
            {options.map((option) => {
              const active = selected === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={`flex items-center justify-between border-2 p-3 text-left transition-all sm:p-4 ${
                    active
                      ? 'border-[var(--border-color)] bg-[var(--bg-alt)] text-[var(--text-inverse)]'
                      : 'border-[var(--border-color)] bg-[var(--bg-card)] hover:-translate-x-1 hover:-translate-y-1'
                  }`}
                >
                  <span className="font-medium text-sm sm:text-base">{option.label}</span>
                  <span
                    className={`font-display text-sm font-bold ${
                      active ? 'text-[var(--text-inverse)]' : 'text-[var(--text-secondary)]'
                    }`}
                  >
                    {option.value}
                  </span>
                </button>
              );
            })}
          </div>

          {showWarning && (
            <p className="mt-4 text-sm font-medium text-[var(--accent-red)] animate-fade-in-up">
              请先选择一个选项。
            </p>
          )}

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between border-t-2 border-[var(--border-color)] pt-5 sm:mt-10 sm:pt-6">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="bauhaus-btn-secondary flex items-center gap-2 px-4 py-2.5 text-sm disabled:opacity-40 sm:px-5 sm:py-3"
            >
              <ChevronLeft size={16} className="sm:size-[18px]" />
              上一题
            </button>

            <button
              onClick={handleRestart}
              className="flex items-center gap-1 text-xs font-medium text-[var(--text-secondary)] underline underline-offset-4 hover:text-[var(--text-primary)] sm:text-sm"
            >
              <RotateCcw size={14} />
              重新开始
            </button>

            {currentIndex < ALL_QUESTIONS.length - 1 ? (
              <button
                onClick={handleNext}
                className="bauhaus-btn flex items-center gap-2 px-4 py-2.5 text-sm sm:px-5 sm:py-3"
              >
                下一题
                <ChevronRight size={16} className="sm:size-[18px]" />
              </button>
            ) : (
              <button
                onClick={finishTest}
                className="bauhaus-btn bauhaus-btn-yellow flex items-center gap-2 px-4 py-2.5 text-sm sm:px-5 sm:py-3"
              >
                查看结果
                <ChevronRight size={16} className="sm:size-[18px]" />
              </button>
            )}
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-[var(--text-secondary)] sm:mt-6">
          提示：可使用键盘数字键选择答案，Enter 进入下一题
        </p>
      </div>

      {/* Question Navigation Drawer */}
      {showNav && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowNav(false)}
          />
          <div className="relative w-full max-w-sm bg-[var(--bg-card)] border-l-[3px] border-[var(--border-color)] shadow-[var(--shadow)] animate-slide-in-right overflow-y-auto">
            <div className="sticky top-0 bg-[var(--bg-card)] border-b-2 border-[var(--border-color)] p-4 flex items-center justify-between">
              <h3 className="font-display text-sm font-bold uppercase tracking-wide">
                题目导航
              </h3>
              <button
                onClick={() => setShowNav(false)}
                className="p-1 hover:bg-[var(--bg-primary)] transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-4 grid gap-2">
              {ALL_QUESTIONS.map((q, idx) => {
                const answered = currentAnswers[q.id] !== undefined;
                const isCurrent = idx === currentIndex;
                return (
                  <button
                    key={q.id}
                    onClick={() => jumpToQuestion(idx)}
                    className={`flex items-center gap-3 border-2 p-3 text-left transition-all ${
                      isCurrent
                        ? 'border-[var(--accent-blue)] bg-[var(--accent-blue)]/10'
                        : answered
                        ? 'border-[var(--border-color)] bg-[var(--bg-primary)] hover:-translate-x-1'
                        : 'border-[var(--border-color)] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center font-display text-xs font-bold ${
                        isCurrent ? 'bg-[var(--accent-blue)] text-white' : answered ? 'bg-[var(--bg-alt)] text-[var(--text-inverse)]' : 'bg-[var(--bg-primary)] border border-[var(--border-color)]'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className={`truncate text-xs sm:text-sm ${isCurrent ? 'font-medium' : ''}`}>
                        {q.text}
                      </p>
                    </div>
                    {answered && (
                      <span className="shrink-0 text-xs font-bold text-[var(--accent-blue)]">
                        {currentAnswers[q.id]}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="sticky bottom-0 bg-[var(--bg-card)] border-t-2 border-[var(--border-color)] p-4">
              <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                <span>已作答: {Object.keys(currentAnswers).length}/{ALL_QUESTIONS.length}</span>
                <span>{Math.round((Object.keys(currentAnswers).length / ALL_QUESTIONS.length) * 100)}%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
