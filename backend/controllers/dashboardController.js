const { Op, fn, col, literal } = require('sequelize');
const {
  Member,
  Trainer,
  Payment,
  Subscription,
  Attendance,
  Plan,
  User,
} = require('../models');
const ApiResponse = require('../utils/ApiResponse');
const { PAYMENT_STATUS, SUBSCRIPTION_STATUS, ATTENDANCE_STATUS, ROLES } = require('../config/constants');

const monthsAgo = (n) => {
  const d = new Date();
  d.setMonth(d.getMonth() - n);
  return d;
};

/**
 * @route GET /api/dashboard/admin
 * @access Admin
 */
const getAdminDashboard = async (req, res) => {
  const [totalMembers, totalTrainers, activeSubscriptions] = await Promise.all([
    Member.count(),
    Trainer.count(),
    Subscription.count({ where: { status: SUBSCRIPTION_STATUS.ACTIVE } }),
  ]);

  const revenueThisMonthRow = await Payment.findOne({
    attributes: [[fn('SUM', col('amount')), 'total']],
    where: {
      status: PAYMENT_STATUS.PAID,
      createdAt: { [Op.gte]: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
    },
    raw: true,
  });

  const monthlyRevenue = await Payment.findAll({
    attributes: [
      [fn('DATE_FORMAT', col('paid_at'), '%Y-%m'), 'month'],
      [fn('SUM', col('amount')), 'total'],
    ],
    where: { status: PAYMENT_STATUS.PAID, paidAt: { [Op.gte]: monthsAgo(6) } },
    group: [literal('month')],
    order: [[literal('month'), 'ASC']],
    raw: true,
  });

  const membershipGrowth = await Subscription.findAll({
    attributes: [
      [fn('DATE_FORMAT', col('start_date'), '%Y-%m'), 'month'],
      [fn('COUNT', col('id')), 'count'],
    ],
    where: { startDate: { [Op.gte]: monthsAgo(6) } },
    group: [literal('month')],
    order: [[literal('month'), 'ASC']],
    raw: true,
  });

  const planDistribution = await Subscription.findAll({
    attributes: [[col('plan.name'), 'planName'], [fn('COUNT', col('Subscription.id')), 'count']],
    include: [{ model: Plan, as: 'plan', attributes: [] }],
    where: { status: SUBSCRIPTION_STATUS.ACTIVE },
    group: ['plan.id', 'plan.name'],
    raw: true,
  });

  const genderRatio = await Member.findAll({
    attributes: ['gender', [fn('COUNT', col('id')), 'count']],
    group: ['gender'],
    raw: true,
  });

  const todayAttendanceCount = await Attendance.count({
    where: { date: new Date().toISOString().slice(0, 10), status: ATTENDANCE_STATUS.PRESENT },
  });

  const totalActiveMembers = await Member.count({
    include: [{ association: 'user', where: { isActive: true }, attributes: [] }],
  });
  const attendancePercentage = totalActiveMembers
    ? Number(((todayAttendanceCount / totalActiveMembers) * 100).toFixed(1))
    : 0;

  const recentPayments = await Payment.findAll({
    limit: 8,
    order: [['createdAt', 'DESC']],
    include: [{ model: Member, as: 'member', include: [{ model: User, as: 'user', attributes: ['name'] }] }],
  });

  const topTrainers = await Trainer.findAll({
    limit: 5,
    order: [['rating', 'DESC']],
    include: [{ model: User, as: 'user', attributes: ['name', 'profileImage'] }],
  });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        summary: {
          totalMembers,
          totalTrainers,
          activeSubscriptions,
          revenueThisMonth: Number(revenueThisMonthRow?.total || 0),
          attendancePercentageToday: attendancePercentage,
        },
        charts: {
          monthlyRevenue,
          membershipGrowth,
          planDistribution,
          genderRatio,
        },
        recentPayments,
        topTrainers,
      },
      'Admin dashboard data fetched'
    )
  );
};

/**
 * @route GET /api/dashboard/trainer
 * @access Trainer
 */
const getTrainerDashboard = async (req, res) => {
  const trainer = await Trainer.findOne({ where: { userId: req.user.id } });
  if (!trainer) return res.status(404).json(new ApiResponse(404, null, 'Trainer profile not found'));

  const assignedMembersCount = await Member.count({ where: { assignedTrainerId: trainer.id } });

  const todayAttendance = await Attendance.findOne({
    where: { trainerId: trainer.id, date: new Date().toISOString().slice(0, 10) },
  });

  const recentAssignedMembers = await Member.findAll({
    where: { assignedTrainerId: trainer.id },
    limit: 6,
    order: [['createdAt', 'DESC']],
    include: [{ model: User, as: 'user', attributes: ['name', 'profileImage'] }],
  });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        summary: {
          assignedMembersCount,
          checkedInToday: !!todayAttendance?.checkIn,
        },
        recentAssignedMembers,
      },
      'Trainer dashboard data fetched'
    )
  );
};

/**
 * @route GET /api/dashboard/member
 * @access Member
 */
const getMemberDashboard = async (req, res) => {
  const member = await Member.findOne({ where: { userId: req.user.id } });
  if (!member) return res.status(404).json(new ApiResponse(404, null, 'Member profile not found'));

  const activeSubscription = await Subscription.findOne({
    where: { memberId: member.id, status: SUBSCRIPTION_STATUS.ACTIVE },
    include: [{ model: Plan, as: 'plan' }],
    order: [['endDate', 'DESC']],
  });

  const attendanceThisMonth = await Attendance.count({
    where: {
      memberId: member.id,
      status: ATTENDANCE_STATUS.PRESENT,
      date: { [Op.gte]: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10) },
    },
  });

  const totalDuePayments = await Payment.count({
    where: { memberId: member.id, status: PAYMENT_STATUS.PENDING },
  });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        summary: {
          activeSubscription,
          attendanceThisMonth,
          pendingPayments: totalDuePayments,
        },
      },
      'Member dashboard data fetched'
    )
  );
};

module.exports = { getAdminDashboard, getTrainerDashboard, getMemberDashboard };
