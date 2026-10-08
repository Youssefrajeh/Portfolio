import Link from 'next/link';

// Rendered under the root layout only (no site stylesheet), so it is styled inline.
export default function NotFound() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0c0c0e',
        color: '#e8e8ed',
        padding: '20px',
        textAlign: 'center',
        fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
      }}
    >
      <h1 style={{ fontSize: '2.5rem', marginBottom: '16px', fontWeight: 600 }}>Page Not Found</h1>
      <p style={{ color: '#9b9ba7', marginBottom: '30px', fontSize: '1rem' }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        style={{
          padding: '12px 28px',
          background: '#6e7cff',
          color: '#fff',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: 600,
          fontSize: '0.95rem',
        }}
      >
        Back to Home
      </Link>
    </main>
  );
}
