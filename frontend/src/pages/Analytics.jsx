// ─────────────────────────────────────────────
// Analytics.jsx — Multiwave Analytics
// Auteur : Zahnouni Issam
// ─────────────────────────────────────────────
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useTranslation } from '../i18n';

const S = {
  container: { display:'flex', flexDirection:'column', gap:18 },
  card:      { background:'#13131a', border:'1px solid #1e1e2e', borderRadius:14, padding:20 },
  grid2:     { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:14 },
  grid3:     { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:14 },
  badge:     { padding:'2px 8px', borderRadius:20, fontSize:10, fontWeight:700 },
  filterBtn: { background:'transparent', border:'1px solid #1e1e2e', color:'#64748b', padding:'5px 14px', borderRadius:20, cursor:'pointer', fontSize:12, fontWeight:600 },
  filterActive:{ background:'rgba(201,168,76,0.12)', border:'1px solid #C9A84C', color:'#C9A84C' },
  empty:     { color:'#475569', textAlign:'center', padding:'40px 24px', fontSize:14 },
  th:        { color:'#475569', fontSize:11, fontWeight:700, padding:'8px 12px', textAlign:'left', borderBottom:'1px solid #1e1e2e', textTransform:'uppercase', letterSpacing:'0.5px' },
  td:        { color:'#94a3b8', fontSize:13, padding:'10px 12px', borderBottom:'1px solid #0d0d18' },
};

const fmtNum  = (n) => n ? parseInt(n).toLocaleString('fr-FR') : '0';
const fmtDate = (d) => d ? new Date(d).toLocaleString('fr-FR', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' }) : '—';
const timeAgo = (d) => {
  if (!d) return '—';
  const diff = Math.floor((Date.now() - new Date(d)) / 1000);
  if (diff < 60)    return `${diff}s`;
  if (diff < 3600)  return `${Math.floor(diff/60)}m`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h`;
  return `${Math.floor(diff/86400)}j`;
};

const MOCK_EVENTS = [
  { id:1,  user_id:1, event_type:'page_view',    event_data:{ page:'/feed' },         created_at:'2026-03-13T11:00:00Z' },
  { id:2,  user_id:1, event_type:'post_created', event_data:{ post_id:42 },            created_at:'2026-03-13T10:55:00Z' },
  { id:3,  user_id:2, event_type:'login',         event_data:{ method:'email' },        created_at:'2026-03-13T10:50:00Z' },
  { id:4,  user_id:3, event_type:'product_view', event_data:{ product_id:5 },          created_at:'2026-03-13T10:45:00Z' },
  { id:5,  user_id:1, event_type:'message_sent', event_data:{ to_user_id:2 },          created_at:'2026-03-13T10:40:00Z' },
  { id:6,  user_id:4, event_type:'ad_click',     event_data:{ ad_id:1 },               created_at:'2026-03-13T10:35:00Z' },
  { id:7,  user_id:2, event_type:'job_apply',    event_data:{ job_id:3 },              created_at:'2026-03-13T10:30:00Z' },
  { id:8,  user_id:5, event_type:'page_view',    event_data:{ page:'/marketplace' },   created_at:'2026-03-13T10:25:00Z' },
  { id:9,  user_id:1, event_type:'like',          event_data:{ post_id:10 },            created_at:'2026-03-13T10:20:00Z' },
  { id:10, user_id:3, event_type:'signup',        event_data:{ method:'google' },       created_at:'2026-03-13T10:15:00Z' },
  { id:11, user_id:6, event_type:'order_placed', event_data:{ order_id:7, amount:49 }, created_at:'2026-03-13T10:10:00Z' },
  { id:12, user_id:2, event_type:'video_watch',  event_data:{ video_id:2 },            created_at:'2026-03-13T10:05:00Z' },
];

const MOCK_AI_LOGS = [
  { id:1,  user_id:1, action:'translation',   model:'whisper', input_text:'Bonjour tout le monde', output_text:'Hello everyone',            tokens_used:12,  language:'fr', status:'success', created_at:'2026-03-13T11:00:00Z' },
  { id:2,  user_id:2, action:'transcription', model:'whisper', input_text:'Audio 00:42',            output_text:'Texte transcrit',           tokens_used:340, language:'ar', status:'success', created_at:'2026-03-13T10:55:00Z' },
  { id:3,  user_id:1, action:'moderation',    model:'gpt-4',   input_text:'Contenu à modérer',      output_text:'approved',                  tokens_used:85,  language:'fr', status:'success', created_at:'2026-03-13T10:50:00Z' },
  { id:4,  user_id:3, action:'chat',          model:'gpt-4',   input_text:'Comment ça marche ?',    output_text:'Voici comment...',          tokens_used:220, language:'fr', status:'success', created_at:'2026-03-13T10:45:00Z' },
  { id:5,  user_id:4, action:'moderation',    model:'gpt-4',   input_text:'Contenu inapproprié',    output_text:'blocked',                   tokens_used:45,  language:'en', status:'blocked', created_at:'2026-03-13T10:40:00Z' },
  { id:6,  user_id:1, action:'translation',   model:'whisper', input_text:'مرحبا بالعالم',          output_text:'Bonjour le monde',          tokens_used:18,  language:'ar', status:'success', created_at:'2026-03-13T10:35:00Z' },
  { id:7,  user_id:5, action:'transcription', model:'whisper', input_text:'Audio 01:23',            output_text:'Transcription complète...', tokens_used:580, language:'en', status:'success', created_at:'2026-03-13T10:30:00Z' },
  { id:8,  user_id:2, action:'chat',          model:'gpt-4',   input_text:'Aide moi avec React',    output_text:'Voici un exemple...',       tokens_used:450, language:'fr', status:'success', created_at:'2026-03-13T10:25:00Z' },
  { id:9,  user_id:6, action:'moderation',    model:'gpt-4',   input_text:'Spam détecté',           output_text:'flagged',                   tokens_used:30,  language:'fr', status:'flagged', created_at:'2026-03-13T10:20:00Z' },
  { id:10, user_id:1, action:'transcription', model:'whisper', input_text:'Audio 00:15',            output_text:'Courte transcription',      tokens_used:120, language:'fr', status:'error',   created_at:'2026-03-13T10:15:00Z' },
];

const MOCK_STATES = [
  { id:1, user_id:1, state:'online',  last_active:'2026-03-13T11:00:00Z', user:{ username:'zahnouni_issam' } },
  { id:2, user_id:2, state:'online',  last_active:'2026-03-13T10:58:00Z', user:{ username:'sarah_dz' } },
  { id:3, user_id:3, state:'idle',    last_active:'2026-03-13T10:30:00Z', user:{ username:'dev_karim' } },
  { id:4, user_id:4, state:'offline', last_active:'2026-03-13T08:00:00Z', user:{ username:'tech_maroc' } },
  { id:5, user_id:5, state:'online',  last_active:'2026-03-13T11:01:00Z', user:{ username:'laila_design' } },
  { id:6, user_id:6, state:'offline', last_active:'2026-03-12T22:00:00Z', user:{ username:'dj_atlas' } },
];

const MOCK_STATS = {
  total_users:1247, active_today:342, new_this_week:89,
  total_posts:4821, total_messages:18430, total_orders:234,
  total_revenue:12840, avg_session:'8m 42s',
};

const DAILY_DATA = [
  { day:'Lun', users:180, posts:420, orders:18 },
  { day:'Mar', users:210, posts:380, orders:24 },
  { day:'Mer', users:195, posts:450, orders:21 },
  { day:'Jeu', users:240, posts:510, orders:30 },
  { day:'Ven', users:280, posts:600, orders:35 },
  { day:'Sam', users:320, posts:720, orders:42 },
  { day:'Dim', users:342, posts:680, orders:38 },
];

const EVENT_CONFIG = {
  page_view:    { icon:'👁',  color:'#60a5fa', label:'Vue page' },
  post_created: { icon:'📝', color:'#4ade80', label:'Post créé' },
  login:        { icon:'🔑', color:'#C9A84C', label:'Connexion' },
  signup:       { icon:'✨', color:'#a78bfa', label:'Inscription' },
  product_view: { icon:'🛍️', color:'#f97316', label:'Produit vu' },
  message_sent: { icon:'💬', color:'#0ea5e9', label:'Message' },
  ad_click:     { icon:'📢', color:'#fbbf24', label:'Clic pub' },
  job_apply:    { icon:'💼', color:'#4ade80', label:'Candidature' },
  like:         { icon:'❤️', color:'#f87171', label:'Like' },
  order_placed: { icon:'📦', color:'#C9A84C', label:'Commande' },
  video_watch:  { icon:'🎬', color:'#a78bfa', label:'Vidéo vue' },
};

const STATE_CONFIG = {
  online:  { color:'#4ade80', bg:'rgba(74,222,128,0.1)',  border:'#4ade80',  label:'Online' },
  idle:    { color:'#fbbf24', bg:'rgba(251,191,36,0.1)',  border:'#fbbf24',  label:'Idle' },
  offline: { color:'#64748b', bg:'rgba(100,116,139,0.1)', border:'#64748b',  label:'Offline' },
};

function MiniBarChart({ data, valueKey, color, label }) {
  const max  = Math.max(...data.map(d => d[valueKey]));
  const W    = 100, H = 50;
  const barW = W / data.length - 2;
  return (
    <div>
      <div style={{ color:'#475569', fontSize:11, marginBottom:6 }}>{label}</div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow:'visible' }}>
        {data.map((d, i) => {
          const barH = max > 0 ? (d[valueKey] / max) * (H - 10) : 0;
          const x = i * (W / data.length) + 1;
          const y = H - barH;
          return (
            <g key={i}>
              <rect x={x} y={y} width={barW} height={barH} rx="2" fill={color} opacity="0.7"/>
              <text x={x + barW/2} y={H + 10} textAnchor="middle" fill="#475569" fontSize="5">{d.day}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function StatCard({ icon, label, value, sub, color, trend }) {
  return (
    <div style={{ ...S.card, display:'flex', flexDirection:'column', gap:8 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <span style={{ fontSize:24 }}>{icon}</span>
        {trend && (
          <span style={{ ...S.badge, background: trend > 0 ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)', border:`1px solid ${trend>0?'#4ade80':'#f87171'}`, color: trend>0?'#4ade80':'#f87171' }}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div style={{ color: color || '#C9A84C', fontWeight:800, fontSize:26 }}>{value}</div>
      <div style={{ color:'#e2e8f0', fontSize:13, fontWeight:600 }}>{label}</div>
      {sub && <div style={{ color:'#475569', fontSize:11 }}>{sub}</div>}
    </div>
  );
}

function EventRow({ event, index }) {
  const cfg = EVENT_CONFIG[event.event_type] || { icon:'📌', color:'#64748b', label:event.event_type };
  return (
    <tr style={{ background: index%2===0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
      <td style={S.td}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:16 }}>{cfg.icon}</span>
          <span style={{ ...S.badge, background:`${cfg.color}18`, border:`1px solid ${cfg.color}40`, color:cfg.color }}>{cfg.label}</span>
        </div>
      </td>
      <td style={S.td}><span style={{ color:'#64748b', fontSize:12 }}>#</span>{event.user_id}</td>
      <td style={S.td}>
        {event.event_data && (
          <span style={{ color:'#334155', fontSize:11, fontFamily:'monospace', background:'#0a0a0f', padding:'2px 6px', borderRadius:4 }}>
            {Object.entries(event.event_data).map(([k,v])=>`${k}: ${v}`).join(', ')}
          </span>
        )}
      </td>
      <td style={{ ...S.td, color:'#334155', fontSize:11 }}>{timeAgo(event.created_at)}</td>
    </tr>
  );
}

function DonutChart({ data }) {
  const total = data.reduce((a,d) => a + d.value, 0);
  const R = 40, cx = 60, cy = 60;
  let cumAngle = -Math.PI / 2;
  const arcs = data.map(d => {
    const angle = (d.value / total) * 2 * Math.PI;
    const x1 = cx + R * Math.cos(cumAngle);
    const y1 = cy + R * Math.sin(cumAngle);
    cumAngle += angle;
    const x2 = cx + R * Math.cos(cumAngle);
    const y2 = cy + R * Math.sin(cumAngle);
    const largeArc = angle > Math.PI ? 1 : 0;
    return { ...d, d:`M${cx},${cy} L${x1},${y1} A${R},${R} 0 ${largeArc} 1 ${x2},${y2} Z` };
  });
  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      {arcs.map((arc, i) => <path key={i} d={arc.d} fill={arc.color} opacity="0.85"/>)}
      <circle cx={cx} cy={cy} r={R * 0.55} fill="#13131a"/>
      <text x={cx} y={cy - 4} textAnchor="middle" fill="#e2e8f0" fontSize="12" fontWeight="700">{total}</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill="#475569" fontSize="7">total</text>
    </svg>
  );
}

export default function Analytics({ userId }) {
  const { t } = useTranslation();
  const [events,      setEvents]      = useState([]);
  const [aiLogs,      setAiLogs]      = useState([]);
  const [aiFilter,    setAiFilter]    = useState('');
  const [states,      setStates]      = useState([]);
  const [stats,       setStats]       = useState(MOCK_STATS);
  const [loading,     setLoading]     = useState(true);
  const [tab,         setTab]         = useState('overview');
  const [eventFilter, setEventFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [period,      setPeriod]      = useState('7d');

  useEffect(() => { loadData(); }, [period]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [evRes, stRes, statsRes, aiRes] = await Promise.allSettled([
        api.get(`/analytics/events?user_id=${userId}&period=${period}`),
        api.get('/analytics/states'),
        api.get(`/analytics/stats?period=${period}`),
        api.get(`/analytics/ai-logs?period=${period}`),
      ]);
      setEvents(evRes.status==='fulfilled'    ? evRes.value.data?.data||evRes.value.data||[]       : MOCK_EVENTS);
      setStates(stRes.status==='fulfilled'    ? stRes.value.data?.data||stRes.value.data||[]       : MOCK_STATES);
      setStats(statsRes.status==='fulfilled'  ? statsRes.value.data?.data||statsRes.value.data||{} : MOCK_STATS);
      setAiLogs(aiRes.status==='fulfilled'    ? aiRes.value.data?.data||aiRes.value.data||[]       : MOCK_AI_LOGS);
    } catch {
      setEvents(MOCK_EVENTS); setStates(MOCK_STATES); setStats(MOCK_STATS); setAiLogs(MOCK_AI_LOGS);
    } finally { setLoading(false); }
  };

  const eventCounts = MOCK_EVENTS.reduce((acc, e) => { acc[e.event_type]=(acc[e.event_type]||0)+1; return acc; }, {});
  const topEvents   = Object.entries(eventCounts).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([type,count])=>({ type, count, ...(EVENT_CONFIG[type]||{ icon:'📌', color:'#64748b', label:type }) }));
  const donutData   = [
    { label:t('online'),  value: states.filter(s=>s.state==='online').length,  color:'#4ade80' },
    { label:t('idle'),    value: states.filter(s=>s.state==='idle').length,    color:'#fbbf24' },
    { label:t('offline'), value: states.filter(s=>s.state==='offline').length, color:'#334155' },
  ];
  const filteredEvents = events.filter(e => !eventFilter || e.event_type === eventFilter);
  const filteredStates = states.filter(s => !stateFilter || s.state === stateFilter);

  const TABS    = [
    { key:'overview', label:t('overview') },
    { key:'events',   label:t('events_tab') },
    { key:'users',    label:t('users_tab') },
    { key:'charts',   label:t('charts_tab') },
    { key:'ailogs',   label:t('ailogs_tab') },
  ];
  const PERIODS = [{ key:'1d',label:'24h' },{ key:'7d',label:'7j' },{ key:'30d',label:'30j' },{ key:'90d',label:'90j' }];

  return (
    <div style={S.container}>

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
        <h2 style={{ color:'#e2e8f0', fontSize:20, margin:0, fontWeight:700 }}>📊 {t('analytics_title')}</h2>
        <div style={{ display:'flex', gap:6 }}>
          {PERIODS.map(p => (
            <button key={p.key} onClick={() => setPeriod(p.key)} style={{ ...S.filterBtn, ...(period===p.key?S.filterActive:{}) }}>{p.label}</button>
          ))}
        </div>
      </div>

      <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{ ...S.filterBtn, padding:'7px 18px', borderRadius:8, fontSize:13, ...(tab===t.key?S.filterActive:{}) }}>{t.label}</button>
        ))}
      </div>

      {/* OVERVIEW */}
      {tab === 'overview' && (
        <>
          <div style={S.grid2}>
            <StatCard icon="👥" label={t('total_users')}     value={fmtNum(stats.total_users)}    color="#C9A84C" trend={12} sub={`${fmtNum(stats.active_today)} ${t('active_today')}`}/>
            <StatCard icon="✨" label={t('new_week')} value={fmtNum(stats.new_this_week)}  color="#4ade80" trend={8}/>
            <StatCard icon="📝" label={t('posts_published')}          value={fmtNum(stats.total_posts)}    color="#60a5fa" trend={5}/>
            <StatCard icon="💬" label={t('messages_sent')}       value={fmtNum(stats.total_messages)} color="#a78bfa" trend={15}/>
            <StatCard icon="📦" label={t('orders')}              value={fmtNum(stats.total_orders)}   color="#f97316" trend={22}/>
            <StatCard icon="💰" label={t('revenue')}                value={`${fmtNum(stats.total_revenue)} $`} color="#C9A84C" trend={18}/>
            <StatCard icon="⏱️" label={t('avg_session')}        value={stats.avg_session}            color="#0ea5e9"/>
            <StatCard icon="⚡" label={t('events_period')}  value={fmtNum(events.length)}         color="#fbbf24"/>
          </div>
          <div style={S.card}>
            <div style={{ color:'#64748b', fontSize:11, fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', marginBottom:14 }}>{t('top_events')}</div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {topEvents.map((e,i) => {
                const pct = topEvents[0].count > 0 ? (e.count/topEvents[0].count)*100 : 0;
                return (
                  <div key={e.type} style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <span style={{ color:'#334155', fontSize:12, width:16, flexShrink:0 }}>#{i+1}</span>
                    <span style={{ fontSize:16 }}>{e.icon}</span>
                    <span style={{ color:'#94a3b8', fontSize:13, width:120, flexShrink:0 }}>{e.label}</span>
                    <div style={{ flex:1, height:8, background:'#0a0a0f', borderRadius:4, overflow:'hidden' }}>
                      <div style={{ height:'100%', width:`${pct}%`, background:e.color, borderRadius:4, transition:'width 0.5s' }}/>
                    </div>
                    <span style={{ color:e.color, fontWeight:700, fontSize:13, width:30, textAlign:'right' }}>{e.count}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ ...S.card, display:'flex', gap:20, alignItems:'center', flexWrap:'wrap' }}>
            <DonutChart data={donutData}/>
            <div style={{ flex:1 }}>
              <div style={{ color:'#64748b', fontSize:11, fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', marginBottom:12 }}>{t('user_status')}</div>
              {donutData.map((d,i) => (
                <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <div style={{ width:10, height:10, borderRadius:'50%', background:d.color }}/>
                    <span style={{ color:'#94a3b8', fontSize:13 }}>{d.label}</span>
                  </div>
                  <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                    <span style={{ color:d.color, fontWeight:700 }}>{d.value}</span>
                    <span style={{ color:'#334155', fontSize:11 }}>({states.length>0?Math.round(d.value/states.length*100):0}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* EVENTS */}
      {tab === 'events' && (
        <>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap', alignItems:'center' }}>
            <button onClick={() => setEventFilter('')} style={{ ...S.filterBtn, ...(eventFilter===''?S.filterActive:{}) }}>{t('all')}</button>
            {Object.entries(EVENT_CONFIG).map(([key,cfg]) => (
              <button key={key} onClick={() => setEventFilter(key)} style={{ ...S.filterBtn, ...(eventFilter===key?{ background:`${cfg.color}18`, border:`1px solid ${cfg.color}60`, color:cfg.color }:{}) }}>{cfg.icon} {cfg.label}</button>
            ))}
          </div>
          <div style={{ ...S.card, padding:0, overflow:'hidden' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead><tr style={{ background:'#0d0d18' }}><th style={S.th}>{t('event_col')}</th><th style={S.th}>{t('user_col')}</th><th style={S.th}>{t('data_col')}</th><th style={S.th}>{t('time_col')}</th></tr></thead>
              <tbody>
                {loading ? <tr><td colSpan="4" style={{ ...S.td, textAlign:'center', padding:32 }}>Chargement...</td></tr>
                : filteredEvents.length===0 ? <tr><td colSpan="4" style={{ ...S.td, textAlign:'center', padding:32 }}>{t('no_events')}</td></tr>
                : filteredEvents.map((e,i) => <EventRow key={e.id} event={e} index={i}/>)}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* USERS */}
      {tab === 'users' && (
        <>
          <div style={{ display:'flex', gap:8 }}>
            {['','online','idle','offline'].map(s => (
              <button key={s} onClick={() => setStateFilter(s)} style={{ ...S.filterBtn, ...(stateFilter===s?(s?{ background:(STATE_CONFIG[s]||{}).bg, border:`1px solid ${(STATE_CONFIG[s]||{}).border}`, color:(STATE_CONFIG[s]||{}).color }:S.filterActive):{}) }}>
                {s===''?t('all'):STATE_CONFIG[s]?.label}
              </button>
            ))}
          </div>
          <div style={{ ...S.card, padding:0, overflow:'hidden' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead><tr style={{ background:'#0d0d18' }}><th style={S.th}>{t('user_col')}</th><th style={S.th}>{t('status_col')}</th><th style={S.th}>{t('last_active')}</th><th style={S.th}>{t('inactive_since')}</th></tr></thead>
              <tbody>
                {loading ? <tr><td colSpan="4" style={{ ...S.td, textAlign:'center', padding:32 }}>Chargement...</td></tr>
                : filteredStates.map((s,i) => {
                  const sc = STATE_CONFIG[s.state]||STATE_CONFIG.offline;
                  return (
                    <tr key={s.id} style={{ background: i%2===0?'transparent':'rgba(255,255,255,0.01)' }}>
                      <td style={S.td}>
                        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                          <div style={{ width:28, height:28, borderRadius:'50%', background:'linear-gradient(135deg,#C9A84C,#F5D87A)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:'#1a1200' }}>
                            {s.user?.username?.[0]?.toUpperCase()||'?'}
                          </div>
                          <span style={{ color:'#e2e8f0', fontWeight:600 }}>{s.user?.username||`#${s.user_id}`}</span>
                        </div>
                      </td>
                      <td style={S.td}><span style={{ ...S.badge, background:sc.bg, border:`1px solid ${sc.border}`, color:sc.color }}>{s.state==='online'?'🟢':s.state==='idle'?'🟡':'⚫'} {sc.label}</span></td>
                      <td style={{ ...S.td, fontSize:12 }}>{fmtDate(s.last_active)}</td>
                      <td style={{ ...S.td, color:'#475569', fontSize:12 }}>{timeAgo(s.last_active)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* CHARTS */}
      {tab === 'charts' && (
        <div style={S.grid3}>
          {[{ key:'users',color:'#C9A84C',labelKey:'active_users_day' },{ key:'posts',color:'#60a5fa',labelKey:'posts_day' },{ key:'orders',color:'#4ade80',labelKey:'orders_day' }].map(chart => (
            <div key={chart.key} style={S.card}>
              <div style={{ color:'#e2e8f0', fontSize:13, fontWeight:600, marginBottom:12 }}>{t(chart.labelKey)}</div>
              <MiniBarChart data={DAILY_DATA} valueKey={chart.key} color={chart.color} label={t('last_7_days')}/>
              <div style={{ display:'flex', justifyContent:'space-between', marginTop:12 }}>
                <span style={{ color:'#475569', fontSize:11 }}>{t('total')}: <span style={{ color:chart.color, fontWeight:700 }}>{fmtNum(DAILY_DATA.reduce((a,d)=>a+d[chart.key],0))}</span></span>
                <span style={{ color:'#475569', fontSize:11 }}>{t('avg')}: <span style={{ color:chart.color, fontWeight:700 }}>{Math.round(DAILY_DATA.reduce((a,d)=>a+d[chart.key],0)/DAILY_DATA.length)}/j</span></span>
              </div>
            </div>
          ))}
          <div style={{ ...S.card, gridColumn:'span 1' }}>
            <div style={{ color:'#e2e8f0', fontSize:13, fontWeight:600, marginBottom:12 }}>{t('event_distribution')}</div>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {topEvents.map(e => (
                <div key={e.type} style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ fontSize:14 }}>{e.icon}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
                      <span style={{ color:'#94a3b8', fontSize:11 }}>{e.label}</span>
                      <span style={{ color:e.color, fontWeight:700, fontSize:11 }}>{e.count}</span>
                    </div>
                    <div style={{ height:5, background:'#0a0a0f', borderRadius:3, overflow:'hidden' }}>
                      <div style={{ height:'100%', width:`${topEvents[0].count>0?(e.count/topEvents[0].count)*100:0}%`, background:e.color, borderRadius:3 }}/>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={S.card}>
            <div style={{ color:'#e2e8f0', fontSize:13, fontWeight:600, marginBottom:12 }}>{t('real_time_status')}</div>
            <DonutChart data={donutData}/>
            <div style={{ marginTop:10 }}>
              {donutData.map((d,i) => (
                <div key={i} style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <div style={{ width:8, height:8, borderRadius:'50%', background:d.color }}/>
                    <span style={{ color:'#94a3b8', fontSize:12 }}>{d.label}</span>
                  </div>
                  <span style={{ color:d.color, fontWeight:700, fontSize:12 }}>{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AI LOGS */}
      {tab === 'ailogs' && (
        <>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))', gap:12 }}>
            {[
              { icon:'🤖', label:t('total_logs'),    val:fmtNum(aiLogs.length),                                          color:'#a78bfa' },
              { icon:'✅', label:t('success'),       val:fmtNum(aiLogs.filter(l=>l.status==='success').length),          color:'#4ade80' },
              { icon:'🚫', label:t('blocked'),      val:fmtNum(aiLogs.filter(l=>l.status==='blocked').length),          color:'#f87171' },
              { icon:'⚠️', label:t('flagged'),      val:fmtNum(aiLogs.filter(l=>l.status==='flagged').length),          color:'#fbbf24' },
              { icon:'🔤', label:t('tokens_used'),  val:fmtNum(aiLogs.reduce((a,l)=>a+(l.tokens_used||0),0)),           color:'#C9A84C' },
              { icon:'🌐', label:t('languages'),    val:[...new Set(aiLogs.map(l=>l.language).filter(Boolean))].length, color:'#60a5fa' },
            ].map((s,i) => (
              <div key={i} style={{ ...S.card, display:'flex', flexDirection:'column', gap:6, padding:14 }}>
                <span style={{ fontSize:20 }}>{s.icon}</span>
                <span style={{ color:s.color, fontWeight:800, fontSize:18 }}>{s.val}</span>
                <span style={{ color:'#475569', fontSize:11 }}>{s.label}</span>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {['','translation','transcription','moderation','chat'].map(a => (
              <button key={a} onClick={() => setAiFilter(a)} style={{ ...S.filterBtn, ...(aiFilter===a?S.filterActive:{}) }}>{a||t('all')}</button>
            ))}
          </div>
          <div style={{ ...S.card, padding:0, overflow:'hidden' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ background:'#0d0d18' }}>
                  <th style={S.th}>{t('action_col')}</th><th style={S.th}>{t('model_col')}</th><th style={S.th}>{t('input_col')}</th>
                  <th style={S.th}>{t('output_col')}</th><th style={S.th}>{t('tokens_col')}</th><th style={S.th}>{t('lang_col')}</th>
                  <th style={S.th}>{t('status_col')}</th><th style={S.th}>{t('time_col')}</th>
                </tr>
              </thead>
              <tbody>
                {aiLogs.filter(l => !aiFilter || l.action === aiFilter).map((log,i) => {
                  const statusCfg = { success:{color:'#4ade80',bg:'rgba(74,222,128,0.1)',icon:'✅'}, blocked:{color:'#f87171',bg:'rgba(248,113,113,0.1)',icon:'🚫'}, flagged:{color:'#fbbf24',bg:'rgba(251,191,36,0.1)',icon:'⚠️'}, error:{color:'#fb923c',bg:'rgba(251,146,60,0.1)',icon:'❌'} }[log.status]||{color:'#64748b',bg:'transparent',icon:'?'};
                  const actionCfg = { translation:{icon:'🌐',color:'#60a5fa'}, transcription:{icon:'🎤',color:'#a78bfa'}, moderation:{icon:'🛡️',color:'#fbbf24'}, chat:{icon:'💬',color:'#4ade80'} }[log.action]||{icon:'🤖',color:'#64748b'};
                  return (
                    <tr key={log.id} style={{ background: i%2===0?'transparent':'rgba(255,255,255,0.01)' }}>
                      <td style={S.td}><span style={{ background:`${actionCfg.color}18`, border:`1px solid ${actionCfg.color}40`, color:actionCfg.color, padding:'2px 8px', borderRadius:10, fontSize:10, fontWeight:700 }}>{actionCfg.icon} {log.action}</span></td>
                      <td style={{ ...S.td, fontFamily:'monospace', fontSize:11, color:'#475569' }}>{log.model}</td>
                      <td style={{ ...S.td, maxWidth:120 }}><span style={{ color:'#64748b', fontSize:11, display:'block', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{log.input_text?.substring(0,30)}{log.input_text?.length>30?'...':''}</span></td>
                      <td style={{ ...S.td, maxWidth:120 }}><span style={{ color:'#64748b', fontSize:11, display:'block', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{log.output_text?.substring(0,25)}{log.output_text?.length>25?'...':''}</span></td>
                      <td style={{ ...S.td, color:'#C9A84C', fontWeight:700 }}>{fmtNum(log.tokens_used)}</td>
                      <td style={{ ...S.td, color:'#475569', fontSize:11 }}>{log.language?.toUpperCase()||'—'}</td>
                      <td style={S.td}><span style={{ background:statusCfg.bg, border:`1px solid ${statusCfg.color}40`, color:statusCfg.color, padding:'2px 8px', borderRadius:10, fontSize:10, fontWeight:700 }}>{statusCfg.icon} {log.status}</span></td>
                      <td style={{ ...S.td, color:'#334155', fontSize:11 }}>{timeAgo(log.created_at)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

    </div>
  );
}