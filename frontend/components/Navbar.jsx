import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav style={styles.nav}>
      <div className="container" style={styles.container}>
        <Link href="/" style={styles.logo}>
          📝 BlogMS
        </Link>
        <div style={styles.links}>
          <Link href="/" style={styles.link}>Home</Link>
          {user ? (
            <>
              <Link href="/admin/dashboard" style={styles.link}>Dashboard</Link>
              <Link href="/admin/create" style={styles.link}>Write Blog</Link>
              <span style={styles.user}>👤 {user.username}</span>
              <button onClick={logout} style={styles.button}>Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" style={styles.link}>Login</Link>
              <Link href="/register" style={styles.link}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '1rem 0',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    color: 'white',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    textDecoration: 'none',
  },
  links: {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'center',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    transition: 'opacity 0.3s',
  },
  button: {
    padding: '0.5rem 1rem',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  user: {
    color: '#ffd700',
    fontWeight: 'bold',
  },
};