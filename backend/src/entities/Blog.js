const { EntitySchema } = require('typeorm');

module.exports.Blog = new EntitySchema({
  name: 'Blog',
  tableName: 'blogs',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    title: {
      type: 'varchar',
      length: 200,
      nullable: false,
    },
    slug: {
      type: 'varchar',
      length: 200,
      unique: true,
      nullable: false,
    },
    content: {
      type: 'text',
      nullable: false,
    },
    author: {
      type: 'varchar',
      length: 100,
      nullable: false,
    },
    authorId: {
      type: 'int',
      nullable: false,
    },
    status: {
      type: 'enum',
      enum: ['draft', 'published'],
      default: 'draft',
    },
    createdAt: {
      type: 'timestamp',
      createDate: true,
    },
    updatedAt: {
      type: 'timestamp',
      updateDate: true,
    },
    deletedAt: {                    // ← ADD THIS for soft delete
      type: 'timestamp',
      nullable: true,
      deleteDate: true,             // ← Important!
    },
  },
  relations: {
    comments: {
      target: 'Comment',
      type: 'one-to-many',
      inverseSide: 'blog',
      cascade: true,
    },
    tags: {
      target: 'Tag',
      type: 'many-to-many',
      joinTable: {
        name: 'blog_tags',
        joinColumn: {
          name: 'blogId',
          referencedColumnName: 'id'
        },
        inverseJoinColumn: {
          name: 'tagId',
          referencedColumnName: 'id'
        },
      },
      cascade: true,
    },
  },
});