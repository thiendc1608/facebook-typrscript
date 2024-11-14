"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class PostReaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PostReaction.init(
    {
      post_id: DataTypes.STRING,
      user_id: DataTypes.STRING,
      reaction_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "PostReaction",
    }
  );
  return PostReaction;
};
