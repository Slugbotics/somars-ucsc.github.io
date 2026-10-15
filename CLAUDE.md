# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Static website for SOMARS (Slugs for the Oversight and Management of Aerial Robotic Systems: the UC Santa Cruz autonomous drone team under Slugbotics), hosted on GitHub Pages and kept up as part of the SUAS competition requirements. Plain HTML/CSS/JS: no build step, no package manager, no framework, no tests. The custom domain comes from `CNAME`.

## Working rules for this repo

- **Keep everything local.** Never push, and never open pull requests, to `main` or any other remote branch. Never commit to `main`. Do all work on a local working branch (currently `site-update`) and leave it unpushed until the user says otherwise in that session.
- **One agent per page.** Work that touches pages is split so each page gets its own agent: `index.html`, `404.html`, and each file in `html/`. An agent edits only its own page and does not run git commands that change state; the coordinator commits. (Worktree isolation branches from `main`, not from the working branch, so agents in worktrees will not see uncommitted or branch-only files; running them in the main checkout on disjoint files has worked better.)
- **Shared files are owned by the coordinating session**, not by page agents: `assets/style.css`, `assets/script.js`, `sitemap.xml`, `robots.txt`, favicon/`<head>` boilerplate, and the navbar/footer markup every page repeats. A page agent that needs a shared change reports it; the coordinator makes it once on every page.
- After merging page work, check the navbar is still the same on every page and that no page references a missing photo.

## Voice and facts

- Copy is plain, warm, first person plural ("we", "our"), short sentences, no marketing hype. **No em dashes or en dashes anywhere** (titles, meta tags, body, HTML comments). Titles use the form `Page | SOMARS`.
- **Say each fact once.** Subteam pages follow one shape: hero line (one sentence), About (one paragraph), four focus cards (two sentences each, no part numbers), an "At a glance." `spec-strip` where the part names live, a meeting card. Word budgets: subteam pages about 200 to 230 visible words, home about 400, team 250, sponsors 190. Part numbers and versions belong in the spec strip, not in prose.
- **Design language:** black base, white type, hairline borders, and the badge gold (`--accent`) reserved for what should pull the eye: eyebrows, the primary button, active nav, stat numbers, and the one highlighted element in each diagram. Static SVG line art explains structure (homepage mission profile and layered stack, sponsors strip, embedded architecture); diagrams over photos sit on a `.diagram-plate`; 760-unit diagrams use `.diagram--labels` for readable type.
- Technical claims come from the team's flight-software repo, cloned at `~/Documents/somars_autonomous` (private; read it locally, never copy IPs, hostnames, logins, coordinates, people's names or crash details onto the site). Current truth: PX4 on a Pixhawk 6X, ROS 2 Humble on a Jetson Orin Nano Super over uXRCE-DDS (no MAVROS/ArduPilot), Arducam Jetvariety AR0234 camera (the repo says "Pivariety"; the team lead says Jetvariety), YOLO11n on TensorRT, Label Studio + Blender synthetic data (no Roboflow), PX4 SITL + Gazebo Harmonic with the "mission gate" (no Isaac Sim). Do not mention the Rust rewrite of the flight stack on the site; the team may go back to Python. Competitions so far: C-UASC 2026 with Caligula I, SUAS 2026 (Tulsa, Sep 2026) with Caligula II; next is C-UASC 2027 (Encino, Jun 2027). No results are published on the site.
- Airframe names "Caligula I" (bare carbon, built for C-UASC 2026) and "Caligula II" (yellow shell, built for SUAS 2026) are placeholders the team will rename; the homepage section ids are `airframe-previous` / `airframe-current` so a rename does not break anchors.

## Preview locally

```sh
python3 -m http.server "${PORT:-8000}"   # from the repo root, then open http://localhost:${PORT:-8000}/
```

Serve from the repo root, not from inside `html/`, because subpages link back with `../`. For screenshots without a browser extension, headless `google-chrome --headless=new --screenshot` works; to capture a mid-page section, use a throwaway same-origin wrapper page that hides every other `body > section` (fragment scrolling does not take effect in headless screenshots). Delete the wrapper afterwards.

## Architecture

- **Layout:** `index.html` and `404.html` at the root; all other pages in `html/`. Shared CSS/JS and brand assets in `assets/`, images in `photos/`. Root pages refer to these as `assets/...`, while pages in `html/` use `../assets/...`. Keep the right prefix when moving markup between levels.
- **No templating.** Every page has its own full copy of the `<head>`, the navbar (wordmark image + Team dropdown listing the four subteam pages) and the footer. Changing the nav, adding a page, or renaming a page means editing all 8 HTML files. The current page's link gets the `active` class.
- **Adding or renaming a page** also means updating `sitemap.xml` (absolute URLs on the custom domain) and the Team dropdown on every page; a subteam page also goes in the list on `html/team.html`.
- **`assets/style.css`** is the only stylesheet, split into `/* ============ NAME ============ */` sections: design tokens in `:root` (accent is the badge gold `--accent`, blue in `--brand-blue`), homepage `panel` sections, subpage `page-hero` / `full-section` / `work-grid`, SVG line animations, a `.reveal` fade-up, and phone rules in the single `@media (max-width: 768px)` block. Reuse tokens and classes instead of adding inline styles. The one sanctioned inline exception is per-page `background-image` / `background-position` on hero and section photo backgrounds.
- **Animation policy** (keep it this way): motion only where it explains something. The four subteam diagrams (`.payload-scene` SVGs on mechanical, embedded, perception, simulations) each run ONE slow SMIL sequence (6 to 14 s, eased with `keySplines`) that tells the subteam's story; nothing else on the page moves except the 0.6 s `.reveal` settle on scroll and hover transitions. Homepage route drawing, pillar icons and subteam icons are static line art. Hairline strokes (1px), low-opacity white, no marching dashes, flashes, glows or grids. `prefers-reduced-motion` disables the reveal in CSS and `script.js` pauses every SVG's SMIL animations.
- **`assets/script.js`** handles the mobile nav toggle (`#navToggle` / `#navLinks`), the `.scrolled` navbar state, and the IntersectionObserver that adds `.reveal` / `.is-visible` to content blocks. Pages depend on those IDs and class names.
- **Homepage hero** is `photos/caligula-ii-flight-field.jpg`, a crop of a DSLR shot of Caligula II in flight from the 10 Sep 2026 field test (source set: `field_photos/`, git-ignored, 35 x 8192px `TXL_*.jpg`). The crop keeps the lower 70% of the frame so the drone sits in the upper third above the headline; the phone rule in the 768px media query just top-anchors it. There is no site video; the team confirmed none existed.
- **Brand assets** in `assets/`: `wordmark-white.png` (+`@2x`) for the navbar, `favicon-32.png` / `favicon-192.png` / `apple-touch-icon.png` / `badge-512.png` cut from the round team badge. Source files live outside the repo.
- **Photos:** web-sized JPEGs (2400px long edge, light unsharp mask, EXIF stripped so phone GPS data never ships). The site deliberately mixes eras: C-UASC 2026 airfield crew (hi-vis), SUAS 2026 Tulsa (tent, night pavilion), the SlugWorks lab, and the 10 Sep 2026 DSLR field test (`field_photos/`). New photo sets supplement that mix; do not swap a whole era out. The night phone shots show the drone too small to use. When a photo stops being referenced by any page, remove it from the branch; it stays in history.

## Privacy

Exported account reports and the raw photo/video/branding zips in the root are git-ignored (`*.csv`, `*.zip`) and must stay out of commits. Raw media is processed into `photos/`; never commit originals.
