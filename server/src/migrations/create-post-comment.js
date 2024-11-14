"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("PostComments", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      post_id: {type: Sequelize.STRING},
      user_id: {type: Sequelize.STRING},
      comment_text: {type: Sequelize.TEXT("long")},
      gender: {type: Sequelize.STRING},
      parent_comment_id: {type: Sequelize.STRING},
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
    await queryInterface.dropTable("PostComments");
  },
};
