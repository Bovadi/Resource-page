# HANDOFF.md

> Engineering-facing notes for the Resource-page prototype.
> Pair with `STYLE.md` (visual system) and `tokens.css` (CSS implementation).

---

## Known design-system drifts (preserved intentionally)

These three patterns diverge from STYLE.md but are kept on purpose as part of the
**v1.1 restyle pass** (commit `4c5a772`, May 2026). Each was surfaced during the
two-pass audit and explicitly approved for preservation. Do not silently align
them during future restyle passes — discuss first.

### 1. Modal panel — non-canonical dimensions

- **Current**: `rounded-lg` (8px) + `max-w-2xl` (672px) + `shadow-2xl`
- **Canonical (STYLE.md §10.3)**: `rounded-2xl` (12px) + `w-[520px] max-w-[95vw]` + `shadow-3xl`
- **Reason**: visually different pattern; aligning would be a redesign, not a restyle.
- **File**: `public/views/modal/modal.html`

### 2. Toolbar search bar — not yet in STYLE.md §10

- **Pattern**: `bg-white/80 backdrop-blur-sm rounded-full pl-10 pr-4 py-2 shadow-sm border border-gray-200/60`
- **Status**: matches the toolbar pill aesthetic of Sort/Upgrade buttons; intentionally
  distinct from the canonical form input (`§8.2`).
- **Action**: formalize as a `§10.13 Toolbar search` component in STYLE.md when convenient.
- **File**: `public/views/sort-menu/sort-menu.html` (the search input lives next to the sort menu).

### 3. Sidebar secondary action — inset-shadow border

- **Pattern**: `shadow-[inset_0_0_0_1px_theme(colors.primary.500)]` (1px inner teal stroke via inset shadow)
- **Alternative considered**: real `border border-primary-500`
- **Reason for preservation**: a real border adds 1px to the box-sizing footprint, which
  shifts the adjacent primary button. Inset shadow keeps every action button in the row at
  the same outer dimensions whether selected or not — pure layout stability.
- **File**: `views/sidebar/sidebar.js:120` (secondary variant string)
