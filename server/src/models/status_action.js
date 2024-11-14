"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class StatusAction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  StatusAction.init(
    {
      status: DataTypes.ENUM("online", "offline"),
    },
    {
      sequelize,
      modelName: "StatusAction",
    }
  );
  return StatusAction;
};
