require('')
require('')
require('')

class UploadsService {
  static ensureDir(dir) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }

  static saveFile(file, folder, userId) {
    if (!file) throw new Error('Aucun fichier reçu');

    const uploadDir = path.join(__dirname, `../../uploads/${folder}`);
    this.ensureDir(uploadDir);

    const safeName = file.originalname.replace(/[^a-z0-9.-]/gi, "_").toLowerCase();
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}-${safeName}`;
    const filePath = path.join(uploadDir, filename);

    fs.writeFileSync(filePath, file.buffer);

    // Enregistrer dans la DB
    return db.Upload.create({
      user_id: userId,
      filename,
      file_type: folder,
      path: `/uploads/${folder}/${filename}`,
      size: file.size,
      mimetype: file.mimetype
    });
  }

  static uploadAudio(file, userId) { return this.saveFile(file, 'audio', userId); }
  static uploadImage(file, userId) { return this.saveFile(file, 'images', userId); }
  static uploadVideo(file, userId) { return this.saveFile(file, 'videos', userId); }
  static uploadWhisper(file, userId) { return this.saveFile(file, 'whispers', userId); }
  static uploadWhatsapp(file, userId) { return this.saveFile(file, 'whatsapp', userId); }
}

module.exports = UploadsService;

