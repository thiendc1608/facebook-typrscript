"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class TypeNotification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TypeNotification.init(
    {
      name: DataTypes.ENUM("like", "comment", "message", "friend_request"),
    },
    {
      sequelize,
      modelName: "TypeNotification",
    }
  );
  return TypeNotification;
};
