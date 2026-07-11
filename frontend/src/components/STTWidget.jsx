// ─────────────────────────────────────────────
// STTWidget.jsx — Multiwave Transcription Whisper
// Auteur : Zahnouni Issam
// ─────────────────────────────────────────────
import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';

// ─────────────────────────────────────────────
// LANGUES SUPPORTÉES
// ─────────────────────────────────────────────
const LANGUAGES = [
  { value:'fr',    flag:'🇫🇷', label:'Français' },
  { value:'en',    flag:'🇬🇧', label:'Anglais' },
  { value:'ar',    flag:'🌍', label:'Arabe (Universel)' },
  { value:'ar-MA', flag:'🇲🇦', label:'Darija (Maroc)' },
  { value:'ar-SA', flag:'🇸🇦', label:'Arabe (Arabie Saoudite)' },
  { value:'es',    flag:'🇪🇸', label:'Espagnol' },
  { value:'de',    flag:'🇩🇪', label:'Allemand' },
  { value:'it',    flag:'🇮🇹', label:'Italien' },
  { value:'pt',    flag:'🇵🇹', label:'Portugais' },
  { value:'ru',    flag:'🇷🇺', label:'Russe' },
  { value:'zh',    flag:'🇨🇳', label:'Chinois' },
  { value:'ja',    flag:'🇯🇵', label:'Japonais' },
  { value:'ko',    flag:'🇰🇷', label:'Coréen' },
  { value:'tr',    flag:'🇹🇷', label:'Turc' },
  { value:'hi',    flag:'🇮🇳', label:'Hindi' },
  { value:'nl',    flag:'🇳🇱', label:'Néerlandais' },
  { value:'pl',    flag:'🇵🇱', label:'Polonais' },
  { value:'he',    flag:'🇮🇱', label:'Hébreu' },
  { value:'el',    flag:'🇬🇷', label:'Grec' },
  { value:'sv',    flag:'🇸🇪', label:'Suédois' },
  { value:'no',    flag:'🇳🇴', label:'Norvégien' },
  { value:'da',    flag:'🇩🇰', label:'Danois' },
  { value:'fi',    flag:'🇫🇮', label:'Finnois' },
];

// ─────────────────────────────────────────────
// MOCK HISTORIQUE
// ─────────────────────────────────────────────
const MOCK_HISTORY = [
  { id:1, user_id:1, text:'Bonjour tout le monde, bienvenue sur Multiwave.', translated_text:'Hello everyone, welcome to Multiwave.', language:'fr', target_language:'en', duration:8,  created_at:'2026-03-13T10:00:00Z' },
  { id:2, user_id:1, text:'مرحبا بكم في منصة مالتيويف للتواصل الاجتماعي.',  translated_text:'Bienvenue sur la plateforme Multiwave.', language:'ar', target_language:'fr', duration:12, created_at:'2026-03-12T18:00:00Z' },
  { id:3, user_id:1, text:'React 19 est fantastique pour les développeurs.',  translated_text:'React 19 is fantastic for developers.',   language:'fr', target_language:'en', duration:6,  created_at:'2026-03-12T14:00:00Z' },
  { id:4, user_id:1, text:'Le marché tech au Maroc est en pleine expansion.', translated_text:'The tech market in Morocco is booming.',  language:'fr', target_language:'en', duration:9,  created_at:'2026-03-11T10:00:00Z' },
];

// ─────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────
const S = {
  container:  { display:'flex', flexDirection:'column', gap:18 },
  card:       { background:'#13131a', border:'1px solid #1e1e2e', borderRadius:14, padding:20 },
  badge:      { background:'rgba(0,229,255,0.1)', color:'#00e5ff', border:'1px solid rgba(0,229,255,0.2)', borderRadius:4, padding:'2px 8px', fontSize:10, fontFamily:'monospace' },
  badgePurple:{ background:'rgba(124,58,237,0.1)', color:'#a78bfa', border:'1px solid rgba(167,139,250,0.2)', borderRadius:4, padding:'2px 8px', fontSize:10, fontFamily:'monospace' },
  filterBtn:  { background:'transparent', border:'1px solid #1e1e2e', color:'#64748b', padding:'5px 14px', borderRadius:20, cursor:'pointer', fontSize:12, fontWeight:600 },
  filterActive:{ background:'rgba(201,168,76,0.12)', border:'1px solid #C9A84C', color:'#C9A84C' },
  empty:      { color:'#64748b', textAlign:'center', padding:40, fontFamily:'monospace', fontSize:13 },
};

const fmtTime = (d) => d ? new Date(d).toLocaleString('fr-FR', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' }) : '';
const fmtDur  = (s) => s ? `${s}s` : '';
const getLang = (val) => LANGUAGES.find(l => l.value === val);

// ─────────────────────────────────────────────
// TRANSCRIPTION ITEM
// ─────────────────────────────────────────────
function TranscriptionItem({ item, onCopy, onDelete }) {
  const [copied, setCopied] = useState(false);
  const srcLang = getLang(item.language || item.detected_language);
  const tgtLang = getLang(item.target_language || item.targetLang);

  const handleCopy = () => {
    navigator.clipboard?.writeText(`${item.text || item.original}\n→ ${item.translated_text || item.translated}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    onCopy && onCopy(item);
  };

  return (
    <div style={{
      background:'#13131a', border:'1px solid #1e1e2e',
      borderLeft:'3px solid #7c3aed', borderRadius:10, padding:14,
      display:'flex', flexDirection:'column', gap:8,
    }}>
      {/* Meta */}
      <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
        <span style={S.badge}>{srcLang?.flag} {srcLang?.label || item.language || '?'}</span>
        <span style={{ color:'#00e5ff', fontSize:12 }}>→</span>
        <span style={S.badgePurple}>{tgtLang?.flag} {tgtLang?.label || item.target_language || '?'}</span>
        {(item.duration || item.dur) && (
          <span style={{ background:'rgba(74,222,128,0.1)', color:'#4ade80', border:'1px solid rgba(74,222,128,0.2)', borderRadius:4, padding:'2px 8px', fontSize:10 }}>
            ⏱ {fmtDur(item.duration || item.dur)}
          </span>
        )}
        <span style={{ color:'#334155', fontSize:10, fontFamily:'monospace', marginLeft:'auto' }}>
          {item.time || fmtTime(item.created_at)}
        </span>
      </div>

      {/* Texte original */}
      <div style={{ color:'#64748b', fontSize:13, lineHeight:1.6, fontFamily:'monospace' }}>
        📝 {item.text || item.original}
      </div>

      {/* Texte traduit */}
      <div style={{ color:'#e2e8f0', fontSize:14, fontWeight:600, lineHeight:1.6 }}>
        🌍 {item.translated_text || item.translated}
      </div>

      {/* Actions */}
      <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
        <button onClick={handleCopy} style={{
          background: copied ? 'rgba(74,222,128,0.1)' : 'transparent',
          border: `1px solid ${copied ? '#4ade80' : '#1e1e2e'}`,
          color: copied ? '#4ade80' : '#64748b',
          padding:'4px 10px', borderRadius:6, cursor:'pointer', fontSize:11,
        }}>
          {copied ? '✓ Copié' : '📋 Copier'}
        </button>
        {onDelete && (
          <button onClick={() => onDelete(item.id)} style={{ background:'rgba(248,113,113,0.1)', border:'1px solid rgba(248,113,113,0.2)', color:'#f87171', padding:'4px 10px', borderRadius:6, cursor:'pointer', fontSize:11 }}>
            🗑️
          </button>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────
export default function STTWidget({ socket, userId }) {
  const [recording,       setRecording]       = useState(false);
  const [transcriptions,  setTranscriptions]  = useState([]);
  const [history,         setHistory]         = useState([]);
  const [targetLang,      setTargetLang]      = useState('fr');
  const [tab,             setTab]             = useState('live');   // live | history
  const [loading,         setLoading]         = useState(false);
  const [histFilter,      setHistFilter]      = useState('');
  const [volume,          setVolume]          = useState(0);
  const [duration,        setDuration]        = useState(0);

  const mediaRecorderRef  = useRef(null);
  const intervalRef       = useRef(null);
  const timerRef          = useRef(null);
  const analyserRef       = useRef(null);
  const animFrameRef      = useRef(null);
  const boxRef            = useRef(null);

  // Socket — transcriptions temps réel
  useEffect(() => {
    if (!socket) return;
    socket.on('transcription', (data) => {
      setTranscriptions(prev => [...prev, {
        ...data,
        id: Date.now(),
        time: new Date().toLocaleTimeString('fr-FR'),
        dur: data.duration,
      }]);
    });
    socket.on('transcription-error', (err) => {
      console.error('STT error:', err.message);
    });
    return () => {
      socket.off('transcription');
      socket.off('transcription-error');
    };
  }, [socket]);

  // Auto-scroll
  useEffect(() => {
    if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight;
  }, [transcriptions]);

  // Charger historique
  useEffect(() => {
    if (tab === 'history') loadHistory();
  }, [tab]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/stt/history?user_id=${userId}`);
      setHistory(res.data?.data || res.data || []);
    } catch { setHistory(MOCK_HISTORY); }
    finally { setLoading(false); }
  };

  // Visualiseur volume
  const startVolumeAnalyser = (stream) => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const source = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);
    analyserRef.current = analyser;
    const data = new Uint8Array(analyser.frequencyBinCount);
    const tick = () => {
      analyser.getByteFrequencyData(data);
      const avg = data.reduce((a,b) => a+b, 0) / data.length;
      setVolume(Math.min(100, avg * 2));
      animFrameRef.current = requestAnimationFrame(tick);
    };
    tick();
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio:true });
      startVolumeAnalyser(stream);
      const chunks = [];
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : 'audio/webm';
      const mr = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mr;

      mr.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
      mr.onstop = async () => {
        const blob = new Blob(chunks, { type:'audio/webm' });
        const buf  = await blob.arrayBuffer();
        if (socket) socket.emit('audio-chunk', {
          roomId: 'room_test_1',
          userId: parseInt(userId),
          audioBuffer: buf,
          targetLang,
        });
        chunks.length = 0;
      };

      mr.start();
      intervalRef.current = setInterval(() => {
        if (mr.state === 'recording') {
          mr.stop();
          setTimeout(() => mr.start(), 100);
        }
      }, 3000);

      // Timer durée
      setDuration(0);
      timerRef.current = setInterval(() => setDuration(d => d+1), 1000);

      setRecording(true);
    } catch (err) {
      console.error('Microphone error:', err);
    }
  };

  const stopRecording = () => {
    if (intervalRef.current)  clearInterval(intervalRef.current);
    if (timerRef.current)     clearInterval(timerRef.current);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
    }
    setRecording(false);
    setVolume(0);
    setDuration(0);
  };

  const handleExport = () => {
    const text = transcriptions.map(t =>
      `[${t.time}] ${t.language||'?'} → ${t.target_language||targetLang}\n` +
      `Original: ${t.original || t.text}\n` +
      `Traduit: ${t.translated || t.translated_text}\n`
    ).join('\n---\n');
    const blob = new Blob([text], { type:'text/plain' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `transcription_${Date.now()}.txt`;
    a.click(); URL.revokeObjectURL(url);
  };

  const handleDeleteHistory = async (id) => {
    setHistory(p => p.filter(h => h.id !== id));
    try { await api.delete(`/stt/${id}`); } catch {}
  };

  const fmtDuration = (s) => {
    const m = Math.floor(s/60);
    const sec = s%60;
    return `${m.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}`;
  };

  const filteredHistory = history.filter(h =>
    !histFilter || h.language === histFilter || h.target_language === histFilter
  );

  // Stats
  const totalWords = transcriptions.reduce((a,t) => a + (t.original||t.text||'').split(' ').length, 0);

  return (
    <div style={S.container}>

      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
        <h2 style={{ color:'#e2e8f0', fontSize:20, margin:0, fontWeight:700 }}>🎤 Transcription Whisper</h2>
        <div style={{ display:'flex', gap:8 }}>
          {[{key:'live',label:'🔴 Live'},{key:'history',label:'📋 Historique'}].map(t=>(
            <button key={t.key} onClick={()=>setTab(t.key)} style={{
              ...S.filterBtn, padding:'7px 16px', borderRadius:8, fontSize:13,
              ...(tab===t.key ? S.filterActive : {})
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      {/* ── LIVE TAB ── */}
      {tab === 'live' && (
        <>
          {/* Contrôles */}
          <div style={{ ...S.card, display:'flex', gap:12, alignItems:'center', flexWrap:'wrap' }}>
            {/* Sélecteur langue */}
            <select
              style={{ background:'#0a0a0f', border:'1px solid #1e1e2e', color:'#e2e8f0', padding:'10px 14px', borderRadius:8, fontSize:13, flex:1, minWidth:180, outline:'none' }}
              value={targetLang}
              onChange={e => setTargetLang(e.target.value)}
            >
              {LANGUAGES.map(l => (
                <option key={l.value} value={l.value}>{l.flag} {l.label}</option>
              ))}
            </select>

            {/* Bouton enregistrement */}
            {!recording ? (
              <button onClick={startRecording} style={{
                background:'linear-gradient(135deg,#C9A84C,#F5D87A)', color:'#1a1200',
                border:'none', padding:'10px 24px', borderRadius:8, fontWeight:700,
                cursor:'pointer', fontSize:13, flexShrink:0,
              }}>🎤 Enregistrer</button>
            ) : (
              <button onClick={stopRecording} style={{
                background:'rgba(248,113,113,0.1)', color:'#f87171',
                border:'1px solid #f87171', padding:'10px 24px', borderRadius:8,
                fontWeight:700, cursor:'pointer', fontSize:13, flexShrink:0,
                animation:'pulse 1s ease-in-out infinite',
              }}>⏹ Arrêter</button>
            )}

            {/* Effacer */}
            <button onClick={() => setTranscriptions([])} style={{
              background:'transparent', border:'1px solid #1e1e2e', color:'#64748b',
              padding:'10px 16px', borderRadius:8, cursor:'pointer', fontSize:13,
            }}>🗑️ Effacer</button>

            {/* Export */}
            {transcriptions.length > 0 && (
              <button onClick={handleExport} style={{
                background:'rgba(14,165,233,0.1)', border:'1px solid rgba(14,165,233,0.3)',
                color:'#0ea5e9', padding:'10px 16px', borderRadius:8, cursor:'pointer', fontSize:13,
              }}>⬇️ Exporter</button>
            )}
          </div>

          {/* Indicateur enregistrement */}
          {recording && (
            <div style={{ ...S.card, display:'flex', alignItems:'center', gap:14, padding:'14px 20px' }}>
              {/* Visualiseur barres */}
              <div style={{ display:'flex', gap:3, alignItems:'flex-end', height:30 }}>
                {[...Array(8)].map((_,i) => (
                  <div key={i} style={{
                    width:4, borderRadius:2,
                    background:'#f87171',
                    height: `${Math.max(4, (volume * (0.5 + Math.sin(i * 0.8 + Date.now()/200) * 0.5)))}%`,
                    minHeight:4, maxHeight:30,
                    transition:'height 0.1s',
                  }}/>
                ))}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ color:'#f87171', fontWeight:700, fontSize:13 }}>🔴 Enregistrement en cours...</div>
                <div style={{ color:'#475569', fontSize:11, marginTop:2 }}>
                  Durée: {fmtDuration(duration)} · Volume: {Math.round(volume)}%
                </div>
              </div>
              <div style={{ color:'#C9A84C', fontSize:13, fontWeight:700 }}>
                🌐 → {getLang(targetLang)?.flag} {getLang(targetLang)?.label}
              </div>
            </div>
          )}

          {/* Stats live */}
          {transcriptions.length > 0 && (
            <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
              {[
                { label:'Transcriptions', val:transcriptions.length, color:'#a78bfa' },
                { label:'Mots détectés',  val:totalWords,             color:'#4ade80' },
                { label:'Langue cible',   val:`${getLang(targetLang)?.flag} ${getLang(targetLang)?.label}`, color:'#C9A84C' },
              ].map((s,i) => (
                <div key={i} style={{ background:'#13131a', border:'1px solid #1e1e2e', borderRadius:10, padding:'8px 16px', display:'flex', gap:8, alignItems:'center' }}>
                  <span style={{ color:s.color, fontWeight:700, fontSize:15 }}>{s.val}</span>
                  <span style={{ color:'#475569', fontSize:12 }}>{s.label}</span>
                </div>
              ))}
            </div>
          )}

          {/* Zone transcriptions */}
          <div
            ref={boxRef}
            style={{
              background:'#0a0a0f', border:'1px solid #1e1e2e', borderRadius:12,
              minHeight:300, maxHeight:450, overflowY:'auto', padding:16,
              display:'flex', flexDirection:'column', gap:12,
            }}
          >
            {transcriptions.length === 0 ? (
              <div style={S.empty}>
                <div style={{ fontSize:40, marginBottom:12 }}>🎙️</div>
                <div>En attente d'audio...</div>
                <div style={{ color:'#334155', fontSize:11, marginTop:6 }}>
                  Cliquez sur "Enregistrer" pour démarrer la transcription Whisper
                </div>
              </div>
            ) : (
              transcriptions.map((t, i) => (
                <TranscriptionItem key={t.id || i} item={t}/>
              ))
            )}
          </div>
        </>
      )}

      {/* ── HISTORIQUE TAB ── */}
      {tab === 'history' && (
        <>
          {/* Filtres langue */}
          <div style={{ display:'flex', gap:8, flexWrap:'wrap', alignItems:'center' }}>
            <button onClick={()=>setHistFilter('')} style={{ ...S.filterBtn, ...(histFilter===''?S.filterActive:{}) }}>Toutes</button>
            {['fr','en','ar','ar-MA','es','de'].map(l => {
              const lang = getLang(l);
              return (
                <button key={l} onClick={()=>setHistFilter(l)} style={{
                  ...S.filterBtn,
                  ...(histFilter===l ? S.filterActive : {})
                }}>{lang?.flag} {lang?.label || l}</button>
              );
            })}
          </div>

          {/* Stats historique */}
          <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
            {[
              { label:'Total', val:history.length,    color:'#C9A84C' },
              { label:'Mots',  val:history.reduce((a,h)=>a+(h.text||'').split(' ').length,0), color:'#4ade80' },
              { label:'Durée', val:`${history.reduce((a,h)=>a+(h.duration||0),0)}s`, color:'#60a5fa' },
            ].map((s,i) => (
              <div key={i} style={{ background:'#13131a', border:'1px solid #1e1e2e', borderRadius:10, padding:'8px 16px', display:'flex', gap:8, alignItems:'center' }}>
                <span style={{ color:s.color, fontWeight:700, fontSize:15 }}>{s.val}</span>
                <span style={{ color:'#475569', fontSize:12 }}>{s.label}</span>
              </div>
            ))}
          </div>

          {/* Liste historique */}
          {loading ? (
            <div style={S.empty}>Chargement...</div>
          ) : filteredHistory.length === 0 ? (
            <div style={S.empty}>
              <div style={{ fontSize:40, marginBottom:12 }}>📋</div>
              Aucune transcription sauvegardée
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {filteredHistory.map(h => (
                <TranscriptionItem
                  key={h.id}
                  item={h}
                  onDelete={handleDeleteHistory}
                />
              ))}
            </div>
          )}
        </>
      )}

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.6} }
      `}</style>
    </div>
  );
}