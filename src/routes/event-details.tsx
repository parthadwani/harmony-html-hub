import { createFileRoute } from '@tanstack/react-router';
import { ReferenceScreen } from '@/components/events/reference-screen';
export const Route = createFileRoute('/event-details')({
  head: () => ({ meta: [
    { title: 'Hack-JECRC 3.0 Registration | JECRC Events Hub' },
    { name: 'description', content: 'Explore Hack-JECRC 3.0 tracks, schedule, mentors, and team registration.' },
    { property: 'og:title', content: 'Hack-JECRC 3.0 Registration | JECRC Events Hub' },
    { property: 'og:description', content: 'Discover the 36-hour national hackathon at JECRC Sitapura.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: () => <ReferenceScreen screen="details" />,
});