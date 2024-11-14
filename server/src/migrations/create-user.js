"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      firstName: {
        type: Sequelize.STRING,
      },
      lastName: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
      },
      role: { type: Sequelize.ENUM("admin", "user"), defaultValue: "user" },
      gender: { type: Sequelize.ENUM("male", "female") },
      phone: { type: Sequelize.INTEGER },
      address: { type: Sequelize.STRING },
      avatar: { type: Sequelize.BLOB("long") },
      cover_picture: { type: Sequelize.BLOB("long") },
      status_id: { type: Sequelize.INTEGER },
      describe_yourself: { type: Sequelize.STRING },
      relationship_id: { type: Sequelize.INTEGER },
      date_of_birth: { type: Sequelize.STRING },
      lastActive: { type: Sequelize.DATE },
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
    await queryInterface.dropTable("Users");
  },
};
