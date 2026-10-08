'use client';

import { useEffect, useState } from 'react';

const SHOW_AFTER_PX = 300;

/** Resets scroll on mount and shows a floating "back to top" button. */
export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const handleScroll = () => setVisible(window.scrollY > SHOW_AFTER_PX);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <button
      type="button"
      className={`scroll-top${visible ? ' visible' : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Scroll to top"
      tabIndex={visible ? 0 : -1}
    >
      <i className="fas fa-arrow-up" aria-hidden="true"></i>
    </button>
  );
}
