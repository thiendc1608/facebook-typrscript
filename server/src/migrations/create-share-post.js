"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("SharePosts", {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      post_id: { type: Sequelize.STRING },
      user_id: { type: Sequelize.STRING },
      shared_at: { type: Sequelize.DATE },
      post_content: { type: Sequelize.TEXT("long") },
      privacy_settings: {
        type: Sequelize.ENUM("public", "friends_only", "only_me"),
        defaultValue: "public",
      },
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
    await queryInterface.dropTable("SharePosts");
  },
};
