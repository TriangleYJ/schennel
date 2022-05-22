'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Vote extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Vote.init({
    vid: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    participants: DataTypes.STRING,
    schedule_string: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Vote',
    paranoid: true,
    timestamps: true,
    deletedAt: 'destroyTime',
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci'
  });
  return Vote;
};