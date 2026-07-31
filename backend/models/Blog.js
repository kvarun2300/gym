const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Blog = sequelize.define(
  'Blog',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(220),
      allowNull: false,
      unique: true,
    },
    excerpt: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
    coverImage: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'cover_image',
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'author_id',
    },
    category: {
      type: DataTypes.STRING(80),
      allowNull: true,
    },
    tags: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_published',
    },
    publishedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'published_at',
    },
  },
  {
    tableName: 'blogs',
    indexes: [{ unique: true, fields: ['slug'] }],
  }
);

module.exports = Blog;
