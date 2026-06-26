import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, CheckCircle } from 'lucide-react';

const STEPS = [
  {
    step: '01',
    title: '开始作答',
    desc: '根据你的真实感受，依次回答所有问题——没有对错，凭第一感觉就好。',
  },
  {
    step: '02',
    title: '看看结果',
    desc: '从多个角度看到自己的画像：你的性格倾向、对自己的感受、与人相处的方式，以及近期的状态。',
  },
  {
    step: '03',
    title: '自己判断',
    desc: '结果可以帮你更清楚地看到自己。如果有些地方让你觉得需要关注，你可以自己决定下一步做什么。',
  },
];

const QUESTIONS_SECTION = [
  {
    label: '关于你的日常',
    desc: '你平时是什么样的人',
  },
  {
    label: '你对自己的感受',
    desc: '你心里怎么看自己',
  },
  {
    label: '关于你与人相处',
    desc: '你在关系中的样子',
  },
  {
    label: '最近这段时间',
    desc: '近一两周的状态',
  },
  {
    label: '一些日常状态',
    desc: '睡眠和精力',
  },
];

export function Welcome() {
  const [faqOpen, setFaqOpen] = useState(false);

  return (
    <main className="animate-fade-in-up">
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pt-12 pb-16 sm:pt-16 sm:pb-20">
        <div className="mx-auto max-w-4xl">
          <div className="relative">
            {/* Decorative shapes */}
            <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-[var(--accent-red)] sm:h-32 sm:w-32" />
            <div className="absolute top-24 -left-12 h-16 w-16 bg-[var(--accent-yellow)] sm:top-32" />
            <div className="absolute bottom-0 right-12 h-0 w-0 border-l-[30px] border-r-[30px] border-b-[52px] border-l-transparent border-r-transparent border-b-[var(--accent-blue)]" />

            <div className="bauhaus-card relative p-6 sm:p-12">
              <h1 className="font-display text-4xl font-bold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
                了解一下
                <br />
                <span className="text-[var(--accent-blue)]">自己</span>
              </h1>
              <p className="mt-6 max-w-lg text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">
                花二三十分钟，从不同角度看看自己——你的性格倾向、对自己的感受、和人相处的方式，还有最近的状态。
              </p>

              <div className="mt-6 flex flex-col gap-2 sm:mt-8 sm:flex-row sm:gap-4">
                <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] sm:text-sm">
                  <CheckCircle size={16} className="text-[var(--accent-blue)]" />
                  <span>60 + 道题</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] sm:text-sm">
                  <CheckCircle size={16} className="text-[var(--accent-blue)]" />
                  <span>多角度了解自己</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] sm:text-sm">
                  <CheckCircle size={16} className="text-[var(--accent-blue)]" />
                  <span>数据只留在你设备上</span>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3 sm:mt-10 sm:gap-4">
                <Link
                  to="/quiz"
                  className="bauhaus-btn inline-block px-6 py-3 text-center text-sm sm:px-8 sm:py-4 sm:text-base"
                >
                  开始
                </Link>
                <Link
                  to="/settings"
                  className="bauhaus-btn-secondary inline-block px-6 py-3 text-center text-sm sm:px-8 sm:py-4 sm:text-base"
                >
                  设置
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t-[3px] border-[var(--border-color)] bg-[var(--bg-card)] px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight sm:text-3xl">
            简单三步
          </h2>
          <p className="mt-2 text-sm text-[var(--text-secondary)] sm:text-base">
            不需要复杂的操作，跟着感觉走就好
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3 sm:gap-6">
            {STEPS.map((item) => (
              <div key={item.step} className="bauhaus-card-sm p-5 sm:p-6">
                <span className="font-display text-3xl font-bold text-[var(--text-secondary)] sm:text-4xl">
                  {item.step}
                </span>
                <h3 className="mt-3 font-display text-base font-bold uppercase tracking-wide sm:text-lg">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Question sections preview */}
      <section className="px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight sm:text-3xl">
            你会看到这些方面
          </h2>
          <p className="mt-2 text-sm text-[var(--text-secondary)] sm:text-base">
            题目分成了几个小块，每块关注一个方面
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {QUESTIONS_SECTION.map((item) => (
              <div
                key={item.label}
                className="bauhaus-card-sm p-4 sm:p-5"
              >
                <h3 className="font-display text-base font-bold uppercase tracking-wide sm:text-lg">
                  {item.label}
                </h3>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t-[3px] border-[var(--border-color)] bg-[var(--bg-card)] px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <div className="bauhaus-card p-6 text-center sm:p-10">
            <h2 className="font-display text-2xl font-bold uppercase tracking-tight sm:text-3xl lg:text-4xl">
              准备好了吗？
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
              没有对错，没有评判。只是花点时间看看自己——你可能会有一些新的发现。
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
              <Link to="/quiz" className="bauhaus-btn inline-block px-8 py-3 text-sm sm:px-10 sm:py-4 sm:text-base">
                开始
              </Link>
              <p className="text-xs text-[var(--text-secondary)] sm:text-sm">
                数据只存在你的设备上 · 随时可以重新来
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Simple FAQ */}
      <section className="px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-2xl">
          <button
            onClick={() => setFaqOpen(!faqOpen)}
            className="flex w-full items-center justify-between gap-4"
          >
            <h2 className="font-display text-xl font-bold uppercase tracking-tight sm:text-2xl">
              一些说明
            </h2>
            <ChevronDown
              size={20}
              className={`text-[var(--text-secondary)] transition-transform duration-300 ${faqOpen ? 'rotate-180' : ''}`}
            />
          </button>
          {faqOpen && (
            <div className="mt-6 grid gap-4 animate-fade-in-up">
              <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                题目没有对错，凭第一感觉回答就好，不用想太多。
                所有答案和结果都只保存在你的设备上，不会上传到任何地方。
                你可以随时在设置里导出或清除数据。
              </p>
              <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                结果是你了解自己的一个参考，不是诊断。如果某些方面让你觉得需要关注，
                相信你自己的判断，决定要不要找专业人士聊聊。
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
