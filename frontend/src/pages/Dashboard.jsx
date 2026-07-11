import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { connectSocket, disconnectSocket } from '../services/socket';
import { useTranslation, LANGUAGES } from '../i18n';
import STTWidget from '../components/STTWidget';
import VideoRoom from '../components/VideoRoom';
import Profile from './Profile';
import Marketplace from './Marketplace';
import Dating from './Dating';
import Channels from './Channels';
import Groups from './Groups';
import Feed from './Feed';
import Messages from './Messages';
import Brands from './Brands';
import Settings from './Settings';
import Wallet from './Wallets';
import Medias from './Media';
import NotificationBell from '../components/NotificationBell';
import GlobalSearch from '../components/GlobalSearch';
import { ThemeToggle } from '../components/ThemeContext';
import { ErrorBoundary } from '../components/ErorrsPages';
import api from '../services/api';
import Analytics from './Analytics';
import ModerationDashboard from './ModerationAgent';

// ─────────────────────────────────────────────
// WAVE LOGO
// ─────────────────────────────────────────────
function WaveLogo({ collapsed }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10, overflow:'hidden' }}>
      <div style={{ position:'relative', width:36, height:36, flexShrink:0 }}>
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <defs>
            <linearGradient id="iconGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="#C9A84C"/>
              <stop offset="40%"  stopColor="#F5D87A"/>
              <stop offset="70%"  stopColor="#E8B84B"/>
              <stop offset="100%" stopColor="#B8882A"/>
            </linearGradient>
          </defs>
          <circle cx="18" cy="18" r="17" fill="url(#iconGold)" opacity="0.10"/>
          <polygon points="18,5 22,18 18,31 14,18" fill="url(#iconGold)" opacity="0.08"/>
          <path d="M4 18 Q8 11 12 18 Q16 25 20 18 Q24 11 28 18 Q30 21.5 32 18" stroke="url(#iconGold)" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
          <path d="M4 22 Q8 15 12 22 Q16 29 20 22 Q24 15 28 22 Q30 25.5 32 22" stroke="url(#iconGold)" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.45"/>
          <path d="M6 14.5 Q10 9 14 14.5 Q18 20 22 14.5 Q26 9 30 14.5" stroke="url(#iconGold)" strokeWidth="0.7" strokeLinecap="round" fill="none" opacity="0.25"/>
        </svg>
      </div>
      {!collapsed && (
        <div style={{ display:'flex', flexDirection:'column', lineHeight:1, gap:3 }}>
          <svg width="130" height="5" viewBox="0 0 130 5" style={{ display:'block' }}>
            <defs>
              <linearGradient id="lineGold" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="#C9A84C" stopOpacity="0"/>
                <stop offset="50%"  stopColor="#F5D87A" stopOpacity="0.7"/>
                <stop offset="100%" stopColor="#C9A84C" stopOpacity="0"/>
              </linearGradient>
            </defs>
            <line x1="0" y1="1.5" x2="130" y2="1.5" stroke="url(#lineGold)" strokeWidth="0.8"/>
            <line x1="0" y1="3.5" x2="130" y2="3.5" stroke="url(#lineGold)" strokeWidth="0.4" opacity="0.5"/>
          </svg>
          <svg width="130" height="26" viewBox="0 0 130 26" style={{ display:'block' }}>
            <defs>
              <linearGradient id="logoGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%"   stopColor="#C9A84C"/>
                <stop offset="30%"  stopColor="#F5D87A"/>
                <stop offset="60%"  stopColor="#E8B84B"/>
                <stop offset="85%"  stopColor="#FFF0A0"/>
                <stop offset="100%" stopColor="#B8882A"/>
              </linearGradient>
              <linearGradient id="logoSheen" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="#FFF5C0" stopOpacity="0"/>
                <stop offset="45%"  stopColor="#FFF5C0" stopOpacity="0.55"/>
                <stop offset="55%"  stopColor="#FFF5C0" stopOpacity="0.55"/>
                <stop offset="100%" stopColor="#FFF5C0" stopOpacity="0"/>
              </linearGradient>
            </defs>
            <text x="66" y="20" textAnchor="middle" fontFamily="'Georgia','Times New Roman',serif" fontSize="17" fontWeight="400" letterSpacing="3" fill="#5a3c00" opacity="0.45">MULTIWAVE</text>
            <text x="65" y="19" textAnchor="middle" fontFamily="'Georgia','Times New Roman',serif" fontSize="17" fontWeight="400" letterSpacing="3" fill="url(#logoGold)">MULTIWAVE</text>
            <text x="65" y="19" textAnchor="middle" fontFamily="'Georgia','Times New Roman',serif" fontSize="17" fontWeight="400" letterSpacing="3" fill="url(#logoSheen)" opacity="0.5">MULTIWAVE</text>
          </svg>
          <svg width="130" height="8" viewBox="0 0 130 8" style={{ display:'block' }}>
            <defs>
              <linearGradient id="waveGold1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="#C9A84C" stopOpacity="0.3"/>
                <stop offset="50%"  stopColor="#F5D87A" stopOpacity="1"/>
                <stop offset="100%" stopColor="#C9A84C" stopOpacity="0.3"/>
              </linearGradient>
            </defs>
            <path d="M0 4 Q16 1 32 4 Q48 7 65 4 Q82 1 97 4 Q113 7 130 4" fill="none" stroke="url(#waveGold1)" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          <svg width="130" height="12" viewBox="0 0 130 12" style={{ display:'block', marginTop:1 }}>
            <defs>
              <linearGradient id="tagGold" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="#7a6020"/>
                <stop offset="50%"  stopColor="#C9A84C"/>
                <stop offset="100%" stopColor="#7a6020"/>
              </linearGradient>
            </defs>
            <circle cx="8"   cy="6" r="1.2" fill="#C9A84C" opacity="0.5"/>
            <circle cx="122" cy="6" r="1.2" fill="#C9A84C" opacity="0.5"/>
            <text x="65" y="9" textAnchor="middle" fontFamily="'Georgia','Times New Roman',serif" fontSize="8" letterSpacing="2.5" fill="url(#tagGold)" opacity="0.85">connect · explore</text>
          </svg>
          <svg width="130" height="5" viewBox="0 0 130 5" style={{ display:'block' }}>
            <line x1="0" y1="1.5" x2="130" y2="1.5" stroke="url(#lineGold)" strokeWidth="0.8"/>
            <line x1="0" y1="3.5" x2="130" y2="3.5" stroke="url(#lineGold)" strokeWidth="0.4" opacity="0.5"/>
          </svg>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// LANGUAGE SELECTOR
// ─────────────────────────────────────────────
function LangSelector({ collapsed }) {
  const { lang, changeLang } = useTranslation();
  const [open, setOpen] = useState(false);
  const current = LANGUAGES.find(l => l.value === lang) || LANGUAGES[0];

  return (
    <div style={{ position:'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        title="Changer la langue"
        style={{
          background:'rgba(201,168,76,0.06)', border:'1px solid rgba(201,168,76,0.15)',
          color:'#C9A84C', borderRadius:8, padding: collapsed ? '6px' : '6px 10px',
          cursor:'pointer', fontSize:14, display:'flex', alignItems:'center', gap:5,
          width: collapsed ? 32 : 'auto',
          justifyContent:'center',
        }}
      >
        <span>{current.flag}</span>
        {!collapsed && <span style={{ fontSize:11, fontWeight:600 }}>{current.value.toUpperCase()}</span>}
      </button>

      {open && (
        <div style={{
          position:'absolute', bottom:'calc(100% + 6px)', left:0,
          background:'#0d0d18', border:'1px solid #1e1e2e',
          borderRadius:10, padding:6, zIndex:500,
          width:180, maxHeight:280, overflowY:'auto',
          boxShadow:'0 8px 32px rgba(0,0,0,0.6)',
        }}>
          {LANGUAGES.map(l => (
            <button key={l.value} onClick={() => { changeLang(l.value); setOpen(false); }} style={{
              width:'100%', display:'flex', alignItems:'center', gap:8,
              padding:'7px 10px', borderRadius:7, cursor:'pointer',
              background: lang === l.value ? 'rgba(201,168,76,0.12)' : 'transparent',
              border: 'none',
              color: lang === l.value ? '#C9A84C' : '#94a3b8',
              fontSize:12, fontWeight: lang === l.value ? 700 : 400,
            }}>
              <span style={{ fontSize:16 }}>{l.flag}</span>
              <span>{l.label}</span>
              {lang === l.value && <span style={{ marginLeft:'auto', fontSize:10 }}>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// CALLS
// ─────────────────────────────────────────────
function CallsModule({ userId, socket }) {
  const [calls, setCalls]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCall, setActiveCall] = useState(null);
  const [callType, setCallType]     = useState('video');
  const [receiverId, setReceiverId] = useState('');
  useEffect(()=>{ loadCalls(); },[]);
  const loadCalls = async () => {
    try { setLoading(true); const res=await api.get('/calls'); setCalls(res.data.data||res.data||[]); }
    catch { setCalls([{id:1,caller_id:1,receiver_id:2,room_id:'room_abc',type:'video',status:'ended',duration:320,started_at:'2026-03-10T14:00:00Z'},{id:2,caller_id:2,receiver_id:1,room_id:'room_def',type:'audio',status:'missed',duration:null,started_at:'2026-03-11T09:30:00Z'}]); }
    finally { setLoading(false); }
  };
  const SC={ended:{color:'#4ade80',bg:'rgba(74,222,128,0.1)',border:'#4ade80'},missed:{color:'#f87171',bg:'rgba(248,113,113,0.1)',border:'#f87171'},pending:{color:'#fbbf24',bg:'rgba(251,191,36,0.1)',border:'#fbbf24'}};
  const fmtD=(s)=>{ if(!s)return'--'; return`${Math.floor(s/60)}m${(s%60).toString().padStart(2,'0')}s`; };
  const startCall=async()=>{ if(!receiverId)return; try{ const roomId=`room_${Date.now()}`; await api.post('/calls',{caller_id:userId,receiver_id:receiverId,room_id:roomId,type:callType}); setActiveCall({roomId,type:callType,receiverId}); if(socket)socket.emit('call-invite',{roomId,callerId:userId,receiverId,type:callType}); }catch(e){console.error(e);} };
  if(activeCall)return(<div style={M.container}><div style={M.header}><h2 style={M.title}>📹 Appel en cours</h2><button style={{...M.saveBtn,background:'#f87171'}} onClick={()=>setActiveCall(null)}>✕ Terminer</button></div><div style={{...M.createCard,textAlign:'center',padding:60}}><div style={{fontSize:64,marginBottom:16}}>{activeCall.type==='video'?'📹':'🎙️'}</div><div style={{color:'#e2e8f0',fontSize:20,fontWeight:700,marginBottom:8}}>Appel {activeCall.type}</div><div style={{color:'#64748b',fontSize:13,marginBottom:24}}>Room: {activeCall.roomId}</div><div style={{display:'flex',gap:16,justifyContent:'center'}}><button style={M.joinBtn} onClick={()=>setActiveCall(null)}>🔇 Couper</button><button style={{...M.saveBtn,background:'#f87171'}} onClick={()=>setActiveCall(null)}>📵 Raccrocher</button></div></div></div>);
  return(<div style={M.container}><div style={M.header}><h2 style={M.title}>📞 Appels</h2><div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}><input style={{...M.searchInput,width:130}} placeholder="ID destinataire" value={receiverId} onChange={e=>setReceiverId(e.target.value)} type="number"/><select style={{...M.input,width:110,margin:0}} value={callType} onChange={e=>setCallType(e.target.value)}><option value="video">📹 Vidéo</option><option value="audio">🎙️ Audio</option><option value="debate">⚔️ Débat</option></select><button style={M.saveBtn} onClick={startCall}>📞 Appeler</button></div></div>{loading?<div style={M.empty}>Chargement...</div>:<div style={{display:'flex',flexDirection:'column',gap:8}}>{calls.map(c=>{const sc=SC[c.status]||SC.ended;return(<div key={c.id} style={{...M.card,flexDirection:'row',alignItems:'center',gap:14,padding:'14px 18px'}}><span style={{fontSize:22}}>{c.type==='video'?'📹':c.type==='audio'?'🎙️':'⚔️'}</span><div style={{flex:1}}><div style={{color:'#e2e8f0',fontWeight:700,fontSize:13}}>{c.type} — {c.room_id}</div><div style={{color:'#64748b',fontSize:11,marginTop:2}}>{c.started_at?new Date(c.started_at).toLocaleString('fr-FR'):'—'}</div></div><div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:4}}><span style={{background:sc.bg,border:`1px solid ${sc.border}`,color:sc.color,padding:'2px 8px',borderRadius:20,fontSize:10,fontWeight:700}}>{c.status}</span><span style={{color:'#64748b',fontSize:11}}>⏱ {fmtD(c.duration)}</span></div></div>);})}</div>}</div>);
}

// ─────────────────────────────────────────────
// DEBATES
// ─────────────────────────────────────────────
const LANGS_DEBATES=['fr','en','ar','es','de','pt','tr','ru','ja','zh'];
function Debates({ userId }) {
  const [step,setStep]=useState('browse');const [debates,setDebates]=useState([]);const [loading,setLoading]=useState(true);const [filterStatus,setFilterStatus]=useState('');const [search,setSearch]=useState('');const [form,setForm]=useState({title:'',description:'',language:'fr',max_participants:10,max_duration:5400,scheduled_at:''});const [formError,setFormError]=useState('');
  useEffect(()=>{loadDebates();},[]);
  const loadDebates=async()=>{ try{setLoading(true);const res=await api.get('/debates');setDebates(res.data.data||res.data||[]);}catch{setDebates([{id:1,host_id:1,title:'IA : menace ou opportunité ?',description:"Impact de l'IA sur l'emploi.",status:'live',language:'fr',max_participants:20,participants_count:14,views_count:1240},{id:2,host_id:2,title:'Démocratie vs Technocratie',description:'Gouvernance par les experts ?',status:'scheduled',language:'fr',max_participants:10,participants_count:0,views_count:0,scheduled_at:'2026-03-15T18:00:00Z'}]);}finally{setLoading(false);} };
  const SS={live:{color:'#f87171',bg:'rgba(248,113,113,0.15)',border:'#f87171',icon:'🔴'},scheduled:{color:'#fbbf24',bg:'rgba(251,191,36,0.1)',border:'#fbbf24',icon:'📅'},ended:{color:'#64748b',bg:'rgba(100,116,139,0.1)',border:'#64748b',icon:'✅'}};
  const filtered=debates.filter(d=>d.title.toLowerCase().includes(search.toLowerCase())&&(!filterStatus||d.status===filterStatus));
  const handleCreate=async()=>{ if(!form.title.trim()){setFormError('Titre requis.');return;} try{await api.post('/debates',{...form,host_id:userId});setForm({title:'',description:'',language:'fr',max_participants:10,max_duration:5400,scheduled_at:''});setStep('browse');loadDebates();}catch(err){setFormError(err.response?.data?.message||'Erreur.');} };
  return(<div style={M.container}><div style={M.header}><h2 style={M.title}>⚔️ Débats</h2><div style={M.headerActions}>{['browse','create'].map(t=><button key={t} style={{...M.tabBtn,...(step===t?M.tabActive:{})}} onClick={()=>setStep(t)}>{t==='browse'?'🔍 Explorer':'+ Organiser'}</button>)}</div></div>
    {step==='browse'&&<><div style={{display:'flex',gap:12,flexWrap:'wrap'}}><input style={{...M.searchInput,flex:1}} placeholder="🔍 Rechercher..." value={search} onChange={e=>setSearch(e.target.value)}/><div style={{display:'flex',gap:8}}>{['','live','scheduled','ended'].map(s=><button key={s} style={{...M.filterBtn,...(filterStatus===s?M.filterActive:{})}} onClick={()=>setFilterStatus(s)}>{s===''?'Tous':SS[s]?.icon+' '+s}</button>)}</div></div>{loading?<div style={M.empty}>Chargement...</div>:<div style={M.grid}>{filtered.map(d=>{const ss=SS[d.status]||SS.ended;return(<div key={d.id} style={M.card}><div style={M.cardTop}><span style={{fontSize:24}}>{ss.icon}</span><span style={{...M.badge,background:ss.bg,border:`1px solid ${ss.border}`,color:ss.color}}>{d.status}</span></div><div style={{flex:1}}><div style={M.cardName}>{d.title}</div><div style={M.cardDesc}>{d.description?.substring(0,80)}</div></div><div style={{display:'flex',gap:8,flexWrap:'wrap'}}><span style={M.meta}>🌐 {d.language?.toUpperCase()}</span><span style={M.meta}>👥 {d.participants_count}/{d.max_participants}</span></div><div style={M.cardFooter}>{d.scheduled_at&&<span style={{color:'#64748b',fontSize:11}}>📅 {new Date(d.scheduled_at).toLocaleString('fr-FR')}</span>}<button style={{...M.joinBtn,...(d.status==='live'?{background:'rgba(248,113,113,0.15)',border:'1px solid #f87171',color:'#f87171'}:{})}} disabled={d.status==='ended'}>{d.status==='live'?'🔴 Rejoindre':d.status==='scheduled'?"📅 S'inscrire":'✅ Terminé'}</button></div></div>);})}</div>}</>}
    {step==='create'&&<div style={M.createCard}><h3 style={M.createTitle}>⚔️ Organiser un Débat</h3>{formError&&<div style={M.errorBox}>⚠️ {formError}</div>}<div style={M.formGrid}><div style={{...M.field,gridColumn:'1/-1'}}><label style={M.label}>Titre *</label><input style={M.input} value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></div><div style={M.field}><label style={M.label}>Langue</label><select style={M.input} value={form.language} onChange={e=>setForm({...form,language:e.target.value})}>{LANGS_DEBATES.map(l=><option key={l}>{l.toUpperCase()}</option>)}</select></div><div style={M.field}><label style={M.label}>Max participants</label><input style={M.input} type="number" value={form.max_participants} onChange={e=>setForm({...form,max_participants:parseInt(e.target.value)})}/></div><div style={M.field}><label style={M.label}>Date planifiée</label><input style={M.input} type="datetime-local" value={form.scheduled_at} onChange={e=>setForm({...form,scheduled_at:e.target.value})}/></div></div><div style={M.field}><label style={M.label}>Description</label><textarea style={{...M.input,minHeight:80,resize:'vertical'}} value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></div><div style={{display:'flex',gap:12,justifyContent:'flex-end'}}><button style={M.cancelBtn} onClick={()=>setStep('browse')}>Annuler</button><button style={M.saveBtn} onClick={handleCreate}>⚔️ Créer</button></div></div>}
  </div>);
}

// ─────────────────────────────────────────────
// JOBS
// ─────────────────────────────────────────────
const JOB_TYPES=[{value:'full_time',label:'💼 Temps plein'},{value:'part_time',label:'⏰ Partiel'},{value:'freelance',label:'🧑‍💻 Freelance'},{value:'internship',label:'🎓 Stage'},{value:'remote',label:'🏠 Remote'}];
const CURRENCIES_J=['USD','EUR','MAD','GBP','CAD','AED','SAR'];
const SKILLS_LIST=['React','Node.js','Python','Laravel','Flutter','DevOps','UI/UX','SQL','MongoDB','AWS','TypeScript','Docker'];
const TCJ={full_time:{bg:'rgba(0,229,255,0.1)',border:'#00e5ff',color:'#00e5ff'},part_time:{bg:'rgba(251,191,36,0.1)',border:'#fbbf24',color:'#fbbf24'},freelance:{bg:'rgba(167,139,250,0.1)',border:'#a78bfa',color:'#a78bfa'},internship:{bg:'rgba(74,222,128,0.1)',border:'#4ade80',color:'#4ade80'},remote:{bg:'rgba(251,146,60,0.1)',border:'#fb923c',color:'#fb923c'}};
function Jobs({ userId }) {
  const [step,setStep]=useState('browse');const [jobs,setJobs]=useState([]);const [loading,setLoading]=useState(true);const [search,setSearch]=useState('');const [filterType,setFilterType]=useState('');const [form,setForm]=useState({title:'',company:'',description:'',location:'',country:'',type:'full_time',salary_min:'',salary_max:'',currency:'USD',skills:[]});const [formError,setFormError]=useState('');
  useEffect(()=>{loadJobs();},[]);
  const loadJobs=async()=>{ try{setLoading(true);const res=await api.get('/jobs');setJobs(res.data.data||res.data||[]);}catch{setJobs([{id:1,title:'Développeur React Senior',company:'TechCasa',description:'Interfaces modernes.',location:'Casablanca',country:'Maroc',type:'full_time',salary_min:15000,salary_max:25000,currency:'MAD',skills:['React','TypeScript'],is_active:true},{id:2,title:'Designer UI/UX',company:'CreativeStudio',description:'Conception mobile & web.',location:'Paris',country:'France',type:'remote',salary_min:3000,salary_max:5000,currency:'EUR',skills:['Figma','UI/UX'],is_active:true}]);}finally{setLoading(false);} };
  const toggleSkill=(sk)=>setForm(f=>({...f,skills:f.skills.includes(sk)?f.skills.filter(s=>s!==sk):[...f.skills,sk]}));
  const handleCreate=async()=>{ if(!form.title.trim()){setFormError('Titre requis.');return;} try{await api.post('/jobs',{...form,user_id:userId});setForm({title:'',company:'',description:'',location:'',country:'',type:'full_time',salary_min:'',salary_max:'',currency:'USD',skills:[]});setStep('browse');loadJobs();}catch(err){setFormError(err.response?.data?.message||'Erreur.');} };
  const filtered=jobs.filter(j=>(j.title.toLowerCase().includes(search.toLowerCase())||(j.company||'').toLowerCase().includes(search.toLowerCase()))&&(!filterType||j.type===filterType));
  return(<div style={M.container}><div style={M.header}><h2 style={M.title}>💼 Jobs</h2><div style={M.headerActions}>{['browse','create'].map(t=><button key={t} style={{...M.tabBtn,...(step===t?M.tabActive:{})}} onClick={()=>setStep(t)}>{t==='browse'?'🔍 Offres':'+ Publier'}</button>)}</div></div>
    {step==='browse'&&<><div style={{display:'flex',gap:12,flexWrap:'wrap'}}><input style={{...M.searchInput,flex:1}} placeholder="🔍 Poste, entreprise..." value={search} onChange={e=>setSearch(e.target.value)}/><div style={{display:'flex',gap:8,flexWrap:'wrap'}}><button style={{...M.filterBtn,...(filterType===''?M.filterActive:{})}} onClick={()=>setFilterType('')}>Tous</button>{JOB_TYPES.map(t=><button key={t.value} style={{...M.filterBtn,...(filterType===t.value?M.filterActive:{})}} onClick={()=>setFilterType(t.value)}>{t.label}</button>)}</div></div>{loading?<div style={M.empty}>Chargement...</div>:<div style={M.grid}>{filtered.map(job=>{const tc=TCJ[job.type]||TCJ.full_time;return(<div key={job.id} style={M.card}><div style={M.cardTop}><div style={{...M.typeIcon,background:tc.bg,border:`1px solid ${tc.border}`,color:tc.color,fontSize:18}}>💼</div><span style={{...M.badge,background:tc.bg,border:`1px solid ${tc.border}`,color:tc.color}}>{JOB_TYPES.find(t=>t.value===job.type)?.label||job.type}</span></div><div style={{flex:1}}><div style={M.cardName}>{job.title}</div>{job.company&&<div style={{color:'#a78bfa',fontSize:12,marginBottom:2}}>🏢 {job.company}</div>}{job.location&&<div style={{color:'#64748b',fontSize:11}}>📍 {job.location}{job.country?`, ${job.country}`:''}</div>}<div style={M.cardDesc}>{job.description?.substring(0,70)}</div></div><div style={M.cardFooter}><div style={{color:'#4ade80',fontWeight:700,fontSize:12}}>{job.salary_min&&job.salary_max?`${job.salary_min?.toLocaleString()}–${job.salary_max?.toLocaleString()} ${job.currency}`:'À négocier'}</div><button style={M.joinBtn}>📩 Postuler</button></div></div>);})}</div>}</>}
    {step==='create'&&<div style={M.createCard}><h3 style={M.createTitle}>💼 Publier une offre</h3>{formError&&<div style={M.errorBox}>⚠️ {formError}</div>}<div style={M.formGrid}><div style={M.field}><label style={M.label}>Titre *</label><input style={M.input} value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></div><div style={M.field}><label style={M.label}>Entreprise</label><input style={M.input} value={form.company} onChange={e=>setForm({...form,company:e.target.value})}/></div><div style={M.field}><label style={M.label}>Ville</label><input style={M.input} value={form.location} onChange={e=>setForm({...form,location:e.target.value})}/></div><div style={M.field}><label style={M.label}>Pays</label><input style={M.input} value={form.country} onChange={e=>setForm({...form,country:e.target.value})}/></div><div style={M.field}><label style={M.label}>Contrat</label><select style={M.input} value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>{JOB_TYPES.map(t=><option key={t.value} value={t.value}>{t.label}</option>)}</select></div><div style={M.field}><label style={M.label}>Devise</label><select style={M.input} value={form.currency} onChange={e=>setForm({...form,currency:e.target.value})}>{CURRENCIES_J.map(c=><option key={c}>{c}</option>)}</select></div><div style={M.field}><label style={M.label}>Salaire min</label><input style={M.input} type="number" value={form.salary_min} onChange={e=>setForm({...form,salary_min:e.target.value})}/></div><div style={M.field}><label style={M.label}>Salaire max</label><input style={M.input} type="number" value={form.salary_max} onChange={e=>setForm({...form,salary_max:e.target.value})}/></div></div><div style={M.field}><label style={M.label}>Description</label><textarea style={{...M.input,minHeight:80,resize:'vertical'}} value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></div><div style={M.field}><label style={M.label}>Compétences</label><div style={{display:'flex',flexWrap:'wrap',gap:8,marginTop:4}}>{SKILLS_LIST.map(sk=><button key={sk} onClick={()=>toggleSkill(sk)} style={{...M.filterBtn,...(form.skills.includes(sk)?M.filterActive:{})}}>{sk}</button>)}</div></div><div style={{display:'flex',gap:12,justifyContent:'flex-end'}}><button style={M.cancelBtn} onClick={()=>setStep('browse')}>Annuler</button><button style={M.saveBtn} onClick={handleCreate}>💼 Publier</button></div></div>}
  </div>);
}

// ─────────────────────────────────────────────
// COMING SOON
// ─────────────────────────────────────────────
function ComingSoon({ icon, title }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:400, gap:16 }}>
      <div style={{ fontSize:64, filter:'drop-shadow(0 0 24px rgba(14,165,233,0.5))' }}>{icon}</div>
      <div style={{ color:'#e2e8f0', fontSize:22, fontWeight:700 }}>{title}</div>
      <div style={{ color:'#475569', fontSize:13, background:'#13131a', border:'1px solid #1e1e2e', padding:'8px 20px', borderRadius:20 }}>
        🚧 Module en construction — bientôt disponible
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SHARED STYLES
// ─────────────────────────────────────────────
const M = {
  container:    { display:'flex', flexDirection:'column', gap:18 },
  header:       { display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 },
  title:        { color:'#e2e8f0', fontSize:20, margin:0, fontWeight:700 },
  headerActions:{ display:'flex', gap:8 },
  tabBtn:       { background:'transparent', border:'1px solid #1e1e2e', color:'#64748b', padding:'7px 18px', borderRadius:8, cursor:'pointer', fontSize:13, fontWeight:600 },
  tabActive:    { background:'rgba(14,165,233,0.1)', border:'1px solid #0ea5e9', color:'#0ea5e9' },
  searchInput:  { background:'#13131a', border:'1px solid #1e1e2e', color:'#e2e8f0', padding:'9px 14px', borderRadius:8, fontSize:13, boxSizing:'border-box' },
  filterBtn:    { background:'transparent', border:'1px solid #1e1e2e', color:'#64748b', padding:'5px 12px', borderRadius:20, cursor:'pointer', fontSize:12, fontWeight:600 },
  filterActive: { background:'rgba(14,165,233,0.1)', border:'1px solid #0ea5e9', color:'#0ea5e9' },
  chip:         { background:'#13131a', border:'1px solid #1e1e2e', color:'#64748b', padding:'4px 12px', borderRadius:20, fontSize:12 },
  grid:         { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))', gap:14 },
  card:         { background:'#13131a', border:'1px solid #1e1e2e', borderRadius:12, padding:18, display:'flex', flexDirection:'column', gap:12 },
  cardTop:      { display:'flex', justifyContent:'space-between', alignItems:'center' },
  typeIcon:     { width:40, height:40, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center' },
  badge:        { padding:'2px 8px', borderRadius:20, fontSize:10, fontWeight:700, textTransform:'uppercase' },
  cardName:     { color:'#e2e8f0', fontWeight:700, fontSize:14, marginBottom:4 },
  cardDesc:     { color:'#64748b', fontSize:12, lineHeight:1.5 },
  cardFooter:   { display:'flex', justifyContent:'space-between', alignItems:'center' },
  meta:         { color:'#64748b', fontSize:11 },
  joinBtn:      { background:'rgba(14,165,233,0.1)', color:'#0ea5e9', border:'1px solid #0ea5e9', padding:'6px 14px', borderRadius:7, cursor:'pointer', fontSize:12, fontWeight:700 },
  empty:        { color:'#64748b', textAlign:'center', padding:60, fontSize:14 },
  createCard:   { background:'#13131a', border:'1px solid #1e1e2e', borderRadius:14, padding:24 },
  createTitle:  { color:'#e2e8f0', fontSize:17, margin:'0 0 16px', fontWeight:700 },
  errorBox:     { background:'rgba(255,80,80,0.1)', border:'1px solid #ff5050', color:'#ff8080', padding:'9px 14px', borderRadius:8, fontSize:13, marginBottom:14 },
  formGrid:     { display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:4 },
  field:        { display:'flex', flexDirection:'column', gap:5, marginBottom:14 },
  label:        { color:'#64748b', fontSize:12 },
  input:        { background:'#0a0a0f', border:'1px solid #1e1e2e', color:'#e2e8f0', padding:'9px 12px', borderRadius:7, fontSize:13, width:'100%', boxSizing:'border-box' },
  cancelBtn:    { background:'transparent', border:'1px solid #1e1e2e', color:'#64748b', padding:'9px 20px', borderRadius:7, cursor:'pointer', fontSize:13, fontWeight:600 },
  saveBtn:      { background:'linear-gradient(135deg,#0ea5e9,#8b5cf6)', color:'#fff', border:'none', padding:'9px 20px', borderRadius:7, fontWeight:700, cursor:'pointer', fontSize:13 },
};

// ─────────────────────────────────────────────
// MODULE ROUTER
// ─────────────────────────────────────────────
function ModuleContent({ tab, userId, socket }) {
  switch(tab) {
    case 'profile':     return <Profile userId={userId}/>;
    case 'stt':         return <STTWidget socket={socket} userId={userId}/>;
    case 'video':       return <VideoRoom socket={socket} userId={userId}/>;
    case 'marketplace': return <Marketplace userId={userId}/>;
    case 'dating':      return <Dating userId={userId}/>;
    case 'channels':    return <Channels userId={userId}/>;
    case 'groups':      return <Groups userId={userId}/>;
    case 'calls':       return <CallsModule userId={userId} socket={socket}/>;
    case 'debates':     return <Debates userId={userId}/>;
    case 'jobs':        return <Jobs userId={userId}/>;
    case 'feed':        return <Feed userId={userId}/>;
    case 'messages':    return <Messages userId={userId} socket={socket}/>;
    case 'medias':      return <Medias userId={userId}/>;
    case 'brands':      return <Brands userId={userId}/>;
    case 'wallet':      return <Wallet userId={userId}/>;
    case 'analytics':   return <Analytics userId={userId}/>;
    case 'moderation':  return <ModerationDashboard userId={userId}/>;
    case 'settings':    return <Settings userId={userId}/>;
    default:            return <ComingSoon icon="🔧" title="Module"/>;
  }
}

// ─────────────────────────────────────────────
// MAIN DASHBOARD
// ─────────────────────────────────────────────
export default function Dashboard() {
  const { user, logout }            = useAuth();
  const { t, lang }                 = useTranslation();
  const [socket, setSocket]         = useState(null);
  const [connected, setConnected]   = useState(false);
  const [activeTab, setActiveTab]   = useState('feed');
  const [collapsed, setCollapsed]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [screenW, setScreenW]       = useState(window.innerWidth);

  // NAV avec traductions
  const NAV_SECTIONS = [
    { label: null, items: [
      { key:'feed',        icon:'🏠', label:t('home'),        badge:null },
      { key:'profile',     icon:'👤', label:t('profile'),     badge:null },
      { key:'messages',    icon:'💬', label:t('messages'),    badge:3    },
    ]},
    { label:t('community'), items: [
      { key:'channels',    icon:'📡', label:t('channels'),    badge:null },
      { key:'groups',      icon:'👥', label:t('groups'),      badge:null },
      { key:'debates',     icon:'⚔️', label:t('debates'),     badge:1    },
    ]},
    { label:t('services'), items: [
      { key:'marketplace', icon:'🛍️', label:t('marketplace'), badge:null },
      { key:'jobs',        icon:'💼', label:t('jobs'),         badge:null },
      { key:'dating',      icon:'💑', label:t('dating'),      badge:null },
    ]},
    { label:t('media'), items: [
      { key:'video',       icon:'📹', label:t('video'),       badge:null },
      { key:'stt',         icon:'🎤', label:t('stt'),         badge:null },
      { key:'medias',      icon:'🎬', label:t('medias'),      badge:null },
    ]},
    { label:t('business'), items: [
      { key:'brands',      icon:'🏷️', label:t('brands'),      badge:null },
      { key:'wallet',      icon:'👛', label:t('wallet'),      badge:null },
      { key:'analytics',   icon:'📊', label:t('analytics'),   badge:null },
      { key:'moderation',  icon:'🛡️', label:t('moderation'),  badge:null },
    ]},
  ];

  useEffect(() => {
    const onResize = () => setScreenW(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const s = connectSocket();
    setSocket(s);
    s.on('connect', () => { setConnected(true); s.emit('join-room', { roomId:'room_test_1', userId:user.userId }); });
    s.on('disconnect', () => setConnected(false));
    return () => disconnectSocket();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const isMobile = screenW < 768;
  const isTablet = screenW >= 768 && screenW < 1024;
  const isCinema = screenW >= 1600;
  const sidebarW = collapsed ? 64 : isCinema ? 260 : 220;

  const allItems    = NAV_SECTIONS.flatMap(s => s.items);
  const currentItem = allItems.find(i => i.key === activeTab);
  const handleNav   = (key) => { setActiveTab(key); if(isMobile) setMobileOpen(false); };

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', background:'#070710', fontFamily:"'Outfit','DM Sans',sans-serif" }}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-track{background:#070710;}
        ::-webkit-scrollbar-thumb{background:#1e1e3a;border-radius:4px;}
        @keyframes pulse{0%,100%{opacity:0.4;transform:scale(1)}50%{opacity:0.9;transform:scale(1.15)}}
        @keyframes waveFloat{0%{transform:translateX(0) scaleY(1)}25%{transform:translateX(-3px) scaleY(1.04)}50%{transform:translateX(0) scaleY(0.96)}75%{transform:translateX(3px) scaleY(1.04)}100%{transform:translateX(0) scaleY(1)}}
        @keyframes fadeIn{from{opacity:0;transform:translateX(-6px)}to{opacity:1;transform:translateX(0)}}
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        @keyframes sunRise{0%{opacity:0;transform:translateY(10px)}100%{opacity:1;transform:translateY(0)}}
        @keyframes goldShimmer{0%{opacity:0.7}50%{opacity:1}100%{opacity:0.7}}
        .nav-item{transition:background 0.18s,transform 0.15s;border:none !important;}
        .nav-item:hover{transform:translateX(3px);background:rgba(255,255,255,0.04) !important;}
        .sidebar-wave{animation:waveFloat 5s ease-in-out infinite;}
        .content-fade{animation:fadeIn 0.22s ease;}
        .sun-glow{animation:sunRise 1s ease forwards;}
      `}</style>

      {isMobile && mobileOpen && (
        <div onClick={()=>setMobileOpen(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', zIndex:200, backdropFilter:'blur(4px)' }}/>
      )}

      {/* SIDEBAR */}
      <aside style={{
        width: isMobile ? (mobileOpen ? 240 : 0) : sidebarW,
        minWidth: isMobile ? (mobileOpen ? 240 : 0) : sidebarW,
        height:'100vh', display:'flex', flexDirection:'column',
        position: isMobile ? 'fixed' : 'relative',
        left:0, top:0, zIndex:300, overflow:'hidden',
        transition:'width 0.25s ease, min-width 0.25s ease',
        background:'linear-gradient(180deg,#050510 0%,#080420 18%,#0d0828 35%,#120c30 52%,#160e28 68%,#1a0e1e 82%,#1e0e14 100%)',
        borderRight:'1px solid rgba(201,168,76,0.15)',
        boxShadow:'4px 0 32px rgba(0,0,0,0.6)',
      }}>
        {/* Stars */}
        <div style={{ position:'absolute', inset:0, pointerEvents:'none' }}>
          {[...Array(16)].map((_,i) => (
            <div key={i} style={{ position:'absolute', borderRadius:'50%', background:'#fff', width:i%4===0?2:1, height:i%4===0?2:1, top:`${5+i*5.5}%`, left:`${8+(i*11)%82}%`, opacity:0.05+(i%5)*0.07, animation:`pulse ${2.5+i*0.25}s ease-in-out infinite`, animationDelay:`${i*0.15}s` }}/>
          ))}
        </div>
        <div className="sun-glow" style={{ position:'absolute', bottom:100, left:'50%', transform:'translateX(-50%)', width:180, height:50, background:'radial-gradient(ellipse, rgba(201,168,76,0.12) 0%, transparent 75%)', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:200, overflow:'hidden', opacity:0.10, pointerEvents:'none' }}>
          <svg className="sidebar-wave" viewBox="0 0 240 200" width="100%" height="200" preserveAspectRatio="none">
            <defs><linearGradient id="wd" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#C9A84C"/><stop offset="50%" stopColor="#F5D87A"/><stop offset="100%" stopColor="#C9A84C"/></linearGradient></defs>
            <path d="M0 130 Q30 90 60 130 Q90 170 120 130 Q150 90 180 130 Q210 150 240 130 L240 200 L0 200Z" fill="url(#wd)" opacity="0.5"/>
            <path d="M0 155 Q40 115 80 155 Q120 195 160 155 Q200 125 240 155 L240 200 L0 200Z" fill="url(#wd)" opacity="0.35"/>
          </svg>
        </div>

        {/* Logo */}
        <div style={{ padding:collapsed?'18px 14px':'14px 16px', position:'relative', zIndex:1, display:'flex', alignItems:'center', justifyContent:collapsed?'center':'space-between', borderBottom:'1px solid rgba(201,168,76,0.08)', minHeight:80 }}>
          <WaveLogo collapsed={collapsed}/>
          {!isMobile && (
            <button onClick={()=>setCollapsed(c=>!c)} style={{ background:'rgba(201,168,76,0.06)', border:'1px solid rgba(201,168,76,0.15)', color:'#C9A84C', borderRadius:6, width:24, height:24, cursor:'pointer', fontSize:12, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginLeft:collapsed?0:8 }}>
              {collapsed ? '›' : '‹'}
            </button>
          )}
        </div>

        {/* User card */}
        {!collapsed && (
          <div style={{ margin:'10px 12px 10px', padding:'10px 12px', background:'rgba(201,168,76,0.04)', borderRadius:10, border:'1px solid rgba(201,168,76,0.1)', position:'relative', zIndex:1 }}>
            <div style={{ display:'flex', alignItems:'center', gap:9 }}>
              <div style={{ width:30, height:30, borderRadius:'50%', background:'linear-gradient(135deg,#C9A84C,#F5D87A)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, color:'#1a1200', flexShrink:0 }}>
                {user?.username?.[0]?.toUpperCase()||'U'}
              </div>
              <div style={{ flex:1, overflow:'hidden' }}>
                <div style={{ color:'#e2e8f0', fontSize:12, fontWeight:600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{user?.username||'Utilisateur'}</div>
                <div style={{ display:'flex', alignItems:'center', gap:5, marginTop:2 }}>
                  <div style={{ width:6, height:6, borderRadius:'50%', background:connected?'#4ade80':'#f87171' }}/>
                  <span style={{ color:'#475569', fontSize:10 }}>{connected ? t('online') : t('offline')}</span>
                </div>
              </div>
              <NotificationBell socket={socket} userId={user?.userId}/>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav style={{ flex:1, overflowY:'auto', padding:'0 8px', position:'relative', zIndex:1 }}>
          {NAV_SECTIONS.map((section, si) => (
            <div key={si} style={{ marginBottom:6 }}>
              {section.label && !collapsed && (
                <div style={{ color:'#3d3020', fontSize:9, fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', padding:'8px 8px 3px', userSelect:'none' }}>
                  {section.label}
                </div>
              )}
              {collapsed && si > 0 && <div style={{ height:1, background:'rgba(201,168,76,0.08)', margin:'6px 8px' }}/>}
              {section.items.map(item => {
                const isActive = activeTab === item.key;
                return (
                  <button key={item.key} className="nav-item" onClick={()=>handleNav(item.key)} title={collapsed ? item.label : undefined}
                    style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:collapsed?'10px':'8px 10px', borderRadius:9, cursor:'pointer', background:isActive?'linear-gradient(135deg,rgba(201,168,76,0.14),rgba(245,216,122,0.07))':'transparent', borderLeft:`2px solid ${isActive?'#C9A84C':'transparent'}`, marginBottom:2, position:'relative', overflow:'hidden', justifyContent:collapsed?'center':'flex-start' }}>
                    {isActive && <div style={{ position:'absolute', inset:0, background:'linear-gradient(90deg,transparent,rgba(201,168,76,0.06),transparent)', backgroundSize:'200% 100%', animation:'shimmer 2.5s linear infinite', pointerEvents:'none' }}/>}
                    <span style={{ fontSize:15, flexShrink:0, filter:isActive?'drop-shadow(0 0 7px rgba(201,168,76,0.6))':'none', position:'relative' }}>{item.icon}</span>
                    {!collapsed && <span style={{ fontSize:13, fontWeight:isActive?700:500, color:isActive?'#F5D87A':'#64748b', flex:1, textAlign:'left', whiteSpace:'nowrap' }}>{item.label}</span>}
                    {item.badge && !collapsed && <span style={{ background:'linear-gradient(135deg,#C9A84C,#F5D87A)', color:'#1a1200', borderRadius:10, padding:'1px 6px', fontSize:10, fontWeight:700 }}>{item.badge}</span>}
                    {item.badge && collapsed && <div style={{ position:'absolute', top:7, right:7, width:7, height:7, borderRadius:'50%', background:'#C9A84C' }}/>}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Bottom — Langue + Settings + Logout */}
        <div style={{ padding:'8px', borderTop:'1px solid rgba(201,168,76,0.08)', position:'relative', zIndex:1 }}>
          {/* Sélecteur de langue */}
          <div style={{ marginBottom:6, display:'flex', justifyContent: collapsed ? 'center' : 'flex-start' }}>
            <LangSelector collapsed={collapsed}/>
          </div>
          {[{icon:'⚙️', label:t('settings'), key:'settings'},{icon:'🚪', label:t('logout'), key:'logout'}].map(item=>(
            <button key={item.key} className="nav-item" onClick={item.key==='logout'?logout:()=>handleNav(item.key)}
              style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:collapsed?'10px':'8px 10px', borderRadius:9, cursor:'pointer', background:'transparent', justifyContent:collapsed?'center':'flex-start', marginBottom:3 }}>
              <span style={{fontSize:15}}>{item.icon}</span>
              {!collapsed && <span style={{fontSize:13,fontWeight:500,color:'#64748b'}}>{item.label}</span>}
            </button>
          ))}
        </div>
      </aside>

      {/* MAIN */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', minWidth:0 }}>
        {/* Topbar */}
        <header style={{ height:54, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 18px', background:'rgba(7,7,16,0.92)', borderBottom:'1px solid rgba(201,168,76,0.08)', backdropFilter:'blur(16px)', flexShrink:0, gap:12 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            {isMobile && <button onClick={()=>setMobileOpen(o=>!o)} style={{ background:'transparent', border:'none', color:'#C9A84C', cursor:'pointer', fontSize:18, padding:4 }}>☰</button>}
            <div style={{ display:'flex', alignItems:'center', gap:7 }}>
              <span style={{ color:'#3d3020', fontSize:12, fontFamily:"'Georgia',serif", letterSpacing:1 }}>MULTIWAVE</span>
              <span style={{ color:'#C9A84C', fontSize:12, opacity:0.5 }}>›</span>
              <span style={{ color:'#e2e8f0', fontSize:13, fontWeight:600 }}>{currentItem?.icon} {currentItem?.label||t('home')}</span>
            </div>
          </div>
          <div style={{ flex:1, maxWidth:isMobile?120:340 }}>
            <GlobalSearch onNavigate={(tab) => setActiveTab(tab)} placeholder={t('search')}/>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            {!isMobile && (
              <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                <div style={{ width:6, height:6, borderRadius:'50%', background:connected?'#4ade80':'#f87171' }}/>
                <span style={{ color:'#475569', fontSize:11, fontFamily:'monospace' }}>{connected ? t('online') : t('offline')}</span>
              </div>
            )}
            <ThemeToggle/>
          </div>
        </header>

        {/* Content */}
        <main className="content-fade" style={{ flex:1, overflowY:'auto', padding:isMobile?14:isTablet?20:28, maxWidth:isCinema?1400:'100%', margin:isCinema?'0 auto':0, width:'100%' }}>
          <ErrorBoundary>
            <ModuleContent tab={activeTab} userId={user?.userId} socket={socket}/>
          </ErrorBoundary>
        </main>

        {/* Mobile bottom nav */}
        {isMobile && (
          <nav style={{ height:58, display:'flex', alignItems:'center', justifyContent:'space-around', background:'rgba(7,5,20,0.98)', borderTop:'1px solid rgba(201,168,76,0.15)', backdropFilter:'blur(12px)', flexShrink:0 }}>
            {[{key:'feed',icon:'🏠'},{key:'messages',icon:'💬'},{key:'marketplace',icon:'🛍️'},{key:'profile',icon:'👤'},{key:'jobs',icon:'💼'}].map(item=>{
              const isA=activeTab===item.key;
              return(
                <button key={item.key} onClick={()=>handleNav(item.key)} style={{ background:'transparent', border:'none', cursor:'pointer', padding:'8px 10px', display:'flex', flexDirection:'column', alignItems:'center', gap:3, filter:isA?'drop-shadow(0 0 8px rgba(201,168,76,0.7))':'none', transform:isA?'translateY(-2px)':'none', transition:'all 0.2s' }}>
                  <span style={{fontSize:20}}>{item.icon}</span>
                  {isA&&<div style={{width:4,height:4,borderRadius:'50%',background:'#C9A84C'}}/>}
                </button>
              );
            })}
          </nav>
        )}
      </div>
    </div>
  );
}