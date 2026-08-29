# Portfolio Redesign — Design Spec

- **Date:** 2026-08-29
- **Repo:** `omeryusufsorhun/omeryusufsorhun.github.io` (GitHub Pages user site)
- **Status:** approved by owner, pending implementation plan

## 1. Goal

Replace the current site — an HTTrack-scraped Bootstrap 4 template with jQuery,
Owl Carousel, a Tawk.to chat widget and a 16,783-line `main.css` — with a
purpose-built single page in a neo-brutalist terminal idiom.

Two problems drive the rewrite:

1. **The content is stale.** The live site's most recent role is Trendyol and its
   newest project is from 2023. The current Insider role does not appear at all.
2. **The design reads as a template.** It signals "downloaded", not "made".

Success means a visitor learns who the owner is, what he does, and where his work
lives, in one screen — without the page selling anything at him.

## 2. Non-goals

- No projects section. The three projects on the old site (Instagram Clone, React
  Blog, Social Media App) are 2022–23 tutorial-grade clones and weaken a QA
  engineer's page. A projects section returns only when there is real work to show.
- No phone number or personal email rendered on the page. Public pages get scraped
  by spam harvesters. Contact goes through the form and LinkedIn.
- No blog engine, CMS, comments, or newsletter.
- No i18n. The site is English-only.

## 3. Visual direction

Neo-brutalist, **terminal dialect**: monospace throughout, hairline rules, zero
border-radius, no shadows, no gradients, one accent colour used sparingly.

The design was chosen against three rejected alternatives (yellow poster, editorial
zine, colour-block). The governing constraint, stated by the owner, is that the page
must not read as a billboard: **no company name in the hero, no stat tiles, no
button stacks.**

### Palette

| Token | Dark (default) | Light |
| --- | --- | --- |
| Background | `#0B0B0B` | `#FBFAF6` |
| Body text | `#C9C9C9` | `#1A1A1A` |
| Heading text | `#FFFFFF` | `#000000` |
| Hairline rule | `#232323` | `#DEDCD2` |
| Muted / meta | `#5A5A5A` | `#8A8A82` |
| Accent | `#00FF9C` | `#1A47FF` |

**Accent budget: at most three uses per viewport** — the caret, the active nav
item, and one or two keywords. The accent is never a background fill or a box.
This rule is the single most important guard against the billboard failure mode.

### Type

- One family: `ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace`.
  No downloaded webfont, so there is no font-loading flash and no network cost.
- One deliberate size jump: the name at ~31px, everything else between 10 and 12px.
  Hierarchy comes from whitespace and rules, not from size escalation.
- Lowercase for chrome (nav, labels, links), sentence case for prose.

### Layout

Single column, one page, max content width ~760px. Sections separated by a 1px
rule and a small uppercase label. Sticky top bar carrying the nav and the theme
switch.

## 4. Page structure

```
top bar     omeryusufsorhun.github.io          experience  stack  notes  contact  [dark|light]
identity    ömer yusuf sorhun ▋
            software qa engineer · istanbul
            one-sentence description of the work
            cv.pdf · github · linkedin
experience  dated table, most recent first
            + education as a single closing row
stack       four labelled groups
notes       markdown-driven list (hidden when empty)
contact     form + github/linkedin
```

### Identity

Name, one role line, one sentence, three plain links. No employer name, no metrics,
no buttons. The employer first appears as an ordinary row in the experience table.

### Experience

| Period | Org | Role |
| --- | --- | --- |
| 2026.03 — | Insider | Software QA Engineer |
| 2023.07 – 2026.02 | Trendyol | Software Developer in Test |
| 2023.01 – 2023.06 | kolayfirsat.com | Manual Tester |
| 2022.08 – 2022.12 | sarjagi.com | Front-End Developer |

Content is taken from the owner's current CV, `cv_omeryusufsorhun.pdf` (June 2026),
which is copied into the repo as `public/cv.pdf` during implementation. Two
owner-directed edits apply:

- **Badiworks is omitted.** The CV combines `badiworks.com, sarjagi.com` into one
  row; the row is kept as sarjagi.com only.
- Education (BSc Computer Engineering, Istanbul University-Cerrahpaşa, 2019–2023,
  plus the istecenter cyber-security internship) is a single closing row of the
  same table, not a separate section.

Note: text extracted from the PDF loses `fi`/`ffi` ligatures ("Conuence",
"notications", "trac"). All copy must be proofread against the rendered PDF before
it ships.

### Stack

Four groups, rendered as plain wrapped token lists:

- **Languages** — Java, Python, JavaScript, Dart, Golang, C#
- **Test** — Selenium WebDriver, Playwright, Cypress, Appium, Cucumber/Gherkin, TestNG, JUnit, JMeter, Pact, BrowserStack
- **CI & tooling** — Git, GitLab CI/CD, Maven, Allure, Grafana, Postman, Swagger, JIRA, Confluence
- **Web & data** — React, Vue, Svelte, Node.js, Flutter, Tailwind, MongoDB, BigQuery, Neo4j

### Notes

Backed by `content/notes/*.md`. **The section is hidden entirely when no notes
exist.** There are currently zero notes; an empty "Notes" heading is a worse signal
than no section at all. Adding the first `.md` file makes the section appear with
no code change.

### Contact

A form posting through the existing EmailJS account (`service_sjuqhqv` /
`template_rt05gzl`, public key `4y53nE57BGeNERzC4`), so no new third-party account
is needed. A hidden honeypot field filters naive bots. Below the form: GitHub and
LinkedIn links only.

## 5. Theme switch

- Dark is the default **unconditionally**. `prefers-color-scheme` is deliberately
  ignored — an explicit owner decision.
- The choice persists in `localStorage` under a single key.
- A small synchronous script in `<head>` applies the stored theme before first
  paint, so reloads never flash the wrong background.
- Themes are expressed as CSS custom properties on `<html data-theme>`; no
  component reads a colour literal.

## 6. Data and content sources

| Content | Source |
| --- | --- |
| Experience rows | `src/data/experience.ts` |
| Stack groups | `src/data/stack.ts` |
| Identity / links | `src/data/profile.ts` |
| Notes | `content/notes/*.md`, read at build time |
| CV | `public/cv.pdf`, linked as `/cv.pdf` |

No display copy is inlined in JSX. Editing the site means editing data, not markup.

## 7. Technical setup

React 19 + Vite + TypeScript, as chosen by the owner.

- **Routing:** none. One page, anchor links only. No 404 fallback needed.
- **Base path:** `/` — this is a user site served from the domain root.
- **Deploy:** GitHub Actions. Push to `main` → install → test → build → publish
  `dist` via `actions/deploy-pages`. A `.nojekyll` marker ships in `public/`.
- **Required manual step:** the repository's Pages source is currently
  `build_type: legacy` with `source: {branch: main, path: /}`. It must be switched
  to **GitHub Actions** before the first deploy, otherwise Pages keeps serving the
  repo root and the new build never appears. This is a live-site setting and
  requires the owner's explicit go-ahead at deploy time.

### Removed

jQuery, Bootstrap, Owl Carousel, the Tawk.to chat widget, the dead
`UA-110940506-1` Universal Analytics tag (the property shut down in 2023), the
HTTrack artefacts, `app/css/main.css` (16,783 lines), the old projects section, and
the phone number.

### Kept

The GA4 tag `G-RGZTGWEM57`.

## 8. Accessibility and performance

- Both themes meet WCAG AA contrast for body text; the accent is never the sole
  carrier of meaning.
- Visible focus rings on every interactive element, driven by the accent token.
- The theme switch is a real `<button>` with `aria-pressed`; the nav is a real
  `<nav>`; the experience table is a real `<table>` with a caption.
- No webfonts, no carousel, no chat widget: the page is a few tens of KB and
  renders on first paint.

## 9. Testing

The owner is a QA engineer; the site carries a proportionate test layer.

**Vitest + Testing Library**

- The theme switch toggles `data-theme` and persists the choice across a remount.
- The head script applies a stored theme before render (no flash of default).
- Experience rows render most-recent-first from the data module.
- The notes section is absent when the note list is empty, and present when it is not.
- The contact form rejects an invalid email and refuses to submit when the honeypot
  field is filled.

**Playwright — one smoke test**

- The page loads, the identity block is visible, and `/cv.pdf` responds 200.

Both run in the Actions workflow before the build step; a failure blocks the deploy.

## 10. Open items

None blocking. Deferred by decision: a projects section (returns when there is real
work to show) and the first note (the section stays hidden until then).
