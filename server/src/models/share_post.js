"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class SharePost extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  SharePost.init(
    {
      post_id: DataTypes.STRING,
      user_id: DataTypes.STRING,
      shared_at: DataTypes.DATE,
      post_content: DataTypes.TEXT("long"),
      privacy_settings: DataTypes.ENUM("public", "friends_only", "only_me"),
    },
    {
      sequelize,
      modelName: "SharePost",
    }
  );
  return SharePost;
};
