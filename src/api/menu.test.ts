import headers from './data/headers.json';
import page from './data/productPage.json';

// The header menu (hamburger drill-downs and desktop mega menu) must list exactly the
// occasions and categories the products are tagged with, in the same order.
const menuLinks = (name: string) =>
  headers.data.find((s) => s.name === name)!.navlink.flatMap((g) => g.navlinks.map((l) => l.lable));

describe('header menu data', () => {
  it('lists every occasion', () => {
    expect(menuLinks('Occasions')).toEqual(page.occasions.map((o) => o.name));
  });

  it('lists every category', () => {
    expect(menuLinks('Categories')).toEqual(page.categories.map((c) => c.name));
  });

  it('uses unique link ids', () => {
    const ids = headers.data.flatMap((s) => s.navlink.flatMap((g) => g.navlinks.map((l) => l.id)));
    expect(new Set(ids).size).toBe(ids.length);
  });
});
