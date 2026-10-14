# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Static website for SOMARS (UC Santa Cruz autonomous drone team under Slugbotics), hosted on GitHub Pages and kept up as part of the SUAS competition requirements. It is plain HTML/CSS/JS: no build step, no package manager, no framework, no tests. The custom domain comes from `CNAME`.

## Working rules for this repo

- **Keep everything local.** Never push, and never open pull requests, to `main` or any other remote branch. Never commit to `main`. Do all work on a local working branch (for example `git switch -c <topic>`) and leave it unpushed until the user says otherwise in that session.
- **One agent per page.** Work that touches pages is split up so that each page gets its own agent (Agent tool, ideally with `isolation: "worktree"`): `index.html`, `404.html`, and each file in `html/` (`team`, `mechanical`, `embedded`, `perception`, `simulations`, `sponsors`). One agent edits only its own page.
- **Shared files are owned by the coordinating session**, not by page agents: `assets/style.css`, `assets/script.js`, `sitemap.xml`, `robots.txt`, and the navbar/footer markup that every page repeats. If a page agent needs a shared change, it reports back what it needs, and the coordinator makes that change once and applies it to every page. This keeps parallel agents from conflicting.
- After merging page agents' work into the local working branch, check that the navbar is still the same on every page.

## Preview locally

```sh
python3 -m http.server "${PORT:-8000}"   # run from the repo root, then open http://localhost:${PORT:-8000}/
```

Serve from the repo root, not from inside `html/`, because subpages link back with `../`.

## Architecture

- **Layout:** `index.html` and `404.html` are at the root. All other pages are in `html/`. Shared CSS, JS and favicons are in `assets/`, and all images are in `photos/`. Root pages refer to these as `assets/...` and `photos/...`, while pages in `html/` use `../assets/...` and `../photos/...`. Keep the right relative prefix when you move markup between levels.
- **No templating.** Every page has its own full copy of the `<head>` (meta, Open Graph, Inter from Google Fonts, favicons), the navbar (with the Team dropdown that lists the four subteam pages) and the footer. Changing the nav, adding a page, or renaming a page means editing all 8 HTML files. The current page's link gets the `active` class.
- **Adding or renaming a page** also means updating `sitemap.xml` (it uses absolute URLs on the custom domain) and the Team dropdown on every page. If it is a subteam page, also add it to the subteam list on `html/team.html`.
- **`assets/style.css`** is the only stylesheet. It is split into sections with `/* ============ NAME ============ */` banners: design tokens in `:root` at the top, then homepage `panel` sections, subpage `page-hero` / `page-section` / `work-grid`, and pure-CSS/SVG animations (waypoints, gears, payload drop, and so on). Reuse the existing tokens and classes instead of adding inline styles. The one exception is per-page `background-image` / `background-position` on hero `photo` divs, which are set inline on purpose.
- **`assets/script.js`** handles only the mobile nav toggle (`#navToggle` / `#navLinks`) and the `.scrolled` navbar state. Pages depend on those IDs and class names.
- Visual style is monochrome (black theme). Subteam pages share one hero-plus-sections layout.

## Privacy

Exported account reports, such as the Cloudflare security-insights CSV currently untracked in the root, must not be committed.
