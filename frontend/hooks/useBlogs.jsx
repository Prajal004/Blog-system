import { useState, useEffect } from 'react';
import { blogService } from '../services/blogService';

export const useBlogs = (includeDrafts = false) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, [includeDrafts]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await blogService.getAll(includeDrafts);
      setBlogs(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  return { blogs, loading, error, refetch: fetchBlogs };
};