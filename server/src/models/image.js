"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Image.hasOne(models.Message, {
        foreignKey: "image_id",
        as: "imagesInfo",
      });
    }
  }
  Image.init(
    {
      message_image: DataTypes.JSON(DataTypes.TEXT("long")),
    },
    {
      sequelize,
      modelName: "Image",
    }
  );
  return Image;
};