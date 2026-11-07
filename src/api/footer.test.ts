import { getStateFromPath } from '@react-navigation/native';
import footer from './data/footer.json';
import { linking, withCategory } from '../navigation';

// Every footer link must open a real screen (no "#" placeholders), with the params the screen expects.
const items = footer.data.section.flatMap((s) => s.item);
const target = (label: string) => {
  const item = items.find((i) => i.lable === label)!;
  const top = getStateFromPath(withCategory(item.url, item.lable), linking.config)?.routes.at(-1);
  return { name: top?.name, params: top?.params };
};

describe('footer links', () => {
  it('all lead somewhere', () => {
    for (const item of items) {
      expect(item.url).not.toBe('#');
      expect(target(item.lable).name).not.toBe('Home');
    }
  });

  it('open the right screens', () => {
    expect(target('All Gifts')).toEqual({ name: 'Products', params: undefined });
    expect(target('Occasions')).toEqual({ name: 'Occasions', params: undefined });
    expect(target('Best Sellers')).toEqual({ name: 'Products', params: { category: 'Best Sellers' } });
    expect(target('Contact Us').name).toBe('Help');
    expect(target('Shipping')).toEqual({ name: 'Help', params: { topic: 'Delivery' } });
    expect(target('Returns')).toEqual({ name: 'Help', params: { topic: 'Returns' } });
    expect(target('About').name).toBe('About');
    expect(target('Careers').name).toBe('Careers');
  });
});
