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
      phone: { type: Sequelize.STRING },
      address: { type: Sequelize.STRING },
      avatar: { type: Sequelize.TEXT("long") },
      cover_picture: { type: Sequelize.TEXT("long") },
      cover_picture_pos: { type: Sequelize.INTEGER },
      status: {
        type: Sequelize.ENUM("online", "offline"),
        defaultValue: "offline",
      },
      bio: { type: Sequelize.STRING },
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
