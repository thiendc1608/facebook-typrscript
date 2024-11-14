"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class StatusMakeFriend extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      StatusMakeFriend.belongsTo(models.Friend, {
        foreignKey: "status_id",
        targetKey: "id",
        as: "status_friend",
      });
    }
  }
  StatusMakeFriend.init(
    {
      status: DataTypes.ENUM("pending", "accepted", "declined"),
    },
    {
      sequelize,
      modelName: "StatusMakeFriend",
    }
  );
  return StatusMakeFriend;
};
