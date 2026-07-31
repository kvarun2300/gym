const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const { Invoice, Member, User, Payment } = require('../models');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const { getPagination, buildPaginatedResponse } = require('../utils/paginate');
const { ROLES } = require('../config/constants');

/**
 * @route GET /api/invoices
 * @access Admin
 */
const getInvoices = async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const { status, memberId } = req.query;

  const where = {};
  if (status) where.status = status;
  if (memberId) where.memberId = memberId;

  const { rows, count } = await Invoice.findAndCountAll({
    where,
    include: [{ model: Member, as: 'member', include: [{ model: User, as: 'user', attributes: ['name', 'email'] }] }],
    limit,
    offset,
    order: [['issuedAt', 'DESC']],
    distinct: true,
  });

  res.status(200).json(new ApiResponse(200, buildPaginatedResponse(rows, count, page, limit), 'Invoices fetched'));
};

/**
 * @route GET /api/invoices/my-invoices
 * @access Member
 */
const getMyInvoices = async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const member = await Member.findOne({ where: { userId: req.user.id } });
  if (!member) throw ApiError.notFound('Member profile not found');

  const { rows, count } = await Invoice.findAndCountAll({
    where: { memberId: member.id },
    limit,
    offset,
    order: [['issuedAt', 'DESC']],
  });

  res.status(200).json(new ApiResponse(200, buildPaginatedResponse(rows, count, page, limit), 'Invoices fetched'));
};

/**
 * @route GET /api/invoices/:id/pdf
 * @access Admin, Owning Member
 * Streams a branded PDF invoice.
 */
const downloadInvoicePdf = async (req, res) => {
  const invoice = await Invoice.findByPk(req.params.id, {
    include: [
      { model: Member, as: 'member', include: [{ model: User, as: 'user' }] },
      { model: Payment, as: 'payment' },
    ],
  });
  if (!invoice) throw ApiError.notFound('Invoice not found');

  if (req.user.role === ROLES.MEMBER) {
    const member = await Member.findOne({ where: { userId: req.user.id } });
    if (!member || member.id !== invoice.memberId) {
      throw ApiError.forbidden('You do not have access to this invoice');
    }
  }

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=${invoice.invoiceNumber}.pdf`);

  const doc = new PDFDocument({ margin: 50 });
  doc.pipe(res);

  const logoPath = path.join(__dirname, '..', 'assets', 'logo.jpeg');

  // Header
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 50, 45, { width: 60 });
  }
  doc
    .fillColor('#0B0B0B')
    .fontSize(20)
    .text('XTREME FITNESS', 120, 50)
    .fontSize(10)
    .fillColor('#555')
    .text('Raichur, Karnataka, India', 120, 72)
    .moveDown();

  doc.moveTo(50, 110).lineTo(560, 110).strokeColor('#B3001B').lineWidth(2).stroke();

  // Invoice meta
  doc
    .fillColor('#0B0B0B')
    .fontSize(16)
    .text('INVOICE', 50, 130)
    .fontSize(10)
    .fillColor('#333')
    .text(`Invoice #: ${invoice.invoiceNumber}`, 50, 155)
    .text(`Issued: ${new Date(invoice.issuedAt).toDateString()}`, 50, 170)
    .text(`Status: ${invoice.status.toUpperCase()}`, 50, 185);

  doc
    .text('Billed To:', 350, 155)
    .text(invoice.member.user.name, 350, 170)
    .text(invoice.member.user.email, 350, 185);

  // Table
  const tableTop = 230;
  doc.fontSize(11).fillColor('#fff');
  doc.rect(50, tableTop, 510, 24).fill('#0B0B0B');
  doc.fillColor('#fff').text('Description', 60, tableTop + 7).text('Amount (₹)', 460, tableTop + 7);

  doc.fillColor('#333').fontSize(10);
  doc.text('Membership / Service Payment', 60, tableTop + 35).text(`${invoice.subtotal}`, 460, tableTop + 35);

  doc.moveTo(50, tableTop + 60).lineTo(560, tableTop + 60).strokeColor('#ddd').stroke();
  doc.text('Subtotal', 400, tableTop + 70).text(`₹${invoice.subtotal}`, 460, tableTop + 70);
  doc.text('Tax', 400, tableTop + 88).text(`₹${invoice.tax}`, 460, tableTop + 88);
  doc.fontSize(12).fillColor('#B3001B').text('Total', 400, tableTop + 108).text(`₹${invoice.total}`, 460, tableTop + 108);

  doc
    .fontSize(9)
    .fillColor('#888')
    .text('Thank you for training with Xtreme Fitness.', 50, 700, { align: 'center', width: 510 });

  doc.end();
};

module.exports = { getInvoices, getMyInvoices, downloadInvoicePdf };
