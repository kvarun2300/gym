const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Gallery = sequelize.define(
  'Gallery',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    category: {
      type: DataTypes.ENUM('transformation', 'facility', 'event', 'general'),
      allowNull: false,
      defaultValue: 'general',
    },
    imageUrl: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'image_url',
    },
    beforeImageUrl: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'before_image_url',
    },
    afterImageUrl: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'after_image_url',
    },
    description: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    uploadedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'uploaded_by',
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_published',
    },
  },
  {
    tableName: 'gallery',
  }
);

module.exports = Gallery;
