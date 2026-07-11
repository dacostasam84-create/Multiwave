import React, { useEffect, useRef, useState } from 'react';

export default function VideoCall({ socket, userId, roomId }) {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);
  const streamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const intervalRef = useRef(null);

  const [callStarted, setCallStarted] = useState(false);
  const [remoteConnected, setRemoteConnected] = useState(false);
  const [targetLang, setTargetLang] = useState('fr');

  useEffect(() => {
    if (!socket) return;
    socket.on('signal', async ({ signalData }) => {
      if (!pcRef.current) return;
      if (signalData.type === 'offer') {
        await pcRef.current.setRemoteDescription(new RTCSessionDescription(signalData));
        const answer = await pcRef.current.createAnswer();
        await pcRef.current.setLocalDescription(answer);
        socket.emit('signal', { roomId, signalData: answer, userId });
      } else if (signalData.type === 'answer') {
        await pcRef.current.setRemoteDescription(new RTCSessionDescription(signalData));
      } else if (signalData.candidate) {
        await pcRef.current.addIceCandidate(new RTCIceCandidate(signalData));
      }
    });
    return () => socket.off('signal');
  }, [socket, roomId, userId]);

  const startCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;

      const pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
      pcRef.current = pc;

      stream.getTracks().forEach(track => pc.addTrack(track, stream));

      pc.ontrack = (e) => {
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = e.streams[0];
        setRemoteConnected(true);
      };

      pc.onicecandidate = (e) => {
        if (e.candidate) socket.emit('signal', { roomId, signalData: e.candidate, userId });
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit('signal', { roomId, signalData: offer, userId });

      startAudioTranscription(stream);
      setCallStarted(true);
    } catch (err) {
      console.error('Erreur caméra:', err);
    }
  };

  const startAudioTranscription = (stream) => {
    const audioStream = new MediaStream(stream.getAudioTracks());
    const chunks = [];
    const mr = new MediaRecorder(audioStream);
    mediaRecorderRef.current = mr;

    mr.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
    mr.onstop = async () => {
      const blob = new Blob(chunks, { type: 'audio/webm' });
      const buf = await blob.arrayBuffer();
      socket.emit('audio-chunk', { roomId, userId, audioBuffer: buf, targetLang });
      chunks.length = 0;
    };

    mr.start();
    intervalRef.current = setInterval(() => {
      if (mr.state === 'recording') {
        mr.stop();
        setTimeout(() => mr.start(), 100);
      }
    }, 3000);
  };

  const endCall = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
    if (pcRef.current) pcRef.current.close();
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    setCallStarted(false);
    setRemoteConnected(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>📹 Appel Vidéo</h2>
        <select style={styles.select} value={targetLang} onChange={e => setTargetLang(e.target.value)}>
  <option value="fr">🇫🇷 Français</option>
  <option value="en">🇬🇧 Anglais</option>
  <option value="ar">🌍 Arabe (Universel)</option>
  <option value="ar-MA">🇲🇦 Darija (Maroc)</option>
  <option value="ar-SA">🇸🇦 Arabe (Arabie Saoudite)</option>
  <option value="es">🇪🇸 Espagnol</option>
  <option value="it">🇮🇹 Italien</option>
  <option value="pt">🇵🇹 Portugais</option>
  <option value="ru">🇷🇺 Russe</option>
  <option value="zh">🇨🇳 Chinois</option>
  <option value="ja">🇯🇵 Japonais</option>
  <option value="tr">🇹🇷 Turc</option>
  <option value="hi">🇮🇳 Hindi</option>
  <option value="no">🇳🇴 Norvégien</option>
  <option value="sv">🇸🇪 Suédois</option>
  <option value="da">🇩🇰 Danois</option>
  <option value="fi">🇫🇮 Finnois</option>
  <option value="he">🇮🇱 Hébreu</option>
  <option value="de">🇩🇪 Allemand</option>
  <option value="ko">🇰🇷 Coréen</option>
  <option value="nl">🇳🇱 Néerlandais</option>
  <option value="pl">🇵🇱 Polonais</option>
  <option value="el">🇬🇷 Grec</option>
</select>
      </div>
      <div style={styles.videoGrid}>
        <div style={styles.videoBox}>
          <video ref={localVideoRef} autoPlay muted playsInline style={styles.video} />
          <span style={styles.videoLabel}>Vous</span>
        </div>
        <div style={styles.videoBox}>
          <video ref={remoteVideoRef} autoPlay playsInline style={styles.video} />
          <span style={styles.videoLabel}>{remoteConnected ? '🟢 Connecté' : '⏳ En attente...'}</span>
        </div>
      </div>
      <div style={styles.controls}>
        {!callStarted
          ? <button style={styles.btnStart} onClick={startCall}>📞 Démarrer l'appel</button>
          : <button style={styles.btnEnd} onClick={endCall}>📵 Terminer</button>
        }
      </div>
    </div>
  );
}

const styles = {
  container: { background: '#13131a', border: '1px solid #1e1e2e', borderRadius: 16, padding: 24, marginBottom: 24 },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  title: { color: '#e2e8f0', fontSize: 18 },
  select: { background: '#0a0a0f', border: '1px solid #1e1e2e', color: '#e2e8f0', padding: '8px 12px', borderRadius: 8, fontSize: 13 },
  videoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 },
  videoBox: { position: 'relative', background: '#0a0a0f', borderRadius: 12, overflow: 'hidden', aspectRatio: '16/9' },
  video: { width: '100%', height: '100%', objectFit: 'cover' },
  videoLabel: { position: 'absolute', bottom: 8, left: 12, color: '#fff', fontSize: 12, fontFamily: 'monospace', background: 'rgba(0,0,0,0.5)', padding: '2px 8px', borderRadius: 4 },
  controls: { display: 'flex', justifyContent: 'center', gap: 12 },
  btnStart: { background: '#00e5ff', color: '#000', border: 'none', padding: '12px 32px', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: 'pointer' },
  btnEnd: { background: 'transparent', color: '#ff4444', border: '1px solid #ff4444', padding: '12px 32px', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: 'pointer' }
};