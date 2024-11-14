"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class Friend extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Friend.hasMany(models.StatusMakeFriend, {
        foreignKey: "status_id",
        as: "status_friend",
      });
      Friend.belongsTo(models.User, {
        foreignKey: "user_response_id",
        targetKey: "id",
        as: "friends",
      });
    }
  }
  Friend.init(
    {
      user_request_id: DataTypes.STRING,
      user_response_id: DataTypes.STRING,
      status_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Friend",
    }
  );
  return Friend;
};
