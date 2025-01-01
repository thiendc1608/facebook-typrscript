"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class CommentReaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CommentReaction.belongsTo(models.User, {
        foreignKey: "user_id",
        targetKey: "id",
        as: "userInfo",
      });

      CommentReaction.belongsTo(models.Emotion, {
        foreignKey: "emotion_id",
        targetKey: "id",
        as: "emotion",
      });

      CommentReaction.belongsTo(models.PostComment, {
        foreignKey: "comment_id",
        targetKey: "id",
        as: "comment",
      });
    }
  }
  CommentReaction.init(
    {
      comment_id: DataTypes.STRING,
      user_id: DataTypes.STRING,
      emotion_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "CommentReaction",
    }
  );
  return CommentReaction;
};
