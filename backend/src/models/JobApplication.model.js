'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class JobApplication extends Model {
  static associate(models) {
    JobApplication.belongsTo(models.Job, { foreignKey: 'job_id', as: 'job' });
    JobApplication.belongsTo(models.Users, { foreignKey: 'user_id', as: 'applicant' });
  }
}

JobApplication.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  job_id: { type: DataTypes.INTEGER, allowNull: false },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  cover_letter: { type: DataTypes.TEXT },
  cv_path: { type: DataTypes.STRING },
  status: { type: DataTypes.ENUM('pending','reviewed','accepted','rejected'), defaultValue: 'pending' }
}, {
  sequelize,
  modelName: 'JobApplication',
  tableName: 'job_applications',
  timestamps: true,
  underscored: true
});

module.exports = JobApplication;