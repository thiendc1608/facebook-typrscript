"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class Relationship extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Relationship.init(
    {
      relationship: DataTypes.ENUM("single", "married", "dating"),
    },
    {
      sequelize,
      modelName: "Relationship",
    }
  );
  return Relationship;
};
