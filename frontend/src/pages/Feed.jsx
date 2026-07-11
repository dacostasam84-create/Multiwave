import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { useTranslation } from '../i18n';

// ─────────────────────────────────────────────
// STYLES PARTAGÉS
// ─────────────────────────────────────────────
const S = {
  container:   { display:'flex', flexDirection:'column', gap:18, maxWidth:680, margin:'0 auto' },
  card:        { background:'#13131a', border:'1px solid #1e1e2e', borderRadius:14, overflow:'hidden' },
  avatar:      { width:38, height:38, borderRadius:'50%', background:'linear-gradient(135deg,#C9A84C,#F5D87A)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, fontWeight:700, color:'#1a1200', flexShrink:0 },
  avatarSm:    { width:28, height:28, borderRadius:'50%', background:'linear-gradient(135deg,#C9A84C,#F5D87A)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:'#1a1200', flexShrink:0 },
  btn:         { background:'transparent', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:5, padding:'6px 12px', borderRadius:8, fontSize:13, color:'#64748b', transition:'all 0.15s' },
  btnActive:   { color:'#f87171', background:'rgba(248,113,113,0.08)' },
  input:       { background:'#0a0a0f', border:'1px solid #1e1e2e', color:'#e2e8f0', padding:'10px 14px', borderRadius:10, fontSize:13, width:'100%', boxSizing:'border-box', outline:'none', resize:'none' },
  badge:       { background:'rgba(201,168,76,0.12)', border:'1px solid rgba(201,168,76,0.25)', color:'#C9A84C', padding:'2px 8px', borderRadius:20, fontSize:10, fontWeight:700 },
  empty:       { color:'#475569', textAlign:'center', padding:'48px 24px', fontSize:14 },
  spinner:     { color:'#475569', textAlign:'center', padding:48, fontSize:14 },
};

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
const timeAgo = (date) => {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60)  return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff/60)}m`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h`;
  return `${Math.floor(diff/86400)}j`;
};

const initials = (name) => name ? name.slice(0,2).toUpperCase() : '??';

const MEDIA_TYPES = [
  { value:'none',  icon:'📝', label:'Texte' },
  { value:'image', icon:'🖼️', label:'Image' },
  { value:'video', icon:'🎬', label:'Vidéo' },
  { value:'audio', icon:'🎵', label:'Audio' },
];

const STATUS_OPTS = [
  { value:'public',  icon:'🌍', label:'Public' },
  { value:'friends', icon:'👥', label:'Amis' },
  { value:'private', icon:'🔒', label:'Privé' },
];

// ─────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────
const MOCK_POSTS = [
  {
    id:1, user_id:2, content:"Multiwave est enfin là ! 🎉 La plateforme qui connecte le monde entier. Rejoignez-nous et explorez tout ce qu'elle a à offrir — feed, jobs, dating, marketplace et bien plus.",
    media:null, media_type:'none', status:'public', likes_count:48, comments_count:7,
    created_at:'2026-03-13T10:00:00Z', is_liked:false,
    author:{ username:'sarah_dz', avatar:null },
    comments:[]
  },
  {
    id:2, user_id:3, content:"Nouveau projet React sorti 🚀 Architecture clean avec Node.js + Sequelize. Si vous cherchez un dev senior remote, je suis disponible !",
    media:'https://picsum.photos/seed/code1/600/300', media_type:'image', status:'public', likes_count:31, comments_count:4,
    created_at:'2026-03-13T08:30:00Z', is_liked:true,
    author:{ username:'dev_karim', avatar:null },
    comments:[]
  },
  {
    id:3, user_id:4, content:"Le marché de l'IA au Maroc explose 📊 +240% d'offres d'emploi en tech cette année. C'est le moment de se former et d'investir dans les compétences numériques.",
    media:null, media_type:'none', status:'public', likes_count:112, comments_count:19,
    created_at:'2026-03-12T20:00:00Z', is_liked:false,
    author:{ username:'tech_maroc', avatar:null },
    comments:[]
  },
  {
    id:4, user_id:5, content:"🎵 Nouvelle mixtape disponible sur le feed Multiwave. Son fusion entre chaabi et électro — une première dans la scène maghrébine !",
    media:null, media_type:'audio', status:'public', likes_count:67, comments_count:11,
    created_at:'2026-03-12T15:00:00Z', is_liked:false,
    author:{ username:'dj_atlas', avatar:null },
    comments:[]
  },
];

const MOCK_SUGGESTIONS = [
  { id:10, username:'laila_design',  followers_count:1240, following_count:320, posts_count:48,  is_followed:false, is_verified:true,  location:'Casablanca', bio:'Designer UI/UX 🎨' },
  { id:11, username:'startup_ma',    followers_count:3800, following_count:210, posts_count:124, is_followed:false, is_verified:true,  location:'Rabat',       bio:'Fintech & Innovation 💼' },
  { id:12, username:'codewithamir',  followers_count:920,  following_count:180, posts_count:67,  is_followed:true,  is_verified:false, location:'Paris',       bio:'Full Stack Dev 👨‍💻' },
  { id:13, username:'tech_maroc',    followers_count:5600, following_count:430, posts_count:210, is_followed:false, is_verified:true,  location:'Casablanca', bio:'Tech & Startup 🚀' },
  { id:14, username:'dj_atlas',      followers_count:2100, following_count:89,  posts_count:34,  is_followed:false, is_verified:false, location:'Marrakech',  bio:'Musique & Culture 🎵' },
];

// ─────────────────────────────────────────────
// COMPOSER — Créer un post
// ─────────────────────────────────────────────
function PostComposer({ userId, onPost }) {
  const { t } = useTranslation();
  const [content, setContent]     = useState('');
  const [mediaUrl, setMediaUrl]   = useState('');
  const [mediaType, setMediaType] = useState('none');
  const [status, setStatus]       = useState('public');
  const [loading, setLoading]     = useState(false);
  const [expanded, setExpanded]   = useState(false);
  const textRef = useRef(null);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setLoading(true);
    try {
      const payload = { user_id: userId, content, media: mediaUrl||null, media_type: mediaType, status };
      const res = await api.post('/feed/posts', payload);
      onPost && onPost(res.data?.data || res.data || { ...payload, id:Date.now(), created_at:new Date().toISOString(), likes_count:0, comments_count:0, author:{ username:'Moi' }, comments:[] });
      setContent(''); setMediaUrl(''); setMediaType('none'); setExpanded(false);
    } catch {
      onPost && onPost({ user_id:userId, content, media:mediaUrl||null, media_type:mediaType, status, id:Date.now(), created_at:new Date().toISOString(), likes_count:0, comments_count:0, author:{ username:'Moi' }, comments:[] });
      setContent(''); setMediaUrl(''); setMediaType('none'); setExpanded(false);
    } finally { setLoading(false); }
  };

  return (
    <div style={{ ...S.card, padding:18 }}>
      <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
        <div style={S.avatar}>{initials('Moi')}</div>
        <div style={{ flex:1 }}>
          <textarea
            ref={textRef}
            style={{ ...S.input, minHeight: expanded ? 100 : 44, lineHeight:1.6 }}
            placeholder={t("composer_placeholder")}
            value={content}
            onChange={e => setContent(e.target.value)}
            onFocus={() => setExpanded(true)}
          />

          {expanded && (
            <div style={{ marginTop:12, display:'flex', flexDirection:'column', gap:10 }}>

              {/* Media URL */}
              <input
                style={{ ...S.input, fontSize:12 }}
                placeholder="🔗 URL média (optionnel)"
                value={mediaUrl}
                onChange={e => setMediaUrl(e.target.value)}
              />

              {/* Options row */}
              <div style={{ display:'flex', gap:8, flexWrap:'wrap', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ display:'flex', gap:6 }}>
                  {MEDIA_TYPES.map(t => (
                    <button key={t.value} onClick={() => setMediaType(t.value)} style={{
                      background: mediaType===t.value ? 'rgba(201,168,76,0.15)' : 'transparent',
                      border: `1px solid ${mediaType===t.value ? '#C9A84C' : '#1e1e2e'}`,
                      color: mediaType===t.value ? '#C9A84C' : '#64748b',
                      padding:'4px 10px', borderRadius:20, cursor:'pointer', fontSize:11, fontWeight:600
                    }}>{t.icon} {t.label}</button>
                  ))}
                </div>
                <div style={{ display:'flex', gap:6 }}>
                  {STATUS_OPTS.map(o => (
                    <button key={o.value} onClick={() => setStatus(o.value)} style={{
                      background: status===o.value ? 'rgba(14,165,233,0.1)' : 'transparent',
                      border: `1px solid ${status===o.value ? '#0ea5e9' : '#1e1e2e'}`,
                      color: status===o.value ? '#0ea5e9' : '#64748b',
                      padding:'4px 10px', borderRadius:20, cursor:'pointer', fontSize:11, fontWeight:600
                    }}>{o.icon} {o.label}</button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
                <button onClick={() => { setExpanded(false); setContent(''); }} style={{
                  background:'transparent', border:'1px solid #1e1e2e', color:'#64748b',
                  padding:'8px 18px', borderRadius:8, cursor:'pointer', fontSize:13
                }}>{t('cancel')}</button>
                <button onClick={handleSubmit} disabled={!content.trim() || loading} style={{
                  background: content.trim() ? 'linear-gradient(135deg,#C9A84C,#F5D87A)' : '#1e1e2e',
                  color: content.trim() ? '#1a1200' : '#475569',
                  border:'none', padding:'8px 22px', borderRadius:8, cursor: content.trim()?'pointer':'default',
                  fontSize:13, fontWeight:700, transition:'all 0.2s'
                }}>{loading ? '...' : '✦ ' + t('publish')}</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MEDIA RENDERER
// ─────────────────────────────────────────────
function MediaBlock({ url, type }) {
  if (!url || type === 'none') return null;
  if (type === 'image') return (
    <div style={{ margin:'0 -0px', overflow:'hidden', borderRadius:'0 0 0 0', maxHeight:360 }}>
      <img src={url} alt="" style={{ width:'100%', objectFit:'cover', maxHeight:360, display:'block' }}
        onError={e => e.target.style.display='none'}/>
    </div>
  );
  if (type === 'video') return (
    <div style={{ background:'#0a0a0f', padding:'12px 18px' }}>
      <video src={url} controls style={{ width:'100%', borderRadius:8, maxHeight:300 }}/>
    </div>
  );
  if (type === 'audio') return (
    <div style={{ background:'#0a0a0f', padding:'12px 18px', display:'flex', alignItems:'center', gap:12 }}>
      <span style={{ fontSize:28 }}>🎵</span>
      <audio src={url} controls style={{ flex:1 }}/>
    </div>
  );
  return null;
}

// ─────────────────────────────────────────────
// COMMENTS SECTION
// ─────────────────────────────────────────────
function CommentsSection({ postId, userId, visible }) {
  const [comments, setComments] = useState([]);
  const [text, setText]         = useState('');
  const [loading, setLoading]   = useState(false);
  const [loaded, setLoaded]     = useState(false);

  useEffect(() => {
    if (visible && !loaded) loadComments();
  }, [visible]);

  const loadComments = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/feed/posts/${postId}/comments`);
      setComments(res.data?.data || res.data || []);
    } catch {
      setComments([
        { id:1, user_id:2, content:'Super post ! 🙌', likes_count:3, created_at:'2026-03-13T10:05:00Z', author:{ username:'laila_dz' } },
        { id:2, user_id:3, content:'Totalement d\'accord avec toi.', likes_count:1, created_at:'2026-03-13T10:10:00Z', author:{ username:'dev_karim' } },
      ]);
    } finally { setLoading(false); setLoaded(true); }
  };

  const handleComment = async () => {
    if (!text.trim()) return;
    const newComment = { id:Date.now(), user_id:userId, content:text, likes_count:0, created_at:new Date().toISOString(), author:{ username:'Moi' } };
    try { await api.post(`/feed/posts/${postId}/comments`, { user_id:userId, post_id:postId, content:text }); } catch {}
    setComments(p => [...p, newComment]);
    setText('');
  };

  if (!visible) return null;

  return (
    <div style={{ borderTop:'1px solid #1e1e2e', padding:'14px 18px', display:'flex', flexDirection:'column', gap:12 }}>
      {loading && <div style={{ color:'#475569', fontSize:12 }}>Chargement...</div>}
      {comments.map(c => (
        <div key={c.id} style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
          <div style={S.avatarSm}>{initials(c.author?.username||'?')}</div>
          <div style={{ flex:1, background:'#0a0a0f', borderRadius:10, padding:'8px 12px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
              <span style={{ color:'#C9A84C', fontSize:12, fontWeight:700 }}>{c.author?.username}</span>
              <span style={{ color:'#334155', fontSize:11 }}>{timeAgo(c.created_at)}</span>
            </div>
            <div style={{ color:'#cbd5e1', fontSize:13, lineHeight:1.5 }}>{c.content}</div>
            {c.likes_count > 0 && <div style={{ color:'#475569', fontSize:11, marginTop:4 }}>❤️ {c.likes_count}</div>}
          </div>
        </div>
      ))}

      {/* Nouveau commentaire */}
      <div style={{ display:'flex', gap:10, alignItems:'center' }}>
        <div style={S.avatarSm}>{initials('Moi')}</div>
        <input
          style={{ ...S.input, flex:1, padding:'8px 12px', fontSize:12 }}
          placeholder="Écrire un commentaire..."
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key==='Enter' && handleComment()}
        />
        <button onClick={handleComment} style={{
          background: text.trim() ? 'linear-gradient(135deg,#C9A84C,#F5D87A)' : '#1e1e2e',
          color: text.trim() ? '#1a1200' : '#475569',
          border:'none', padding:'8px 14px', borderRadius:8, cursor:'pointer', fontSize:12, fontWeight:700
        }}>↩</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// POST CARD
// ─────────────────────────────────────────────
function PostCard({ post, userId, onLike, onDelete }) {
  const { t } = useTranslation();
  const [showComments, setShowComments] = useState(false);
  const [liked,        setLiked]        = useState(post.is_liked || false);
  const [likesCount,   setLikesCount]   = useState(post.likes_count || 0);
  const [commentsCount,setCommentsCount]= useState(post.comments_count || 0);
  const [showMenu,     setShowMenu]     = useState(false);

  const handleLike = async () => {
    const next = !liked;
    setLiked(next);
    setLikesCount(c => next ? c+1 : Math.max(0,c-1));
    try { await api.post(`/feed/posts/${post.id}/like`, { user_id: userId }); } catch {}
    onLike && onLike(post.id, next);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href + '?post=' + post.id);
  };

  const statusStyle = {
    public:  { color:'#4ade80', icon:'🌍' },
    friends: { color:'#60a5fa', icon:'👥' },
    private: { color:'#f87171', icon:'🔒' },
  }[post.status] || { color:'#64748b', icon:'🌍' };

  return (
    <div style={S.card}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'16px 18px 12px' }}>
        <div style={S.avatar}>{initials(post.author?.username||'?')}</div>
        <div style={{ flex:1 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
            <span style={{ color:'#e2e8f0', fontWeight:700, fontSize:14 }}>{post.author?.username || 'Utilisateur'}</span>
            {post.brand && <span style={S.badge}>🏷️ {post.brand.name}</span>}
            <span style={{ color: statusStyle.color, fontSize:11 }}>{statusStyle.icon}</span>
          </div>
          <div style={{ color:'#334155', fontSize:11, marginTop:2 }}>{timeAgo(post.created_at)}</div>
        </div>
        {/* Menu */}
        <div style={{ position:'relative' }}>
          <button onClick={() => setShowMenu(m=>!m)} style={{ ...S.btn, padding:'4px 8px', fontSize:16, color:'#334155' }}>⋯</button>
          {showMenu && (
            <div style={{ position:'absolute', right:0, top:28, background:'#13131a', border:'1px solid #1e1e2e', borderRadius:10, zIndex:10, minWidth:140, overflow:'hidden', boxShadow:'0 8px 24px rgba(0,0,0,0.4)' }}>
              {[
                { icon:'🔗', label:'Copier le lien', action: handleShare },
                { icon:'🚩', label:'Signaler',        action: () => {} },
                ...(post.user_id === userId ? [{ icon:'🗑️', label:'Supprimer', action: () => onDelete && onDelete(post.id) }] : []),
              ].map((m,i) => (
                <button key={i} onClick={() => { m.action(); setShowMenu(false); }} style={{
                  width:'100%', display:'flex', alignItems:'center', gap:8, padding:'9px 14px',
                  background:'transparent', border:'none', color:'#94a3b8', cursor:'pointer', fontSize:13, textAlign:'left'
                }}>{m.icon} {m.label}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding:'0 18px 14px', color:'#cbd5e1', fontSize:14, lineHeight:1.7, whiteSpace:'pre-wrap' }}>
        {post.content}
      </div>

      {/* Media */}
      <MediaBlock url={post.media} type={post.media_type}/>

      {/* Stats bar */}
      <div style={{ display:'flex', justifyContent:'space-between', padding:'8px 18px', borderTop:'1px solid #1e1e2e', borderBottom: showComments ? 'none' : '1px solid #1e1e2e' }}>
        <span style={{ color:'#334155', fontSize:12 }}>
          {likesCount > 0 && `❤️ ${likesCount}`}
          {likesCount > 0 && commentsCount > 0 && '  '}
          {commentsCount > 0 && `💬 ${commentsCount} commentaires`}
        </span>
      </div>

      {/* Action buttons */}
      <div style={{ display:'flex', padding:'4px 8px' }}>
        <button onClick={handleLike} style={{ ...S.btn, flex:1, justifyContent:'center', ...(liked ? S.btnActive : {}) }}>
          <span style={{ fontSize:16 }}>{liked ? '❤️' : '🤍'}</span>
          <span style={{ fontSize:13 }}>{t('like')}</span>
        </button>
        <button onClick={() => setShowComments(c => !c)} style={{ ...S.btn, flex:1, justifyContent:'center', ...(showComments ? { color:'#60a5fa', background:'rgba(96,165,250,0.08)' } : {}) }}>
          <span style={{ fontSize:16 }}>💬</span>
          <span style={{ fontSize:13 }}>{t('comment')}</span>
        </button>
        <button onClick={handleShare} style={{ ...S.btn, flex:1, justifyContent:'center' }}>
          <span style={{ fontSize:16 }}>↗️</span>
          <span style={{ fontSize:13 }}>{t('share')}</span>
        </button>
      </div>

      {/* Comments */}
      <CommentsSection postId={post.id} userId={userId} visible={showComments}/>
    </div>
  );
}

// ─────────────────────────────────────────────
// SUGGESTIONS (qui suivre) — basé sur Followers
// ─────────────────────────────────────────────
function SuggestionsPanel({ userId }) {
  const { t } = useTranslation();
  const [suggestions, setSuggestions] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [showAll,     setShowAll]     = useState(false);

  useEffect(() => { loadSuggestions(); }, [userId]);

  const loadSuggestions = async () => {
    setLoading(true);
    try {
      // Récupère les suggestions basées sur les followers mutuels
      const res = await api.get(`/followers/suggestions?user_id=${userId}&limit=10`);
      setSuggestions(res.data?.data || res.data || []);
    } catch {
      setSuggestions(MOCK_SUGGESTIONS);
    } finally { setLoading(false); }
  };

  const toggleFollow = async (id) => {
    setSuggestions(p => p.map(s => s.id===id ? {
      ...s,
      is_followed: !s.is_followed,
      followers_count: s.is_followed ? s.followers_count-1 : s.followers_count+1
    } : s));
    try {
      const user = suggestions.find(s => s.id === id);
      if (user?.is_followed) {
        await api.delete(`/followers`, { data:{ follower_id:userId, followed_id:id } });
      } else {
        await api.post(`/followers`, { follower_id:userId, followed_id:id, status:'accepted' });
      }
    } catch {}
  };

  const fmtFollowers = (n) => {
    if (n >= 1000) return (n/1000).toFixed(1) + 'k';
    return n?.toString() || '0';
  };

  const visible = showAll ? suggestions : suggestions.slice(0, 3);

  return (
    <div style={{ ...S.card, padding:16 }}>
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
        <span style={{ color:'#64748b', fontSize:11, fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase' }}>
          👥 Suggestions
        </span>
        <button onClick={loadSuggestions} style={{ background:'none', border:'none', color:'#475569', cursor:'pointer', fontSize:12 }}>↺</button>
      </div>

      {loading ? (
        <div style={{ color:'#475569', fontSize:12, textAlign:'center', padding:16 }}>Chargement...</div>
      ) : (
        <>
          {visible.map(s => (
            <div key={s.id} style={{ display:'flex', alignItems:'flex-start', gap:10, marginBottom:14 }}>
              {/* Avatar */}
              <div style={{ position:'relative', flexShrink:0 }}>
                <div style={S.avatar}>{initials(s.username)}</div>
                {s.is_verified && (
                  <div style={{ position:'absolute', bottom:-2, right:-2, fontSize:10 }}>✅</div>
                )}
              </div>

              {/* Infos */}
              <div style={{ flex:1, overflow:'hidden', minWidth:0 }}>
                <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                  <span style={{ color:'#e2e8f0', fontSize:13, fontWeight:600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{s.username}</span>
                </div>
                {s.bio && (
                  <div style={{ color:'#475569', fontSize:11, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{s.bio}</div>
                )}
                <div style={{ display:'flex', gap:8, marginTop:2 }}>
                  <span style={{ color:'#334155', fontSize:10 }}>👥 {fmtFollowers(s.followers_count)}</span>
                  {s.location && <span style={{ color:'#334155', fontSize:10 }}>📍 {s.location}</span>}
                </div>
              </div>

              {/* Bouton follow */}
              <button onClick={() => toggleFollow(s.id)} style={{
                background: s.is_followed ? 'rgba(74,222,128,0.1)' : 'rgba(201,168,76,0.12)',
                border: `1px solid ${s.is_followed ? '#4ade80' : '#C9A84C'}`,
                color: s.is_followed ? '#4ade80' : '#C9A84C',
                padding:'5px 10px', borderRadius:20, cursor:'pointer', fontSize:11,
                fontWeight:700, flexShrink:0, whiteSpace:'nowrap',
              }}>
                {s.is_followed ? '✓ ' + t('followed') : '+ ' + t('follow')}
              </button>
            </div>
          ))}

          {/* Voir plus / moins */}
          {suggestions.length > 3 && (
            <button onClick={() => setShowAll(v=>!v)} style={{
              width:'100%', background:'transparent', border:'1px solid #1e1e2e',
              color:'#64748b', padding:'6px', borderRadius:8, cursor:'pointer', fontSize:12,
            }}>
              {showAll ? '↑ Réduire' : `↓ Voir ${suggestions.length - 3} de plus`}
            </button>
          )}
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// FILTRES
// ─────────────────────────────────────────────
const FILTERS = (t) => [
  { key:'all',       label:'🌍 ' + t('all') },
  { key:'following', label:'👥 ' + t('following') },
  { key:'trending',  label:'🔥 ' + t('trending') },
  { key:'media',     label:'🖼️ ' + t('media_filter') },
];

// ─────────────────────────────────────────────
// FEED PRINCIPAL
// ─────────────────────────────────────────────
export default function Feed({ userId }) {
  const { t, lang } = useTranslation();
  const [posts,   setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState('all');
  const [page,    setPage]    = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => { loadPosts(true); }, [filter]);

  const loadPosts = async (reset = false) => {
    setLoading(true);
    const currentPage = reset ? 1 : page;
    try {
      const res = await api.get(`/feed/posts?page=${currentPage}&filter=${filter}`);
      const data = res.data?.data || res.data || [];
      setPosts(reset ? data : p => [...p, ...data]);
      setHasMore(data.length >= 10);
      if (!reset) setPage(p => p+1);
    } catch {
      setPosts(MOCK_POSTS);
      setHasMore(false);
    } finally { setLoading(false); }
    if (reset) setPage(2);
  };

  const handlePost = (newPost) => {
    setPosts(p => [newPost, ...p]);
  };

  const handleDelete = async (postId) => {
    setPosts(p => p.filter(x => x.id !== postId));
    try { await api.delete(`/feed/posts/${postId}`); } catch {}
  };

  const handleLike = (postId, liked) => {};

  const filtered = filter === 'media'
    ? posts.filter(p => p.media_type !== 'none')
    : posts;

  return (
    <div style={{ display:'flex', gap:20, alignItems:'flex-start' }}>

      {/* ── Colonne principale ── */}
      <div style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column', gap:14 }}>

        {/* Filtres */}
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          {FILTERS(t).map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)} style={{
              background: filter===f.key ? 'rgba(201,168,76,0.12)' : 'transparent',
              border: `1px solid ${filter===f.key ? '#C9A84C' : '#1e1e2e'}`,
              color: filter===f.key ? '#C9A84C' : '#64748b',
              padding:'6px 16px', borderRadius:20, cursor:'pointer', fontSize:12, fontWeight:600
            }}>{f.label}</button>
          ))}
        </div>

        {/* Composer */}
        <PostComposer userId={userId} onPost={handlePost}/>

        {/* Posts */}
        {loading && posts.length === 0 ? (
          <div style={S.spinner}>Chargement du feed...</div>
        ) : filtered.length === 0 ? (
          <div style={S.empty}>
            <div style={{ fontSize:48, marginBottom:12 }}>🌊</div>
            <div style={{ color:'#e2e8f0', fontSize:16, fontWeight:600, marginBottom:6 }}>{t('no_posts')}</div>
            <div style={{ color:'#475569', fontSize:13 }}>{t('be_first')}</div>
          </div>
        ) : (
          <>
            {filtered.map(post => (
              <PostCard
                key={post.id}
                post={post}
                userId={userId}
                onLike={handleLike}
                onDelete={handleDelete}
              />
            ))}
            {hasMore && (
              <button onClick={() => loadPosts(false)} style={{
                background:'transparent', border:'1px solid #1e1e2e', color:'#64748b',
                padding:'10px', borderRadius:10, cursor:'pointer', fontSize:13, width:'100%'
              }}>
                {loading ? t('loading') : '↓ ' + t('load_more')}
              </button>
            )}
          </>
        )}
      </div>

      {/* ── Colonne latérale ── */}
      <div style={{ width:260, flexShrink:0, display:'flex', flexDirection:'column', gap:14 }}>
        <SuggestionsPanel userId={userId}/>

        {/* Stats rapides */}
        <div style={{ ...S.card, padding:16 }}>
          <div style={{ color:'#64748b', fontSize:11, fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', marginBottom:12 }}>
            {t('activity')}
          </div>
          {[
            { icon:'📝', label:t('posts_published'), val: posts.filter(p=>p.user_id===userId).length },
            { icon:'❤️', label:t('likes_received'),  val: posts.reduce((a,p)=>a+(p.likes_count||0),0) },
            { icon:'💬', label:t('comments'),  val: posts.reduce((a,p)=>a+(p.comments_count||0),0) },
          ].map((stat,i) => (
            <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
              <span style={{ color:'#64748b', fontSize:13 }}>{stat.icon} {stat.label}</span>
              <span style={{ color:'#C9A84C', fontWeight:700, fontSize:14 }}>{stat.val}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}