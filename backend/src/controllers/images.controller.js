const ImagesService = require("../services/Images.service");

// UPLOAD
exports.upload = async (req, res) => {
  try {
    const image = await ImagesService.upload(req.user.id, req.file);
    res.status(201).json(image);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET BY USER
exports.getByUser = async (req, res) => {
  try {
    const images = await ImagesService.getByUser(req.params.userId);
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE
exports.remove = async (req, res) => {
  try {
    await ImagesService.deleteByFilename(
      req.user.id,
      req.params.filename
    );
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

