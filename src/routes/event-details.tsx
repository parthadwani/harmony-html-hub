import { createFileRoute } from "@tanstack/react-router";
import { ReferenceScreen } from "@/components/events/reference-screen";
export const Route = createFileRoute("/event-details")({
  head: () => ({
    meta: [
      { title: "Hack-JECRC 3.0 Registration | JECRC Events Hub" },
      {
        name: "description",
        content: "Explore Hack-JECRC 3.0 tracks, schedule, mentors, and team registration.",
      },
      { property: "og:title", content: "Hack-JECRC 3.0 Registration | JECRC Events Hub" },
      {
        property: "og:description",
        content: "Discover the 36-hour national hackathon at JECRC Sitapura.",
      },
      {
        property: "og:image",
        content:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuAHBZeN9_eMYyo4o1e3VSUE8Hp5XFz18K1CgqVdFpjZyWCkXJN4M6odYAfBY199hrUdWHdKLnNuEcJwI_MhmzgxoE4DxoiM16_vRUwxO3UPHN1aqVeHQYzH9qvygnsGTR8lnA2bM73EDklYA3-9nZMvPPAkLX3RAqjcNjevF9i9Cl7ZkQfJlMIB1uwxHYrWjLL6Pk-p1_nCA4x-XnhvkJxLBhaEvGTukiHP40K0rOf9msXOmCe2SU-l2w",
      },
      {
        name: "twitter:image",
        content:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuAHBZeN9_eMYyo4o1e3VSUE8Hp5XFz18K1CgqVdFpjZyWCkXJN4M6odYAfBY199hrUdWHdKLnNuEcJwI_MhmzgxoE4DxoiM16_vRUwxO3UPHN1aqVeHQYzH9qvygnsGTR8lnA2bM73EDklYA3-9nZMvPPAkLX3RAqjcNjevF9i9Cl7ZkQfJlMIB1uwxHYrWjLL6Pk-p1_nCA4x-XnhvkJxLBhaEvGTukiHP40K0rOf9msXOmCe2SU-l2w",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <ReferenceScreen screen="details" />,
});
