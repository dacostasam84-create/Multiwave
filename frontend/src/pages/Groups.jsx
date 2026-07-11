// ─────────────────────────────────────────────
// Groups.jsx — Multiwave Groups
// Auteur : Zahnouni Issam
// ─────────────────────────────────────────────
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useTranslation } from '../i18n';

// ─────────────────────────────────────────────
// CONSTANTES
// ─────────────────────────────────────────────
const VIS_COLORS = {
  public:     { bg:'rgba(0,229,255,0.1)',   border:'#00e5ff', color:'#00e5ff',  icon:'🌍' },
  private:    { bg:'rgba(251,146,60,0.1)',  border:'#fb923c', color:'#fb923c',  icon:'🔒' },
  restricted: { bg:'rgba(167,139,250,0.1)', border:'#a78bfa', color:'#a78bfa',  icon:'⚠️' },
};

const CATEGORIES = ['Technologie','Business','Design','Éducation','Sport','Musique','Politique','Science','Santé','Culture','Finance','Gaming'];

const SORT_OPTIONS = (t) => [
  { value:'popular', label:t('popular') },
  { value:'newest',  label:t('newest')  },
  { value:'active',  label:t('active')  },
];

// ─────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────
const MOCK_GROUPS = [
  { id:1,  name:'Design International',  slug:'design-intl',    description:'Communauté mondiale des designers UI/UX, graphistes et créatifs.',       visibility:'public',     members_count:1240, is_verified:true,  ai_moderation:true,  status:'active', owner_id:1, category:'Design',      cover_url:'https://picsum.photos/seed/g1/600/200', posts_count:340  },
  { id:2,  name:'Tech Mondiale',         slug:'tech-monde',     description:'Développeurs et startups du monde entier. Partagez vos projets.',         visibility:'public',     members_count:3800, is_verified:true,  ai_moderation:true,  status:'active', owner_id:2, category:'Technologie', cover_url:'https://picsum.photos/seed/g2/600/200', posts_count:890  },
  { id:3,  name:'Groupe Privé RH',       slug:'groupe-rh',      description:'Réseau RH et recruteurs — sur invitation uniquement.',                    visibility:'private',    members_count:320,  is_verified:false, ai_moderation:false, status:'active', owner_id:3, category:'Business',    cover_url:'https://picsum.photos/seed/g3/600/200', posts_count:120  },
  { id:4,  name:'Entrepreneurs Intl',    slug:'entrepreneurs',  description:'Réseau d\'entrepreneurs internationaux. Networking, levées de fonds.',    visibility:'public',     members_count:4200, is_verified:true,  ai_moderation:true,  status:'active', owner_id:4, category:'Business',    cover_url:'https://picsum.photos/seed/g4/600/200', posts_count:560  },
  { id:5,  name:'Photography World',     slug:'photo-intl',     description:'Partagez vos plus belles photos du monde. Challenges hebdomadaires.',     visibility:'restricted', members_count:890,  is_verified:false, ai_moderation:true,  status:'active', owner_id:5, category:'Culture',     cover_url:'https://picsum.photos/seed/g5/600/200', posts_count:2100 },
  { id:6,  name:'React & JavaScript',    slug:'react-js',       description:'Entraide et partage autour de React, Node.js et l\'écosystème JS.',       visibility:'public',     members_count:2600, is_verified:true,  ai_moderation:false, status:'active', owner_id:6, category:'Technologie', cover_url:'https://picsum.photos/seed/g6/600/200', posts_count:740  },
  { id:7,  name:'Startup Maghreb',       slug:'startup-ma',     description:'L\'écosystème startup du Maghreb. Levées de fonds, success stories.',     visibility:'public',     members_count:1800, is_verified:true,  ai_moderation:true,  status:'active', owner_id:7, category:'Business',    cover_url:'https://picsum.photos/seed/g7/600/200', posts_count:430  },
  { id:8,  name:'Music Producers',       slug:'music-prod',     description:'Producteurs musicaux, beatmakers et artistes. Collabs et partages.',      visibility:'restricted', members_count:650,  is_verified:false, ai_moderation:true,  status:'active', owner_id:8, category:'Musique',     cover_url:'https://picsum.photos/seed/g8/600/200', posts_count:310  },
];

const MOCK_POSTS = [
  { id:1, group_id:1, user_id:2, content:'Nouveau challenge UI cette semaine 🎨 Créez une interface pour une app de méditation. Partagez vos maquettes !', likes_count:48, comments_count:12, created_at:'2026-03-13T10:00:00Z', author:{ username:'laila_design' } },
  { id:2, group_id:1, user_id:3, content:'Top ressources Figma 2026 — j\'ai compilé les 50 meilleurs plugins gratuits pour booster votre workflow 🚀', likes_count:124, comments_count:34, created_at:'2026-03-12T18:00:00Z', author:{ username:'dev_karim' } },
];

const MOCK_MEMBERS = [
  { id:1, user_id:2, username:'laila_design', role:'admin',  joined_at:'2026-01-01', is_online:true  },
  { id:2, user_id:3, username:'dev_karim',    role:'member', joined_at:'2026-01-15', is_online:true  },
  { id:3, user_id:4, username:'tech_maroc',   role:'member', joined_at:'2026-02-01', is_online:false },
  { id:4, user_id:5, username:'startup_ma',   role:'moderator', joined_at:'2026-02-10', is_online:true },
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
  avatar:      { width:34, height:34, borderRadius:'50%', background:'linear-gradient(135deg,#C9A84C,#F5D87A)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, color:'#1a1200', flexShrink:0 },
};

const initials  = (n) => n ? n.slice(0,2).toUpperCase() : '??';
const fmtCount  = (n) => { if(n>=1000) return (n/1000).toFixed(1)+'k'; return n?.toString()||'0'; };
const timeAgo   = (d) => { if(!d) return ''; const diff=Math.floor((Date.now()-new Date(d))/1000); if(diff<60) return `${diff}s`; if(diff<3600) return `${Math.floor(diff/60)}m`; if(diff<86400) return `${Math.floor(diff/3600)}h`; return `${Math.floor(diff/86400)}j`; };

// ─────────────────────────────────────────────
// GROUP CARD
// ─────────────────────────────────────────────
function GroupCard({ group, isJoined, onJoin, onLeave, onOpen }) {
  const { t } = useTranslation();
  const vs = VIS_COLORS[group.visibility] || VIS_COLORS.public;

  return (
    <div
      style={{ ...S.card, cursor:'pointer', display:'flex', flexDirection:'column' }}
      onClick={() => onOpen(group)}
      onMouseEnter={e => { e.currentTarget.style.borderColor=vs.border+'60'; e.currentTarget.style.transform='translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor='#1e1e2e'; e.currentTarget.style.transform='none'; }}
    >
      {/* Cover */}
      <div style={{ height:80, overflow:'hidden', background:'#0a0a0f', position:'relative' }}>
        {group.cover_url
          ? <img src={group.cover_url} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.5 }} onError={e=>e.target.style.display='none'}/>
          : <div style={{ width:'100%', height:'100%', background:`linear-gradient(135deg,${vs.bg},transparent)` }}/>
        }
        <div style={{ position:'absolute', top:8, left:8, display:'flex', gap:5 }}>
          <span style={{ ...S.badge, background:vs.bg, border:`1px solid ${vs.border}`, color:vs.color }}>{vs.icon} {group.visibility}</span>
          {group.category && <span style={{ ...S.badge, background:'rgba(0,0,0,0.5)', color:'#94a3b8' }}>{group.category}</span>}
        </div>
        {group.is_verified && <div style={{ position:'absolute', top:8, right:8 }}><span style={{ ...S.badge, background:'rgba(74,222,128,0.2)', border:'1px solid #4ade80', color:'#4ade80' }}>✅</span></div>}
      </div>

      {/* Body */}
      <div style={{ padding:'14px 16px', display:'flex', flexDirection:'column', gap:10, flex:1 }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:4 }}>
            <span style={{ color:'#e2e8f0', fontWeight:700, fontSize:14 }}>{group.name}</span>
            {group.ai_moderation && <span style={{ fontSize:12 }}>🤖</span>}
          </div>
          <div style={{ color:'#64748b', fontSize:12, lineHeight:1.5 }}>
            {group.description?.substring(0,80)}{group.description?.length>80?'...':''}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display:'flex', gap:12 }}>
          <span style={{ color:'#475569', fontSize:12 }}>👥 {fmtCount(group.members_count)} membres</span>
          {group.posts_count > 0 && <span style={{ color:'#475569', fontSize:12 }}>📝 {fmtCount(group.posts_count)}</span>}
        </div>

        {/* Bouton */}
        <button
          onClick={e => { e.stopPropagation(); isJoined ? onLeave(group.id) : onJoin(group.id); }}
          style={{
            width:'100%', padding:'8px', borderRadius:8, cursor:'pointer', fontWeight:700, fontSize:13,
            background: isJoined ? 'rgba(74,222,128,0.1)' : vs.bg,
            border: `1px solid ${isJoined ? '#4ade80' : vs.border}`,
            color: isJoined ? '#4ade80' : vs.color,
          }}
        >{isJoined ? t('member') : t('join')}</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// GROUP DETAIL MODAL
// ─────────────────────────────────────────────
function GroupDetail({ group, isJoined, onJoin, onLeave, onClose, userId }) {
  const { t } = useTranslation();
  const [detailTab, setDetailTab] = useState('posts');
  const [posts,     setPosts]     = useState([]);
  const [members,   setMembers]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [newPost,   setNewPost]   = useState('');
  const [posting,   setPosting]   = useState(false);
  const vs      = VIS_COLORS[group.visibility] || VIS_COLORS.public;
  const isOwner = group.owner_id === userId;

  useEffect(() => { loadDetail(); }, [detailTab]);

  const loadDetail = async () => {
    setLoading(true);
    try {
      if (detailTab === 'posts') {
        const res = await api.get(`/groups/${group.id}/posts`);
        setPosts(res.data?.data || res.data || []);
      } else {
        const res = await api.get(`/groups/${group.id}/members`);
        setMembers(res.data?.data || res.data || []);
      }
    } catch {
      if (detailTab === 'posts') setPosts(MOCK_POSTS.filter(p=>p.group_id===group.id));
      else setMembers(MOCK_MEMBERS);
    } finally { setLoading(false); }
  };

  const handlePost = async () => {
    if (!newPost.trim()) return;
    setPosting(true);
    const post = { id:Date.now(), group_id:group.id, user_id:userId, content:newPost, likes_count:0, comments_count:0, created_at:new Date().toISOString(), author:{ username:'Moi' } };
    try { await api.post(`/groups/${group.id}/posts`, { content:newPost, user_id:userId }); } catch {}
    setPosts(p => [post, ...p]);
    setNewPost('');
    setPosting(false);
  };

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }} onClick={onClose}>
      <div style={{ background:'#0d0d18', border:'1px solid #1e1e2e', borderRadius:16, width:'100%', maxWidth:640, maxHeight:'90vh', overflow:'auto', display:'flex', flexDirection:'column' }} onClick={e=>e.stopPropagation()}>

        {/* Cover */}
        <div style={{ height:130, position:'relative', overflow:'hidden', flexShrink:0 }}>
          {group.cover_url
            ? <img src={group.cover_url} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.5 }}/>
            : <div style={{ width:'100%', height:'100%', background:`linear-gradient(135deg,${vs.bg},#0d0d18)` }}/>
          }
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom,transparent,#0d0d18)' }}/>
          <button onClick={onClose} style={{ position:'absolute', top:12, right:12, background:'rgba(0,0,0,0.5)', border:'none', color:'#e2e8f0', width:32, height:32, borderRadius:'50%', cursor:'pointer', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
        </div>

        <div style={{ padding:'0 20px 20px' }}>
          {/* Header */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14, gap:12, flexWrap:'wrap' }}>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                <h2 style={{ color:'#e2e8f0', fontSize:20, margin:0, fontWeight:700 }}>{group.name}</h2>
                {group.is_verified && <span>✅</span>}
              </div>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                <span style={{ ...S.badge, background:vs.bg, border:`1px solid ${vs.border}`, color:vs.color }}>{vs.icon} {group.visibility}</span>
                {group.category && <span style={{ ...S.badge, background:'rgba(255,255,255,0.05)', color:'#64748b' }}>{group.category}</span>}
                {group.ai_moderation && <span style={{ ...S.badge, background:'rgba(167,139,250,0.1)', color:'#a78bfa' }}>🤖 Modéré</span>}
              </div>
            </div>
            <button
              onClick={() => isJoined ? onLeave(group.id) : onJoin(group.id)}
              style={{
                padding:'8px 18px', borderRadius:8, cursor:'pointer', fontWeight:700, fontSize:13,
                background: isJoined ? 'rgba(74,222,128,0.1)' : `linear-gradient(135deg,#C9A84C,#F5D87A)`,
                border: isJoined ? '1px solid #4ade80' : 'none',
                color: isJoined ? '#4ade80' : '#1a1200',
              }}
            >{isJoined ? t('member') : t('join')}</button>
          </div>

          {group.description && <div style={{ color:'#94a3b8', fontSize:13, lineHeight:1.6, marginBottom:14 }}>{group.description}</div>}

          {/* Stats bar */}
          <div style={{ display:'flex', gap:20, padding:'12px 0', borderTop:'1px solid #1e1e2e', borderBottom:'1px solid #1e1e2e', marginBottom:16, flexWrap:'wrap' }}>
            {[
              { icon:'👥', val:fmtCount(group.members_count), label:'membres' },
              { icon:'📝', val:fmtCount(group.posts_count||posts.length), label:'posts' },
              { icon:'🤖', val:group.ai_moderation?'Activée':'Non', label:'modération IA' },
            ].map((s,i) => (
              <div key={i}>
                <div style={{ color:'#e2e8f0', fontWeight:700, fontSize:15 }}>{s.icon} {s.val}</div>
                <div style={{ color:'#475569', fontSize:11 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div style={{ display:'flex', gap:8, marginBottom:16 }}>
            {[['posts','📝 Posts'],['members','👥 Membres']].map(([key,label]) => (
              <button key={key} onClick={() => setDetailTab(key)} style={{
                ...S.filterBtn, padding:'7px 16px', borderRadius:8,
                ...(detailTab===key ? S.filterActive : {})
              }}>{label}</button>
            ))}
          </div>

          {/* Posts tab */}
          {detailTab === 'posts' && (
            <>
              {/* Nouveau post (si membre) */}
              {(isJoined || isOwner) && (
                <div style={{ background:'#13131a', border:'1px solid #1e1e2e', borderRadius:10, padding:14, marginBottom:14 }}>
                  <textarea
                    style={{ ...S.input, minHeight:70, resize:'vertical', marginBottom:10 }}
                    placeholder="Partagez quelque chose avec le groupe..."
                    value={newPost}
                    onChange={e => setNewPost(e.target.value)}
                  />
                  <div style={{ display:'flex', justifyContent:'flex-end' }}>
                    <button onClick={handlePost} disabled={!newPost.trim()||posting} style={{ ...S.saveBtn, opacity:newPost.trim()?1:0.5 }}>
                      {posting ? '...' : '📝 Publier'}
                    </button>
                  </div>
                </div>
              )}

              {/* Liste posts */}
              {loading ? <div style={S.empty}>Chargement...</div> :
               posts.length === 0 ? <div style={S.empty}>Aucun post dans ce groupe</div> :
               <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                 {posts.map(post => (
                   <div key={post.id} style={{ background:'#13131a', border:'1px solid #1e1e2e', borderRadius:10, padding:14 }}>
                     <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:10 }}>
                       <div style={S.avatar}>{initials(post.author?.username||'?')}</div>
                       <div>
                         <div style={{ color:'#C9A84C', fontWeight:600, fontSize:13 }}>{post.author?.username}</div>
                         <div style={{ color:'#334155', fontSize:11 }}>{timeAgo(post.created_at)}</div>
                       </div>
                     </div>
                     <div style={{ color:'#cbd5e1', fontSize:13, lineHeight:1.7, marginBottom:10 }}>{post.content}</div>
                     <div style={{ display:'flex', gap:16 }}>
                       <span style={{ color:'#475569', fontSize:12 }}>❤️ {post.likes_count}</span>
                       <span style={{ color:'#475569', fontSize:12 }}>💬 {post.comments_count}</span>
                     </div>
                   </div>
                 ))}
               </div>
              }
            </>
          )}

          {/* Members tab */}
          {detailTab === 'members' && (
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {loading ? <div style={S.empty}>Chargement...</div> :
               members.map(m => (
                 <div key={m.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 14px', background:'#13131a', border:'1px solid #1e1e2e', borderRadius:10 }}>
                   <div style={{ position:'relative' }}>
                     <div style={S.avatar}>{initials(m.username)}</div>
                     {m.is_online && <div style={{ position:'absolute', bottom:0, right:0, width:9, height:9, borderRadius:'50%', background:'#4ade80', border:'2px solid #13131a' }}/>}
                   </div>
                   <div style={{ flex:1 }}>
                     <div style={{ color:'#e2e8f0', fontWeight:600, fontSize:13 }}>{m.username}</div>
                     <div style={{ color:'#475569', fontSize:11 }}>Rejoint {timeAgo(m.joined_at)}</div>
                   </div>
                   <span style={{
                     ...S.badge,
                     background: m.role==='admin'?'rgba(201,168,76,0.1)':m.role==='moderator'?'rgba(167,139,250,0.1)':'rgba(100,116,139,0.1)',
                     border:`1px solid ${m.role==='admin'?'#C9A84C':m.role==='moderator'?'#a78bfa':'#334155'}`,
                     color: m.role==='admin'?'#C9A84C':m.role==='moderator'?'#a78bfa':'#64748b',
                   }}>{m.role==='admin'?'👑 Admin':m.role==='moderator'?'🛡️ Modo':'👤 Membre'}</span>
                 </div>
               ))
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// CRÉER UN GROUPE
// ─────────────────────────────────────────────
function CreateGroup({ userId, onCreate, onCancel, t = (k)=>k }) {
  const [form, setForm] = useState({ name:'', description:'', visibility:'public', category:'', ai_moderation:true });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const handle = async () => {
    if (!form.name.trim()) { setError(t('name_required')); return; }
    setLoading(true);
    try {
      const res = await api.post('/groups', { ...form, owner_id:userId, slug:form.name.toLowerCase().replace(/\s+/g,'-') });
      onCreate && onCreate(res.data?.data || res.data);
    } catch(err) {
      onCreate && onCreate({ ...form, id:Date.now(), members_count:1, posts_count:0, is_verified:false, owner_id:userId, cover_url:null, created_at:new Date().toISOString() });
    } finally { setLoading(false); }
  };

  return (
    <div style={{ background:'#13131a', border:'1px solid #1e1e2e', borderRadius:14, padding:24 }}>
      <h3 style={{ color:'#e2e8f0', fontSize:17, margin:'0 0 20px', fontWeight:700 }}>{t('create_group_title')}</h3>
      {error && <div style={{ background:'rgba(248,113,113,0.1)', border:'1px solid #f87171', color:'#f87171', padding:'9px 14px', borderRadius:8, fontSize:13, marginBottom:16 }}>⚠️ {error}</div>}

      {/* Visibilité */}
      <div style={{ marginBottom:16 }}>
        <label style={S.label}>{t('visibility')}</label>
        <div style={{ display:'flex', gap:8 }}>
          {Object.entries(VIS_COLORS).map(([key, vs]) => (
            <button key={key} onClick={() => setForm(f=>({...f,visibility:key}))} style={{
              flex:1, padding:'10px', borderRadius:10, cursor:'pointer', fontWeight:700, fontSize:13,
              background: form.visibility===key ? vs.bg : 'transparent',
              border: `1px solid ${form.visibility===key ? vs.border : '#1e1e2e'}`,
              color: form.visibility===key ? vs.color : '#64748b',
            }}>{vs.icon} {key==='public'?'Public':key==='private'?'Privé':'Restreint'}</button>
          ))}
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
        <div style={{ gridColumn:'1/-1' }}>
          <label style={S.label}>{t('group_name')} *</label>
          <input style={S.input} value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Ex: Tech Maroc Community"/>
        </div>
        <div style={{ gridColumn:'1/-1' }}>
          <label style={S.label}>{t('category')}</label>
          <select style={S.input} value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>
            <option value="">-- Sélectionner --</option>
            {CATEGORIES.map(c=><option key={c}>{c}</option>)}
          </select>
        </div>
        <div style={{ gridColumn:'1/-1' }}>
          <label style={S.label}>{t('description')}</label>
          <textarea style={{ ...S.input, minHeight:80, resize:'vertical' }} value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} placeholder="Décrivez votre groupe..."/>
        </div>
      </div>

      <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', color:'#94a3b8', fontSize:13, marginBottom:20 }}>
        <input type="checkbox" checked={form.ai_moderation} onChange={e=>setForm(f=>({...f,ai_moderation:e.target.checked}))} style={{ accentColor:'#C9A84C', width:16, height:16 }}/>
        {t('ai_moderation')}
      </label>

      <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
        <button style={S.cancelBtn} onClick={onCancel}>{t('cancel')}</button>
        <button style={S.saveBtn} onClick={handle} disabled={loading}>{loading?'...':t('create_btn')}</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// GROUPS PRINCIPAL
// ─────────────────────────────────────────────
export default function Groups({ userId }) {
  const { t } = useTranslation();
  const [groups,      setGroups]      = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [tab,         setTab]         = useState('browse');
  const [search,      setSearch]      = useState('');
  const [filterVis,   setFilterVis]   = useState('');
  const [filterCat,   setFilterCat]   = useState('');
  const [sortBy,      setSortBy]      = useState('popular');
  const [joinedIds,   setJoinedIds]   = useState([]);
  const [openGroup,   setOpenGroup]   = useState(null);

  useEffect(() => { loadGroups(); }, []);

  const loadGroups = async () => {
    setLoading(true);
    try {
      const res = await api.get('/groups');
      setGroups(res.data?.data || res.data || []);
    } catch { setGroups(MOCK_GROUPS); }
    finally { setLoading(false); }
  };

  const handleJoin = async (id) => {
    setJoinedIds(p => [...p, id]);
    setGroups(p => p.map(g => g.id===id ? {...g, members_count:g.members_count+1} : g));
    try { await api.post(`/groups/${id}/join`, { user_id:userId }); } catch {}
  };

  const handleLeave = async (id) => {
    setJoinedIds(p => p.filter(x => x!==id));
    setGroups(p => p.map(g => g.id===id ? {...g, members_count:Math.max(0,g.members_count-1)} : g));
    try { await api.post(`/groups/${id}/leave`, { user_id:userId }); } catch {}
  };

  // Filtrage + tri
  let filtered = groups.filter(g => {
    const matchSearch = g.name.toLowerCase().includes(search.toLowerCase()) || (g.description||'').toLowerCase().includes(search.toLowerCase());
    const matchVis    = !filterVis || g.visibility === filterVis;
    const matchCat    = !filterCat || g.category === filterCat;
    const matchTab    = tab==='joined' ? joinedIds.includes(g.id) : true;
    return matchSearch && matchVis && matchCat && matchTab;
  });

  if (sortBy==='popular') filtered = [...filtered].sort((a,b) => b.members_count - a.members_count);
  if (sortBy==='newest')  filtered = [...filtered].sort((a,b) => new Date(b.created_at||0) - new Date(a.created_at||0));
  if (sortBy==='active')  filtered = [...filtered].sort((a,b) => (b.posts_count||0) - (a.posts_count||0));

  const totalMembers = groups.reduce((a,g) => a + (g.members_count||0), 0);

  return (
    <>
      {openGroup && (
        <GroupDetail
          group={openGroup}
          isJoined={joinedIds.includes(openGroup.id)}
          onJoin={handleJoin}
          onLeave={handleLeave}
          onClose={() => setOpenGroup(null)}
          userId={userId}
        />
      )}

      <div style={S.container}>

        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
          <h2 style={{ color:'#e2e8f0', fontSize:20, margin:0, fontWeight:700 }}>👥 {t('groups_title')}</h2>
          <div style={{ display:'flex', gap:8 }}>
            {[
              { key:'browse', label:t('explore_groups') },
              { key:'joined', label:`✅ ${t('joined_groups')} (${joinedIds.length})` },
              { key:'create', label:t('create_group') },
            ].map(t => (
              <button key={t.key} onClick={() => setTab(t.key)} style={{
                ...S.filterBtn, padding:'7px 16px', borderRadius:8, fontSize:13,
                ...(tab===t.key ? S.filterActive : {})
              }}>{t.label}</button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
          {[
            { val:groups.length,          label:t('groups_title'), color:'#C9A84C' },
            { val:fmtCount(totalMembers), label:t('members'),       color:'#4ade80' },
            { val:joinedIds.length,       label:t('joined'),         color:'#60a5fa' },
            { val:groups.filter(g=>g.is_verified).length, label:t('verified'), color:'#a78bfa' },
          ].map((s,i) => (
            <div key={i} style={{ background:'#13131a', border:'1px solid #1e1e2e', borderRadius:10, padding:'8px 16px', display:'flex', gap:8, alignItems:'center' }}>
              <span style={{ color:s.color, fontWeight:800, fontSize:16 }}>{s.val}</span>
              <span style={{ color:'#475569', fontSize:12 }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* CREATE */}
        {tab === 'create' && (
          <CreateGroup
            userId={userId}
            onCreate={(g) => { if(g){ setGroups(p=>[g,...p]); setJoinedIds(p=>[...p,g.id]); } setTab('browse'); }}
            onCancel={() => setTab('browse')}
            t={t}
          />
        )}

        {/* BROWSE / JOINED */}
        {(tab==='browse' || tab==='joined') && (
          <>
            {/* Recherche + tri */}
            <div style={{ display:'flex', gap:10, flexWrap:'wrap', alignItems:'center' }}>
              <div style={{ position:'relative', flex:1, minWidth:200 }}>
                <input style={{ ...S.input, paddingLeft:34 }} placeholder={`🔍 ${t('search_group')}`} value={search} onChange={e=>setSearch(e.target.value)}/>
                <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', fontSize:14 }}>🔍</span>
              </div>
              <select style={{ background:'#0a0a0f', border:'1px solid #1e1e2e', color:'#e2e8f0', padding:'9px 12px', borderRadius:8, fontSize:12, outline:'none' }} value={sortBy} onChange={e=>setSortBy(e.target.value)}>
                {SORT_OPTIONS(t).map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            {/* Filtres visibilité */}
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              <button onClick={()=>setFilterVis('')} style={{ ...S.filterBtn, ...(filterVis===''?S.filterActive:{}) }}>{t('all')}</button>
              {Object.entries(VIS_COLORS).map(([key,vs]) => (
                <button key={key} onClick={()=>setFilterVis(key)} style={{
                  ...S.filterBtn,
                  ...(filterVis===key?{background:vs.bg,border:`1px solid ${vs.border}`,color:vs.color}:{})
                }}>{vs.icon} {key==='public'?'Public':key==='private'?'Privé':'Restreint'}</button>
              ))}
            </div>

            {/* Filtres catégorie */}
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              <button onClick={()=>setFilterCat('')} style={{ ...S.filterBtn, ...(filterCat===''?S.filterActive:{}) }}>{t('all_categories')}</button>
              {CATEGORIES.slice(0,6).map(c => (
                <button key={c} onClick={()=>setFilterCat(c)} style={{ ...S.filterBtn, ...(filterCat===c?S.filterActive:{}) }}>{c}</button>
              ))}
            </div>

            {/* Résultats */}
            <div style={{ color:'#475569', fontSize:12 }}>{filtered.length} {t('groups_found')}</div>

            {loading ? (
              <div style={S.empty}>{t('loading')}</div>
            ) : filtered.length === 0 ? (
              <div style={S.empty}>
                <div style={{ fontSize:48, marginBottom:12 }}>👥</div>
                <div style={{ color:'#e2e8f0', fontSize:16, fontWeight:600, marginBottom:6 }}>
                  {tab==='joined' ? t('no_joined') : t('no_groups')}
                </div>
                <div style={{ color:'#475569', fontSize:13 }}>
                  {tab==='joined' ? t('explore_join') : t('create_yours')}
                </div>
              </div>
            ) : (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:16 }}>
                {filtered.map(g => (
                  <GroupCard
                    key={g.id}
                    group={g}
                    isJoined={joinedIds.includes(g.id)}
                    onJoin={handleJoin}
                    onLeave={handleLeave}
                    onOpen={setOpenGroup}
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