require('')

module.exports = async (req, res, next) => {
  if (!req.body?.content) return next();

  const check = await AiService.moderateText(req.body.content);

  if (check.flagged) {
    return res.status(400).json({ error: 'Contenu refusé par IA' });
  }

  next();
};

