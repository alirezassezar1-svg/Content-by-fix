/**
 * Makes the same frontend work on both hosts:
 *  - Node host (server.ts running): /api/* goes to the real server, unchanged.
 *  - Static host (GitHub Pages etc.): no server answers, so /api/* is handled in the browser.
 */
import { handleStudioApi } from './studioApi';

let serverAlive: boolean | null = null; // null = unknown yet

export function installApiShim() {
  const realFetch = window.fetch.bind(window);

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const raw = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
    let pathname = '';
    try {
      pathname = new URL(raw, window.location.href).pathname;
    } catch {
      return realFetch(input, init);
    }
    const apiIdx = pathname.indexOf('/api/');
    const isApi = raw.startsWith('/api/') || raw.startsWith('./api/') || (apiIdx >= 0 && raw.includes('/api/'));
    if (!isApi) return realFetch(input, init);
    const apiPath = pathname.slice(apiIdx);

    const local = async () => {
      let body: any = {};
      try {
        body = init?.body ? JSON.parse(init.body as string) : {};
      } catch { /* ignore */ }
      const { status, body: out } = await handleStudioApi(apiPath, body);
      return new Response(JSON.stringify(out), { status, headers: { 'Content-Type': 'application/json' } });
    };

    if (serverAlive === false) return local();

    try {
      const res = await realFetch(input, init);
      const isJson = (res.headers.get('content-type') || '').includes('application/json');
      if (res.status === 404 || res.status === 405 || res.status === 501 || (res.ok && !isJson)) {
        serverAlive = false;
        return local();
      }
      serverAlive = true;
      return res;
    } catch {
      serverAlive = false;
      return local();
    }
  };
}
