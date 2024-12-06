"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Messages", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      conversation_id: {
        type: Sequelize.STRING,
      },
      type_msg: {
        type: Sequelize.STRING,
      },
      sub_type: {
        type: Sequelize.ENUM("doc", "link", "image", "reply", "record", "text"),
        defaultValue: "text",
      },
      sender_id: {
        type: Sequelize.STRING,
      },
      reply_text_id: {
        type: Sequelize.STRING,
      },
      reply_image_id: {
        type: Sequelize.STRING,
      },
      message: {
        type: Sequelize.TEXT("long"),
      },
      image_id: {
        type: Sequelize.STRING,
      },
      file_url: {
        type: Sequelize.STRING,
      },
      audio_record_url: {
        type: Sequelize.STRING,
      },
      send_at: {
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
    await queryInterface.dropTable("Messages");
  },
};
