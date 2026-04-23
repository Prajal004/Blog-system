import { useState } from 'react';
import { blogService } from '../services/blogService';

export default function CommentSection({ slug, comments: initialComments }) {
  const [comments, setComments] = useState(initialComments || []);
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!author.trim() || !content.trim()) return;

    setSubmitting(true);
    try {
      const response = await blogService.addComment(slug, content, author);
      setComments([response.data.data, ...comments]);
      setAuthor('');
      setContent('');
    } catch (error) {
      console.error('Failed to add comment:', error);
      alert('Failed to add comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Comments ({comments.length})</h3>
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Your name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          style={styles.input}
          required
        />
        <textarea
          placeholder="Write your comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={styles.textarea}
          rows="3"
          required
        />
        <button type="submit" disabled={submitting} style={styles.button}>
          {submitting ? 'Posting...' : 'Post Comment'}
        </button>
      </form>

      <div style={styles.commentsList}>
        {comments.length === 0 ? (
          <p style={styles.noComments}>No comments yet. Be the first to comment!</p>
        ) : (
          comments.map(comment => (
            <div key={comment.id} style={styles.comment}>
              <div style={styles.commentHeader}>
                <strong>{comment.author}</strong>
                <span style={styles.commentDate}>{formatDate(comment.createdAt)}</span>
              </div>
              <p style={styles.commentContent}>{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    marginTop: '2rem',
    padding: '1.5rem',
    background: '#f9f9f9',
    borderRadius: '10px',
  },
  title: {
    marginBottom: '1rem',
    color: '#333',
  },
  form: {
    marginBottom: '2rem',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    marginBottom: '1rem',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '1rem',
  },
  textarea: {
    width: '100%',
    padding: '0.75rem',
    marginBottom: '1rem',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '1rem',
    resize: 'vertical',
  },
  button: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  commentsList: {
    marginTop: '1rem',
  },
  comment: {
    background: 'white',
    padding: '1rem',
    marginBottom: '1rem',
    borderRadius: '5px',
    border: '1px solid #e0e0e0',
  },
  commentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.5rem',
    color: '#667eea',
  },
  commentDate: {
    fontSize: '0.85rem',
    color: '#999',
  },
  commentContent: {
    color: '#555',
    lineHeight: '1.5',
  },
  noComments: {
    textAlign: 'center',
    color: '#999',
    padding: '2rem',
  },
};