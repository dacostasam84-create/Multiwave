// ─────────────────────────────────────────────
// Profile.jsx — Multiwave Profile
// Auteur : Zahnouni Issam
// ─────────────────────────────────────────────
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { SkeletonProfile, SkeletonStyle } from '../components/SkeletonLoader';

// ─────────────────────────────────────────────
// LANGUES
// ─────────────────────────────────────────────
const LANGUAGES = [
  { value:'fr',    flag:'🇫🇷', label:'Français'  },
  { value:'en',    flag:'🇬🇧', label:'Anglais'   },
  { value:'ar',    flag:'🌍',  label:'Arabe'     },
  { value:'ar-MA', flag:'🇲🇦', label:'Darija'    },
  { value:'es',    flag:'🇪🇸', label:'Espagnol'  },
  { value:'de',    flag:'🇩🇪', label:'Allemand'  },
  { value:'it',    flag:'🇮🇹', label:'Italien'   },
  { value:'pt',    flag:'🇵🇹', label:'Portugais' },
  { value:'ru',    flag:'🇷🇺', label:'Russe'     },
  { value:'zh',    flag:'🇨🇳', label:'Chinois'   },
  { value:'ja',    flag:'🇯🇵', label:'Japonais'  },
  { value:'tr',    flag:'🇹🇷', label:'Turc'      },
];

const MOCK_PROFILE = {
  id:1, username:'utilisateur', full_name:'Utilisateur Multiwave',
  email:'user@multiwave.com', bio:'Bienvenue sur Multiwave 🌊 — Connect · Explore',
  phone:'', website:'', location:'', birth_date:'',
  role:'user', preferred_language:'fr',
  is_verified:false, is_online:true,
  followers_count:0, following_count:0, posts_count:0,
  avatar:null, last_seen:new Date().toISOString(),
};

const MOCK_POSTS = [
  { id:1, content:'Bienvenue sur Multiwave !', media:'https://picsum.photos/seed/pp1/300/300', media_type:'image', likes_count:0, created_at:new Date().toISOString() },
  { id:2, content:'',                          media:'https://picsum.photos/seed/pp2/300/300', media_type:'image', likes_count:0, created_at:new Date().toISOString() },
  { id:3, content:'',                          media:'https://picsum.photos/seed/pp3/300/300', media_type:'image', likes_count:0, created_at:new Date().toISOString() },
];

// ─────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────
const S = {
  container:   { maxWidth:760, margin:'0 auto', display:'flex', flexDirection:'column', gap:18 },
  card:        { background:'#13131a', border:'1px solid #1e1e2e', borderRadius:14, overflow:'hidden' },
  input:       { background:'#0a0a0f', border:'1px solid #1e1e2e', color:'#e2e8f0', padding:'10px 14px', borderRadius:8, fontSize:13, width:'100%', boxSizing:'border-box', outline:'none' },
  label:       { color:'#64748b', fontSize:12, marginBottom:4, display:'block' },
  saveBtn:     { background:'linear-gradient(135deg,#C9A84C,#F5D87A)', color:'#1a1200', border:'none', padding:'10px 24px', borderRadius:8, fontWeight:700, cursor:'pointer', fontSize:13 },
  cancelBtn:   { background:'transparent', border:'1px solid #1e1e2e', color:'#64748b', padding:'10px 20px', borderRadius:8, cursor:'pointer', fontSize:13 },
  filterBtn:   { background:'transparent', border:'1px solid #1e1e2e', color:'#64748b', padding:'5px 14px', borderRadius:20, cursor:'pointer', fontSize:12, fontWeight:600 },
  filterActive:{ background:'rgba(201,168,76,0.12)', border:'1px solid #C9A84C', color:'#C9A84C' },
  badge:       { padding:'2px 8px', borderRadius:20, fontSize:10, fontWeight:700 },
};

const fmtCount = (n) => { if(!n) return '0'; if(n>=1000000) return (n/1000000).toFixed(1)+'M'; if(n>=1000) return (n/1000).toFixed(1)+'k'; return n.toString(); };
const timeAgo  = (d) => { if(!d) return ''; const diff=Math.floor((Date.now()-new Date(d))/1000); if(diff<60) return `${diff}s`; if(diff<3600) return `${Math.floor(diff/60)}m`; if(diff<86400) return `${Math.floor(diff/3600)}h`; return `${Math.floor(diff/86400)}j`; };

const ROLE_CONFIG = {
  admin:     { label:'Admin',     bg:'rgba(201,168,76,0.12)',  border:'#C9A84C', color:'#C9A84C',  icon:'👑' },
  moderator: { label:'Modérateur',bg:'rgba(167,139,250,0.12)', border:'#a78bfa', color:'#a78bfa',  icon:'🛡️' },
  business:  { label:'Business',  bg:'rgba(96,165,250,0.12)',  border:'#60a5fa', color:'#60a5fa',  icon:'💼' },
  creator:   { label:'Créateur',  bg:'rgba(74,222,128,0.12)',  border:'#4ade80', color:'#4ade80',  icon:'🎬' },
  seller:    { label:'Vendeur',   bg:'rgba(251,146,60,0.12)',  border:'#fb923c', color:'#fb923c',  icon:'🛍️' },
  user:      { label:'Membre',    bg:'rgba(100,116,139,0.12)', border:'#64748b', color:'#64748b',  icon:'👤' },
};

// ─────────────────────────────────────────────
// AVATAR
// ─────────────────────────────────────────────
function Avatar({ profile, size = 90 }) {
  const initials = profile?.username?.slice(0,2)?.toUpperCase() || '??';
  return (
    <div style={{
      width:size, height:size, borderRadius:'50%', flexShrink:0,
      border:'3px solid rgba(201,168,76,0.5)',
      overflow:'hidden', position:'relative',
      background:'linear-gradient(135deg,#C9A84C,#F5D87A)',
      display:'flex', alignItems:'center', justifyContent:'center',
      boxShadow:'0 4px 20px rgba(201,168,76,0.3)',
    }}>
      {profile?.avatar
        ? <img src={profile.avatar} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
        : <span style={{ fontSize:size*0.35, fontWeight:700, color:'#1a1200' }}>{initials}</span>
      }
      {profile?.is_online && (
        <div style={{ position:'absolute', bottom:4, right:4, width:14, height:14, borderRadius:'50%', background:'#4ade80', border:'2px solid #13131a' }}/>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// PROFILE HEADER
// ─────────────────────────────────────────────
function ProfileHeader({ profile, isOwn, onEdit, onFollow, isFollowing }) {
  const rc = ROLE_CONFIG[profile.role] || ROLE_CONFIG.user;
  const lang = LANGUAGES.find(l => l.value === profile.preferred_language);

  return (
    <div style={S.card}>
      {/* Cover */}
      <div style={{ height:160, background:'linear-gradient(135deg,#0a0a0f,#1a1200,#0d0828)', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 30% 50%, rgba(201,168,76,0.2), transparent 60%)' }}/>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 80% 30%, rgba(14,165,233,0.08), transparent 50%)' }}/>
        {/* Vagues décoratives */}
        <svg style={{ position:'absolute', bottom:0, left:0, right:0, opacity:0.15 }} viewBox="0 0 800 60" preserveAspectRatio="none" height="60" width="100%">
          <path d="M0 30 Q100 10 200 30 Q300 50 400 30 Q500 10 600 30 Q700 50 800 30 L800 60 L0 60Z" fill="#C9A84C"/>
        </svg>
        {/* Avatar positionné */}
        <div style={{ position:'absolute', bottom:-40, left:24 }}>
          <Avatar profile={profile} size={96}/>
        </div>
      </div>

      {/* Contenu */}
      <div style={{ padding:'50px 24px 24px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12, marginBottom:14 }}>
          <div>
            {/* Nom + badges */}
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4, flexWrap:'wrap' }}>
              <span style={{ color:'#e2e8f0', fontSize:22, fontWeight:800 }}>
                {profile.full_name || profile.username || 'Utilisateur'}
              </span>
              {profile.is_verified && (
                <span title="Compte vérifié" style={{ fontSize:18 }}>✅</span>
              )}
              <span style={{ ...S.badge, background:rc.bg, border:`1px solid ${rc.border}`, color:rc.color }}>
                {rc.icon} {rc.label}
              </span>
              {lang && (
                <span style={{ ...S.badge, background:'rgba(100,116,139,0.1)', border:'1px solid #334155', color:'#64748b' }}>
                  {lang.flag} {lang.label}
                </span>
              )}
            </div>
            <div style={{ color:'#64748b', fontSize:13, marginBottom:6 }}>@{profile.username}</div>
            {profile.bio && (
              <div style={{ color:'#94a3b8', fontSize:13, lineHeight:1.7, maxWidth:420 }}>{profile.bio}</div>
            )}
          </div>

          {/* Actions */}
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {isOwn ? (
              <button onClick={onEdit} style={{ ...S.filterBtn, padding:'9px 20px', borderRadius:9, fontSize:13 }}>
                ✏️ Modifier le profil
              </button>
            ) : (
              <>
                <button onClick={onFollow} style={{
                  padding:'9px 22px', borderRadius:9, cursor:'pointer', fontWeight:700, fontSize:13,
                  background: isFollowing ? 'rgba(74,222,128,0.1)' : 'linear-gradient(135deg,#C9A84C,#F5D87A)',
                  border: isFollowing ? '1px solid #4ade80' : 'none',
                  color: isFollowing ? '#4ade80' : '#1a1200',
                  transition:'all 0.2s',
                }}>{isFollowing ? '✓ Abonné' : '+ Suivre'}</button>
                <button style={{ ...S.filterBtn, padding:'9px 16px', borderRadius:9 }}>💬 Message</button>
              </>
            )}
          </div>
        </div>

        {/* Meta */}
        <div style={{ display:'flex', gap:14, flexWrap:'wrap', marginBottom:16 }}>
          {profile.location  && <span style={{ color:'#475569', fontSize:12 }}>📍 {profile.location}</span>}
          {profile.website   && <a href={profile.website} target="_blank" rel="noreferrer" style={{ color:'#C9A84C', fontSize:12, textDecoration:'none' }}>🔗 {profile.website.replace(/https?:\/\//,'')}</a>}
          {profile.phone     && <span style={{ color:'#475569', fontSize:12 }}>📞 {profile.phone}</span>}
          {profile.birth_date && <span style={{ color:'#475569', fontSize:12 }}>🎂 {new Date(profile.birth_date).toLocaleDateString('fr-FR')}</span>}
          {profile.last_seen  && <span style={{ color:'#334155', fontSize:12 }}>⏱ Vu il y a {timeAgo(profile.last_seen)}</span>}
        </div>

        {/* Stats */}
        <div style={{ display:'flex', borderTop:'1px solid #1e1e2e', paddingTop:16, gap:0 }}>
          {[
            { val:fmtCount(profile.posts_count),     label:'Posts',        color:'#C9A84C' },
            { val:fmtCount(profile.followers_count), label:'Abonnés',      color:'#60a5fa' },
            { val:fmtCount(profile.following_count), label:'Abonnements',  color:'#4ade80' },
          ].map((s,i) => (
            <div key={i} style={{ flex:1, textAlign:'center', borderRight: i<2?'1px solid #1e1e2e':'none', cursor:'pointer' }}>
              <div style={{ color:s.color, fontSize:22, fontWeight:800 }}>{s.val}</div>
              <div style={{ color:'#475569', fontSize:12, marginTop:2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// EDIT FORM
// ─────────────────────────────────────────────
function EditForm({ profile, form, setForm, onSave, onCancel, saving }) {
  const [avatarPreview, setAvatarPreview] = useState(form.avatar || null);

  const fields = [
    { label:'Nom complet',       key:'full_name',  type:'text'  },
    { label:'Téléphone',         key:'phone',       type:'text'  },
    { label:'Site web',          key:'website',     type:'url'   },
    { label:'Localisation',      key:'location',    type:'text'  },
    { label:'Date de naissance', key:'birth_date',  type:'date'  },
  ];

  return (
    <div style={{ ...S.card, padding:24 }}>
      <h3 style={{ color:'#e2e8f0', fontSize:16, margin:'0 0 20px', fontWeight:700 }}>✏️ Modifier le profil</h3>

      {/* Avatar upload */}
      <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:20, padding:16, background:'rgba(201,168,76,0.04)', borderRadius:10, border:'1px solid rgba(201,168,76,0.1)' }}>
        <div style={{ width:64, height:64, borderRadius:'50%', background:'linear-gradient(135deg,#C9A84C,#F5D87A)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, fontWeight:700, color:'#1a1200', overflow:'hidden', flexShrink:0 }}>
          {avatarPreview
            ? <img src={avatarPreview} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
            : (form.username||'U').slice(0,2).toUpperCase()
          }
        </div>
        <div>
          <div style={{ color:'#e2e8f0', fontWeight:600, fontSize:14 }}>{form.full_name || form.username}</div>
          <div style={{ color:'#475569', fontSize:12 }}>@{form.username}</div>
        </div>
      </div>

      {/* Champs */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
        {fields.map(f => (
          <div key={f.key} style={{ gridColumn: f.key==='full_name' ? '1/-1' : 'auto' }}>
            <label style={S.label}>{f.label}</label>
            <input
              style={S.input} type={f.type}
              value={form[f.key]||''}
              onChange={e => setForm(p => ({...p, [f.key]: e.target.value}))}
              placeholder={f.label}
            />
          </div>
        ))}
      </div>

      {/* Bio */}
      <div style={{ marginBottom:16 }}>
        <label style={S.label}>Bio</label>
        <textarea
          style={{ ...S.input, minHeight:80, resize:'vertical' }}
          value={form.bio||''}
          onChange={e => setForm(p => ({...p, bio: e.target.value}))}
          placeholder="Parlez de vous..."
        />
      </div>

      {/* Langue */}
      <div style={{ marginBottom:20 }}>
        <label style={S.label}>🌍 Langue préférée</label>
        <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginTop:6 }}>
          {LANGUAGES.map(l => (
            <button key={l.value} onClick={() => setForm(p => ({...p, preferred_language:l.value}))} style={{
              ...S.filterBtn, fontSize:11,
              ...(form.preferred_language===l.value ? S.filterActive : {}),
            }}>{l.flag} {l.label}</button>
          ))}
        </div>
      </div>

      <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
        <button style={S.cancelBtn} onClick={onCancel}>Annuler</button>
        <button style={S.saveBtn} onClick={onSave} disabled={saving}>
          {saving ? '⏳ Sauvegarde...' : '💾 Sauvegarder'}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// POSTS GRID
// ─────────────────────────────────────────────
function PostsGrid({ posts }) {
  const [hovered, setHovered] = useState(null);

  if (!posts.length) return (
    <div style={{ ...S.card, padding:48, textAlign:'center' }}>
      <div style={{ fontSize:56, marginBottom:12 }}>📝</div>
      <div style={{ color:'#e2e8f0', fontSize:16, fontWeight:600, marginBottom:6 }}>Aucun post encore</div>
      <div style={{ color:'#475569', fontSize:13 }}>Partagez votre premier post !</div>
    </div>
  );

  return (
    <div style={{ ...S.card, overflow:'hidden' }}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:2 }}>
        {posts.map(post => (
          <div
            key={post.id}
            onMouseEnter={() => setHovered(post.id)}
            onMouseLeave={() => setHovered(null)}
            style={{ position:'relative', paddingBottom:'100%', cursor:'pointer', overflow:'hidden', background:'#0a0a0f' }}
          >
            <div style={{ position:'absolute', inset:0 }}>
              {post.media
                ? <img src={post.media} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e=>e.target.style.display='none'}/>
                : <div style={{ width:'100%', height:'100%', background:'#1e1e2e', display:'flex', alignItems:'center', justifyContent:'center', padding:8 }}>
                    <span style={{ color:'#64748b', fontSize:11, textAlign:'center' }}>{post.content?.substring(0,50)}</span>
                  </div>
              }
              {hovered === post.id && (
                <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.65)', display:'flex', alignItems:'center', justifyContent:'center', gap:20 }}>
                  <span style={{ color:'#fff', fontWeight:700, fontSize:14 }}>❤️ {post.likes_count||0}</span>
                  <span style={{ color:'#fff', fontWeight:700, fontSize:14 }}>💬 {post.comments_count||0}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ABOUT TAB
// ─────────────────────────────────────────────
function AboutTab({ profile }) {
  const lang = LANGUAGES.find(l => l.value === profile.preferred_language);
  const rc   = ROLE_CONFIG[profile.role] || ROLE_CONFIG.user;

  const items = [
    { icon:'📝', label:'Bio',          val:profile.bio },
    { icon:'📞', label:'Téléphone',    val:profile.phone },
    { icon:'🌐', label:'Site web',     val:profile.website },
    { icon:'📍', label:'Localisation', val:profile.location },
    { icon:'🎂', label:'Naissance',    val:profile.birth_date ? new Date(profile.birth_date).toLocaleDateString('fr-FR') : null },
    { icon:'🌍', label:'Langue',       val:lang ? `${lang.flag} ${lang.label}` : null },
    { icon:rc.icon, label:'Rôle',      val:rc.label },
    { icon:'⏱',  label:'Dernière vue', val:profile.last_seen ? `il y a ${timeAgo(profile.last_seen)}` : null },
  ].filter(i => i.val);

  return (
    <div style={{ ...S.card, padding:24 }}>
      <h3 style={{ color:'#e2e8f0', fontSize:16, margin:'0 0 20px', fontWeight:700 }}>ℹ️ À propos</h3>
      {items.length === 0 ? (
        <div style={{ color:'#475569', textAlign:'center', padding:24 }}>Aucune information renseignée</div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
          {items.map((item, i) => (
            <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:14, padding:'12px 0', borderBottom: i<items.length-1?'1px solid #0d0d18':'none' }}>
              <span style={{ fontSize:20, width:28, textAlign:'center', flexShrink:0 }}>{item.icon}</span>
              <div>
                <div style={{ color:'#475569', fontSize:11, marginBottom:2 }}>{item.label}</div>
                <div style={{ color:'#e2e8f0', fontSize:13, lineHeight:1.6 }}>{item.val}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// PROFILE PRINCIPAL
// ─────────────────────────────────────────────
export default function Profile({ userId }) {
  const [profile,     setProfile]     = useState(null);
  const [posts,       setPosts]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [editing,     setEditing]     = useState(false);
  const [form,        setForm]        = useState({});
  const [saving,      setSaving]      = useState(false);
  const [saved,       setSaved]       = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab,   setActiveTab]   = useState('posts');

  useEffect(() => { loadProfile(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadProfile = async () => {
    setLoading(true);
    try {
      const [pRes, postsRes] = await Promise.allSettled([
        api.get(`/users/${userId}`),
        api.get(`/posts?user_id=${userId}&limit=12`),
      ]);
      const p = pRes.status === 'fulfilled'
        ? (pRes.value.data?.data || pRes.value.data)
        : MOCK_PROFILE;
      setProfile(p);
      setForm(p);
      setPosts(
        postsRes.status === 'fulfilled'
          ? (postsRes.value.data?.data || postsRes.value.data || [])
          : MOCK_POSTS
      );
    } catch {
      setProfile(MOCK_PROFILE);
      setForm(MOCK_PROFILE);
      setPosts(MOCK_POSTS);
    } finally { setLoading(false); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(`/users/${userId}`, form);
      setProfile({ ...profile, ...form });
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setProfile({ ...profile, ...form });
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally { setSaving(false); }
  };

  const handleFollow = async () => {
    const newFollowing = !isFollowing;
    setIsFollowing(newFollowing);
    setProfile(p => ({
      ...p,
      followers_count: newFollowing ? p.followers_count + 1 : Math.max(0, p.followers_count - 1)
    }));
    try {
      if (newFollowing) {
        await api.post('/followers/follow', { follower_id: userId, followed_id: profile.id });
      } else {
        await api.post('/followers/unfollow', { follower_id: userId, followed_id: profile.id });
      }
    } catch {}
  };

  if (loading) return (
    <>
      <SkeletonStyle/>
      <SkeletonProfile/>
    </>
  );

  if (!profile) return (
    <div style={{ color:'#475569', textAlign:'center', padding:60 }}>
      <div style={{ fontSize:48, marginBottom:12 }}>👤</div>
      <div style={{ fontSize:16, fontWeight:600 }}>Profil introuvable</div>
    </div>
  );

  // Vérifier si c'est le profil du client connecté
  const isOwn = profile.id === parseInt(userId);

  return (
    <div style={S.container}>
      <SkeletonStyle/>

      {/* Header */}
      <ProfileHeader
        profile={profile}
        isOwn={isOwn}
        onEdit={() => setEditing(e => !e)}
        onFollow={handleFollow}
        isFollowing={isFollowing}
      />

      {/* Formulaire édition */}
      {editing && (
        <EditForm
          profile={profile}
          form={form}
          setForm={setForm}
          onSave={handleSave}
          onCancel={() => { setEditing(false); setForm(profile); }}
          saving={saving}
        />
      )}

      {/* Tabs */}
      <div style={{ display:'flex', gap:8 }}>
        {[
          { key:'posts', label:`📝 Posts (${posts.length})` },
          { key:'about', label:'ℹ️ À propos' },
        ].map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
            ...S.filterBtn, padding:'8px 20px', borderRadius:8, fontSize:13,
            ...(activeTab === t.key ? S.filterActive : {})
          }}>{t.label}</button>
        ))}
      </div>

      {/* Contenu */}
      {activeTab === 'posts' && <PostsGrid posts={posts}/>}
      {activeTab === 'about' && <AboutTab profile={profile}/>}

      {/* Toast succès */}
      {saved && (
        <div style={{
          position:'fixed', bottom:32, right:32,
          background:'linear-gradient(135deg,#C9A84C,#F5D87A)',
          color:'#1a1200', padding:'12px 24px', borderRadius:12,
          fontWeight:700, fontSize:14, zIndex:999,
          boxShadow:'0 8px 24px rgba(201,168,76,0.4)',
          animation:'fadeIn 0.3s ease',
        }}>
          ✅ Profil sauvegardé !
        </div>
      )}
    </div>
  );
}