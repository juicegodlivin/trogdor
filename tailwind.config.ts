import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#FFFFFF',
        foreground: '#1E1E1E',
        sketch: {
          light: '#FAFAFA',
          DEFAULT: '#F5F5F5',
          dark: '#E5E5E5',
        },
        accent: {
          green: '#10B981',
          red: '#EF4444',
          blue: '#3B82F6',
          yellow: '#F59E0B',
        },
        pencil: {
          light: '#6B7280',
          DEFAULT: '#4B5563',
          dark: '#1F2937',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        hand: ['var(--font-caveat)', 'cursive'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      boxShadow: {
        sketch: '0 2px 0 0 rgba(0,0,0,0.1)',
        'sketch-lg': '0 4px 0 0 rgba(0,0,0,0.1)',
      },
      borderRadius: {
        sketch: '2px',
      },
      animation: {
        wiggle: 'wiggle 0.3s ease-in-out',
        burn: 'burn 1s ease-in-out infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-1deg)' },
          '50%': { transform: 'rotate(1deg)' },
        },
        burn: {
          '0%, 100%': { opacity: '1', transform: 'translateY(0)' },
          '50%': { opacity: '0.7', transform: 'translateY(-2px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;

