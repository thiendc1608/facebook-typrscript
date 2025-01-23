"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class PostSave extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PostSave.init(
    {
      post_id: DataTypes.STRING,
      user_id: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "PostSave",
    }
  );
  return PostSave;
};
