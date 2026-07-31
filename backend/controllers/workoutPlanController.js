const { WorkoutPlan, Member, Trainer, User } = require('../models');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const { getPagination, buildPaginatedResponse } = require('../utils/paginate');
const { ROLES } = require('../config/constants');

/**
 * @route POST /api/workout-plans
 * @access Admin, Trainer
 */
const createWorkoutPlan = async (req, res) => {
  const { memberId, title, goal, exercises, startDate, endDate } = req.body;

  const member = await Member.findByPk(memberId);
  if (!member) throw ApiError.notFound('Member not found');

  let trainerId = req.body.trainerId;
  if (req.user.role === ROLES.TRAINER) {
    const trainer = await Trainer.findOne({ where: { userId: req.user.id } });
    if (!trainer) throw ApiError.notFound('Trainer profile not found');
    trainerId = trainer.id;
  }
  if (!trainerId) throw ApiError.badRequest('trainerId is required');

  const plan = await WorkoutPlan.create({
    memberId,
    trainerId,
    title,
    goal: goal || null,
    exercises: exercises || [],
    startDate: startDate || null,
    endDate: endDate || null,
  });

  res.status(201).json(new ApiResponse(201, { plan }, 'Workout plan created'));
};

/**
 * @route GET /api/workout-plans
 * @access Admin, Trainer - list plans they created / all (admin)
 */
const getWorkoutPlans = async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const { memberId } = req.query;

  const where = {};
  if (memberId) where.memberId = memberId;

  if (req.user.role === ROLES.TRAINER) {
    const trainer = await Trainer.findOne({ where: { userId: req.user.id } });
    where.trainerId = trainer.id;
  }

  const { rows, count } = await WorkoutPlan.findAndCountAll({
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

  res.status(200).json(new ApiResponse(200, buildPaginatedResponse(rows, count, page, limit), 'Workout plans fetched'));
};

/**
 * @route GET /api/workout-plans/my-plans
 * @access Member
 */
const getMyWorkoutPlans = async (req, res) => {
  const member = await Member.findOne({ where: { userId: req.user.id } });
  if (!member) throw ApiError.notFound('Member profile not found');

  const plans = await WorkoutPlan.findAll({
    where: { memberId: member.id },
    include: [{ model: Trainer, as: 'trainer', include: [{ model: User, as: 'user', attributes: ['name'] }] }],
    order: [['isActive', 'DESC'], ['createdAt', 'DESC']],
  });

  res.status(200).json(new ApiResponse(200, { plans }, 'Workout plans fetched'));
};

/**
 * @route PUT /api/workout-plans/:id
 * @access Admin, Trainer (owner)
 */
const updateWorkoutPlan = async (req, res) => {
  const plan = await WorkoutPlan.findByPk(req.params.id);
  if (!plan) throw ApiError.notFound('Workout plan not found');

  if (req.user.role === ROLES.TRAINER) {
    const trainer = await Trainer.findOne({ where: { userId: req.user.id } });
    if (plan.trainerId !== trainer.id) throw ApiError.forbidden('You can only edit your own plans');
  }

  const fields = ['title', 'goal', 'exercises', 'startDate', 'endDate', 'isActive'];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) plan[f] = req.body[f];
  });
  await plan.save();

  res.status(200).json(new ApiResponse(200, { plan }, 'Workout plan updated'));
};

/**
 * @route DELETE /api/workout-plans/:id
 * @access Admin, Trainer (owner)
 */
const deleteWorkoutPlan = async (req, res) => {
  const plan = await WorkoutPlan.findByPk(req.params.id);
  if (!plan) throw ApiError.notFound('Workout plan not found');

  if (req.user.role === ROLES.TRAINER) {
    const trainer = await Trainer.findOne({ where: { userId: req.user.id } });
    if (plan.trainerId !== trainer.id) throw ApiError.forbidden('You can only delete your own plans');
  }

  await plan.destroy();
  res.status(200).json(new ApiResponse(200, null, 'Workout plan deleted'));
};

module.exports = { createWorkoutPlan, getWorkoutPlans, getMyWorkoutPlans, updateWorkoutPlan, deleteWorkoutPlan };
