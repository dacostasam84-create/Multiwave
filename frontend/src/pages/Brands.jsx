// ─────────────────────────────────────────────
// Brands.jsx — Multiwave Brands & Ads
// Auteur : Zahnouni Issam
// ─────────────────────────────────────────────
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useTranslation } from '../i18n';

// ─────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────
const S = {
  container:   { display:'flex', flexDirection:'column', gap:18 },
  card:        { background:'#13131a', border:'1px solid #1e1e2e', borderRadius:14, overflow:'hidden' },
  grid:        { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:16 },
  grid3:       { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:14 },
  input:       { background:'#0a0a0f', border:'1px solid #1e1e2e', color:'#e2e8f0', padding:'9px 14px', borderRadius:8, fontSize:13, outline:'none', boxSizing:'border-box' },
  label:       { color:'#64748b', fontSize:12, marginBottom:4, display:'block' },
  field:       { display:'flex', flexDirection:'column', gap:4, marginBottom:14 },
  filterBtn:   { background:'transparent', border:'1px solid #1e1e2e', color:'#64748b', padding:'5px 14px', borderRadius:20, cursor:'pointer', fontSize:12, fontWeight:600 },
  filterActive:{ background:'rgba(201,168,76,0.12)', border:'1px solid #C9A84C', color:'#C9A84C' },
  saveBtn:     { background:'linear-gradient(135deg,#C9A84C,#F5D87A)', color:'#1a1200', border:'none', padding:'10px 24px', borderRadius:8, fontWeight:700, cursor:'pointer', fontSize:13 },
  cancelBtn:   { background:'transparent', border:'1px solid #1e1e2e', color:'#64748b', padding:'10px 20px', borderRadius:8, cursor:'pointer', fontSize:13 },
  badge:       { padding:'2px 8px', borderRadius:20, fontSize:10, fontWeight:700 },
  statCard:    { background:'#13131a', border:'1px solid #1e1e2e', borderRadius:12, padding:'16px 20px', display:'flex', flexDirection:'column', gap:6 },
  empty:       { color:'#475569', textAlign:'center', padding:'48px 24px', fontSize:14 },
  avatar:      { width:40, height:40, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, fontWeight:700, flexShrink:0 },
};

const initials = (n) => n ? n.slice(0,2).toUpperCase() : '??';
const fmtNum   = (n) => n ? parseInt(n).toLocaleString('fr-FR') : '0';
const fmtPrice = (p) => p ? `${parseFloat(p).toLocaleString('fr-FR',{minimumFractionDigits:2})} $` : '—';

// ─────────────────────────────────────────────
// CONSTANTES
// ─────────────────────────────────────────────
const AD_STATUS = {
  pending: { color:'#fbbf24', bg:'rgba(251,191,36,0.1)',  border:'#fbbf24',  icon:'⏳' },
  active:  { color:'#4ade80', bg:'rgba(74,222,128,0.1)',  border:'#4ade80',  icon:'✅' },
  paused:  { color:'#60a5fa', bg:'rgba(96,165,250,0.1)',  border:'#60a5fa',  icon:'⏸️' },
  ended:   { color:'#64748b', bg:'rgba(100,116,139,0.1)', border:'#64748b',  icon:'🔚' },
};

const BRAND_CATEGORIES = ['Mode','Tech','Beauté','Alimentation','Sport','Auto','Immobilier','Finance','Santé','Éducation','Tourisme','Autre'];
const AD_FORMATS       = [{ value:'image', label:'🖼️ Image' },{ value:'video', label:'🎬 Vidéo' },{ value:'link', label:'🔗 Lien' }];

// ─────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────
const MOCK_BRANDS = [
  { id:1, user_id:1, name:'TechCasa',      logo_url:'https://picsum.photos/seed/b1/80/80', category:'Tech',   description:'Solutions tech pour entreprises.', followers_count:4200, is_verified:true,  is_active:true,  country:'Maroc',  website:'https://techcasa.ma' },
  { id:2, user_id:1, name:'BioArgan',      logo_url:'https://picsum.photos/seed/b2/80/80', category:'Beauté', description:'Cosmétiques bio 100% naturels.',   followers_count:8900, is_verified:true,  is_active:true,  country:'Maroc',  website:'https://bioargan.com' },
  { id:3, user_id:2, name:'CreativeStudio',logo_url:'https://picsum.photos/seed/b3/80/80', category:'Mode',   description:'Studio de design & création.',     followers_count:2100, is_verified:false, is_active:true,  country:'France', website:null },
  { id:4, user_id:2, name:'StartupMA',     logo_url:'https://picsum.photos/seed/b4/80/80', category:'Finance',description:'Fintech pour le Maghreb.',         followers_count:6700, is_verified:true,  is_active:false, country:'Maroc',  website:'https://startupma.com' },
];

const MOCK_FEEDS = [
  { id:1, brand_id:1, user_id:1, title:'Nouveau smartphone en promo 🔥', description:'Remise de 30% sur tous nos smartphones cette semaine !', media_path:'https://picsum.photos/seed/f1/600/300', media_type:'image', link_url:'https://techcasa.ma/promo', views_count:12400, likes_count:340, country_target:'Maroc', is_active:true, created_at:'2026-03-13T08:00:00Z', brand:{ name:'TechCasa' } },
  { id:2, brand_id:2, user_id:1, title:'Huile d\'argan certifiée bio ✨', description:'Découvrez notre nouvelle gamme de soins capillaires à base d\'argan pur.', media_path:'https://picsum.photos/seed/f2/600/300', media_type:'image', link_url:null, views_count:8700, likes_count:520, country_target:'Europe', is_active:true, created_at:'2026-03-12T14:00:00Z', brand:{ name:'BioArgan' } },
  { id:3, brand_id:3, user_id:2, title:'Collection Printemps 2026 🌸', description:'La nouvelle collection est disponible. Livraison gratuite au Maroc.', media_path:'https://picsum.photos/seed/f3/600/300', media_type:'image', link_url:'https://creativestudio.fr', views_count:5200, likes_count:180, country_target:'France', is_active:true, created_at:'2026-03-11T10:00:00Z', brand:{ name:'CreativeStudio' } },
];

const MOCK_ADS = [
  { id:1, user_id:1, title:'Promo Ramadan TechCasa', description:'Offres spéciales électronique.', image_url:'https://picsum.photos/seed/ad1/600/200', link:'https://techcasa.ma', budget:500.00, start_date:'2026-03-01', end_date:'2026-03-31', views_count:24800, clicks_count:1240, status:'active',  is_active:true  },
  { id:2, user_id:1, title:'BioArgan — Soin Capillaire', description:'Découvrez nos produits naturels.', image_url:'https://picsum.photos/seed/ad2/600/200', link:'https://bioargan.com', budget:300.00, start_date:'2026-03-10', end_date:'2026-04-10', views_count:9600,  clicks_count:480,  status:'active',  is_active:true  },
  { id:3, user_id:1, title:'StartupMA — Fintech Maghreb', description:'Gérez vos finances facilement.', image_url:'https://picsum.photos/seed/ad3/600/200', link:null, budget:200.00, start_date:'2026-02-01', end_date:'2026-02-28', views_count:7200,  clicks_count:210,  status:'ended',   is_active:false },
  { id:4, user_id:1, title:'CreativeStudio — Mode 2026', description:'Nouvelle collection disponible.', image_url:null, link:null, budget:150.00, start_date:'2026-03-15', end_date:'2026-04-15', views_count:0,      clicks_count:0,    status:'pending', is_active:false },
];

// ─────────────────────────────────────────────
// BRAND CARD
// ─────────────────────────────────────────────
function BrandCard({ brand, isOwn, onManage, t = (k)=>k }) {
  const [followed, setFollowed] = useState(false);

  return (
    <div style={{ ...S.card, display:'flex', flexDirection:'column' }}>
      {/* Cover */}
      <div style={{ height:80, background:'linear-gradient(135deg,#1e1e2e,#13131a)', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:`url(${brand.logo_url})`, backgroundSize:'cover', backgroundPosition:'center', opacity:0.15 }}/>
        {!brand.is_active && (
          <div style={{ position:'absolute', top:8, right:8 }}>
            <span style={{ ...S.badge, background:'rgba(248,113,113,0.2)', border:'1px solid #f87171', color:'#f87171' }}>{t('inactive')}</span>
          </div>
        )}
      </div>

      <div style={{ padding:16, display:'flex', flexDirection:'column', gap:10, flex:1 }}>
        {/* Logo + infos */}
        <div style={{ display:'flex', gap:12, alignItems:'flex-start', marginTop:-28 }}>
          <div style={{ width:52, height:52, borderRadius:12, overflow:'hidden', border:'3px solid #13131a', flexShrink:0, background:'#0a0a0f' }}>
            {brand.logo_url
              ? <img src={brand.logo_url} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e=>e.target.style.display='none'}/>
              : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg,#C9A84C,#F5D87A)', color:'#1a1200', fontWeight:700, fontSize:18 }}>{initials(brand.name)}</div>
            }
          </div>
          <div style={{ flex:1, paddingTop:28 }}>
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              <span style={{ color:'#e2e8f0', fontWeight:700, fontSize:15 }}>{brand.name}</span>
              {brand.is_verified && <span style={{ fontSize:14 }}>✅</span>}
            </div>
            <div style={{ display:'flex', gap:8, marginTop:3, flexWrap:'wrap' }}>
              {brand.category && <span style={{ ...S.badge, background:'rgba(14,165,233,0.1)', border:'1px solid #0ea5e9', color:'#0ea5e9' }}>{brand.category}</span>}
              {brand.country  && <span style={{ color:'#475569', fontSize:11 }}>📍 {brand.country}</span>}
            </div>
          </div>
        </div>

        {brand.description && <div style={{ color:'#64748b', fontSize:13, lineHeight:1.5 }}>{brand.description}</div>}

        <div style={{ display:'flex', gap:16 }}>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
            <span style={{ color:'#C9A84C', fontWeight:700, fontSize:16 }}>{fmtNum(brand.followers_count)}</span>
            <span style={{ color:'#475569', fontSize:11 }}>{t('followers')}</span>
          </div>
        </div>

        <div style={{ display:'flex', gap:8, marginTop:'auto' }}>
          {isOwn ? (
            <button onClick={() => onManage && onManage(brand)} style={{ ...S.saveBtn, flex:1, padding:'8px' }}>⚙️ Gérer</button>
          ) : (
            <button onClick={() => setFollowed(f=>!f)} style={{
              flex:1, padding:'8px', borderRadius:8, cursor:'pointer', fontWeight:700, fontSize:13,
              background: followed ? 'rgba(74,222,128,0.1)' : 'linear-gradient(135deg,#C9A84C,#F5D87A)',
              color: followed ? '#4ade80' : '#1a1200',
              border: followed ? '1px solid #4ade80' : 'none',
            }}>{followed ? t('subscribed') : t('follow')}</button>
          )}
          {brand.website && (
            <a href={brand.website} target="_blank" rel="noreferrer" style={{ padding:'8px 12px', borderRadius:8, background:'transparent', border:'1px solid #1e1e2e', color:'#64748b', fontSize:13, textDecoration:'none', display:'flex', alignItems:'center' }}>🔗</a>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// FEED CARD
// ─────────────────────────────────────────────
function FeedCard({ feed, t = (k)=>k }) {
  const [liked, setLiked] = useState(false);
  return (
    <div style={{ ...S.card }}>
      {feed.media_path && (
        <div style={{ height:180, overflow:'hidden', background:'#0a0a0f' }}>
          <img src={feed.media_path} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e=>e.target.style.display='none'}/>
        </div>
      )}
      <div style={{ padding:14 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
          <div>
            <div style={{ color:'#e2e8f0', fontWeight:700, fontSize:14, marginBottom:4 }}>{feed.title}</div>
            <span style={{ ...S.badge, background:'rgba(201,168,76,0.1)', border:'1px solid rgba(201,168,76,0.3)', color:'#C9A84C' }}>🏷️ {feed.brand?.name}</span>
          </div>
          {feed.country_target && <span style={{ color:'#475569', fontSize:11 }}>🌍 {feed.country_target}</span>}
        </div>
        {feed.description && <div style={{ color:'#64748b', fontSize:13, lineHeight:1.5, marginBottom:10 }}>{feed.description}</div>}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ display:'flex', gap:12 }}>
            <span style={{ color:'#475569', fontSize:12 }}>👁 {fmtNum(feed.views_count)}</span>
            <button onClick={() => setLiked(l=>!l)} style={{ background:'none', border:'none', cursor:'pointer', color: liked?'#f87171':'#475569', fontSize:12, padding:0 }}>
              {liked?'❤️':'🤍'} {fmtNum(feed.likes_count + (liked?1:0))}
            </button>
          </div>
          {feed.link_url && (
            <a href={feed.link_url} target="_blank" rel="noreferrer" style={{ background:'rgba(201,168,76,0.12)', border:'1px solid rgba(201,168,76,0.3)', color:'#C9A84C', padding:'5px 12px', borderRadius:8, fontSize:12, fontWeight:700, textDecoration:'none' }}>
{t('see_offer')}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// AD CARD
// ─────────────────────────────────────────────
function AdCard({ ad, onToggle, t = (k)=>k }) {
  const ss = AD_STATUS[ad.status] || AD_STATUS.pending;
  const ctr = ad.views_count > 0 ? ((ad.clicks_count / ad.views_count) * 100).toFixed(2) : '0.00';

  return (
    <div style={{ ...S.card, padding:16 }}>
      {ad.image_url && (
        <div style={{ height:120, borderRadius:8, overflow:'hidden', background:'#0a0a0f', marginBottom:12 }}>
          <img src={ad.image_url} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e=>e.target.style.display='none'}/>
        </div>
      )}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
        <div style={{ color:'#e2e8f0', fontWeight:700, fontSize:14, flex:1, paddingRight:8 }}>{ad.title}</div>
        <span style={{ ...S.badge, background:ss.bg, border:`1px solid ${ss.border}`, color:ss.color, flexShrink:0 }}>{ss.icon} {ad.status}</span>
      </div>
      {ad.description && <div style={{ color:'#64748b', fontSize:12, marginBottom:10, lineHeight:1.4 }}>{ad.description}</div>}

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginBottom:12 }}>
        {[
          { label:t('views'), val: fmtNum(ad.views_count),  color:'#60a5fa' },
          { label:t('clicks'), val: fmtNum(ad.clicks_count), color:'#4ade80' },
          { label:'CTR',    val: `${ctr}%`,                color:'#C9A84C' },
        ].map((s,i) => (
          <div key={i} style={{ background:'#0a0a0f', borderRadius:8, padding:'8px', textAlign:'center' }}>
            <div style={{ color:s.color, fontWeight:700, fontSize:15 }}>{s.val}</div>
            <div style={{ color:'#475569', fontSize:10 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
        <span style={{ color:'#475569', fontSize:12 }}>💰 {t('budget')}: <span style={{ color:'#C9A84C', fontWeight:700 }}>{fmtPrice(ad.budget)}</span></span>
        {ad.end_date && <span style={{ color:'#475569', fontSize:11 }}>📅 {t('end_date')}: {new Date(ad.end_date).toLocaleDateString('fr-FR')}</span>}
      </div>

      <button onClick={() => onToggle && onToggle(ad)} style={{
        width:'100%', padding:'8px', borderRadius:8, cursor:'pointer', fontWeight:700, fontSize:12,
        background: ad.status==='active' ? 'rgba(251,191,36,0.1)' : 'rgba(74,222,128,0.1)',
        border: `1px solid ${ad.status==='active' ? '#fbbf24' : '#4ade80'}`,
        color: ad.status==='active' ? '#fbbf24' : '#4ade80',
      }}>
        {ad.status === 'active' ? t('pause') : ad.status === 'paused' ? t('resume') : ad.status === 'pending' ? t('activate') : t('ended_btn')}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// CRÉER UNE MARQUE
// ─────────────────────────────────────────────
function CreateBrand({ userId, onCreated, t = (k)=>k }) {
  const [form, setForm] = useState({ name:'', description:'', category:'', website:'', logo_url:'', country:'' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handle = async () => {
    if (!form.name.trim()) { setError(t('name_required')); return; }
    setLoading(true);
    try {
      const res = await api.post('/brands', { ...form, user_id: userId });
      onCreated && onCreated(res.data?.data || res.data);
    } catch(err) { setError(err.response?.data?.message || 'Erreur création.'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ background:'#13131a', border:'1px solid #1e1e2e', borderRadius:14, padding:24, maxWidth:560 }}>
      <h3 style={{ color:'#e2e8f0', fontSize:17, margin:'0 0 20px', fontWeight:700 }}>{t('create_brand_title')}</h3>
      {error && <div style={{ background:'rgba(248,113,113,0.1)', border:'1px solid #f87171', color:'#f87171', padding:'9px 14px', borderRadius:8, fontSize:13, marginBottom:16 }}>⚠️ {error}</div>}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        <div style={{ gridColumn:'1/-1' }}>
          <label style={S.label}>{t('brand_name')} *</label>
          <input style={{ ...S.input, width:'100%' }} value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Ex: TechCasa"/>
        </div>
        <div>
          <label style={S.label}>{t('category')}</label>
          <select style={{ ...S.input, width:'100%' }} value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>
            <option value="">-- Sélectionner --</option>
            {BRAND_CATEGORIES.map(c=><option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label style={S.label}>{t('country')}</label>
          <input style={{ ...S.input, width:'100%' }} value={form.country} onChange={e=>setForm(f=>({...f,country:e.target.value}))} placeholder="Maroc, France..."/>
        </div>
        <div style={{ gridColumn:'1/-1' }}>
          <label style={S.label}>{t('logo_url')}</label>
          <input style={{ ...S.input, width:'100%' }} value={form.logo_url} onChange={e=>setForm(f=>({...f,logo_url:e.target.value}))} placeholder="https://..."/>
        </div>
        <div style={{ gridColumn:'1/-1' }}>
          <label style={S.label}>{t('website')}</label>
          <input style={{ ...S.input, width:'100%' }} value={form.website} onChange={e=>setForm(f=>({...f,website:e.target.value}))} placeholder="https://..."/>
        </div>
        <div style={{ gridColumn:'1/-1' }}>
          <label style={S.label}>{t('description')}</label>
          <textarea style={{ ...S.input, width:'100%', minHeight:80, resize:'vertical' }} value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))}/>
        </div>
      </div>
      <div style={{ display:'flex', gap:10, justifyContent:'flex-end', marginTop:8 }}>
        <button style={S.cancelBtn} onClick={() => onCreated && onCreated(null)}>{t('cancel')}</button>
        <button style={S.saveBtn} onClick={handle} disabled={loading}>{loading ? '...' : t('create_brand_btn')}</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// CRÉER UNE PUB
// ─────────────────────────────────────────────
function CreateAd({ userId, onCreated, t = (k)=>k }) {
  const [form, setForm] = useState({ title:'', description:'', image_url:'', link:'', budget:'', start_date:'', end_date:'' });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const handle = async () => {
    if (!form.title.trim()) { setError(t('title_required')); return; }
    setLoading(true);
    try {
      const res = await api.post('/ads', { ...form, user_id: userId, budget: parseFloat(form.budget)||0 });
      onCreated && onCreated(res.data?.data || res.data);
    } catch(err) { setError(err.response?.data?.message || 'Erreur création.'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ background:'#13131a', border:'1px solid #1e1e2e', borderRadius:14, padding:24, maxWidth:560 }}>
      <h3 style={{ color:'#e2e8f0', fontSize:17, margin:'0 0 20px', fontWeight:700 }}>{t('create_ad_title')}</h3>
      {error && <div style={{ background:'rgba(248,113,113,0.1)', border:'1px solid #f87171', color:'#f87171', padding:'9px 14px', borderRadius:8, fontSize:13, marginBottom:16 }}>⚠️ {error}</div>}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        <div style={{ gridColumn:'1/-1' }}>
          <label style={S.label}>{t('ad_title')} *</label>
          <input style={{ ...S.input, width:'100%' }} value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="Titre de votre pub"/>
        </div>
        <div style={{ gridColumn:'1/-1' }}>
          <label style={S.label}>{t('image_url')}</label>
          <input style={{ ...S.input, width:'100%' }} value={form.image_url} onChange={e=>setForm(f=>({...f,image_url:e.target.value}))} placeholder="https://..."/>
        </div>
        <div style={{ gridColumn:'1/-1' }}>
          <label style={S.label}>{t('destination_link')}</label>
          <input style={{ ...S.input, width:'100%' }} value={form.link} onChange={e=>setForm(f=>({...f,link:e.target.value}))} placeholder="https://..."/>
        </div>
        <div>
          <label style={S.label}>{t('ad_budget')}</label>
          <input style={{ ...S.input, width:'100%' }} type="number" value={form.budget} onChange={e=>setForm(f=>({...f,budget:e.target.value}))} placeholder="0.00"/>
        </div>
        <div>
          <label style={S.label}>{t('start_date')}</label>
          <input style={{ ...S.input, width:'100%' }} type="date" value={form.start_date} onChange={e=>setForm(f=>({...f,start_date:e.target.value}))}/>
        </div>
        <div>
          <label style={S.label}>{t('ad_end_date')}</label>
          <input style={{ ...S.input, width:'100%' }} type="date" value={form.end_date} onChange={e=>setForm(f=>({...f,end_date:e.target.value}))}/>
        </div>
        <div style={{ gridColumn:'1/-1' }}>
          <label style={S.label}>{t('description')}</label>
          <textarea style={{ ...S.input, width:'100%', minHeight:70, resize:'vertical' }} value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))}/>
        </div>
      </div>
      <div style={{ display:'flex', gap:10, justifyContent:'flex-end', marginTop:8 }}>
        <button style={S.cancelBtn} onClick={() => onCreated && onCreated(null)}>{t('cancel')}</button>
        <button style={S.saveBtn} onClick={handle} disabled={loading}>{loading ? '...' : t('launch_ad')}</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// BRANDS PRINCIPAL
// ─────────────────────────────────────────────
export default function Brands({ userId }) {
  const { t } = useTranslation();
  const [tab,      setTab]      = useState('feed');
  const [brands,   setBrands]   = useState([]);
  const [feeds,    setFeeds]    = useState([]);
  const [ads,      setAds]      = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [subTab,   setSubTab]   = useState('browse'); // browse | create

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [bRes, fRes, aRes] = await Promise.allSettled([
        api.get('/brands'),
        api.get('/brand-feeds'),
        api.get(`/ads?user_id=${userId}`),
      ]);
      setBrands(bRes.status==='fulfilled' ? bRes.value.data?.data||bRes.value.data||[] : MOCK_BRANDS);
      setFeeds(fRes.status==='fulfilled'  ? fRes.value.data?.data||fRes.value.data||[]  : MOCK_FEEDS);
      setAds(aRes.status==='fulfilled'    ? aRes.value.data?.data||aRes.value.data||[]    : MOCK_ADS);
    } catch {
      setBrands(MOCK_BRANDS); setFeeds(MOCK_FEEDS); setAds(MOCK_ADS);
    } finally { setLoading(false); }
  };

  const toggleAd = async (ad) => {
    const nextStatus = ad.status === 'active' ? 'paused' : ad.status === 'paused' ? 'active' : ad.status === 'pending' ? 'active' : ad.status;
    setAds(p => p.map(a => a.id===ad.id ? { ...a, status:nextStatus, is_active:nextStatus==='active' } : a));
    try { await api.patch(`/ads/${ad.id}`, { status: nextStatus }); } catch {}
  };

  // Stats globales
  const totalViews  = ads.reduce((a,ad) => a + (ad.views_count||0), 0);
  const totalClicks = ads.reduce((a,ad) => a + (ad.clicks_count||0), 0);
  const totalBudget = ads.reduce((a,ad) => a + parseFloat(ad.budget||0), 0);
  const activeAds   = ads.filter(a => a.status === 'active').length;

  const TABS = [
    { key:'feed',   label:t('brand_feed') },
    { key:'brands', label:t('brands_tab') },
    { key:'ads',    label:t('ads_tab') },
  ];

  const filteredFeeds  = feeds.filter(f => f.title.toLowerCase().includes(search.toLowerCase()));
  const filteredBrands = brands.filter(b => b.name.toLowerCase().includes(search.toLowerCase()));
  const filteredAds    = ads.filter(a => a.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={S.container}>

      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
        <h2 style={{ color:'#e2e8f0', fontSize:20, margin:0, fontWeight:700 }}>🏷️ {t('brands_title')}</h2>
        <div style={{ display:'flex', gap:8 }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => { setTab(t.key); setSubTab('browse'); }} style={{
              ...S.filterBtn, padding:'7px 18px', borderRadius:8, fontSize:13,
              ...(tab===t.key ? S.filterActive : {})
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      {/* Stats globales */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:12 }}>
        {[
          { label:t('brands_count'), val: brands.length,         icon:'🏷️', color:'#C9A84C' },
          { label:t('active_ads'),   val: activeAds,             icon:'📢', color:'#4ade80' },
          { label:t('total_views'),  val: fmtNum(totalViews),    icon:'👁',  color:'#60a5fa' },
          { label:t('total_clicks'), val: fmtNum(totalClicks),   icon:'🖱️', color:'#a78bfa' },
          { label:t('total_budget'), val: fmtPrice(totalBudget), icon:'💰', color:'#f97316' },
        ].map((s,i) => (
          <div key={i} style={S.statCard}>
            <span style={{ fontSize:22 }}>{s.icon}</span>
            <span style={{ color:s.color, fontWeight:800, fontSize:20 }}>{s.val}</span>
            <span style={{ color:'#475569', fontSize:12 }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Recherche */}
      <div style={{ position:'relative', maxWidth:400 }}>
        <input style={{ ...S.input, width:'100%', paddingLeft:36 }} placeholder={`🔍 ${t('search')}`} value={search} onChange={e=>setSearch(e.target.value)}/>
        <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', fontSize:14 }}>🔍</span>
      </div>

      {/* ── FEED ── */}
      {tab === 'feed' && (
        <>
          <div style={{ display:'flex', justifyContent:'flex-end' }}>
            <button onClick={() => setSubTab(s => s==='browse'?'create':'browse')} style={{ ...S.saveBtn, padding:'8px 20px' }}>
              {subTab==='create' ? t('back') : t('create_post')}
            </button>
          </div>
          {subTab === 'create' ? (
            <CreateBrandFeedForm userId={userId} brands={brands} onCreated={(f) => { if(f){ setFeeds(p=>[f,...p]); } setSubTab('browse'); }} t={t}/>
          ) : (
            loading ? <div style={S.empty}>{t('loading')}</div> :
            filteredFeeds.length === 0 ? <div style={S.empty}><div style={{fontSize:48,marginBottom:12}}>📡</div>{t('no_feed')}</div> :
            <div style={S.grid}>{filteredFeeds.map(f => <FeedCard key={f.id} feed={f} t={t}/>)}</div>
          )}
        </>
      )}

      {/* ── MARQUES ── */}
      {tab === 'brands' && (
        <>
          <div style={{ display:'flex', justifyContent:'flex-end' }}>
            <button onClick={() => setSubTab(s => s==='browse'?'create':'browse')} style={{ ...S.saveBtn, padding:'8px 20px' }}>
              {subTab==='create' ? t('back') : t('create_brand')}
            </button>
          </div>
          {subTab === 'create' ? (
            <CreateBrand userId={userId} onCreated={(b) => { if(b){ setBrands(p=>[b,...p]); } setSubTab('browse'); }} t={t}/>
          ) : (
            loading ? <div style={S.empty}>{t('loading')}</div> :
            filteredBrands.length === 0 ? <div style={S.empty}><div style={{fontSize:48,marginBottom:12}}>🏷️</div>{t('no_brands')}</div> :
            <div style={S.grid}>{filteredBrands.map(b => <BrandCard key={b.id} brand={b} isOwn={b.user_id===userId} onManage={() => {}} t={t}/>)}</div>
          )}
        </>
      )}

      {/* ── ADS ── */}
      {tab === 'ads' && (
        <>
          <div style={{ display:'flex', justifyContent:'flex-end' }}>
            <button onClick={() => setSubTab(s => s==='browse'?'create':'browse')} style={{ ...S.saveBtn, padding:'8px 20px' }}>
              {subTab==='create' ? t('back') : t('create_ad')}
            </button>
          </div>
          {subTab === 'create' ? (
            <CreateAd userId={userId} onCreated={(a) => { if(a){ setAds(p=>[a,...p]); } setSubTab('browse'); }} t={t}/>
          ) : (
            loading ? <div style={S.empty}>{t('loading')}</div> :
            filteredAds.length === 0 ? <div style={S.empty}><div style={{fontSize:48,marginBottom:12}}>📢</div>{t('no_ads')}</div> :
            <div style={S.grid3}>{filteredAds.map(a => <AdCard key={a.id} ad={a} onToggle={toggleAd} t={t}/>)}</div>
          )}
        </>
      )}

    </div>
  );
}

// ─────────────────────────────────────────────
// CRÉER UN POST DE MARQUE
// ─────────────────────────────────────────────
function CreateBrandFeedForm({ userId, brands, onCreated, t = (k)=>k }) {
  const [form, setForm] = useState({ brand_id:'', title:'', description:'', media_path:'', media_type:'image', link_url:'', country_target:'' });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const handle = async () => {
    if (!form.title.trim() || !form.brand_id) { setError(t('brand_title_required')); return; }
    setLoading(true);
    try {
      const res = await api.post('/brand-feeds', { ...form, user_id: userId, brand_id: parseInt(form.brand_id) });
      onCreated && onCreated(res.data?.data || res.data);
    } catch(err) { setError(err.response?.data?.message || 'Erreur création.'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ background:'#13131a', border:'1px solid #1e1e2e', borderRadius:14, padding:24, maxWidth:560 }}>
      <h3 style={{ color:'#e2e8f0', fontSize:17, margin:'0 0 20px', fontWeight:700 }}>{t('create_feed_title')}</h3>
      {error && <div style={{ background:'rgba(248,113,113,0.1)', border:'1px solid #f87171', color:'#f87171', padding:'9px 14px', borderRadius:8, fontSize:13, marginBottom:16 }}>⚠️ {error}</div>}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        <div style={{ gridColumn:'1/-1' }}>
          <label style={S.label}>{t('brand_required')} *</label>
          <select style={{ ...S.input, width:'100%' }} value={form.brand_id} onChange={e=>setForm(f=>({...f,brand_id:e.target.value}))}>
            <option value="">-- Sélectionner une marque --</option>
            {brands.filter(b=>b.user_id===userId).map(b=><option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>
        <div style={{ gridColumn:'1/-1' }}>
          <label style={S.label}>{t('ad_title')} *</label>
          <input style={{ ...S.input, width:'100%' }} value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="Titre du post"/>
        </div>
        <div>
          <label style={S.label}>{t('media_type')}</label>
          <select style={{ ...S.input, width:'100%' }} value={form.media_type} onChange={e=>setForm(f=>({...f,media_type:e.target.value}))}>
            {AD_FORMATS.map(t=><option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <div>
          <label style={S.label}>{t('target_country')}</label>
          <input style={{ ...S.input, width:'100%' }} value={form.country_target} onChange={e=>setForm(f=>({...f,country_target:e.target.value}))} placeholder="Maroc, Europe..."/>
        </div>
        <div style={{ gridColumn:'1/-1' }}>
          <label style={S.label}>{t('media_url')}</label>
          <input style={{ ...S.input, width:'100%' }} value={form.media_path} onChange={e=>setForm(f=>({...f,media_path:e.target.value}))} placeholder="https://..."/>
        </div>
        <div style={{ gridColumn:'1/-1' }}>
          <label style={S.label}>{t('link_url')}</label>
          <input style={{ ...S.input, width:'100%' }} value={form.link_url} onChange={e=>setForm(f=>({...f,link_url:e.target.value}))} placeholder="https://..."/>
        </div>
        <div style={{ gridColumn:'1/-1' }}>
          <label style={S.label}>{t('description')}</label>
          <textarea style={{ ...S.input, width:'100%', minHeight:80, resize:'vertical' }} value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))}/>
        </div>
      </div>
      <div style={{ display:'flex', gap:10, justifyContent:'flex-end', marginTop:8 }}>
        <button style={S.cancelBtn} onClick={() => onCreated && onCreated(null)}>{t('cancel')}</button>
        <button style={S.saveBtn} onClick={handle} disabled={loading}>{loading ? '...' : t('publish')}</button>
      </div>
    </div>
  );
}