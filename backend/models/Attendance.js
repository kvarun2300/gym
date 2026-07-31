const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { ATTENDANCE_STATUS } = require('../config/constants');

const Attendance = sequelize.define(
  'Attendance',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    memberId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'member_id',
    },
    trainerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'trainer_id',
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    checkIn: {
      type: DataTypes.TIME,
      allowNull: true,
      field: 'check_in',
    },
    checkOut: {
      type: DataTypes.TIME,
      allowNull: true,
      field: 'check_out',
    },
    status: {
      type: DataTypes.ENUM(
        ATTENDANCE_STATUS.PRESENT,
        ATTENDANCE_STATUS.ABSENT,
        ATTENDANCE_STATUS.LATE
      ),
      allowNull: false,
      defaultValue: ATTENDANCE_STATUS.PRESENT,
    },
    checkInMethod: {
      type: DataTypes.ENUM('qr', 'manual'),
      allowNull: false,
      defaultValue: 'manual',
      field: 'check_in_method',
    },
  },
  {
    tableName: 'attendance',
    indexes: [
      { fields: ['member_id', 'date'] },
      { fields: ['trainer_id', 'date'] },
      { fields: ['date'] },
    ],
  }
);

module.exports = Attendance;
