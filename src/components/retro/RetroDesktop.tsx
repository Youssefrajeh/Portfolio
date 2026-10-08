'use client';

import dynamic from 'next/dynamic';

// The desktop is a fully interactive client app whose initial layout depends
// on the viewport (windows auto-maximize on phones), so it is rendered on the
// client only - pre-rendering it would just produce a hydration mismatch.
const Desktop = dynamic(() => import('./Desktop'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-[#008080]" aria-busy="true" />,
});

export default function RetroDesktop() {
  return <Desktop />;
}
