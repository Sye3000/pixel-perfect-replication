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

- Keep the supplied CampusOne SVG primitives in CampusOneArtwork and animate only enclosing groups in the reusable LogoAssemble component, so artwork geometry remains unchanged.
- Keep intro timing and replay state inside LogoAssemble; the dashboard uses its completion callback and an assembled instance so application tools remain independent of the intro.
