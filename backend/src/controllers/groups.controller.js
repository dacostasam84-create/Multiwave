const GroupsService = require("../services/Groups.service");

// CREATE
exports.createGroup = async (req, res) => {
  try {
    const { name, description } = req.body;
    const ownerId = req.user.id;

    const group = await GroupsService.createGroup({
      name,
      description,
      ownerId
    });

    res.status(201).json(group);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET ALL
exports.getAllGroups = async (req, res) => {
  try {
    const groups = await GroupsService.getAllGroups();
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ONE
exports.getGroupById = async (req, res) => {
  try {
    const group = await GroupsService.getGroupById(req.params.id);
    res.json(group);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

// UPDATE
exports.updateGroup = async (req, res) => {
  try {
    const group = await GroupsService.updateGroup(req.params.id, req.body);
    res.json(group);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE
exports.deleteGroup = async (req, res) => {
  try {
    await GroupsService.deleteGroup(req.params.id);
    res.json({ message: 'Groupe supprimé' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

