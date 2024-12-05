"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class MessageReact extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // MessageReact model
      // Mối quan hệ giữa MessageReact và User (emoji dropper)
      MessageReact.belongsTo(models.User, {
        foreignKey: "emoji_dropper_id", // Giả sử emoji_dropper_id là khóa ngoại trong bảng MessageReact
        as: "userReact",
      });
      MessageReact.belongsTo(models.Message, {
        foreignKey: "message_id",
        as: "message",
      });
    }
  }
  MessageReact.init(
    {
      message_id: DataTypes.STRING,
      emoji_dropper_id: DataTypes.STRING,
      emoji_icon: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "MessageReact",
    }
  );
  return MessageReact;
};
