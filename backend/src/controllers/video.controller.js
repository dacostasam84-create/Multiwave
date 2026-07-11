const VideoService = require('../services/Video.service');
const VideoController = {
  async upload(req, res) { try { if (!req.file) return res.status(400).json({ success: false, message: 'Aucun fichier' }); const video = await VideoService.uploadVideo({ userId: req.user.id, file: req.file, duration: req.body.duration || null }); res.status(201).json({ success: true, data: video }); } catch (err) { res.status(500).json({ success: false, message: err.message }); } },
  async remove(req, res) { try { await VideoService.deleteVideo(req.params.id); res.json({ success: true }); } catch (err) { res.status(500).json({ success: false, message: err.message }); } },
  async getAll(req, res) { try { const videos = await VideoService.getAllVideos(); res.json({ success: true, data: videos }); } catch (err) { res.status(500).json({ success: false, message: err.message }); } },
  async getById(req, res) { try { const video = await VideoService.getVideoById(req.params.id); if (!video) return res.status(404).json({ success: false, message: 'Non trouve' }); res.json({ success: true, data: video }); } catch (err) { res.status(500).json({ success: false, message: err.message }); } }
};
module.exports = VideoController;
