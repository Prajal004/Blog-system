import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { blogService } from '../../services/blogService';
import Navbar from '../../components/Navbar';
import CommentSection from '../../components/CommentSection';
import { AuthProvider } from '../../contexts/AuthContext';

function BlogDetailPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await blogService.getBySlug(slug);
      setBlog(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Blog not found');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container" style={styles.loading}>
          <p>Loading blog...</p>
        </div>
      </>
    );
  }

  if (error || !blog) {
    return (
      <>
        <Navbar />
        <div className="container" style={styles.error}>
          <h1>404</h1>
          <p>{error || 'Blog not found'}</p>
          <button onClick={() => router.push('/')} style={styles.button}>
            Go Back Home
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <article className="container" style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.title}>{blog.title}</h1>
          <div style={styles.meta}>
            <span>✍️ {blog.author}</span>
            <span>📅 {formatDate(blog.createdAt)}</span>
            {blog.status === 'draft' && (
              <span style={styles.draft}>📝 Draft</span>
            )}
          </div>
          {blog.tags && blog.tags.length > 0 && (
            <div style={styles.tags}>
              {blog.tags.map(tag => (
                <span key={tag.id} style={styles.tag}>#{tag.name}</span>
              ))}
            </div>
          )}
        </header>
        
        <div style={styles.content}>
          {blog.content.split('\n').map((paragraph, index) => (
            <p key={index} style={styles.paragraph}>
              {paragraph}
            </p>
          ))}
        </div>

        <CommentSection slug={slug} comments={blog.comments || []} />
      </article>
    </>
  );
}

export default function BlogDetail() {
  return (
    <AuthProvider>
      <BlogDetailPage />
    </AuthProvider>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem 0',
  },
  header: {
    marginBottom: '2rem',
    paddingBottom: '1rem',
    borderBottom: '2px solid #e0e0e0',
  },
  title: {
    fontSize: '2.5rem',
    color: '#333',
    marginBottom: '1rem',
  },
  meta: {
    display: 'flex',
    gap: '1rem',
    color: '#666',
    marginBottom: '1rem',
  },
  draft: {
    backgroundColor: '#ffc107',
    padding: '0.2rem 0.5rem',
    borderRadius: '3px',
    fontSize: '0.85rem',
  },
  tags: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#e9ecef',
    padding: '0.2rem 0.6rem',
    borderRadius: '3px',
    fontSize: '0.85rem',
    color: '#495057',
  },
  content: {
    fontSize: '1.1rem',
    lineHeight: '1.8',
    color: '#444',
  },
  paragraph: {
    marginBottom: '1.5rem',
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
  },
  error: {
    textAlign: 'center',
    padding: '3rem',
  },
  button: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '1rem',
  },
};