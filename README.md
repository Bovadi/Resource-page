# Resources Portal

A vanilla JavaScript prototype for the BIP Visualized resources portal. Static demo data, no backend.

## Tech Stack

- **HTML5** — structure
- **Tailwind CSS 3.4** + custom design tokens (`tokens.css`)
- **Vanilla JavaScript (ES6+)** — class-based component pattern
- **Vite 6** — dev server and build

## Project Layout

```
/
├── index.html              # App entry
├── script.js               # App controller — loads components, wires events
├── tokens.css              # Design tokens + canonical component CSS (BIP Visualized §STYLE.md)
├── tailwind.css            # Tailwind directives (compiled by Vite/PostCSS)
├── tailwind.config.js      # Canonical palette (STYLE.md §13)
├── STYLE.md                # Visual system reference
├── HANDOFF.md              # Intentional design-system drifts
├── views/                  # Component modules (one folder per component)
│   ├── header/             # Mobile header + profile menu
│   ├── nav-rail/           # Desktop nav rail
│   ├── sidebar/            # Filter sidebar
│   ├── card-grid/          # Resource grid
│   ├── modal/              # Resource detail modal
│   └── sort-menu/          # Toolbar: search + Upgrade + sort
├── public/
│   ├── images/             # App images (logo, card thumbnails)
│   └── views/              # HTML templates loaded at runtime
└── src/
    ├── data/demoData.js    # Static SAMPLE_CARDS
    ├── lib/sort.js         # Sort options + sortCards()
    ├── lib/dom.js          # escapeHtml helper
    └── config/sidebarConfig.js  # Per-tab sidebar layout
```

Each component is self-contained: HTML template in `public/views/<name>/<name>.html`, JS module in `views/<name>/<name>.js`.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
```

Outputs to `dist/`. The repo also auto-deploys on push to `main` via GitHub Actions (`.github/workflows/deploy.yml`) — live at https://bovadi.github.io/Resource-page/.

## Design system

- `STYLE.md` — canonical tokens, components, authoring rules
- `tokens.css` — CSS implementation (CSS custom properties + canonical component styles). Linked **before** Tailwind so utility overrides still work.
- `HANDOFF.md` — three intentional drifts preserved from the v1.1 restyle pass

When in doubt: reach for Tailwind utilities first, then `tokens.css` named utility classes, then ask before introducing a new color or value.
