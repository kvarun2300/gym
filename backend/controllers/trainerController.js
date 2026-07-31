const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { User, Trainer, Member } = require('../models');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const { getPagination, buildPaginatedResponse } = require('../utils/paginate');
const { sendEmail, emailTemplates } = require('../utils/sendEmail');
const { ROLES } = require('../config/constants');

const generateCode = (prefix) =>
  `${prefix}-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 90 + 10)}`;

/**
 * @route POST /api/trainers
 * @access Admin
 */
const createTrainer = async (req, res) => {
  const { name, email, password, phone, specialization, experienceYears, certifications, bio, salary, shiftStart, shiftEnd } = req.body;

  const existing = await User.findOne({ where: { email } });
  if (existing) throw ApiError.conflict('A user with this email already exists');

  const hashedPassword = await bcrypt.hash(password || 'Trainer@123', 12);

  const user = await User.create({
    name,
    email,
    phone,
    password: hashedPassword,
    role: ROLES.TRAINER,
    profileImage: req.file ? `/uploads/trainers/${req.file.filename}` : null,
  });

  const trainer = await Trainer.create({
    userId: user.id,
    trainerCode: generateCode('TRN'),
    specialization: specialization || null,
    experienceYears: experienceYears || null,
    certifications: certifications || null,
    bio: bio || null,
    salary: salary || null,
    shiftStart: shiftStart || null,
    shiftEnd: shiftEnd || null,
  });

  sendEmail({
    to: user.email,
    subject: 'Welcome to the Xtreme Fitness Team!',
    html: emailTemplates.welcome(user.name),
  }).catch(() => {});

  res.status(201).json(new ApiResponse(201, { trainer, user: { id: user.id, name: user.name, email: user.email } }, 'Trainer created'));
};

/**
 * @route GET /api/trainers
 * @access Public (limited fields) / Admin (full)
 */
const getTrainers = async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const { search, specialization } = req.query;

  const userWhere = { role: ROLES.TRAINER };
  if (search) {
    userWhere[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } },
    ];
  }

  const trainerWhere = {};
  if (specialization) trainerWhere.specialization = { [Op.like]: `%${specialization}%` };

  const { rows, count } = await Trainer.findAndCountAll({
    where: trainerWhere,
    include: [{ model: User, as: 'user', where: userWhere, attributes: ['id', 'name', 'email', 'phone', 'profileImage', 'isActive'] }],
    limit,
    offset,
    order: [['createdAt', 'DESC']],
    distinct: true,
  });

  res.status(200).json(new ApiResponse(200, buildPaginatedResponse(rows, count, page, limit), 'Trainers fetched'));
};

/**
 * @route GET /api/trainers/:id
 */
const getTrainerById = async (req, res) => {
  const trainer = await Trainer.findByPk(req.params.id, {
    include: [
      { model: User, as: 'user', attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpires'] } },
      { model: Member, as: 'assignedMembers', include: [{ model: User, as: 'user', attributes: ['name', 'profileImage'] }] },
    ],
  });
  if (!trainer) throw ApiError.notFound('Trainer not found');
  res.status(200).json(new ApiResponse(200, { trainer }, 'Trainer fetched'));
};

/**
 * @route PUT /api/trainers/:id
 * @access Admin, Self (trainer)
 */
const updateTrainer = async (req, res) => {
  const trainer = await Trainer.findByPk(req.params.id, { include: [{ model: User, as: 'user' }] });
  if (!trainer) throw ApiError.notFound('Trainer not found');

  const { name, phone, specialization, experienceYears, certifications, bio, salary, shiftStart, shiftEnd, isActive } = req.body;

  if (name) trainer.user.name = name;
  if (phone) trainer.user.phone = phone;
  if (typeof isActive === 'boolean' && req.user.role === ROLES.ADMIN) trainer.user.isActive = isActive;
  if (req.file) trainer.user.profileImage = `/uploads/trainers/${req.file.filename}`;
  await trainer.user.save();

  if (specialization !== undefined) trainer.specialization = specialization;
  if (experienceYears !== undefined) trainer.experienceYears = experienceYears;
  if (certifications !== undefined) trainer.certifications = certifications;
  if (bio !== undefined) trainer.bio = bio;
  if (salary !== undefined && req.user.role === ROLES.ADMIN) trainer.salary = salary;
  if (shiftStart !== undefined) trainer.shiftStart = shiftStart;
  if (shiftEnd !== undefined) trainer.shiftEnd = shiftEnd;
  await trainer.save();

  res.status(200).json(new ApiResponse(200, { trainer }, 'Trainer updated'));
};

/**
 * @route DELETE /api/trainers/:id
 * @access Admin
 */
const deleteTrainer = async (req, res) => {
  const trainer = await Trainer.findByPk(req.params.id);
  if (!trainer) throw ApiError.notFound('Trainer not found');

  const userId = trainer.userId;
  await Member.update({ assignedTrainerId: null }, { where: { assignedTrainerId: trainer.id } });
  await trainer.destroy();
  await User.destroy({ where: { id: userId } });

  res.status(200).json(new ApiResponse(200, null, 'Trainer deleted'));
};

module.exports = { createTrainer, getTrainers, getTrainerById, updateTrainer, deleteTrainer };
