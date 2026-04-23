const validateBlog = (data) => {
  const errors = [];
  
  if (!data.title || data.title.trim().length < 3) {
    errors.push('Title is required and must be at least 3 characters');
  }
  
  if (!data.content || data.content.trim().length < 10) {
    errors.push('Content is required and must be at least 10 characters');
  }
  
  if (!data.author || data.author.trim().length < 2) {
    errors.push('Author name is required');
  }
  
  if (data.status && !['draft', 'published'].includes(data.status)) {
    errors.push('Status must be either draft or published');
  }
  
  return {
    error: errors.length > 0 ? { details: errors.map(e => ({ message: e })) } : null,
    value: data,
  };
};

module.exports = { validateBlog };