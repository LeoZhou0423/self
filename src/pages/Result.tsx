import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Download,
  Share2,
  RotateCcw,
  FileText,
  History,
  Briefcase,
  Heart,
  Target,
  Sparkles,
  TrendingUp,
  ChevronDown,
  Star,
  Brain,
  Shield,
  Zap,
  User,
  Lightbulb,
  AlertTriangle,
} from 'lucide-react';
import { RadarChart } from '@/components/RadarChart';
import { DomainCard } from '@/components/DomainCard';
import { AnalysisCard, MetricBar, Tag, SectionTitle } from '@/components/AnalysisCard';
import { useAppStore } from '@/store/useAppStore';
import { DOMAINS, FACETS, type Domain } from '@/data/questions';
import { buildPersonalityModel, type PersonalityModel, type FacetProfile } from '@/utils/scoring';
import { exportElementToImage, exportElementToPDF, shareElementImage } from '@/utils/export';

const DOMAIN_ORDER: Domain[] = ['O', 'C', 'E', 'A', 'N'];

const LEVEL_LABELS: Record<string, string> = {
  very_low: '极低',
  low: '偏低',
  average: '中等',
  high: '偏高',
  very_high: '极高',
};

const LEVEL_COLORS: Record<string, string> = {
  very_low: 'bg-red-100 text-red-700',
  low: 'bg-orange-100 text-orange-700',
  average: 'bg-gray-100 text-[var(--text-secondary)]',
  high: 'bg-blue-100 text-blue-700',
  very_high: 'bg-purple-100 text-purple-700',
};

type TabKey =
  | 'profile'
  | 'emotion'
  | 'cognitive'
  | 'decision'
  | 'career'
  | 'relationship'
  | 'stress'
  | 'growth';

function FacetBar({ profile }: { profile: FacetProfile }) {
  const [expanded, setExpanded] = useState(false);
  const barColor =
    profile.score >= 65
      ? 'bg-[var(--accent-blue)]'
      : profile.score <= 35
        ? 'bg-[var(--accent-red)]'
        : 'bg-[var(--bg-alt)]';

  return (
    <div className="border-b border-[var(--border-color)] last:border-b-0">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-3 py-3 text-left"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-sm font-medium">{profile.name}</span>
            <div className="flex items-center gap-2">
              <span
                className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${LEVEL_COLORS[profile.level]}`}
              >
                {LEVEL_LABELS[profile.level]}
              </span>
              <span className="font-display text-sm font-bold">{profile.score}</span>
            </div>
          </div>
          <div className="mt-1.5 h-2 w-full border-2 border-[var(--border-color)] bg-[var(--bg-primary)]">
            <div
              className={`h-full ${barColor} transition-all duration-500`}
              style={{ width: `${profile.score}%` }}
            />
          </div>
        </div>
        <ChevronDown
          size={16}
          className={`shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`}
        />
      </button>
      {expanded && (
        <p className="pb-3 text-xs leading-relaxed text-[var(--text-secondary)] animate-fade-in-up">
          {profile.interpretation}
        </p>
      )}
    </div>
  );
}

export function Result() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { history, clearCurrentAnswers } = useAppStore();
  const reportRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('profile');

  const record = id ? history.find((r) => r.id === id) : history[0];

  useEffect(() => {
    if (!record) {
      navigate('/');
    }
  }, [record, navigate]);

  if (!record) return null;

  const model: PersonalityModel = buildPersonalityModel(record.scores);
  const scoresMap: Record<Domain, number> = {
    O: record.scores.openness,
    C: record.scores.conscientiousness,
    E: record.scores.extraversion,
    A: record.scores.agreeableness,
    N: record.scores.neuroticism,
  };

  const dateStr = new Date(record.createdAt).toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleExportImage = async () => {
    if (!reportRef.current) return;
    setExporting(true);
    await exportElementToImage(reportRef.current, `bfi2-result-${record.id.slice(0, 8)}`);
    setExporting(false);
  };

  const handleShare = async () => {
    if (!reportRef.current) return;
    setExporting(true);
    await shareElementImage(reportRef.current, `bfi2-result-${record.id.slice(0, 8)}`);
    setExporting(false);
  };

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    setExporting(true);
    await exportElementToPDF(reportRef.current, `bfi2-result-${record.id.slice(0, 8)}`);
    setExporting(false);
  };

  const handleRetake = () => {
    clearCurrentAnswers();
    navigate('/quiz');
  };

  const tabs: { key: TabKey; label: string; icon: typeof Star }[] = [
    { key: 'profile', label: '人格画像', icon: User },
    { key: 'emotion', label: '情绪画像', icon: Heart },
    { key: 'cognitive', label: '认知风格', icon: Brain },
    { key: 'decision', label: '决策风格', icon: Lightbulb },
    { key: 'career', label: '职业匹配', icon: Briefcase },
    { key: 'relationship', label: '人际关系', icon: Zap },
    { key: 'stress', label: '压力响应', icon: Shield },
    { key: 'growth', label: '成长路径', icon: TrendingUp },
  ];

  const tabContent: Record<TabKey, JSX.Element> = {
    profile: (
      <div className="animate-fade-in-up space-y-4">
        <SectionTitle subtitle="与你人格最相似的历史人物与公众人物">
          名人匹配
        </SectionTitle>
        <div className="grid gap-3">
          {model.celebrityMatches.map((celeb, i) => (
            <AnalysisCard
              key={celeb.name}
              icon={<span className="font-display text-xs font-bold sm:text-sm">{i + 1}</span>}
              headerAction={<Tag variant="primary">{celeb.similarity}% 相似</Tag>}
            >
              <div className="flex items-center gap-2">
                <h4 className="font-display text-sm font-bold sm:text-base">{celeb.name}</h4>
                <Tag>{celeb.field}</Tag>
              </div>
              <p className="text-[10px] text-[var(--text-secondary)] sm:text-xs">{celeb.title}</p>
              <div className="mt-2">
                <MetricBar
                  label="相似度"
                  value={celeb.similarity}
                  color="bg-[var(--accent-yellow)]"
                  size="sm"
                />
              </div>
              <p className="mt-2 text-[10px] text-[var(--text-secondary)] sm:text-xs">
                {celeb.reason}
              </p>
              <p className="mt-2 border-l-2 border-[var(--accent-yellow)] pl-2 text-xs italic text-[var(--text-secondary)] sm:text-sm">
                「{celeb.quote}」
              </p>
            </AnalysisCard>
          ))}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <AnalysisCard
            title="核心优势"
            icon={<Sparkles size={14} />}
            variant="accent"
          >
            <ul className="space-y-1.5">
              {model.archetype.strengths.map((s) => (
                <li key={s} className="flex items-start gap-2 text-xs sm:text-sm">
                  <span className="text-[var(--accent-blue)">+</span>
                  {s}
                </li>
              ))}
            </ul>
          </AnalysisCard>
          <AnalysisCard
            title="需要注意"
            icon={<Target size={14} />}
            variant="warning"
          >
            <ul className="space-y-1.5">
              {model.archetype.watchouts.map((w) => (
                <li key={w} className="flex items-start gap-2 text-xs text-[var(--text-secondary)] sm:text-sm">
                  <span className="text-[var(--accent-red)]">!</span>
                  {w}
                </li>
              ))}
            </ul>
          </AnalysisCard>
        </div>
      </div>
    ),

    emotion: (
      <div className="animate-fade-in-up space-y-4">
        <AnalysisCard variant="highlight">
          <h3 className="font-display text-sm font-bold uppercase sm:text-base">
            情绪基调：{model.emotionalProfile.dominantEmotion}
          </h3>
          <p className="mt-2 text-sm leading-relaxed">
            {model.emotionalProfile.emotionalPattern}
          </p>
        </AnalysisCard>

        <div className="grid gap-3 sm:grid-cols-2">
          <AnalysisCard title="情绪指数" icon={<Heart size={14} />}>
            <div className="space-y-3">
              <MetricBar label="正面情绪" value={model.emotionalProfile.positivity} color="bg-green-500" />
              <MetricBar label="负面情绪" value={model.emotionalProfile.negativity} color="bg-red-500" />
            </div>
          </AnalysisCard>
          <AnalysisCard title="情绪调节" icon={<Shield size={14} />}>
            <div className="space-y-3">
              <MetricBar label="情绪波动" value={model.emotionalProfile.emotionalRange} color="bg-purple-500" />
              <MetricBar label="恢复力" value={model.emotionalProfile.emotionalResilience} color="bg-blue-500" />
            </div>
          </AnalysisCard>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <AnalysisCard title="情绪优势" icon={<Sparkles size={14} />} variant="success">
            <ul className="space-y-1.5">
              {model.emotionalProfile.emotionalStrengths.map((s) => (
                <li key={s} className="text-xs sm:text-sm">+ {s}</li>
              ))}
            </ul>
          </AnalysisCard>
          <AnalysisCard title="情绪挑战" icon={<AlertTriangle size={14} />} variant="warning">
            <ul className="space-y-1.5">
              {model.emotionalProfile.emotionalChallenges.map((c) => (
                <li key={c} className="text-xs text-[var(--text-secondary)] sm:text-sm">! {c}</li>
              ))}
            </ul>
          </AnalysisCard>
        </div>
      </div>
    ),

    cognitive: (
      <div className="animate-fade-in-up space-y-4">
        <AnalysisCard variant="accent">
          <h3 className="font-display text-sm font-bold uppercase sm:text-base">
            认知风格：{model.cognitiveStyle.thinkingMode}
          </h3>
          <p className="mt-2 text-sm leading-relaxed">{model.cognitiveStyle.description}</p>
        </AnalysisCard>

        <AnalysisCard title="认知能力指数" icon={<Brain size={14} />}>
          <div className="space-y-3">
            <MetricBar label="创造力" value={model.cognitiveStyle.creativityIndex} color="bg-purple-500" />
            <MetricBar label="分析力" value={model.cognitiveStyle.analyticalIndex} color="bg-blue-500" />
            <MetricBar label="实践力" value={model.cognitiveStyle.practicalIndex} color="bg-green-500" />
          </div>
        </AnalysisCard>

        <div className="grid gap-3 sm:grid-cols-2">
          <AnalysisCard title="信息加工" icon={<Zap size={14} />}>
            <p className="text-xs leading-relaxed sm:text-sm">{model.cognitiveStyle.processingStyle}</p>
          </AnalysisCard>
          <AnalysisCard title="学习风格" icon={<Lightbulb size={14} />}>
            <p className="text-xs leading-relaxed sm:text-sm">{model.cognitiveStyle.learningStyle}</p>
          </AnalysisCard>
        </div>
      </div>
    ),

    decision: (
      <div className="animate-fade-in-up space-y-4">
        <AnalysisCard variant="highlight">
          <h3 className="font-display text-sm font-bold uppercase sm:text-base">
            决策风格：{model.decisionStyle.style}
          </h3>
          <p className="mt-2 text-sm leading-relaxed">{model.decisionStyle.description}</p>
        </AnalysisCard>

        <AnalysisCard title="风险容忍度" icon={<Target size={14} />}>
          <MetricBar label="风险容忍" value={model.decisionStyle.riskTolerance} color="bg-orange-500" />
        </AnalysisCard>

        <div className="grid gap-3 sm:grid-cols-2">
          <AnalysisCard title="信息偏好" icon={<Brain size={14} />}>
            <p className="text-xs leading-relaxed sm:text-sm">{model.decisionStyle.informationPreference}</p>
          </AnalysisCard>
          <AnalysisCard title="速度偏好" icon={<Zap size={14} />}>
            <p className="text-xs leading-relaxed sm:text-sm">{model.decisionStyle.speedBias}</p>
          </AnalysisCard>
        </div>

        <AnalysisCard title="群体影响" icon={<User size={14} />}>
          <p className="text-xs leading-relaxed sm:text-sm">{model.decisionStyle.groupInfluence}</p>
        </AnalysisCard>

        <div className="grid gap-3 sm:grid-cols-2">
          <AnalysisCard title="决策盲点" icon={<AlertTriangle size={14} />} variant="warning">
            <ul className="space-y-1.5">
              {model.decisionStyle.blindSpots.map((b) => (
                <li key={b} className="text-xs text-[var(--text-secondary)] sm:text-sm">! {b}</li>
              ))}
            </ul>
          </AnalysisCard>
          <AnalysisCard title="优化建议" icon={<Lightbulb size={14} />} variant="accent">
            <p className="text-xs leading-relaxed sm:text-sm">{model.decisionStyle.optimizationTip}</p>
          </AnalysisCard>
        </div>
      </div>
    ),

    career: (
      <div className="animate-fade-in-up space-y-4">
        <SectionTitle subtitle="你的人格剖面与16种职业理想剖面的匹配度">
          职业匹配度排名
        </SectionTitle>
        <div className="grid gap-3 sm:grid-cols-2">
          {model.careerMatches.map((career, i) => (
            <AnalysisCard
              key={career.title}
              icon={<span className="font-display text-xs font-bold sm:text-sm">#{i + 1}</span>}
              headerAction={<Tag variant="primary">{career.matchScore}%</Tag>}
            >
              <h4 className="font-display text-sm font-bold sm:text-base">{career.title}</h4>
              <p className="text-[10px] uppercase text-[var(--text-secondary)] sm:text-xs">
                {career.category}
              </p>
              <div className="mt-2">
                <MetricBar
                  label="匹配度"
                  value={career.matchScore}
                  color="bg-[var(--accent-yellow)]"
                  size="sm"
                />
              </div>
              <p className="mt-2 text-[10px] leading-relaxed text-[var(--text-secondary)] sm:text-xs">
                {career.reason}
              </p>
            </AnalysisCard>
          ))}
        </div>
      </div>
    ),

    relationship: (
      <div className="animate-fade-in-up space-y-4">
        <AnalysisCard variant="accent">
          <h3 className="font-display text-sm font-bold uppercase sm:text-base">
            关系风格：{model.relationshipDynamics.style}
          </h3>
          <p className="mt-2 text-sm leading-relaxed">
            {model.relationshipDynamics.description}
          </p>
        </AnalysisCard>

        <div className="grid gap-3 sm:grid-cols-2">
          <AnalysisCard title="最佳匹配" icon={<Heart size={14} />} variant="success">
            <ul className="space-y-1.5">
              {model.relationshipDynamics.bestMatch.map((m) => (
                <li key={m} className="text-xs sm:text-sm">+ {m}</li>
              ))}
            </ul>
          </AnalysisCard>
          <AnalysisCard title="挑战匹配" icon={<AlertTriangle size={14} />} variant="warning">
            <ul className="space-y-1.5">
              {model.relationshipDynamics.challengeMatch.map((m) => (
                <li key={m} className="text-xs text-[var(--text-secondary)] sm:text-sm">! {m}</li>
              ))}
            </ul>
          </AnalysisCard>
        </div>

        <AnalysisCard title="关系建议" icon={<Star size={14} />}>
          <ul className="space-y-2">
            {model.relationshipDynamics.tips.map((tip) => (
              <li key={tip} className="text-xs leading-relaxed text-[var(--text-secondary)] sm:text-sm">
                &rarr; {tip}
              </li>
            ))}
          </ul>
        </AnalysisCard>
      </div>
    ),

    stress: (
      <div className="animate-fade-in-up space-y-4">
        <AnalysisCard variant="highlight">
          <h3 className="font-display text-sm font-bold uppercase sm:text-base">
            压力响应：{model.stressResponse.stressType}
          </h3>
          <p className="mt-2 text-sm leading-relaxed">{model.stressResponse.description}</p>
        </AnalysisCard>

        <AnalysisCard title="倦怠风险" icon={<AlertTriangle size={14} />} variant="warning">
          <MetricBar
            label="倦怠风险"
            value={model.stressResponse.burnoutRisk}
            color={
              model.stressResponse.burnoutRisk > 60
                ? 'bg-red-500'
                : model.stressResponse.burnoutRisk > 40
                  ? 'bg-orange-500'
                  : 'bg-green-500'
            }
          />
        </AnalysisCard>

        <AnalysisCard title="压力触发因素" icon={<Target size={14} />}>
          <div className="flex flex-wrap gap-1.5">
            {model.stressResponse.stressTriggers.map((t) => (
              <Tag key={t} variant="danger">
                {t}
              </Tag>
            ))}
          </div>
        </AnalysisCard>

        <div className="grid gap-3 sm:grid-cols-2">
          <AnalysisCard title="应对机制" icon={<Shield size={14} />}>
            <p className="text-xs leading-relaxed sm:text-sm">{model.stressResponse.copingMechanism}</p>
          </AnalysisCard>
          <AnalysisCard title="恢复方式" icon={<TrendingUp size={14} />}>
            <p className="text-xs leading-relaxed sm:text-sm">{model.stressResponse.recoveryStyle}</p>
          </AnalysisCard>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <AnalysisCard title="韧性因素" icon={<Sparkles size={14} />} variant="success">
            <ul className="space-y-1.5">
              {model.stressResponse.resilienceFactors.map((f) => (
                <li key={f} className="text-xs sm:text-sm">+ {f}</li>
              ))}
            </ul>
          </AnalysisCard>
          <AnalysisCard title="脆弱因素" icon={<AlertTriangle size={14} />} variant="warning">
            <ul className="space-y-1.5">
              {model.stressResponse.vulnerabilityFactors.map((f) => (
                <li key={f} className="text-xs text-[var(--text-secondary)] sm:text-sm">! {f}</li>
              ))}
            </ul>
          </AnalysisCard>
        </div>
      </div>
    ),

    growth: (
      <div className="animate-fade-in-up space-y-4">
        <AnalysisCard variant="highlight">
          <h3 className="flex items-center gap-2 font-display text-sm font-bold uppercase sm:text-base">
            <TrendingUp size={16} /> 成长边缘
          </h3>
          <p className="mt-2 text-sm leading-relaxed sm:text-base">{model.growthEdge}</p>
        </AnalysisCard>

        <SectionTitle subtitle="针对每个维度的优势子维度与发展空间">
          各维度发展建议
        </SectionTitle>
        <div className="grid gap-3">
          {DOMAIN_ORDER.map((domain) => {
            const info = DOMAINS[domain];
            const score = scoresMap[domain];
            const facetKeys = FACETS[domain].map((f) => f.key);
            const domainProfiles = model.facetProfiles.filter((f) =>
              facetKeys.includes(f.facet)
            );
            const weakest = [...domainProfiles].sort((a, b) => a.score - b.score)[0];
            const strongest = [...domainProfiles].sort((a, b) => b.score - a.score)[0];

            return (
              <AnalysisCard key={domain}>
                <div className="flex items-center gap-2">
                  <div
                    className="flex h-8 w-8 items-center justify-center text-xs font-bold text-white"
                    style={{ backgroundColor: info.color }}
                  >
                    {domain}
                  </div>
                  <div>
                    <h4 className="font-display text-sm font-bold uppercase">{info.name}</h4>
                    <p className="text-[10px] text-[var(--text-secondary)]">百分位 {score}</p>
                  </div>
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="border-l-2 border-[var(--accent-red)] pl-2">
                    <p className="text-[10px] font-bold uppercase text-[var(--accent-red)] sm:text-xs">
                      发展空间
                    </p>
                    <p className="text-xs font-medium sm:text-sm">
                      {weakest?.name} ({weakest?.score})
                    </p>
                    <p className="mt-0.5 text-[10px] leading-relaxed text-[var(--text-secondary)] sm:text-xs">
                      {weakest?.interpretation}
                    </p>
                  </div>
                  <div className="border-l-2 border-[var(--accent-blue)] pl-2">
                    <p className="text-[10px] font-bold uppercase text-[var(--accent-blue)] sm:text-xs">
                      核心优势
                    </p>
                    <p className="text-xs font-medium sm:text-sm">
                      {strongest?.name} ({strongest?.score})
                    </p>
                    <p className="mt-0.5 text-[10px] leading-relaxed text-[var(--text-secondary)] sm:text-xs">
                      {strongest?.interpretation}
                    </p>
                  </div>
                </div>
              </AnalysisCard>
            );
          })}
        </div>
      </div>
    ),
  };

  return (
    <main className="animate-fade-in-up px-3 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-4xl">
        <div ref={reportRef} className="bg-[var(--bg-primary)] p-3 sm:p-6 lg:p-10">
          <div className="bauhaus-card p-5 sm:p-8 lg:p-12">
            {/* ── 报告头部 ── */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)]">
                  BFI-2 人格建模报告
                </p>
                <h1 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl lg:text-5xl">
                  {model.archetype.name}
                </h1>
                <p className="mt-1 text-sm italic text-[var(--text-secondary)] sm:text-base">
                  「{model.archetype.tagline}」
                </p>
                <p className="mt-1 text-xs text-[var(--text-secondary)] sm:mt-2 sm:text-sm">
                  测试时间：{dateStr}
                </p>
              </div>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center border-2 border-[var(--border-color)] bg-[var(--accent-yellow)] sm:h-16 sm:w-16">
                <span className="font-display text-xl font-bold sm:text-2xl">BFI</span>
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed sm:mt-6 sm:text-base">
              {model.archetype.description}
            </p>

            {/* ── 主导特质标签 ── */}
            <div className="mt-4 sm:mt-6">
              <h3 className="font-display text-xs font-bold uppercase sm:text-sm">你的突出特质</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {model.dominantTraits.map((t) => (
                  <span
                    key={t}
                    className="border-2 border-[var(--border-color)] bg-[var(--bg-alt)] px-3 py-1 font-display text-xs font-bold uppercase text-[var(--text-inverse)] sm:text-sm"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* ── 雷达图 + 维度分数 ── */}
            <div className="mt-6 grid items-center gap-6 sm:mt-10 sm:gap-8 lg:grid-cols-2 lg:gap-10">
              <div className="flex justify-center">
                <RadarChart scores={scoresMap} size={280} className="sm:hidden" />
                <RadarChart scores={scoresMap} size={320} className="hidden sm:block lg:hidden" />
                <RadarChart scores={scoresMap} size={360} className="hidden lg:block" />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold uppercase tracking-wide sm:text-xl">
                  五维度百分位分数
                </h2>
                <p className="mt-1 text-xs text-[var(--text-secondary)]">
                  分数基于 BFI-2 常模转换为百分位，表示你在人群中的相对位置
                </p>
                <div className="mt-4 grid gap-2 sm:grid-cols-2 sm:gap-3">
                  {DOMAIN_ORDER.map((domain) => (
                    <DomainCard key={domain} domain={domain} score={scoresMap[domain]} />
                  ))}
                </div>
              </div>
            </div>

            {/* ── 子维度剖面 ── */}
            <div className="mt-8 border-t-2 border-[var(--border-color)] pt-6 sm:mt-10 sm:pt-8">
              <h2 className="font-display text-lg font-bold uppercase tracking-wide sm:text-xl">
                15 子维度剖面分析
              </h2>
              <p className="mt-1 text-xs text-[var(--text-secondary)]">
                每个维度包含3个子维度，点击查看详细解读
              </p>
              <div className="mt-4">
                {DOMAIN_ORDER.map((domain) => {
                  const info = DOMAINS[domain];
                  const facetKeys = FACETS[domain].map((f) => f.key);
                  const domainProfiles = model.facetProfiles.filter((f) =>
                    facetKeys.includes(f.facet)
                  );

                  return (
                    <div key={domain} className="mb-4">
                      <div className="mb-2 flex items-center gap-2">
                        <div
                          className="flex h-6 w-6 items-center justify-center text-xs font-bold text-white"
                          style={{ backgroundColor: info.color }}
                        >
                          {domain}
                        </div>
                        <span className="font-display text-sm font-bold uppercase">{info.name}</span>
                      </div>
                      <div className="pl-8">
                        {domainProfiles.map((profile) => (
                          <FacetBar key={profile.facet} profile={profile} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── 深度分析标签页 ── */}
            <div className="mt-8 border-t-2 border-[var(--border-color)] pt-6 sm:mt-10 sm:pt-8">
              <h2 className="font-display text-lg font-bold uppercase tracking-wide sm:text-xl">
                深度人格分析
              </h2>
              <div className="mt-3 flex gap-1 overflow-x-auto border-b-2 border-[var(--border-color)] pb-0">
                {tabs.map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-2 text-[10px] font-bold uppercase transition-all sm:text-xs ${
                      activeTab === key
                        ? 'border-[var(--accent-yellow)] bg-[var(--accent-yellow)]/10 text-[var(--text-primary)]'
                        : 'border-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-alt)]/5 hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <Icon size={12} />
                    {label}
                  </button>
                ))}
              </div>

              <div className="mt-4 sm:mt-6">{tabContent[activeTab]}</div>
            </div>

            {/* ── 方法论说明 ── */}
            <div className="mt-8 border-t-2 border-[var(--border-color)] pt-6 sm:mt-10 sm:pt-8">
              <h2 className="font-display text-sm font-bold uppercase sm:text-base">方法论说明</h2>
              <ul className="mt-2 space-y-1 text-xs text-[var(--text-secondary)] sm:text-sm">
                <li>
                  分数基于 BFI-2 常模（Soto &amp; John,
                  2017）通过正态 CDF 转换为百分位，表示你在人群中的相对位置
                </li>
                <li>人格原型基于五维度组合模式识别，共10种原型</li>
                <li>
                  名人匹配基于五维度欧氏距离计算，名人数据来源于公开人格研究与传记分析估计值
                </li>
                <li>情绪效价、认知风格、压力响应、决策风格等模块基于维度交互效应建模</li>
                <li>
                  职业匹配基于理想剖面与容差算法，匹配度越高说明你的人格特质与该职业的典型从业者越相似
                </li>
                <li>
                  人格具有相对稳定性，但也会随年龄、经历和情境而变化。测试结果仅供参考，不构成临床诊断
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="no-print mt-6 grid gap-2 sm:mt-8 sm:grid-cols-2 sm:gap-3 lg:grid-cols-4">
          <button
            onClick={handleExportImage}
            disabled={exporting}
            className="bauhaus-btn-secondary flex items-center justify-center gap-2 px-4 py-2.5 text-sm disabled:opacity-50 sm:px-5 sm:py-3 sm:text-base"
          >
            <Download size={16} className="sm:hidden" />
            <Download size={18} className="hidden sm:block" />
            保存图片
          </button>
          <button
            onClick={handleShare}
            disabled={exporting}
            className="bauhaus-btn-secondary flex items-center justify-center gap-2 px-4 py-2.5 text-sm disabled:opacity-50 sm:px-5 sm:py-3 sm:text-base"
          >
            <Share2 size={16} className="sm:hidden" />
            <Share2 size={18} className="hidden sm:block" />
            分享
          </button>
          <button
            onClick={handleExportPDF}
            disabled={exporting}
            className="bauhaus-btn-secondary flex items-center justify-center gap-2 px-4 py-2.5 text-sm disabled:opacity-50 sm:px-5 sm:py-3 sm:text-base"
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
