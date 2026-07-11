require('')

class CallsService {
  static async createCall({ hostId, type = 'video' }) {
    const roomId = `room_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    return await db.Call.create({
      room_id: roomId,
      host_id: hostId,
      type,
      status: 'active',
      started_at: new Date()
    });
  }

  static async endCall(roomId) {
    const call = await db.Call.findOne({ where: { room_id: roomId } });
    if (!call) throw new Error('Appel non trouvé');

    await call.update({ status: 'ended', ended_at: new Date() });
    return call;
  }

  static async listParticipants(callId) {
    return await db.CallParticipant.findAll({
      where: { call_id: callId },
      include: [{ model: db.User, as: 'user', attributes: ['id', 'username', 'avatar_url'] }],
      order: [['joined_at', 'ASC']]
    });
  }

  static async isParticipant(callId, userId) {
    const participant = await db.CallParticipant.findOne({ where: { call_id: callId, user_id: userId } });
    return !!participant;
  }

  static async getCallByRoom(roomId) {
    const call = await db.Call.findOne({ where: { room_id: roomId } });
    if (!call) throw new Error('Appel non trouvé');
    return call;
  }
}

module.exports = CallsService;

