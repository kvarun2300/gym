const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Progress = sequelize.define(
  'Progress',
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
    recordedAt: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'recorded_at',
    },
    weightKg: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      field: 'weight_kg',
    },
    heightCm: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      field: 'height_cm',
    },
    bmi: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    bodyFatPercent: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      field: 'body_fat_percent',
    },
    chestCm: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      field: 'chest_cm',
    },
    waistCm: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      field: 'waist_cm',
    },
    armsCm: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      field: 'arms_cm',
    },
    notes: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    photoUrl: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'photo_url',
    },
  },
  {
    tableName: 'progress',
    indexes: [{ fields: ['member_id', 'recorded_at'] }],
  }
);

module.exports = Progress;
