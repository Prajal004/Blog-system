const { EntitySchema } = require('typeorm');

module.exports.Comment = new EntitySchema({
  name: 'Comment',
  tableName: 'comments',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
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
    createdAt: {
      type: 'timestamp',
      createDate: true,
    },
  },
  relations: {
    blog: {
      target: 'Blog',
      type: 'many-to-one',
      joinColumn: { name: 'blogId' },
      inverseSide: 'comments',
    },
  },
});