import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta Hanna-Barbera / Scooby-Doo 70s
        ink: '#1a1f3a',       // midnight: contorn i text principal
        bone: '#f0eada',      // moonbeam: paper antic
        phantom: '#8aa83b',   // avocado: accent legacy reajustat
        haunt: '#6f8f2f',     // avocado fosc
        voltage: '#b94e2c',   // harvest: accent càlid
        pumpkin: '#e8772e',   // pumpkin
        blood: '#b9362c',     // error/alerta
        mist: '#d6e9d3',      // mint cream: panells
        mustard: '#f4c542',
        avocado: '#8aa83b',
        harvest: '#b94e2c',
        midnight: '#1a1f3a',
        moonbeam: '#f0eada',
        // Paleta fantasma clàssic (mascot v5)
        'ghost-white': '#f0f8ff',  // cos lluminescent
        'ghost-blue': '#5fc8ff',   // glow blau elèctric
        'ghost-cyan': '#00e5ff',   // highlight cian
        'ear-pink': '#ffd0e4',     // orelles, rosa pàl·lid
      },
      fontFamily: {
        pixel: ['"Bagel Fat One"', '"Fredoka"', 'system-ui', 'sans-serif'],
        terminal: ['"Fredoka"', '"Atkinson Hyperlegible"', 'system-ui', 'sans-serif'],
        body: ['"Atkinson Hyperlegible"', '"Fredoka"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'flicker': 'flicker 3s linear infinite',
        'scan': 'scan 8s linear infinite',
        'glitch': 'glitch 0.3s ease-in-out',
        'grow': 'grow 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(-1deg)' },
          '50%': { transform: 'translateY(-12px) rotate(1deg)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '42%': { opacity: '1' },
          '43%': { opacity: '0.6' },
          '44%': { opacity: '1' },
          '85%': { opacity: '1' },
          '86%': { opacity: '0.8' },
          '87%': { opacity: '1' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
        grow: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.3)' },
          '100%': { transform: 'scale(1.1)' },
        },
      },
      backgroundImage: {
        'scan-lines': 'repeating-linear-gradient(0deg, rgba(110, 255, 158, 0.03) 0px, rgba(110, 255, 158, 0.03) 1px, transparent 1px, transparent 3px)',
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='a'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23a)' opacity='0.15'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
} satisfies Config
