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
    group_id: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Reminder',
    timestamps: true,
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci'
  });
  return Reminder;
};