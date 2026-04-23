const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');

const app = new Koa();

// Middleware order matters!
app.use(cors());
app.use(bodyParser());
app.use(errorHandler);

// Routes
app.use(authRoutes.routes());
app.use(authRoutes.allowedMethods());
app.use(blogRoutes.routes());
app.use(blogRoutes.allowedMethods());

module.exports = app;