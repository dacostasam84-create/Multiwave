// ─────────────────────────────────────────────
// WhatsApp.jsx — Multiwave WhatsApp Ultra
// Auteur : Zahnouni Issam
// ─────────────────────────────────────────────
import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';

// ─────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────
const S = {
  wrapper:   { display:'flex', height:'calc(100vh - 110px)', background:'#0a0a0f', borderRadius:14, border:'1px solid #1e1e2e', overflow:'hidden' },
  sidebar:   { width:300, borderRight:'1px solid #1e1e2e', display:'flex', flexDirection:'column', background:'#0b1a12', flexShrink:0 },
  main:      { flex:1, display:'flex', flexDirection:'column', minWidth:0, background:'#0a0a0f' },
  avatar:    { width:42, height:42, borderRadius:'50%', background:'linear-gradient(135deg,#25D366,#128C7E)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:700, color:'#fff', flexShrink:0 },
  avatarSm:  { width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg,#25D366,#128C7E)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:'#fff', flexShrink:0 },
  online:    { position:'absolute', bottom:0, right:0, width:11, height:11, borderRadius:'50%', background:'#25D366', border:'2px solid #0b1a12' },
  msgOut:    { alignSelf:'flex-end',  background:'#005c4b', borderRadius:'12px 12px 3px 12px', color:'#e9edef', maxWidth:'72%' },
  msgIn:     { alignSelf:'flex-start', background:'#202c33', borderRadius:'12px 12px 12px 3px', color:'#e9edef', maxWidth:'72%' },
  input:     { background:'#202c33', border:'none', color:'#e9edef', padding:'10px 14px', borderRadius:10, fontSize:13, outline:'none', boxSizing:'border-box' },
  greenBtn:  { background:'linear-gradient(135deg,#25D366,#128C7E)', color:'#fff', border:'none', borderRadius:8, cursor:'pointer', fontWeight:700, fontSize:13 },
};

const initials  = (n) => n ? n.slice(0,2).toUpperCase() : '??';
const fmtHour   = (d) => d ? new Date(d).toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'}) : '';
const timeAgo   = (d) => {
  if (!d) return '';
  const diff = Math.floor((Date.now() - new Date(d)) / 1000);
  if (diff < 60)    return `${diff}s`;
  if (diff < 3600)  return `${Math.floor(diff/60)}m`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h`;
  return new Date(d).toLocaleDateString('fr-FR',{day:'2-digit',month:'short'});
};

// ─────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────
const MOCK_CONTACTS = [
  { id:1, user:{ id:2, username:'sarah_dz',     online:true  }, last_message:'📷 Photo', last_at:'2026-03-13T11:00:00Z', unread:3 },
  { id:2, user:{ id:3, username:'dev_karim',    online:true  }, last_message:'Ok reçu 👍', last_at:'2026-03-13T10:30:00Z', unread:0 },
  { id:3, user:{ id:4, username:'tech_maroc',   online:false }, last_message:'Appel manqué 📵', last_at:'2026-03-13T09:00:00Z', unread:1 },
  { id:4, user:{ id:5, username:'laila_design', online:true  }, last_message:'Le fichier est prêt ✅', last_at:'2026-03-12T22:00:00Z', unread:0 },
  { id:5, user:{ id:6, username:'dj_atlas',     online:false }, last_message:'🎵 Audio · 0:42', last_at:'2026-03-12T18:00:00Z', unread:0 },
  { id:6, user:{ id:7, username:'startup_ma',   online:true  }, last_message:'Rendez-vous demain ?', last_at:'2026-03-11T16:00:00Z', unread:2 },
];

const MOCK_MSGS = {
  1: [
    { id:1,  sender_id:2, receiver_id:1, content:'Salam ! Comment tu vas ? 😊',      media_path:null, status:'seen', created_at:'2026-03-13T10:50:00Z' },
    { id:2,  sender_id:1, receiver_id:2, content:'Alhamdulillah, bien merci ! Et toi ?', media_path:null, status:'seen', created_at:'2026-03-13T10:51:00Z' },
    { id:3,  sender_id:2, receiver_id:1, content:'Très bien 🙏 Tu as vu le nouveau feed Multiwave ?', media_path:null, status:'seen', created_at:'2026-03-13T10:52:00Z' },
    { id:4,  sender_id:1, receiver_id:2, content:'Oui ! C\'est vraiment top le design 🔥', media_path:null, status:'seen', created_at:'2026-03-13T10:53:00Z' },
    { id:5,  sender_id:2, receiver_id:1, content:'📷 Photo', media_path:'https://picsum.photos/seed/wa1/300/200', status:'delivered', created_at:'2026-03-13T11:00:00Z' },
  ],
  2: [
    { id:10, sender_id:3, receiver_id:1, content:'Hey, la PR est mergée ✅',            media_path:null, status:'seen', created_at:'2026-03-13T10:20:00Z' },
    { id:11, sender_id:1, receiver_id:3, content:'Super ! Je déploie ce soir.',          media_path:null, status:'seen', created_at:'2026-03-13T10:25:00Z' },
    { id:12, sender_id:3, receiver_id:1, content:'Ok reçu 👍',                           media_path:null, status:'delivered', created_at:'2026-03-13T10:30:00Z' },
  ],
};

// ─────────────────────────────────────────────
// STATUS TICK (✓ ✓✓ 🔵)
// ─────────────────────────────────────────────
function Tick({ status }) {
  if (status === 'sent')      return <span style={{ color:'#8696a0', fontSize:11 }}>✓</span>;
  if (status === 'delivered') return <span style={{ color:'#8696a0', fontSize:11 }}>✓✓</span>;
  if (status === 'seen')      return <span style={{ color:'#53bdeb', fontSize:11 }}>✓✓</span>;
  return null;
}

// ─────────────────────────────────────────────
// BULLE MESSAGE
// ─────────────────────────────────────────────
function Bubble({ msg, isMine }) {
  const hasMedia = !!msg.media_path;
  return (
    <div style={{ display:'flex', flexDirection:'column', ...(isMine ? { alignSelf:'flex-end', alignItems:'flex-end' } : { alignSelf:'flex-start', alignItems:'flex-start' }) }}>
      <div style={{ ...(isMine ? S.msgOut : S.msgIn), padding: hasMedia ? '4px 4px 6px' : '8px 12px 6px', fontSize:14, lineHeight:1.6, minWidth:80 }}>
        {hasMedia && (
          <div style={{ marginBottom: msg.content ? 6 : 0, borderRadius:8, overflow:'hidden' }}>
            <img src={msg.media_path} alt="" style={{ maxWidth:260, maxHeight:200, display:'block', objectFit:'cover' }} onError={e=>e.target.style.display='none'}/>
          </div>
        )}
        {msg.content && <div style={{ padding: hasMedia ? '0 8px 2px' : 0 }}>{msg.content}</div>}
        <div style={{ display:'flex', justifyContent:'flex-end', alignItems:'center', gap:4, marginTop:2, padding: hasMedia ? '0 8px' : 0 }}>
          <span style={{ color:'#8696a0', fontSize:10 }}>{fmtHour(msg.created_at)}</span>
          {isMine && <Tick status={msg.status}/>}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ITEM CONTACT
// ─────────────────────────────────────────────
function ContactItem({ contact, active, onClick }) {
  return (
    <div onClick={onClick} style={{
      display:'flex', alignItems:'center', gap:12, padding:'12px 16px',
      cursor:'pointer', background: active ? 'rgba(37,211,102,0.08)' : 'transparent',
      borderLeft: `3px solid ${active ? '#25D366' : 'transparent'}`,
      transition:'all 0.15s',
    }}>
      <div style={{ position:'relative' }}>
        <div style={S.avatar}>{initials(contact.user.username)}</div>
        {contact.user.online && <div style={S.online}/>}
      </div>
      <div style={{ flex:1, overflow:'hidden' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ color: active ? '#25D366' : '#e9edef', fontWeight:600, fontSize:14 }}>{contact.user.username}</span>
          <span style={{ color:'#8696a0', fontSize:11 }}>{timeAgo(contact.last_at)}</span>
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:2 }}>
          <span style={{ color:'#8696a0', fontSize:12, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', maxWidth:170 }}>{contact.last_message}</span>
          {contact.unread > 0 && (
            <span style={{ background:'#25D366', color:'#fff', borderRadius:'50%', width:20, height:20, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, flexShrink:0 }}>{contact.unread}</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// CHAT WINDOW
// ─────────────────────────────────────────────
function ChatWindow({ contact, userId, socket }) {
  const [messages,  setMessages]  = useState([]);
  const [text,      setText]      = useState('');
  const [loading,   setLoading]   = useState(true);
  const [typing,    setTyping]    = useState(false);
  const [showMedia, setShowMedia] = useState(false);
  const [mediaUrl,  setMediaUrl]  = useState('');
  const [recording, setRecording] = useState(false);
  const bottomRef   = useRef(null);
  const typingTimer = useRef(null);

  useEffect(() => {
    loadMessages();
    if (socket) {
      socket.on('whatsapp-message', (msg) => {
        if (
          (msg.sender_id === contact.user.id && msg.receiver_id === userId) ||
          (msg.sender_id === userId && msg.receiver_id === contact.user.id)
        ) {
          setMessages(p => [...p, { ...msg, status: msg.sender_id === userId ? 'sent' : 'delivered' }]);
          // Marquer comme vu
          if (msg.sender_id === contact.user.id) {
            socket.emit('whatsapp-seen', { messageId: msg.id, userId });
          }
        }
      });
      socket.on('whatsapp-typing', (data) => {
        if (data.userId === contact.user.id) {
          setTyping(true);
          clearTimeout(typingTimer.current);
          typingTimer.current = setTimeout(() => setTyping(false), 2000);
        }
      });
      socket.on('whatsapp-seen', (data) => {
        setMessages(p => p.map(m => m.sender_id === userId ? { ...m, status:'seen' } : m));
      });
    }
    return () => {
      if (socket) { socket.off('whatsapp-message'); socket.off('whatsapp-typing'); socket.off('whatsapp-seen'); }
      clearTimeout(typingTimer.current);
    };
  }, [contact.id]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }); }, [messages]);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/whatsapp/messages?sender_id=${userId}&receiver_id=${contact.user.id}`);
      setMessages(res.data?.data || res.data || []);
    } catch {
      setMessages(MOCK_MSGS[contact.id] || []);
    } finally { setLoading(false); }
  };

  const handleSend = async () => {
    const content = text.trim();
    if (!content && !mediaUrl) return;
    const msg = {
      id: Date.now(), sender_id: userId, receiver_id: contact.user.id,
      content: content || null, media_path: mediaUrl || null,
      status: 'sent', created_at: new Date().toISOString(),
    };
    setMessages(p => [...p, msg]);
    setText(''); setMediaUrl(''); setShowMedia(false);
    try {
      const res = await api.post('/whatsapp/messages', {
        sender_id: userId, receiver_id: contact.user.id,
        content: content || null, media_path: mediaUrl || null,
      });
      if (socket) {
        socket.emit('whatsapp-message', { ...msg, id: res.data?.id || msg.id });
        // Simuler delivered après 1s
        setTimeout(() => {
          setMessages(p => p.map(m => m.id === msg.id ? { ...m, status:'delivered' } : m));
        }, 1000);
      }
    } catch {}
  };

  const handleTyping = (e) => {
    setText(e.target.value);
    if (socket) socket.emit('whatsapp-typing', { userId, toUserId: contact.user.id });
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  // Grouper par date
  const grouped = messages.reduce((acc, msg) => {
    const day = new Date(msg.created_at).toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long' });
    if (!acc[day]) acc[day] = [];
    acc[day].push(msg);
    return acc;
  }, {});

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column' }}>

      {/* Header */}
      <div style={{ padding:'12px 16px', borderBottom:'1px solid #1e1e2e', display:'flex', alignItems:'center', gap:12, background:'#202c33', flexShrink:0 }}>
        <div style={{ position:'relative' }}>
          <div style={S.avatar}>{initials(contact.user.username)}</div>
          {contact.user.online && <div style={S.online}/>}
        </div>
        <div style={{ flex:1 }}>
          <div style={{ color:'#e9edef', fontWeight:700, fontSize:15 }}>{contact.user.username}</div>
          <div style={{ color: contact.user.online ? '#25D366' : '#8696a0', fontSize:12 }}>
            {typing ? '✍️ en train d\'écrire...' : contact.user.online ? 'en ligne' : 'hors ligne'}
          </div>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button title="Appel vidéo" style={{ background:'transparent', border:'none', color:'#aebac1', cursor:'pointer', fontSize:18, padding:4 }}>📹</button>
          <button title="Appel audio" style={{ background:'transparent', border:'none', color:'#aebac1', cursor:'pointer', fontSize:18, padding:4 }}>📞</button>
          <button title="Infos" style={{ background:'transparent', border:'none', color:'#aebac1', cursor:'pointer', fontSize:18, padding:4 }}>⋮</button>
        </div>
      </div>

      {/* Background pattern */}
      <div style={{ flex:1, overflowY:'auto', padding:'12px 16px', display:'flex', flexDirection:'column', gap:4,
        backgroundImage:`url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.015'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}>
        {loading ? (
          <div style={{ color:'#8696a0', textAlign:'center', padding:40 }}>Chargement...</div>
        ) : (
          Object.entries(grouped).map(([day, msgs]) => (
            <React.Fragment key={day}>
              {/* Date pill */}
              <div style={{ display:'flex', justifyContent:'center', margin:'8px 0' }}>
                <span style={{ background:'#202c33', color:'#8696a0', fontSize:11, padding:'4px 12px', borderRadius:8 }}>{day}</span>
              </div>
              {msgs.map(msg => (
                <Bubble key={msg.id} msg={msg} isMine={msg.sender_id === userId}/>
              ))}
            </React.Fragment>
          ))
        )}
        <div ref={bottomRef}/>
      </div>

      {/* Zone média */}
      {showMedia && (
        <div style={{ padding:'10px 16px', background:'#202c33', borderTop:'1px solid #1e1e2e', display:'flex', gap:8, alignItems:'center' }}>
          <input
            style={{ ...S.input, flex:1, fontSize:12, padding:'7px 12px', borderRadius:8 }}
            placeholder="🔗 URL de l'image ou média..."
            value={mediaUrl}
            onChange={e => setMediaUrl(e.target.value)}
            autoFocus
          />
          {mediaUrl && (
            <img src={mediaUrl} alt="" style={{ width:40, height:40, borderRadius:6, objectFit:'cover' }} onError={e=>e.target.style.display='none'}/>
          )}
          <button onClick={() => { setShowMedia(false); setMediaUrl(''); }} style={{ background:'none', border:'none', color:'#8696a0', cursor:'pointer', fontSize:18 }}>✕</button>
        </div>
      )}

      {/* Input bar */}
      <div style={{ padding:'10px 16px', background:'#202c33', display:'flex', gap:10, alignItems:'center', flexShrink:0 }}>
        {/* Emoji + média */}
        <button title="Emoji" style={{ background:'transparent', border:'none', color:'#aebac1', cursor:'pointer', fontSize:20, padding:4, flexShrink:0 }}>😊</button>
        <button onClick={() => setShowMedia(m=>!m)} title="Joindre" style={{
          background: showMedia ? 'rgba(37,211,102,0.15)' : 'transparent',
          border:'none', color: showMedia ? '#25D366' : '#aebac1',
          cursor:'pointer', fontSize:20, padding:4, flexShrink:0
        }}>📎</button>

        {/* Préview média */}
        {mediaUrl && !showMedia && (
          <div style={{ position:'relative', flexShrink:0 }}>
            <img src={mediaUrl} alt="" style={{ width:36, height:36, borderRadius:6, objectFit:'cover' }} onError={e=>e.target.style.display='none'}/>
            <button onClick={() => setMediaUrl('')} style={{ position:'absolute', top:-6, right:-6, background:'#f87171', border:'none', borderRadius:'50%', width:16, height:16, cursor:'pointer', fontSize:10, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
          </div>
        )}

        <input
          style={{ ...S.input, flex:1, borderRadius:24, padding:'10px 18px' }}
          placeholder="Tapez un message"
          value={text}
          onChange={handleTyping}
          onKeyDown={handleKey}
        />

        {/* Micro / Envoyer */}
        {(text.trim() || mediaUrl) ? (
          <button onClick={handleSend} style={{ ...S.greenBtn, width:42, height:42, borderRadius:'50%', fontSize:18, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>↗</button>
        ) : (
          <button
            onMouseDown={() => setRecording(true)}
            onMouseUp={() => setRecording(false)}
            onMouseLeave={() => setRecording(false)}
            title="Maintenir pour enregistrer"
            style={{
              background: recording ? 'rgba(248,113,113,0.2)' : 'transparent',
              border:'none', color: recording ? '#f87171' : '#aebac1',
              cursor:'pointer', fontSize:22, padding:4, flexShrink:0,
              transition:'all 0.2s',
            }}>🎤</button>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// EMPTY STATE
// ─────────────────────────────────────────────
function EmptyState() {
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16, background:'#0a0a0f' }}>
      <div style={{ fontSize:72, filter:'drop-shadow(0 0 30px rgba(37,211,102,0.3))' }}>💬</div>
      <div style={{ color:'#e9edef', fontSize:22, fontWeight:700 }}>Multiwave WhatsApp Ultra</div>
      <div style={{ color:'#8696a0', fontSize:14, textAlign:'center', maxWidth:300, lineHeight:1.6 }}>
        Envoyez des messages, photos et fichiers à vos contacts en toute sécurité.
      </div>
      <div style={{ display:'flex', gap:8, marginTop:8 }}>
        {['🔒 Chiffré','📱 Multidevice','🌍 Mondial'].map(f => (
          <span key={f} style={{ background:'rgba(37,211,102,0.08)', border:'1px solid rgba(37,211,102,0.2)', color:'#25D366', padding:'5px 14px', borderRadius:20, fontSize:12 }}>{f}</span>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// NOUVEAU CONTACT MODAL
// ─────────────────────────────────────────────
function NewContactModal({ onClose, onStart }) {
  const [search,  setSearch]  = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async (q) => {
    setSearch(q);
    if (!q.trim()) { setResults([]); return; }
    try {
      const res = await api.get(`/users/search?q=${q}`);
      setResults(res.data?.data || res.data || []);
    } catch {
      setResults([{ id:20, username:'nouveau_contact' }, { id:21, username:'ami_pro' }].filter(u => u.username.includes(q)));
    }
  };

  return (
    <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.75)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ background:'#202c33', border:'1px solid #2a3942', borderRadius:14, padding:24, width:320 }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
          <span style={{ color:'#e9edef', fontWeight:700, fontSize:15 }}>📱 Nouveau message</span>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'#8696a0', cursor:'pointer', fontSize:18 }}>✕</button>
        </div>
        <input
          style={{ background:'#2a3942', border:'none', color:'#e9edef', padding:'10px 14px', borderRadius:8, fontSize:13, width:'100%', boxSizing:'border-box', outline:'none' }}
          placeholder="🔍 Rechercher un contact..."
          value={search}
          onChange={e => handleSearch(e.target.value)}
          autoFocus
        />
        <div style={{ marginTop:12, display:'flex', flexDirection:'column', gap:4 }}>
          {results.map(u => (
            <button key={u.id} onClick={() => onStart(u)} style={{
              display:'flex', alignItems:'center', gap:10, padding:'10px 12px',
              background:'#2a3942', border:'none', borderRadius:8, cursor:'pointer',
              color:'#e9edef', fontSize:13, textAlign:'left',
            }}>
              <div style={{ ...S.avatarSm }}>{initials(u.username)}</div>
              {u.username}
            </button>
          ))}
          {search && results.length === 0 && <div style={{ color:'#8696a0', fontSize:13, textAlign:'center', padding:12 }}>Aucun résultat</div>}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────
export default function WhatsApp({ userId, socket }) {
  const [contacts,  setContacts]  = useState([]);
  const [activeId,  setActiveId]  = useState(null);
  const [search,    setSearch]    = useState('');
  const [loading,   setLoading]   = useState(true);
  const [showNew,   setShowNew]   = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // all | unread | groups

  useEffect(() => { loadContacts(); }, []);

  const loadContacts = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/whatsapp/contacts?user_id=${userId}`);
      setContacts(res.data?.data || res.data || []);
    } catch { setContacts(MOCK_CONTACTS); }
    finally { setLoading(false); }
  };

  const activeContact = contacts.find(c => c.id === activeId);

  const filtered = contacts.filter(c => {
    const matchSearch = c.user.username.toLowerCase().includes(search.toLowerCase());
    const matchTab    = activeTab === 'all' ? true : activeTab === 'unread' ? c.unread > 0 : false;
    return matchSearch && matchTab;
  });

  const handleStartConv = (user) => {
    const existing = contacts.find(c => c.user.id === user.id);
    if (existing) { setActiveId(existing.id); }
    else {
      const newContact = { id: Date.now(), user: { ...user, online:false }, last_message:'', last_at: new Date().toISOString(), unread:0 };
      setContacts(p => [newContact, ...p]);
      setActiveId(newContact.id);
    }
    setShowNew(false);
  };

  const totalUnread = contacts.reduce((a,c) => a + (c.unread||0), 0);

  return (
    <div style={{ position:'relative' }}>
      {showNew && <NewContactModal onClose={() => setShowNew(false)} onStart={handleStartConv}/>}

      <div style={S.wrapper}>

        {/* ── SIDEBAR ── */}
        <div style={S.sidebar}>

          {/* Header */}
          <div style={{ padding:'14px 16px 10px', background:'#202c33', borderBottom:'1px solid #1e1e2e' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ color:'#e9edef', fontWeight:700, fontSize:16 }}>WhatsApp</span>
                {totalUnread > 0 && (
                  <span style={{ background:'#25D366', color:'#fff', borderRadius:10, padding:'1px 7px', fontSize:11, fontWeight:700 }}>{totalUnread}</span>
                )}
              </div>
              <div style={{ display:'flex', gap:6 }}>
                <button title="Nouveau message" onClick={() => setShowNew(true)} style={{ background:'transparent', border:'none', color:'#aebac1', cursor:'pointer', fontSize:20, padding:4 }}>✏️</button>
                <button title="Menu" style={{ background:'transparent', border:'none', color:'#aebac1', cursor:'pointer', fontSize:20, padding:4 }}>⋮</button>
              </div>
            </div>

            {/* Recherche */}
            <div style={{ position:'relative' }}>
              <input
                style={{ ...S.input, width:'100%', borderRadius:8, padding:'8px 12px 8px 36px', fontSize:13 }}
                placeholder="Rechercher ou démarrer..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'#8696a0', fontSize:13 }}>🔍</span>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display:'flex', borderBottom:'1px solid #1e1e2e' }}>
            {[['all','Tous'],['unread','Non lus']].map(([key,label]) => (
              <button key={key} onClick={() => setActiveTab(key)} style={{
                flex:1, padding:'10px', background:'transparent', border:'none',
                color: activeTab===key ? '#25D366' : '#8696a0',
                borderBottom: `2px solid ${activeTab===key ? '#25D366' : 'transparent'}`,
                cursor:'pointer', fontSize:13, fontWeight: activeTab===key ? 700 : 500,
                transition:'all 0.15s',
              }}>{label}</button>
            ))}
          </div>

          {/* Statuts en ligne */}
          {contacts.some(c => c.user.online) && (
            <div style={{ padding:'10px 14px', borderBottom:'1px solid #1e1e2e' }}>
              <div style={{ color:'#8696a0', fontSize:10, fontWeight:700, letterSpacing:'1px', textTransform:'uppercase', marginBottom:8 }}>En ligne</div>
              <div style={{ display:'flex', gap:10, overflowX:'auto' }}>
                {contacts.filter(c=>c.user.online).slice(0,6).map(c => (
                  <div key={c.id} onClick={() => setActiveId(c.id)} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:3, cursor:'pointer', flexShrink:0 }}>
                    <div style={{ position:'relative' }}>
                      <div style={{ ...S.avatarSm, width:38, height:38, fontSize:13 }}>{initials(c.user.username)}</div>
                      <div style={{ position:'absolute', bottom:0, right:0, width:9, height:9, borderRadius:'50%', background:'#25D366', border:'2px solid #0b1a12' }}/>
                    </div>
                    <span style={{ color:'#8696a0', fontSize:9, maxWidth:40, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.user.username.split('_')[0]}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Liste contacts */}
          <div style={{ flex:1, overflowY:'auto' }}>
            {loading ? (
              <div style={{ color:'#8696a0', textAlign:'center', padding:32, fontSize:13 }}>Chargement...</div>
            ) : filtered.length === 0 ? (
              <div style={{ color:'#8696a0', textAlign:'center', padding:32, fontSize:13 }}>Aucun contact</div>
            ) : (
              filtered.map(contact => (
                <ContactItem
                  key={contact.id}
                  contact={contact}
                  active={activeId === contact.id}
                  onClick={() => setActiveId(contact.id)}
                />
              ))
            )}
          </div>

          {/* Footer */}
          <div style={{ padding:'10px 16px', borderTop:'1px solid #1e1e2e', display:'flex', justifyContent:'center', gap:20 }}>
            {[['💬','Chats'],['📞','Appels'],['👥','Groupes']].map(([icon,label]) => (
              <button key={label} style={{ background:'transparent', border:'none', color:'#8696a0', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:2, fontSize:11 }}>
                <span style={{ fontSize:18 }}>{icon}</span>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── ZONE CHAT ── */}
        <div style={S.main}>
          {activeContact ? (
            <ChatWindow contact={activeContact} userId={userId} socket={socket}/>
          ) : (
            <EmptyState/>
          )}
        </div>

      </div>
    </div>
  );
}