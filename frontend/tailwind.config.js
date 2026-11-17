/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#F5F4F0',
        panel: '#FFFFFF',
        hairline: '#E2E0D8',
        'hairline-hover': '#D4D1C7',
        ink: '#18181B',
        'ink-muted': '#57534E',
        'ink-subtle': '#78716C',
        surface: '#F0EFEA',
        teal: {
          deep: '#115E59',
          hover: '#0F766E',
          dark: '#134E4A',
          subtle: '#F0FDFA',
          border: '#CCFBF1',
        },
        ochre: {
          DEFAULT: '#B45309',
          subtle: '#FEF3C7',
          border: '#FDE68A',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        subtle: '0 1px 2px 0 rgba(24, 24, 27, 0.04)',
        card: '0 1px 3px 0 rgba(24, 24, 27, 0.05), 0 1px 2px -1px rgba(24, 24, 27, 0.05)',
      },
    },
  },
  plugins: [],
}
