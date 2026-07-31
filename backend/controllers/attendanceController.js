const { Op } = require('sequelize');
const { Attendance, Member, Trainer, User } = require('../models');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const { getPagination, buildPaginatedResponse } = require('../utils/paginate');
const { ATTENDANCE_STATUS, ROLES } = require('../config/constants');

const todayStr = () => new Date().toISOString().slice(0, 10);
const nowTimeStr = () => new Date().toTimeString().slice(0, 8);

/**
 * @route POST /api/attendance/check-in
 * @access Member, Trainer (self check-in via QR or manual)
 */
const checkIn = async (req, res) => {
  const { method = 'manual', memberId, trainerId } = req.body;
  const date = todayStr();

  let targetMemberId = memberId;
  let targetTrainerId = trainerId;

  // Non-admin users can only check themselves in
  if (req.user.role === ROLES.MEMBER) {
    const member = await Member.findOne({ where: { userId: req.user.id } });
    if (!member) throw ApiError.notFound('Member profile not found');
    targetMemberId = member.id;
    targetTrainerId = null;
  } else if (req.user.role === ROLES.TRAINER) {
    const trainer = await Trainer.findOne({ where: { userId: req.user.id } });
    if (!trainer) throw ApiError.notFound('Trainer profile not found');
    targetTrainerId = trainer.id;
    targetMemberId = null;
  }

  const where = targetMemberId ? { memberId: targetMemberId, date } : { trainerId: targetTrainerId, date };
  const existing = await Attendance.findOne({ where });
  if (existing && existing.checkIn) {
    throw ApiError.conflict('Already checked in today');
  }

  const record =
    existing ||
    (await Attendance.create({
      memberId: targetMemberId,
      trainerId: targetTrainerId,
      date,
      status: ATTENDANCE_STATUS.PRESENT,
      checkInMethod: method,
    }));

  record.checkIn = nowTimeStr();
  record.checkInMethod = method;
  await record.save();

  res.status(200).json(new ApiResponse(200, { attendance: record }, 'Checked in successfully'));
};

/**
 * @route POST /api/attendance/check-out
 */
const checkOut = async (req, res) => {
  const date = todayStr();
  let where;

  if (req.user.role === ROLES.MEMBER) {
    const member = await Member.findOne({ where: { userId: req.user.id } });
    where = { memberId: member.id, date };
  } else if (req.user.role === ROLES.TRAINER) {
    const trainer = await Trainer.findOne({ where: { userId: req.user.id } });
    where = { trainerId: trainer.id, date };
  } else {
    throw ApiError.badRequest('Admin cannot self check-out');
  }

  const record = await Attendance.findOne({ where });
  if (!record || !record.checkIn) throw ApiError.badRequest('No check-in found for today');

  record.checkOut = nowTimeStr();
  await record.save();

  res.status(200).json(new ApiResponse(200, { attendance: record }, 'Checked out successfully'));
};

/**
 * @route POST /api/attendance/manual
 * @access Admin, Trainer - manually mark attendance for a member
 */
const markAttendanceManually = async (req, res) => {
  const { memberId, date, status, checkIn, checkOut } = req.body;

  const [record, created] = await Attendance.findOrCreate({
    where: { memberId, date: date || todayStr() },
    defaults: { status: status || ATTENDANCE_STATUS.PRESENT, checkIn, checkOut, checkInMethod: 'manual' },
  });

  if (!created) {
    record.status = status || record.status;
    if (checkIn) record.checkIn = checkIn;
    if (checkOut) record.checkOut = checkOut;
    await record.save();
  }

  res.status(200).json(new ApiResponse(200, { attendance: record }, 'Attendance recorded'));
};

/**
 * @route GET /api/attendance
 * @access Admin, Trainer
 */
const getAttendance = async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const { memberId, trainerId, startDate, endDate, status } = req.query;

  const where = {};
  if (memberId) where.memberId = memberId;
  if (trainerId) where.trainerId = trainerId;
  if (status) where.status = status;
  if (startDate && endDate) where.date = { [Op.between]: [startDate, endDate] };

  // Trainers may only view attendance for members assigned to them
  if (req.user.role === ROLES.TRAINER) {
    const trainer = await Trainer.findOne({ where: { userId: req.user.id } });
    if (!trainer) throw ApiError.notFound('Trainer profile not found');
    const assignedMembers = await Member.findAll({ where: { assignedTrainerId: trainer.id }, attributes: ['id'] });
    const assignedIds = assignedMembers.map((m) => m.id);
    where.memberId = memberId ? memberId : { [Op.in]: assignedIds.length ? assignedIds : [-1] };
  }

  const { rows, count } = await Attendance.findAndCountAll({
    where,
    include: [
      { model: Member, as: 'member', include: [{ model: User, as: 'user', attributes: ['name', 'profileImage'] }] },
      { model: Trainer, as: 'trainer', include: [{ model: User, as: 'user', attributes: ['name', 'profileImage'] }] },
    ],
    limit,
    offset,
    order: [['date', 'DESC']],
    distinct: true,
  });

  res.status(200).json(new ApiResponse(200, buildPaginatedResponse(rows, count, page, limit), 'Attendance fetched'));
};

/**
 * @route GET /api/attendance/my-history
 * @access Member, Trainer
 */
const getMyAttendanceHistory = async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  let where = {};

  if (req.user.role === ROLES.MEMBER) {
    const member = await Member.findOne({ where: { userId: req.user.id } });
    where.memberId = member.id;
  } else if (req.user.role === ROLES.TRAINER) {
    const trainer = await Trainer.findOne({ where: { userId: req.user.id } });
    where.trainerId = trainer.id;
  }

  const { rows, count } = await Attendance.findAndCountAll({
    where,
    limit,
    offset,
    order: [['date', 'DESC']],
  });

  res.status(200).json(new ApiResponse(200, buildPaginatedResponse(rows, count, page, limit), 'Attendance history fetched'));
};

module.exports = { checkIn, checkOut, markAttendanceManually, getAttendance, getMyAttendanceHistory };
