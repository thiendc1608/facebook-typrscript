"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Posts", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      user_id: { type: Sequelize.STRING },
      post_content: { type: Sequelize.TEXT("long") },
      media_location: {
        type: Sequelize.JSON(Sequelize.TEXT("long")),
        defaultValue: [],
      },
      hashtags: { type: Sequelize.JSON, defaultValue: [] },
      feeling: { type: Sequelize.STRING },
      activity: { type: Sequelize.STRING },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Posts");
  },
};
