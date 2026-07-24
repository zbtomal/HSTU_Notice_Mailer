import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
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
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
        'radial-glow': 'radial-gradient(circle at 50% 0%, rgba(20, 184, 166, 0.15), transparent 70%)',
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
      },
      "dark",
      "dim"
    ],
    darkTheme: "hstu",
  },
}
