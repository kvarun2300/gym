const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const DietPlan = sequelize.define(
  'DietPlan',
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
    trainerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'trainer_id',
    },
    title: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    targetCalories: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'target_calories',
    },
    // meals: [{ mealType, items: [{name, quantity, calories}] }]
    meals: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'start_date',
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'end_date',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active',
    },
  },
  {
    tableName: 'diet_plans',
    indexes: [{ fields: ['member_id'] }, { fields: ['trainer_id'] }],
  }
);

module.exports = DietPlan;
