/** Free hosting tiers that put idle apps to sleep, so the first request is slow. */
const SLEEPING_HOSTS = ['onrender.com'];

export const DEMO_WAKE_NOTE = 'Hosted on a free tier: the first load can take up to a minute while it wakes up.';

export function demoMaySleep(url: string | undefined): boolean {
  if (!url) return false;
  const { hostname } = new URL(url);
  return SLEEPING_HOSTS.some((host) => hostname === host || hostname.endsWith(`.${host}`));
}
