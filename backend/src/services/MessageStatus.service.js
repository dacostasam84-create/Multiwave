const MessageStatusModel = require("../models/MessageStatus.model");
class MessageStatusService {

  static async updateStatus({ messageId, userId, status }) {
    if (!['sent', 'delivered', 'seen'].includes(status)) {
      throw new Error('Status invalide');
    }

    const [record, created] = await db.MessageStatus.findOrCreate({
      where: {
        message_id: messageId,
        user_id: userId
      },
      defaults: { status }
    });

    if (!created && record.status !== status) {
      record.status = status;
      await record.save();
    }

    return record;
  }

  static async getStatusesForMessage(messageId) {
    return await db.MessageStatus.findAll({
      where: { message_id: messageId },
      include: [
        {
          model: db.User,
          as: 'user',
          attributes: ['id', 'username', 'avatar_url']
        }
      ],
      order: [['updated_at', 'ASC']]
    });
  }

  static async getStatusesForUser(userId) {
    return await db.MessageStatus.findAll({
      where: { user_id: userId },
      include: [
        {
          model: db.Message,
          as: 'message',
          attributes: ['id', 'content', 'sender_id', 'receiver_id']
        }
      ],
      order: [['updated_at', 'DESC']]
    });
  }
}

module.exports = MessageStatusService;

