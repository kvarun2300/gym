const { DietPlan, Member, Trainer, User } = require('../models');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const { getPagination, buildPaginatedResponse } = require('../utils/paginate');
const { ROLES } = require('../config/constants');

/**
 * @route POST /api/diet-plans
 * @access Admin, Trainer
 */
const createDietPlan = async (req, res) => {
  const { memberId, title, targetCalories, meals, notes, startDate, endDate } = req.body;

  const member = await Member.findByPk(memberId);
  if (!member) throw ApiError.notFound('Member not found');

  let trainerId = req.body.trainerId;
  if (req.user.role === ROLES.TRAINER) {
    const trainer = await Trainer.findOne({ where: { userId: req.user.id } });
    if (!trainer) throw ApiError.notFound('Trainer profile not found');
    trainerId = trainer.id;
  }
  if (!trainerId) throw ApiError.badRequest('trainerId is required');

  const plan = await DietPlan.create({
    memberId,
    trainerId,
    title,
    targetCalories: targetCalories || null,
    meals: meals || [],
    notes: notes || null,
    startDate: startDate || null,
    endDate: endDate || null,
  });

  res.status(201).json(new ApiResponse(201, { plan }, 'Diet plan created'));
};

/**
 * @route GET /api/diet-plans
 * @access Admin, Trainer
 */
const getDietPlans = async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const { memberId } = req.query;

  const where = {};
  if (memberId) where.memberId = memberId;

  if (req.user.role === ROLES.TRAINER) {
    const trainer = await Trainer.findOne({ where: { userId: req.user.id } });
    where.trainerId = trainer.id;
  }

  const { rows, count } = await DietPlan.findAndCountAll({
    where,
    include: [
      { model: Member, as: 'member', include: [{ model: User, as: 'user', attributes: ['name'] }] },
      { model: Trainer, as: 'trainer', include: [{ model: User, as: 'user', attributes: ['name'] }] },
    ],
    limit,
    offset,
    order: [['createdAt', 'DESC']],
    distinct: true,
  });

  res.status(200).json(new ApiResponse(200, buildPaginatedResponse(rows, count, page, limit), 'Diet plans fetched'));
};

/**
 * @route GET /api/diet-plans/my-plans
 * @access Member
 */
const getMyDietPlans = async (req, res) => {
  const member = await Member.findOne({ where: { userId: req.user.id } });
  if (!member) throw ApiError.notFound('Member profile not found');

  const plans = await DietPlan.findAll({
    where: { memberId: member.id },
    include: [{ model: Trainer, as: 'trainer', include: [{ model: User, as: 'user', attributes: ['name'] }] }],
    order: [['isActive', 'DESC'], ['createdAt', 'DESC']],
  });

  res.status(200).json(new ApiResponse(200, { plans }, 'Diet plans fetched'));
};

/**
 * @route PUT /api/diet-plans/:id
 * @access Admin, Trainer (owner)
 */
const updateDietPlan = async (req, res) => {
  const plan = await DietPlan.findByPk(req.params.id);
  if (!plan) throw ApiError.notFound('Diet plan not found');

  if (req.user.role === ROLES.TRAINER) {
    const trainer = await Trainer.findOne({ where: { userId: req.user.id } });
    if (plan.trainerId !== trainer.id) throw ApiError.forbidden('You can only edit your own plans');
  }

  const fields = ['title', 'targetCalories', 'meals', 'notes', 'startDate', 'endDate', 'isActive'];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) plan[f] = req.body[f];
  });
  await plan.save();

  res.status(200).json(new ApiResponse(200, { plan }, 'Diet plan updated'));
};

/**
 * @route DELETE /api/diet-plans/:id
 * @access Admin, Trainer (owner)
 */
const deleteDietPlan = async (req, res) => {
  const plan = await DietPlan.findByPk(req.params.id);
  if (!plan) throw ApiError.notFound('Diet plan not found');

  if (req.user.role === ROLES.TRAINER) {
    const trainer = await Trainer.findOne({ where: { userId: req.user.id } });
    if (plan.trainerId !== trainer.id) throw ApiError.forbidden('You can only delete your own plans');
  }

  await plan.destroy();
  res.status(200).json(new ApiResponse(200, null, 'Diet plan deleted'));
};

module.exports = { createDietPlan, getDietPlans, getMyDietPlans, updateDietPlan, deleteDietPlan };
