// src/controllers/upload.controller.js
const UploadService = require("../services/Upload.service");
const UsersService = require("../services/Users.service"); // si tu utilises des infos utilisateurs
module.exports = {
  async uploadAudio(req, res) {
    try {
      if (!req.file) return res.status(400).json({ success: false, error: 'Aucun fichier reçu' });

      const fileData = UploadService.uploadAudio(req.file);

      const upload = await UploadModel.create({
        user_id: req.user.id,
        filename: fileData.filename,
        file_type: 'audio',
        path: fileData.path,
        created_at: new Date()
      });

      res.status(201).json({ success: true, data: upload });
    } catch (err) {
      console.error('uploadAudio:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  },

  async uploadImage(req, res) {
    try {
      if (!req.file) return res.status(400).json({ success: false, error: 'Aucun fichier reçu' });

      const fileData = UploadService.uploadImage(req.file);

      const upload = await UploadModel.create({
        user_id: req.user.id,
        filename: fileData.filename,
        file_type: 'image',
        path: fileData.path,
        created_at: new Date()
      });

      res.status(201).json({ success: true, data: upload });
    } catch (err) {
      console.error('uploadImage:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  },

  async uploadVideo(req, res) {
    try {
      if (!req.file) return res.status(400).json({ success: false, error: 'Aucun fichier reçu' });

      const fileData = UploadService.uploadVideo(req.file);

      const upload = await UploadModel.create({
        user_id: req.user.id,
        filename: fileData.filename,
        file_type: 'video',
        path: fileData.path,
        created_at: new Date()
      });

      res.status(201).json({ success: true, data: upload });
    } catch (err) {
      console.error('uploadVideo:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  },

  async uploadWhisper(req, res) {
    try {
      if (!req.file) return res.status(400).json({ success: false, error: 'Aucun fichier reçu' });

      const fileData = UploadService.uploadWhisper(req.file);

      const upload = await UploadModel.create({
        user_id: req.user.id,
        filename: fileData.filename,
        file_type: 'whisper',
        path: fileData.path,
        created_at: new Date()
      });

      res.status(201).json({ success: true, data: upload });
    } catch (err) {
      console.error('uploadWhisper:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  },

  async uploadWhatsapp(req, res) {
    try {
      if (!req.file) return res.status(400).json({ success: false, error: 'Aucun fichier reçu' });

      const fileData = UploadService.uploadWhatsapp(req.file);

      const upload = await UploadModel.create({
        user_id: req.user.id,
        filename: fileData.filename,
        file_type: 'whatsapp',
        path: fileData.path,
        created_at: new Date()
      });

      res.status(201).json({ success: true, data: upload });
    } catch (err) {
      console.error('uploadWhatsapp:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  }
};

