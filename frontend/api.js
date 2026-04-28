import axios from 'axios';

const API_BASE = 'http://localhost:3001/api';

const api = {
  // Auth
  register: (data) => axios.post(`${API_BASE}/auth/register`, data),
  login: (data) => axios.post(`${API_BASE}/auth/login`, data),
  
  // Blogs
  getBlogs: () => axios.get(`${API_BASE}/blogs`),
  getBlogBySlug: (slug) => axios.get(`${API_BASE}/blogs/${slug}`),
  createBlog: (data, token) => axios.post(`${API_BASE}/blogs`, data, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  updateBlog: (slug, data, token) => axios.put(`${API_BASE}/blogs/${slug}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  deleteBlog: (slug, token) => axios.delete(`${API_BASE}/blogs/${slug}`, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  addComment: (slug, content) => axios.post(`${API_BASE}/blogs/${slug}/comments`, { content })
};

// Add token to all requests
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;