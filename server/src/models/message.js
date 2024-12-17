"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Message.belongsTo(models.Conversation, {
        targetKeys: "id",
        foreignKey: "conversation_id",
        as: "conversation",
      });
      Message.belongsTo(models.Image, {
        foreignKey: "image_id",
        targetKey: "id",
        as: "imageInfo",
      });
      Message.belongsTo(models.User, {
        foreignKey: "sender_id",
        targetKey: "id",
        as: "senderInfo",
      });
      // Mối quan hệ giữa Message và MessageReact
      Message.hasMany(models.MessageReact, {
        foreignKey: "message_id", // Giả sử message_id là khóa ngoại trong bảng MessageReact
        as: "messageReact",
      });
      Message.hasOne(models.Message, {
        as: "info_reply", // Alias cho liên kết
        foreignKey: "id", // Trường được dùng để liên kết (ở bảng được tham chiếu)
        sourceKey: "reply_text_id", // Trường trong bảng hiện tại dùng để tham chiếu
      });
    }
  }
  Message.init(
    {
      conversation_id: DataTypes.STRING,
      type_msg: DataTypes.STRING,
      sub_type: DataTypes.ENUM("doc, link, image, reply, record, text"),
      sender_id: DataTypes.STRING,
      reply_text_id: DataTypes.STRING,
      reply_image_id: DataTypes.STRING,
      message: DataTypes.TEXT("long"),
      image_id: DataTypes.STRING,
      file_url: DataTypes.STRING,
      audio_record_url: DataTypes.STRING,
      send_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Message",
    }
  );
  return Message;
};
