import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import { blogService } from '../../services/blogService';
import Navbar from '../../components/Navbar';
import Link from 'next/link';
import { AuthProvider } from '../../contexts/AuthContext';

function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchBlogs();
    }
  }, [user]);

  const fetchBlogs = async () => {
    try {
      const response = await blogService.getAll(true); // Include drafts
      setBlogs(response.data.data);
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slug) => {
    if (confirm('Are you sure you want to delete this blog?')) {
      try {
        await blogService.delete(slug);
        fetchBlogs();
      } catch (error) {
        alert('Failed to delete blog');
      }
    }
  };

  if (authLoading || loading) {
    return (
      <>
        <Navbar />
        <div className="container" style={styles.loading}>
          <p>Loading...</p>
        </div>
      </>
    );
  }

  if (!user) return null;

  return (
    <>
      <Navbar />
      <div className="container" style={styles.container}>
        <div style={styles.header}>
          <h1>Dashboard</h1>
          <Link href="/admin/create" style={styles.createButton}>
            + Create New Blog
          </Link>
        </div>

        {blogs.length === 0 ? (
          <div style={styles.noBlogs}>
            <p>You haven't created any blogs yet.</p>
            <Link href="/admin/create">Create your first blog →</Link>
          </div>
        ) : (
          <div style={styles.blogList}>
            {blogs.map(blog => (
              <div key={blog.id} style={styles.blogItem}>
                <div style={styles.blogInfo}>
                  <h3 style={styles.blogTitle}>
                    <Link href={`/blogs/${blog.slug}`}>{blog.title}</Link>
                  </h3>
                  <div style={styles.blogMeta}>
                    <span>Status: {blog.status === 'published' ? '✅ Published' : '📝 Draft'}</span>
                    <span>Comments: {blog.comments?.length || 0}</span>
                    <span>Date: {new Date(blog.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div style={styles.blogActions}>
                  <Link href={`/admin/edit/${blog.slug}`} style={styles.editButton}>
                    Edit
                  </Link>
                  <button onClick={() => handleDelete(blog.slug)} style={styles.deleteButton}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default function Dashboard() {
  return (
    <AuthProvider>
      <DashboardPage />
    </AuthProvider>
  );
}

const styles = {
  container: {
    padding: '2rem 0',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  createButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#28a745',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '5px',
  },
  blogList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  blogItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem',
    background: 'white',
    borderRadius: '10px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  blogInfo: {
    flex: 1,
  },
  blogTitle: {
    marginBottom: '0.5rem',
  },
  blogMeta: {
    display: 'flex',
    gap: '1rem',
    fontSize: '0.85rem',
    color: '#666',
  },
  blogActions: {
    display: 'flex',
    gap: '0.5rem',
  },
  editButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#ffc107',
    color: '#333',
    textDecoration: 'none',
    borderRadius: '5px',
  },
  deleteButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
  },
  noBlogs: {
    textAlign: 'center',
    padding: '3rem',
    background: 'white',
    borderRadius: '10px',
  },
};