const { DataSource } = require('typeorm');
const { Blog } = require('../entities/Blog');
const { Comment } = require('../entities/Comment');
const { Tag } = require('../entities/Tag');
const { User } = require('../entities/User');
require('dotenv').config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,  // ← CHANGE THIS
  logging: true,      // ← CHANGE THIS
  entities: [Blog, Comment, Tag, User],
  migrations: [],
  subscribers: [],
});

module.exports = { AppDataSource };