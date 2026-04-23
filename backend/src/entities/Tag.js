const { EntitySchema } = require('typeorm');

module.exports.Tag = new EntitySchema({
  name: 'Tag',
  tableName: 'tags',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    name: {
      type: 'varchar',
      length: 50,
      unique: true,
      nullable: false,
    },
  },
  relations: {
    blogs: {
      target: 'Blog',
      type: 'many-to-many',
      inverseSide: 'tags',
    },
  },
});