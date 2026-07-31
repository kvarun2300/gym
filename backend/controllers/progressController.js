const { Progress, Member, User } = require('../models');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const { getPagination, buildPaginatedResponse } = require('../utils/paginate');
const { ROLES } = require('../config/constants');

const calcBmi = (weightKg, heightCm) => {
  if (!weightKg || !heightCm) return null;
  const h = heightCm / 100;
  return Number((weightKg / (h * h)).toFixed(2));
};

/**
 * @route POST /api/progress
 * @access Member (self), Trainer, Admin
 */
const addProgressEntry = async (req, res) => {
  let memberId = req.body.memberId;

  if (req.user.role === ROLES.MEMBER) {
    const member = await Member.findOne({ where: { userId: req.user.id } });
    if (!member) throw ApiError.notFound('Member profile not found');
    memberId = member.id;
  }
  if (!memberId) throw ApiError.badRequest('memberId is required');

  const { weightKg, heightCm, bodyFatPercent, chestCm, waistCm, armsCm, notes, recordedAt } = req.body;

  const entry = await Progress.create({
    memberId,
    recordedAt: recordedAt || new Date(),
    weightKg: weightKg || null,
    heightCm: heightCm || null,
    bmi: calcBmi(weightKg, heightCm),
    bodyFatPercent: bodyFatPercent || null,
    chestCm: chestCm || null,
    waistCm: waistCm || null,
    armsCm: armsCm || null,
    notes: notes || null,
  });

  // Keep member profile height/weight in sync with the latest entry
  if (weightKg || heightCm) {
    const member = await Member.findByPk(memberId);
    if (member) {
      if (weightKg) member.weightKg = weightKg;
      if (heightCm) member.heightCm = heightCm;
      await member.save();
    }
  }

  res.status(201).json(new ApiResponse(201, { entry }, 'Progress entry recorded'));
};

/**
 * @route GET /api/progress/my-history
 * @access Member
 */
const getMyProgressHistory = async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const member = await Member.findOne({ where: { userId: req.user.id } });
  if (!member) throw ApiError.notFound('Member profile not found');

  const { rows, count } = await Progress.findAndCountAll({
    where: { memberId: member.id },
    limit,
    offset,
    order: [['recordedAt', 'DESC']],
  });

  res.status(200).json(new ApiResponse(200, buildPaginatedResponse(rows, count, page, limit), 'Progress history fetched'));
};

/**
 * @route GET /api/progress/:memberId
 * @access Admin, Trainer
 */
const getMemberProgressHistory = async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);

  const { rows, count } = await Progress.findAndCountAll({
    where: { memberId: req.params.memberId },
    limit,
    offset,
    order: [['recordedAt', 'DESC']],
    include: [{ model: Member, as: 'member', include: [{ model: User, as: 'user', attributes: ['name'] }] }],
  });

  res.status(200).json(new ApiResponse(200, buildPaginatedResponse(rows, count, page, limit), 'Progress history fetched'));
};

module.exports = { addProgressEntry, getMyProgressHistory, getMemberProgressHistory };
