const validateRegister = (data) => {
  const errors = [];
  
  if (!data.username || data.username.length < 3) {
    errors.push('Username must be at least 3 characters');
  }
  
  if (!data.email || !/^\S+@\S+\.\S+$/.test(data.email)) {
    errors.push('Valid email is required');
  }
  
  if (!data.password || data.password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }
  
  return {
    error: errors.length > 0 ? { details: errors.map(e => ({ message: e })) } : null,
    value: data,
  };
};

const validateLogin = (data) => {
  const errors = [];
  
  if (!data.email) {
    errors.push('Email is required');
  }
  
  if (!data.password) {
    errors.push('Password is required');
  }
  
  return {
    error: errors.length > 0 ? { details: errors.map(e => ({ message: e })) } : null,
    value: data,
  };
};

module.exports = { validateRegister, validateLogin };