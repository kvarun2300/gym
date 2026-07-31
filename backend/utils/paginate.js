/**
 * Build Sequelize pagination options from query params
 * @param {Object} query - req.query
 * @returns {{limit: number, offset: number, page: number}}
 */
const getPagination = (query) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 10, 1), 100);
  const offset = (page - 1) * limit;
  return { page, limit, offset };
};

/**
 * Build a standard paginated response payload
 */
const buildPaginatedResponse = (rows, count, page, limit) => ({
  items: rows,
  pagination: {
    total: count,
    page,
    limit,
    totalPages: Math.ceil(count / limit),
    hasNextPage: page * limit < count,
    hasPrevPage: page > 1,
  },
});

module.exports = { getPagination, buildPaginatedResponse };
