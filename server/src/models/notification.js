"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Notification.init(
    {
      user_id: DataTypes.STRING,
      type_id: DataTypes.INTEGER,
      source_id: DataTypes.STRING,
      message: DataTypes.TEXT("long"),
      id_read: DataTypes.ENUM("read", "not read"),
    },
    {
      sequelize,
      modelName: "Notification",
    }
  );
  return Notification;
};