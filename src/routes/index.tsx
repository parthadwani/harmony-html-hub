import { createFileRoute } from "@tanstack/react-router";
import { ReferenceScreen } from '@/components/events/reference-screen';
export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: 'Explore Events | JECRC Events Hub' },
    { name: 'description', content: 'Discover JECRC campus hackathons, cultural festivals, workshops, and student events.' },
    { property: 'og:title', content: 'Explore Events | JECRC Events Hub' },
    { property: 'og:description', content: 'Discover Renaissance 2025 and upcoming JECRC campus events.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { property: 'og:image', content: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqeM5dTkt5a-loIUtttzJnkgYd7ox6ToLIxf2KIP0exFeYkMwjI0E3bSO7w_g9i4T5ZvHxYmPp4ANVs4p_yPx1GNr-h3u_86_vPJm5MYl_OnUkV-6oa4L08ucyHFnJlBcOdDNBCr8wevd6sqhY_N96uI1jmhaszwM_wix0GR7rciLWp8rfEeKPQYFrmVhswgR1dtxeu8mfACR2KpefIF_HXW9Vy2Q7gm5trE1Bjv4bzfleGbZdIrHgqg' },
    { name: 'twitter:image', content: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqeM5dTkt5a-loIUtttzJnkgYd7ox6ToLIxf2KIP0exFeYkMwjI0E3bSO7w_g9i4T5ZvHxYmPp4ANVs4p_yPx1GNr-h3u_86_vPJm5MYl_OnUkV-6oa4L08ucyHFnJlBcOdDNBCr8wevd6sqhY_N96uI1jmhaszwM_wix0GR7rciLWp8rfEeKPQYFrmVhswgR1dtxeu8mfACR2KpefIF_HXW9Vy2Q7gm5trE1Bjv4bzfleGbZdIrHgqg' },
  ] }),
  component: () => <ReferenceScreen screen="explore" />,
});
