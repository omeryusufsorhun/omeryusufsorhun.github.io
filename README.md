# omeryusufsorhun.github.io

Personal site of Ömer Yusuf Sorhun — Software QA Engineer.

React + Vite + TypeScript, deployed to GitHub Pages from `main` by GitHub Actions.

## Commands

    npm install       install dependencies
    npm run dev       local dev server
    npm run build     build into dist/
    npm run preview   serve the built site locally

## Editing content

- Experience, stack and profile data: `src/data/`
- Notes: drop a markdown file into `content/notes/` (frontmatter: `title`, `date`)
- CV: replace `public/cv.pdf`

## Note on the npm registry

This repo pins the public npm registry in `.npmrc`. If your shell exports
`npm_config_registry` pointing at a private mirror, that env var wins over the
file — prefix installs with `npm_config_registry=https://registry.npmjs.org/`.
