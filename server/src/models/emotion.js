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
    }
  }
  Emotion.init(
    {
      emotion_name: DataTypes.ENUM(
        "like",
        "love",
        "favorite",
        "haha",
        "wow",
        "sad",
        "angry"
      ),
      emotion_icon: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Emotion",
    }
  );
  return Emotion;
};
