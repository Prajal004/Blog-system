import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import api from '../api';

export default function Dashboard() {
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('published');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }
    
    setUser(JSON.parse(userData));
    fetchMyBlogs();
  }, []);

  const fetchMyBlogs = async () => {
    try {
      const res = await api.getBlogs();
      const myBlogs = res.data.blogs.filter(b => b.authorId === user?.id);
      setBlogs(myBlogs);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const createBlog = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      await api.createBlog({ title, content, status }, token);
      setTitle('');
      setContent('');
      fetchMyBlogs();
      alert('Blog created successfully!');
    } catch (err) {
      alert('Failed to create blog');
    }
  };

  const deleteBlog = async (slug) => {
    if (!confirm('Are you sure?')) return;
    const token = localStorage.getItem('token');
    
    try {
      await api.deleteBlog(slug, token);
      fetchMyBlogs();
    } catch (err) {
      alert('Failed to delete');
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <nav style={{ background: '#667eea', padding: '1rem', color: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between' }}>
          <h2>Dashboard - {user.username}</h2>
          <div>
            <Link href="/" style={{ color: 'white', marginRight: '15px' }}>Home</Link>
            <button onClick={() => {
              localStorage.clear();
              router.push('/');
            }} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 20px' }}>
        <div style={{ background: 'white', borderRadius: '10px', padding: '2rem', marginBottom: '2rem' }}>
          <h3>Create New Blog</h3>
          <form onSubmit={createBlog}>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '5px' }}
              required
            />
            <textarea
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="10"
              style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '5px' }}
              required
            />
            <select 
              value={status} 
              onChange={(e) => setStatus(e.target.value)}
              style={{ padding: '0.5rem', marginRight: '1rem', borderRadius: '5px' }}
            >
              <option value="published">Publish</option>
              <option value="draft">Save as Draft</option>
            </select>
            <button type="submit" style={{ background: '#667eea', color: 'white', border: 'none', padding: '0.5rem 1.5rem', borderRadius: '5px', cursor: 'pointer' }}>
              Create Blog
            </button>
          </form>
        </div>

        <h3>My Blogs</h3>
        {blogs.map(blog => (
          <div key={blog.id} style={{ background: 'white', borderRadius: '10px', padding: '1.5rem', marginBottom: '1rem', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
            <h4>{blog.title} {blog.status === 'draft' && <span style={{ color: 'orange', fontSize: '0.875rem' }}>(Draft)</span>}</h4>
            <p style={{ color: '#666', marginBottom: '1rem' }}>{blog.content.substring(0, 100)}...</p>
            <div>
              <Link href={`/blogs/${blog.slug}`}>
                <button style={{ background: '#667eea', color: 'white', border: 'none', padding: '0.25rem 1rem', borderRadius: '3px', marginRight: '0.5rem', cursor: 'pointer' }}>
                  View
                </button>
              </Link>
              <button onClick={() => deleteBlog(blog.slug)} style={{ background: '#e53e3e', color: 'white', border: 'none', padding: '0.25rem 1rem', borderRadius: '3px', cursor: 'pointer' }}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}