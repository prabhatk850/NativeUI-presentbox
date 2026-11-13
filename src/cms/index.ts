// Site content from Contentful (model: scripts/contentful/model.js), mapped to the shapes the components use.
// Without a delivery token every getter returns the matching file in src/mocks, so tests, Storybook and offline dev need no network.
import { getEntries, isLive, type Entry } from './client';
import { formatPrice, type Category, type Occasion, type Product } from '../utils';
import headers from '../mocks/headers.json';
import footer from '../mocks/footer.json';
import productPage from '../mocks/productPage.json';
import pages from '../mocks/pages.json';

// "lable" and "Raiting" are the spellings the components were built on; Contentful uses label / rating.
export type Link = { id: string; lable: string; url: string };
export type HeaderMenu = {
  id: string;
  name: string;
  grid: string;
  menuDescription: { heading: string; description: string };
  img: { url: string } | null;
  navlink: { id: string; navlinks: Link[] }[];
};
export type FooterContent = { newsletter: boolean; section: { id: string; heading: string; item: Link[] }[] };
export type Catalog = { categories: Category[]; occasions: Occasion[]; data: Product[] };
export type HelpContent = {
  title: string;
  subtitle?: string;
  faqs: { id: string; topic: string; question: string; answer: string }[];
  contact: { email: string; phone: string; hours: string };
};
export type AboutContent = { eyebrow?: string; heading: string; story: string[]; values: { id: string; title: string; text: string }[] };
export type CareersContent = {
  eyebrow?: string;
  heading: string;
  intro: string;
  email: string;
  roles: { id: string; title: string; team: string; location: string; type: string }[];
};

export type CategoryCardContent = {
  id: string;
  variant: string;
  title: string;
  description?: string;
  img: { url: string } | null;
  button?: { name?: string; color?: string; textColor?: string };
};
export type ReviewContent = { name: string; rating: number; title: string; message: string; avatar: string };
// One entry per page block. `type` is the Contentful content type id; src/sections maps it to a component.
export type Section =
  | { type: 'heroSection'; id: string; headline: string; video?: string }
  | { type: 'categoryCardsSection'; id: string; title: string; cards: CategoryCardContent[] }
  | { type: 'reviewsSection'; id: string; heading: string; subheading?: string; reviews: ReviewContent[] }
  | { type: 'featuresSection'; id: string; title: string; features: { icon: string; label: string }[] }
  | ({ type: 'helpSection'; id: string } & HelpContent)
  | ({ type: 'aboutSection'; id: string } & AboutContent)
  | ({ type: 'careersSection'; id: string } & CareersContent)
  // a built-in screen (cart, catalog, …) placed on a page; APP_BLOCKS in src/sections names them
  | { type: 'appSection'; id: string; component: string };
export type Page = { id: string; slug: string; title: string; sections: Section[] };

// ---- Contentful entry → app shape

const assetUrl = (a?: Entry) => (a?.fields.file?.url ? `https:${a.fields.file.url}` : undefined);
const image = (a?: Entry) => {
  const url = assetUrl(a);
  return url ? { url } : null;
};
const list = (v: Entry[] | undefined) => v ?? [];
const link = ({ sys, fields: f }: Entry): Link => ({ id: sys.id, lable: f.label, url: f.url });

const menuItem = ({ sys, fields: f }: Entry): HeaderMenu => ({
  id: sys.id,
  name: f.name,
  grid: f.layout,
  menuDescription: { heading: f.heading ?? '', description: f.description ?? '' },
  img: image(f.image),
  navlink: list(f.linkGroups).map((g) => ({ id: g.sys.id, navlinks: list(g.fields.links).map(link) })),
});

const product = ({ fields: f }: Entry): Product => ({
  id: f.productId,
  categoryId: f.category?.fields.categoryId,
  type: f.badge,
  Raiting: f.rating,
  name: f.name,
  price: formatPrice(f.price),
  img: assetUrl(f.image) ?? '',
  gender: f.gender,
  occasionIds: list(f.occasions).map((o) => o.fields.occasionId),
  description: f.description,
  highlights: f.highlights,
});

const categoryCard = ({ sys, fields: f }: Entry): CategoryCardContent => ({
  id: sys.id,
  variant: f.variant,
  title: f.title,
  description: f.description,
  img: image(f.image),
  button: f.buttonLabel || f.buttonColor ? { name: f.buttonLabel, color: f.buttonColor, textColor: f.buttonTextColor } : undefined,
});

// Long text fields hold paragraphs separated by a blank line.
const paragraphs = (text?: string) => (text ?? '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

const SECTIONS: Record<string, (e: Entry) => Section> = {
  heroSection: ({ sys, fields: f }) => ({ type: 'heroSection', id: sys.id, headline: f.headline, video: assetUrl(f.video) }),
  categoryCardsSection: ({ sys, fields: f }) => ({ type: 'categoryCardsSection', id: sys.id, title: f.title, cards: list(f.cards).map(categoryCard) }),
  reviewsSection: ({ sys, fields: f }) => ({
    type: 'reviewsSection',
    id: sys.id,
    heading: f.heading,
    subheading: f.subheading,
    reviews: list(f.reviews).map(({ fields: r }) => ({ name: r.name, rating: r.rating, title: r.title, message: r.message, avatar: assetUrl(r.avatar) ?? '' })),
  }),
  featuresSection: ({ sys, fields: f }) => ({
    type: 'featuresSection',
    id: sys.id,
    title: f.title,
    features: list(f.features).map(({ fields: c }) => ({ icon: c.icon, label: c.title })),
  }),
  helpSection: ({ sys, fields: f }) => ({
    type: 'helpSection',
    id: sys.id,
    title: f.title,
    subtitle: f.subtitle,
    faqs: list(f.faqs).map(({ sys: q, fields: x }) => ({ id: q.id, topic: x.topic, question: x.question, answer: x.answer })),
    contact: { email: f.contactEmail, phone: f.contactPhone, hours: f.contactHours },
  }),
  aboutSection: ({ sys, fields: f }) => ({
    type: 'aboutSection',
    id: sys.id,
    eyebrow: f.eyebrow,
    heading: f.heading,
    story: paragraphs(f.story),
    values: list(f.values).map(({ sys: v, fields: x }) => ({ id: v.id, title: x.title, text: x.text })),
  }),
  careersSection: ({ sys, fields: f }) => ({
    type: 'careersSection',
    id: sys.id,
    eyebrow: f.eyebrow,
    heading: f.heading,
    intro: f.intro,
    email: f.email,
    roles: list(f.roles).map(({ sys: r, fields: x }) => ({ id: r.id, title: x.title, team: x.team, location: x.location, type: x.employmentType })),
  }),
  appSection: ({ sys, fields: f }) => ({ type: 'appSection', id: sys.id, component: f.component }),
};

// ---- getters

const first = async (contentType: string, query: Record<string, string> = {}) => (await getEntries(contentType, { limit: '1', ...query }))[0];

export async function getHeaders(): Promise<HeaderMenu[]> {
  if (!isLive()) return headers.data;
  return list((await first('navigation'))?.fields.headerMenu).map(menuItem);
}

export async function getFooter(): Promise<FooterContent> {
  if (!isLive()) return footer.data;
  const f = (await first('navigation'))?.fields ?? {};
  return {
    newsletter: !!f.newsletter,
    section: list(f.footerColumns).map((g) => ({ id: g.sys.id, heading: g.fields.heading ?? '', item: list(g.fields.links).map(link) })),
  };
}

export async function getProducts(): Promise<Catalog> {
  if (!isLive()) return productPage;
  const [categories, occasions, products] = await Promise.all([
    getEntries('category', { order: 'fields.categoryId' }),
    getEntries('occasion', { order: 'fields.occasionId' }),
    getEntries('product', { order: 'fields.productId' }),
  ]);
  return {
    categories: categories.map(({ fields: f }) => ({ id: f.categoryId, name: f.name })),
    occasions: occasions.map(({ fields: f }) => ({ id: f.occasionId, name: f.name })),
    data: products.map(product),
  };
}

// A page made of section blocks, e.g. getPage('home'). null when no page has that slug.
// All pages load in one request, so every screen after the first opens without a round trip.
export async function getPage(slug: string): Promise<Page | null> {
  if (!isLive()) return (pages as Record<string, Page>)[slug] ?? null;
  const page = (await getEntries('page')).find((p) => p.fields.slug === slug);
  if (!page) return null;
  const { sys, fields: f } = page;
  // blocks this app version has no component for are skipped, so publishing a new block type can't break older apps
  const sections = list(f.sections).flatMap((e) => SECTIONS[e.sys.contentType?.sys.id ?? '']?.(e) ?? []);
  return { id: sys.id, slug: f.slug, title: f.title, sections };
}

