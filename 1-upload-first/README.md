# ajinkya-bagade-bronze

The second portfolio of Ajinkya Bagade, Team Lead, Marketing at Novel Office (Bengaluru).
A static site: no build step, no framework. Vercel serves the folder as it is.

Live: https://ajinkya-bagade-bronze.vercel.app/

## What's where

```
index.html                     the page (structure only)
assets/css/tokens.css          every colour, font, space and easing token
assets/css/site.css            layout, components and motion
assets/js/content.js           all copy, numbers and lists (edit this to change content)
assets/js/flipbook.js          brochure viewer: books turn on a spine, tri-folds unfold
assets/js/site.js              behaviour: name animation, fly-through, funnel, chapters, side panel
assets/vendor/lenis.*          Lenis 1.1.13 smooth scroll, installed locally (no CDN)
img/                           images used on the page
media/                         Manchester video (webm + mp4) and its poster
brochures/pages/<id>/NN.jpg    pre-rendered brochure pages used by the flipbook (no PDFs are published)
performance-cockpit/           the live Performance Cockpit tool
waypoint/                      the live Waypoint QR studio
emails/                        lifecycle email templates
case-studies/, paid-ads/       ORRA case study and landing page
assets/orra/                   images for the ORRA pages
vercel.json                    headers for Vercel
```

## Editing content

Most changes happen in `assets/js/content.js`:

- `SIGNALS` and `PLANES`: the Six Signals fly-through
- `BROCHURES`: the collateral suite. `kind: "book"` or `kind: "trifold"`
- `CASES`: the case studies that open in the side panel
- `POSTS` and `ELSEWHERE`: WanderWitty and client writing
- `EMAILS`, `ARCHIVE`, `MORE`, `TOOLS`

## Adding a brochure

1. Export each page as a JPEG into `brochures/pages/<id>/01.jpg`, `02.jpg` and so on, in reading order (about 1400px wide for books, 2400px for folds). For a printed booklet, split each sheet into its single pages first.
2. Add an entry to `BROCHURES` in `content.js`. For a tri-fold, page 1 is the outside (cover on the right) and page 2 is the inside.
3. Keep the PDFs out of this repo; the originals sit in `brochure-pdfs-backup` beside it.

## Deploying

The repo is connected to Vercel. Every push to `main` deploys. Framework preset: **Other**, no build command, output directory: the repo root.
