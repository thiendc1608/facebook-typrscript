"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class PostComment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PostComment.init(
    {
      post_id: DataTypes.STRING,
      user_id: DataTypes.STRING,
      comment_text: DataTypes.TEXT("long"),
      gender: DataTypes.STRING,
      parent_comment_id: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "PostComment",
    }
  );
  return PostComment;
};
