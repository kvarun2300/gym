const { Payment, Member, User, Subscription, Plan, Invoice, Notification } = require('../models');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const { getPagination, buildPaginatedResponse } = require('../utils/paginate');
const { PAYMENT_STATUS, NOTIFICATION_TYPE, INVOICE_STATUS } = require('../config/constants');
const { sendEmail, emailTemplates } = require('../utils/sendEmail');

const generateInvoiceNumber = () =>
  `INV-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;

/**
 * @route POST /api/payments
 * @access Admin
 * Records a payment and auto-generates an invoice for it.
 */
const createPayment = async (req, res) => {
  const { memberId, subscriptionId, amount, method, status, transactionRef, notes } = req.body;

  const member = await Member.findByPk(memberId, { include: [{ model: User, as: 'user' }] });
  if (!member) throw ApiError.notFound('Member not found');

  const payment = await Payment.create({
    memberId,
    subscriptionId: subscriptionId || null,
    amount,
    method,
    status: status || PAYMENT_STATUS.PAID,
    transactionRef: transactionRef || null,
    notes: notes || null,
    paidAt: (status || PAYMENT_STATUS.PAID) === PAYMENT_STATUS.PAID ? new Date() : null,
  });

  const tax = Number((amount * 0.0).toFixed(2)); // GST configurable via settings; default 0
  const total = Number(amount) + tax;

  const invoice = await Invoice.create({
    invoiceNumber: generateInvoiceNumber(),
    memberId,
    paymentId: payment.id,
    subtotal: amount,
    tax,
    total,
    status: payment.status === PAYMENT_STATUS.PAID ? INVOICE_STATUS.PAID : INVOICE_STATUS.UNPAID,
    issuedAt: new Date(),
  });

  await Notification.create({
    userId: member.userId,
    title: 'Payment Received',
    message: `We received your payment of ₹${amount}. Invoice #${invoice.invoiceNumber}.`,
    type: NOTIFICATION_TYPE.SUCCESS,
  });

  if (payment.status === PAYMENT_STATUS.PAID) {
    sendEmail({
      to: member.user.email,
      subject: `Payment Confirmation - Invoice #${invoice.invoiceNumber}`,
      html: emailTemplates.invoice(member.user.name, invoice.invoiceNumber, amount),
    }).catch(() => {});
  }

  res.status(201).json(new ApiResponse(201, { payment, invoice }, 'Payment recorded'));
};

/**
 * @route GET /api/payments
 * @access Admin
 */
const getPayments = async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const { status, method, memberId } = req.query;

  const where = {};
  if (status) where.status = status;
  if (method) where.method = method;
  if (memberId) where.memberId = memberId;

  const { rows, count } = await Payment.findAndCountAll({
    where,
    include: [
      { model: Member, as: 'member', include: [{ model: User, as: 'user', attributes: ['name', 'email'] }] },
      { model: Subscription, as: 'subscription', include: [{ model: Plan, as: 'plan', attributes: ['name'] }] },
    ],
    limit,
    offset,
    order: [['createdAt', 'DESC']],
    distinct: true,
  });

  res.status(200).json(new ApiResponse(200, buildPaginatedResponse(rows, count, page, limit), 'Payments fetched'));
};

/**
 * @route GET /api/payments/my-history
 * @access Member
 */
const getMyPayments = async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const member = await Member.findOne({ where: { userId: req.user.id } });
  if (!member) throw ApiError.notFound('Member profile not found');

  const { rows, count } = await Payment.findAndCountAll({
    where: { memberId: member.id },
    limit,
    offset,
    order: [['createdAt', 'DESC']],
  });

  res.status(200).json(new ApiResponse(200, buildPaginatedResponse(rows, count, page, limit), 'Payment history fetched'));
};

module.exports = { createPayment, getPayments, getMyPayments };
