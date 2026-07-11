'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Job extends Model {
  static associate(models) {
    Job.belongsTo(models.Users, { foreignKey: 'user_id', as: 'poster' });
    Job.hasMany(models.JobApplication, { foreignKey: 'job_id', as: 'applications' });
  }
}

Job.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  company: { type: DataTypes.STRING },
  description: { type: DataTypes.TEXT },
  location: { type: DataTypes.STRING },
  country: { type: DataTypes.STRING },
  type: { type: DataTypes.ENUM('full_time','part_time','freelance','internship','remote'), defaultValue: 'full_time' },
  salary_min: { type: DataTypes.DECIMAL(10,2) },
  salary_max: { type: DataTypes.DECIMAL(10,2) },
  currency: { type: DataTypes.STRING, defaultValue: 'USD' },
  languages: { type: DataTypes.JSON },
  skills: { type: DataTypes.JSON },
  markets: { type: DataTypes.JSON },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  sequelize,
  modelName: 'Job',
  tableName: 'jobs',
  timestamps: true,
  underscored: true
});

module.exports = Job;