import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    // 1. TYPOGRAPHY: Restricted font sizes & line heights from TOML
    fontSize: {
      'mono-sm': ['11px', '14px'],
      'mono-xl': ['24px', '30px'],
      'body': ['13px', '18px'],
      'heading': ['15px', '20px'],
      // Removing default web sizes forces the use of the app's specific scales
    },
    fontFamily: {
      sans: ['"Segoe UI"', 'system-ui', 'sans-serif'],
      mono: ['"JetBrains Mono"', 'monospace'],
    },
    
    // 2. SPACING & DIMENSIONS: Strict intervals
    spacing: {
      0: '0px',
      px: '1px',
      xs: '4px',
      sm: '8px',
      md: '12px',
      lg: '16px',
      xl: '24px',
      // Specific UI element heights (prevents magic numbers)
      'cue-row': '24px',
      'status-bar': '24px',
      'toolbar': '36px',
      'min-panel': '225px',
      'icon-sm': '14px',
      'icon-md': '18px',
    },

    // 3. BORDERS & RADII
    borderRadius: {
      none: '0px',
      sm: '3px',
      md: '5px',
      full: '9999px',
    },
    borderWidth: {
      DEFAULT: '1px',
      0: '0px',
      2: '2px',
    },

    extend: {
      // 4. COLORS: Exact mapping from 01-base.toml
      colors: {
        app: {
          bg: '#181926',              // bg_app
        },
        surface: {
          DEFAULT: '#1E2030',         // bg_surface
          raised: '#24273A',          // bg_surface_raised (zebra)
          overlay: '#363A4F',         // bg_surface_overlay
        },
        element: {
          DEFAULT: '#11121C',         // element_bg (punch-down)
          border: '#363A4F',          // element_border
          hover: '#181926',           // element_bg_hover
          active: '#090A0F',          // element_bg_active
        },
        selection: {
          DEFAULT: '#2F3C5E',         // bg_selection
          active: '#405382',          // bg_selection_active
        },
        text: {
          primary: '#CAD3F5',         // text_primary
          secondary: '#B8C0E0',       // text_secondary
          disabled: '#A5ADCB',        // text_disabled
        },
        status: {
          playhead: '#8AADF4',        // status_playhead / focus ring
          running: '#A6DA95',         // status_running
          wait: '#EED49F',            // status_wait
          error: '#EE99A0',           // status_error
          standby: '#C6A0F6',         // status_standby
          group: '#F5A97F',           // status_group
        },
        border: {
          subtle: '#181926',          // border_subtle
          divider: '#363A4F',         // border_divider
          focus: '#8AADF4',           // border_focus
        }
      },
    },
  },
  plugins: [],
}
export default config
