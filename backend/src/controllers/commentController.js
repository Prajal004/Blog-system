const commentService = require('../services/commentService');
const { HTTP_STATUS } = require('../utils/constants');

async function addComment(ctx) {
  try {
    const { slug } = ctx.params;
    const commentData = ctx.request.body;
    
    const comment = await commentService.addComment(slug, commentData);
    ctx.status = HTTP_STATUS.CREATED;
    ctx.body = { success: true, data: comment };
  } catch (error) {
    ctx.status = HTTP_STATUS.NOT_FOUND;
    ctx.body = { success: false, error: error.message };
  }
}

async function getComments(ctx) {
  try {
    const { slug } = ctx.params;
    const comments = await commentService.getCommentsByBlog(slug);
    ctx.body = { success: true, data: comments };
  } catch (error) {
    ctx.status = HTTP_STATUS.NOT_FOUND;
    ctx.body = { success: false, error: error.message };
  }
}

module.exports = { addComment, getComments };