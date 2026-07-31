const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { SUBSCRIPTION_STATUS } = require('../config/constants');

const Subscription = sequelize.define(
  'Subscription',
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
    planId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'plan_id',
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'start_date',
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'end_date',
    },
    status: {
      type: DataTypes.ENUM(
        SUBSCRIPTION_STATUS.ACTIVE,
        SUBSCRIPTION_STATUS.EXPIRED,
        SUBSCRIPTION_STATUS.CANCELLED,
        SUBSCRIPTION_STATUS.PENDING
      ),
      allowNull: false,
      defaultValue: SUBSCRIPTION_STATUS.PENDING,
    },
    autoRenew: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'auto_renew',
    },
  },
  {
    tableName: 'subscriptions',
    indexes: [{ fields: ['member_id'] }, { fields: ['status'] }, { fields: ['end_date'] }],
  }
);

module.exports = Subscription;
