Articuelate Design System & Migration Guide (Next.js Mockup)

This document outlines the systematic process for "de-vibecoding" the Articuelate Next.js prototype. It details how to migrate from arbitrary magic numbers and unstructured CSS to a strict token dictionary (tailwind.config.ts) and a consolidated globals.css containing semantic component classes for the Next.js UI mockup.

1. Architectural Strategy: Tokenization & Consolidation

To ensure visual consistency across the Next.js application:

tailwind.config.ts: Holds all primitive tokens (colors, spacings, font scales, radii, heights)

globals.css: Consolidates base rules and semantic @layer components (.cue-row, .panel-surface, .btn-punch-down).

No Magic Numbers / Hardcoded Hexes: All React components must exclusively use Tailwind design tokens (e.g., p-sm, bg-surface) or semantic component classes (e.g., cue-row-even).

2. Refactoring & De-Vibecoding Instructions

Use this workflow (and prompt) when refactoring existing React components or migrating styles from an un-tokenized globals.css to globals_migration.css before consolidating into the final globals.css.

Migration Workflow Steps

Inject Theme Dictionary: Ensure tailwind.config.ts incorporates the Macchiato/Zed tokens

Draft Component Classes: Copy current styling abstractions into globals_migration.css using Tailwind's @layer components.

Component Refactoring: Replace inline arbitrary classes (w-[200px], bg-[#1e2030], text-[13px]) across all TSX files with tokenized Tailwind classes or @layer component classes.

Final Consolidation: Verify that all magic numbers are eliminated, then replace globals.css with the consolidated globals_migration.css output.

3. Copy-Paste AI Refactoring Prompt

When using an AI coding assistant (like v0, Bolt, or Claude) to refactor a component or migrate globals.css, paste the following prompt:

You are an expert desktop application UI/UX engineer refactoring "Articuelate," a professional theatrical audio cue playback system inspired by QLab and Zed's depth philosophy. We are currently building and refining the Next.js React frontend.

### TASK
Perform a "de-vibecoding" refactor on the provided Next.js React code and CSS. Eliminate all inline magic numbers (e.g., `w-[200px]`, `bg-[#1e2030]`, `text-[13px]`), hardcoded hex values, and unstructured styling. Convert them into a clean, consolidated `globals.css` and tokenized Tailwind classes.

### STEP-BY-STEP WORKFLOW
1. MIGRATION FILE: Populate `globals_migration.css` with the semantic `@layer components` specified below.
2. REFACTOR REACT COMPONENTS: Replace all vibe-coded Tailwind classes with semantic classes (`.cue-row`, `.btn-punch-down`, `.panel-surface`) and strict design tokens (`p-sm`, `gap-px`, `bg-surface`).
3. CONSOLIDATION: Replace the old `globals.css` with the new consolidated `globals_migration.css` content once all components are refactored. No inline hardcoded literals are allowed in TSX files.

### DESIGN TOKENS (Match tailwind.config.ts)

Surfaces & Environment:
- App Background (Gutters/Dividers): `bg-app-bg` (`#181926`)
- Panel Surface (Main background): `bg-surface` (`#1E2030`)
- Raised Surface (Even row zebra stripes): `bg-surface-raised` (`#24273A`)
- Overlay Surface: `bg-surface-overlay` (`#363A4F`)

Punch-Down Interactables (Darker than Surface):
- Default (Inset/Darker): `bg-element` (`#11121C`)
- Border: `border-element-border` (`#363A4F`)
- Hover: `hover:bg-element-hover` (`#181926`)
- Active: `active:bg-element-active` (`#090A0F`)

States & Highlights:
- Selection (Inactive Focus): `bg-selection` (`#2F3C5E`)
- Selection (Active Focus): `bg-selection-active` (`#405382`)
- Focus Ring: `border-border-focus` (`#8AADF4`)
- Playhead Indicator (Blue): `text-status-playhead` (`#8AADF4`)
- Running Cue Background (Green Tint): `bg-status-running/15` (`#A6DA95` at 15% opacity)
- Group Cue Border (Peach): `border-status-group` (`#F5A97F`)

Typography & Dimensions:
- Monospace Sizes: `text-mono-sm` (11px/14px), `text-mono-xl` (24px/30px)
- Body Sizes: `text-body` (13px/18px), `text-heading` (15px/20px)
- Spacing Scale: `xs` (4px), `sm` (8px), `md` (12px), `lg` (16px), `xl` (24px)
- Element Heights: `h-cue-row` (24px), `h-toolbar` (36px), `h-status-bar` (24px)

### CONSOLIDATED CSS TEMPLATE (globals_migration.css -> globals.css)

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-app-bg text-text-primary font-sans text-body selection:bg-selection-active;
    user-select: none; 
    overflow: hidden;
  }

  input[type="text"], input[type="number"] {
    @apply bg-element border border-element-border rounded-md px-sm py-xs text-text-primary focus:outline-none focus:border-border-focus;
  }
}

@layer components {
  /* Panels & Environment */
  .panel-surface {
    @apply bg-surface border-border-subtle;
  }

  /* Cuelist Elements */
  .cue-row {
    @apply flex flex-row items-center h-cue-row px-sm border-b border-border-divider/50 cursor-default;
  }
  .cue-row-even {
    @apply bg-surface;
  }
  .cue-row-odd {
    @apply bg-surface-raised;
  }
  .cue-row-selected {
    @apply bg-selection text-text-primary;
  }
  .cue-row-playing {
    @apply bg-status-running/15 text-text-primary;
  }

  /* The Zed Punch-Down Button */
  .btn-punch-down {
    @apply flex items-center justify-center bg-element border border-element-border rounded-md text-text-primary transition-colors duration-75;
  }
  .btn-punch-down:hover {
    @apply bg-element-hover;
  }
  .btn-punch-down:active {
    @apply bg-element-active border-border-focus/50;
  }
  
  /* Icon buttons */
  .btn-icon-sm {
    @apply btn-punch-down w-xl h-xl p-xs text-text-secondary hover:text-text-primary;
  }

  /* Labels */
  .label-mono-sm {
    @apply font-mono text-mono-sm text-text-secondary tracking-tight;
  }
}


4. Token & Class Conversion Examples

A. Element Styling

Before (Vibe-coded):
<div className="w-[200px] h-[24px] p-[8px] bg-[#1e2030] text-[#cad3f5] text-[13px]">

After (Tokenized):
<div className="w-min-panel h-cue-row p-sm bg-surface text-text-primary text-body">

B. Cue Row React View

Before (Vibe-coded):

<div className="flex flex-row items-center h-[24px] px-[8px] bg-[#1e2030] border-b border-[#363a4f]/50">
  <span className="w-[16px] text-[#8aadf4]">▶</span>
  <span className="w-[24px] font-mono text-[11px] text-[#b8c0e0]">4</span>
  <span className="flex-grow font-bold text-[#cad3f5]">Rain Ambience</span>
  <span className="font-mono text-[11px] text-[#b8c0e0]">4:30.00</span>
</div>


After (Consolidated Component Class):

<div className="cue-row cue-row-even">
  <span className="w-lg text-status-playhead">▶</span>
  <span className="w-xl label-mono-sm">4</span>
  <span className="flex-grow font-bold">Rain Ambience</span>
  <span className="label-mono-sm">4:30.00</span>
</div>


5. Structural & Layout Rules

Panel Gutters: Use gap-px on parent containers styled with bg-app-bg. This creates clean 1px panel separators without manual border logic.

Action Buttons: Prominent action triggers (e.g., the primary "GO" button) use .btn-punch-down (bg-element) with a distinct border color (e.g., border-status-running).

Meters & Telemetry: VU meter backgrounds use bg-element as the trough, with meter indicators using bg-status-running and bg-status-wait.
