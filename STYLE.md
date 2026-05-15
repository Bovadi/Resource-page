# STYLE.md — BIP Visualized Style Library

> **Drop this file at the root of any new BIP Visualized project.** It tells Claude Code (and any developer) the canonical tokens, components, and authoring rules for our UI.
>
> Pair this with `tokens.css` (the CSS implementation) and `style-reference.html` (the visual reference).
>
> **Scope: this file covers the visual system only** — tokens, components, layout, and authoring rules for UI. For prototyping workflow, project structure, mock data conventions, required states, and handoff process, see `prototyping_CLAUDE.md`. Claude Code should read both when scaffolding a new project.

---

## 1. Stack & ground rules

**Production stack**
- Ruby on Rails (Ruby 3.2+)
- Hotwire (Turbo + Stimulus)
- Tailwind CSS 3.4 with `forms`, `typography`, `aspect-ratio` plugins
- ERB templating

**Prototyping stack**
- Sinatra + ERB
- Tailwind 3.4 via CDN
- Vanilla JS or Stimulus-style controllers

**Hard rules**
- Tailwind utilities first. Custom CSS only when utilities genuinely can't express a pattern (custom `::before`/`::after`, `:has()`, sticky-with-z-index choreography, complex keyframes).
- Never embed HTML inside JavaScript. Render hidden in ERB, toggle a class.
- No React, Vue, Alpine, or any SPA framework.
- Stimulus-style controllers in `app/javascript/controllers/`, one per file.
- ERB partials in folders that mirror domain (`bips/`, `strategies/`, `shared/`).
- No hardcoded hex values in markup. Reference tokens or palette classes.
- Every screen supports six states: default / loading / empty / form_errors / api_error / permission.

---

## 2. Layout — App Shell (Pattern A)

**This is the only layout pattern.** Fixed viewport, never scrolls the page. Scrolling happens inside content containers.

```html
<html class="h-full overflow-hidden">
<body class="h-full overflow-hidden">
  <div id="app" class="w-full h-screen overflow-hidden">
    <div class="fixed inset-0 w-full h-screen bg-white overflow-hidden flex flex-col">

      <!-- Mobile header (hidden on desktop) -->
      <div id="header-container" class="flex-shrink-0 lg:hidden"></div>

      <!-- Sidebar overlay for mobile -->
      <div id="sidebar-overlay" class="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden hidden"></div>

      <div class="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <!-- Nav rail (desktop only) -->
        <div id="nav-rail-container" class="relative z-20 hidden lg:flex flex-shrink-0 h-full"></div>

        <!-- Sidebar content panel -->
        <div id="sidebar-container" class="flex-shrink-0 lg:h-full"></div>

        <!-- Main content -->
        <div class="flex-1 flex flex-col overflow-hidden relative">
          <div id="toolbar-container" class="..."></div>
          <div id="main-container" class="flex-1 flex flex-col overflow-hidden"></div>
        </div>
      </div>

      <!-- Modal -->
      <div id="modal-container"></div>
    </div>
  </div>
</body>
</html>
```

**Breakpoints**
- Tailwind defaults (`sm: 640`, `md: 768`, `lg: 1024`, `xl: 1280`, `2xl: 1536`)
- Custom: `xs: 475px`
- Custom: `min-[901px]` — adopted threshold for desktop two-panel split layouts

---

## 3. Color tokens

### 3.1 Brand palette

**Primary — Teal** (`primary` in Tailwind config)
```
50  #f0fafa    200 #b1e3e2    500 #108c89 ★ brand    800 #065443
100 #dff5f4    300 #86d1d0    600 #0d8078              900 #03402f
                400 #43b0ae    700 #006360              950 #01291a
```

**Accent — Coral** (`bip-red` in Tailwind config, expanded scale)
```
50  #FCDDD4    400 #F0542A    600 #dc2626
100 #fecaca    500 #CC3F19 ★ brand    700 #922D11
```

**Navy** (`cool-gray` in Tailwind config)
```
50  #f0f3f5    200 #D0D5DC    500 #282b3c ★ brand    800 #0e1124
100 #EBEEF2    300 #9ba5b3    600 #222538              900 #080b1c
                400 #878990    700 #171a2e              950 #030512
```

**Beige** — `#F8F5EF` (canonical warm surface bg)
**Beige hover** — `#F1EDE5` (`--color-beige-hover`)
- Used for: hover background on nav rail items, sidebar tabs, settings menu items, sort menu items, and any other interactive element sitting on a beige or white surface that needs a beige-tinted hover. Distinct from gray-tinted hovers — use this on warm surfaces.

**Brand black** — `#161616` (`--color-brand-black`)
- Used for: high-emphasis text, checkbox checked state, focus borders on inputs, action button accents

**Text — primary** — `#343434` (`--color-text-primary`)
- Used for: standard body text, nav rail labels, sort menu items, card titles, sidebar items
- A warm near-black, intentionally softer than `--color-brand-black`. Use this for default body copy; reserve `--color-brand-black` for emphasis.

**Text — muted** — `#8A857D` (`--color-text-muted`)
- Used for: inactive nav/sidebar items, placeholder text, secondary metadata
- A warm muted gray that pairs with the structural border tokens. Distinct from Tailwind's cool `gray-500` — use this instead of `gray-500` for any text that needs to read "muted but warm."

### 3.2 Semantic colors

**Success — Emerald** (Tailwind `emerald`, aliased as `secondary`)
```
50  #ecfdf5    100 #d1fae5    500 #10b981    600 #059669    700 #047857
```

**Warning — Amber** (Tailwind `amber`)
```
50  #fffbeb    100 #fef3c7    500 #f59e0b    700 #b45309
```

**Error — `bip-red`** (expanded)
- Use `bip-red.50` for notice bg, `bip-red.100` for border, `bip-red.500` for icon/button, `bip-red.600` for text, `bip-red.700` for hover

**Info — `bip-blue`** (expanded)
```
50  #e6f4fb    100 #CCE9F7    200 #b3ddf2 ★ preferred border    500 #0093D8    700 #006a9e
```

### 3.3 Neutrals

**Tailwind default grays** (NOT the warm custom gray scale in `tailwind.config.js` — that's legacy):
```
50  #f9fafb    300 #d1d5db    600 #4b5563    900 #111827
100 #f3f4f6    400 #9ca3af    700 #374151
200 #e5e7eb    500 #6b7280    800 #1f2937
```

**Structural border tokens** (warm grays for image tiles, pills, structural elements)
- `#CCCAC5` — default structural border
- `#ADADAD` — hover variant
- `#E0E0E0` — hover background variant

**Standalone**
- `#b0a892` — muted neutral (spinner dots)
- `#2d2d2d` — checkbox hover (darker brand black)

### 3.4 Overlay opacities

| Token | Value | Used for |
|---|---|---|
| `scrim-modal` | `rgba(0,0,0,0.45)` | Modal backdrop |
| `scrim-picker` | `rgba(0,0,0,0.40)` | Picker overlay |
| `hover-image` | `rgba(22,22,22,0.55)` | Image tile hover overlay |
| `loading-beige` | `rgba(248,245,239,0.88)` | Loading overlay over beige (canonical — do not use 0.85) |

---

## 4. Typography

**Family**: Inter, weights 400 / 500 / 600 / 700
**Global rule**: `*, *::before, *::after { font-family: 'Inter', sans-serif }`

**Tailwind scale** (use these by default):
```
text-3xs  0.5rem   8px   (h: 0.75rem)
text-2xs  0.625rem 10px  (h: 0.75rem)
text-xs   0.75rem  12px
text-sm   0.875rem 14px
text-base 1rem     16px
text-lg   1.125rem 18px
text-xl   1.25rem  20px
text-2xl  1.5rem   24px
```

**No 11px text size.** Round up to 12px or down to 10px.

**Semantic typography tokens** (use for scaled content patterns):
- `--font-size-page-card` (8px) → `.text-page-card`
- `--font-size-page-label` (10px) → `.text-page-label`
- `--font-size-modal-card` (16px) → `.text-modal-card`
- `--font-size-modal-header` (20px) → `.modal-section-header`
- `--line-height-card` (120%) → `.leading-card`

**Letter spacing scale**:
- `tracking-normal` (0)
- `tracking-wide` (0.05em) — small uppercase labels (e.g. "FAL KEY")
- `tracking-wider` (0.08em) — section labels (e.g. "CHARACTERS", "SCENE")

**Global element override**: `h2 { font-size: 14px !important; font-weight: 400 !important; }`

---

## 5. Spacing, sizing, and rhythm

### 5.1 Spacing scale

Tailwind defaults. **Don't use arbitrary values** (`gap-[5px]`, `py-[9px]`) — they're a smell.

| Scale | Tailwind | Value |
|---|---|---|
| 2xs | `1` | 4px |
| xs | `2` | 8px |
| sm | `3` | 12px |
| md | `4` | 16px |
| lg | `6` | 24px |
| xl | `8` | 32px |
| 2xl | `12` | 48px |
| 3xl | `16` | 64px |

### 5.2 Border radius scale

| Token | Value | Used for |
|---|---|---|
| `rounded` (sm) | 4px | Checkbox box, tight pills |
| `rounded-md` | 6px | Tooltips, small badges |
| `rounded-lg` | 8px | Buttons (default), info notices |
| `rounded-xl` | 10px | Inputs, primary buttons, secondary buttons |
| `rounded-2xl` | 12px | Cards, character image boxes |
| custom `14px` | 14px | Selectable picker cards |
| custom `16px` | 16px | Modal panels (smaller) |
| custom `20px` | 20px | Modal panels (picker) |
| `rounded-full` | 9999px | Pills, avatars, check badges |

### 5.3 Shadow / elevation scale

| Token | Value | Used for |
|---|---|---|
| `shadow-sm` | `0 1px 1px rgba(0,0,0,0.25)` | Subtle pressed states |
| `shadow-md` | `0 2px 8px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.06)` | Tooltips |
| `shadow-lg` | `0 4px 12px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.08)` | Sidebar tooltip |
| `shadow-xl` | `0 8px 24px rgba(0,0,0,0.12)` | Popovers |
| `shadow-2xl` | `0 24px 64px rgba(0,0,0,0.18)` | Picker overlay |
| `shadow-3xl` | `0 24px 64px rgba(0,0,0,0.25)` | Modal panel |
| `shadow-hover-card` | `0 2px 8px rgba(0,0,0,0.07)` | Selectable card hover |

### 5.4 Z-index scale

| Token | Value | Used for |
|---|---|---|
| `z-0` (base) | 0 | Default |
| `z-10` (dropdown) | 10 | Filter popover, in-flow toolbars |
| `z-20` (sticky) | 20 | Nav rail, sidebar header |
| `z-30` (nav) | 30 | Mobile sidebar overlay |
| `z-[100]` (modal-overlay) | 100 | Picker overlay scrim |
| `z-[1001]` (modal) | 1001 | Edit modal panel |
| `z-[9999]` (tooltip) | 9999 | Sidebar tooltip, nav tooltip |

### 5.5 Icon sizes

- `--icon-size-placeholder` (24px) → `.icon-placeholder`
- `--icon-size-modal` (48px) → `.icon-modal`

---

## 6. Motion

### 6.1 Duration tokens

| Token | Value | Used for |
|---|---|---|
| `duration-[80ms]` (instant) | 80ms | Button press feedback |
| `duration-[120ms]` (fast) | 120ms | Checkbox state, small UI feedback |
| `duration-150` (default) | 150ms | Most hover/color/border transitions |
| `duration-[180ms]` (medium) | 180ms | Modal enter/exit, hover overlays |
| `duration-[220ms]` (slow) | 220ms | Card fade-in, panel transitions |
| `duration-[240ms]` (rail) | 240ms | Nav rail expand/collapse |

### 6.2 Easings

| Token | Value | Used for |
|---|---|---|
| `ease` (default) | `ease` | Most transitions |
| `ease-out` | `ease-out` | Nav rail, slide-ins |
| `entrance` | `cubic-bezier(0.16, 1, 0.3, 1)` | Modal entrances, page viewer |

### 6.3 Canonical animations

**Modal animation** (refined, current):
- Backdrop: 180ms opacity fade
- Panel: 180ms `cubic-bezier(0.16, 1, 0.3, 1)`, scale 0.97 → 1, translateY 6px → 0

**Spinner** (3 bouncing dots, `#b0a892`):
- 1.2s ease-in-out infinite
- Dots delayed 0ms / 150ms / 300ms

**Card fade-in** (uniform):
- 0.3s ease-out, opacity 0 → 1, translateY 6px → 0

**Page viewer transition**:
- 200ms `cubic-bezier(0.16, 1, 0.3, 1)`, opacity + translateY 4px → 0

**Nav button press**:
- `scale(0.9)`, 80ms ease, on `:active`

**Reduced motion**: Respect `prefers-reduced-motion: reduce` — disable transforms, keep opacity transitions.

---

## 7. Focus, disabled, and interactive states

### 7.1 Focus ring

Use `:focus-visible`, never `:focus` (avoid mouse-click focus rings).

- **Form inputs / textareas**: focus changes border to `#161616`. No outline ring.
- **Checkboxes**: `outline: 2.5px solid #161616; outline-offset: 2px`
- **Buttons / interactive elements**: `outline: 2px solid #108C89; outline-offset: 2px`

### 7.2 Disabled state

**Color-based, never opacity.**
- Text: `text-gray-400` (`#9ca3af`)
- Border: `border-gray-200` (`#e5e7eb`)
- Background: white (or `bg-gray-100` for inputs)
- Cursor: `cursor-not-allowed`
- No hover effects when disabled

```html
<!-- Correct -->
<button disabled class="disabled:text-gray-400 disabled:border-gray-200 disabled:cursor-not-allowed">

<!-- Wrong -->
<button class="disabled:opacity-50">
```

### 7.3 Hover

- Buttons: change border color or background, not opacity
- Cards: add `shadow-hover-card`
- Image tiles with content: reveal hover overlay (`rgba(22,22,22,0.55)`)

---

## 8. Form controls

### 8.1 Input sizes

| Size | Height | Padding | Font | Used for |
|---|---|---|---|---|
| `sm` | 28px | `py-1 px-2.5` | `text-xs` | Key bar inputs |
| `md` | 38px | `py-[9px] px-3` | `text-[13px]` | Default inputs |
| `textarea` | auto, `min-h-[64px]` or `min-h-[88px]` | `py-2.5 px-3` | `text-[13px]` | Textareas |

### 8.2 Input default

```html
<input class="w-full border border-gray-200 rounded-xl py-[9px] px-3 text-[13px] text-brand-black bg-white outline-none transition-colors duration-150 placeholder:text-gray-300 focus:border-brand-black" />
```

### 8.3 Textarea default

```html
<textarea class="w-full border border-gray-200 rounded-xl py-2.5 px-3 text-[13px] text-brand-black bg-white outline-none resize-y min-h-[88px] transition-colors duration-150 leading-normal placeholder:text-gray-300 focus:border-brand-black"></textarea>
```

### 8.4 Field group (label + helper + control)

```html
<div class="flex flex-col gap-2">
  <div class="flex items-center gap-2">
    <span class="text-[13px] font-semibold text-gray-700">Label</span>
    <!-- Optional pill -->
    <span class="inline-flex items-center py-0.5 px-2 bg-beige border border-[#CCCAC5] rounded-full text-[11px] font-semibold text-gray-500">Optional</span>
  </div>
  <p class="text-[13px] text-gray-500 leading-normal">Helper text describing the field.</p>
  <input ... />
</div>
```

### 8.5 Browser autofill suppression (global)

```css
input:-webkit-autofill,
textarea:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 1000px #fff inset;
  -webkit-text-fill-color: #374151;
  transition: background-color 5000s ease-in-out 0s;
}
```

---

## 9. Buttons

### 9.1 Sizes

| Size | Height | Padding | Font | Used for |
|---|---|---|---|---|
| `sm` | 32px | `py-2 px-3` | `text-xs font-semibold` | Edit-under-tile |
| `md` | 40px | `py-[11px] px-4` | `text-[13px] font-semibold` | Secondary actions |
| `lg` | 52px | `py-3.5 px-5` | `text-[15px] font-bold` | Primary submit |
| `icon-sm` | 32×32 | square | icon only | Close, more-options |

### 9.2 Primary button

Brand teal action. `bip-green-50` bg → solid `primary-500` on hover.

```html
<button class="w-full py-3.5 px-5 bg-bip-green-50 text-primary-500 border-0 rounded-xl text-[15px] font-bold cursor-pointer flex items-center justify-center gap-2 transition-colors duration-150 enabled:hover:bg-primary-500 enabled:hover:text-white enabled:active:scale-[0.98] disabled:text-gray-400 disabled:cursor-not-allowed">
  Primary action
</button>
```

### 9.3 Secondary button

White bg, structural border, brand black text.

```html
<button class="py-[11px] px-4 bg-white text-brand-black border border-[#CCCAC5] rounded-xl text-[13px] font-semibold cursor-pointer flex items-center justify-center gap-2 transition-colors duration-150 enabled:hover:border-brand-black disabled:text-gray-400 disabled:border-gray-200 disabled:cursor-not-allowed">
  Secondary action
</button>
```

### 9.4 Loading state

When a submit button is in-flight: disable, swap label to "…ing" form, add inline spinner. Don't swap to a different button.

---

## 10. Components

### 10.1 Custom checkbox (`.cb-row`)

Custom-styled checkbox with SVG checkmark. Brand black checked state. See `tokens.css` for the full implementation. Markup:

```html
<label class="cb-row">
  <input type="checkbox" class="cb-input" />
  <span class="cb-box"></span>
  <span class="cb-label">Label text</span>
</label>
```

States: default, hover, checked, indeterminate, focus-visible, disabled. Supports group headers (`.cb-group-header`) and sticky "Show all" rows (`.cb-show-all-sticky`).

### 10.2 Tooltips

Two variants, both fixed-position singletons appended to `<body>` (so parent `overflow:hidden` never clips them):
- `.sidebar-tooltip` — for sidebar items, white bg, left-pointing arrow
- `#nav-tooltip` — for nav rail items, white bg, left-pointing arrow

### 10.3 Modal

520px wide default panel (95vw on mobile), `rounded-2xl`, `shadow-3xl`.

```html
<div class="overlay-anim fixed inset-0 bg-black/45 z-[1001] items-center justify-center">
  <div class="bg-white rounded-2xl w-[520px] max-w-[95vw] max-h-[90vh] overflow-y-auto shadow-3xl">
    <!-- Header -->
    <div class="flex items-center justify-between pt-7 px-8 pb-6">
      <span class="text-[22px] font-normal text-brand-black">Title</span>
      <button class="w-8 h-8 ...">✕</button>
    </div>
    <div class="h-px bg-gray-200"></div>

    <!-- Body -->
    <div class="pt-6 px-8">...</div>

    <!-- Footer -->
    <div class="flex gap-4 py-4 px-8 pb-8">
      <button class="...">Primary</button>
      <button class="...">Secondary</button>
    </div>
  </div>
</div>
```

Picker overlay variant: 960px wide, `rounded-[20px]`, `shadow-2xl`.

### 10.4 Tab bar

```html
<div class="h-16 px-8 border-b border-gray-200 flex items-center">
  <button class="relative h-full px-1 mr-6 text-[15px] font-medium text-brand-black">
    Active Tab
    <span class="absolute left-0 right-0 -bottom-px h-[2px] bg-brand-black"></span>
  </button>
  <button class="relative h-full px-1 text-[15px] font-medium text-gray-400 hover:text-brand-black">
    Inactive Tab
  </button>
</div>
```

### 10.5 Section label

```html
<div class="text-[11px] font-bold tracking-wider text-gray-400 uppercase mb-4">
  Section Name
</div>
```

### 10.6 Info notices

**Teal variant** (informational hint):
```html
<div class="flex items-start gap-2 bg-bip-green-50 rounded-lg py-3 px-4">
  <svg class="text-primary-500 shrink-0 mt-px">...</svg>
  <span class="text-xs text-primary-500 leading-normal">Hint text.</span>
</div>
```

**Blue variant** (disclaimer / responsibility):
```html
<div class="flex items-start gap-2 bg-bip-blue-50 border border-bip-blue-200 rounded-lg py-2.5 px-3">
  <svg class="shrink-0 mt-px text-bip-blue-500">...</svg>
  <span class="text-[12px] text-bip-blue-700 leading-normal">Disclaimer text.</span>
</div>
```

**Error notice**:
```html
<div class="bg-bip-red-50 border border-bip-red-100 rounded-lg py-2.5 px-4 text-[13px] text-bip-red-600 flex items-start gap-2.5">
  <svg>...</svg>
  <div>
    <div>Error message.</div>
    <button class="mt-1.5 inline-block bg-transparent border border-bip-red-600 rounded-md text-bip-red-600 text-xs font-semibold py-[3px] px-2.5 hover:bg-bip-red-100">Try again</button>
  </div>
</div>
```

### 10.7 Selectable card

```html
<div class="picker-card relative w-[200px] min-h-[272px] border-[1.5px] border-gray-200 rounded-[14px] bg-beige cursor-pointer flex items-center justify-center transition-shadow duration-150 hover:border-gray-400 hover:shadow-hover-card">
  <img src="..." class="w-[160px] h-[240px] object-contain" />
  <!-- Check badge shows when .selected is applied -->
  <div class="picker-check absolute -bottom-[9px] -right-[9px] w-[26px] h-[26px] bg-brand-black rounded-full border-[2.5px] border-white items-center justify-center">
    <svg>✓</svg>
  </div>
</div>
```

State: add `.selected` class → border becomes brand black, check badge appears.

### 10.8 Image tile with hover overlay

For pickable image slots — beige bg, structural border, reveals "Change X" overlay on hover when filled.

```html
<div class="char-image-box w-[120px] h-[160px] bg-beige rounded-2xl flex flex-col items-center justify-center cursor-pointer overflow-hidden border border-[#CCCAC5] transition-colors duration-150 relative hover:border-[#ADADAD] hover:bg-[#E0E0E0]">
  <!-- Image (when filled) -->
  <img class="w-full h-full object-contain" />
  <!-- Hover overlay -->
  <div class="char-change-overlay absolute inset-0 bg-[rgba(22,22,22,0.55)] flex items-center justify-center rounded-2xl opacity-0 transition-opacity duration-[180ms] pointer-events-none">
    <span class="text-[11px] font-bold text-white text-center leading-[1.4] px-2">Change<br>Item</span>
  </div>
</div>
```

### 10.9 Image-with-loading-overlay

Recurring pattern when an image is being processed:

```html
<div class="relative ...">
  <img src="..." />
  <div class="absolute inset-0 bg-[rgba(248,245,239,0.88)] flex-col items-center justify-center gap-3 rounded-lg">
    <div class="w-9 h-9 border-[3px] border-bip-green-50 border-t-primary-500 rounded-full anim-spin"></div>
    <span class="text-[13px] font-semibold text-primary-500">Working…</span>
  </div>
</div>
```

### 10.10 Spinner — grid loader (canonical)

Three bouncing dots, `#b0a892`. Use for grid content loading.

```html
<div class="grid-spinner">
  <div class="grid-spinner-dot"></div>
  <div class="grid-spinner-dot"></div>
  <div class="grid-spinner-dot"></div>
</div>
```

### 10.11 Nav rail

56px collapsed → 220px expanded, 240ms ease-out. Logo mark anchored to fixed position (no horizontal jump on expand). Labels fade in with delay. See `tokens.css` for full implementation.

### 10.12 Sort menu / filter popover

Anchored to its trigger button, white panel, `shadow-xl`, `rounded-xl`. Grouped sections with uppercase labels.

---

## 11. Authoring rules for Claude Code

### 11.1 Do
- Reach for Tailwind utilities first.
- Use named tokens (`--color-brand-black`, `bip-red.500`, etc.) over raw hex.
- Use the named utility classes (`.text-brand-black`, `.icon-placeholder`, `.modal-section-header`, `.text-page-card`).
- Match production folder names: `bips/`, `strategies/`, `shared/`, etc.
- Render every screen across all six states (default / loading / empty / form_errors / api_error / permission).
- Cap text inputs at specified lengths and show count when a max exists.
- Use `:focus-visible` instead of `:focus`.
- Use `prefers-reduced-motion: reduce` to disable transforms.

### 11.2 Don't
- Don't use arbitrary Tailwind values (`text-[#161616]`, `py-[9px]`) when a token exists.
- Don't embed HTML strings in JavaScript.
- Don't install React, Vue, Alpine, or any SPA framework.
- Don't use `opacity` for disabled states — use color tokens.
- Don't use `:focus` (mouse-click focus rings) — use `:focus-visible`.
- Don't use the warm custom `gray` scale from `tailwind.config.js` (it's legacy). Use Tailwind defaults.
- Don't use 11px text size — round to 10px or 12px.
- Don't invent new colors or hex values.
- Don't add custom CSS when a Tailwind utility exists.
- Don't reach for the `shadcn` HSL tokens — they were an export artifact, not the system.

### 11.3 Migration guidance

When refactoring legacy code:
- `style="font-size: 0.5rem; line-height: 120%;"` → `class="text-page-card leading-card"`
- `class="text-[0.625rem]"` → `class="text-page-label"`
- `class="text-[#161616]"` → `class="text-brand-black"`
- `class="bg-[#F8F5EF]"` → `class="bg-beige"`
- `class="border-[#108C89]"` → `class="border-primary-500"`

### 11.4 When in doubt

- Reference `style-reference.html` for visual examples.
- If a pattern isn't here, check `tokens.css` for the implementation.
- If neither has it, ask before inventing.

---

## 12. Print styles

8.5×11" page export overrides for scaled content:

```css
@media print {
  .scalable-content { transform: none !important; width: 8.5in !important; height: 11in !important; }
  .page-container { width: 8.5in !important; height: 11in !important; max-width: none !important; max-height: none !important; box-shadow: none !important; }
  .page-content-scalable { width: 8.5in !important; height: 11in !important; overflow: visible !important; }
}
```

---

## 13. Tailwind config reference

The canonical Tailwind config lives in production. Key custom extensions:

```js
theme: {
  screens: { xs: "475px", ...defaults },
  extend: {
    colors: {
      primary: { /* teal scale 50-950 */ },
      secondary: emerald,
      // 'tertiary' aliased to gray — but use Tailwind default gray, not the custom warm scale
      'bip-blue': { 50: "#e6f4fb", 100: "#CCE9F7", 200: "#b3ddf2", 500: "#0093D8", 700: "#006a9e" },
      'bip-green': { 50: "#DBEEED", 100: "#108C89" },
      'bip-red': { 50: "#FCDDD4", 100: "#fecaca", 400: "#F0542A", 500: "#CC3F19", 600: "#dc2626", 700: "#922D11" },
      beige: "#F8F5EF",
      'beige-hover': "#F1EDE5",
      'text-primary': "#343434",
      'text-muted': "#8A857D",
    },
    fontFamily: { sans: ["Inter", ...defaults] },
    fontSize: { "3xs": ["0.5rem", { lineHeight: "0.75rem" }], "2xs": ["0.625rem", { lineHeight: "0.75rem" }] },
    borderRadius: { 4: "0.25rem", 5: "0.313rem" },
    borderWidth: { 3: "3px" },
    boxShadow: {
      xs: "0px 1px 1px 0px rgba(0, 0, 0, 0.25)",
      xs1: "0px 0px 2px 0px rgba(0, 0, 0, 0.25)",
      "3xl": "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
    },
  },
}
```

---

## 14. Future work

- **Dark mode tokens.** `darkMode: "class"` is enabled but no dark variants are defined.
- **Custom gray scale alignment.** Decide whether to retire the warm custom `gray` scale or migrate legacy code to use it.
- **Accessibility audit.** Codify WCAG AA contrast ratios for all token pairings (text-on-bg combinations).
- **Component library expansion.** This document covers components seen in current files. Add new components here as they're built.
