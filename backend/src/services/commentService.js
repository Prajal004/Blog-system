const { AppDataSource } = require('../config/database');

class CommentService {
  constructor() {
    this.commentRepository = AppDataSource.getRepository('Comment');
    this.blogRepository = AppDataSource.getRepository('Blog');
  }

  async addComment(slug, commentData) {
    const blog = await this.blogRepository.findOne({
      where: { slug, deletedAt: null },
    });

    if (!blog) {
      throw new Error('Blog not found');
    }

    const comment = this.commentRepository.create({
      ...commentData,
      blog: blog,
    });

    await this.commentRepository.save(comment);
    return comment;
  }

  async getCommentsByBlog(slug) {
    const blog = await this.blogRepository.findOne({
      where: { slug, deletedAt: null },
    });

    if (!blog) {
      throw new Error('Blog not found');
    }

    const comments = await this.commentRepository.find({
      where: { blog: { id: blog.id } },
      order: { createdAt: 'DESC' },
    });

    return comments;
  }
}

module.exports = new CommentService();