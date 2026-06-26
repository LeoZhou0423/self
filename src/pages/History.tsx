import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Eye, GitCompare, X, TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react';
import { RadarChart } from '@/components/RadarChart';
import { useAppStore, type TestRecord } from '@/store/useAppStore';
import { DOMAINS, type Domain } from '@/data/questions';

const DOMAIN_ORDER: Domain[] = ['O', 'C', 'E', 'A', 'N'];

function RecordCard({
  record,
  selected,
  onSelect,
  onView,
  onDelete,
}: {
  record: TestRecord;
  selected: boolean;
  onSelect: () => void;
  onView: () => void;
  onDelete: () => void;
}) {
  const scoresMap: Record<Domain, number> = {
    O: record.scores.openness,
    C: record.scores.conscientiousness,
    E: record.scores.extraversion,
    A: record.scores.agreeableness,
    N: record.scores.neuroticism,
  };

  const dateStr = new Date(record.createdAt).toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className={`bauhaus-card-sm p-4 transition-all sm:p-5 ${
        selected ? 'ring-2 ring-[var(--accent-blue)]' : ''
      }`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex justify-center sm:w-28">
          <RadarChart scores={scoresMap} size={100} animated={false} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display text-xs font-bold uppercase tracking-wide text-[var(--text-secondary)] sm:text-sm">
            {dateStr}
          </p>
          <div className="mt-2 grid grid-cols-5 gap-1 text-center">
            {DOMAIN_ORDER.map((d) => (
              <div key={d}>
                <div className="font-display text-[10px] font-bold sm:text-xs">{DOMAINS[d].name.slice(0, 1)}</div>
                <div className="text-xs font-semibold sm:text-sm">{scoresMap[d]}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:flex-col">
          <input
            type="checkbox"
            checked={selected}
            onChange={onSelect}
            className="h-5 w-5 accent-[var(--accent-blue)]"
            aria-label="选择对比"
          />
          <button
            onClick={onView}
            className="flex items-center gap-1 border-2 border-[var(--border-color)] px-3 py-1.5 text-xs font-medium transition-colors hover:bg-[var(--bg-primary)] sm:text-sm"
          >
            <Eye size={14} />
            查看
          </button>
          <button
            onClick={onDelete}
            className="flex items-center gap-1 border-2 border-[var(--border-color)] px-3 py-1.5 text-xs font-medium text-[var(--accent-red)] transition-colors hover:bg-[var(--bg-primary)] sm:text-sm"
          >
            <Trash2 size={14} />
            删除
          </button>
        </div>
      </div>
    </div>
  );
}

function ComparisonView({
  records,
  onClose,
}: {
  records: TestRecord[];
  onClose: () => void;
}) {
  if (records.length < 2) return null;

  const first = records[0];
  const last = records[records.length - 1];

  const getTrend = (current: number, previous: number) => {
    const diff = current - previous;
    if (diff > 5) return { icon: TrendingUp, color: 'text-emerald-500', diff: `+${diff}` };
    if (diff < -5) return { icon: TrendingDown, color: 'text-[var(--accent-red)]', diff: `${diff}` };
    return { icon: Minus, color: 'text-[var(--text-secondary)]', diff: `${diff > 0 ? '+' : ''}${diff}` };
  };

  return (
    <div className="bauhaus-card p-4 animate-scale-in sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 size={18} className="text-[var(--accent-blue)]" />
          <h2 className="font-display text-lg font-bold uppercase tracking-wide sm:text-xl">
            结果对比
          </h2>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-[var(--bg-primary)] transition-colors">
          <X size={18} />
        </button>
      </div>

      {/* Radar comparison */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        {records.map((r) => {
          const scoresMap: Record<Domain, number> = {
            O: r.scores.openness,
            C: r.scores.conscientiousness,
            E: r.scores.extraversion,
            A: r.scores.agreeableness,
            N: r.scores.neuroticism,
          };
          const dateStr = new Date(r.createdAt).toLocaleDateString('zh-CN');
          return (
            <div key={r.id} className="text-center">
              <RadarChart scores={scoresMap} size={140} animated={false} />
              <p className="mt-2 text-xs text-[var(--text-secondary)]">{dateStr}</p>
            </div>
          );
        })}
      </div>

      {/* Trend table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b-2 border-[var(--border-color)]">
              <th className="py-2 font-display uppercase text-xs sm:text-sm">维度</th>
              {records.map((r) => (
                <th key={r.id} className="py-2 font-display uppercase text-xs sm:text-sm text-center">
                  {new Date(r.createdAt).toLocaleDateString('zh-CN')}
                </th>
              ))}
              {records.length === 2 && <th className="py-2 font-display uppercase text-xs sm:text-sm text-center">变化</th>}
            </tr>
          </thead>
          <tbody>
            {DOMAIN_ORDER.map((domain) => (
              <tr key={domain} className="border-b border-[var(--border-color)]">
                <td className="py-2 font-medium text-xs sm:text-sm">{DOMAINS[domain].name}</td>
                {records.map((r) => {
                  const score = {
                    O: r.scores.openness,
                    C: r.scores.conscientiousness,
                    E: r.scores.extraversion,
                    A: r.scores.agreeableness,
                    N: r.scores.neuroticism,
                  }[domain];
                  return (
                    <td key={r.id} className="py-2 font-display font-bold text-center text-xs sm:text-sm">
                      {score}
                    </td>
                  );
                })}
                {records.length === 2 && (() => {
                  const firstScore = {
                    O: first.scores.openness,
                    C: first.scores.conscientiousness,
                    E: first.scores.extraversion,
                    A: first.scores.agreeableness,
                    N: first.scores.neuroticism,
                  }[domain];
                  const lastScore = {
                    O: last.scores.openness,
                    C: last.scores.conscientiousness,
                    E: last.scores.extraversion,
                    A: last.scores.agreeableness,
                    N: last.scores.neuroticism,
                  }[domain];
                  const trend = getTrend(lastScore, firstScore);
                  const Icon = trend.icon;
                  return (
                    <td className="py-2 text-center">
                      <span className={`inline-flex items-center gap-1 text-xs font-bold ${trend.color}`}>
                        <Icon size={14} />
                        {trend.diff}
                      </span>
                    </td>
                  );
                })()}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function History() {
  const navigate = useNavigate();
  const { history, deleteRecord, clearHistory } = useAppStore();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [compareMode, setCompareMode] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [clearConfirm, setClearConfirm] = useState(false);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectedRecords = history.filter((r) => selectedIds.includes(r.id));

  return (
    <main className="animate-fade-in-up px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold uppercase tracking-tight sm:text-3xl lg:text-4xl">
              历史记录
            </h1>
            <p className="mt-2 text-xs text-[var(--text-secondary)] sm:text-sm">
              共 {history.length} 条记录
            </p>
          </div>
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={() => {
                setCompareMode(!compareMode);
                if (compareMode) setSelectedIds([]);
              }}
              className={`bauhaus-btn-secondary flex items-center gap-2 px-3 py-2 text-xs sm:px-4 sm:py-2 sm:text-sm ${
                compareMode ? 'bg-[var(--bg-alt)] text-[var(--text-inverse)]' : ''
              }`}
            >
              <GitCompare size={14} />
              {compareMode ? '取消对比' : '对比'}
            </button>
            <button
              onClick={() => setClearConfirm(true)}
              className="bauhaus-btn-secondary flex items-center gap-2 px-3 py-2 text-xs text-[var(--accent-red)] sm:px-4 sm:py-2 sm:text-sm"
            >
              <Trash2 size={14} />
              清空
            </button>
          </div>
        </div>

        {/* Compare hint */}
        {compareMode && selectedRecords.length < 2 && (
          <div className="mb-4 p-3 border-2 border-[var(--accent-yellow)] bg-yellow-50 dark:bg-yellow-950/20 text-xs text-[var(--text-secondary)] sm:text-sm">
            请选择至少 2 条记录进行对比
          </div>
        )}

        {compareMode && selectedRecords.length >= 2 && (
          <div className="mb-6">
            <ComparisonView
              records={selectedRecords}
              onClose={() => setCompareMode(false)}
            />
          </div>
        )}

        {history.length === 0 ? (
          <div className="bauhaus-card p-10 text-center sm:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center border-2 border-[var(--border-color)] bg-[var(--bg-primary)] mb-4">
              <BarChart3 size={28} className="text-[var(--text-secondary)]" />
            </div>
            <h3 className="font-display text-lg font-bold uppercase tracking-wide">
              暂无测试记录
            </h3>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
               完成后，你的结果将出现在这里
              </p>
              <button
                onClick={() => navigate('/quiz')}
                className="bauhaus-btn mt-6 px-6 py-3 text-sm"
              >
                开始
            </button>
          </div>
        ) : (
          <div className="grid gap-3 sm:gap-4">
            {history.map((record) => (
              <RecordCard
                key={record.id}
                record={record}
                selected={selectedIds.includes(record.id)}
                onSelect={() => toggleSelect(record.id)}
                onView={() => navigate(`/result/${record.id}`)}
                onDelete={() => setDeleteConfirm(record.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bauhaus-card p-5 max-w-sm w-full sm:p-6">
            <h3 className="font-display text-lg font-bold uppercase tracking-wide">
              删除记录
            </h3>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              确定要删除这条测试记录吗？此操作无法撤销。
            </p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="bauhaus-btn-secondary flex-1 px-4 py-2 text-sm"
              >
                取消
              </button>
              <button
                onClick={() => {
                  deleteRecord(deleteConfirm);
                  setSelectedIds((prev) => prev.filter((id) => id !== deleteConfirm));
                  setDeleteConfirm(null);
                }}
                className="bauhaus-btn bauhaus-btn-red flex-1 px-4 py-2 text-sm"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear Confirm Modal */}
      {clearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setClearConfirm(false)} />
          <div className="relative bauhaus-card p-5 max-w-sm w-full sm:p-6">
            <h3 className="font-display text-lg font-bold uppercase tracking-wide">
              清空所有记录
            </h3>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              确定要清空所有历史记录吗？此操作无法撤销。
            </p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setClearConfirm(false)}
                className="bauhaus-btn-secondary flex-1 px-4 py-2 text-sm"
              >
                取消
              </button>
              <button
                onClick={() => {
                  clearHistory();
                  setSelectedIds([]);
                  setClearConfirm(false);
                  setCompareMode(false);
                }}
                className="bauhaus-btn bauhaus-btn-red flex-1 px-4 py-2 text-sm"
              >
                清空
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
