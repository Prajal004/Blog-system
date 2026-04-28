const Router = require('koa-router');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');

const router = new Router();
const User = db.getRepository('User');

// Register
router.post('/register', async (ctx) => {
  const { username, email, password } = ctx.request.body;
  
  if (!username || !email || !password) {
    ctx.status = 400;
    ctx.body = { error: 'All fields required' };
    return;
  }
  
  const exists = await User.findOne({ where: [{ email }, { username }] });
  if (exists) {
    ctx.status = 400;
    ctx.body = { error: 'User already exists' };
    return;
  }
  
  const hashed = await bcrypt.hash(password, 10);
  const user = User.create({ username, email, password: hashed });
  await User.save(user);
  
  const token = jwt.sign({ id: user.id, username }, 'secret123', { expiresIn: '7d' });
  
  ctx.body = { 
    token, 
    user: { id: user.id, username, email } 
  };
});

// Login
router.post('/login', async (ctx) => {
  const { email, password } = ctx.request.body;
  
  const user = await User.findOneBy({ email });
  if (!user) {
    ctx.status = 401;
    ctx.body = { error: 'Invalid credentials' };
    return;
  }
  
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    ctx.status = 401;
    ctx.body = { error: 'Invalid credentials' };
    return;
  }
  
  const token = jwt.sign({ id: user.id, username: user.username }, 'secret123', { expiresIn: '7d' });
  
  ctx.body = { 
    token, 
    user: { id: user.id, username: user.username, email: user.email } 
  };
});

// Middleware to get user from token
const authMiddleware = async (ctx, next) => {
  const token = ctx.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    ctx.status = 401;
    ctx.body = { error: 'Login required' };
    return;
  }
  
  try {
    const decoded = jwt.verify(token, 'secret123');
    ctx.state.user = decoded;
    await next();
  } catch (err) {
    ctx.status = 401;
    ctx.body = { error: 'Invalid token' };
  }
};

module.exports = router;
module.exports.authMiddleware = authMiddleware;