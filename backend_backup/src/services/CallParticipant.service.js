// services/callparticipant.service.js
require('')
require('')
require('')

class CallParticipantService {
  static async add(call_id, user_id, role = 'guest') {
    return await CallParticipant.create({
      call_id,
      user_id,
      role,
      joined_at: new Date()
    });
  }

  static async remove(id) {
    const participant = await CallParticipant.findByPk(id);
    if (!participant) return false;
    await participant.destroy();
    return true;
  }

  static async listByCall(call_id) {
    return await CallParticipant.findAll({
      where: { call_id },
      include: [
        { model: User, as: 'user', attributes: ['id', 'username', 'email'] },
        { model: Call, as: 'call' }
      ],
      order: [['joined_at', 'ASC']]
    });
  }

  static async exists(call_id, user_id) {
    const count = await CallParticipant.count({ where: { call_id, user_id } });
    return count > 0;
  }
}

module.exports = CallParticipantService;

