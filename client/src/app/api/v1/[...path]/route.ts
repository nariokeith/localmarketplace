const API_BASE_URL =
  process.env.API_BASE_URL?.replace(/\/$/, '') ||
  (process.env.API_INTERNAL_HOSTPORT ? `http://${process.env.API_INTERNAL_HOSTPORT}` : 'http://localhost:3000');

const hopByHopHeaders = new Set([
  'connection',
  'content-encoding',
  'content-length',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade'
]);

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

async function proxyRequest(request: Request, context: RouteContext) {
  const { path } = await context.params;
  const incomingUrl = new URL(request.url);
  const targetUrl = `${API_BASE_URL}/api/v1/${path.join('/')}${incomingUrl.search}`;
  const headers = new Headers(request.headers);

  headers.delete('host');
  headers.delete('content-length');

  const response = await fetch(targetUrl, {
    method: request.method,
    headers,
    body: ['GET', 'HEAD'].includes(request.method) ? undefined : await request.arrayBuffer(),
    redirect: 'manual'
  });

  const responseHeaders = new Headers();
  response.headers.forEach((value, key) => {
    if (!hopByHopHeaders.has(key.toLowerCase())) {
      responseHeaders.set(key, value);
    }
  });

  if (response.status === 204 || request.method === 'HEAD') {
    return new Response(null, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders
    });
  }

  return new Response(await response.arrayBuffer(), {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders
  });
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
export const OPTIONS = proxyRequest;
