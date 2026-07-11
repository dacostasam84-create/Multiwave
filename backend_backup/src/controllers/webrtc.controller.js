// Webrtc.controller.js
require('')

module.exports = {
    // Exemple d'endpoint pour initialiser un appel
    async initCall(req, res) {
        try {
            const result = await WebrtcService.initCall(req.body);
            res.json(result);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Tu peux ajouter d'autres fonctions selon ton service
};

