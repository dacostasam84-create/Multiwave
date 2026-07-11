// ─────────────────────────────────────────────
// Messages.jsx — Multiwave Messagerie
// Auteur : Zahnouni Issam
// ─────────────────────────────────────────────
import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { useTranslation } from '../i18n';

const S = {
  wrapper:     { display:'flex', height:'calc(100vh - 110px)', background:'#0a0a0f', borderRadius:14, border:'1px solid #1e1e2e', overflow:'hidden' },
  sidebar:     { width:280, borderRight:'1px solid #1e1e2e', display:'flex', flexDirection:'column', background:'#0d0d18', flexShrink:0 },
  main:        { flex:1, display:'flex', flexDirection:'column', minWidth:0 },
  avatar:      { width:40, height:40, borderRadius:'50%', background:'linear-gradient(135deg,#C9A84C,#F5D87A)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, fontWeight:700, color:'#1a1200', flexShrink:0 },
  avatarSm:    { width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg,#0ea5e9,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:'#fff', flexShrink:0 },
  avatarOnline:{ position:'absolute', bottom:0, right:0, width:10, height:10, borderRadius:'50%', background:'#4ade80', border:'2px solid #0d0d18' },
  input:       { background:'#13131a', border:'1px solid #1e1e2e', color:'#e2e8f0', padding:'10px 14px', borderRadius:10, fontSize:13, outline:'none', boxSizing:'border-box' },
  msgOut:      { alignSelf:'flex-end',  background:'linear-gradient(135deg,rgba(201,168,76,0.18),rgba(245,216,122,0.10))', border:'1px solid rgba(201,168,76,0.2)', borderRadius:'14px 14px 4px 14px', color:'#e2e8f0' },
  msgIn:       { alignSelf:'flex-start', background:'#13131a', border:'1px solid #1e1e2e', borderRadius:'14px 14px 14px 4px', color:'#e2e8f0' },
};

const initials = (name) => name ? name.slice(0,2).toUpperCase() : '??';
const timeAgo  = (d) => {
  if (!d) return '';
  const diff = Math.floor((Date.now() - new Date(d)) / 1000);
  if (diff < 60)    return `${diff}s`;
  if (diff < 3600)  return `${Math.floor(diff/60)}m`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h`;
  return new Date(d).toLocaleDateString('fr-FR',{day:'2-digit',month:'short'});
};
const fmtHour = (d) => d ? new Date(d).toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'}) : '';

const MOCK_CONVS = [
  { id:1, user:{ id:2, username:'sarah_dz',    online:true  }, last_message:'Super ! À demain 👋', last_at:'2026-03-13T10:55:00Z', unread:2 },
  { id:2, user:{ id:3, username:'dev_karim',   online:true  }, last_message:'Tu as vu la nouvelle feature ?', last_at:'2026-03-13T09:30:00Z', unread:0 },
  { id:3, user:{ id:4, username:'tech_maroc',  online:false }, last_message:'Merci pour le partage 🙏', last_at:'2026-03-12T22:00:00Z', unread:0 },
  { id:4, user:{ id:5, username:'laila_design',online:false }, last_message:'Le mockup est prêt !', last_at:'2026-03-12T18:00:00Z', unread:1 },
];

const MOCK_MESSAGES = {
  1: [
    { id:1, sender_id:2, receiver_id:1, content:'Salut ! Tu utilises Multiwave ?', media_url:null, media_type:'text', is_read:true, created_at:'2026-03-13T10:40:00Z' },
    { id:2, sender_id:1, receiver_id:2, content:'Oui ! C\'est top comme plateforme 🔥', media_url:null, media_type:'text', is_read:true, created_at:'2026-03-13T10:42:00Z' },
    { id:3, sender_id:2, receiver_id:1, content:'Super ! À demain 👋', media_url:null, media_type:'text', is_read:false, created_at:'2026-03-13T10:55:00Z' },
  ],
};

const MEDIA_ICONS = { text:'', image:'🖼️', video:'🎬', audio:'🎵', file:'📎' };

function MediaBubble({ url, type, t }) {
  if (!url || type === 'text') return null;
  if (type === 'image') return <img src={url} alt="" style={{ maxWidth:220, borderRadius:8, display:'block', marginTop:6 }} onError={e=>e.target.style.display='none'}/>;
  if (type === 'video') return <video src={url} controls style={{ maxWidth:220, borderRadius:8, marginTop:6 }}/>;
  if (type === 'audio') return <audio src={url} controls style={{ marginTop:6, width:200 }}/>;
  if (type === 'file')  return <a href={url} target="_blank" rel="noreferrer" style={{ color:'#C9A84C', fontSize:12, marginTop:4, display:'block' }}>📎 {t('download')}</a>;
  return null;
}

function MessageBubble({ msg, isMine, showTranslation, t }) {
  const [showOrig, setShowOrig] = useState(false);
  const content = showTranslation && msg.translated_content && !showOrig ? msg.translated_content : msg.content;
  return (
    <div style={{ display:'flex', flexDirection:'column', maxWidth:'72%', ...(isMine ? { alignSelf:'flex-end', alignItems:'flex-end' } : { alignSelf:'flex-start', alignItems:'flex-start' }) }}>
      <div style={{ ...( isMine ? S.msgOut : S.msgIn ), padding:'10px 14px', fontSize:14, lineHeight:1.6 }}>
        {content}
        <MediaBubble url={msg.media_url} type={msg.media_type} t={t}/>
        {msg.translated_content && (
          <button onClick={() => setShowOrig(o=>!o)} style={{ background:'none', border:'none', color:'#C9A84C', fontSize:10, cursor:'pointer', marginTop:4, padding:0, display:'block' }}>
            {showOrig ? `🌐 ${t('see_translation')}` : `📄 ${t('original')}`}
          </button>
        )}
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:5, marginTop:3, padding:'0 4px' }}>
        <span style={{ color:'#334155', fontSize:10 }}>{fmtHour(msg.created_at)}</span>
        {isMine && <span style={{ fontSize:10, color: msg.is_read ? '#60a5fa' : '#334155' }}>{msg.is_read ? '✓✓' : '✓'}</span>}
      </div>
    </div>
  );
}

function ConvItem({ conv, active, onClick }) {
  return (
    <div onClick={onClick} style={{ display:'flex', alignItems:'center', gap:11, padding:'12px 14px', cursor:'pointer', background: active ? 'rgba(201,168,76,0.08)' : 'transparent', borderLeft: active ? '2px solid #C9A84C' : '2px solid transparent', transition:'all 0.15s' }}>
      <div style={{ position:'relative' }}>
        <div style={S.avatar}>{initials(conv.user.username)}</div>
        {conv.user.online && <div style={S.avatarOnline}/>}
      </div>
      <div style={{ flex:1, overflow:'hidden' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ color: active ? '#F5D87A' : '#e2e8f0', fontWeight:600, fontSize:13 }}>{conv.user.username}</span>
          <span style={{ color:'#334155', fontSize:10 }}>{timeAgo(conv.last_at)}</span>
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:2 }}>
          <span style={{ color:'#475569', fontSize:12, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', maxWidth:150 }}>{conv.last_message}</span>
          {conv.unread > 0 && <span style={{ background:'linear-gradient(135deg,#C9A84C,#F5D87A)', color:'#1a1200', borderRadius:10, padding:'1px 7px', fontSize:10, fontWeight:700, flexShrink:0 }}>{conv.unread}</span>}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ t }) {
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:14 }}>
      <div style={{ fontSize:60 }}>💬</div>
      <div style={{ color:'#e2e8f0', fontSize:18, fontWeight:700 }}>{t('your_messages')}</div>
      <div style={{ color:'#475569', fontSize:13, textAlign:'center', maxWidth:280 }}>
        {t('select_conv')} {t('start_chat')}
      </div>
    </div>
  );
}

function ChatWindow({ conv, userId, socket, t }) {
  const [messages,  setMessages]  = useState([]);
  const [text,      setText]      = useState('');
  const [loading,   setLoading]   = useState(true);
  const [showTrans, setShowTrans] = useState(false);
  const [typing,    setTyping]    = useState(false);
  const [mediaUrl,  setMediaUrl]  = useState('');
  const [mediaType, setMediaType] = useState('text');
  const [showMedia, setShowMedia] = useState(false);
  const bottomRef   = useRef(null);
  const typingTimer = useRef(null);

  useEffect(() => {
    loadMessages();
    if (socket) {
      socket.on('new-message', (msg) => {
        if ((msg.sender_id === conv.user.id && msg.receiver_id === userId) ||
            (msg.sender_id === userId && msg.receiver_id === conv.user.id)) {
          setMessages(p => [...p, msg]);
        }
      });
      socket.on('typing', (data) => {
        if (data.userId === conv.user.id) setTyping(true);
        clearTimeout(typingTimer.current);
        typingTimer.current = setTimeout(() => setTyping(false), 2000);
      });
    }
    return () => {
      if (socket) { socket.off('new-message'); socket.off('typing'); }
      clearTimeout(typingTimer.current);
    };
  }, [conv.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }); }, [messages]);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/messages?user_id=${userId}&other_id=${conv.user.id}`);
      setMessages(res.data?.data || res.data || []);
    } catch {
      setMessages(MOCK_MESSAGES[conv.id] || []);
    } finally { setLoading(false); }
  };

  const handleSend = async () => {
    const content = text.trim();
    if (!content && !mediaUrl) return;
    const msg = { id:Date.now(), sender_id:userId, receiver_id:conv.user.id, content:content||null, media_url:mediaUrl||null, media_type:mediaUrl?mediaType:'text', is_read:false, created_at:new Date().toISOString() };
    setMessages(p => [...p, msg]);
    setText(''); setMediaUrl(''); setMediaType('text'); setShowMedia(false);
    try {
      await api.post('/messages', { sender_id:userId, receiver_id:conv.user.id, content:content||null, media_url:mediaUrl||null, media_type:mediaUrl?mediaType:'text' });
      if (socket) socket.emit('send-message', { ...msg });
    } catch {}
  };

  const handleTyping = (e) => {
    setText(e.target.value);
    if (socket) socket.emit('typing', { userId, toUserId: conv.user.id });
  };

  const handleKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } };

  const grouped = messages.reduce((acc, msg) => {
    const day = new Date(msg.created_at).toLocaleDateString('fr-FR', { day:'2-digit', month:'long', year:'numeric' });
    if (!acc[day]) acc[day] = [];
    acc[day].push(msg);
    return acc;
  }, {});

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
      {/* Header */}
      <div style={{ padding:'14px 18px', borderBottom:'1px solid #1e1e2e', display:'flex', alignItems:'center', gap:12, background:'#0d0d18', flexShrink:0 }}>
        <div style={{ position:'relative' }}>
          <div style={S.avatar}>{initials(conv.user.username)}</div>
          {conv.user.online && <div style={S.avatarOnline}/>}
        </div>
        <div style={{ flex:1 }}>
          <div style={{ color:'#e2e8f0', fontWeight:700, fontSize:14 }}>{conv.user.username}</div>
          <div style={{ color: conv.user.online ? '#4ade80' : '#475569', fontSize:11 }}>
            {typing ? `✍️ ${t('typing')}` : conv.user.online ? t('online') : t('offline')}
          </div>
        </div>
        <div style={{ display:'flex', gap:6 }}>
          <button title="Audio" style={{ background:'rgba(74,222,128,0.1)', border:'1px solid rgba(74,222,128,0.2)', color:'#4ade80', width:34, height:34, borderRadius:8, cursor:'pointer', fontSize:15, display:'flex', alignItems:'center', justifyContent:'center' }}>🎙️</button>
          <button title="Video" style={{ background:'rgba(14,165,233,0.1)', border:'1px solid rgba(14,165,233,0.2)', color:'#0ea5e9', width:34, height:34, borderRadius:8, cursor:'pointer', fontSize:15, display:'flex', alignItems:'center', justifyContent:'center' }}>📹</button>
          <button onClick={() => setShowTrans(t=>!t)} style={{ background: showTrans ? 'rgba(201,168,76,0.15)' : 'transparent', border:`1px solid ${showTrans?'#C9A84C':'#1e1e2e'}`, color: showTrans ? '#C9A84C' : '#64748b', width:34, height:34, borderRadius:8, cursor:'pointer', fontSize:15, display:'flex', alignItems:'center', justifyContent:'center' }}>🌐</button>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex:1, overflowY:'auto', padding:'16px 18px', display:'flex', flexDirection:'column', gap:8 }}>
        {loading ? (
          <div style={{ color:'#475569', textAlign:'center', padding:40 }}>{t('loading')}</div>
        ) : (
          Object.entries(grouped).map(([day, msgs]) => (
            <React.Fragment key={day}>
              <div style={{ display:'flex', alignItems:'center', gap:10, margin:'8px 0' }}>
                <div style={{ flex:1, height:1, background:'#1e1e2e' }}/>
                <span style={{ color:'#334155', fontSize:11, background:'#0a0a0f', padding:'2px 10px', borderRadius:10 }}>{day}</span>
                <div style={{ flex:1, height:1, background:'#1e1e2e' }}/>
              </div>
              {msgs.map(msg => (
                <MessageBubble key={msg.id} msg={msg} isMine={msg.sender_id === userId} showTranslation={showTrans} t={t}/>
              ))}
            </React.Fragment>
          ))
        )}
        <div ref={bottomRef}/>
      </div>

      {/* Zone média */}
      {showMedia && (
        <div style={{ padding:'10px 18px', borderTop:'1px solid #1e1e2e', background:'#0d0d18', display:'flex', gap:8, flexWrap:'wrap', alignItems:'center' }}>
          <input style={{ ...S.input, flex:1, fontSize:12, padding:'7px 12px' }} placeholder="🔗 URL..." value={mediaUrl} onChange={e => setMediaUrl(e.target.value)}/>
          {['image','video','audio','file'].map(tp => (
            <button key={tp} onClick={() => setMediaType(tp)} style={{ background: mediaType===tp ? 'rgba(201,168,76,0.15)' : 'transparent', border:`1px solid ${mediaType===tp?'#C9A84C':'#1e1e2e'}`, color: mediaType===tp ? '#C9A84C' : '#64748b', padding:'5px 10px', borderRadius:8, cursor:'pointer', fontSize:12 }}>{MEDIA_ICONS[tp]} {tp}</button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{ padding:'12px 18px', borderTop:'1px solid #1e1e2e', display:'flex', gap:10, alignItems:'flex-end', background:'#0d0d18', flexShrink:0 }}>
        <button onClick={() => setShowMedia(m=>!m)} style={{ background: showMedia ? 'rgba(201,168,76,0.12)' : 'transparent', border:`1px solid ${showMedia?'#C9A84C':'#1e1e2e'}`, color: showMedia ? '#C9A84C' : '#64748b', width:36, height:36, borderRadius:8, cursor:'pointer', fontSize:16, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>📎</button>
        <textarea style={{ ...S.input, flex:1, resize:'none', minHeight:36, maxHeight:120, lineHeight:1.5, padding:'8px 14px' }} placeholder={t('write_message')} value={text} onChange={handleTyping} onKeyDown={handleKey} rows={1}/>
        <button onClick={handleSend} disabled={!text.trim() && !mediaUrl} style={{ background: (text.trim()||mediaUrl) ? 'linear-gradient(135deg,#C9A84C,#F5D87A)' : '#1e1e2e', color: (text.trim()||mediaUrl) ? '#1a1200' : '#475569', border:'none', width:36, height:36, borderRadius:8, cursor:'pointer', fontSize:16, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s' }}>↗</button>
      </div>
    </div>
  );
}

function NewConvModal({ onClose, onStart, t }) {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async (q) => {
    setSearch(q);
    if (!q.trim()) { setResults([]); return; }
    try {
      const res = await api.get(`/users/search?q=${q}`);
      setResults(res.data?.data || res.data || []);
    } catch {
      setResults([{ id:10, username:'nouvel_ami' }, { id:11, username:'contact_pro' }].filter(u => u.username.includes(q)));
    }
  };

  return (
    <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.7)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ background:'#13131a', border:'1px solid #1e1e2e', borderRadius:14, padding:24, width:320 }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
          <span style={{ color:'#e2e8f0', fontWeight:700, fontSize:15 }}>💬 {t('new_conv')}</span>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'#64748b', cursor:'pointer', fontSize:18 }}>✕</button>
        </div>
        <input style={{ background:'#0a0a0f', border:'1px solid #1e1e2e', color:'#e2e8f0', padding:'9px 14px', borderRadius:8, fontSize:13, width:'100%', boxSizing:'border-box', outline:'none' }} placeholder={`🔍 ${t('search_user')}`} value={search} onChange={e => handleSearch(e.target.value)} autoFocus/>
        <div style={{ marginTop:12, display:'flex', flexDirection:'column', gap:6 }}>
          {results.map(u => (
            <button key={u.id} onClick={() => onStart(u)} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', background:'#0a0a0f', border:'1px solid #1e1e2e', borderRadius:8, cursor:'pointer', color:'#e2e8f0', fontSize:13, textAlign:'left' }}>
              <div style={{ width:28, height:28, borderRadius:'50%', background:'linear-gradient(135deg,#C9A84C,#F5D87A)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:'#1a1200' }}>{initials(u.username)}</div>
              {u.username}
            </button>
          ))}
          {search && results.length === 0 && <div style={{ color:'#475569', fontSize:13, textAlign:'center', padding:12 }}>{t('no_result')}</div>}
        </div>
      </div>
    </div>
  );
}

export default function Messages({ userId, socket }) {
  const { t } = useTranslation();
  const [convs,    setConvs]    = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [search,   setSearch]   = useState('');
  const [loading,  setLoading]  = useState(true);
  const [showNew,  setShowNew]  = useState(false);

  useEffect(() => { loadConvs(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadConvs = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/messages/conversations?user_id=${userId}`);
      setConvs(res.data?.data || res.data || []);
    } catch { setConvs(MOCK_CONVS); }
    finally { setLoading(false); }
  };

  const activeConv = convs.find(c => c.id === activeId);
  const filtered   = convs.filter(c => c.user.username.toLowerCase().includes(search.toLowerCase()));

  const handleStartConv = (user) => {
    const existing = convs.find(c => c.user.id === user.id);
    if (existing) { setActiveId(existing.id); }
    else {
      const newConv = { id:Date.now(), user:{ ...user, online:false }, last_message:'', last_at:new Date().toISOString(), unread:0 };
      setConvs(p => [newConv, ...p]);
      setActiveId(newConv.id);
    }
    setShowNew(false);
  };

  return (
    <div style={{ position:'relative' }}>
      {showNew && <NewConvModal onClose={() => setShowNew(false)} onStart={handleStartConv} t={t}/>}
      <div style={S.wrapper}>
        {/* SIDEBAR */}
        <div style={S.sidebar}>
          <div style={{ padding:'14px 14px 10px', borderBottom:'1px solid #1e1e2e' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
              <span style={{ color:'#e2e8f0', fontWeight:700, fontSize:15 }}>{t('messages_title')}</span>
              <button onClick={() => setShowNew(true)} style={{ background:'linear-gradient(135deg,rgba(201,168,76,0.18),rgba(245,216,122,0.10))', border:'1px solid rgba(201,168,76,0.3)', color:'#C9A84C', width:30, height:30, borderRadius:8, cursor:'pointer', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center' }}>✏️</button>
            </div>
            <input style={{ ...S.input, width:'100%', padding:'8px 12px', fontSize:12, borderRadius:8 }} placeholder={`🔍 ${t('search_conv')}`} value={search} onChange={e => setSearch(e.target.value)}/>
          </div>

          {/* Online users */}
          <div style={{ padding:'10px 14px', borderBottom:'1px solid #1e1e2e', display:'flex', gap:8, overflowX:'auto' }}>
            {convs.filter(c=>c.user.online).slice(0,5).map(c => (
              <div key={c.id} onClick={() => setActiveId(c.id)} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:3, cursor:'pointer', flexShrink:0 }}>
                <div style={{ position:'relative' }}>
                  <div style={{ ...S.avatarSm, width:36, height:36, fontSize:13 }}>{initials(c.user.username)}</div>
                  <div style={{ position:'absolute', bottom:0, right:0, width:9, height:9, borderRadius:'50%', background:'#4ade80', border:'2px solid #0d0d18' }}/>
                </div>
                <span style={{ color:'#64748b', fontSize:9, maxWidth:36, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.user.username.split('_')[0]}</span>
              </div>
            ))}
          </div>

          {/* List */}
          <div style={{ flex:1, overflowY:'auto' }}>
            {loading ? (
              <div style={{ color:'#475569', textAlign:'center', padding:32, fontSize:13 }}>{t('loading')}</div>
            ) : filtered.length === 0 ? (
              <div style={{ color:'#475569', textAlign:'center', padding:32, fontSize:13 }}>{t('no_conv')}</div>
            ) : (
              filtered.map(conv => <ConvItem key={conv.id} conv={conv} active={activeId===conv.id} onClick={() => setActiveId(conv.id)}/>)
            )}
          </div>
        </div>

        {/* CHAT */}
        <div style={S.main}>
          {activeConv ? <ChatWindow conv={activeConv} userId={userId} socket={socket} t={t}/> : <EmptyState t={t}/>}
        </div>
      </div>
    </div>
  );
}