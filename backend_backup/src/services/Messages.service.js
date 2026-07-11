require('')
require('')

class MessagesService {

  static async send(senderId, receiverId, content) {
    return await db.Message.create({
      sender_id: senderId,
      receiver_id: receiverId,
      content
    });
  }

  static async conversation(userA, userB) {
    return await db.Message.findAll({
      where: {
        [Op.or]: [
          { sender_id: userA, receiver_id: userB },
          { sender_id: userB, receiver_id: userA }
        ]
      },
      order: [['created_at', 'ASC']]
    });
  }

  static async delete(messageId, userId) {
    const msg = await db.Message.findByPk(messageId);
    if (!msg) return false;

    // seul l'expéditeur peut supprimer
    if (msg.sender_id !== userId) return false;

    await msg.destroy();
    return true;
  }
}

module.exports = MessagesService;

