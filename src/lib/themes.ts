// Single source of truth for selectable themes. `swatch` is [background, accent]
// for the preview dot in the picker. Token values live in src/styles:
// globals.css (light/dark), neumorphism.css, themes.css and theme-styles.css.
export const THEMES = [
  { id: 'light', label: 'Light', swatch: ['#f7f7f8', '#0f766e'] },
  { id: 'dark', label: 'Dark', swatch: ['#0c0c0e', '#2dd4bf'] },
  { id: 'neu', label: 'Neumorphic', swatch: ['#e0e5ec', '#5766e8'] },
  { id: 'glass', label: 'Glass', swatch: ['#962fbf', '#ff9ad5'] },
  { id: 'neon', label: 'Neon', swatch: ['#0a0a14', '#00f0ff'] },
  { id: 'brutal', label: 'Brutalist', swatch: ['#fff7d6', '#ff5a36'] },
  { id: 'nord', label: 'Nord', swatch: ['#2e3440', '#88c0d0'] },
  { id: 'dracula', label: 'Dracula', swatch: ['#282a36', '#bd93f9'] },
  { id: 'sepia', label: 'Sepia', swatch: ['#f4ecd8', '#b5651d'] },
  { id: 'forest', label: 'Forest', swatch: ['#16211b', '#7bc47f'] },
] as const;

export type Theme = (typeof THEMES)[number]['id'];

export const THEME_IDS: readonly Theme[] = THEMES.map((t) => t.id);
export const DEFAULT_THEME: Theme = 'light';

export function isTheme(value: string | null): value is Theme {
  return value !== null && (THEME_IDS as readonly string[]).includes(value);
}
