require('')

class ChannelsService {
  static async createChannel(data, userId) {
    const channel = await Channel.create({
      name: data.name,
      description: data.description || '',
      owner_id: userId,
      type: data.type || 'broadcast',
      is_verified: data.is_verified || false,
      ai_moderation: data.ai_moderation ?? true
    });
    return channel;
  }

  static async updateChannel(channelId, data, userId) {
    const channel = await Channel.findByPk(channelId);
    if (!channel) throw new Error('Channel non trouvé');
    if (channel.owner_id !== userId) throw new Error('Pas autorisé');
    await channel.update(data);
    return channel;
  }

  static async deleteChannel(channelId, userId) {
    const channel = await Channel.findByPk(channelId);
    if (!channel) throw new Error('Channel non trouvé');
    if (channel.owner_id !== userId) throw new Error('Pas autorisé');
    await channel.destroy();
  }

  static async listChannels() {
    return Channel.findAll({ order: [['created_at', 'DESC']] });
  }

  static async joinChannel(channelId, userId) {
    const channel = await Channel.findByPk(channelId);
    if (!channel) throw new Error('Channel non trouvé');
    await channel.addMember(userId);
    return { message: 'Vous avez rejoint le channel' };
  }

  static async leaveChannel(channelId, userId) {
    const channel = await Channel.findByPk(channelId);
    if (!channel) throw new Error('Channel non trouvé');
    await channel.removeMember(userId);
    return { message: 'Vous avez quitté le channel' };
  }
}

module.exports = ChannelsService;

