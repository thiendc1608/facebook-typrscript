"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Post.init(
    {
      user_id: DataTypes.STRING,
      post_content: DataTypes.TEXT("long"),
      media_location: DataTypes.JSON(DataTypes.TEXT("long")),
      hashtags: DataTypes.JSON,
      feeling: DataTypes.STRING,
      activity: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Post",
    }
  );
  return Post;
};
