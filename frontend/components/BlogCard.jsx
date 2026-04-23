import Link from 'next/link';

export default function BlogCard({ blog }) {
  const truncateContent = (content, length = 150) => {
    const plainText = content.replace(/<[^>]*>/g, '');
    if (plainText.length <= length) return plainText;
    return plainText.substring(0, length) + '...';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <article style={styles.card}>
      <Link href={`/blogs/${blog.slug}`} style={styles.link}>
        <h2 style={styles.title}>{blog.title}</h2>
      </Link>
      <div style={styles.meta}>
        <span>✍️ {blog.author}</span>
        <span>📅 {formatDate(blog.createdAt)}</span>
        {blog.status === 'draft' && (
          <span style={styles.draft}>📝 Draft</span>
        )}
      </div>
      <p style={styles.snippet}>{truncateContent(blog.content)}</p>
      {blog.tags && blog.tags.length > 0 && (
        <div style={styles.tags}>
          {blog.tags.map(tag => (
            <span key={tag.id} style={styles.tag}>#{tag.name}</span>
          ))}
        </div>
      )}
      <Link href={`/blogs/${blog.slug}`} style={styles.readMore}>
        Read More →
      </Link>
    </article>
  );
}

const styles = {
  card: {
    background: 'white',
    borderRadius: '10px',
    padding: '1.5rem',
    marginBottom: '1.5rem',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s',
  },
  title: {
    color: '#333',
    marginBottom: '0.5rem',
    fontSize: '1.5rem',
  },
  link: {
    textDecoration: 'none',
  },
  meta: {
    color: '#666',
    fontSize: '0.9rem',
    marginBottom: '1rem',
    display: 'flex',
    gap: '1rem',
  },
  draft: {
    backgroundColor: '#ffc107',
    padding: '0.2rem 0.5rem',
    borderRadius: '3px',
    fontSize: '0.8rem',
  },
  snippet: {
    color: '#555',
    lineHeight: '1.6',
    marginBottom: '1rem',
  },
  tags: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1rem',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#e9ecef',
    padding: '0.2rem 0.6rem',
    borderRadius: '3px',
    fontSize: '0.85rem',
    color: '#495057',
  },
  readMore: {
    color: '#667eea',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
};