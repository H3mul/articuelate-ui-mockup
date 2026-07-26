import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // All design tokens are defined in the @theme block in globals.css (Tailwind v4)
  theme: {},
  plugins: [],
}
export default config