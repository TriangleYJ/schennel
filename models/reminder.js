'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reminder extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Reminder.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    participants: DataTypes.STRING,
    schedule_string: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Reminder',
    paranoid: true,
    timestamps: true,
    deletedAt: 'destroyTime'
  });
  return Reminder;
};