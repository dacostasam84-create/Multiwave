// ─────────────────────────────────────────────
// Channels.jsx — Multiwave Channels
// Auteur : Zahnouni Issam
// ─────────────────────────────────────────────
import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { useTranslation } from '../i18n';

// ─────────────────────────────────────────────
// CONSTANTES
// ─────────────────────────────────────────────
const CHANNEL_TYPES = [
  { value: 'broadcast', label: '📢 Broadcast', desc: 'Diffusion unilatérale' },
  { value: 'ai',        label: '🤖 IA',        desc: 'Contenu généré par IA' },
  { value: 'debate',    label: '⚔️ Débat',     desc: 'Discussions ouvertes' },
  { value: 'news',      label: '📰 News',      desc: 'Actualités en direct' },
  { value: 'music',     label: '🎵 Musique',   desc: 'Playlists & sons' },
  { value: 'sport',     label: '⚽ Sport',     desc: 'Scores & analyses' },
  { value: 'business',  label: '💼 Business',  desc: 'Finance & startup' },
  { value: 'education', label: '🎓 Education', desc: 'Cours & tutoriels' },
];

const TYPE_COLORS = {
  broadcast: { bg:'rgba(0,229,255,0.1)',   border:'#00e5ff', color:'#00e5ff' },
  ai:        { bg:'rgba(167,139,250,0.1)', border:'#a78bfa', color:'#a78bfa' },
  debate:    { bg:'rgba(251,146,60,0.1)',  border:'#fb923c', color:'#fb923c' },
  news:      { bg:'rgba(74,222,128,0.1)',  border:'#4ade80', color:'#4ade80' },
  music:     { bg:'rgba(248,113,113,0.1)', border:'#f87171', color:'#f87171' },
  sport:     { bg:'rgba(251,191,36,0.1)',  border:'#fbbf24', color:'#fbbf24' },
  business:  { bg:'rgba(201,168,76,0.1)',  border:'#C9A84C', color:'#C9A84C' },
  education: { bg:'rgba(14,165,233,0.1)',  border:'#0ea5e9', color:'#0ea5e9' },
};

const LANGUAGES = ['FR','AR','EN','ES','DE','PT','TR','ZH','JA','RU','IT','NL'];

const REGIONS = ['Monde','Maroc','Algérie','Tunisie','France','Europe','Moyen-Orient','Afrique','Asie','Amériques'];

const SORT_OPTIONS = (t) => [
  { value:'popular',  label:'🔥 ' + t('popular') },
  { value:'newest',   label:'✨ ' + t('newest')  },
  { value:'active',   label:'⚡ ' + t('active')  },
  { value:'verified', label:'✅ ' + t('verified') },
];

// ─────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────
const MOCK_CHANNELS = [
  { id:1,  name:'Multiwave Officiel',    description:'Actualités et mises à jour officielles de Multiwave. Restez informés des nouvelles fonctionnalités.', type:'broadcast', subscribers_count:124000, is_verified:true,  ai_moderation:true,  status:'active', owner_id:1, language:'FR', region:'Monde',       posts_count:342,  cover_url:'https://picsum.photos/seed/ch1/600/200' },
  { id:2,  name:'AI News Daily',         description:'Les dernières nouvelles sur l\'intelligence artificielle. Analyses, recherches et innovations chaque jour.', type:'ai', subscribers_count:48000, is_verified:true, ai_moderation:true, status:'active', owner_id:2, language:'FR', region:'Monde',       posts_count:1240, cover_url:'https://picsum.photos/seed/ch2/600/200' },
  { id:3,  name:'Grand Débat Politique', description:'Discussions libres et modérées sur l\'actualité politique mondiale. Toutes les opinions respectées.',  type:'debate',    subscribers_count:32000, is_verified:false, ai_moderation:true,  status:'active', owner_id:3, language:'FR', region:'France',      posts_count:890,  cover_url:'https://picsum.photos/seed/ch3/600/200' },
  { id:4,  name:'Tech Maroc News',       description:'Toute l\'actualité tech du Maroc et du Maghreb. Startups, innovation et numérique.',                   type:'news',      subscribers_count:21000, is_verified:true,  ai_moderation:false, status:'active', owner_id:4, language:'FR', region:'Maroc',       posts_count:567,  cover_url:'https://picsum.photos/seed/ch4/600/200' },
  { id:5,  name:'Crypto & Finance',      description:'Analyses, signaux et actualités crypto en temps réel. Bitcoin, Ethereum et altcoins.',                 type:'business',  subscribers_count:89000, is_verified:false, ai_moderation:true,  status:'active', owner_id:5, language:'FR', region:'Monde',       posts_count:2100, cover_url:'https://picsum.photos/seed/ch5/600/200' },
  { id:6,  name:'Débat Science',         description:'Échanges scientifiques rigoureux et accessibles à tous. Physique, biologie, astronomie.',              type:'debate',    subscribers_count:15000, is_verified:false, ai_moderation:true,  status:'active', owner_id:6, language:'FR', region:'Europe',      posts_count:430,  cover_url:'https://picsum.photos/seed/ch6/600/200' },
  { id:7,  name:'Arabic News Network',   description:'أحدث الأخبار العربية والدولية. تغطية شاملة لأهم الأحداث.',                                           type:'news',      subscribers_count:56000, is_verified:true,  ai_moderation:true,  status:'active', owner_id:7, language:'AR', region:'Moyen-Orient', posts_count:1800, cover_url:'https://picsum.photos/seed/ch7/600/200' },
  { id:8,  name:'Music Vibes World',     description:'Les meilleures playlists du monde. Découvrez de nouveaux artistes chaque jour.',                       type:'music',     subscribers_count:73000, is_verified:true,  ai_moderation:false, status:'active', owner_id:8, language:'EN', region:'Monde',       posts_count:980,  cover_url:'https://picsum.photos/seed/ch8/600/200' },
  { id:9,  name:'Champions League Live', description:'Toute l\'actualité du foot européen. Scores live, analyses et transferts.',                            type:'sport',     subscribers_count:210000,is_verified:true,  ai_moderation:true,  status:'active', owner_id:9, language:'FR', region:'Europe',      posts_count:3200, cover_url:'https://picsum.photos/seed/ch9/600/200' },
  { id:10, name:'React & JavaScript',    description:'Tutoriels, tips et best practices React, Node.js et l\'écosystème JS moderne.',                        type:'education', subscribers_count:44000, is_verified:false, ai_moderation:false, status:'active', owner_id:10,language:'FR', region:'Monde',       posts_count:760,  cover_url:'https://picsum.photos/seed/ch10/600/200' },
  { id:11, name:'Startup Maghreb',       description:'L\'écosystème startup du Maghreb. Levées de fonds, success stories et opportunités.',                  type:'business',  subscribers_count:18000, is_verified:true,  ai_moderation:true,  status:'active', owner_id:11,language:'FR', region:'Maroc',       posts_count:320,  cover_url:'https://picsum.photos/seed/ch11/600/200' },
  { id:12, name:'Musique Amazigh',       description:'La richesse musicale amazighe. Artistes, concerts et patrimoine culturel.',                            type:'music',     subscribers_count:9800,  is_verified:false, ai_moderation:false, status:'active', owner_id:12,language:'AR', region:'Maroc',       posts_count:210,  cover_url:'https://picsum.photos/seed/ch12/600/200' },
];

const MOCK_POSTS = [
  { id:1, channel_id:1, content:'🚀 Multiwave v2.0 est disponible ! Feed social, messagerie améliorée, WhatsApp Ultra et bien plus encore. Découvrez toutes les nouveautés !', media_url:null, views_count:8400, likes_count:1240, created_at:'2026-03-13T10:00:00Z' },
  { id:2, channel_id:1, content:'📢 Maintenance programmée ce dimanche de 02h00 à 04h00 (GMT+1). Les services seront temporairement indisponibles.', media_url:null, views_count:3200, likes_count:180, created_at:'2026-03-12T18:00:00Z' },
  { id:3, channel_id:2, content:'🤖 GPT-5 annoncé pour Q2 2026. OpenAI promet des capacités de raisonnement 10x supérieures au modèle actuel. Révolution en vue ?', media_url:'https://picsum.photos/seed/p3/600/300', views_count:12000, likes_count:2100, created_at:'2026-03-13T09:00:00Z' },
];

// ─────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────
const S = {
  container:   { display:'flex', flexDirection:'column', gap:18 },
  card:        { background:'#13131a', border:'1px solid #1e1e2e', borderRadius:14, overflow:'hidden', transition:'border-color 0.15s, transform 0.15s' },
  input:       { background:'#0a0a0f', border:'1px solid #1e1e2e', color:'#e2e8f0', padding:'10px 14px', borderRadius:8, fontSize:13, width:'100%', boxSizing:'border-box', outline:'none' },
  label:       { color:'#64748b', fontSize:12, marginBottom:4, display:'block' },
  filterBtn:   { background:'transparent', border:'1px solid #1e1e2e', color:'#64748b', padding:'5px 14px', borderRadius:20, cursor:'pointer', fontSize:12, fontWeight:600 },
  filterActive:{ background:'rgba(201,168,76,0.12)', border:'1px solid #C9A84C', color:'#C9A84C' },
  saveBtn:     { background:'linear-gradient(135deg,#C9A84C,#F5D87A)', color:'#1a1200', border:'none', padding:'10px 24px', borderRadius:8, fontWeight:700, cursor:'pointer', fontSize:13 },
  cancelBtn:   { background:'transparent', border:'1px solid #1e1e2e', color:'#64748b', padding:'10px 20px', borderRadius:8, cursor:'pointer', fontSize:13 },
  badge:       { padding:'2px 8px', borderRadius:20, fontSize:10, fontWeight:700 },
  empty:       { color:'#475569', textAlign:'center', padding:'48px 24px', fontSize:14 },
};

const fmtCount = (n) => {
  if (n >= 1000000) return (n/1000000).toFixed(1) + 'M';
  if (n >= 1000)    return (n/1000).toFixed(1) + 'k';
  return n?.toString() || '0';
};

const timeAgo = (d) => {
  if (!d) return '';
  const diff = Math.floor((Date.now() - new Date(d)) / 1000);
  if (diff < 60)   return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff/60)}m`;
  if (diff < 86400)return `${Math.floor(diff/3600)}h`;
  return `${Math.floor(diff/86400)}j`;
};

// ─────────────────────────────────────────────
// CHANNEL CARD
// ─────────────────────────────────────────────
function ChannelCard({ channel, isJoined, onJoin, onLeave, onOpen, t = (k)=>k }) {
  const tc = TYPE_COLORS[channel.type] || TYPE_COLORS.broadcast;
  const ct = CHANNEL_TYPES.find(t => t.value === channel.type);

  return (
    <div
      style={{ ...S.card, cursor:'pointer' }}
      onClick={() => onOpen(channel)}
      onMouseEnter={e => { e.currentTarget.style.borderColor = tc.border + '60'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e1e2e'; e.currentTarget.style.transform = 'none'; }}
    >
      {/* Cover */}
      <div style={{ height:90, overflow:'hidden', background:'#0a0a0f', position:'relative' }}>
        {channel.cover_url
          ? <img src={channel.cover_url} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.6 }} onError={e=>e.target.style.display='none'}/>
          : <div style={{ width:'100%', height:'100%', background:`linear-gradient(135deg,${tc.bg},transparent)` }}/>
        }
        {/* Badges cover */}
        <div style={{ position:'absolute', top:8, left:8, display:'flex', gap:5 }}>
          <span style={{ ...S.badge, background:tc.bg, border:`1px solid ${tc.border}`, color:tc.color }}>
            {ct?.label || channel.type}
          </span>
          {channel.language && (
            <span style={{ ...S.badge, background:'rgba(0,0,0,0.5)', border:'1px solid rgba(255,255,255,0.1)', color:'#94a3b8' }}>
              {channel.language}
            </span>
          )}
        </div>
        {channel.is_verified && (
          <div style={{ position:'absolute', top:8, right:8 }}>
            <span style={{ ...S.badge, background:'rgba(74,222,128,0.2)', border:'1px solid #4ade80', color:'#4ade80' }}>✅ Vérifié</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding:'14px 16px', display:'flex', flexDirection:'column', gap:10 }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:4 }}>
            <span style={{ color:'#e2e8f0', fontWeight:700, fontSize:14 }}>{channel.name}</span>
            {channel.ai_moderation && <span style={{ fontSize:12 }}>🤖</span>}
          </div>
          <div style={{ color:'#64748b', fontSize:12, lineHeight:1.5 }}>
            {channel.description?.substring(0,80)}{channel.description?.length > 80 ? '...' : ''}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display:'flex', gap:14, flexWrap:'wrap' }}>
          <span style={{ color:'#475569', fontSize:12 }}>👥 {fmtCount(channel.subscribers_count)}</span>
          {channel.posts_count > 0 && <span style={{ color:'#475569', fontSize:12 }}>📝 {fmtCount(channel.posts_count)}</span>}
          {channel.region && <span style={{ color:'#475569', fontSize:12 }}>📍 {channel.region}</span>}
        </div>

        {/* Bouton */}
        <button
          onClick={e => { e.stopPropagation(); isJoined ? onLeave(channel.id) : onJoin(channel.id); }}
          style={{
            width:'100%', padding:'8px', borderRadius:8, cursor:'pointer', fontWeight:700, fontSize:13,
            background: isJoined ? 'rgba(74,222,128,0.1)' : tc.bg,
            border: `1px solid ${isJoined ? '#4ade80' : tc.border}`,
            color: isJoined ? '#4ade80' : tc.color,
          }}
        >
          {isJoined ? t('subscribed') : t('join_channel')}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// CHANNEL DETAIL (vue posts)
// ─────────────────────────────────────────────
function ChannelDetail({ channel, isJoined, onJoin, onLeave, onClose, userId, t = (k)=>k }) {
  const [posts,    setPosts]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [newPost,  setNewPost]  = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [posting,  setPosting]  = useState(false);
  const tc = TYPE_COLORS[channel.type] || TYPE_COLORS.broadcast;
  const isOwner = true; // channel.owner_id === userId;

  useEffect(() => { loadPosts(); }, []);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/channels/${channel.id}/posts`);
      setPosts(res.data?.data || res.data || []);
    } catch {
      setPosts(MOCK_POSTS.filter(p => p.channel_id === channel.id));
    } finally { setLoading(false); }
  };

  const handlePost = async () => {
    if (!newPost.trim()) return;
    setPosting(true);
    const post = { id:Date.now(), channel_id:channel.id, content:newPost, media_url:mediaFile?URL.createObjectURL(mediaFile):null, views_count:0, likes_count:0, created_at:new Date().toISOString() };
    try {
      if (mediaFile) {
        const fd = new FormData();
        fd.append('media', mediaFile);
        fd.append('content', newPost);
        fd.append('user_id', userId);
        await api.post(`/channels/${channel.id}/posts`, fd, { headers:{ 'Content-Type':'multipart/form-data' } });
      } else {
        await api.post(`/channels/${channel.id}/posts`, { content:newPost, user_id:userId });
      }
    } catch {}
    setMediaFile(null);
    setPosts(p => [post, ...p]);
    setNewPost('');
    setPosting(false);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(`${window.location.origin}/channel/${channel.id}`);
  };

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }} onClick={onClose}>
      <div style={{ background:'#0d0d18', border:'1px solid #1e1e2e', borderRadius:16, width:'100%', maxWidth:620, maxHeight:'90vh', overflow:'auto', display:'flex', flexDirection:'column' }} onClick={e=>e.stopPropagation()}>

        {/* Cover */}
        <div style={{ height:140, position:'relative', overflow:'hidden', flexShrink:0 }}>
          {channel.cover_url
            ? <img src={channel.cover_url} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.5 }}/>
            : <div style={{ width:'100%', height:'100%', background:`linear-gradient(135deg,${tc.bg},#0d0d18)` }}/>
          }
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, transparent, #0d0d18)' }}/>
          <button onClick={onClose} style={{ position:'absolute', top:12, right:12, background:'rgba(0,0,0,0.5)', border:'none', color:'#e2e8f0', width:32, height:32, borderRadius:'50%', cursor:'pointer', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
        </div>

        <div style={{ padding:'0 20px 20px', flex:1 }}>
          {/* Infos channel */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14, gap:12, flexWrap:'wrap' }}>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                <h2 style={{ color:'#e2e8f0', fontSize:20, margin:0, fontWeight:700 }}>{channel.name}</h2>
                {channel.is_verified && <span style={{ fontSize:16 }}>✅</span>}
              </div>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                <span style={{ ...S.badge, background:tc.bg, border:`1px solid ${tc.border}`, color:tc.color }}>{channel.type}</span>
                {channel.language && <span style={{ ...S.badge, background:'rgba(255,255,255,0.05)', color:'#64748b' }}>{channel.language}</span>}
                {channel.region && <span style={{ color:'#475569', fontSize:11 }}>📍 {channel.region}</span>}
              </div>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={handleShare} style={{ ...S.filterBtn, padding:'7px 12px' }}>{t('share')}</button>
              <button
                onClick={() => isJoined ? onLeave(channel.id) : onJoin(channel.id)}
                style={{
                  padding:'8px 18px', borderRadius:8, cursor:'pointer', fontWeight:700, fontSize:13,
                  background: isJoined ? 'rgba(74,222,128,0.1)' : `linear-gradient(135deg,${tc.border},${tc.color})`,
                  border: isJoined ? '1px solid #4ade80' : 'none',
                  color: isJoined ? '#4ade80' : '#0d0d18',
                }}
              >{isJoined ? t('subscribed') : t('subscribe')}</button>
            </div>
          </div>

          {channel.description && (
            <div style={{ color:'#94a3b8', fontSize:13, lineHeight:1.6, marginBottom:14 }}>{channel.description}</div>
          )}

          {/* Stats bar */}
          <div style={{ display:'flex', gap:20, padding:'12px 0', borderTop:'1px solid #1e1e2e', borderBottom:'1px solid #1e1e2e', marginBottom:16, flexWrap:'wrap' }}>
            {[
              { icon:'👥', val: fmtCount(channel.subscribers_count), label:t('subscribers') },
              { icon:'📝', val: fmtCount(channel.posts_count||posts.length), label:t('posts') },
              { icon:'🤖', val: channel.ai_moderation ? t('enabled') : t('disabled'), label:t('ai_moderation') },
            ].map((s,i) => (
              <div key={i} style={{ display:'flex', flexDirection:'column', gap:2 }}>
                <span style={{ color:'#e2e8f0', fontWeight:700, fontSize:16 }}>{s.icon} {s.val}</span>
                <span style={{ color:'#475569', fontSize:11 }}>{s.label}</span>
              </div>
            ))}
          </div>

          {/* Publier (owner seulement) */}
          {isOwner && (
            <div style={{ background:'#13131a', border:'1px solid #1e1e2e', borderRadius:10, padding:14, marginBottom:16 }}>
              <div style={{ color:'#64748b', fontSize:12, marginBottom:8 }}>{t('publish_channel')}</div>
              <textarea
                style={{ ...S.input, minHeight:70, resize:'vertical', marginBottom:10 }}
                placeholder={t('write_message')}
                value={newPost}
                onChange={e => setNewPost(e.target.value)}
              />
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div style={{ display:'flex', gap:8 }}>
                  <label style={{ cursor:'pointer', background:'rgba(201,168,76,0.1)', border:'1px solid rgba(201,168,76,0.3)', color:'#C9A84C', padding:'6px 12px', borderRadius:8, fontSize:12, fontWeight:600 }}>
                    🖼️ Image
                    <input type="file" accept="image/*" style={{ display:'none' }} onChange={e => setMediaFile(e.target.files[0])}/>
                  </label>
                  <label style={{ cursor:'pointer', background:'rgba(96,165,250,0.1)', border:'1px solid rgba(96,165,250,0.3)', color:'#60a5fa', padding:'6px 12px', borderRadius:8, fontSize:12, fontWeight:600 }}>
                    🎬 Vidéo
                    <input type="file" accept="video/*" style={{ display:'none' }} onChange={e => setMediaFile(e.target.files[0])}/>
                  </label>
                  {mediaFile && <span style={{ color:'#4ade80', fontSize:11, alignSelf:'center' }}>✅ {mediaFile.name.substring(0,20)}...</span>}
                </div>
                <button onClick={handlePost} disabled={!newPost.trim() || posting} style={{ ...S.saveBtn, opacity: newPost.trim()?1:0.5 }}>
                  {posting ? '...' : t('publish')}
                </button>
              </div>
            </div>
          )}

          {/* Posts */}
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {loading ? (
              <div style={S.empty}>Chargement...</div>
            ) : posts.length === 0 ? (
              <div style={S.empty}>{t('no_posts')}</div>
            ) : (
              posts.map((post, idx) => (
                <React.Fragment key={post.id}>
                  <div style={{ background:'#13131a', border:'1px solid #1e1e2e', borderRadius:10, padding:14 }}>
                    <div style={{ color:'#cbd5e1', fontSize:13, lineHeight:1.7, marginBottom:10 }}>{post.content}</div>
                    {post.media_url && (
                      <img src={post.media_url} alt="" style={{ width:'100%', borderRadius:8, maxHeight:300, objectFit:'cover', marginBottom:10 }} onError={e=>e.target.style.display='none'}/>
                    )}
                    <div style={{ display:'flex', gap:16, alignItems:'center' }}>
                      <span style={{ color:'#334155', fontSize:12 }}>👁 {fmtCount(post.views_count)}</span>
                      <span style={{ color:'#334155', fontSize:12 }}>❤️ {fmtCount(post.likes_count)}</span>
                      <span style={{ color:'#334155', fontSize:12, marginLeft:'auto' }}>{timeAgo(post.created_at)}</span>
                    </div>
                  </div>
                  {(idx + 1) % 3 === 0 && (
                    <div style={{ background:'linear-gradient(135deg,rgba(201,168,76,0.06),rgba(245,216,122,0.03))', border:'1px solid rgba(201,168,76,0.2)', borderRadius:10, padding:14, position:'relative' }}>
                      <div style={{ position:'absolute', top:8, right:10, background:'rgba(201,168,76,0.15)', border:'1px solid rgba(201,168,76,0.3)', color:'#C9A84C', fontSize:9, padding:'2px 6px', borderRadius:4, fontWeight:700, letterSpacing:'0.5px' }}>SPONSORISÉ</div>
                      <div style={{ display:'flex', gap:12, alignItems:'center' }}>
                        <div style={{ width:48, height:48, borderRadius:10, background:'linear-gradient(135deg,#C9A84C,#F5D87A)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>
                          {['👜','👟','📱','⌚','👔'][idx % 5]}
                        </div>
                        <div style={{ flex:1 }}>
                          <div style={{ color:'#e2e8f0', fontWeight:700, fontSize:13, marginBottom:3 }}>
                            {['Louis Vuitton — Nouvelle Collection','Nike Air Max 2026','Apple iPhone 17 Pro','Rolex Submariner','Dior Homme'][idx % 5]}
                          </div>
                          <div style={{ color:'#64748b', fontSize:12 }}>
                            {['Découvrez la collection printemps 2026','Just Do It — Disponible maintenant','Think Different — Précommandez','Luxe & Précision suisse','La nouvelle fragrance masculine'][idx % 5]}
                          </div>
                        </div>
                      </div>
                      <div style={{ marginTop:10, height:100, borderRadius:8, overflow:'hidden', background:'#0a0a0f' }}>
                        <img src={`https://picsum.photos/seed/ad${idx}/600/100`} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.8 }}/>
                      </div>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:10 }}>
                        <span style={{ color:'#475569', fontSize:11 }}>multiwave ads</span>
                        <button style={{ background:'linear-gradient(135deg,#C9A84C,#F5D87A)', color:'#1a1200', border:'none', padding:'5px 14px', borderRadius:6, fontSize:11, fontWeight:700, cursor:'pointer' }}>
                          Voir l'offre →
                        </button>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// CRÉER UN CHANNEL
// ─────────────────────────────────────────────
function CreateChannel({ userId, onCreate, onCancel, t = (k)=>k }) {
  const [form, setForm] = useState({ name:'', description:'', type:'broadcast', language:'FR', region:'Monde', ai_moderation:true, is_public:true });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const handle = async () => {
    if (!form.name.trim()) { setError(t('name_required')); return; }
    setLoading(true);
    try {
      const res = await api.post('/channels', { ...form, owner_id: userId });
      onCreate && onCreate(res.data?.data || res.data);
    } catch(err) {
      // fallback mock
      onCreate && onCreate({ ...form, id:Date.now(), subscribers_count:1, posts_count:0, is_verified:false, owner_id:userId, cover_url:null, created_at:new Date().toISOString() });
    } finally { setLoading(false); }
  };

  const tc = TYPE_COLORS[form.type] || TYPE_COLORS.broadcast;

  return (
    <div style={{ background:'#13131a', border:'1px solid #1e1e2e', borderRadius:14, padding:24 }}>
      <h3 style={{ color:'#e2e8f0', fontSize:17, margin:'0 0 6px', fontWeight:700 }}>{t('create_channel_title')}</h3>
      <p style={{ color:'#475569', fontSize:12, margin:'0 0 20px' }}>{t('channel_desc')}</p>

      {error && <div style={{ background:'rgba(248,113,113,0.1)', border:'1px solid #f87171', color:'#f87171', padding:'9px 14px', borderRadius:8, fontSize:13, marginBottom:16 }}>⚠️ {error}</div>}

      {/* Type selector */}
      <div style={{ marginBottom:16 }}>
        <label style={S.label}>{t('channel_type')}</label>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          {CHANNEL_TYPES.map(t => {
            const ttc = TYPE_COLORS[t.value];
            return (
              <button key={t.value} onClick={() => setForm(f=>({...f,type:t.value}))} style={{
                padding:'8px 14px', borderRadius:10, cursor:'pointer', fontSize:12, fontWeight:600,
                background: form.type===t.value ? ttc.bg : 'transparent',
                border: `1px solid ${form.type===t.value ? ttc.border : '#1e1e2e'}`,
                color: form.type===t.value ? ttc.color : '#64748b',
              }}>{t.label}</button>
            );
          })}
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
        <div style={{ gridColumn:'1/-1' }}>
          <label style={S.label}>{t('channel_name')} *</label>
          <input style={S.input} value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Ex: Tech Maroc Daily"/>
        </div>
        <div>
          <label style={S.label}>{t('language')}</label>
          <select style={S.input} value={form.language} onChange={e=>setForm(f=>({...f,language:e.target.value}))}>
            {LANGUAGES.map(l=><option key={l}>{l}</option>)}
          </select>
        </div>
        <div>
          <label style={S.label}>{t('region')}</label>
          <select style={S.input} value={form.region} onChange={e=>setForm(f=>({...f,region:e.target.value}))}>
            {REGIONS.map(r=><option key={r}>{r}</option>)}
          </select>
        </div>
        <div style={{ gridColumn:'1/-1' }}>
          <label style={S.label}>{t('description')}</label>
          <textarea style={{ ...S.input, minHeight:80, resize:'vertical' }} value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} placeholder="Décrivez votre channel..."/>
        </div>
      </div>

      {/* Options */}
      <div style={{ display:'flex', gap:20, marginBottom:20 }}>
        {[['ai_moderation',t('ai_mod')],['is_public',t('public_channel')]].map(([key,label])=>(
          <label key={key} style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', color:'#94a3b8', fontSize:13 }}>
            <input type="checkbox" checked={form[key]} onChange={e=>setForm(f=>({...f,[key]:e.target.checked}))} style={{ accentColor:'#C9A84C', width:16, height:16 }}/>
            {label}
          </label>
        ))}
      </div>

      {/* Aperçu */}
      <div style={{ background:'#0a0a0f', border:`1px solid ${tc.border}30`, borderRadius:10, padding:14, marginBottom:20 }}>
        <div style={{ color:'#475569', fontSize:11, marginBottom:8 }}>{t('preview')}</div>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:40, height:40, borderRadius:10, background:tc.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>
            {CHANNEL_TYPES.find(t=>t.value===form.type)?.label?.split(' ')[0] || '📡'}
          </div>
          <div>
            <div style={{ color:'#e2e8f0', fontWeight:700, fontSize:14 }}>{form.name || 'Nom du channel'}</div>
            <div style={{ display:'flex', gap:6, marginTop:3 }}>
              <span style={{ ...S.badge, background:tc.bg, border:`1px solid ${tc.border}`, color:tc.color }}>{form.type}</span>
              <span style={{ color:'#475569', fontSize:11 }}>{form.language} · {form.region}</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
        <button style={S.cancelBtn} onClick={onCancel}>{t('cancel')}</button>
        <button style={S.saveBtn} onClick={handle} disabled={loading}>{loading ? '...' : t('create_btn')}</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// CHANNELS PRINCIPAL
// ─────────────────────────────────────────────
export default function Channels({ userId }) {
  const { t } = useTranslation();
  const [channels,   setChannels]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [tab,        setTab]        = useState('explore'); // explore | joined | create
  const [search,     setSearch]     = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterLang, setFilterLang] = useState('');
  const [filterReg,  setFilterReg]  = useState('');
  const [sortBy,     setSortBy]     = useState('popular');
  const [joinedIds,  setJoinedIds]  = useState([]);
  const [openChannel,setOpenChannel]= useState(null);

  useEffect(() => { loadChannels(); }, []);

  const loadChannels = async () => {
    setLoading(true);
    try {
      const res = await api.get('/channels');
      setChannels(res.data?.data || res.data || []);
    } catch { setChannels(MOCK_CHANNELS); }
    finally { setLoading(false); }
  };

  const handleJoin = async (id) => {
    setJoinedIds(p => [...p, id]);
    setChannels(p => p.map(c => c.id===id ? {...c, subscribers_count:c.subscribers_count+1} : c));
    try { await api.post(`/channels/${id}/join`, { user_id:userId }); } catch {}
  };

  const handleLeave = async (id) => {
    setJoinedIds(p => p.filter(x => x!==id));
    setChannels(p => p.map(c => c.id===id ? {...c, subscribers_count:Math.max(0,c.subscribers_count-1)} : c));
    try { await api.post(`/channels/${id}/leave`, { user_id:userId }); } catch {}
  };

  // Filtrage + tri
  let filtered = channels.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || (c.description||'').toLowerCase().includes(search.toLowerCase());
    const matchType   = !filterType || c.type === filterType;
    const matchLang   = !filterLang || c.language === filterLang;
    const matchReg    = !filterReg  || c.region === filterReg;
    const matchTab    = tab === 'joined' ? joinedIds.includes(c.id) : true;
    return matchSearch && matchType && matchLang && matchReg && matchTab;
  });

  if (sortBy === 'popular')  filtered = [...filtered].sort((a,b) => b.subscribers_count - a.subscribers_count);
  if (sortBy === 'newest')   filtered = [...filtered].sort((a,b) => new Date(b.created_at||0) - new Date(a.created_at||0));
  if (sortBy === 'verified') filtered = [...filtered].sort((a,b) => b.is_verified - a.is_verified);

  const totalSubs = channels.reduce((a,c) => a + (c.subscribers_count||0), 0);

  return (
    <>
      {openChannel && (
        <ChannelDetail
          channel={openChannel}
          isJoined={joinedIds.includes(openChannel.id)}
          onJoin={handleJoin}
          onLeave={handleLeave}
          onClose={() => setOpenChannel(null)}
          userId={userId}
          t={t}
        />
      )}

      <div style={S.container}>

        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
          <h2 style={{ color:'#e2e8f0', fontSize:20, margin:0, fontWeight:700 }}>📡 {t('channels_title')}</h2>
          <div style={{ display:'flex', gap:8 }}>
            {[
              { key:'explore', label:t('explore_channels') },
              { key:'joined',  label:`✅ ${t('subscriptions')} (${joinedIds.length})` },
              { key:'create',  label:t('create_channel') },
            ].map(t => (
              <button key={t.key} onClick={() => setTab(t.key)} style={{
                ...S.filterBtn, padding:'7px 16px', borderRadius:8, fontSize:13,
                ...(tab===t.key ? S.filterActive : {})
              }}>{t.label}</button>
            ))}
          </div>
        </div>

        {/* Stats globales */}
        <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
          {[
            { val:channels.length,          label:t('channels_title'), color:'#C9A84C' },
            { val:fmtCount(totalSubs),       label:t('total_subs'),     color:'#4ade80' },
            { val:joinedIds.length,          label:t('joined'),          color:'#60a5fa' },
            { val:channels.filter(c=>c.is_verified).length, label:t('verified'), color:'#a78bfa' },
          ].map((s,i) => (
            <div key={i} style={{ background:'#13131a', border:'1px solid #1e1e2e', borderRadius:10, padding:'8px 16px', display:'flex', gap:8, alignItems:'center' }}>
              <span style={{ color:s.color, fontWeight:800, fontSize:16 }}>{s.val}</span>
              <span style={{ color:'#475569', fontSize:12 }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* CREATE */}
        {tab === 'create' && (
          <CreateChannel
            userId={userId}
            onCreate={(c) => { if(c){ setChannels(p=>[c,...p]); setJoinedIds(p=>[...p,c.id]); } setTab('explore'); }}
            onCancel={() => setTab('explore')}
            t={t}
          />
        )}

        {/* EXPLORE / JOINED */}
        {(tab === 'explore' || tab === 'joined') && (
          <>
            {/* Barre recherche */}
            <div style={{ display:'flex', gap:10, flexWrap:'wrap', alignItems:'center' }}>
              <div style={{ position:'relative', flex:1, minWidth:200 }}>
                <input style={{ ...S.input, paddingLeft:34 }} placeholder={`🔍 ${t('search_channel')}`} value={search} onChange={e=>setSearch(e.target.value)}/>
                <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', fontSize:14 }}>🔍</span>
              </div>
              <select style={{ background:'#0a0a0f', border:'1px solid #1e1e2e', color:'#e2e8f0', padding:'9px 12px', borderRadius:8, fontSize:12, outline:'none' }} value={sortBy} onChange={e=>setSortBy(e.target.value)}>
                {SORT_OPTIONS(t).map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            {/* Filtres type */}
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              <button onClick={()=>setFilterType('')} style={{ ...S.filterBtn, ...(filterType===''?S.filterActive:{}) }}>{t('all')}</button>
              {CHANNEL_TYPES.map(t => {
                const ttc = TYPE_COLORS[t.value];
                return (
                  <button key={t.value} onClick={()=>setFilterType(t.value)} style={{
                    ...S.filterBtn,
                    ...(filterType===t.value ? { background:ttc.bg, border:`1px solid ${ttc.border}`, color:ttc.color } : {})
                  }}>{t.label}</button>
                );
              })}
            </div>

            {/* Filtres langue + région */}
            <div style={{ display:'flex', gap:8, flexWrap:'wrap', alignItems:'center' }}>
              <span style={{ color:'#475569', fontSize:12 }}>{t('language')}:</span>
              {['','FR','AR','EN','ES'].map(l => (
                <button key={l} onClick={()=>setFilterLang(l)} style={{ ...S.filterBtn, ...(filterLang===l?S.filterActive:{}), padding:'3px 10px', fontSize:11 }}>
                  {l || t('all_langs')}
                </button>
              ))}
              <span style={{ color:'#1e1e2e' }}>|</span>
              <span style={{ color:'#475569', fontSize:12 }}>{t('region')}:</span>
              {['','Monde','Maroc','France','Europe'].map(r => (
                <button key={r} onClick={()=>setFilterReg(r)} style={{ ...S.filterBtn, ...(filterReg===r?S.filterActive:{}), padding:'3px 10px', fontSize:11 }}>
                  {r || t('all_regions')}
                </button>
              ))}
            </div>

            {/* Résultats */}
            <div style={{ color:'#475569', fontSize:12 }}>{filtered.length} {t('channels_found')}</div>

            {loading ? (
              <div style={S.empty}>{t('loading')}</div>
            ) : filtered.length === 0 ? (
              <div style={S.empty}>
                <div style={{ fontSize:48, marginBottom:12 }}>📡</div>
                <div style={{ color:'#e2e8f0', fontSize:16, fontWeight:600, marginBottom:6 }}>
                  {tab==='joined' ? t('no_channel_joined') : t('no_channel')}
                </div>
                <div style={{ color:'#475569', fontSize:13 }}>
                  {tab==='joined' ? t('explore_subscribe') : t('modify_filters')}
                </div>
              </div>
            ) : (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:16 }}>
                {filtered.map(c => (
                  <ChannelCard
                    key={c.id}
                    channel={c}
                    isJoined={joinedIds.includes(c.id)}
                    onJoin={handleJoin}
                    onLeave={handleLeave}
                    onOpen={setOpenChannel}
                    t={t}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}