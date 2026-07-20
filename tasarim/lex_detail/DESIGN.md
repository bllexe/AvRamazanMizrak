---
name: Lex & Detail
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#44474c'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#74777d'
  outline-variant: '#c4c6cd'
  surface-tint: '#4f6073'
  primary: '#041627'
  on-primary: '#ffffff'
  primary-container: '#1a2b3c'
  on-primary-container: '#8192a7'
  inverse-primary: '#b7c8de'
  secondary: '#775a19'
  on-secondary: '#ffffff'
  secondary-container: '#fed488'
  on-secondary-container: '#785a1a'
  tertiary: '#0a1526'
  on-tertiary: '#ffffff'
  tertiary-container: '#1f2a3b'
  on-tertiary-container: '#8691a6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d2e4fb'
  primary-fixed-dim: '#b7c8de'
  on-primary-fixed: '#0b1d2d'
  on-primary-fixed-variant: '#38485a'
  secondary-fixed: '#ffdea5'
  secondary-fixed-dim: '#e9c176'
  on-secondary-fixed: '#261900'
  on-secondary-fixed-variant: '#5d4201'
  tertiary-fixed: '#d8e3fa'
  tertiary-fixed-dim: '#bcc7dd'
  on-tertiary-fixed: '#111c2c'
  on-tertiary-fixed-variant: '#3c475a'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
  legal-navy: '#1A2B3C'
  prestige-gold: '#C5A059'
  ink-black: '#0F172A'
  paper-white: '#FFFFFF'
  stone-gray: '#E2E8F0'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 60px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 30px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.1em
  nav-link:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  container-max: 1200px
  article-max: 720px
  gutter: 24px
  margin-mobile: 16px
  section-gap: 80px
---

## Brand & Style

This design system is built for a solo legal practitioner who balances institutional authority with personal accessibility. The aesthetic follows a **Minimalist / Corporate Modern** direction, utilizing high-end editorial cues to distinguish the blog from standard corporate law sites. 

The visual narrative centers on "The Trusted Expert"—someone who is deeply knowledgeable yet modern in their approach. This is achieved through expansive whitespace, rigorous alignment, and a sophisticated interplay between traditional serif typography and high-performance functional sans-serifs. The atmosphere is quiet, confident, and premium, evoking the feeling of a private consultation in a well-curated, modern office.

**Key visual principles:**
- **Refined Precision:** Every element has a purpose; no decorative clutter.
- **Academic Elegance:** Using serif headings to reference the history of law.
- **Digital Fluency:** Using modern layouts and interactions to show the practitioner is forward-thinking.

## Colors

The palette is anchored by **Legal Navy**, a color of deep stability and institutional trust. This is contrasted by **Prestige Gold**, which should be used sparingly for "moments of excellence"—high-value calls to action, important highlights, or subtle accents that guide the eye to key information.

- **Primary:** Used for text headers, primary buttons, and core branding.
- **Secondary:** Used for accent lines, link underlines, and active states.
- **Neutral:** A range of "Paper" whites and "Stone" grays to provide a clean, readable canvas that mimics high-quality stationery.
- **Backgrounds:** Stick to `#FFFFFF` for content areas to ensure maximum legibility for long-form legal writing. Use `#F8F9FA` for section breaks or sidebar backgrounds to create subtle depth.

## Typography

The typography system uses a "Traditional-meets-Functional" pairing. 

**Playfair Display** serves as the voice of authority. It is used for all major headings and section titles. Its high contrast and elegant serifs communicate the weight of legal expertise.

**Inter** provides the functional backbone. It is chosen for its exceptional legibility in long-form articles. Its neutral, systematic nature ensures that the lawyer's arguments are easy to digest without visual fatigue.

**Rules for Use:**
- **Serifs** are for emotion and hierarchy (Headings).
- **Sans-serifs** are for information and action (Body text, UI labels, Navigation).
- Use **Label-caps** for metadata like "Reading Time" or "Published Date" to create a modern, journalistic feel.

## Layout & Spacing

The design system utilizes a **Fixed Grid** approach for the main website structure and a **Constrained Fluid** model for article reading.

- **Desktop Grid:** A 12-column layout with 24px gutters. Content is centered with a max-width of 1200px.
- **Article Reading:** For the "Article Detail" pages, the text container is limited to a max-width of 720px. This mimics a book page and prevents line lengths from becoming too long, which is critical for legal analysis.
- **Whitespace:** Use generous vertical spacing (`section-gap`) between homepage sections to allow the brand elements to breathe.
- **Mobile:** Transition to a single-column layout with 16px side margins. Horizontal scrolling may be used for "Related Articles" or "Category Tags" to maintain a clean vertical rhythm.

## Elevation & Depth

This design system avoids heavy shadows to maintain a clean, flat, high-end look. Depth is conveyed primarily through **Tonal Layers** and **Low-contrast Outlines**.

- **Surface Levels:** 
    - **Base:** The page background.
    - **Raised:** Cards and input fields use a 1px border in `stone-gray` rather than a shadow.
    - **Interactive:** Hover states on article cards should trigger a very subtle, diffused ambient shadow (0px 4px 20px rgba(26, 43, 60, 0.05)) to suggest "lift."
- **Floating Elements:** The WhatsApp floating icon is the only element permitted to have a high-contrast shadow, ensuring it stays accessible as a primary contact method above the content.
- **Dividers:** Use thin, 1px horizontal lines in `stone-gray` to separate editorial content, referencing the layout of traditional newspapers.

## Shapes

The shape language is **Soft (0.25rem)**. While the overall feel is sharp and professional, the very slight rounding prevents the UI from feeling aggressive or dated.

- **Buttons & Inputs:** Use the base `rounded` (4px) setting.
- **Cards & Profile Images:** Use `rounded-lg` (8px) to provide a gentle container for photography.
- **Category Tags:** Use a pill-shape (full rounded) to differentiate them from interactive buttons.
- **Imagery:** Photography should be cropped to sharp rectangular ratios (16:9 or 4:5) to maintain the architectural feel of the site.

## Components

### Buttons
- **Primary:** Solid `legal-navy` with white text. High-contrast, rectangular with 4px rounding.
- **Secondary:** Outlined with `prestige-gold` and `prestige-gold` text. Used for less urgent actions.
- **Text Link:** `legal-navy` with a `prestige-gold` underline that expands on hover.

### Article Cards
Cards should be minimal. A large thumbnail image at the top, followed by a `label-caps` category, a `headline-sm` title, and a brief snippet in `body-md`. The entire card is a hit area, but only the title should show a color change on hover.

### Input Fields
Used for the contact form and search. Use a white background with a 1px `stone-gray` border. Focus states should change the border color to `legal-navy` with a 1px inner glow of `prestige-gold`.

### Category Tags
Small, pill-shaped elements with a light gray background (`#F1F5F9`) and `legal-navy` text. These help categorize legal topics (e.g., "Corporate Law", "Litigation").

### Charts & Data
For the Admin panel, use `Recharts` styled with the `legal-navy` and `prestige-gold` palette. Use `stone-gray` for grid lines to keep the data visualization clean and unobtrusive.