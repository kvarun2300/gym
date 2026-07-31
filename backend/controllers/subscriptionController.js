const { Subscription, Plan, Member, User, Notification } = require('../models');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const { getPagination, buildPaginatedResponse } = require('../utils/paginate');
const { SUBSCRIPTION_STATUS, NOTIFICATION_TYPE } = require('../config/constants');

const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

/**
 * @route POST /api/subscriptions
 * @access Admin
 * Creates a new subscription for a member on a given plan. Deactivates prior active subs.
 */
const createSubscription = async (req, res) => {
  const { memberId, planId, startDate, autoRenew } = req.body;

  const member = await Member.findByPk(memberId);
  if (!member) throw ApiError.notFound('Member not found');

  const plan = await Plan.findByPk(planId);
  if (!plan) throw ApiError.notFound('Plan not found');

  const start = startDate ? new Date(startDate) : new Date();
  const end = addDays(start, plan.durationDays);

  // Expire any currently active subscriptions for this member
  await Subscription.update(
    { status: SUBSCRIPTION_STATUS.EXPIRED },
    { where: { memberId, status: SUBSCRIPTION_STATUS.ACTIVE } }
  );

  const subscription = await Subscription.create({
    memberId,
    planId,
    startDate: start,
    endDate: end,
    status: SUBSCRIPTION_STATUS.ACTIVE,
    autoRenew: !!autoRenew,
  });

  await Notification.create({
    userId: member.userId,
    title: 'Membership Activated',
    message: `Your ${plan.name} plan is now active until ${end.toDateString()}.`,
    type: NOTIFICATION_TYPE.SUCCESS,
  });

  res.status(201).json(new ApiResponse(201, { subscription }, 'Subscription created'));
};

/**
 * @route GET /api/subscriptions
 * @access Admin
 */
const getSubscriptions = async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const { status, memberId, expiringInDays } = req.query;

  const where = {};
  if (status) where.status = status;
  if (memberId) where.memberId = memberId;
  if (expiringInDays) {
    const { Op } = require('sequelize');
    where.status = SUBSCRIPTION_STATUS.ACTIVE;
    where.endDate = { [Op.between]: [new Date(), addDays(new Date(), Number(expiringInDays))] };
  }

  const { rows, count } = await Subscription.findAndCountAll({
    where,
    include: [
      { model: Plan, as: 'plan' },
      { model: Member, as: 'member', include: [{ model: User, as: 'user', attributes: ['name', 'email', 'phone'] }] },
    ],
    limit,
    offset,
    order: [['createdAt', 'DESC']],
    distinct: true,
  });

  res.status(200).json(new ApiResponse(200, buildPaginatedResponse(rows, count, page, limit), 'Subscriptions fetched'));
};

/**
 * @route PUT /api/subscriptions/:id/cancel
 * @access Admin
 */
const cancelSubscription = async (req, res) => {
  const subscription = await Subscription.findByPk(req.params.id);
  if (!subscription) throw ApiError.notFound('Subscription not found');

  subscription.status = SUBSCRIPTION_STATUS.CANCELLED;
  subscription.autoRenew = false;
  await subscription.save();

  res.status(200).json(new ApiResponse(200, { subscription }, 'Subscription cancelled'));
};

module.exports = { createSubscription, getSubscriptions, cancelSubscription };
