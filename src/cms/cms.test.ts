import { buildSeed } from '../../scripts/contentful/seed';
import { getFooter, getHeaders, getPage, getProducts } from '.';
import * as icons from '../theme/icons';
import config from './config.json';
import headers from '../mocks/headers.json';
import footer from '../mocks/footer.json';
import productPage from '../mocks/productPage.json';
import { mockPages } from '../mocks';

type Seeded = { sys: { id: string; type: string; contentType?: { sys: { id: string } } }; fields: Record<string, Record<string, any>> };
type Field = { id: string; type: string; required: boolean; validations: any[]; linkType?: string; items?: { type: string; linkType?: string; validations: any[] } };

const seed = buildSeed();
const types = new Map(seed.contentTypes.map((t) => [t.sys.id, t as { fields: Field[] }]));
const seeded = [...seed.entries, ...seed.assets] as Seeded[];
const byId = new Map(seeded.map((e) => [e.sys.id, e]));
const value = (e: Seeded, f: string) => e.fields[f]?.[config.locale];

// The seed as the Delivery API would return it: one locale, asset URLs protocol-relative.
const delivered = seeded.map(({ sys, fields }) => {
  const flat = Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, v[config.locale]]));
  if (sys.type === 'Asset') flat.file = { ...flat.file, url: flat.file.url.replace(/^https:/, '') };
  return { sys, fields: flat };
});

describe('Contentful', () => {
  beforeAll(() => {
    process.env.CONTENTFUL_DELIVERY_TOKEN = 'test';
    // a tiny Delivery API: content_type, fields.* filters, numeric order and limit
    global.fetch = jest.fn(async (url: string) => {
      const q = new URL(url).searchParams;
      let items = delivered.filter((e) => e.sys.contentType?.sys.id === q.get('content_type'));
      for (const [k, v] of q) if (k.startsWith('fields.')) items = items.filter((e) => e.fields[k.slice(7)] === v);
      const order = q.get('order')?.slice(7);
      if (order) items.sort((a, b) => a.fields[order] - b.fields[order]);
      items = items.slice(0, Number(q.get('limit')));
      return { ok: true, json: async () => ({ items, includes: { Entry: delivered.filter((e) => e.sys.type === 'Entry'), Asset: delivered.filter((e) => e.sys.type === 'Asset') } }) };
    }) as never;
  });
  afterAll(() => delete process.env.CONTENTFUL_DELIVERY_TOKEN);

  // seed (mocks → entries) and mappers (entries → app shapes) must round-trip
  it('serves the seeded content in the shapes the app uses', async () => {
    expect(await getHeaders()).toEqual(headers.data);
    expect(await getFooter()).toEqual(footer.data);
    expect(await getProducts()).toEqual(productPage);
    for (const [slug, page] of Object.entries(mockPages)) expect(await getPage(slug)).toEqual(page);
    expect(await getPage('missing')).toBeNull();
  });

  // what Contentful would reject on import, checked here because the import only runs against the live space
  it('seeds only values the content model accepts', () => {
    const problems: string[] = [];
    const check = (e: Seeded, f: Field, v: unknown, rules: Field | NonNullable<Field['items']>) => {
      for (const rule of rules.validations) {
        if (rule.in && !rule.in.includes(v)) problems.push(`${e.sys.id}.${f.id}: "${v}" not in ${rule.in}`);
        if (rule.regexp && !new RegExp(rule.regexp.pattern).test(String(v))) problems.push(`${e.sys.id}.${f.id}: "${v}" fails ${rule.regexp.pattern}`);
        if (rule.linkContentType) {
          const target = byId.get((v as Seeded).sys.id)?.sys.contentType?.sys.id;
          if (!rule.linkContentType.includes(target)) problems.push(`${e.sys.id}.${f.id}: links to ${target}`);
        }
      }
      if (rules.type === 'Link' && !byId.has((v as Seeded).sys.id)) problems.push(`${e.sys.id}.${f.id}: broken link`);
    };

    for (const e of seed.entries as Seeded[]) {
      const type = types.get(e.sys.contentType!.sys.id);
      if (!type) {
        problems.push(`${e.sys.id}: unknown content type ${e.sys.contentType!.sys.id}`);
        continue;
      }
      const unknown = Object.keys(e.fields).filter((k) => !type.fields.some((f) => f.id === k));
      if (unknown.length) problems.push(`${e.sys.id}: fields not in the model: ${unknown}`);
      for (const f of type.fields) {
        const v = value(e, f.id);
        if (v === undefined) {
          if (f.required) problems.push(`${e.sys.id}.${f.id}: required`);
        } else if (f.type === 'Array') (v as unknown[]).forEach((item) => check(e, f, item, f.items!));
        else check(e, f, v, f);
      }
    }

    // unique fields (product IDs, page slugs, …)
    for (const [id, type] of types) {
      for (const f of type.fields.filter((x) => x.validations.some((r) => r.unique))) {
        const values = (seed.entries as Seeded[]).filter((e) => e.sys.contentType!.sys.id === id).map((e) => value(e, f.id));
        if (new Set(values).size !== values.length) problems.push(`${id}.${f.id}: duplicate values`);
      }
    }
    expect(problems).toEqual([]);
  });

  it('only offers feature icons the app has', () => {
    const iconField = types.get('infoCard')!.fields.find((f) => f.id === 'icon')!;
    for (const name of iconField.validations[0].in) expect(icons).toHaveProperty(name);
  });
});
