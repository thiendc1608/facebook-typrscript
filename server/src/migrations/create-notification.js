"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Notifications", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      user_id: {type: Sequelize.STRING},
      type_id: {type: Sequelize.INTEGER},
      source_id: {type: Sequelize.STRING},
      message: {type: Sequelize.TEXT("long")},
      id_read: {type: Sequelize.ENUM("read", "not read"), defaultValue: "not read"},
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
    await queryInterface.dropTable("Notifications");
  },
};
