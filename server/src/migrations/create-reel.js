"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Reels", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      user_id: {
        type: Sequelize.STRING,
      },
      video_url: {
        type: Sequelize.TEXT,
      },
      thumbnail_url: {
        type: Sequelize.TEXT,
      },
      caption: {
        type: Sequelize.TEXT,
      },
      // music_track: {
      //   type: Sequelize.TEXT,
      // },
      // duration: {
      //   type: Sequelize.INTEGER,
      // },
      mode_privacy: {
        type: Sequelize.ENUM("public", "friends", "except_friend"),
        defaultValue: "public",
      },
      expiredAt: {
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
    await queryInterface.dropTable("Reels");
  },
};
