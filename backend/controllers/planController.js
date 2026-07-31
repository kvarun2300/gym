const { Plan } = require('../models');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const { getPagination, buildPaginatedResponse } = require('../utils/paginate');

/**
 * @route POST /api/plans
 * @access Admin
 */
const createPlan = async (req, res) => {
  const { name, description, durationDays, price, features, isFeatured } = req.body;
  const plan = await Plan.create({ name, description, durationDays, price, features, isFeatured });
  res.status(201).json(new ApiResponse(201, { plan }, 'Plan created'));
};

/**
 * @route GET /api/plans
 * @access Public
 */
const getPlans = async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const { activeOnly } = req.query;

  const where = {};
  if (activeOnly === 'true') where.isActive = true;

  const { rows, count } = await Plan.findAndCountAll({
    where,
    limit,
    offset,
    order: [['price', 'ASC']],
  });

  res.status(200).json(new ApiResponse(200, buildPaginatedResponse(rows, count, page, limit), 'Plans fetched'));
};

/**
 * @route GET /api/plans/:id
 */
const getPlanById = async (req, res) => {
  const plan = await Plan.findByPk(req.params.id);
  if (!plan) throw ApiError.notFound('Plan not found');
  res.status(200).json(new ApiResponse(200, { plan }, 'Plan fetched'));
};

/**
 * @route PUT /api/plans/:id
 * @access Admin
 */
const updatePlan = async (req, res) => {
  const plan = await Plan.findByPk(req.params.id);
  if (!plan) throw ApiError.notFound('Plan not found');

  const fields = ['name', 'description', 'durationDays', 'price', 'features', 'isActive', 'isFeatured'];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) plan[f] = req.body[f];
  });

  await plan.save();
  res.status(200).json(new ApiResponse(200, { plan }, 'Plan updated'));
};

/**
 * @route DELETE /api/plans/:id
 * @access Admin
 */
const deletePlan = async (req, res) => {
  const plan = await Plan.findByPk(req.params.id);
  if (!plan) throw ApiError.notFound('Plan not found');
  await plan.destroy();
  res.status(200).json(new ApiResponse(200, null, 'Plan deleted'));
};

module.exports = { createPlan, getPlans, getPlanById, updatePlan, deletePlan };
