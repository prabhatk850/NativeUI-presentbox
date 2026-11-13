// Contentful content model for PresentBox, in the format `contentful space import` reads.
// src/cms maps these entries to the app's shapes; src/cms/cms.test.ts checks the two stay in step.

const field = (id, name, type, ...extras) => Object.assign({ id, name, type, localized: false, required: false, validations: [], disabled: false, omitted: false }, ...extras);
const required = { required: true };
const unique = { validations: [{ unique: true }] };
const oneOf = (values) => ({ validations: [{ in: values }] });
const range = (min, max) => ({ validations: [{ range: max === undefined ? { min } : { min, max } }] });

const symbol = (id, name, ...extras) => field(id, name, 'Symbol', ...extras);
const text = (id, name, ...extras) => field(id, name, 'Text', ...extras);
const integer = (id, name, ...extras) => field(id, name, 'Integer', ...extras);
const number = (id, name, ...extras) => field(id, name, 'Number', ...extras);
const boolean = (id, name, ...extras) => field(id, name, 'Boolean', ...extras);
const symbols = (id, name) => field(id, name, 'Array', { items: { type: 'Symbol', validations: [] } });
const media = (id, name, kind, ...extras) => field(id, name, 'Link', { linkType: 'Asset', validations: [{ linkMimetypeGroup: [kind] }] }, ...extras);
const entry = (id, name, types, ...extras) => field(id, name, 'Link', { linkType: 'Entry', validations: [{ linkContentType: types }] }, ...extras);
const entries = (id, name, types) => field(id, name, 'Array', { items: { type: 'Link', linkType: 'Entry', validations: [{ linkContentType: types }] } });
const url = (id, name) => symbol(id, name, required, { validations: [{ regexp: { pattern: '^(/|https?://|mailto:)' } }] });

const type = (id, name, displayField, description, fields) => ({ sys: { id, type: 'ContentType', publishedVersion: 1 }, name, displayField, description, fields });

// icon names editors can pick for feature tiles; each must be exported by src/theme/icons.ts
const FEATURE_ICONS = ['ShoppingBag', 'Truck', 'Headphones', 'RefreshCcw', 'Gift', 'Heart', 'Sparkles', 'Star', 'Package', 'Clock', 'Wallet', 'LifeBuoy', 'CircleCheck', 'TrendingUp'];
// page blocks; each needs a component in src/sections and a mapper in src/cms
const SECTION_TYPES = ['heroSection', 'categoryCardsSection', 'reviewsSection', 'featuresSection', 'helpSection', 'aboutSection', 'careersSection', 'appSection'];
// built-in screens an "App screen" block can place; each is in APP_BLOCKS in src/sections
const APP_COMPONENTS = ['products', 'occasions', 'cart', 'profile', 'orders', 'paymentMethods'];

const contentTypes = [
  // navigation
  type('link', 'Link', 'label', 'A menu or footer link. URLs are app paths like /products or /help?topic=Returns.', [symbol('label', 'Label', required), url('url', 'URL')]),
  type('linkGroup', 'Link group', 'heading', 'A column of links in the header menu or footer.', [symbol('heading', 'Heading'), entries('links', 'Links', ['link'])]),
  type('menuItem', 'Header menu item', 'name', 'One entry of the header mega menu.', [
    symbol('name', 'Name', required),
    symbol('layout', 'Layout', required, oneOf(['heading_menu_item_image', 'heading_image_image', 'menu_item_menu_item_menu_item'])),
    symbol('heading', 'Heading'),
    text('description', 'Description'),
    media('image', 'Image', 'image'),
    entries('linkGroups', 'Link columns', ['linkGroup']),
  ]),
  type('navigation', 'Navigation', 'title', 'Header menu and footer. The app reads the first published entry.', [
    symbol('title', 'Internal name', required),
    entries('headerMenu', 'Header menu', ['menuItem']),
    entries('footerColumns', 'Footer columns', ['linkGroup']),
    boolean('newsletter', 'Show newsletter signup'),
  ]),

  // catalog: numeric IDs because cart, orders and /products/:id links use them
  type('category', 'Category', 'name', 'Product category, shown as a filter tab.', [integer('categoryId', 'Category ID', required, unique), symbol('name', 'Name', required)]),
  type('occasion', 'Occasion', 'name', 'Gifting occasion, used by filters and the Occasions page.', [integer('occasionId', 'Occasion ID', required, unique), symbol('name', 'Name', required)]),
  type('product', 'Product', 'name', 'A gift in the catalog.', [
    integer('productId', 'Product ID', required, unique),
    symbol('name', 'Name', required),
    integer('price', 'Price (INR)', required, range(0)),
    media('image', 'Image', 'image', required),
    entry('category', 'Category', ['category'], required),
    entries('occasions', 'Occasions', ['occasion']),
    symbol('gender', 'For', oneOf(['All', 'Men', 'Women', 'Kids'])),
    number('rating', 'Rating', range(0, 5)),
    symbol('badge', 'Badge', oneOf(['Hot', 'New', 'Sale'])),
    text('description', 'Description'),
    symbols('highlights', 'Highlights'),
  ]),

  // building blocks used inside sections and pages
  type('categoryCard', 'Category card', 'title', 'Card that opens the products page on its category.', [
    symbol('title', 'Title', required),
    symbol('description', 'Description'),
    symbol('variant', 'Size', required, oneOf(['big', 'rectangle', 'square'])),
    media('image', 'Image', 'image'),
    symbol('buttonLabel', 'Button label'),
    symbol('buttonColor', 'Button color'),
    symbol('buttonTextColor', 'Button text color'),
  ]),
  type('review', 'Review', 'name', 'Customer review.', [
    symbol('name', 'Name', required),
    integer('rating', 'Stars', required, range(1, 5)),
    symbol('title', 'Title', required),
    text('message', 'Message', required),
    media('avatar', 'Avatar', 'image'),
  ]),
  type('infoCard', 'Info card', 'title', 'Short titled text with an optional icon: features, company values.', [
    symbol('title', 'Title', required),
    text('text', 'Text'),
    symbol('icon', 'Icon', oneOf(FEATURE_ICONS)),
  ]),

  // page blocks
  type('heroSection', 'Section: Hero video', 'headline', 'Full-screen looping video with a headline.', [symbol('headline', 'Headline', required), media('video', 'Video', 'video')]),
  type('categoryCardsSection', 'Section: Category cards', 'title', 'Grid of category cards.', [symbol('title', 'Title', required), entries('cards', 'Cards', ['categoryCard'])]),
  type('reviewsSection', 'Section: Reviews', 'heading', 'Carousel of customer reviews.', [symbol('heading', 'Heading', required), symbol('subheading', 'Subheading'), entries('reviews', 'Reviews', ['review'])]),
  type('featuresSection', 'Section: Features', 'title', 'Row of icon tiles.', [symbol('title', 'Title', required), entries('features', 'Features', ['infoCard'])]),
  type('helpSection', 'Section: Help Center', 'title', 'FAQs filterable by topic, plus support contacts. Footer links open a topic: /help?topic=Returns.', [
    symbol('title', 'Title', required),
    symbol('subtitle', 'Subtitle'),
    entries('faqs', 'FAQs', ['faq']),
    symbol('contactEmail', 'Support email'),
    symbol('contactPhone', 'Support phone'),
    symbol('contactHours', 'Support hours'),
  ]),
  type('aboutSection', 'Section: About', 'heading', 'Company story and values.', [
    symbol('eyebrow', 'Eyebrow'),
    symbol('heading', 'Heading', required),
    text('story', 'Story (paragraphs separated by a blank line)'),
    entries('values', 'Values', ['infoCard']),
  ]),
  type('careersSection', 'Section: Careers', 'heading', 'Careers intro and open roles. "Apply" emails the address below.', [
    symbol('eyebrow', 'Eyebrow'),
    symbol('heading', 'Heading', required),
    text('intro', 'Intro'),
    symbol('email', 'Applications email'),
    entries('roles', 'Open roles', ['jobRole']),
  ]),
  type('appSection', 'Section: App screen', 'component', 'A built-in screen (product catalog, cart, orders, …). Its data comes from the catalog and the shopper’s account.', [
    symbol('component', 'Screen', required, oneOf(APP_COMPONENTS)),
  ]),
  type('page', 'Page', 'title', 'One app screen, built from section blocks in order. Slug = the URL path: "home" for /, "products", "payment-methods", …', [
    symbol('title', 'Title', required),
    symbol('slug', 'Slug', required, unique),
    entries('sections', 'Sections', SECTION_TYPES),
  ]),

  // entries used by the company blocks
  type('faq', 'FAQ', 'question', 'Help Center question.', [
    symbol('question', 'Question', required),
    text('answer', 'Answer', required),
    symbol('topic', 'Topic', required, oneOf(['Orders', 'Delivery', 'Returns', 'Payments', 'Gifting'])),
  ]),
  type('jobRole', 'Job role', 'title', 'Open position on the Careers page.', [
    symbol('title', 'Title', required),
    symbol('team', 'Team'),
    symbol('location', 'Location'),
    symbol('employmentType', 'Type', oneOf(['Full-time', 'Part-time', 'Contract', 'Internship'])),
  ]),
];

module.exports = { contentTypes };
