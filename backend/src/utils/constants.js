const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
};

const BLOG_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
};

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER: 500,
};

module.exports = { USER_ROLES, BLOG_STATUS, HTTP_STATUS };