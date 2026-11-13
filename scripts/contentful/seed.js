/* eslint-env node */
// Creates the content model in the Contentful space and fills it with the app's current content (src/mocks).
//   npm run cms:seed                         model + content (overwrites entries with the same IDs: run it once)
//   npm run cms:seed -- --content-model-only update the content types only, leave editors' content alone
// Needs CONTENTFUL_MANAGEMENT_TOKEN in .env. Uploads through the official CLI (`contentful space import`).
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { spawnSync } = require('child_process');
const { contentTypes } = require('./model');
const config = require('../../src/cms/config.json');

const mock = (name) => require(`../../src/mocks/${name}.json`);

function buildSeed() {
  const L = config.locale;
  const entries = [];
  const assets = new Map();
  const link = (id, linkType = 'Entry') => ({ sys: { type: 'Link', linkType, id } });
  const blank = (v) => v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0);

  const add = (contentType, id, fields) => {
    const localized = {};
    for (const [k, v] of Object.entries(fields)) if (!blank(v)) localized[k] = { [L]: v };
    entries.push({ sys: { id, type: 'Entry', publishedVersion: 1, contentType: { sys: { type: 'Link', linkType: 'ContentType', id: contentType } } }, fields: localized });
    return link(id);
  };
  // one asset per distinct URL; Contentful downloads the file from it
  const asset = (url, title) => {
    if (!url) return undefined;
    const id = `asset-${crypto.createHash('md5').update(url).digest('hex').slice(0, 16)}`;
    const fileName = path.basename(new URL(url).pathname);
    const contentType = /\.mp4$/.test(fileName) ? 'video/mp4' : /\.png$/.test(fileName) ? 'image/png' : 'image/jpeg';
    if (!assets.has(id)) assets.set(id, { sys: { id, type: 'Asset', publishedVersion: 1 }, fields: { title: { [L]: title }, file: { [L]: { url, fileName, contentType } } } });
    return link(id, 'Asset');
  };

  // navigation
  const linkEntry = (l) => add('link', l.id, { label: l.lable, url: l.url });
  const headerMenu = mock('headers').data.map((m) =>
    add('menuItem', m.id, {
      name: m.name,
      layout: m.grid,
      heading: m.menuDescription.heading,
      description: m.menuDescription.description,
      image: asset(m.img?.url, m.name),
      linkGroups: m.navlink.map((g) => add('linkGroup', g.id, { links: g.navlinks.map(linkEntry) })),
    }),
  );
  const footer = mock('footer').data;
  add('navigation', 'navigation', {
    title: 'Main navigation',
    headerMenu,
    footerColumns: footer.section.map((s) => add('linkGroup', s.id, { heading: s.heading, links: s.item.map(linkEntry) })),
    newsletter: footer.newsletter,
  });

  // catalog
  const catalog = mock('productPage');
  const categories = Object.fromEntries(catalog.categories.map((c) => [c.id, add('category', `category-${c.id}`, { categoryId: c.id, name: c.name })]));
  const occasions = Object.fromEntries(catalog.occasions.map((o) => [o.id, add('occasion', `occasion-${o.id}`, { occasionId: o.id, name: o.name })]));
  for (const p of catalog.data) {
    add('product', `product-${p.id}`, {
      productId: p.id,
      name: p.name,
      price: Number(p.price.replace(/[^\d.]/g, '')), // "INR 1,499" → 1499
      image: asset(p.img, p.name),
      category: categories[p.categoryId],
      occasions: p.occasionIds.map((id) => occasions[id]),
      gender: p.gender,
      rating: p.Raiting,
      badge: p.type,
      description: p.description,
      highlights: p.highlights,
    });
  }

  // pages and their blocks
  const SECTIONS = {
    heroSection: (s) => ({ headline: s.headline, video: asset(s.video, s.headline) }),
    categoryCardsSection: (s) => ({
      title: s.title,
      cards: s.cards.map((c) =>
        add('categoryCard', c.id, {
          title: c.title,
          description: c.description,
          variant: c.variant,
          image: asset(c.img?.url, c.title),
          buttonLabel: c.button?.name,
          buttonColor: c.button?.color,
          buttonTextColor: c.button?.textColor,
        }),
      ),
    }),
    reviewsSection: (s) => ({
      heading: s.heading,
      subheading: s.subheading,
      reviews: s.reviews.map((r, i) => add('review', `${s.id}-${i + 1}`, { name: r.name, rating: r.rating, title: r.title, message: r.message, avatar: asset(r.avatar, r.name) })),
    }),
    featuresSection: (s) => ({ title: s.title, features: s.features.map((f, i) => add('infoCard', `${s.id}-${i + 1}`, { title: f.label, icon: f.icon })) }),
    helpSection: (s) => ({
      title: s.title,
      subtitle: s.subtitle,
      faqs: s.faqs.map((f) => add('faq', f.id, { question: f.question, answer: f.answer, topic: f.topic })),
      contactEmail: s.contact.email,
      contactPhone: s.contact.phone,
      contactHours: s.contact.hours,
    }),
    aboutSection: (s) => ({
      eyebrow: s.eyebrow,
      heading: s.heading,
      story: s.story.join('\n\n'),
      values: s.values.map((v) => add('infoCard', v.id, { title: v.title, text: v.text })),
    }),
    careersSection: (s) => ({
      eyebrow: s.eyebrow,
      heading: s.heading,
      intro: s.intro,
      email: s.email,
      roles: s.roles.map((r) => add('jobRole', r.id, { title: r.title, team: r.team, location: r.location, employmentType: r.type })),
    }),
    appSection: (s) => ({ component: s.component }),
  };
  // every screen's page, its blocks in the order the app shows them
  for (const p of Object.values(mock('pages'))) {
    add('page', p.id, { title: p.title, slug: p.slug, sections: p.sections.map((s) => add(s.type, s.id, SECTIONS[s.type](s))) });
  }

  return { contentTypes, entries, assets: [...assets.values()] };
}

module.exports = { buildSeed };

if (require.main === module) {
  try {
    process.loadEnvFile();
  } catch {}
  const token = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
  if (!token) {
    console.error('Set CONTENTFUL_MANAGEMENT_TOKEN in .env (Contentful → Settings → CMA tokens). See .env.example.');
    process.exit(1);
  }
  const file = path.join(os.tmpdir(), 'presentbox-contentful-seed.json');
  fs.writeFileSync(file, JSON.stringify(buildSeed(), null, 2));
  const errorLog = path.join(os.tmpdir(), 'presentbox-contentful-import-errors.json'); // keeps the log out of the repo
  const args = ['--yes', 'contentful-cli', 'space', 'import', '--space-id', config.spaceId, '--environment-id', config.environment, '--management-token', token, '--content-file', file, '--error-log-file', errorLog, ...process.argv.slice(2)];
  const { status } = spawnSync('npx', args, { stdio: 'inherit', shell: process.platform === 'win32' });
  process.exit(status ?? 1);
}
