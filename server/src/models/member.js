"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class Member extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Member.belongsTo(models.Conversation, {
        foreignKey: "conversation_id",
        targetKey: "id",
        as: "conversations",
      });
      Member.belongsTo(models.User, {
        foreignKey: "user_id",
        targetKey: "id",
        as: "user",
      });
    }
  }
  Member.init(
    {
      conversation_id: DataTypes.STRING,
      user_id: DataTypes.STRING,
      joined_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Member",
    }
  );
  return Member;
};
