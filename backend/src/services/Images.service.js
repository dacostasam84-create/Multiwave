const ImagesModel = require("../models/Images.model"); 
const fs = require("fs");                              
const path = require("path");                          

const UPLOAD_DIR = path.join(__dirname, '../../uploads/images');

class ImagesService {

  // UPLOAD
  static async upload(userId, file) {
    if (!file) {
      throw new Error('Image requise');
    }

    return await db.Image.create({
      user_id: userId,
      filename: file.filename,
      path: `/uploads/images/${file.filename}`
    });
  }

  // GET BY USER
  static async getByUser(userId) {
    return await db.Image.findAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']]
    });
  }

  // DELETE
  static async deleteByFilename(userId, filename) {
    const image = await db.Image.findOne({
      where: { user_id: userId, filename }
    });

    if (!image) {
      throw new Error('Image introuvable');
    }

    const filePath = path.join(UPLOAD_DIR, filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await image.destroy();
    return true;
  }
}

module.exports = ImagesService;

