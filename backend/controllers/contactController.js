const { ContactMessage } = require('../models');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const { getPagination, buildPaginatedResponse } = require('../utils/paginate');

/**
 * @route POST /api/contact
 * @access Public
 */
const submitContactMessage = async (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  const entry = await ContactMessage.create({ name, email, phone, subject, message });
  res.status(201).json(new ApiResponse(201, { entry }, 'Message sent successfully. We will get back to you soon.'));
};

/**
 * @route GET /api/contact
 * @access Admin
 */
const getContactMessages = async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const { resolved } = req.query;

  const where = {};
  if (resolved !== undefined) where.isResolved = resolved === 'true';

  const { rows, count } = await ContactMessage.findAndCountAll({
    where,
    limit,
    offset,
    order: [['createdAt', 'DESC']],
  });

  res.status(200).json(new ApiResponse(200, buildPaginatedResponse(rows, count, page, limit), 'Contact messages fetched'));
};

/**
 * @route PUT /api/contact/:id/resolve
 * @access Admin
 */
const resolveContactMessage = async (req, res) => {
  const entry = await ContactMessage.findByPk(req.params.id);
  if (!entry) throw ApiError.notFound('Message not found');
  entry.isResolved = true;
  await entry.save();
  res.status(200).json(new ApiResponse(200, { entry }, 'Message marked as resolved'));
};

module.exports = { submitContactMessage, getContactMessages, resolveContactMessage };
