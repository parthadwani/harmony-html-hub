import { createFileRoute } from '@tanstack/react-router';
import { ReferenceScreen } from '@/components/events/reference-screen';
export const Route = createFileRoute('/my-passes')({
  head: () => ({ meta: [
    { title: 'My Passes & Schedule | JECRC Events Hub' },
    { name: 'description', content: 'View your JECRC campus event passes, activity credits, schedule, and certificates.' },
    { property: 'og:title', content: 'My Passes & Schedule | JECRC Events Hub' },
    { property: 'og:description', content: 'Your JECRC digital event credentials and personal campus schedule.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: () => <ReferenceScreen screen="passes" />,
});