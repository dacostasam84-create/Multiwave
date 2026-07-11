const GroupsModel = require("../models/Groups.model"); 
const UsersModel = require("../models/Users.model");   


class GroupsService {

  // CREATE
  static async createGroup({ name, description, ownerId }) {
    if (!name || !ownerId) {
      throw new Error('Nom et owner requis');
    }

    const slug = slugify(name, {
      lower: true,
      strict: true
    });

    return await db.Group.create({
      name,
      slug,
      description: description || null,
      owner_id: ownerId
    });
  }

  // GET ALL
  static async getAllGroups() {
    return await db.Group.findAll({
      order: [['created_at', 'DESC']]
    });
  }

  // GET ONE
  static async getGroupById(id) {
    const group = await db.Group.findByPk(id);
    if (!group) throw new Error('Groupe introuvable');
    return group;
  }

  // UPDATE (SECURISÉ)
  static async updateGroup(id, data) {
    const group = await db.Group.findByPk(id);
    if (!group) throw new Error('Groupe introuvable');

    const allowedFields = ['name', 'description', 'visibility'];
    const cleanData = {};

    allowedFields.forEach(field => {
      if (data[field] !== undefined) {
        cleanData[field] = data[field];
      }
    });

    // Regénérer le slug si le nom change
    if (cleanData.name) {
      cleanData.slug = slugify(cleanData.name, {
        lower: true,
        strict: true
      });
    }

    await group.update(cleanData);
    return group;
  }

  // DELETE
  static async deleteGroup(id) {
    const group = await db.Group.findByPk(id);
    if (!group) throw new Error('Groupe introuvable');

    await group.destroy();
    return true;
  }
}

module.exports = GroupsService;

