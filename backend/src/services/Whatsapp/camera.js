'use strict';

const fs = require('fs');
const path = require('path');

class WhatsAppCameraService {
  /**
   * Capture image depuis caméra
   * @param {Object} data { imageData: base64 string }
   * @returns {Object} message avec chemin
   */
  static async capture(data) {
    if (!data || !data.imageData) {
      throw new Error('Données caméra manquantes');
    }

    const uploadDir = path.join(__dirname, '../../../uploads/whatsapp/camera');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const filename = `camera_${Date.now()}.png`;
    const filePath = path.join(uploadDir, filename);

    const base64Data = data.imageData.replace(/^data:image\/\w+;base64,/, '');
    fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));

    return {
      success: true,
      message: 'Capture caméra enregistrée',
      data: {
        filename,
        path: `/uploads/whatsapp/camera/${filename}`,
        timestamp: Date.now()
      }
    };
  }
}

module.exports = WhatsAppCameraService;