import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          950: '#020617',
          900: '#0f172a',
          800: '#1e293b',
        },
        brand: {
          teal: '#14b8a6',
          cyan: '#06b6d4',
          amber: '#f59e0b',
          emerald: '#10b981',
          rose: '#f43f5e',
        }
      },
      boxShadow: {
        glow: '0 0 25px -5px rgba(20, 184, 166, 0.25)',
        'glow-lg': '0 0 40px -10px rgba(20, 184, 166, 0.4)',
        'glow-amber': '0 0 25px -5px rgba(245, 158, 11, 0.3)',
        'light-card': '0 10px 30px -5px rgba(0, 0, 0, 0.05)',
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
        'radial-glow': 'radial-gradient(circle at 50% 0%, rgba(20, 184, 166, 0.15), transparent 70%)',
        'radial-glow-light': 'radial-gradient(circle at 50% 0%, rgba(20, 184, 166, 0.08), transparent 70%)',
      }
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        hstu: {
          "primary": "#14b8a6",
          "secondary": "#06b6d4",
          "accent": "#f59e0b",
          "neutral": "#1e293b",
          "base-100": "#090d16",
          "base-200": "#0f172a",
          "base-300": "#1e293b",
          "info": "#38bdf8",
          "success": "#10b981",
          "warning": "#fbbf24",
          "error": "#f43f5e",
        },
        light: {
          "primary": "#0d9488",
          "secondary": "#0891b2",
          "accent": "#d97706",
          "neutral": "#f1f5f9",
          "base-100": "#ffffff",
          "base-200": "#f8fafc",
          "base-300": "#e2e8f0",
          "info": "#0284c7",
          "success": "#059669",
          "warning": "#d97706",
          "error": "#e11d48",
        }
      },
    ],
    darkTheme: "hstu",
  },
}
