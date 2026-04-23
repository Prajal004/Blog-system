import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { blogService } from '../../../services/blogService';
import Navbar from '../../../components/Navbar';
import { AuthProvider } from '../../../contexts/AuthContext';
import PrivateRoute from '../../../components/PrivateRoute';

function EditPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('published');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      blogService.getBySlug(slug).then(res => {
        const blog = res.data.data;
        setTitle(blog.title);
        setContent(blog.content);
        setStatus(blog.status);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await blogService.update(slug, { title, content, status });
    router.push('/admin/dashboard');
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
        <h1>Edit Blog</h1>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
              required
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label>Content</label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              rows="10"
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
              required
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label>Status</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <button type="submit" style={{ padding: '0.5rem 1rem', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px' }}>
            Update Blog
          </button>
        </form>
      </div>
    </>
  );
}

export default function Edit() {
  return (
    <AuthProvider>
      <PrivateRoute>
        <EditPage />
      </PrivateRoute>
    </AuthProvider>
  );
}
