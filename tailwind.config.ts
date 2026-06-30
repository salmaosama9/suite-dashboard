import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#1E3A5F',
          light: '#2D5A8E',
          accent: '#E8B84B',
        },
        app: '#3B82F6',
        web: '#10B981',
      },
    },
  },
  plugins: [],
}

export default config
