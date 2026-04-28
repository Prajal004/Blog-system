const Router = require('koa-router');
const slugify = require('slugify');
const db = require('./db');
const { authMiddleware } = require('./auth');

const router = new Router();
const Blog = db.getRepository('Blog');
const Comment = db.getRepository('Comment');

// GET all blogs (public)
router.get('/', async (ctx) => {
  const blogs = await Blog.find({
    where: { deletedAt: null, status: 'published' },
    order: { createdAt: 'DESC' }
  });
  
  // Get comment counts
  for (let blog of blogs) {
    const count = await Comment.count({ where: { blogId: blog.id } });
    blog.commentCount = count;
  }
  
  ctx.body = { blogs };
});

// GET single blog by slug
router.get('/:slug', async (ctx) => {
  const blog = await Blog.findOne({
    where: { slug: ctx.params.slug, deletedAt: null }
  });
  
  if (!blog) {
    ctx.status = 404;
    ctx.body = { error: 'Blog not found' };
    return;
  }
  
  // Get comments
  const comments = await Comment.find({
    where: { blogId: blog.id },
    order: { createdAt: 'DESC' }
  });
  
  // Increment views
  blog.views += 1;
  await Blog.save(blog);
  
  ctx.body = { blog, comments };
});

// POST create blog (auth required)
router.post('/', authMiddleware, async (ctx) => {
  const { title, content, status = 'published' } = ctx.request.body;
  
  if (!title || !content) {
    ctx.status = 400;
    ctx.body = { error: 'Title and content required' };
    return;
  }
  
  // Generate unique slug
  let slug = slugify(title, { lower: true, strict: true });
  let existing = await Blog.findOneBy({ slug });
  let counter = 1;
  while (existing) {
    slug = `${slugify(title, { lower: true, strict: true })}-${counter}`;
    existing = await Blog.findOneBy({ slug });
    counter++;
  }
  
  const blog = Blog.create({
    title,
    slug,
    content,
    author: ctx.state.user.username,
    authorId: ctx.state.user.id,
    status
  });
  
  await Blog.save(blog);
  ctx.status = 201;
  ctx.body = { blog };
});

// PUT update blog
router.put('/:slug', authMiddleware, async (ctx) => {
  const blog = await Blog.findOneBy({ slug: ctx.params.slug });
  
  if (!blog) {
    ctx.status = 404;
    ctx.body = { error: 'Blog not found' };
    return;
  }
  
  if (blog.authorId !== ctx.state.user.id) {
    ctx.status = 403;
    ctx.body = { error: 'You can only edit your own blogs' };
    return;
  }
  
  const { title, content, status } = ctx.request.body;
  
  if (title) {
    blog.title = title;
    blog.slug = slugify(title, { lower: true, strict: true });
  }
  if (content) blog.content = content;
  if (status) blog.status = status;
  
  await Blog.save(blog);
  ctx.body = { blog };
});

// DELETE blog (soft delete)
router.delete('/:slug', authMiddleware, async (ctx) => {
  const blog = await Blog.findOneBy({ slug: ctx.params.slug });
  
  if (!blog) {
    ctx.status = 404;
    ctx.body = { error: 'Blog not found' };
    return;
  }
  
  if (blog.authorId !== ctx.state.user.id) {
    ctx.status = 403;
    ctx.body = { error: 'You can only delete your own blogs' };
    return;
  }
  
  blog.deletedAt = new Date();
  await Blog.save(blog);
  ctx.body = { message: 'Blog deleted' };
});

// POST comment
router.post('/:slug/comments', authMiddleware, async (ctx) => {
  const { content } = ctx.request.body;
  
  if (!content) {
    ctx.status = 400;
    ctx.body = { error: 'Comment content required' };
    return;
  }
  
  const blog = await Blog.findOneBy({ slug: ctx.params.slug });
  if (!blog) {
    ctx.status = 404;
    ctx.body = { error: 'Blog not found' };
    return;
  }
  
  const comment = Comment.create({
    content,
    author: ctx.state.user.username,
    blogId: blog.id
  });
  
  await Comment.save(comment);
  ctx.status = 201;
  ctx.body = { comment };
});

module.exports = router;