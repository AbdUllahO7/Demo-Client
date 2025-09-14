// app/[person]/page.tsx
import { notFound } from 'next/navigation';
import { getPersonProfile, getAvailablePersonSlugs } from '@/const/personProfiles';
import PersonPageClient from '@/components/PersonPage/PersonPageClient';

interface PersonPageProps {
  params: {
    person: string;
  };
}

// Server Component - handles static generation
export default function PersonPage({ params }: PersonPageProps) {
  const availableSlugs = getAvailablePersonSlugs();
  
  // Check if the person exists
  if (!availableSlugs.includes(params?.person)) {
    notFound();
  }

  const personData = getPersonProfile(params.person);

  if (!personData) {
    notFound();
  }

  // Pass data to client component
  return <PersonPageClient slug={params.person} personData={personData} />;
}

// Generate static params (Server-side only)
export async function generateStaticParams() {
  const slugs = getAvailablePersonSlugs();
  
  return slugs.map((person) => ({
    person,
  }));
}