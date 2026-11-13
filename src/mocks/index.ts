// Fixtures: the app's data while no Contentful token is set (see src/cms), and the source the seed script uploads.
import pages from './pages.json';
import type { Page, Section } from '../cms';

export const mockPages = pages as Record<string, Page>;

// One block of a mock page, typed, for stories and tests: pageSection('home', 'reviewsSection').reviews
export const pageSection = <T extends Section['type']>(slug: string, type: T) =>
  mockPages[slug].sections.find((s): s is Extract<Section, { type: T }> => s.type === type)!;
