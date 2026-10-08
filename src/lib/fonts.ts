import { Hanken_Grotesk, JetBrains_Mono, Space_Grotesk } from 'next/font/google';

// Self-hosted at build time (no runtime request to Google). Each font is
// exposed as a CSS variable that the stylesheets reference by name.

export const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-hanken',
  display: 'swap',
});

export const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-space',
  display: 'swap',
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const fontVariables = `${hanken.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`;
