const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { GENDER } = require('../config/constants');

const Member = sequelize.define(
  'Member',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      field: 'user_id',
    },
    memberCode: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      field: 'member_code',
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'date_of_birth',
    },
    gender: {
      type: DataTypes.ENUM(GENDER.MALE, GENDER.FEMALE, GENDER.OTHER),
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    emergencyContactName: {
      type: DataTypes.STRING(120),
      allowNull: true,
      field: 'emergency_contact_name',
    },
    emergencyContactPhone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'emergency_contact_phone',
    },
    heightCm: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      field: 'height_cm',
    },
    weightKg: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      field: 'weight_kg',
    },
    goal: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    assignedTrainerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'assigned_trainer_id',
    },
    joinDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'join_date',
    },
  },
  {
    tableName: 'members',
    indexes: [{ unique: true, fields: ['user_id'] }, { unique: true, fields: ['member_code'] }],
  }
);

module.exports = Member;
