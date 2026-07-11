// ─────────────────────────────────────────────
// NotificationBell.jsx — Multiwave Notifications
// Auteur : Zahnouni Issam
// ─────────────────────────────────────────────
import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';

// ─────────────────────────────────────────────
// CONFIG TYPES
// ─────────────────────────────────────────────
const NOTIF_CONFIG = {
  like:     { icon:'❤️', color:'#f87171', bg:'rgba(248,113,113,0.1)', label:'a aimé votre post' },
  comment:  { icon:'💬', color:'#60a5fa', bg:'rgba(96,165,250,0.1)',  label:'a commenté votre post' },
  follow:   { icon:'👤', color:'#4ade80', bg:'rgba(74,222,128,0.1)',  label:'vous suit maintenant' },
  message:  { icon:'✉️', color:'#C9A84C', bg:'rgba(201,168,76,0.1)', label:'vous a envoyé un message' },
  call:     { icon:'📞', color:'#0ea5e9', bg:'rgba(14,165,233,0.1)', label:'vous a appelé' },
  debate:   { icon:'⚔️', color:'#fb923c', bg:'rgba(251,146,60,0.1)', label:'vous invite à un débat' },
  mention:  { icon:'@',  color:'#a78bfa', bg:'rgba(167,139,250,0.1)',label:'vous a mentionné' },
};

// ─────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────
const MOCK_NOTIFS = [
  { id:1,  user_id:1, from_user_id:2, type:'like',    content:'a aimé votre post',              reference_id:42, reference_type:'post',    is_read:false, created_at:'2026-03-13T11:00:00Z', from_user:{ username:'sarah_dz' } },
  { id:2,  user_id:1, from_user_id:3, type:'comment', content:'Super contenu ! 🔥',              reference_id:42, reference_type:'post',    is_read:false, created_at:'2026-03-13T10:50:00Z', from_user:{ username:'dev_karim' } },
  { id:3,  user_id:1, from_user_id:4, type:'follow',  content:'vous suit maintenant',            reference_id:null, reference_type:'user',  is_read:false, created_at:'2026-03-13T10:30:00Z', from_user:{ username:'tech_maroc' } },
  { id:4,  user_id:1, from_user_id:5, type:'message', content:'Salut ! Tu es disponible ?',      reference_id:null, reference_type:'message',is_read:true, created_at:'2026-03-13T10:00:00Z', from_user:{ username:'laila_design' } },
  { id:5,  user_id:1, from_user_id:6, type:'call',    content:'Appel vidéo manqué',              reference_id:null, reference_type:'call',  is_read:true,  created_at:'2026-03-13T09:30:00Z', from_user:{ username:'dj_atlas' } },
  { id:6,  user_id:1, from_user_id:7, type:'debate',  content:'vous invite à débattre sur l\'IA',reference_id:3,   reference_type:'debate', is_read:true,  created_at:'2026-03-12T18:00:00Z', from_user:{ username:'startup_ma' } },
  { id:7,  user_id:1, from_user_id:8, type:'mention', content:'vous a mentionné dans un post',   reference_id:55, reference_type:'post',   is_read:true,  created_at:'2026-03-12T14:00:00Z', from_user:{ username:'codewithamir' } },
  { id:8,  user_id:1, from_user_id:2, type:'like',    content:'a aimé votre vidéo',              reference_id:10, reference_type:'video',  is_read:true,  created_at:'2026-03-12T10:00:00Z', from_user:{ username:'sarah_dz' } },
];

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
const timeAgo = (d) => {
  if (!d) return '';
  const diff = Math.floor((Date.now() - new Date(d)) / 1000);
  if (diff < 60)    return `${diff}s`;
  if (diff < 3600)  return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}j`;
};

const initials = (n) => n ? n.slice(0, 2).toUpperCase() : '??';

// ─────────────────────────────────────────────
// NOTIFICATION ITEM
// ─────────────────────────────────────────────
function NotifItem({ notif, onRead, onDelete }) {
  const cfg = NOTIF_CONFIG[notif.type] || { icon:'🔔', color:'#64748b', bg:'rgba(100,116,139,0.1)', label:'' };

  return (
    <div
      onClick={() => !notif.is_read && onRead(notif.id)}
      style={{
        display:'flex', alignItems:'flex-start', gap:10, padding:'12px 16px',
        background: notif.is_read ? 'transparent' : 'rgba(201,168,76,0.04)',
        borderLeft: `3px solid ${notif.is_read ? 'transparent' : '#C9A84C'}`,
        cursor:'pointer', transition:'background 0.15s', position:'relative',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
      onMouseLeave={e => e.currentTarget.style.background = notif.is_read ? 'transparent' : 'rgba(201,168,76,0.04)'}
    >
      {/* Avatar + icône type */}
      <div style={{ position:'relative', flexShrink:0 }}>
        <div style={{
          width:36, height:36, borderRadius:'50%',
          background:'linear-gradient(135deg,#C9A84C,#F5D87A)',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:13, fontWeight:700, color:'#1a1200',
        }}>
          {initials(notif.from_user?.username || '?')}
        </div>
        <div style={{
          position:'absolute', bottom:-2, right:-2,
          width:18, height:18, borderRadius:'50%',
          background: cfg.bg, border:`1px solid ${cfg.color}`,
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:10,
        }}>
          {cfg.icon}
        </div>
      </div>

      {/* Contenu */}
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:13, lineHeight:1.5 }}>
          <span style={{ color:'#C9A84C', fontWeight:700 }}>{notif.from_user?.username}</span>
          {' '}
          <span style={{ color: notif.is_read ? '#64748b' : '#94a3b8' }}>
            {notif.content || cfg.label}
          </span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:3 }}>
          <span style={{ ...badgeStyle(cfg.color), fontSize:9 }}>{notif.type}</span>
          <span style={{ color:'#334155', fontSize:11 }}>{timeAgo(notif.created_at)}</span>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:4, flexShrink:0 }}>
        {!notif.is_read && (
          <div style={{ width:8, height:8, borderRadius:'50%', background:'#C9A84C' }}/>
        )}
        <button
          onClick={e => { e.stopPropagation(); onDelete(notif.id); }}
          style={{ background:'none', border:'none', color:'#334155', cursor:'pointer', fontSize:12, padding:2, opacity:0, transition:'opacity 0.15s' }}
          className="delete-btn"
        >✕</button>
      </div>
    </div>
  );
}

const badgeStyle = (color) => ({
  background:`${color}18`, border:`1px solid ${color}40`, color,
  padding:'1px 6px', borderRadius:10, fontWeight:700, textTransform:'uppercase',
});

// ─────────────────────────────────────────────
// NOTIFICATION BELL
// ─────────────────────────────────────────────
export default function NotificationBell({ socket, userId }) {
  const [notifs,   setNotifs]   = useState([]);
  const [open,     setOpen]     = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [filter,   setFilter]   = useState('all'); // all | unread
  const panelRef = useRef(null);

  // Chargement initial
  useEffect(() => {
    loadNotifs();
  }, [userId]);

  // Socket — nouvelles notifications en temps réel
  useEffect(() => {
    if (!socket) return;
    socket.on('notification', (notif) => {
      setNotifs(p => [notif, ...p]);
    });
    socket.on('new-notification', (notif) => {
      setNotifs(p => [notif, ...p]);
    });
    return () => {
      socket.off('notification');
      socket.off('new-notification');
    };
  }, [socket]);

  // Fermer en cliquant dehors
  useEffect(() => {
    const handleClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const loadNotifs = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await api.get(`/notifications?user_id=${userId}`);
      setNotifs(res.data?.data || res.data || []);
    } catch {
      setNotifs(MOCK_NOTIFS);
    } finally { setLoading(false); }
  };

  const handleRead = async (id) => {
    setNotifs(p => p.map(n => n.id === id ? { ...n, is_read:true } : n));
    try { await api.patch(`/notifications/${id}/read`); } catch {}
  };

  const handleReadAll = async () => {
    setNotifs(p => p.map(n => ({ ...n, is_read:true })));
    try { await api.patch(`/notifications/read-all`, { user_id:userId }); } catch {}
  };

  const handleDelete = async (id) => {
    setNotifs(p => p.filter(n => n.id !== id));
    try { await api.delete(`/notifications/${id}`); } catch {}
  };

  const handleClearAll = async () => {
    setNotifs([]);
    try { await api.delete(`/notifications/clear-all`, { data:{ user_id:userId } }); } catch {}
  };

  const unreadCount = notifs.filter(n => !n.is_read).length;
  const filtered    = filter === 'unread' ? notifs.filter(n => !n.is_read) : notifs;

  // Grouper par type pour les stats
  const byType = Object.keys(NOTIF_CONFIG).reduce((acc, t) => ({
    ...acc, [t]: notifs.filter(n => n.type === t).length
  }), {});

  return (
    <div style={{ position:'relative' }} ref={panelRef}>

      {/* Bouton cloche */}
      <button
        onClick={() => { setOpen(o => !o); if (!open) loadNotifs(); }}
        style={{
          position:'relative', background:'transparent', border:'none',
          cursor:'pointer', padding:4, fontSize:18, lineHeight:1,
          filter: unreadCount > 0 ? 'drop-shadow(0 0 6px rgba(201,168,76,0.6))' : 'none',
          transition:'filter 0.3s',
        }}
      >
        🔔
        {unreadCount > 0 && (
          <span style={{
            position:'absolute', top:-2, right:-2,
            background:'linear-gradient(135deg,#C9A84C,#F5D87A)',
            color:'#1a1200', borderRadius:10, minWidth:16, height:16,
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:9, fontWeight:800, padding:'0 3px', lineHeight:1,
          }}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Panel notifications */}
      {open && (
        <div style={{
          position:'fixed', right:16, top:60, zIndex:500,
          width:380, maxHeight:520,
          background:'#0d0d18',
          border:'1px solid rgba(201,168,76,0.2)',
          borderRadius:14,
          boxShadow:'0 16px 48px rgba(0,0,0,0.6)',
          display:'flex', flexDirection:'column',
          overflow:'hidden',
          animation:'fadeInDown 0.15s ease',
        }}>

          <style>{`
            @keyframes fadeInDown { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
            .delete-btn:hover { opacity: 1 !important; color: #f87171 !important; }
            .notif-row:hover .delete-btn { opacity: 1 !important; }
          `}</style>

          {/* Header */}
          <div style={{ padding:'14px 16px 10px', borderBottom:'1px solid #1e1e2e', flexShrink:0 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ color:'#e2e8f0', fontWeight:700, fontSize:15 }}>Notifications</span>
                {unreadCount > 0 && (
                  <span style={{ background:'linear-gradient(135deg,#C9A84C,#F5D87A)', color:'#1a1200', borderRadius:10, padding:'1px 7px', fontSize:10, fontWeight:700 }}>
                    {unreadCount} nouveau{unreadCount > 1 ? 'x' : ''}
                  </span>
                )}
              </div>
              <div style={{ display:'flex', gap:6 }}>
                {unreadCount > 0 && (
                  <button onClick={handleReadAll} style={{ background:'transparent', border:'none', color:'#C9A84C', cursor:'pointer', fontSize:11, fontWeight:600 }}>
                    ✓ Tout lire
                  </button>
                )}
                {notifs.length > 0 && (
                  <button onClick={handleClearAll} style={{ background:'transparent', border:'none', color:'#475569', cursor:'pointer', fontSize:11 }}>
                    🗑️ Vider
                  </button>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display:'flex', gap:6 }}>
              {[['all','Toutes'],['unread','Non lues']].map(([key,label]) => (
                <button key={key} onClick={() => setFilter(key)} style={{
                  background: filter===key ? 'rgba(201,168,76,0.12)' : 'transparent',
                  border: `1px solid ${filter===key ? '#C9A84C' : '#1e1e2e'}`,
                  color: filter===key ? '#C9A84C' : '#64748b',
                  padding:'4px 12px', borderRadius:20, cursor:'pointer', fontSize:11, fontWeight:600,
                }}>
                  {label} {key==='unread' && unreadCount > 0 ? `(${unreadCount})` : ''}
                </button>
              ))}
            </div>
          </div>

          {/* Liste */}
          <div style={{ flex:1, overflowY:'auto' }}>
            {loading ? (
              <div style={{ color:'#475569', textAlign:'center', padding:32, fontSize:13 }}>Chargement...</div>
            ) : filtered.length === 0 ? (
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:32, gap:10 }}>
                <span style={{ fontSize:40 }}>🔔</span>
                <span style={{ color:'#64748b', fontSize:13 }}>
                  {filter === 'unread' ? 'Tout est lu !' : 'Aucune notification'}
                </span>
              </div>
            ) : (
              filtered.map((notif, i) => (
                <div key={notif.id} style={{ borderBottom: i < filtered.length-1 ? '1px solid #0d0d18' : 'none' }}>
                  <NotifItem notif={notif} onRead={handleRead} onDelete={handleDelete}/>
                </div>
              ))
            )}
          </div>

          {/* Footer — stats par type */}
          {notifs.length > 0 && (
            <div style={{ padding:'10px 16px', borderTop:'1px solid #1e1e2e', flexShrink:0 }}>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap', justifyContent:'center' }}>
                {Object.entries(NOTIF_CONFIG).filter(([t]) => byType[t] > 0).map(([type, cfg]) => (
                  <div key={type} style={{ display:'flex', alignItems:'center', gap:3 }}>
                    <span style={{ fontSize:12 }}>{cfg.icon}</span>
                    <span style={{ color:cfg.color, fontSize:11, fontWeight:700 }}>{byType[type]}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}