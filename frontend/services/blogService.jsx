import api from './api';

export const blogService = {
  getAll: (includeDrafts = false) => 
    api.get(`/blogs${includeDrafts ? '?includeDrafts=true' : ''}`),
  
  getBySlug: (slug) => 
    api.get(`/blogs/${slug}`),
  
  create: (data) => 
    api.post('/blogs', data),
  
  update: (slug, data) => 
    api.put(`/blogs/${slug}`, data),
  
  delete: (slug) => 
    api.delete(`/blogs/${slug}`),
  
  addComment: (slug, content, author) => 
    api.post(`/blogs/${slug}/comments`, { content, author }),
  
  getComments: (slug) => 
    api.get(`/blogs/${slug}/comments`),
};