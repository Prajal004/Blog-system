const blogService = require('../services/blogService');
const { HTTP_STATUS } = require('../utils/constants');

async function createBlog(ctx) {
  try {
    const blogData = ctx.request.body;
    const userId = ctx.state.user.id;
    const blog = await blogService.createBlog(blogData, userId);
    ctx.status = HTTP_STATUS.CREATED;
    ctx.body = { success: true, data: blog };
  } catch (error) {
    ctx.status = HTTP_STATUS.BAD_REQUEST;
    ctx.body = { success: false, error: error.message };
  }
}

async function getAllBlogs(ctx) {
  try {
    const includeDrafts = ctx.query.includeDrafts === 'true';
    const userId = ctx.state.user?.id;
    const userRole = ctx.state.user?.role;
    const blogs = await blogService.getAllBlogs(includeDrafts, userId, userRole);
    ctx.body = { success: true, data: blogs };
  } catch (error) {
    ctx.status = HTTP_STATUS.INTERNAL_SERVER;
    ctx.body = { success: false, error: error.message };
  }
}

async function getBlogBySlug(ctx) {
  try {
    const { slug } = ctx.params;
    const blog = await blogService.getBlogBySlug(slug);
    ctx.body = { success: true, data: blog };
  } catch (error) {
    ctx.status = HTTP_STATUS.NOT_FOUND;
    ctx.body = { success: false, error: error.message };
  }
}

async function updateBlog(ctx) {
  try {
    const { slug } = ctx.params;
    const updateData = ctx.request.body;
    const userId = ctx.state.user.id;
    const userRole = ctx.state.user.role;
    const blog = await blogService.updateBlog(slug, updateData, userId, userRole);
    ctx.body = { success: true, data: blog };
  } catch (error) {
    const status = error.message.includes('Unauthorized') 
      ? HTTP_STATUS.FORBIDDEN 
      : HTTP_STATUS.BAD_REQUEST;
    ctx.status = status;
    ctx.body = { success: false, error: error.message };
  }
}

async function deleteBlog(ctx) {
  try {
    const { slug } = ctx.params;
    const userId = ctx.state.user.id;
    const userRole = ctx.state.user.role;
    const result = await blogService.deleteBlog(slug, userId, userRole);
    ctx.body = { success: true, ...result };
  } catch (error) {
    const status = error.message.includes('Unauthorized') 
      ? HTTP_STATUS.FORBIDDEN 
      : HTTP_STATUS.NOT_FOUND;
    ctx.status = status;
    ctx.body = { success: false, error: error.message };
  }
}

module.exports = { 
  createBlog, 
  getAllBlogs, 
  getBlogBySlug, 
  updateBlog, 
  deleteBlog 
};