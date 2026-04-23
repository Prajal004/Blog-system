const Router = require('koa-router');
const blogController = require('../controllers/blogController');
const commentController = require('../controllers/commentController');
const { authMiddleware } = require('../middleware/auth');
const validationMiddleware = require('../middleware/validation');
const { validateBlog } = require('../validators/blogValidator');

const router = new Router({ prefix: '/api/blogs' });

// Public routes
router.get('/', blogController.getAllBlogs);
router.get('/:slug', blogController.getBlogBySlug);
router.post('/:slug/comments', commentController.addComment);
router.get('/:slug/comments', commentController.getComments);

// Protected routes
router.post('/', authMiddleware, validationMiddleware(validateBlog), blogController.createBlog);
router.put('/:slug', authMiddleware, blogController.updateBlog);
router.delete('/:slug', authMiddleware, blogController.deleteBlog);

module.exports = router;