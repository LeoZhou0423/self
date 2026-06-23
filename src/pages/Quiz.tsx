import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { OPTIONS, QUESTIONS, LIE_SCALE_QUESTIONS, DOMAINS, type Domain } from '@/data/questions';
import { useAppStore } from '@/store/useAppStore';
import { isComplete } from '@/utils/scoring';

const DOMAIN_COLORS: Record<Domain, string> = {
  O: '#8E6EAB',
  C: '#4A7C59',
  E: '#D4A017',
  A: '#5B8A72',
  N: '#A65D57',
};

// Combine main questions with lie scale questions
const ALL_QUESTIONS = [
  ...QUESTIONS,
  ...LIE_SCALE_QUESTIONS.map((q) => ({
    id: q.id,
    text: q.text,
    domain: 'L' as Domain,
    facet: 'social_desirability',
    reverse: q.reverse,
  })),
];

export function Quiz() {
  const navigate = useNavigate();
  const { currentAnswers, setAnswer, clearCurrentAnswers, submitTest } = useAppStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [showWarning, setShowWarning] = useState(false);

  const question = ALL_QUESTIONS[currentIndex];
  const selected = currentAnswers[question.id];
  const progress = ((currentIndex + 1) / ALL_QUESTIONS.length) * 100;

  // Domain progress tracking
  const domainProgress = useMemo(() => {
    const domains: Domain[] = ['O', 'C', 'E', 'A', 'N'];
    return domains.map((domain) => {
      const domainQuestions = ALL_QUESTIONS.filter((q) => q.domain === domain);
      const answered = domainQuestions.filter((q) => currentAnswers[q.id] !== undefined).length;
      return {
        domain,
        total: domainQuestions.length,
        answered,
        percentage: domainQuestions.length > 0 ? (answered / domainQuestions.length) * 100 : 0,
        color: DOMAIN_COLORS[domain],
      };
    });
  }, [currentAnswers]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '1' && e.key <= '5') {
        setAnswer(question.id, parseInt(e.key, 10));
        setShowWarning(false);
        if (currentIndex < ALL_QUESTIONS.length - 1) {
          setTimeout(() => {
            setDirection(1);
            setCurrentIndex((i) => i + 1);
          }, 200);
        }
      } else if (e.key === 'Enter') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [question.id, currentIndex, currentAnswers]);

  const handleSelect = (value: number) => {
    setAnswer(question.id, value);
    setShowWarning(false);
    if (currentIndex < ALL_QUESTIONS.length - 1) {
      setTimeout(() => {
        setDirection(1);
        setCurrentIndex((i) => i + 1);
      }, 250);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((i) => i - 1);
    }
  };

  const handleNext = () => {
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
  };

  const finishTest = () => {
    if (!isComplete(currentAnswers)) {
      setShowWarning(true);
      return;
    }
    const record = submitTest();
    if (record) {
      navigate(`/result/${record.id}`);
    }
  };

  const handleRestart = () => {
    clearCurrentAnswers();
    setCurrentIndex(0);
    setDirection(0);
  };

  return (
    <main className="animate-fade-in-up px-6 py-10">
      <div className="mx-auto max-w-2xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between font-display text-sm font-bold uppercase tracking-wide">
            <div className="flex items-center gap-2">
              <span>第 {currentIndex + 1} / {ALL_QUESTIONS.length} 题</span>
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-bold border-2 border-[var(--border-color)]"
                style={{ backgroundColor: DOMAIN_COLORS[question.domain] + '20', color: DOMAIN_COLORS[question.domain] }}
              >
                {DOMAINS[question.domain].name}
              </span>
            </div>
            <span className="text-[var(--text-secondary)]">
              {Math.round(progress)}%
            </span>
          </div>

          {/* Domain-colored progress bar */}
          <div className="mt-3 flex h-4 w-full border-2 border-[var(--border-color)] bg-[var(--bg-card)] overflow-hidden">
            {domainProgress.map((dp) => (
              <div
                key={dp.domain}
                className="h-full transition-all duration-300 relative group"
                style={{
                  width: `${dp.percentage / 5}%`,
                  backgroundColor: dp.color,
                }}
              >
                {/* Tooltip on hover */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium bg-[var(--bg-alt)] text-[var(--text-inverse)] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {DOMAINS[dp.domain].name}: {dp.answered}/{dp.total}
                </div>
              </div>
            ))}
            {/* Remaining space */}
            <div
              className="h-full bg-[var(--bg-card)] transition-all duration-300"
              style={{ width: `${100 - progress}%` }}
            />
          </div>

          {/* Domain legend */}
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-[var(--text-secondary)]">
            {domainProgress.map((dp) => (
              <span key={dp.domain} className="flex items-center gap-1">
                <span
                  className="inline-block w-2 h-2 rounded-full"
                  style={{ backgroundColor: dp.color }}
                />
                {DOMAINS[dp.domain].name}
              </span>
            ))}
          </div>
        </div>

        {/* Question Card */}
        <div
          className={`bauhaus-card p-8 sm:p-12 ${
            direction > 0 ? 'animate-slide-in-right' : direction < 0 ? 'animate-slide-in-left' : ''
          }`}
          onAnimationEnd={() => setDirection(0)}
        >
          <p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)]">
            BFI-2 量表
          </p>
          <h2 className="mt-6 font-display text-2xl font-bold leading-snug sm:text-3xl">
            {question.text}
          </h2>

          <div className="mt-10 grid gap-3">
            {OPTIONS.map((option) => {
              const active = selected === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={`flex items-center justify-between border-2 p-4 text-left transition-all ${
                    active
                      ? 'border-[var(--border-color)] bg-[var(--bg-alt)] text-[var(--text-inverse)]'
                      : 'border-[var(--border-color)] bg-[var(--bg-card)] hover:-translate-x-1 hover:-translate-y-1'
                  }`}
                >
                  <span className="font-medium">{option.label}</span>
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
              请先选择一个选项，或使用键盘数字键 1-5 作答。
            </p>
          )}

          {/* Navigation */}
          <div className="mt-10 flex items-center justify-between border-t-2 border-[var(--border-color)] pt-6">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="bauhaus-btn-secondary flex items-center gap-2 px-5 py-3 disabled:opacity-40"
            >
              <ChevronLeft size={18} />
              上一题
            </button>

            <button
              onClick={handleRestart}
              className="text-sm font-medium text-[var(--text-secondary)] underline underline-offset-4 hover:text-[var(--text-primary)]"
            >
              重新开始
            </button>

            {currentIndex < ALL_QUESTIONS.length - 1 ? (
              <button
                onClick={handleNext}
                className="bauhaus-btn flex items-center gap-2 px-5 py-3"
              >
                下一题
                <ChevronRight size={18} />
              </button>
            ) : (
              <button
                onClick={finishTest}
                className="bauhaus-btn bauhaus-btn-yellow flex items-center gap-2 px-5 py-3"
              >
                查看结果
                <ChevronRight size={18} />
              </button>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-[var(--text-secondary)]">
          提示：可使用键盘 1-5 选择答案，Enter 进入下一题
        </p>
      </div>
    </main>
  );
}
