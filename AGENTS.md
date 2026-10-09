<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## App architecture
- Render the supplied HTML through a shared React adapter with semantic theme tokens and design-system buttons to preserve reference fidelity across pages.
- Give each distinct screen its own TanStack file route so navigation and page metadata remain independent.
- Keep campus actions as explicitly labeled frontend previews until a campus service is connected; never imply real registrations, messages, or admission have been sent.
- Generate pass and certificate PDFs client-side on demand to avoid server-only dependencies in the edge runtime.
