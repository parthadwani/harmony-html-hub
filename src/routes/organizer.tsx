import { createFileRoute } from '@tanstack/react-router';
import { ReferenceScreen } from '@/components/events/reference-screen';
export const Route = createFileRoute('/organizer')({
  head: () => ({ meta: [
    { title: 'Organizer Management Studio | JECRC Events Hub' },
    { name: 'description', content: 'Preview JECRC event administration, registrations, check-ins, and campus notices.' },
    { property: 'og:title', content: 'Organizer Management Studio | JECRC Events Hub' },
    { property: 'og:description', content: 'JECRC student club event management and organizer tools.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: () => <ReferenceScreen screen="organizer" />,
});