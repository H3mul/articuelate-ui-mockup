# Articuelate Token Mapping Guide

## Architectural Rules

### 1. ZERO MAGIC NUMBERS & HEX LITERALS
- Never write inline hardcoded pixel values (e.g., `w-[200px]`, `text-[13px]`) or hardcoded hex colors (e.g., `bg-[#1e2030]`) in any TSX/JSX file.
- Use the standardized Tailwind classes from `tailwind.config.ts` and semantic `@layer components` from `globals.css`.

### 2. Use Design Tokens Exclusively
Map every visual property to a token:

| Category | Token Class | Value |
|----------|------------|-------|
| App Background | `bg-app-bg` | `#181926` |
| Panel Surface | `bg-surface` | `#1E2030` |
| Raised Surface | `bg-surface-raised` | `#24273A` |
| Overlay Surface | `bg-surface-overlay` | `#363A4F` |
| Element BG | `bg-element` | `#11121C` |
| Element Hover | `hover:bg-element-hover` | `#181926` |
| Element Active | `active:bg-element-active` | `#090A0F` |
| Selection | `bg-selection` | `#2F3C5E` |
| Selection Active | `bg-selection-active` | `#405382` |
| Running Tint | `bg-status-running/15` | `#A6DA95` 15% |

### 3. Use Semantic Component Classes
Apply `@layer components` classes defined in `globals.css`:

| Class | Purpose |
|-------|---------|
| `.panel-surface` | Major panel background with border |
| `.cue-row` | Base cue row layout |
| `.cue-row-even` | Even zebra stripe |
| `.cue-row-odd` | Odd zebra stripe |
| `.cue-row-selected` | Selected cue highlight |
| `.cue-row-playing` | Playing cue highlight |
| `.btn-punch-down` | Punch-down button (bg-element inset) |
| `.btn-icon-sm` | Small icon button (32x32) |
| `.btn-icon-xs` | Extra small icon button (24x24) |
| `.label-mono-sm` | Small monospace label |
| `.field-input` | Text/number input |
| `.field-label` | Form field label text |
| `.tab-btn` | Tab button |
| `.tab-btn-active` | Active tab button |
| `.badge-sm` | Small status badge |
| `.divider-vert` | Vertical divider |

### 4. Zed Depth Philosophy
- **App Canvas/Gutters** (`bg-app-bg`): Darkest layer. Use `gap-px` to reveal 1px gutters.
- **Panel Surfaces** (`bg-surface`): Raised functional panels.
- **Punch-Down** (`bg-element`): Buttons, inputs inside surfaces, darker than surface.
- **Zebra Rows**: `.cue-row-even` (`bg-surface`), `.cue-row-odd` (`bg-surface-raised`).

### 5. Color Token Map

| Token | Hex | Usage |
|-------|-----|-------|
| `text-text-primary` | `#CAD3F5` | Body text, primary labels |
| `text-text-secondary` | `#B8C0E0` | Secondary info, column headers |
| `text-text-disabled` | `#A5ADCB` | Muted hints, disabled text |
| `text-status-playhead` | `#8AADF4` | Playhead indicators, focus rings |
| `text-status-running` | `#A6DA95` | Running cues, active states |
| `text-status-wait` | `#EED49F` | Wait/pre-delay states |
| `text-status-error` | `#ED8796` | Errors, panic, danger |
| `text-status-standby` | `#C6A0F6` | Armed/standby cues |
| `text-status-group` | `#F5A97F` | Group cues, peach accents |
| `border-element-border` | `#363A4F` | Borders, dividers |
| `border-border-subtle` | `#181926` | Subtle panel borders |
| `border-border-focus` | `#8AADF4` | Focus rings |
| `border-status-running` | `#A6DA95` | Running cue borders |
| `border-status-group` | `#F5A97F` | Group cue borders |
| `border-status-error` | `#ED8796` | Error borders |

### 6. Typography & Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `text-mono-sm` | 11px/14px | Cue numbers, time codes, labels |
| `text-mono-xl` | 24px/30px | Large display text |
| `text-body` | 13px/18px | Body text, cue names |
| `text-heading` | 15px/20px | Section headers, next cue |
| `p-sm` | 8px | Standard padding |
| `p-md` | 12px | Comfortable padding |
| `p-lg` | 16px | Panel padding |
| `gap-px` | 1px | Gutters between panels |
| `gap-sm` | 8px | Tight gaps |
| `gap-md` | 12px | Standard gaps |
| `gap-lg` | 16px | Comfortable gaps |
| `h-cue-row` | 24px | Cue row height |
| `h-toolbar` | 36px | Toolbar height |
| `h-status-bar` | 24px | Status bar height |
| `h-control-sm` | 28px | Inputs, small buttons |
| `h-control-md` | 32px | Medium buttons |

### 7. Semantic Class Definitions (from globals.css)

```css
@layer components {
  .panel-surface {
    @apply bg-surface border border-border-subtle;
  }
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
  .btn-punch-down {
    @apply flex items-center justify-center bg-element border border-element-border rounded-sm text-text-primary transition-colors duration-75;
  }
  .btn-punch-down:hover {
    @apply bg-element-hover;
  }
  .btn-punch-down:active {
    @apply bg-element-active border-border-focus/50;
  }
  .btn-icon-sm {
    @apply btn-punch-down h-control-md w-control-md p-xs text-text-secondary hover:text-text-primary;
  }
  .btn-icon-xs {
    @apply btn-punch-down h-xl w-xl p-xs text-text-secondary hover:text-text-primary;
  }
  .label-mono-sm {
    @apply font-mono text-mono-sm text-text-secondary tracking-tight;
  }
  .field-input {
    @apply h-control-sm rounded-sm border border-element-border bg-element px-sm text-body text-text-primary outline-none focus:ring-2 focus:ring-border-focus;
  }
  .field-label {
    @apply text-mono-sm font-semibold uppercase tracking-wider text-text-disabled;
  }
  .tab-btn {
    @apply px-md py-sm font-sans text-[12px] font-medium outline-none transition-colors focus:ring-2 focus:ring-inset focus:ring-border-focus;
  }
  .tab-btn-active {
    @apply tab-btn bg-selection text-text-primary;
  }
  .tab-btn-inactive {
    @apply tab-btn bg-element text-text-disabled hover:bg-element-hover hover:text-text-primary;
  }
  .badge-sm {
    @apply rounded-sm px-sm py-0.5 font-mono text-mono-sm font-semibold uppercase tracking-wider;
  }
  .divider-vert {
    @apply w-px bg-element-border;
  }
}
```