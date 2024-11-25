"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class StatusUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  StatusUser.init(
    {
      status: DataTypes.ENUM("online", "offline"),
    },
    {
      sequelize,
      modelName: "StatusUser",
    }
  );
  return StatusUser;
};
