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
      Post.belongsTo(models.User, {
        foreignKey: "user_id",
        targetKey: "id",
        as: "userOwnPost",
      });

      Post.belongsTo(models.Image, {
        foreignKey: "image_id",
        targetKey: "id",
        as: "imageInfo",
      });

      Post.belongsToMany(models.Emotion, {
        through: models.PostReaction, // Bảng trung gian
        foreignKey: "post_id",
        otherKey: "emotion_id",
      });

      Post.hasMany(models.PostReaction, {
        foreignKey: "post_id",
        as: "postReaction",
      });
    }
  }
  Post.init(
    {
      user_id: DataTypes.STRING,
      post_content: DataTypes.TEXT("long"),
      post_background: DataTypes.STRING,
      post_object: DataTypes.STRING,
      image_id: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Post",
    }
  );
  return Post;
};
