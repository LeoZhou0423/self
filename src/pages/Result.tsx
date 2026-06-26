import { useRef, useState, useCallback } from 'react';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { Download, Share2, RotateCcw, FileText, History } from 'lucide-react';
import { RadarChart } from '@/components/RadarChart';
import { DomainCard } from '@/components/DomainCard';
import { FacetAccordion } from '@/components/FacetAccordion';
import { ArchetypeCard } from '@/components/ArchetypeCard';
import { AINarrative } from '@/components/AINarrative';
import { FeedbackButton } from '@/components/FeedbackButton';
import { useAppStore } from '@/store/useAppStore';
import { type Domain } from '@/data/questions';
import { matchArchetype } from '@/data/archetypes';
import { detectTensions } from '@/utils/tension';
import {
  exportElementToImage,
  exportElementToPDF,
  shareElementImage,
} from '@/utils/export';
import {
  interpretDepression,
  interpretAnxiety,
  interpretSleep,
} from '@/data/descriptions';

const DOMAIN_ORDER: Domain[] = ['O', 'C', 'E', 'A', 'N'];

export function Result() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { history, clearCurrentAnswers } = useAppStore();
  const reportRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState<'image' | 'pdf' | 'share' | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);

  const record = id
    ? history.find((r) => r.id === id)
    : history[0];

  const handleExport = useCallback(async (type: 'image' | 'pdf' | 'share') => {
    if (!reportRef.current) return;
    setExporting(type);
    setExportError(null);
    try {
      const filename = `profile-${record!.id.slice(0, 8)}`;
      if (type === 'image') {
        await exportElementToImage(reportRef.current, filename);
      } else if (type === 'pdf') {
        await exportElementToPDF(reportRef.current, filename);
      } else if (type === 'share') {
        await shareElementImage(reportRef.current, filename);
      }
    } catch {
      setExportError(type === 'share' ? '分享失败，请尝试保存图片' : '导出失败，请重试');
    } finally {
      setExporting(null);
    }
  }, [record]);

  if (!record) return <Navigate to="/" replace />;

  const scores = record.scores;
  const scoresMap: Record<Domain, number> = {
    O: scores.openness,
    C: scores.conscientiousness,
    E: scores.extraversion,
    A: scores.agreeableness,
    N: scores.neuroticism,
  };

  const archetype = matchArchetype(scoresMap);
  const tensions = detectTensions(scoresMap);

  const dateStr = new Date(record.createdAt).toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleRetake = () => {
    clearCurrentAnswers();
    navigate('/quiz');
  };

  const handleScrollToFacets = () => {
    document.getElementById('facet-details')?.scrollIntoView({ behavior: 'smooth' });
  };

  const exportLabel = exporting === 'image' ? '正在生成图片…' : exporting === 'pdf' ? '正在生成 PDF…' : exporting === 'share' ? '正在准备分享…' : null;

  // ── 状态提醒 ──
  const stateAlerts: { title: string; text: string; level: 'info' | 'notice' | 'warning' }[] = [];

  // 抑郁
  if (scores.depressionScore > 4) {
    stateAlerts.push({
      title: '情绪状态',
      text: interpretDepression(scores.depressionScore),
      level: scores.depressionScore > 14 ? 'warning' : scores.depressionScore > 9 ? 'notice' : 'info',
    });
  }
  // 焦虑
  if (scores.anxietyScore > 4) {
    stateAlerts.push({
      title: '焦虑感受',
      text: interpretAnxiety(scores.anxietyScore),
      level: scores.anxietyScore > 14 ? 'warning' : scores.anxietyScore > 9 ? 'notice' : 'info',
    });
  }
  // 睡眠
  if (scores.sleepQuality < 60) {
    stateAlerts.push({
      title: '睡眠与精力',
      text: interpretSleep(scores.sleepQuality),
      level: scores.sleepQuality < 40 ? 'notice' : 'info',
    });
  }

  return (
    <main className="animate-fade-in-up px-3 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-4xl">
        {/* Report Card for Export */}
        <div ref={reportRef} className="bg-[var(--bg-primary)] p-3 sm:p-6 lg:p-10">
          <div className="bauhaus-card p-5 sm:p-8 lg:p-12">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl lg:text-5xl">
                  你的画像
                </h1>
                <p className="mt-1 text-xs text-[var(--text-secondary)] sm:text-sm sm:mt-2">
                  {dateStr}
                </p>
              </div>
            </div>

            {/* Archetype */}
            <div className="mt-6 sm:mt-10">
              <ArchetypeCard archetype={archetype} />
            </div>

            {/* AI Narrative */}
            <div className="mt-5 sm:mt-6">
              <AINarrative scores={scores} recordId={record.id} savedNarrative={record.aiNarrative} />
            </div>

            {/* Feedback Button */}
            <div className="mt-5 sm:mt-6">
              <FeedbackButton onScrollToFacets={handleScrollToFacets} />
            </div>

            {/* Radar + Domain Scores */}
            <div className="mt-6 grid items-center gap-6 sm:mt-10 sm:gap-8 lg:grid-cols-2 lg:gap-10">
              <div className="flex justify-center">
                <RadarChart scores={scoresMap} size={280} className="sm:hidden" />
                <RadarChart scores={scoresMap} size={320} className="hidden sm:block lg:hidden" />
                <RadarChart scores={scoresMap} size={360} className="hidden lg:block" />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold uppercase tracking-wide sm:text-xl">
                  各个方面
                </h2>
                <div className="mt-4 grid gap-2 sm:gap-3 sm:grid-cols-2">
                  {DOMAIN_ORDER.map((domain) => (
                    <DomainCard
                      key={domain}
                      domain={domain}
                      score={scoresMap[domain]}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* ── 状态提醒 ── */}
            {stateAlerts.length > 0 && (
              <div className="mt-10 border-t-2 border-[var(--border-color)] pt-8">
                <h2 className="font-display text-xl font-bold uppercase tracking-wide">
                  状态提醒
                </h2>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">
                  根据你的回答，下面这些方面可能值得留意一下
                </p>
                <div className="mt-5 grid gap-4 sm:mt-6">
                  {stateAlerts.map((alert) => (
                    <div
                      key={alert.title}
                      className={`bauhaus-card-sm p-4 sm:p-5 border-l-[3px] ${
                        alert.level === 'warning'
                          ? 'border-l-[var(--accent-red)]'
                          : alert.level === 'notice'
                          ? 'border-l-[var(--accent-yellow)]'
                          : 'border-l-[var(--accent-blue)]'
                      }`}
                    >
                      <h3 className="font-display text-base font-bold uppercase tracking-wide sm:text-lg">
                        {alert.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
                        {alert.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Facet Accordions */}
            <div id="facet-details" className="mt-10 grid gap-5">
              {DOMAIN_ORDER.map((domain) => (
                <FacetAccordion key={domain} domain={domain} scores={scores} />
              ))}
            </div>

            {/* Tension Insights */}
            {tensions.length > 0 && (
              <div className="mt-10 border-t-2 border-[var(--border-color)] pt-8">
                <h2 className="font-display text-xl font-bold uppercase tracking-wide">
                  内在张力
                </h2>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">
                  你的不同特质之间有时会"打架"，了解这些有助于理解自己
                </p>
                <div className="mt-5 grid gap-4 sm:mt-6">
                  {tensions.map((tension) => (
                    <div key={tension.pattern.id} className="bauhaus-card-sm p-4 sm:p-5">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="font-display text-base font-bold uppercase tracking-wide sm:text-lg">
                          {tension.pattern.name}
                        </h3>
                        <span className="shrink-0 border-2 border-[var(--border-color)] px-2 py-1 text-xs font-bold uppercase">
                          {tension.severity === 'strong' ? '明显' : tension.severity === 'moderate' ? '中等' : '轻微'}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
                        {tension.pattern.description}
                      </p>
                      <div className="mt-4 border-l-2 border-[var(--accent-yellow)] pl-4 sm:mt-5 sm:pl-5">
                        <h4 className="font-display text-xs font-bold uppercase text-[var(--accent-yellow)] sm:text-sm">
                          内心感受
                        </h4>
                        <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
                          {tension.pattern.innerExperience}
                        </p>
                      </div>
                      <div className="mt-4 border-l-2 border-[var(--accent-blue)] pl-4 sm:mt-5 sm:pl-5">
                        <h4 className="font-display text-xs font-bold uppercase text-[var(--accent-blue)] sm:text-sm">
                          可以怎么做
                        </h4>
                        <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
                          {tension.pattern.growthStrategy}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Export Error */}
        {exportError && (
          <div className="no-print mt-4 p-3 border-2 border-[var(--accent-red)] bg-red-50 dark:bg-red-950/20 text-sm text-[var(--accent-red)] text-center">
            {exportError}
          </div>
        )}

        {/* Export Status */}
        {exportLabel && (
          <div className="no-print mt-4 p-3 border-2 border-[var(--accent-blue)] bg-blue-50 dark:bg-blue-950/20 text-sm text-[var(--accent-blue)] text-center">
            {exportLabel}
          </div>
        )}

        {/* Action Buttons */}
        <div className="no-print mt-6 grid gap-2 sm:mt-8 sm:gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <button
            onClick={() => handleExport('image')}
            disabled={!!exporting}
            className="bauhaus-btn-secondary flex items-center justify-center gap-2 px-4 py-2.5 text-sm sm:px-5 sm:py-3 sm:text-base disabled:opacity-50"
          >
            <Download size={16} className="sm:hidden" />
            <Download size={18} className="hidden sm:block" />
            保存图片
          </button>
          <button
            onClick={() => handleExport('share')}
            disabled={!!exporting}
            className="bauhaus-btn-secondary flex items-center justify-center gap-2 px-4 py-2.5 text-sm sm:px-5 sm:py-3 sm:text-base disabled:opacity-50"
          >
            <Share2 size={16} className="sm:hidden" />
            <Share2 size={18} className="hidden sm:block" />
            分享
          </button>
          <button
            onClick={() => handleExport('pdf')}
            disabled={!!exporting}
            className="bauhaus-btn-secondary flex items-center justify-center gap-2 px-4 py-2.5 text-sm sm:px-5 sm:py-3 sm:text-base disabled:opacity-50"
          >
            <FileText size={16} className="sm:hidden" />
            <FileText size={18} className="hidden sm:block" />
            导出 PDF
          </button>
          <button
            onClick={handleRetake}
            className="bauhaus-btn flex items-center justify-center gap-2 px-4 py-2.5 text-sm sm:px-5 sm:py-3 sm:text-base"
          >
            <RotateCcw size={16} className="sm:hidden" />
            <RotateCcw size={18} className="hidden sm:block" />
            再测一次
          </button>
        </div>

        <div className="no-print mt-6 text-center">
          <button
            onClick={() => navigate('/history')}
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] underline underline-offset-4 hover:text-[var(--text-primary)]"
          >
            <History size={18} />
            查看历史记录
          </button>
        </div>
      </div>
    </main>
  );
}
