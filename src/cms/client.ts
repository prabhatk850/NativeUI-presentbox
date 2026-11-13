// Contentful Delivery API over plain fetch: one request per content type, links resolved in place.
import config from './config.json';

// An entry or asset with its links replaced by the linked entries (unpublished links drop out).
export type Entry = { sys: { id: string; type: string; contentType?: { sys: { id: string } } }; fields: Record<string, any> };
type Raw = { sys: Entry['sys'] & { linkType?: string }; fields?: Record<string, unknown> };
type Response = { items: Raw[]; includes?: { Entry?: Raw[]; Asset?: Raw[] } };

const BASE = `https://cdn.contentful.com/spaces/${config.spaceId}/environments/${config.environment}`;

// The bundlers inline the token from .env (babel.config.js, vite.config.mjs). No token = the app runs on src/mocks.
export const isLive = () => !!process.env.CONTENTFUL_DELIVERY_TOKEN;

// ponytail: responses are kept for the app session, so content edits show after a restart; add a TTL if editors need live updates
const cache = new Map<string, Promise<Entry[]>>();

export function getEntries(contentType: string, query: Record<string, string> = {}): Promise<Entry[]> {
  const params = { content_type: contentType, include: '4', limit: '1000', ...query };
  const url = `${BASE}/entries?${Object.entries(params).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&')}`;
  if (!cache.has(url)) {
    cache.set(
      url,
      request(url).catch((error) => {
        cache.delete(url); // let the next call retry
        throw error;
      }),
    );
  }
  return cache.get(url)!;
}

async function request(url: string) {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${process.env.CONTENTFUL_DELIVERY_TOKEN}` } });
  if (!res.ok) throw new Error(`Contentful ${res.status}: ${url}`);
  return resolveLinks(await res.json());
}

function resolveLinks({ items, includes }: Response): Entry[] {
  const all = [...items, ...(includes?.Entry ?? []), ...(includes?.Asset ?? [])];
  const byKey = new Map(all.map((e) => [`${e.sys.type}:${e.sys.id}`, e]));
  const resolved = new Map<Raw, Entry>();

  const value = (v: unknown): unknown => {
    if (Array.isArray(v)) return v.map(value).filter((x) => x !== undefined);
    const sys = (v as Raw | null)?.sys;
    if (sys?.type !== 'Link') return v;
    const target = byKey.get(`${sys.linkType}:${sys.id}`);
    return target && entry(target);
  };
  const entry = (raw: Raw): Entry => {
    if (resolved.has(raw)) return resolved.get(raw)!;
    const out: Entry = { sys: raw.sys, fields: {} };
    resolved.set(raw, out); // before walking fields, so circular references point back at the same object
    for (const [k, v] of Object.entries(raw.fields ?? {})) out.fields[k] = value(v);
    return out;
  };
  return items.map(entry);
}
