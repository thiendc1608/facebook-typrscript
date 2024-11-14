"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class Reel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Reel.belongsTo(models.User, {
        foreignKey: "user_id",
        targetKey: "id",
        as: "user",
      });
    }
  }
  Reel.init(
    {
      user_id: DataTypes.STRING,
      video_url: DataTypes.TEXT,
      thumbnail_url: DataTypes.TEXT,
      caption: DataTypes.TEXT,
      // music_track: DataTypes.TEXT,
      // duration: DataTypes.INTEGER,
      mode_privacy: DataTypes.ENUM("public", "friends", "except_friend"),
      expiredAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Reel",
    }
  );
  return Reel;
};
