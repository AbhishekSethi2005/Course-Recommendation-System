/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          main: '#09090F',
          secondary: '#101019',
          card: '#15151F',
          cardHover: '#1B1B28',
        },
        purple: {
          primary: '#8055FF',
          secondary: '#A78BFA',
          glow: 'rgba(128, 85, 255, 0.15)',
        },
        accent: {
          blue: '#6366F1',
          green: '#23D18B',
        },
        text: {
          primary: '#F5F3FF',
          secondary: '#9694A8',
          muted: '#68667A',
        },
        border: {
          subtle: 'rgba(255, 255, 255, 0.08)',
          glow: 'rgba(128, 85, 255, 0.3)',
        }
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-sm': '0 0 20px -5px rgba(128, 85, 255, 0.25)',
        'glow-md': '0 0 35px -5px rgba(128, 85, 255, 0.3)',
        'glow-lg': '0 0 60px -10px rgba(128, 85, 255, 0.35)',
        'card': '0 10px 30px -5px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.08)',
        'card-hover': '0 20px 40px -10px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(128, 85, 255, 0.4), 0 0 25px -5px rgba(128, 85, 255, 0.25)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'float-medium': 'float 4s ease-in-out infinite 1s',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: 0.6 },
          '50%': { opacity: 1 },
        }
      }
    },
  },
  plugins: [],
}

