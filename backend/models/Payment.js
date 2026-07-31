const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { PAYMENT_STATUS, PAYMENT_METHOD } = require('../config/constants');

const Payment = sequelize.define(
  'Payment',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    memberId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'member_id',
    },
    subscriptionId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'subscription_id',
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    method: {
      type: DataTypes.ENUM(
        PAYMENT_METHOD.CASH,
        PAYMENT_METHOD.CARD,
        PAYMENT_METHOD.UPI,
        PAYMENT_METHOD.NET_BANKING
      ),
      allowNull: false,
      defaultValue: PAYMENT_METHOD.CASH,
    },
    status: {
      type: DataTypes.ENUM(
        PAYMENT_STATUS.PAID,
        PAYMENT_STATUS.PENDING,
        PAYMENT_STATUS.FAILED,
        PAYMENT_STATUS.REFUNDED
      ),
      allowNull: false,
      defaultValue: PAYMENT_STATUS.PENDING,
    },
    transactionRef: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'transaction_ref',
    },
    paidAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'paid_at',
    },
    notes: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: 'payments',
    indexes: [{ fields: ['member_id'] }, { fields: ['status'] }],
  }
);

module.exports = Payment;
