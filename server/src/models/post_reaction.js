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
      PostReaction.belongsTo(models.Emotion, {
        foreignKey: "emotion_id",
        as: "emotion",
      });
      PostReaction.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "userInfo",
      });
    }
  }
  PostReaction.init(
    {
      post_id: DataTypes.STRING,
      user_id: DataTypes.STRING,
      emotion_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "PostReaction",
    }
  );
  return PostReaction;
};
