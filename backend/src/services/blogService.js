const { AppDataSource } = require('../config/database');
const { generateSlug } = require('../utils/slugify');
const { BLOG_STATUS } = require('../utils/constants');

class BlogService {
  constructor() {
    this.blogRepository = AppDataSource.getRepository('Blog');
    this.commentRepository = AppDataSource.getRepository('Comment');
    this.tagRepository = AppDataSource.getRepository('Tag');
  }

  async createBlog(blogData, userId) {
    const slug = generateSlug(blogData.title);
    
    const existingBlog = await this.blogRepository.findOneBy({ slug });
    if (existingBlog) {
      throw new Error('Blog with similar title already exists');
    }

    const blog = this.blogRepository.create({
      ...blogData,
      slug,
      authorId: userId,
      status: blogData.status || BLOG_STATUS.DRAFT,
    });

    if (blogData.tags && blogData.tags.length) {
      const tags = await this.processTags(blogData.tags);
      blog.tags = tags;
    }

    await this.blogRepository.save(blog);
    return blog;
  }

  async processTags(tagNames) {
    const tags = [];
    for (const tagName of tagNames) {
      let tag = await this.tagRepository.findOneBy({ name: tagName.toLowerCase() });
      if (!tag) {
        tag = this.tagRepository.create({ name: tagName.toLowerCase() });
        await this.tagRepository.save(tag);
      }
      tags.push(tag);
    }
    return tags;
  }

  async getAllBlogs(includeDrafts = false, userId = null, userRole = null) {
    const queryBuilder = this.blogRepository
      .createQueryBuilder('blog')
      .leftJoinAndSelect('blog.tags', 'tags')
      .leftJoinAndSelect('blog.comments', 'comments')
      .where('blog.deletedAt IS NULL');

    if (!includeDrafts) {
      queryBuilder.andWhere('blog.status = :status', { status: BLOG_STATUS.PUBLISHED });
    } else if (userId && userRole !== 'admin') {
      queryBuilder.andWhere('(blog.status = :status OR blog.authorId = :userId)', {
        status: BLOG_STATUS.PUBLISHED,
        userId: userId,
      });
    }

    const blogs = await queryBuilder
      .orderBy('blog.createdAt', 'DESC')
      .getMany();

    return blogs;
  }

  async getBlogBySlug(slug) {
    const blog = await this.blogRepository.findOne({
      where: { slug, deletedAt: null },
      relations: ['tags', 'comments'],
    });

    if (!blog) {
      throw new Error('Blog not found');
    }

    return blog;
  }

  async updateBlog(slug, updateData, userId, userRole) {
    const blog = await this.getBlogBySlug(slug);
    
    if (blog.authorId !== userId && userRole !== 'admin') {
      throw new Error('Unauthorized to update this blog');
    }

    if (updateData.title) {
      updateData.slug = generateSlug(updateData.title);
    }

    Object.assign(blog, updateData);
    
    if (updateData.tags) {
      blog.tags = await this.processTags(updateData.tags);
    }

    await this.blogRepository.save(blog);
    return blog;
  }

  async deleteBlog(slug, userId, userRole) {
    const blog = await this.getBlogBySlug(slug);
    
    if (blog.authorId !== userId && userRole !== 'admin') {
      throw new Error('Unauthorized to delete this blog');
    }

    await this.blogRepository.softDelete(blog.id);
    return { message: 'Blog deleted successfully' };
  }
}

module.exports = new BlogService();