import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '../api';

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchBlogs();
    const token = localStorage.getItem('token');
    if (token) {
      const userData = localStorage.getItem('user');
      setUser(JSON.parse(userData));
    }
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await api.getBlogs();
      setBlogs(res.data.blogs);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <div>
      {/* Navbar */}
      <nav style={{ background: '#667eea', padding: '1rem', color: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0 }}>📝 BlogMaster</h2>
          <div>
            <Link href="/" style={{ color: 'white', marginRight: '15px' }}>Home</Link>
            {user ? (
              <>
                <Link href="/dashboard" style={{ color: 'white', marginRight: '15px' }}>Dashboard</Link>
                <button onClick={logout} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                  Logout ({user.username})
                </button>
              </>
            ) : (
              <>
                <Link href="/login" style={{ color: 'white', marginRight: '15px' }}>Login</Link>
                <Link href="/register" style={{ color: 'white' }}>Register</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '4rem 2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Welcome to BlogMaster</h1>
        <p style={{ fontSize: '1.2rem' }}>Share your stories with the world</p>
      </div>

      {/* Blog List */}
      <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 20px' }}>
        <h2 style={{ marginBottom: '2rem' }}>Latest Blogs</h2>
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {blogs.map(blog => (
            <Link key={blog.id} href={`/blogs/${blog.slug}`} style={{ textDecoration: 'none' }}>
              <div style={{ 
                background: 'white', 
                padding: '1.5rem', 
                borderRadius: '10px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <h3 style={{ color: '#333', marginBottom: '0.5rem' }}>{blog.title}</h3>
                <div style={{ color: '#666', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  By {blog.author} • {new Date(blog.createdAt).toLocaleDateString()} • 👁️ {blog.views} views
                </div>
                <p style={{ color: '#555', lineHeight: '1.6' }}>
                  {blog.content.substring(0, 150)}...
                </p>
                {blog.commentCount > 0 && (
                  <div style={{ marginTop: '1rem', color: '#667eea' }}>
                    💬 {blog.commentCount} comments
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}