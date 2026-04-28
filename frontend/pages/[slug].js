import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import api from '../../api';

export default function BlogDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [user, setUser] = useState(null);
  const [tag, seTag] =useState([]);

  useEffect(() => {
    if (slug) {
      fetchBlog();
    }
    const token = localStorage.getItem('token');
    if (token) {
      const userData = localStorage.getItem('user');
      setUser(JSON.parse(userData));
    }
  }, [slug]);

  const fetchBlog = async () => {
    try {
      const res = await api.getBlogBySlug(slug);
      setBlog(res.data.blog);
      setComments(res.data.comments || []);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const postComment = async () => {
    if (!newComment.trim()) return;
    
    try {
      const res = await api.addComment(slug, newComment);
      setComments([res.data.comment, ...comments]);
      setNewComment('');
    } catch (err) {
      alert('Failed to post comment. Please login again.');
    }
  };

  if (!blog) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;

  return (
    <div>
      {/* Navbar */}
      <nav style={{ background: '#667eea', padding: '1rem', color: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Link href="/" style={{ color: 'white' }}>← Back to Home</Link>
        </div>
      </nav>

      {/* Blog Content */}
      <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 20px' }}>
        <article style={{ background: 'white', borderRadius: '10px', padding: '2rem', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#333' }}>{blog.title}</h1>
          <div style={{ color: '#666', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid #eee' }}>
            By {blog.author} • {new Date(blog.createdAt).toLocaleDateString()} • 👁️ {blog.views} views
          </div>
          <div style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#444' }}>
            {blog.content.split('\n').map((paragraph, i) => (
              <p key={i} style={{ marginBottom: '1rem' }}>{paragraph}</p>
            ))}
          </div>
        </article>

        {/* Comments Section */}
        <div style={{ marginTop: '2rem', background: 'white', borderRadius: '10px', padding: '2rem', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Comments ({comments.length})</h3>
          
          {user ? (
            <div style={{ marginBottom: '2rem' }}>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                rows="3"
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '5px', marginBottom: '0.5rem' }}
              />
              <button 
                onClick={postComment}
                style={{ background: '#667eea', color: 'white', border: 'none', padding: '0.5rem 1.5rem', borderRadius: '5px', cursor: 'pointer' }}
              >
                Post Comment
              </button>
            </div>
          ) : (
            <p style={{ marginBottom: '2rem' }}>
              <Link href="/login">Login</Link> to leave a comment
            </p>
          )}
          
          <div>
            {comments.map(comment => (
              <div key={comment.id} style={{ borderBottom: '1px solid #eee', padding: '1rem 0' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  {comment.author} • <span style={{ fontSize: '0.875rem', color: '#666' }}>
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p style={{ color: '#555' }}>{comment.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}