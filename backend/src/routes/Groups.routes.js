// src/routes/groups.routes.js
const express = require("express");  
const router = express.Router(); 
const GroupsController = require("../controllers/groups.controller");
const { authMiddleware } = require("../middlewares/auth.middleware"); // Middleware auth

// CREATE GROUP
router.post('/', authMiddleware, GroupsController.createGroup);

// GET ALL GROUPS
router.get('/', authMiddleware, GroupsController.getAllGroups);

// GET ONE GROUP
router.get('/:id', authMiddleware, GroupsController.getGroupById);

// UPDATE GROUP
router.put('/:id', authMiddleware, GroupsController.updateGroup);

// DELETE GROUP
router.delete('/:id', authMiddleware, GroupsController.deleteGroup);

module.exports = router;
