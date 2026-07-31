const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { Op } = require('sequelize');
const { User, Member, Trainer } = require('../models');
const { generateAccessToken, generateRefreshToken, verifyToken } = require('../utils/generateToken');
const { sendEmail, emailTemplates } = require('../utils/sendEmail');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const { ROLES } = require('../config/constants');

const sanitizeUser = (user) => {
  const plain = user.toJSON ? user.toJSON() : user;
  delete plain.password;
  delete plain.resetPasswordToken;
  delete plain.resetPasswordExpires;
  return plain;
};

const generateCode = (prefix) =>
  `${prefix}-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 90 + 10)}`;

/**
 * @route POST /api/auth/register
 * @desc  Public self-registration - always creates a MEMBER account.
 *        Admin/trainer accounts are created via the admin-only user management API.
 */
const register = async (req, res) => {
  const { name, email, password, phone, dateOfBirth, gender } = req.body;

  const existing = await User.findOne({ where: { email } });
  if (existing) {
    throw ApiError.conflict('An account with this email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    name,
    email,
    phone,
    password: hashedPassword,
    role: ROLES.MEMBER,
  });

  await Member.create({
    userId: user.id,
    memberCode: generateCode('MEM'),
    dateOfBirth: dateOfBirth || null,
    gender: gender || null,
    joinDate: new Date(),
  });

  const accessToken = generateAccessToken({ id: user.id, role: user.role });
  const refreshToken = generateRefreshToken({ id: user.id });

  sendEmail({
    to: user.email,
    subject: 'Welcome to Xtreme Fitness!',
    html: emailTemplates.welcome(user.name),
  }).catch(() => {});

  res
    .status(201)
    .json(new ApiResponse(201, { user: sanitizeUser(user), accessToken, refreshToken }, 'Registration successful'));
};

/**
 * @route POST /api/auth/login
 */
const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  if (!user.isActive) {
    throw ApiError.forbidden('Your account has been deactivated. Contact admin.');
  }

  user.lastLoginAt = new Date();
  await user.save();

  const accessToken = generateAccessToken({ id: user.id, role: user.role });
  const refreshToken = generateRefreshToken({ id: user.id });

  res
    .status(200)
    .json(new ApiResponse(200, { user: sanitizeUser(user), accessToken, refreshToken }, 'Login successful'));
};

/**
 * @route POST /api/auth/refresh-token
 */
const refreshTokenHandler = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    throw ApiError.badRequest('Refresh token is required');
  }

  let decoded;
  try {
    decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    throw ApiError.unauthorized('Invalid or expired refresh token');
  }

  const user = await User.findByPk(decoded.id);
  if (!user || !user.isActive) {
    throw ApiError.unauthorized('User not found or inactive');
  }

  const accessToken = generateAccessToken({ id: user.id, role: user.role });
  res.status(200).json(new ApiResponse(200, { accessToken }, 'Token refreshed'));
};

/**
 * @route GET /api/auth/me
 */
const getMe = async (req, res) => {
  const user = await User.findByPk(req.user.id, {
    attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpires'] },
    include: [
      { model: Member, as: 'memberProfile' },
      { model: Trainer, as: 'trainerProfile' },
    ],
  });
  res.status(200).json(new ApiResponse(200, { user }, 'Current user fetched'));
};

/**
 * @route PUT /api/auth/update-profile
 */
const updateProfile = async (req, res) => {
  const { name, phone } = req.body;
  const user = await User.findByPk(req.user.id);

  if (name) user.name = name;
  if (phone) user.phone = phone;
  if (req.file) user.profileImage = `/uploads/profiles/${req.file.filename}`;

  await user.save();
  res.status(200).json(new ApiResponse(200, { user: sanitizeUser(user) }, 'Profile updated'));
};

/**
 * @route PUT /api/auth/change-password
 */
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findByPk(req.user.id);

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    throw ApiError.badRequest('Current password is incorrect');
  }

  user.password = await bcrypt.hash(newPassword, 12);
  await user.save();

  res.status(200).json(new ApiResponse(200, null, 'Password changed successfully'));
};

/**
 * @route POST /api/auth/forgot-password
 */
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ where: { email } });

  // Always respond the same way to avoid leaking which emails are registered
  const genericMessage = 'If an account exists with that email, a reset link has been sent.';

  if (!user) {
    return res.status(200).json(new ApiResponse(200, null, genericMessage));
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 min
  await user.save();

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  sendEmail({
    to: user.email,
    subject: 'Reset Your Xtreme Fitness Password',
    html: emailTemplates.passwordReset(user.name, resetUrl),
  }).catch(() => {});

  res.status(200).json(new ApiResponse(200, null, genericMessage));
};

/**
 * @route PUT /api/auth/reset-password/:token
 */
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    where: {
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { [Op.gt]: new Date() },
    },
  });

  if (!user) {
    throw ApiError.badRequest('Invalid or expired reset token');
  }

  user.password = await bcrypt.hash(password, 12);
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  await user.save();

  res.status(200).json(new ApiResponse(200, null, 'Password reset successful. Please log in.'));
};

module.exports = {
  register,
  login,
  refreshTokenHandler,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
};
