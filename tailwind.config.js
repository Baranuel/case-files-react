/** @type {import('tailwindcss').Config} */

export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
		  typography: {
			DEFAULT: {
			  css: {
				color: '#4a4643', // Matching the list text color from your config
				p: {
					fontSize: '0.95rem',
					lineHeight: '1.5rem',
					marginTop: '0.5rem',
					marginBottom: '0.5rem',
					fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
					color: '#4a4643',
				},
				h1: {
					color: '#462D14', // Matching your arrow color
					fontWeight: '600',
					marginTop: '0.5rem',
					marginBottom: '0.5rem',
				},
				h2: {
					color: '#462D14',
					fontWeight: '600',
					marginTop: '0.5rem',
					marginBottom: '0.5rem',
				},
				h3: {
					color: '#462D14',
					fontWeight: '600',
					marginTop: '0.5rem',
					marginBottom: '0.5rem',
				},
				ul: {
					marginTop: '0.5rem',
					marginBottom: '0.5rem',
					'> li': {
						fontSize: '0.95rem',
						lineHeight: '1.2rem',
						marginBottom: '0.5rem',
						color: '#4a4643',
						'&::marker': {
							color: '#462D14',
						},
					},
				},
				blockquote: {
					fontStyle: 'italic',
					backgroundColor: 'rgb(113 63 18 / 0.05)',
					color: '#462D14',
					borderLeftColor: '#462D14',
					borderLeftWidth: '0.25rem',
					padding: '0.75rem 1rem',
					margin: '0.5rem 0',
					borderRadius: '0.25rem',
					quotes: '"\\201C""\\201D""\\2018""\\2019"',
					'> p': {
						marginTop: '0.5rem',
						marginBottom: '0.5rem',
					}
				},
				a: {
					color: '#462D14',
					'&:hover': {
						color: '#6b4423',
					},
				},
				hr: {
					borderColor: '#e5e5e5',
					marginTop: '0.5rem',
					marginBottom: '0.5rem',
				},
				strong: {
					color: '#462D14',
					fontWeight: '600',
				},
				code: {
					'> span': {
						backgroundColor: '#462D14',
						color: '#fff',
					},
					'&::before': {
						display: 'none',
					},
					'&::after': {
						display: 'none',
					},
					padding: '0.2rem 0.4rem',
					borderRadius: '0.2rem',
					fontSize: '0.9em',
					backgroundColor: '#462D14',
				},
			  },
			},
		  },
		},
	  },
	plugins: [ require('@tailwindcss/typography')],
}
