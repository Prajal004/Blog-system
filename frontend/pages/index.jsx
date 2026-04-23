import { useBlogs } from '../hooks/useBlogs';
import BlogCard from '../components/BlogCard';
import Navbar from '../components/Navbar';
import { AuthProvider } from '../contexts/AuthContext';

function HomePage() {
  const { blogs, loading, error } = useBlogs(false); // false = only published blogs

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container" style={styles.loading}>
          <p>Loading blogs...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="container" style={styles.error}>
          <p>Error: {error}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="container" style={styles.main}>
        <header style={styles.header}>
          <h1>Welcome to BlogMS</h1>
          <p>Discover amazing stories and insights</p>
        </header>
        
        {blogs.length === 0 ? (
          <div style={styles.noBlogs}>
            <p>No blogs published yet. Check back later!</p>
          </div>
        ) : (
          <div>
            {blogs.map(blog => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}

export default function Home() {
  return (
    <AuthProvider>
      <HomePage />
    </AuthProvider>
  );
}

const styles = {
  main: {
    padding: '2rem 0',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
    padding: '2rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '10px',
    color: 'white',
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.2rem',
  },
  error: {
    textAlign: 'center',
    padding: '3rem',
    color: '#dc3545',
  },
  noBlogs: {
    textAlign: 'center',
    padding: '3rem',
    color: '#666',
  },
};