---
name: Pure Gastronomy
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#404944'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#707974'
  outline-variant: '#bfc9c3'
  surface-tint: '#2b6954'
  primary: '#003527'
  on-primary: '#ffffff'
  primary-container: '#064e3b'
  on-primary-container: '#80bea6'
  inverse-primary: '#95d3ba'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#4f1f19'
  on-tertiary: '#ffffff'
  tertiary-container: '#6b342d'
  on-tertiary-container: '#ea9e93'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#b0f0d6'
  primary-fixed-dim: '#95d3ba'
  on-primary-fixed: '#002117'
  on-primary-fixed-variant: '#0b513d'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#ffdad5'
  tertiary-fixed-dim: '#ffb4a9'
  on-tertiary-fixed: '#380d08'
  on-tertiary-fixed-variant: '#6e372f'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The design system is rooted in **Modern Minimalism**, prioritizing functional clarity and culinary sophistication. It targets a discerning audience that values transparency, quality ingredients, and an effortless user experience. The aesthetic is inspired by high-end editorial magazines and contemporary architectural interfaces, characterized by a restrained "less is more" philosophy.

The emotional response should be one of **calm, precision, and appetite**. By utilizing ample whitespace and a systematic grid, the design system ensures that the food photography and 3D isometric illustrations remain the focal points. Visual noise is eliminated to reduce cognitive load, creating an environment that feels both premium and accessible.

## Colors

The palette is centered on a foundation of neutral Zinc and Slate tones to provide a professional, grounded atmosphere. 

- **Primary (Forest Green):** Used sparingly for key actions, success states, and primary brand moments. It evokes freshness and organic quality.
- **Secondary (Slate):** Utilized for secondary UI elements, icons, and supporting text to maintain a soft contrast.
- **Neutral (Zinc/Slate Scale):** The backbone of the system. Backgrounds use the lightest tints (`#f8fafc`), while borders strictly follow a subtle hairline aesthetic (`#e2e8f0`).
- **Surface:** Pure white (`#ffffff`) is used for elevated components like cards to differentiate from the light gray background.

## Typography

This design system employs **Inter** across all levels to maintain a systematic and utilitarian feel. The hierarchy is established through significant weight shifts and tight letter-spacing on larger headings to create an editorial look.

- **Headlines:** Should use Semi-Bold or Bold weights with slight negative letter-spacing for a "tight" professional appearance.
- **Body Text:** Uses a generous line-height (1.5 - 1.6) to ensure maximum readability against the white background.
- **Data & Labels:** Use Medium weights to distinguish from standard body text without needing larger font sizes.

## Layout & Spacing

The layout follows a **Fixed-Fluid hybrid grid**. Content is contained within a 1280px max-width wrapper on desktop, while utilizing a 12-column grid for complex layouts.

- **Desktop:** 12 columns / 24px gutter / 40px margins.
- **Tablet:** 6 columns / 20px gutter / 24px margins.
- **Mobile:** 2 columns / 16px gutter / 16px margins.

Spacing follows an 8px base unit. Vertical rhythm should be generous; use `stack-lg` (32px) between major sections to maintain the minimalist breathability.

## Elevation & Depth

In alignment with shadcn-style aesthetics, this design system avoids heavy shadows. Depth is communicated through **Tonal Layering** and **Low-Contrast Outlines**.

- **Default State:** Elements sit flat on the surface with a 1px border (`#e2e8f0`).
- **Interactive State (Hover):** A very soft, diffused ambient shadow may be applied (e.g., `0 4px 6px -1px rgb(0 0 0 / 0.05)`) to indicate lift.
- **Floating Elements:** Modals and dropdowns use a slightly more pronounced shadow to separate them from the background, but always maintained with low opacity to keep the look "clean."

## Shapes

The shape language is **Soft and Precise**. A standard corner radius of `0.25rem` (4px) is used for inputs, cards, and buttons to maintain a professional, slightly architectural edge. 

**Exceptions:**
- **Pill Tags:** Use `9999px` (fully rounded) for ingredient tags and category chips to provide a friendly, organic contrast to the structured grid.
- **Progressive Rounding:** Larger containers like main content areas may use `0.5rem` (8px) to feel more inviting.

## Components

### Cards
Food items are presented in "Pure White" cards with a 1px `slate-200` border. The card should have no shadow in its default state. The top half is reserved for the high-quality food photography or 3D illustration, while the bottom half contains text with a padding of `20px`.

### Buttons
- **Primary:** Solid `Forest Green` (#064e3b) with white text. 4px border radius.
- **Secondary:** White background with `slate-200` border and `slate-900` text.
- **Ghost:** No background or border; text-only until hover.

### Tags & Chips (Pill-shaped)
Used for dietary restrictions (e.g., "Vegan", "Gluten-Free"). These are fully rounded, using a light `slate-100` background and `slate-700` text for high legibility and a soft appearance.

### Input Fields
Inputs are minimalist: 1px `slate-200` border, `14px` font size, and `12px 16px` padding. On focus, the border changes to the primary `Forest Green` with a subtle 2px ring.

### 3D Illustrations
Food icons must be high-quality isometric 3D renders with soft lighting and realistic textures. These should be placed on subtle tinted circles or directly on the white card surface to pop.]