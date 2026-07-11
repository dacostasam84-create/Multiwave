// backend/src/services/webrtc.service.js

// Ce service gère la logique métier des sessions WebRTC
// Ici, on simule le stockage en mémoire, mais tu pourras le remplacer par une DB ou Redis

const sessions = {}; // Stockage temporaire des sessions

module.exports = {

    // Démarrer une session WebRTC
    start: async (data) => {
        const sessionId = `sess_${Date.now()}`; // Générer un ID unique
        sessions[sessionId] = {
            id: sessionId,
            participants: data.participants || [],
            startedAt: new Date(),
            status: 'active'
        };
        return sessions[sessionId];
    },

    // Terminer une session WebRTC
    end: async (sessionId) => {
        if (!sessions[sessionId]) throw new Error('Session non trouvée');
        sessions[sessionId].status = 'ended';
        sessions[sessionId].endedAt = new Date();
        return { message: 'Session terminée', session: sessions[sessionId] };
    },

    // Obtenir le statut d'une session
    getStatus: async (sessionId) => {
        if (!sessions[sessionId]) throw new Error('Session non trouvée');
        return sessions[sessionId];
    },

    // Ajouter un participant à la session
    addParticipant: async (sessionId, participant) => {
        if (!sessions[sessionId]) throw new Error('Session non trouvée');
        sessions[sessionId].participants.push(participant);
        return sessions[sessionId];
    },

    // Supprimer un participant
    removeParticipant: async (sessionId, participantId) => {
        if (!sessions[sessionId]) throw new Error('Session non trouvée');
        sessions[sessionId].participants = sessions[sessionId].participants.filter(p => p.id !== participantId);
        return sessions[sessionId];
    }
};

