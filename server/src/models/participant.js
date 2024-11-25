"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class Participant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Participant.init(
    {
      conversation_id: DataTypes.STRING,
      user_id: DataTypes.STRING,
      join_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Participant",
    }
  );
  return Participant;
};
