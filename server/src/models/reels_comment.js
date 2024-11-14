"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class ReelComment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ReelComment.init(
    {
      user_id: DataTypes.STRING,
      text_comment: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "ReelComment",
    }
  );
  return ReelComment;
};
