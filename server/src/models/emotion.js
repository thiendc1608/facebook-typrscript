"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class Emotion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Emotion.belongsToMany(models.Post, {
        through: models.PostReaction, // Bảng trung gian
        foreignKey: "emotion_id",
        otherKey: "post_id",
      });
    }
  }
  Emotion.init(
    {
      emotion_name: DataTypes.ENUM(
        "like",
        "heart",
        "haha",
        "wow",
        "sad",
        "angry"
      ),
      emotion_icon: DataTypes.STRING,
      emotion_post: DataTypes.TEXT("long"),
    },
    {
      sequelize,
      modelName: "Emotion",
    }
  );
  return Emotion;
};
