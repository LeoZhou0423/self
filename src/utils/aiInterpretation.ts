import type { AppSettings } from '@/store/useAppStore';
import type { PersonalityModel } from '@/utils/scoring';

export interface AIInterpretationOptions {
  model: PersonalityModel;
  settings: AppSettings['aiConfig'];
  onChunk: (chunk: string) => void;
  onError: (error: string) => void;
  onDone: () => void;
}

function buildPersonalityPrompt(model: PersonalityModel): string {
  const s = model.scores;

  return `你是一位专业的人格心理学分析师，擅长基于大五人格（Big Five / BFI-2）测试结果给出深刻、个性化、有洞察力的解读。

请基于以下测试者的 BFI-2 人格画像，用中文撰写一份"AI 深度人格解读"。要求：
1. 语言真诚、具体，避免空泛的鸡汤；
2. 结合数据点解释其性格如何影响工作、人际关系、情绪与自我成长；
3. 给出 3-5 条可操作的发展建议；
4. 字数控制在 800-1200 字；
5. 直接输出正文，不需要标题。

【人格画像数据】
- 人格原型：${model.archetype.name} — ${model.archetype.tagline}
- 开放性 O：${s.openness} 百分位
- 尽责性 C：${s.conscientiousness} 百分位
- 外向性 E：${s.extraversion} 百分位
- 宜人性 A：${s.agreeableness} 百分位
- 情绪敏感性 N：${s.neuroticism} 百分位

【15 子维度剖面】
${model.facetProfiles.map((f) => `- ${f.name}：${f.score}（${f.level}）`).join('\n')}

【情绪基调】${model.emotionalProfile.dominantEmotion}
【认知风格】${model.cognitiveStyle.thinkingMode}
【决策风格】${model.decisionStyle.style}
【压力响应模式】${model.stressResponse.stressType}
【成长边缘】${model.growthEdge}
`;
}

export async function generateAIInterpretation({
  model,
  settings,
  onChunk,
  onError,
  onDone,
}: AIInterpretationOptions): Promise<void> {
  if (!settings.enabled) {
    onError('AI 解读未启用，请先在设置中配置');
    return;
  }

  const prompt = buildPersonalityPrompt(model);
  const messages = [
    {
      role: 'system',
      content:
        '你是一位专业的人格心理学分析师，基于大五人格（BFI-2）数据为用户提供深刻、具体、可操作的个性化解读。',
    },
    { role: 'user', content: prompt },
  ];

  let url: string;
  let headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (settings.proxyMode === 'worker') {
    if (!settings.workerUrl) {
      onError('请填写 Worker 代理地址');
      return;
    }
    url = settings.workerUrl;
  } else {
    if (!settings.baseUrl) {
      onError('请填写 Base URL');
      return;
    }
    if (!settings.apiKey) {
      onError('请填写 API Key');
      return;
    }
    url = `${settings.baseUrl.replace(/\/$/, '')}/chat/completions`;
    headers['api-key'] = settings.apiKey;
    headers['Authorization'] = `Bearer ${settings.apiKey}`;
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: settings.model || 'mimo-v2.5-pro',
        messages,
        stream: true,
        max_completion_tokens: 2048,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      onError(`请求失败 (${response.status})：${text || response.statusText}`);
      return;
    }

    const reader = response.body?.getReader();
    if (!reader) {
      onError('无法读取响应流');
      return;
    }

    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed === 'data: [DONE]') continue;
        if (!trimmed.startsWith('data:')) continue;

        try {
          const json = JSON.parse(trimmed.slice(5));
          const delta = json.choices?.[0]?.delta?.content || '';
          if (delta) {
            onChunk(delta);
          }
        } catch {
          // Ignore malformed JSON in stream
        }
      }
    }

    onDone();
  } catch (err) {
    onError(err instanceof Error ? err.message : '网络请求失败');
  }
}
