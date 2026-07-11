'use strict';
const {Model,DataTypes}=require('sequelize');
const sequelize=require('../config/database');
class Comment extends Model{}
Comment.init({id:{type:DataTypes.UUID,defaultValue:DataTypes.UUIDV4,primaryKey:true},user_id:{type:DataTypes.INTEGER,allowNull:false},post_id:{type:DataTypes.INTEGER,allowNull:false},content:{type:DataTypes.TEXT,allowNull:false},is_deleted:{type:DataTypes.BOOLEAN,defaultValue:false}},{sequelize,modelName:'Comment',tableName:'comments',timestamps:true,paranoid:true,underscored:true,indexes:[{fields:['user_id']},{fields:['post_id']}]});
module.exports=Comment;