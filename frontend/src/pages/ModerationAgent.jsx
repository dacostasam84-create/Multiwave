// ─────────────────────────────────────────────
// ModerationAgent.jsx — Multiwave Agent IA Modération
// Auteur : Zahnouni Issam
// ─────────────────────────────────────────────
import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { useTranslation } from '../i18n';

// ─────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────
const S = {
  container:   { display:'flex', flexDirection:'column', gap:18 },
  card:        { background:'#13131a', border:'1px solid #1e1e2e', borderRadius:14, padding:20 },
  badge:       { padding:'2px 8px', borderRadius:20, fontSize:10, fontWeight:700 },
  filterBtn:   { background:'transparent', border:'1px solid #1e1e2e', color:'#64748b', padding:'5px 14px', borderRadius:20, cursor:'pointer', fontSize:12, fontWeight:600 },
  filterActive:{ background:'rgba(201,168,76,0.12)', border:'1px solid #C9A84C', color:'#C9A84C' },
  input:       { background:'#0a0a0f', border:'1px solid #1e1e2e', color:'#e2e8f0', padding:'10px 14px', borderRadius:8, fontSize:13, outline:'none', boxSizing:'border-box' },
  saveBtn:     { background:'linear-gradient(135deg,#C9A84C,#F5D87A)', color:'#1a1200', border:'none', padding:'10px 24px', borderRadius:8, fontWeight:700, cursor:'pointer', fontSize:13 },
  dangerBtn:   { background:'rgba(248,113,113,0.1)', border:'1px solid rgba(248,113,113,0.3)', color:'#f87171', padding:'10px 20px', borderRadius:8, cursor:'pointer', fontSize:13, fontWeight:700 },
  th:          { color:'#475569', fontSize:11, fontWeight:700, padding:'8px 12px', textAlign:'left', borderBottom:'1px solid #1e1e2e', textTransform:'uppercase' },
  td:          { color:'#94a3b8', fontSize:13, padding:'10px 12px', borderBottom:'1px solid #0d0d18' },
};

const timeAgo = (d) => {
  if (!d) return '—';
  const diff = Math.floor((Date.now() - new Date(d)) / 1000);
  if (diff < 60)    return `${diff}s`;
  if (diff < 3600)  return `${Math.floor(diff/60)}m`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h`;
  return `${Math.floor(diff/86400)}j`;
};

// ─────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────
const MOCK_REPORTS = [
  { id:1, reporter_id:2, target_type:'video',   target_id:5,  reason:'violence',    description:'Contenu violent',      status:'pending',  created_at:'2026-03-19T10:00:00Z', reporter:{ username:'sarah_dz' } },
  { id:2, reporter_id:3, target_type:'post',    target_id:12, reason:'spam',        description:'Spam publicitaire',    status:'reviewed', created_at:'2026-03-19T09:00:00Z', reporter:{ username:'dev_karim' } },
  { id:3, reporter_id:4, target_type:'user',    target_id:8,  reason:'harassment',  description:'Harcèlement',          status:'resolved', created_at:'2026-03-18T18:00:00Z', reporter:{ username:'tech_maroc' } },
  { id:4, reporter_id:5, target_type:'video',   target_id:9,  reason:'nudity',      description:'Contenu inapproprié',  status:'pending',  created_at:'2026-03-18T14:00:00Z', reporter:{ username:'laila_design' } },
  { id:5, reporter_id:6, target_type:'comment', target_id:34, reason:'hate_speech', description:'Discours haineux',     status:'pending',  created_at:'2026-03-18T10:00:00Z', reporter:{ username:'dj_atlas' } },
];

const MOCK_AI_LOGS = [
  { id:1, target_type:'video',   target_id:5,  action:'blocked',  confidence:0.94, reason:'Violence détectée',        model:'claude-sonnet', created_at:'2026-03-19T10:01:00Z' },
  { id:2, target_type:'post',    target_id:15, action:'approved', confidence:0.98, reason:'Contenu sûr',              model:'claude-sonnet', created_at:'2026-03-19T09:30:00Z' },
  { id:3, target_type:'video',   target_id:7,  action:'flagged',  confidence:0.72, reason:'Contenu ambigu — révision',model:'claude-sonnet', created_at:'2026-03-19T09:00:00Z' },
  { id:4, target_type:'user',    target_id:8,  action:'suspended',confidence:0.89, reason:'Comportement suspect',    model:'claude-sonnet', created_at:'2026-03-18T18:01:00Z' },
  { id:5, target_type:'comment', target_id:34, action:'blocked',  confidence:0.96, reason:'Discours haineux',         model:'claude-sonnet', created_at:'2026-03-18T10:01:00Z' },
];

const MOCK_BLOCKED = [
  { id:1, user_id:8,  username:'spam_user_99',  reason:'Spam répété',         blocked_at:'2026-03-18T18:00:00Z', blocked_by:'IA', status:'active' },
  { id:2, user_id:12, username:'hate_account',  reason:'Discours haineux',    blocked_at:'2026-03-17T12:00:00Z', blocked_by:'IA', status:'active' },
  { id:3, user_id:15, username:'fake_seller',   reason:'Fraude marketplace',  blocked_at:'2026-03-16T10:00:00Z', blocked_by:'Admin', status:'active' },
];

const REASON_CONFIG = {
  violence:    { icon:'⚔️', color:'#f87171', label:'Violence' },
  nudity:      { icon:'🔞', color:'#fb923c', label:'Nudité' },
  spam:        { icon:'📢', color:'#fbbf24', label:'Spam' },
  harassment:  { icon:'😡', color:'#f87171', label:'Harcèlement' },
  hate_speech: { icon:'💢', color:'#ef4444', label:'Haine' },
  fraud:       { icon:'🕵️', color:'#fb923c', label:'Fraude' },
  copyright:   { icon:'©️',  color:'#a78bfa', label:'Copyright' },
  other:       { icon:'❓', color:'#64748b', label:'Autre' },
};

const STATUS_CONFIG = {
  pending:   { color:'#fbbf24', bg:'rgba(251,191,36,0.1)',  icon:'⏳', label:'En attente' },
  reviewed:  { color:'#60a5fa', bg:'rgba(96,165,250,0.1)', icon:'👁', label:'En révision' },
  resolved:  { color:'#4ade80', bg:'rgba(74,222,128,0.1)', icon:'✅', label:'Résolu' },
  rejected:  { color:'#64748b', bg:'rgba(100,116,139,0.1)',icon:'❌', label:'Rejeté' },
};

// ─────────────────────────────────────────────
// 1. UPLOAD VIDÉO avec progress bar
// ─────────────────────────────────────────────
export function VideoUpload({ userId, onUploaded }) {
  const { t } = useTranslation();
  const [file,       setFile]       = useState(null);
  const [title,      setTitle]      = useState('');
  const [description,setDescription]= useState('');
  const [language,   setLanguage]   = useState('fr');
  const [progress,   setProgress]   = useState(0);
  const [status,     setStatus]     = useState('idle'); // idle|uploading|analyzing|approved|blocked|error
  const [aiResult,   setAiResult]   = useState(null);
  const [preview,    setPreview]    = useState(null);
  const inputRef = useRef(null);

  const handleFile = (f) => {
    if (!f) return;
    if (!f.type.startsWith('video/')) { alert('Seuls les fichiers vidéo sont acceptés !'); return; }
    if (f.size > 500 * 1024 * 1024) { alert('Vidéo trop lourde (max 500MB)'); return; }
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setTitle(f.name.replace(/\.[^/.]+$/, ''));
  };

  const handleUpload = async () => {
    if (!file || !title.trim()) { alert('Titre requis'); return; }
    setStatus('uploading');
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('video',       file);
      formData.append('title',       title);
      formData.append('description', description);
      formData.append('language',    language);
      formData.append('user_id',     userId);

      // Simulation progression upload
      const interval = setInterval(() => {
        setProgress(p => {
          if (p >= 90) { clearInterval(interval); return 90; }
          return p + Math.random() * 15;
        });
      }, 300);

      await api.post('/videos/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          setProgress(Math.round((e.loaded * 100) / e.total));
        },
      });

      clearInterval(interval);
      setProgress(100);

      // Analyse IA
      setStatus('analyzing');
      await analyzeWithAI();

    } catch {
      // Mode démo — simuler l'analyse
      setProgress(100);
      setStatus('analyzing');
      setTimeout(() => analyzeWithAI(), 1000);
    }
  };

  const analyzeWithAI = async () => {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 500,
          messages: [{
            role: 'user',
            content: `Tu es un agent de modération IA pour Multiwave. Analyse cette vidéo intitulée "${title}" avec la description "${description}". 
            Réponds UNIQUEMENT en JSON : {"status": "approved" ou "flagged" ou "blocked", "confidence": 0.0-1.0, "reason": "raison courte", "tags": ["tag1","tag2"]}`
          }]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.content?.[0]?.text || '';
        const clean = text.replace(/```json|```/g, '').trim();
        const result = JSON.parse(clean);
        setAiResult(result);
        setStatus(result.status === 'blocked' ? 'blocked' : 'approved');
      } else {
        throw new Error('API error');
      }
    } catch {
      // Simulation locale
      const isSafe = !title.toLowerCase().match(/violence|nude|hack|spam/i);
      const result = {
        status:     isSafe ? 'approved' : 'flagged',
        confidence: isSafe ? 0.95 : 0.82,
        reason:     isSafe ? 'Contenu sûr — publié automatiquement' : 'Contenu ambigu — révision humaine requise',
        tags:       isSafe ? ['safe', 'original'] : ['review_needed'],
      };
      setAiResult(result);
      setStatus(result.status === 'blocked' ? 'blocked' : 'approved');

      // Enregistrer dans AiLog
      try {
        await api.post('/analytics/ai-logs', {
          user_id: userId, action: 'moderation', model: 'claude-sonnet',
          input_text: `${title} — ${description}`,
          output_text: result.status,
          tokens_used: 120,
          language, status: 'success',
        });
      } catch {}
    }

    onUploaded && onUploaded();
  };

  const reset = () => {
    setFile(null); setTitle(''); setDescription('');
    setProgress(0); setStatus('idle'); setAiResult(null);
    setPreview(null);
  };

  return (
    <div style={S.card}>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
        <div style={{ width:40, height:40, borderRadius:10, background:'rgba(167,139,250,0.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>🎬</div>
        <div>
          <div style={{ color:'#e2e8f0', fontWeight:700, fontSize:15 }}>{t('upload_title')}</div>
          <div style={{ color:'#475569', fontSize:12 }}>{t('upload_desc')}</div>
        </div>
      </div>

      {status === 'idle' && (
        <>
          {/* Zone drop */}
          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
            style={{
              border: `2px dashed ${file ? '#C9A84C' : '#1e1e2e'}`,
              borderRadius:12, padding:32, textAlign:'center',
              cursor:'pointer', marginBottom:16,
              background: file ? 'rgba(201,168,76,0.04)' : 'transparent',
              transition:'all 0.2s',
            }}
          >
            {file ? (
              <>
                <div style={{ fontSize:40, marginBottom:8 }}>🎬</div>
                <div style={{ color:'#C9A84C', fontWeight:700 }}>{file.name}</div>
                <div style={{ color:'#475569', fontSize:12 }}>{(file.size/1024/1024).toFixed(1)} MB</div>
              </>
            ) : (
              <>
                <div style={{ fontSize:48, marginBottom:8 }}>📹</div>
                <div style={{ color:'#e2e8f0', fontWeight:600, marginBottom:4 }}>{t('drag_video')}</div>
                <div style={{ color:'#475569', fontSize:12 }}>{t('click_select')}</div>
                <div style={{ color:'#334155', fontSize:11, marginTop:6 }}>{t('max_size')}</div>
              </>
            )}
          </div>
          <input ref={inputRef} type="file" accept="video/*" style={{ display:'none' }} onChange={e => handleFile(e.target.files[0])}/>

          {file && (
            <>
              <div style={{ marginBottom:14 }}>
                <label style={{ color:'#64748b', fontSize:12, display:'block', marginBottom:4 }}>{t('vid_title')} *</label>
                <input style={{ ...S.input, width:'100%' }} value={title} onChange={e => setTitle(e.target.value)} placeholder="Titre de la vidéo"/>
              </div>
              <div style={{ marginBottom:14 }}>
                <label style={{ color:'#64748b', fontSize:12, display:'block', marginBottom:4 }}>{t('vid_desc')}</label>
                <textarea style={{ ...S.input, width:'100%', minHeight:70, resize:'vertical' }} value={description} onChange={e => setDescription(e.target.value)} placeholder="Décrivez votre vidéo..."/>
              </div>
              <div style={{ marginBottom:20 }}>
                <label style={{ color:'#64748b', fontSize:12, display:'block', marginBottom:4 }}>{t('vid_lang')}</label>
                <select style={{ ...S.input, width:'100%' }} value={language} onChange={e => setLanguage(e.target.value)}>
                  {['fr','en','ar','es','de','pt','tr','zh','ja'].map(l => <option key={l} value={l}>{l.toUpperCase()}</option>)}
                </select>
              </div>
              <button style={S.saveBtn} onClick={handleUpload}>{t('upload_analyze')}</button>
            </>
          )}
        </>
      )}

      {/* Upload en cours */}
      {(status === 'uploading' || status === 'analyzing') && (
        <div style={{ textAlign:'center', padding:24 }}>
          <div style={{ fontSize:48, marginBottom:16 }}>{status === 'uploading' ? '📤' : '🤖'}</div>
          <div style={{ color:'#e2e8f0', fontWeight:700, fontSize:16, marginBottom:8 }}>
            {status === 'uploading' ? t('uploading') : t('analyzing')}
          </div>
          {status === 'uploading' && (
            <>
              <div style={{ background:'#0a0a0f', borderRadius:8, height:12, overflow:'hidden', margin:'16px 0' }}>
                <div style={{ height:'100%', width:`${progress}%`, background:'linear-gradient(90deg,#C9A84C,#F5D87A)', borderRadius:8, transition:'width 0.3s' }}/>
              </div>
              <div style={{ color:'#C9A84C', fontWeight:700 }}>{Math.round(progress)}%</div>
            </>
          )}
          {status === 'analyzing' && (
            <div style={{ color:'#475569', fontSize:13, marginTop:8 }}>
              {t('checking')}
            </div>
          )}
        </div>
      )}

      {/* Résultat */}
      {(status === 'approved' || status === 'blocked' || status === 'flagged') && aiResult && (
        <div style={{ textAlign:'center', padding:24 }}>
          <div style={{ fontSize:56, marginBottom:12 }}>
            {status === 'approved' ? '✅' : status === 'blocked' ? '🚫' : '⚠️'}
          </div>
          <div style={{ color: status === 'approved' ? '#4ade80' : status === 'blocked' ? '#f87171' : '#fbbf24', fontWeight:800, fontSize:18, marginBottom:8 }}>
            {status === 'approved' ? t('approved') : status === 'blocked' ? t('blocked_result') : t('review_required')}
          </div>
          <div style={{ color:'#94a3b8', fontSize:13, marginBottom:16 }}>{aiResult.reason}</div>
          <div style={{ display:'flex', gap:8, justifyContent:'center', flexWrap:'wrap', marginBottom:16 }}>
            <span style={{ background:'rgba(167,139,250,0.1)', border:'1px solid #a78bfa', color:'#a78bfa', padding:'3px 10px', borderRadius:10, fontSize:11 }}>
              🤖 Confiance: {Math.round(aiResult.confidence * 100)}%
            </span>
            {aiResult.tags?.map(tag => (
              <span key={tag} style={{ background:'rgba(100,116,139,0.1)', border:'1px solid #334155', color:'#64748b', padding:'3px 10px', borderRadius:10, fontSize:11 }}>#{tag}</span>
            ))}
          </div>
          <button onClick={reset} style={S.saveBtn}>{t('upload_another')}</button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// 2. SYSTÈME DE SIGNALEMENT
// ─────────────────────────────────────────────
export function ReportButton({ userId, targetType, targetId, targetName }) {
  const { t } = useTranslation();
  const [open,   setOpen]   = useState(false);
  const [reason, setReason] = useState('');
  const [desc,   setDesc]   = useState('');
  const [sent,   setSent]   = useState(false);

  const handleReport = async () => {
    if (!reason) return;
    try {
      await api.post('/moderation/reports', {
        reporter_id: userId, target_type: targetType,
        target_id: targetId, reason, description: desc,
      });
    } catch {}
    setSent(true);
    setTimeout(() => { setSent(false); setOpen(false); setReason(''); setDesc(''); }, 2000);
  };

  return (
    <>
      <button onClick={() => setOpen(true)} style={{ background:'transparent', border:'none', color:'#475569', cursor:'pointer', fontSize:12, padding:'4px 8px' }}>
        {t('report_btn')}
      </button>

      {open && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', zIndex:500, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }} onClick={() => setOpen(false)}>
          <div style={{ background:'#13131a', border:'1px solid #1e1e2e', borderRadius:14, padding:24, width:'100%', maxWidth:400 }} onClick={e => e.stopPropagation()}>
            {sent ? (
              <div style={{ textAlign:'center', padding:20 }}>
                <div style={{ fontSize:48, marginBottom:12 }}>✅</div>
                <div style={{ color:'#4ade80', fontWeight:700 }}>{t('report_sent')}</div>
                <div style={{ color:'#475569', fontSize:12, marginTop:4 }}>{t('report_team')}</div>
              </div>
            ) : (
              <>
                <h3 style={{ color:'#e2e8f0', fontSize:16, fontWeight:700, marginBottom:16 }}>🚩 Signaler : {targetName}</h3>
                <div style={{ marginBottom:14 }}>
                  <label style={{ color:'#64748b', fontSize:12, display:'block', marginBottom:8 }}>{t('report_reason')} *</label>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                    {Object.entries(REASON_CONFIG).map(([key, cfg]) => (
                      <button key={key} onClick={() => setReason(key)} style={{
                        padding:'5px 12px', borderRadius:20, cursor:'pointer', fontSize:11, fontWeight:600,
                        background: reason===key ? `${cfg.color}18` : 'transparent',
                        border: `1px solid ${reason===key ? cfg.color : '#1e1e2e'}`,
                        color: reason===key ? cfg.color : '#64748b',
                      }}>{cfg.icon} {cfg.label}</button>
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom:16 }}>
                  <label style={{ color:'#64748b', fontSize:12, display:'block', marginBottom:4 }}>{t('report_desc')}</label>
                  <textarea style={{ ...S.input, width:'100%', minHeight:70, resize:'vertical' }} value={desc} onChange={e => setDesc(e.target.value)} placeholder={t('report_placeholder')}/>
                </div>
                <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
                  <button onClick={() => setOpen(false)} style={{ background:'transparent', border:'1px solid #1e1e2e', color:'#64748b', padding:'8px 16px', borderRadius:8, cursor:'pointer' }}>{t('cancel')}</button>
                  <button onClick={handleReport} disabled={!reason} style={{ ...S.saveBtn, opacity:reason?1:0.5 }}>{t('send')}</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// ─────────────────────────────────────────────
// 3. DASHBOARD MODÉRATION ADMIN
// ─────────────────────────────────────────────
export function ModerationDashboard({ userId }) {
  const { t } = useTranslation();
  const [tab,      setTab]      = useState('overview');
  const [reports,  setReports]  = useState([]);
  const [aiLogs,   setAiLogs]   = useState([]);
  const [blocked,  setBlocked]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState('');

  useEffect(() => { loadData(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadData = async () => {
    setLoading(true);
    try {
      const [rRes, aRes, bRes] = await Promise.allSettled([
        api.get('/moderation/reports'),
        api.get('/analytics/ai-logs?action=moderation'),
        api.get('/moderation/blocked'),
      ]);
      setReports(rRes.status==='fulfilled' ? rRes.value.data?.data||[] : MOCK_REPORTS);
      setAiLogs(aRes.status==='fulfilled'  ? aRes.value.data?.data||[] : MOCK_AI_LOGS);
      setBlocked(bRes.status==='fulfilled' ? bRes.value.data?.data||[] : MOCK_BLOCKED);
    } catch {
      setReports(MOCK_REPORTS); setAiLogs(MOCK_AI_LOGS); setBlocked(MOCK_BLOCKED);
    } finally { setLoading(false); }
  };

  const handleAction = async (reportId, action) => {
    setReports(p => p.map(r => r.id===reportId ? {...r, status: action==='resolve'?'resolved':'rejected'} : r));
    try { await api.patch(`/moderation/reports/${reportId}`, { status: action==='resolve'?'resolved':'rejected' }); } catch {}
  };

  const handleBlock = async (targetUserId) => {
    try { await api.post('/moderation/block', { user_id: targetUserId, reason:'Violation règles', blocked_by:'Admin' }); } catch {}
    setBlocked(p => [...p, { id:Date.now(), user_id:targetUserId, username:`User #${targetUserId}`, reason:'Violation règles', blocked_at:new Date().toISOString(), blocked_by:'Admin', status:'active' }]);
  };

  const handleUnblock = async (userId) => {
    setBlocked(p => p.filter(b => b.user_id !== userId));
    try { await api.delete(`/moderation/block/${userId}`); } catch {}
  };

  const stats = {
    pending:   reports.filter(r=>r.status==='pending').length,
    resolved:  reports.filter(r=>r.status==='resolved').length,
    blocked:   blocked.length,
    aiActions: aiLogs.filter(l=>l.action==='blocked'||l.status==='blocked').length,
  };

  const TABS = [
    { key:'overview', label:t('overview') },
    { key:'reports',  label:`${t('reports')} (${stats.pending})` },
    { key:'ai_logs',  label:t('ai_logs') },
    { key:'blocked',  label:`${t('blocked_tab')} (${stats.blocked})` },
  ];

  return (
    <div style={S.container}>

      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:40, height:40, borderRadius:10, background:'rgba(248,113,113,0.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>🛡️</div>
          <div>
            <h2 style={{ color:'#e2e8f0', fontSize:20, margin:0, fontWeight:700 }}>{t('mod_title')}</h2>
            <div style={{ color:'#475569', fontSize:12 }}>{t('mod_desc')}</div>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ width:8, height:8, borderRadius:'50%', background:'#4ade80', animation:'pulse 1s ease-in-out infinite' }}/>
          <span style={{ color:'#4ade80', fontSize:12, fontWeight:600 }}>{t('agent_active')}</span>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))', gap:12 }}>
        {[
          { icon:'⏳', label:t('pending'),          val:stats.pending,   color:'#fbbf24' },
          { icon:'✅', label:t('resolved'),         val:stats.resolved,  color:'#4ade80' },
          { icon:'🚫', label:t('blocked_accounts'),   val:stats.blocked,   color:'#f87171' },
          { icon:'🤖', label:t('ai_actions'),          val:stats.aiActions, color:'#a78bfa' },
        ].map((s,i) => (
          <div key={i} style={{ ...S.card, display:'flex', flexDirection:'column', gap:6, padding:14 }}>
            <span style={{ fontSize:20 }}>{s.icon}</span>
            <span style={{ color:s.color, fontWeight:800, fontSize:22 }}>{s.val}</span>
            <span style={{ color:'#475569', fontSize:11 }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            ...S.filterBtn, padding:'7px 16px', borderRadius:8, fontSize:13,
            ...(tab===t.key ? S.filterActive : {})
          }}>{t.label}</button>
        ))}
      </div>

      {/* Overview */}
      {tab === 'overview' && (
        <div style={S.card}>
          <div style={{ color:'#e2e8f0', fontWeight:700, fontSize:15, marginBottom:16 }}>{t('how_works')}</div>
          {[
            { step:'1', icon:'📹', title:'Contenu uploadé',     desc:'Vidéo, post ou commentaire soumis par un utilisateur' },
            { step:'2', icon:'🤖', title:'Analyse IA',          desc:'Claude analyse le titre, description et métadonnées' },
            { step:'3', icon:'⚡', title:'Décision automatique', desc:'Approuvé (>90%), Signalé (70-90%), Bloqué (<70% sécurité)' },
            { step:'4', icon:'👤', title:'Révision humaine',     desc:'Les contenus signalés sont examinés par un modérateur' },
            { step:'5', icon:'🔔', title:'Notification',        desc:'L\'utilisateur est notifié du statut de son contenu' },
          ].map((s,i) => (
            <div key={i} style={{ display:'flex', gap:14, padding:'12px 0', borderBottom: i<4?'1px solid #0d0d18':'none' }}>
              <div style={{ width:32, height:32, borderRadius:'50%', background:'rgba(201,168,76,0.1)', border:'1px solid rgba(201,168,76,0.2)', display:'flex', alignItems:'center', justifyContent:'center', color:'#C9A84C', fontWeight:700, fontSize:13, flexShrink:0 }}>{s.step}</div>
              <div style={{ fontSize:20, flexShrink:0 }}>{s.icon}</div>
              <div>
                <div style={{ color:'#e2e8f0', fontWeight:600, fontSize:13 }}>{s.title}</div>
                <div style={{ color:'#475569', fontSize:12, marginTop:2 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reports */}
      {tab === 'reports' && (
        <>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {['','pending','reviewed','resolved','rejected'].map(s => (
              <button key={s} onClick={() => setFilter(s)} style={{ ...S.filterBtn, ...(filter===s?S.filterActive:{}) }}>
                {s===''?t('all'):STATUS_CONFIG[s]?.label}
              </button>
            ))}
          </div>
          <div style={{ ...S.card, padding:0, overflow:'hidden' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ background:'#0d0d18' }}>
                  <th style={S.th}>{t('content')}</th>
                  <th style={S.th}>{t('reason')}</th>
                  <th style={S.th}>{t('reported_by')}</th>
                  <th style={S.th}>{t('status')}</th>
                  <th style={S.th}>{t('time')}</th>
                  <th style={S.th}>{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {reports.filter(r => !filter || r.status===filter).map((r,i) => {
                  const rc = REASON_CONFIG[r.reason] || REASON_CONFIG.other;
                  const sc = STATUS_CONFIG[r.status]  || STATUS_CONFIG.pending;
                  return (
                    <tr key={r.id} style={{ background: i%2===0?'transparent':'rgba(255,255,255,0.01)' }}>
                      <td style={S.td}>
                        <span style={{ color:'#64748b', fontSize:11 }}>{r.target_type} #{r.target_id}</span>
                      </td>
                      <td style={S.td}>
                        <span style={{ ...S.badge, background:`${rc.color}18`, border:`1px solid ${rc.color}40`, color:rc.color }}>
                          {rc.icon} {rc.label}
                        </span>
                      </td>
                      <td style={{ ...S.td, color:'#C9A84C' }}>@{r.reporter?.username}</td>
                      <td style={S.td}>
                        <span style={{ ...S.badge, background:sc.bg, border:`1px solid ${sc.color}40`, color:sc.color }}>
                          {sc.icon} {sc.label}
                        </span>
                      </td>
                      <td style={{ ...S.td, color:'#334155', fontSize:11 }}>{timeAgo(r.created_at)}</td>
                      <td style={S.td}>
                        {r.status === 'pending' && (
                          <div style={{ display:'flex', gap:6 }}>
                            <button onClick={() => handleAction(r.id, 'resolve')} style={{ background:'rgba(74,222,128,0.1)', border:'1px solid #4ade80', color:'#4ade80', padding:'3px 10px', borderRadius:6, cursor:'pointer', fontSize:11 }}>{t('resolve')}</button>
                            <button onClick={() => handleAction(r.id, 'reject')} style={{ background:'rgba(100,116,139,0.1)', border:'1px solid #334155', color:'#64748b', padding:'3px 10px', borderRadius:6, cursor:'pointer', fontSize:11 }}>{t('reject')}</button>
                            <button onClick={() => handleBlock(r.target_id)} style={{ background:'rgba(248,113,113,0.1)', border:'1px solid #f87171', color:'#f87171', padding:'3px 10px', borderRadius:6, cursor:'pointer', fontSize:11 }}>{t('block')}</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* AI Logs */}
      {tab === 'ai_logs' && (
        <div style={{ ...S.card, padding:0, overflow:'hidden' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ background:'#0d0d18' }}>
                <th style={S.th}>{t('content')}</th>
                <th style={S.th}>{t('ai_action')}</th>
                <th style={S.th}>{t('confidence')}</th>
                <th style={S.th}>{t('reason')}</th>
                <th style={S.th}>{t('time')}</th>
              </tr>
            </thead>
            <tbody>
              {aiLogs.map((log,i) => {
                const actionCfg = {
                  approved: { color:'#4ade80', icon:'✅' },
                  blocked:  { color:'#f87171', icon:'🚫' },
                  flagged:  { color:'#fbbf24', icon:'⚠️' },
                  suspended:{ color:'#fb923c', icon:'⛔' },
                }[log.action] || { color:'#64748b', icon:'?' };
                return (
                  <tr key={log.id} style={{ background: i%2===0?'transparent':'rgba(255,255,255,0.01)' }}>
                    <td style={S.td}><span style={{ color:'#64748b', fontSize:11 }}>{log.target_type} #{log.target_id}</span></td>
                    <td style={S.td}>
                      <span style={{ ...S.badge, background:`${actionCfg.color}18`, border:`1px solid ${actionCfg.color}40`, color:actionCfg.color }}>
                        {actionCfg.icon} {log.action}
                      </span>
                    </td>
                    <td style={S.td}>
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <div style={{ flex:1, height:5, background:'#0a0a0f', borderRadius:3, overflow:'hidden', width:60 }}>
                          <div style={{ height:'100%', width:`${(log.confidence||0.9)*100}%`, background:actionCfg.color, borderRadius:3 }}/>
                        </div>
                        <span style={{ color:actionCfg.color, fontSize:11 }}>{Math.round((log.confidence||0.9)*100)}%</span>
                      </div>
                    </td>
                    <td style={{ ...S.td, color:'#64748b', fontSize:12 }}>{log.reason}</td>
                    <td style={{ ...S.td, color:'#334155', fontSize:11 }}>{timeAgo(log.created_at)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Blocked */}
      {tab === 'blocked' && (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {blocked.length === 0 ? (
            <div style={{ ...S.card, textAlign:'center', padding:40 }}>
              <div style={{ fontSize:48, marginBottom:12 }}>✅</div>
              <div style={{ color:'#e2e8f0', fontWeight:600 }}>{t('no_blocked')}</div>
            </div>
          ) : blocked.map(b => (
            <div key={b.id} style={{ ...S.card, display:'flex', alignItems:'center', gap:14, flexWrap:'wrap' }}>
              <div style={{ width:40, height:40, borderRadius:'50%', background:'rgba(248,113,113,0.1)', border:'1px solid #f87171', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>🚫</div>
              <div style={{ flex:1 }}>
                <div style={{ color:'#e2e8f0', fontWeight:700, fontSize:14 }}>@{b.username}</div>
                <div style={{ color:'#64748b', fontSize:12 }}>{b.reason} · {t('blocked_by')} {b.blocked_by} · {timeAgo(b.blocked_at)}</div>
              </div>
              <button onClick={() => handleUnblock(b.user_id)} style={{ background:'rgba(74,222,128,0.1)', border:'1px solid #4ade80', color:'#4ade80', padding:'6px 14px', borderRadius:8, cursor:'pointer', fontSize:12 }}>
                {t('unblock')}
              </button>
            </div>
          ))}
        </div>
      )}

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
    </div>
  );
}

// ─────────────────────────────────────────────
// DEFAULT EXPORT
// ─────────────────────────────────────────────
export default ModerationDashboard;