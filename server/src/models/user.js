"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Reel, { foreignKey: "user_id", as: "user" });

      User.hasOne(models.Friend, {
        foreignKey: "user_response_id",
        as: "friends",
      });

      User.hasOne(models.Member, {
        foreignKey: "user_id",
        as: "members",
      });

      User.belongsToMany(models.Conversation, {
        through: "Member",
        foreignKey: "user_id",
        as: "conversation_user",
      });

      User.hasMany(models.Message, {
        foreignKey: "sender_id",
        as: "senderInfo",
      });

      User.hasMany(models.Post, {
        foreignKey: "user_id",
      });
    }
  }
  User.init(
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      role: DataTypes.ENUM("admin", "user"),
      gender: DataTypes.ENUM("male", "female"),
      phone: DataTypes.INTEGER,
      address: DataTypes.STRING,
      avatar: DataTypes.TEXT("long"),
      cover_picture: DataTypes.TEXT("long"),
      status: DataTypes.ENUM("online", "offline"),
      describe_yourself: DataTypes.STRING,
      relationship_id: DataTypes.INTEGER,
      date_of_birth: DataTypes.STRING,
      lastActive: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
