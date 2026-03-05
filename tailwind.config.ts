import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        command: {
          bg: '#0a0e14',
          secondary: '#111820',
          panel: '#151d28',
          header: '#1a2332',
          border: '#1e2d3d',
          active: '#2a4a6b',
        },
        threat: {
          critical: '#ff2d2d',
          high: '#ff6b35',
          medium: '#ffc107',
          low: '#00e676',
          info: '#2196f3',
        },
        agency: {
          cia: '#1a73e8',
          mossad: '#ffd700',
          aman: '#00c853',
          osint: '#ab47bc',
          irgc: '#ff5722',
        },
        mil: {
          green: '#00ff88',
          amber: '#ffc107',
          red: '#ff2d2d',
          blue: '#2196f3',
        },
        text: {
          primary: '#c8d6e5',
          secondary: '#7f8c9b',
          accent: '#00ff88',
        },
      },
      fontFamily: {
        military: ['Share Tech Mono', 'monospace'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'threat-pulse': 'threat-pulse 1.5s ease-in-out infinite',
        'alert-flash': 'alert-flash 0.5s ease-in-out infinite alternate',
        'ticker': 'ticker-scroll 60s linear infinite',
        'blink': 'blink 1s step-end infinite',
      },
      keyframes: {
        'threat-pulse': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 6px currentColor' },
          '50%': { opacity: '0.4', boxShadow: '0 0 2px currentColor' },
        },
        'alert-flash': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0.2' },
        },
        'ticker-scroll': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        'blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}

export default config
