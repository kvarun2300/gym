const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Trainer = sequelize.define(
  'Trainer',
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
    trainerCode: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      field: 'trainer_code',
    },
    specialization: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    experienceYears: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'experience_years',
    },
    certifications: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    salary: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    shiftStart: {
      type: DataTypes.TIME,
      allowNull: true,
      field: 'shift_start',
    },
    shiftEnd: {
      type: DataTypes.TIME,
      allowNull: true,
      field: 'shift_end',
    },
    rating: {
      type: DataTypes.DECIMAL(2, 1),
      allowNull: true,
      defaultValue: 0,
    },
  },
  {
    tableName: 'trainers',
    indexes: [{ unique: true, fields: ['user_id'] }, { unique: true, fields: ['trainer_code'] }],
  }
);

module.exports = Trainer;
