import { fontFamily } from "tailwindcss/defaultTheme";
import type { Config } from "tailwindcss";

const config: Config = {
	darkMode: ["class"],
	content: ["./src/**/*.{html,js,svelte,ts}"],
	safelist: ["dark"],
	theme: {
		fontFamily: {
			sans: ["Inter", ...fontFamily.sans],
		},
		extend: {
		  colors: {
			main: 'var(--main)',
			overlay: 'var(--overlay)',
			bg: 'var(--bg)',
			bw: 'var(--bw)',
			blank: 'var(--blank)',
			text: 'var(--text)',
			mtext: 'var(--mtext)',
			border: 'var(--border)',
			ring: 'var(--ring)',
			ringOffset: 'var(--ring-offset)',
			
			secondaryBlack: '#212121', 
		  },
		  borderRadius: {
			base: '5px'
		  },
		  boxShadow: {
			shadow: 'var(--shadow)'
		  },
		  translate: {
			boxShadowX: '4px',
			boxShadowY: '4px',
			reverseBoxShadowX: '-4px',
			reverseBoxShadowY: '-4px',
		  },
		  fontWeight: {
			base: '500',
			heading: '700',
		  },
		},
	  },
};

export default config;
