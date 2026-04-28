const { DataSource } = require('typeorm');

// Simple entities - no separate files
const BlogEntity = {
  name: "Blog",
  tableName: "blogs",
  columns: {
    id: { type: "int", primary: true, generated: true },
    title: { type: "varchar" },
    slug: { type: "varchar", unique: true },
    content: { type: "text" },
    author: { type: "varchar" },
    authorId: { type: "int" },
    status: { type: "varchar", default: "published" },
    views: { type: "int", default: 0 },
    createdAt: { type: "timestamp", createDate: true },
    deletedAt: { type: "timestamp", nullable: true }
  }
};

const CommentEntity = {
  name: "Comment",
  tableName: "comments",
  columns: {
    id: { type: "int", primary: true, generated: true },
    content: { type: "text" },
    author: { type: "varchar" },
    blogId: { type: "int" },
    createdAt: { type: "timestamp", createDate: true }
  }
};

const UserEntity = {
  name: "User",
  tableName: "users",
  columns: {
    id: { type: "int", primary: true, generated: true },
    username: { type: "varchar", unique: true },
    email: { type: "varchar", unique: true },
    password: { type: "varchar" },
    createdAt: { type: "timestamp", createDate: true }
  }
};

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '123456',
  database: 'blog_db',
  synchronize: true,
  entities: [BlogEntity, CommentEntity, UserEntity]
});

module.exports = AppDataSource;