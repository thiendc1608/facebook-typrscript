"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class ReelReaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ReelReaction.init(
    {
      user_id: DataTypes.STRING,
      reel_id: DataTypes.STRING,
      reaction_id: DataTypes.INTEGER,
      quantity_reaction: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "ReelReaction",
    }
  );
  return ReelReaction;
};
