const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { INVOICE_STATUS } = require('../config/constants');

const Invoice = sequelize.define(
  'Invoice',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    invoiceNumber: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
      field: 'invoice_number',
    },
    memberId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'member_id',
    },
    paymentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'payment_id',
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    tax: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        INVOICE_STATUS.PAID,
        INVOICE_STATUS.UNPAID,
        INVOICE_STATUS.OVERDUE
      ),
      allowNull: false,
      defaultValue: INVOICE_STATUS.UNPAID,
    },
    dueDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'due_date',
    },
    issuedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'issued_at',
    },
    pdfPath: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'pdf_path',
    },
  },
  {
    tableName: 'invoices',
    indexes: [{ unique: true, fields: ['invoice_number'] }, { fields: ['member_id'] }],
  }
);

module.exports = Invoice;
