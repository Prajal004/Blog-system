const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const cors = require('koa-cors');
const db = require('./db');
const authRoutes = require('./auth');
const blogRoutes = require('./blog');

const app = new Koa();
const router = new Router();

app.use(cors());
app.use(bodyParser());

// Routes
router.use('/api/auth', authRoutes.routes());
router.use('/api/blogs', blogRoutes.routes());

router.get('/api/health', (ctx) => {
  ctx.body = { status: 'ok' };
});

app.use(router.routes());

// Start server
db.initialize()
  .then(() => {
    console.log('✅ Database ready');
    app.listen(3001, () => {
      console.log('🚀 Server running on http://localhost:3001');
    });
  })
  .catch(err => {
    console.error('❌ Database failed:', err);
  });