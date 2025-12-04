import type { Config } from "tailwindcss";

const config: Config = {
	darkMode: ["class", '[data-theme="dark"]'],
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			fontFamily: {
				sans: [
					"Inter var, Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
				],
				inter: [
					'Inter',
					'sans-serif'
				]
			},
			screens: {
				xs: '375px'
			},
			spacing: {
				touch: '48px',
				'13': '3.25rem',
				'15': '3.75rem',
				'16': '4rem',
				'17': '4.25rem',
				'18': '4.5rem',
				'19': '4.75rem',
				'21': '5.25rem',
				'22': '5.5rem',
				'25': '6.25rem',
				'27': '6.75rem',
				'29': '7.25rem',
				'30': '7.5rem',
				'35': '8.75rem',
				'40': '10rem',
				'45': '11.25rem',
				'46': '11.5rem',
				'50': '12.5rem',
				'55': '13.75rem',
				'60': '15rem',
				'65': '16.25rem',
				'67': '16.75rem',
				'90': '22.5rem',
				'4.5': '1.125rem',
				'5.5': '1.375rem',
				'6.5': '1.625rem',
				'7.5': '1.875rem',
				'8.5': '2.125rem',
				'10.5': '2.625rem',
				'11.5': '2.875rem',
				'12.5': '3.125rem',
				'13.5': '3.375rem',
				'14.5': '3.625rem',
				'15.5': '3.875rem',
				'17.5': '4.375rem',
				'18.5': '4.625rem',
				'21.5': '5.375rem',
				'22.5': '5.625rem',
				'27.5': '6.875rem',
				'29.5': '7.375rem',
				'32.5': '8.125rem',
				'37.5': '9.375rem',
				'42.5': '10.625rem',
				'47.5': '11.875rem',
				'67.5': '16.875rem'
			},
			colors: {
				primary: {
					DEFAULT: 'var(--primary)',
					foreground: 'var(--primary-foreground)'
				},
				secondary: {
					DEFAULT: 'var(--secondary)',
					foreground: 'var(--secondary-foreground)'
				},
				current: 'currentColor',
				transparent: 'transparent',
				stroke: '#EEEEEE',
				strokedark: '#2D2F40',
				hoverdark: '#252A42',
				titlebg: '#ADFFF8',
				titlebg2: '#FFEAC2',
				titlebgdark: '#46495A',
				btndark: '#292E45',
				white: '#FFFFFF',
				black: '#181C31',
				blackho: '#2C3149',
				blacksection: '#1C2136',
				primaryho: '#0063EC',
				meta: '#20C5A8',
				waterloo: '#757693',
				manatee: '#999AA1',
				alabaster: '#FBFBFB',
				zumthor: '#EDF5FF',
				socialicon: '#D1D8E0',
				moroccan: {
					mint: {
						DEFAULT: '#00D4AA',
						50: '#E6FAF5',
						100: '#B3F0E3',
						200: '#80E6D1',
						300: '#4DDCBF',
						400: '#1AD2AD',
						500: '#00D4AA',
						600: '#00B08E',
						700: '#008C72',
						800: '#006856',
						900: '#00443A'
					},
					gold: {
						DEFAULT: '#D4AF37',
						light: '#E8C968',
						dark: '#A68A2B'
					},
					amber: '#F39C12',
					saffron: '#E67E22',
					blue: {
						chefchaouen: '#0080C8',
						indigo: '#2C5F7C',
						midnight: '#1A3A52'
					},
					earth: {
						terracotta: '#C8756C',
						clay: '#B85450',
						sand: '#E8D5C4',
						beige: '#D4C4B0'
					},
					sage: {
						DEFAULT: '#8FBC8F',
						dark: '#6B8E6B'
					},
					teal: {
						DEFAULT: '#009688',
						light: '#4DB6AC',
						dark: '#00796B'
					}
				},
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			fontSize: {
				metatitle: [
					'12px',
					'20px'
				],
				sectiontitle: [
					'14px',
					'22px'
				],
				regular: [
					'16px',
					'26px'
				],
				metatitle3: [
					'18px',
					'26px'
				],
				metatitle2: [
					'20px',
					'32px'
				],
				para2: [
					'22px',
					'35px'
				],
				itemtitle: [
					'26px',
					'32px'
				],
				itemtitle2: [
					'24px',
					'32px'
				],
				hero: [
					'44px',
					'58px'
				],
				sectiontitle3: [
					'44px',
					'55px'
				],
				sectiontitle2: [
					'40px',
					'52px'
				],
				sectiontitle4: [
					'34px',
					'48px'
				]
			},
			maxWidth: {
				'c-1390': '86.875rem',
				'c-1315': '82.188rem',
				'c-1280': '80rem',
				'c-1235': '77.188rem',
				'c-1154': '72.125rem',
				'c-1016': '63.5rem'
			},
			zIndex: {
				'1': '1',
				'999': '999',
				'99999': '99999'
			},
			opacity: {
				'65': '.65'
			},
			transitionProperty: {
				width: 'width'
			},
			boxShadow: {
				'solid-l': '0px 10px 120px 0px rgba(45, 74, 170, 0.1)',
				'solid-2': '0px 2px 10px rgba(122, 135, 167, 0.05)',
				'solid-3': '0px 6px 90px rgba(8, 14, 40, 0.04)',
				'solid-4': '0px 6px 90px rgba(8, 14, 40, 0.1)',
				'solid-5': '0px 8px 24px rgba(45, 74, 170, 0.08)',
				'solid-6': '0px 8px 24px rgba(10, 16, 35, 0.08)',
				'solid-7': '0px 30px 50px rgba(45, 74, 170, 0.1)',
				'solid-8': '0px 12px 120px rgba(45, 74, 170, 0.06)',
				'solid-9': '0px 12px 30px rgba(45, 74, 170, 0.06)',
				'solid-10': '0px 8px 30px rgba(45, 74, 170, 0.06)',
				'solid-11': '0px 6px 20px rgba(45, 74, 170, 0.05)',
				'solid-12': '0px 2px 10px rgba(0, 0, 0, 0.05)',
				'solid-13': '0px 2px 19px rgba(0, 0, 0, 0.05)'
			},
			keyframes: {
				line: {
					'0%, 100%': {
						transform: 'translateY(100%)'
					},
					'50%': {
						transform: 'translateY(0)'
					}
				},
				'bounce-x': {
					'0%, 100%': {
						transform: 'translateX(0)'
					},
					'50%': {
						transform: 'translateX(25%)'
					}
				},
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				line1: 'line 3s linear infinite',
				line2: 'line 6s linear infinite',
				line3: 'line 9s linear infinite',
				'bounce-x': 'bounce-x 1s infinite',
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
			}
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		// RTL support plugin
		function ({ addVariant }: any) {
			addVariant('rtl', '[dir="rtl"] &');
			addVariant('ltr', '[dir="ltr"] &');
		}
	],
};

export default config;
