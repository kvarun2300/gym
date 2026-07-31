const { Gallery } = require('../models');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const { getPagination, buildPaginatedResponse } = require('../utils/paginate');

/**
 * @route POST /api/gallery
 * @access Admin
 */
const uploadGalleryItem = async (req, res) => {
  const { title, category, description, beforeImageUrl, afterImageUrl } = req.body;

  if (!req.file && !beforeImageUrl) {
    throw ApiError.badRequest('An image file is required');
  }

  const item = await Gallery.create({
    title,
    category: category || 'general',
    description,
    imageUrl: req.file ? `/uploads/gallery/${req.file.filename}` : afterImageUrl,
    beforeImageUrl: beforeImageUrl || null,
    afterImageUrl: afterImageUrl || null,
    uploadedBy: req.user.id,
  });

  res.status(201).json(new ApiResponse(201, { item }, 'Gallery item uploaded'));
};

/**
 * @route GET /api/gallery
 * @access Public
 */
const getGallery = async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const { category } = req.query;

  const where = { isPublished: true };
  if (category) where.category = category;

  const { rows, count } = await Gallery.findAndCountAll({
    where,
    limit,
    offset,
    order: [['createdAt', 'DESC']],
  });

  res.status(200).json(new ApiResponse(200, buildPaginatedResponse(rows, count, page, limit), 'Gallery fetched'));
};

/**
 * @route DELETE /api/gallery/:id
 * @access Admin
 */
const deleteGalleryItem = async (req, res) => {
  const item = await Gallery.findByPk(req.params.id);
  if (!item) throw ApiError.notFound('Gallery item not found');
  await item.destroy();
  res.status(200).json(new ApiResponse(200, null, 'Gallery item deleted'));
};

module.exports = { uploadGalleryItem, getGallery, deleteGalleryItem };
