const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const WorkoutPlan = sequelize.define(
  'WorkoutPlan',
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
    goal: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    // exercises: [{ day, name, sets, reps, restSeconds, notes }]
    exercises: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
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
    tableName: 'workout_plans',
    indexes: [{ fields: ['member_id'] }, { fields: ['trainer_id'] }],
  }
);

module.exports = WorkoutPlan;
