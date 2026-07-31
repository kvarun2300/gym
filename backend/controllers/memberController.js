const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { User, Member, Trainer, Subscription, Plan } = require('../models');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const { getPagination, buildPaginatedResponse } = require('../utils/paginate');
const { sendEmail, emailTemplates } = require('../utils/sendEmail');
const { ROLES } = require('../config/constants');

const generateCode = (prefix) =>
  `${prefix}-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 90 + 10)}`;

/**
 * @route POST /api/members
 * @access Admin
 * Creates a User (role=member) + Member profile in one step (admin-added member)
 */
const createMember = async (req, res) => {
  const { name, email, password, phone, dateOfBirth, gender, address, goal, assignedTrainerId } = req.body;

  const existing = await User.findOne({ where: { email } });
  if (existing) throw ApiError.conflict('A user with this email already exists');

  const hashedPassword = await bcrypt.hash(password || 'Member@123', 12);

  const user = await User.create({
    name,
    email,
    phone,
    password: hashedPassword,
    role: ROLES.MEMBER,
    profileImage: req.file ? `/uploads/profiles/${req.file.filename}` : null,
  });

  const member = await Member.create({
    userId: user.id,
    memberCode: generateCode('MEM'),
    dateOfBirth: dateOfBirth || null,
    gender: gender || null,
    address: address || null,
    goal: goal || null,
    assignedTrainerId: assignedTrainerId || null,
    joinDate: new Date(),
  });

  sendEmail({
    to: user.email,
    subject: 'Welcome to Xtreme Fitness!',
    html: emailTemplates.welcome(user.name),
  }).catch(() => {});

  res.status(201).json(new ApiResponse(201, { member, user: { id: user.id, name: user.name, email: user.email } }, 'Member created'));
};

/**
 * @route GET /api/members
 * @access Admin, Trainer
 * Supports search, sort, filter, pagination
 */
const getMembers = async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const { search, gender, trainerId, sortBy = 'created_at', order = 'DESC' } = req.query;

  const userWhere = {};
  if (search) {
    userWhere[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } },
    ];
  }

  const memberWhere = {};
  if (gender) memberWhere.gender = gender;
  if (trainerId) memberWhere.assignedTrainerId = trainerId;

  // Trainers can only see their assigned members
  if (req.user.role === ROLES.TRAINER) {
    const trainerProfile = await Trainer.findOne({ where: { userId: req.user.id } });
    if (!trainerProfile) throw ApiError.notFound('Trainer profile not found');
    memberWhere.assignedTrainerId = trainerProfile.id;
  }

  const { rows, count } = await Member.findAndCountAll({
    where: memberWhere,
    include: [
      { model: User, as: 'user', where: userWhere, attributes: ['id', 'name', 'email', 'phone', 'profileImage', 'isActive'] },
      { model: Trainer, as: 'trainer', include: [{ model: User, as: 'user', attributes: ['name'] }] },
    ],
    limit,
    offset,
    order: [[sortBy === 'name' ? [{ model: User, as: 'user' }, 'name'] : sortBy, order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC']],
    distinct: true,
  });

  res.status(200).json(new ApiResponse(200, buildPaginatedResponse(rows, count, page, limit), 'Members fetched'));
};

/**
 * @route GET /api/members/:id
 */
const getMemberById = async (req, res) => {
  const member = await Member.findByPk(req.params.id, {
    include: [
      { model: User, as: 'user', attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpires'] } },
      { model: Trainer, as: 'trainer', include: [{ model: User, as: 'user', attributes: ['name', 'phone'] }] },
      { model: Subscription, as: 'subscriptions', include: [{ model: Plan, as: 'plan' }], order: [['createdAt', 'DESC']] },
    ],
  });

  if (!member) throw ApiError.notFound('Member not found');
  res.status(200).json(new ApiResponse(200, { member }, 'Member fetched'));
};

/**
 * @route PUT /api/members/:id
 * @access Admin
 */
const updateMember = async (req, res) => {
  const member = await Member.findByPk(req.params.id, { include: [{ model: User, as: 'user' }] });
  if (!member) throw ApiError.notFound('Member not found');

  const { name, phone, dateOfBirth, gender, address, goal, assignedTrainerId, heightCm, weightKg, isActive } = req.body;

  if (name) member.user.name = name;
  if (phone) member.user.phone = phone;
  if (typeof isActive === 'boolean') member.user.isActive = isActive;
  if (req.file) member.user.profileImage = `/uploads/profiles/${req.file.filename}`;
  await member.user.save();

  if (dateOfBirth !== undefined) member.dateOfBirth = dateOfBirth;
  if (gender !== undefined) member.gender = gender;
  if (address !== undefined) member.address = address;
  if (goal !== undefined) member.goal = goal;
  if (assignedTrainerId !== undefined) member.assignedTrainerId = assignedTrainerId;
  if (heightCm !== undefined) member.heightCm = heightCm;
  if (weightKg !== undefined) member.weightKg = weightKg;
  await member.save();

  res.status(200).json(new ApiResponse(200, { member }, 'Member updated'));
};

/**
 * @route DELETE /api/members/:id
 * @access Admin
 */
const deleteMember = async (req, res) => {
  const member = await Member.findByPk(req.params.id);
  if (!member) throw ApiError.notFound('Member not found');

  const userId = member.userId;
  await member.destroy();
  await User.destroy({ where: { id: userId } });

  res.status(200).json(new ApiResponse(200, null, 'Member deleted'));
};

module.exports = { createMember, getMembers, getMemberById, updateMember, deleteMember };
