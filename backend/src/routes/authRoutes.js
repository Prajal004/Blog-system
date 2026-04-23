const Router = require('koa-router');
const authController = require('../controllers/authController');  // ✅ Changed (lowercase a)
const { authMiddleware } = require('../middleware/auth');
const validationMiddleware = require('../middleware/validation');
const { validateRegister, validateLogin } = require('../validators/authValidator');

const router = new Router({ prefix: '/api/auth' });

router.post('/register', validationMiddleware(validateRegister), authController.register);
router.post('/login', validationMiddleware(validateLogin), authController.login);
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;