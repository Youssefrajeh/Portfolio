// Site-wide constants shared by metadata, structured data and both UIs.

export const SITE_URL = 'https://youssefrajeh.com';

export const CONTACT = {
  email: 'youssefrrajeh@gmail.com',
  phone: '+1 (548) 388-4360',
  location: 'London, Ontario, Canada',
  github: 'https://github.com/Youssefrajeh',
  linkedin: 'https://www.linkedin.com/in/youssefrajeh',
} as const;

export const CV_PATH = '/Youssef Rajeh.pdf';

/** Formspree endpoint used by both contact forms (no backend required). */
export const CONTACT_FORM_ENDPOINT = 'https://formspree.io/f/mvgrongo';

/**
 * The retro desktop lives under a different root layout group with its own
 * global CSS (Tailwind + Win95 styles). Link to it - and back from it - with a
 * plain <a> so the browser does a full page load and the two stylesheets
 * never coexist in one document.
 */
export const RETRO_PATH = '/retro/';
