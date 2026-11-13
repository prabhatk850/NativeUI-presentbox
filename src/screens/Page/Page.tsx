import React, { useEffect, useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import MainLayout from '../../components/templates/MainLayout/MainLayout';
import Sections, { opensFullBleed } from '../../sections';
import { getPage, type Page as PageContent } from '../../cms';
import { linking, type RootStackParamList } from '../../app/navigation';

// Every screen except the product sheet: the Contentful page whose slug is the route's URL path
// ("home" for /, "products", "payment-methods", …), rendered block by block in the editors' order.
export const slugFor = (routeName: string) => {
  const path = (linking.config?.screens as Record<string, unknown> | undefined)?.[routeName];
  return (typeof path === 'string' && path) || 'home';
};

function Page({ route }: NativeStackScreenProps<RootStackParamList>) {
  const slug = slugFor(route.name);
  const [page, setPage] = useState<PageContent | null>(null);

  useEffect(() => {
    getPage(slug)
      .then((p) => (p ? setPage(p) : console.warn(`No Contentful page with slug "${slug}"`)))
      .catch((error) => console.error(`Error fetching page "${slug}":`, error));
  }, [slug]);

  return <MainLayout overlay={!!page && opensFullBleed(page.sections)}>{page && <Sections sections={page.sections} />}</MainLayout>;
}

export default Page;
