import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '1.5rem',
			screens: { '2xl': '1360px' }
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
				secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
				destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
				muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
				accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
				popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
				card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },

				/* ── Bar palette ─────────────────────────────────────────
				   roast   : the room, darkest → raised surfaces
				   cream    : milk, all body copy
				   crema    : the CTA — pulled-shot amber
				   steam    : cool counterpoint for "resting" states
				   copper  : machine trim / secondary accent           */
				roast: {
					950: '#0D0907',
					900: '#150F0B',
					800: '#1F1712',
					700: '#2C211A',
					600: '#3B2D23',
					500: '#4E3C2F',
				},
				cream: {
					DEFAULT: '#F4E7D6',
					bright: '#FFF8EE',
					dim: '#BFAA93',
					mute: '#8C7A68',
				},
				crema: {
					DEFAULT: '#E9A64A',
					bright: '#F7C177',
					deep: '#C97B2B',
				},
				steam: {
					DEFAULT: '#9FB9AE',
					deep: '#6E8B80',
				},
				copper: {
					DEFAULT: '#B87333',
					dim: '#8A5626',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			fontFamily: {
				display: ['"Playfair Display"', 'Georgia', 'serif'],
				body: ['"Source Serif 4"', 'Georgia', 'serif'],
				mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
				/* legacy aliases so any untouched shadcn primitive still resolves */
				serif: ['"Playfair Display"', 'Georgia', 'serif'],
				sans: ['"Source Serif 4"', 'Georgia', 'serif'],
			},
			boxShadow: {
				soft: '0 4px 20px rgba(0, 0, 0, 0.45)',
				menu: '0 8px 30px rgba(0, 0, 0, 0.55)',
				lift: '0 24px 48px -24px rgba(0, 0, 0, 0.9)',
				glow: '0 0 40px -8px rgba(233, 166, 74, 0.55)',
			},
			keyframes: {
				'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
				'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
				'breathe': {
					'0%, 100%': { opacity: '0.25', transform: 'scale(1)' },
					'50%': { opacity: '0.6', transform: 'scale(1.5)' }
				},
				'rise': {
					'0%': { opacity: '0', transform: 'translateY(18px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'breathe': 'breathe 4.5s ease-in-out infinite',
				'rise': 'rise 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards',
			},
			transitionTimingFunction: {
				'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
