"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Conversations", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      conversation_name: {
        type: Sequelize.STRING,
      },
      type_conversation: {
        type: Sequelize.STRING,
      },
      group_image: {
        type: Sequelize.STRING,
      },
      pinned: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      unread: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      time: {
        allowNull: false,
        type: Sequelize.DATE,
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
    await queryInterface.dropTable("Conversations");
  },
};
