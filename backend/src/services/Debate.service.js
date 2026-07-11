const DebateModel = require("../models/Debate.model");      
const CommentsModel = require("../models/Comments.model");  
const UsersModel = require("../models/Users.model");        

class DebateService {

  static async createDebate({ title, description, host_id }) {
    const debateId = uuidv4();

    const debate = await db.Debate.create({
      id: debateId,
      title,
      description: description || null,
      host_id,
      status: 'scheduled'
    });

    await redisClient.set(
      `debate:${debateId}`,
      JSON.stringify({ id: debateId, status: 'scheduled' }),
      { EX: 7200 }
    );

    return debate;
  }

  static async startDebate(debateId, userId) {
    const debate = await db.Debate.findByPk(debateId);
    if (!debate) throw new Error('Débat introuvable');
    if (debate.host_id !== userId) throw new Error('Non autorisé');
    if (debate.status !== 'scheduled') throw new Error('Débat déjà démarré');

    await debate.update({ status: 'live' });

    await redisClient.hSet(`debate:live:${debateId}`, {
      started_at: Date.now(),
      viewers: 0
    });

    return { debateId, status: 'live' };
  }

  static async endDebate(debateId, userId) {
    const debate = await db.Debate.findByPk(debateId);
    if (!debate) throw new Error('Débat introuvable');
    if (debate.host_id !== userId) throw new Error('Non autorisé');

    await debate.update({ status: 'ended' });
    await redisClient.del(`debate:live:${debateId}`);

    return { debateId, status: 'ended' };
  }

  static async addParticipant(debateId, userId) {
    await redisClient.sAdd(`debate:participants:${debateId}`, userId);
  }

  static async removeParticipant(debateId, userId, hostId) {
    const debate = await db.Debate.findByPk(debateId);
    if (!debate) throw new Error('Débat introuvable');
    if (debate.host_id !== hostId) throw new Error('Non autorisé');

    await redisClient.sRem(`debate:participants:${debateId}`, userId);
  }

  static async getParticipants(debateId) {
    return await redisClient.sMembers(`debate:participants:${debateId}`);
  }
}

module.exports = DebateService;

