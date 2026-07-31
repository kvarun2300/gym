const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { NOTIFICATION_TYPE } = require('../config/constants');

const Notification = sequelize.define(
  'Notification',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
    },
    title: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(
        NOTIFICATION_TYPE.INFO,
        NOTIFICATION_TYPE.SUCCESS,
        NOTIFICATION_TYPE.WARNING,
        NOTIFICATION_TYPE.DANGER
      ),
      allowNull: false,
      defaultValue: NOTIFICATION_TYPE.INFO,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_read',
    },
    link: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: 'notifications',
    indexes: [{ fields: ['user_id'] }, { fields: ['is_read'] }],
  }
);

module.exports = Notification;
