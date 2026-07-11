import React, { useState } from 'react';
import api from '../services/api';
import { useTranslation } from '../i18n';

const LANGUAGES = ['Français','Anglais','Arabe','Espagnol','Russe','Japonais','Chinois','Allemand','Portugais','Turc'];
const COUNTRIES  = ['France','USA','Maroc','Allemagne','Norvège','Russie','Japon','Émirats','Arabie Saoudite','Canada','Australie','UK'];
const INTERESTS  = ['🎵 Musique','🎬 Cinéma','⚽ Sport','📚 Lecture','✈️ Voyage','🍳 Cuisine','🎨 Art','💻 Tech','🌿 Nature','🧘 Yoga','📸 Photo','🎮 Gaming'];

const MOCK_PROFILES = [
  { id:2, username:'Sofia',  age:28, country:'🇫🇷 France', languages:['Français','Anglais'],   interests:['✈️ Voyage','🎵 Musique','🍳 Cuisine'], bio:'Amoureuse des voyages et de la bonne cuisine 🌍', avatar:'👩' },
  { id:3, username:'Ahmed',  age:32, country:'🇦🇪 Émirats', languages:['Arabe','Anglais'],      interests:['💻 Tech','⚽ Sport'],                  bio:'Entrepreneur passionné de technologie',         avatar:'👨' },
  { id:4, username:'Yuki',   age:25, country:'🇯🇵 Japon',   languages:['Japonais','Anglais'],   interests:['🎨 Art','📸 Photo','🎵 Musique'],       bio:'Artiste et photographe amateur 🎨',             avatar:'👩' },
  { id:5, username:'Carlos', age:30, country:'🇧🇷 Brésil',  languages:['Portugais','Espagnol'], interests:['⚽ Sport','🎵 Musique','🌿 Nature'],    bio:'Amoureux de la nature et du football',          avatar:'👨' },
];

export default function Dating({ userId }) {
  const { t } = useTranslation();
  const [step,         setStep]         = useState('browse');
  const [profile,      setProfile]      = useState({ gender:'', looking_for:'', age:'', country:'', languages:[], interests:[], bio:'' });
  const [profiles]                      = useState(MOCK_PROFILES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matches,      setMatches]      = useState([]);

  const toggleItem = (field, item) => {
    const current = profile[field] || [];
    setProfile({ ...profile, [field]: current.includes(item) ? current.filter(x=>x!==item) : [...current, item] });
  };

  const handleLike = () => { setMatches(p => [...p, profiles[currentIndex]]); setCurrentIndex(p=>p+1); };
  const handlePass = () => { setCurrentIndex(p=>p+1); };
  const current = profiles[currentIndex];

  const TABS = [
    { key:'browse',  label:t('browse') },
    { key:'profile', label:t('my_profile') },
    { key:'match',   label:`${t('matches')} (${matches.length})` },
  ];

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>{t('dating_title')}</h2>
        <div style={styles.tabs}>
          {TABS.map(tb => (
            <button key={tb.key} onClick={() => setStep(tb.key)} style={{ ...styles.tab, ...(step===tb.key ? styles.tabActive : {}) }}>
              {tb.label}
            </button>
          ))}
        </div>
      </div>

      {/* BROWSE */}
      {step === 'browse' && (
        <div style={styles.browseContainer}>
          {!current ? (
            <div style={styles.empty}>{t('no_profiles')}</div>
          ) : (
            <div style={styles.card}>
              <div style={styles.avatar}>{current.avatar}</div>
              <h3 style={styles.name}>{current.username}, {current.age}</h3>
              <div style={styles.country}>{current.country}</div>
              <div style={styles.languages}>
                {current.languages.map(l => <span key={l} style={styles.badge}>🗣️ {l}</span>)}
              </div>
              <div style={styles.interests}>
                {current.interests.map(i => <span key={i} style={styles.interestBadge}>{i}</span>)}
              </div>
              <p style={styles.bio}>"{current.bio}"</p>
              <div style={styles.actions}>
                <button style={styles.passBtn} onClick={handlePass}>{t('pass')}</button>
                <button style={styles.likeBtn} onClick={handleLike}>{t('like')}</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* PROFILE */}
      {step === 'profile' && (
        <div style={styles.profileForm}>
          <div style={styles.formGrid}>
            <div style={styles.field}>
              <label style={styles.label}>{t('i_am')}</label>
              <select style={styles.input} value={profile.gender} onChange={e=>setProfile({...profile,gender:e.target.value})}>
                <option value="">{t('choose')}</option>
                <option value="homme">{t('man')}</option>
                <option value="femme">{t('woman')}</option>
                <option value="autre">{t('other')}</option>
              </select>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>{t('looking_for')}</label>
              <select style={styles.input} value={profile.looking_for} onChange={e=>setProfile({...profile,looking_for:e.target.value})}>
                <option value="">{t('choose')}</option>
                <option value="homme">{t('man')}</option>
                <option value="femme">{t('woman')}</option>
                <option value="tous">{t('everyone')}</option>
              </select>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>{t('age')}</label>
              <input style={styles.input} type="number" value={profile.age} onChange={e=>setProfile({...profile,age:e.target.value})}/>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>{t('country')}</label>
              <select style={styles.input} value={profile.country} onChange={e=>setProfile({...profile,country:e.target.value})}>
                <option value="">{t('choose')}</option>
                {COUNTRIES.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>{t('languages_spoken')}</label>
            <div style={styles.tagsGrid}>
              {LANGUAGES.map(l => (
                <button key={l} onClick={()=>toggleItem('languages',l)} style={{ ...styles.tagBtn, ...(profile.languages.includes(l)?styles.tagActive:{}) }}>
                  🗣️ {l}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>{t('interests_label')}</label>
            <div style={styles.tagsGrid}>
              {INTERESTS.map(i => (
                <button key={i} onClick={()=>toggleItem('interests',i)} style={{ ...styles.tagBtn, ...(profile.interests.includes(i)?styles.tagActive:{}) }}>
                  {i}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>{t('bio')}</label>
            <textarea style={{ ...styles.input, minHeight:80 }} value={profile.bio} onChange={e=>setProfile({...profile,bio:e.target.value})} placeholder={t('bio_placeholder')}/>
          </div>

          <button style={styles.saveBtn}>{t('save_profile')}</button>
        </div>
      )}

      {/* MATCHES */}
      {step === 'match' && (
        <div style={styles.matchesContainer}>
          {matches.length === 0 ? (
            <div style={styles.empty}>{t('no_matches')}</div>
          ) : (
            <div style={styles.matchesGrid}>
              {matches.map(m => (
                <div key={m.id} style={styles.matchCard}>
                  <div style={styles.matchAvatar}>{m.avatar}</div>
                  <div style={styles.matchName}>{m.username}</div>
                  <div style={styles.matchCountry}>{m.country}</div>
                  <button style={styles.msgBtn}>{t('message')}</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container:       { display:'flex', flexDirection:'column', gap:24 },
  header:          { display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 },
  title:           { color:'#e2e8f0', fontSize:22, margin:0 },
  tabs:            { display:'flex', gap:8 },
  tab:             { background:'transparent', border:'1px solid #1e1e2e', color:'#64748b', padding:'8px 16px', borderRadius:8, cursor:'pointer', fontSize:13 },
  tabActive:       { background:'rgba(255,100,150,0.1)', border:'1px solid #ff6496', color:'#ff6496' },
  browseContainer: { display:'flex', justifyContent:'center' },
  card:            { background:'#13131a', border:'1px solid #1e1e2e', borderRadius:20, padding:40, textAlign:'center', maxWidth:400, width:'100%' },
  avatar:          { fontSize:80, marginBottom:16 },
  name:            { color:'#e2e8f0', fontSize:24, margin:'0 0 8px' },
  country:         { color:'#64748b', fontSize:14, marginBottom:16 },
  languages:       { display:'flex', gap:8, justifyContent:'center', flexWrap:'wrap', marginBottom:12 },
  badge:           { background:'rgba(0,229,255,0.1)', color:'#00e5ff', border:'1px solid rgba(0,229,255,0.2)', borderRadius:4, padding:'2px 8px', fontSize:11 },
  interests:       { display:'flex', gap:8, justifyContent:'center', flexWrap:'wrap', marginBottom:16 },
  interestBadge:   { background:'rgba(255,100,150,0.1)', color:'#ff6496', border:'1px solid rgba(255,100,150,0.2)', borderRadius:4, padding:'2px 8px', fontSize:11 },
  bio:             { color:'#94a3b8', fontSize:14, fontStyle:'italic', marginBottom:24 },
  actions:         { display:'flex', gap:20, justifyContent:'center' },
  passBtn:         { background:'transparent', border:'2px solid #1e1e2e', color:'#64748b', padding:'14px 32px', borderRadius:50, cursor:'pointer', fontSize:16, fontWeight:700 },
  likeBtn:         { background:'linear-gradient(135deg,#ff6496,#ff4444)', color:'#fff', border:'none', padding:'14px 32px', borderRadius:50, cursor:'pointer', fontSize:16, fontWeight:700 },
  profileForm:     { background:'#13131a', border:'1px solid #1e1e2e', borderRadius:16, padding:24 },
  formGrid:        { display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 },
  field:           { display:'flex', flexDirection:'column', gap:6, marginBottom:16 },
  label:           { color:'#64748b', fontSize:13 },
  input:           { background:'#0a0a0f', border:'1px solid #1e1e2e', color:'#e2e8f0', padding:'10px 14px', borderRadius:8, fontSize:14, width:'100%', boxSizing:'border-box' },
  tagsGrid:        { display:'flex', flexWrap:'wrap', gap:8, marginTop:8 },
  tagBtn:          { background:'#0a0a0f', border:'1px solid #1e1e2e', color:'#64748b', padding:'6px 14px', borderRadius:20, cursor:'pointer', fontSize:12 },
  tagActive:       { background:'rgba(255,100,150,0.1)', border:'1px solid #ff6496', color:'#ff6496' },
  saveBtn:         { background:'linear-gradient(135deg,#ff6496,#ff4444)', color:'#fff', border:'none', padding:'12px 24px', borderRadius:8, fontWeight:700, cursor:'pointer' },
  matchesContainer:{ display:'flex', flexDirection:'column', gap:16 },
  matchesGrid:     { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:16 },
  matchCard:       { background:'#13131a', border:'1px solid #ff6496', borderRadius:12, padding:20, textAlign:'center' },
  matchAvatar:     { fontSize:48, marginBottom:8 },
  matchName:       { color:'#e2e8f0', fontWeight:700, marginBottom:4 },
  matchCountry:    { color:'#64748b', fontSize:12, marginBottom:12 },
  msgBtn:          { background:'rgba(255,100,150,0.1)', color:'#ff6496', border:'1px solid #ff6496', padding:'8px 16px', borderRadius:8, cursor:'pointer', fontSize:13, fontWeight:600 },
  empty:           { color:'#64748b', textAlign:'center', padding:60 },
};