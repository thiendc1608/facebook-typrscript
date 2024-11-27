"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class Conversation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Conversation.hasMany(models.Message, {
        foreignKey: "conversation_id",
        as: "conversation",
      });
      Conversation.hasMany(models.Member, {
        foreignKey: "conversation_id",
        as: "members",
      });
      Conversation.belongsToMany(models.User, {
        through: "Member",
        foreignKey: "conversation_id",
        as: "user",
      });
    }
  }
  Conversation.init(
    {
      conversation_name: DataTypes.STRING,
      type_conversation: DataTypes.STRING,
      group_image: DataTypes.STRING,
      pinned: DataTypes.BOOLEAN,
      unread: DataTypes.INTEGER,
      time: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Conversation",
    }
  );
  return Conversation;
};
