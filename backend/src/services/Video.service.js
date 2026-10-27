const VideoModel = require("../models/Video.model");         
const UsersModel = require("../models/Users.model");         
const UploadModel = require("../models/Upload.model");       
const fs = require("fs");
const path = require("path");

class VideoService {
  static async uploadVideo({ userId, file, duration }) {
    if (!file) throw new Error('Fichier vidéo requis');

    const uploadPath = `/uploads/videos/${file.filename}`;

    const video = await db.Video.create({
      user_id: userId,
      filename: file.filename,
      path: uploadPath,
      duration: duration ?? null,
      created_at: new Date()
    });

    return video;
  }

  static async deleteVideo(videoId) {
    const video = await db.Video.findByPk(videoId);
    if (!video) throw new Error('Vidéo introuvable');

    const filePath = path.join(
      require('../config/paths').UPLOADS_DIR,
      'videos',
      video.filename
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await video.destroy();
    return true;
  }

  static async getAllVideos(limit = 50) {
    return await db.Video.findAll({
      order: [['created_at', 'DESC']],
      limit
    });
  }

  static async getUserVideos(userId) {
    return await db.Video.findAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']]
    });
  }
}

module.exports = VideoService;

