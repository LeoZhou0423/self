/**
 * MiMo Token Plan 代理 Worker
 *
 * 用途：将 API Key 保存在 Cloudflare Worker 环境变量中，前端无需暴露 Key。
 *
 * 部署步骤：
 * 1. 登录 Cloudflare Dashboard，创建一个新的 Worker
 * 2. 在 Worker 的 Settings > Variables 中添加环境变量：
 *    - MIMO_BASE_URL: https://token-plan-cn.xiaomimimo.com/v1
 *    - MIMO_API_KEY: 你的 tp-xxxxxx Token Plan API Key
 *    - MIMO_MODEL: mimo-v2.5-pro
 * 3. 复制本文件全部内容到 Worker 编辑器中保存并部署
 * 4. 将 Worker 的 URL 填入前端设置中的"Worker 代理地址"
 */

export default {
  async fetch(request, env) {
    // CORS 预检
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    const baseUrl = (env.MIMO_BASE_URL || 'https://token-plan-cn.xiaomimimo.com/v1').replace(/\/$/, '');
    const apiKey = env.MIMO_API_KEY;
    const defaultModel = env.MIMO_MODEL || 'mimo-v2.5-pro';

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'MIMO_API_KEY not configured' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    try {
      const body = await request.json();
      const model = body.model || defaultModel;

      const upstreamUrl = `${baseUrl}/chat/completions`;
      const upstreamResponse = await fetch(upstreamUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey,
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          ...body,
          model,
        }),
      });

      const response = new Response(upstreamResponse.body, {
        status: upstreamResponse.status,
        statusText: upstreamResponse.statusText,
        headers: {
          ...Object.fromEntries(upstreamResponse.headers.entries()),
          'Access-Control-Allow-Origin': '*',
        },
      });

      return response;
    } catch (err) {
      return new Response(
        JSON.stringify({ error: err instanceof Error ? err.message : 'Proxy error' }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }
  },
};
