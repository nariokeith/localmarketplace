import type { Config } from 'tailwindcss';
import daisyui from 'daisyui';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Arial', 'Helvetica', 'sans-serif']
      }
    }
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        marketplace: {
          primary: '#0f766e',
          secondary: '#c86f2b',
          accent: '#3f7d38',
          neutral: '#252525',
          'base-100': '#ffffff',
          'base-200': '#f6f4ef',
          'base-300': '#d8d2c5',
          info: '#2563eb',
          success: '#3f7d38',
          warning: '#c86f2b',
          error: '#b3261e'
        }
      }
    ]
  }
};

export default config;
