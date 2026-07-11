// ─────────────────────────────────────────────
// Medias.jsx — Multiwave Médias
// Auteur : Zahnouni Issam
// ─────────────────────────────────────────────
import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { useTranslation } from '../i18n';

const S = {
  container:   { display:'flex', flexDirection:'column', gap:18 },
  card:        { background:'#13131a', border:'1px solid #1e1e2e', borderRadius:14, overflow:'hidden' },
  filterBtn:   { background:'transparent', border:'1px solid #1e1e2e', color:'#64748b', padding:'5px 14px', borderRadius:20, cursor:'pointer', fontSize:12, fontWeight:600 },
  filterActive:{ background:'rgba(201,168,76,0.12)', border:'1px solid #C9A84C', color:'#C9A84C' },
  badge:       { padding:'2px 8px', borderRadius:20, fontSize:10, fontWeight:700 },
  input:       { background:'#0a0a0f', border:'1px solid #1e1e2e', color:'#e2e8f0', padding:'9px 14px', borderRadius:8, fontSize:13, outline:'none', boxSizing:'border-box', width:'100%' },
  saveBtn:     { background:'linear-gradient(135deg,#C9A84C,#F5D87A)', color:'#1a1200', border:'none', padding:'10px 24px', borderRadius:8, fontWeight:700, cursor:'pointer', fontSize:13 },
  empty:       { color:'#475569', textAlign:'center', padding:'48px 24px', fontSize:14 },
};

const fmtSize = (bytes) => {
  if (!bytes) return '—';
  if (bytes < 1024)       return `${bytes} B`;
  if (bytes < 1048576)    return `${(bytes/1024).toFixed(1)} KB`;
  if (bytes < 1073741824) return `${(bytes/1048576).toFixed(1)} MB`;
  return `${(bytes/1073741824).toFixed(1)} GB`;
};
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR',{day:'2-digit',month:'short',year:'numeric'}) : '—';

const FILE_TYPES = {
  image: { icon:'🖼️', color:'#60a5fa', label:'Image',  accept:'image/*' },
  video: { icon:'🎬', color:'#a78bfa', label:'Vidéo',  accept:'video/*' },
  audio: { icon:'🎵', color:'#4ade80', label:'Audio',  accept:'audio/*' },
  file:  { icon:'📎', color:'#f97316', label:'Fichier',accept:'*/*'     },
};

const MOCK_UPLOADS = [
  { id:1, user_id:1, filename:'photo-profil.jpg',      file_type:'image', path:'https://picsum.photos/seed/u1/400/300', size:245000,   mimetype:'image/jpeg', created_at:'2026-03-13T10:00:00Z' },
  { id:2, user_id:1, filename:'presentation-2026.mp4', file_type:'video', path:null,                                    size:15400000, mimetype:'video/mp4',  created_at:'2026-03-12T14:00:00Z' },
  { id:3, user_id:1, filename:'podcast-ep1.mp3',       file_type:'audio', path:null,                                    size:8200000,  mimetype:'audio/mpeg', created_at:'2026-03-12T09:00:00Z' },
  { id:4, user_id:1, filename:'rapport-mars.pdf',      file_type:'file',  path:null,                                    size:1200000,  mimetype:'application/pdf', created_at:'2026-03-11T16:00:00Z' },
  { id:5, user_id:1, filename:'cover-art.png',         file_type:'image', path:'https://picsum.photos/seed/u5/400/300', size:512000,   mimetype:'image/png',  created_at:'2026-03-11T11:00:00Z' },
  { id:6, user_id:1, filename:'logo-multiwave.png',    file_type:'image', path:'https://picsum.photos/seed/u7/400/300', size:98000,    mimetype:'image/png',  created_at:'2026-03-10T10:00:00Z' },
];

function MediaPreview({ file }) {
  const cfg = FILE_TYPES[file.file_type] || FILE_TYPES.file;
  if (file.file_type === 'image' && file.path) {
    return <img src={file.path} alt={file.filename} style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e=>e.target.style.display='none'}/>;
  }
  return (
    <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', background:'#0a0a0f' }}>
      <span style={{ fontSize:40 }}>{cfg.icon}</span>
    </div>
  );
}

function MediaCard({ file, onView, onDelete, selected, onSelect }) {
  const cfg = FILE_TYPES[file.file_type] || FILE_TYPES.file;
  return (
    <div style={{ ...S.card, cursor:'pointer', transition:'all 0.15s', border:selected?`1px solid ${cfg.color}`:'1px solid #1e1e2e', position:'relative' }}
      onClick={() => onView(file)}
      onMouseEnter={e => e.currentTarget.style.borderColor=cfg.color+'60'}
      onMouseLeave={e => e.currentTarget.style.borderColor=selected?cfg.color:'#1e1e2e'}
    >
      <div onClick={e=>{e.stopPropagation();onSelect(file.id);}} style={{ position:'absolute', top:8, left:8, zIndex:2, width:20, height:20, borderRadius:5, background:selected?cfg.color:'rgba(0,0,0,0.5)', border:`2px solid ${selected?cfg.color:'rgba(255,255,255,0.3)'}`, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
        {selected && <span style={{ color:'#1a1200', fontSize:12, fontWeight:700 }}>✓</span>}
      </div>
      <div style={{ height:140, position:'relative', overflow:'hidden' }}>
        <MediaPreview file={file}/>
        <div style={{ position:'absolute', bottom:6, right:6 }}>
          <span style={{ ...S.badge, background:`${cfg.color}22`, border:`1px solid ${cfg.color}50`, color:cfg.color }}>{cfg.icon} {file.file_type}</span>
        </div>
      </div>
      <div style={{ padding:'10px 12px' }}>
        <div style={{ color:'#e2e8f0', fontSize:12, fontWeight:600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', marginBottom:4 }}>{file.filename}</div>
        <div style={{ display:'flex', justifyContent:'space-between' }}>
          <span style={{ color:'#475569', fontSize:11 }}>{fmtSize(file.size)}</span>
          <span style={{ color:'#334155', fontSize:10 }}>{fmtDate(file.created_at)}</span>
        </div>
      </div>
    </div>
  );
}

function MediaList({ files, onView, onDelete, selected, onSelect }) {
  return (
    <div style={{ background:'#13131a', border:'1px solid #1e1e2e', borderRadius:14, overflow:'hidden' }}>
      {files.map((file,i) => {
        const cfg = FILE_TYPES[file.file_type] || FILE_TYPES.file;
        const isSelected = selected.includes(file.id);
        return (
          <div key={file.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', borderBottom:i<files.length-1?'1px solid #0d0d18':'none', cursor:'pointer', background:isSelected?`${cfg.color}08`:'transparent' }} onClick={()=>onView(file)}>
            <div onClick={e=>{e.stopPropagation();onSelect(file.id);}} style={{ width:18, height:18, borderRadius:4, background:isSelected?cfg.color:'transparent', border:`2px solid ${isSelected?cfg.color:'#334155'}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, cursor:'pointer' }}>
              {isSelected && <span style={{ color:'#1a1200', fontSize:10 }}>✓</span>}
            </div>
            <div style={{ width:36, height:36, borderRadius:8, overflow:'hidden', flexShrink:0, background:'#0a0a0f', display:'flex', alignItems:'center', justifyContent:'center' }}>
              {file.file_type==='image'&&file.path ? <img src={file.path} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e=>e.target.style.display='none'}/> : <span style={{ fontSize:18 }}>{cfg.icon}</span>}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ color:'#e2e8f0', fontSize:13, fontWeight:600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{file.filename}</div>
              <div style={{ color:'#475569', fontSize:11, marginTop:2 }}>{file.mimetype} · {fmtSize(file.size)}</div>
            </div>
            <span style={{ ...S.badge, background:`${cfg.color}18`, border:`1px solid ${cfg.color}40`, color:cfg.color, flexShrink:0 }}>{cfg.label}</span>
            <span style={{ color:'#334155', fontSize:11, flexShrink:0 }}>{fmtDate(file.created_at)}</span>
            <button onClick={e=>{e.stopPropagation();onDelete(file.id);}} style={{ background:'rgba(248,113,113,0.1)', border:'1px solid rgba(248,113,113,0.2)', color:'#f87171', width:28, height:28, borderRadius:6, cursor:'pointer', fontSize:13, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>🗑️</button>
          </div>
        );
      })}
    </div>
  );
}

function PreviewModal({ file, onClose, onDelete }) {
  const { t } = useTranslation();
  const cfg = FILE_TYPES[file.file_type] || FILE_TYPES.file;
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.9)', zIndex:300, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }} onClick={onClose}>
      <div style={{ background:'#13131a', border:'1px solid #1e1e2e', borderRadius:16, maxWidth:700, width:'100%', overflow:'hidden' }} onClick={e=>e.stopPropagation()}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 18px', borderBottom:'1px solid #1e1e2e' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <span style={{ fontSize:20 }}>{cfg.icon}</span>
            <div>
              <div style={{ color:'#e2e8f0', fontWeight:600, fontSize:14 }}>{file.filename}</div>
              <div style={{ color:'#475569', fontSize:11 }}>{file.mimetype} · {fmtSize(file.size)}</div>
            </div>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            {file.path && <a href={file.path} download={file.filename} style={{ background:'rgba(201,168,76,0.12)', border:'1px solid rgba(201,168,76,0.3)', color:'#C9A84C', padding:'6px 12px', borderRadius:8, fontSize:12, fontWeight:700, textDecoration:'none' }}>{t('download')}</a>}
            <button onClick={()=>{onDelete(file.id);onClose();}} style={{ background:'rgba(248,113,113,0.1)', border:'1px solid rgba(248,113,113,0.2)', color:'#f87171', padding:'6px 12px', borderRadius:8, fontSize:12, cursor:'pointer' }}>{t('delete')}</button>
            <button onClick={onClose} style={{ background:'none', border:'none', color:'#64748b', cursor:'pointer', fontSize:20 }}>✕</button>
          </div>
        </div>
        <div style={{ padding:20, display:'flex', justifyContent:'center', background:'#0a0a0f', minHeight:200 }}>
          {file.file_type==='image'&&file.path && <img src={file.path} alt={file.filename} style={{ maxWidth:'100%', maxHeight:400, borderRadius:8, objectFit:'contain' }}/>}
          {file.file_type==='video'&&file.path && <video src={file.path} controls style={{ maxWidth:'100%', maxHeight:400, borderRadius:8 }}/>}
          {file.file_type==='audio'&&file.path && <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:16, padding:40 }}><span style={{ fontSize:64 }}>🎵</span><audio src={file.path} controls style={{ width:300 }}/></div>}
          {(!file.path||file.file_type==='file') && <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:12, padding:40 }}><span style={{ fontSize:64 }}>{cfg.icon}</span><div style={{ color:'#64748b', fontSize:14 }}>{t('no_preview')}</div></div>}
        </div>
        <div style={{ padding:'14px 18px', borderTop:'1px solid #1e1e2e', display:'flex', gap:20, flexWrap:'wrap' }}>
          {[{label:t('type'),val:file.mimetype},{label:t('size'),val:fmtSize(file.size)},{label:t('added_on'),val:fmtDate(file.created_at)}].map((m,i)=>(
            <div key={i}><div style={{ color:'#475569', fontSize:11 }}>{m.label}</div><div style={{ color:'#94a3b8', fontSize:12, fontWeight:600 }}>{m.val}</div></div>
          ))}
        </div>
      </div>
    </div>
  );
}

function UploadZone({ userId, onUploaded }) {
  const { t } = useTranslation();
  const [dragging, setDragging] = useState(false);
  const [files,    setFiles]    = useState([]);
  const [loading,  setLoading]  = useState(false);
  const fileRef = useRef(null);

  const handleFiles = (fileList) => {
    const arr = Array.from(fileList).map(f => ({ file:f, name:f.name, size:f.size, type:f.type, preview:f.type.startsWith('image/')?URL.createObjectURL(f):null }));
    setFiles(p => [...p, ...arr]);
  };

  const handleUpload = async () => {
    if (!files.length) return;
    setLoading(true);
    const uploaded = [];
    for (const f of files) {
      const formData = new FormData();
      formData.append('file', f.file);
      formData.append('user_id', userId);
      try {
        const res = await api.post('/uploads', formData, { headers:{ 'Content-Type':'multipart/form-data' } });
        uploaded.push(res.data?.data || res.data);
      } catch {
        uploaded.push({ id:Date.now()+Math.random(), user_id:userId, filename:f.name, file_type:f.type.split('/')[0]||'file', path:f.preview, size:f.size, mimetype:f.type, created_at:new Date().toISOString() });
      }
    }
    setLoading(false); setFiles([]);
    onUploaded && onUploaded(uploaded);
  };

  return (
    <div style={{ background:'#13131a', border:'1px solid #1e1e2e', borderRadius:14, padding:20 }}>
      <div style={{ color:'#e2e8f0', fontWeight:700, fontSize:15, marginBottom:14 }}>{t('upload_files')}</div>
      <div onDragOver={e=>{e.preventDefault();setDragging(true);}} onDragLeave={()=>setDragging(false)} onDrop={e=>{e.preventDefault();setDragging(false);handleFiles(e.dataTransfer.files);}} onClick={()=>fileRef.current?.click()}
        style={{ border:`2px dashed ${dragging?'#C9A84C':'#1e1e2e'}`, borderRadius:10, padding:'30px 20px', textAlign:'center', cursor:'pointer', background:dragging?'rgba(201,168,76,0.05)':'transparent', transition:'all 0.2s', marginBottom:14 }}>
        <input ref={fileRef} type="file" multiple style={{ display:'none' }} onChange={e=>handleFiles(e.target.files)}/>
        <div style={{ fontSize:40, marginBottom:10 }}>📂</div>
        <div style={{ color:'#94a3b8', fontSize:14, marginBottom:4 }}>{t('drag_files')}</div>
        <div style={{ color:'#475569', fontSize:12 }}>{t('click_browse')}</div>
      </div>
      {files.length > 0 && (
        <>
          <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:14 }}>
            {files.map((f,i) => {
              const type=f.type.split('/')[0]; const cfg=FILE_TYPES[type]||FILE_TYPES.file;
              return (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:10, background:'#0a0a0f', borderRadius:8, padding:'8px 12px' }}>
                  {f.preview ? <img src={f.preview} alt="" style={{ width:36, height:36, borderRadius:6, objectFit:'cover' }}/> : <span style={{ fontSize:22 }}>{cfg.icon}</span>}
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ color:'#e2e8f0', fontSize:12, fontWeight:600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{f.name}</div>
                    <div style={{ color:'#475569', fontSize:11 }}>{fmtSize(f.size)}</div>
                  </div>
                  <button onClick={()=>setFiles(p=>p.filter((_,j)=>j!==i))} style={{ background:'none', border:'none', color:'#64748b', cursor:'pointer', fontSize:14 }}>✕</button>
                </div>
              );
            })}
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <button onClick={()=>setFiles([])} style={{ background:'transparent', border:'1px solid #1e1e2e', color:'#64748b', padding:'9px 18px', borderRadius:8, cursor:'pointer', fontSize:13 }}>{t('clear')}</button>
            <button onClick={handleUpload} disabled={loading} style={{ ...S.saveBtn, flex:1 }}>
              {loading ? t('uploading_files') : `${t('upload_n_files')} ${files.length}`}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function Medias({ userId }) {
  const { t } = useTranslation();
  const [files,    setFiles]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState('all');
  const [sortBy,   setSortBy]   = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [search,   setSearch]   = useState('');
  const [preview,  setPreview]  = useState(null);
  const [selected, setSelected] = useState([]);
  const [tab,      setTab]      = useState('browse');

  useEffect(() => { loadFiles(); }, []); // eslint-disable-line

  const loadFiles = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/uploads?user_id=${userId}`);
      setFiles(res.data?.data || res.data || []);
    } catch { setFiles(MOCK_UPLOADS); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    setFiles(p=>p.filter(f=>f.id!==id)); setSelected(p=>p.filter(s=>s!==id));
    try { await api.delete(`/uploads/${id}`); } catch {}
  };

  const handleDeleteSelected = async () => {
    setFiles(p=>p.filter(f=>!selected.includes(f.id)));
    try { await Promise.all(selected.map(id=>api.delete(`/uploads/${id}`))); } catch {}
    setSelected([]);
  };

  const toggleSelect = (id) => setSelected(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);
  const selectAll    = () => setSelected(filtered.map(f=>f.id));
  const clearSelect  = () => setSelected([]);

  const SORT_OPTIONS = [
    { value:'newest',  label:t('newest') },
    { value:'oldest',  label:t('oldest') },
    { value:'largest', label:t('largest') },
    { value:'name',    label:t('name_az') },
  ];

  let filtered = files.filter(f => (filter==='all'||f.file_type===filter) && f.filename.toLowerCase().includes(search.toLowerCase()));
  if (sortBy==='newest')  filtered=[...filtered].sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));
  if (sortBy==='oldest')  filtered=[...filtered].sort((a,b)=>new Date(a.created_at)-new Date(b.created_at));
  if (sortBy==='largest') filtered=[...filtered].sort((a,b)=>b.size-a.size);
  if (sortBy==='name')    filtered=[...filtered].sort((a,b)=>a.filename.localeCompare(b.filename));

  const totalSize = files.reduce((a,f)=>a+(f.size||0),0);
  const byType    = Object.keys(FILE_TYPES).reduce((acc,tp)=>({...acc,[tp]:files.filter(f=>f.file_type===tp).length}),{});
  const TABS      = [{key:'browse',label:t('library')},{key:'upload',label:t('upload_tab')}];

  return (
    <>
      {preview && <PreviewModal file={preview} onClose={()=>setPreview(null)} onDelete={handleDelete}/>}
      <div style={S.container}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
          <h2 style={{ color:'#e2e8f0', fontSize:20, margin:0, fontWeight:700 }}>📁 {t('media_title')}</h2>
          <div style={{ display:'flex', gap:8 }}>
            {TABS.map(tb=>(
              <button key={tb.key} onClick={()=>setTab(tb.key)} style={{ ...S.filterBtn, padding:'7px 18px', borderRadius:8, fontSize:13, ...(tab===tb.key?S.filterActive:{}) }}>{tb.label}</button>
            ))}
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(130px,1fr))', gap:10 }}>
          {[
            {icon:'📁',label:t('total'),   val:files.length,       color:'#C9A84C'},
            {icon:'🖼️',label:t('images'),  val:byType.image||0,    color:'#60a5fa'},
            {icon:'🎬',label:t('videos'),  val:byType.video||0,    color:'#a78bfa'},
            {icon:'🎵',label:t('audios'),  val:byType.audio||0,    color:'#4ade80'},
            {icon:'📎',label:t('files'),   val:byType.file||0,     color:'#f97316'},
            {icon:'💾',label:t('storage'), val:fmtSize(totalSize), color:'#64748b'},
          ].map((s,i)=>(
            <div key={i} style={{ background:'#13131a', border:'1px solid #1e1e2e', borderRadius:10, padding:'12px 14px' }}>
              <div style={{ color:s.color, fontWeight:800, fontSize:18 }}>{s.val}</div>
              <div style={{ color:'#475569', fontSize:11, marginTop:2 }}>{s.icon} {s.label}</div>
            </div>
          ))}
        </div>

        {tab==='upload' && <UploadZone userId={userId} onUploaded={(newFiles)=>{setFiles(p=>[...newFiles,...p]);setTab('browse');}}/>}

        {tab==='browse' && (
          <>
            <div style={{ display:'flex', gap:10, flexWrap:'wrap', alignItems:'center' }}>
              <div style={{ position:'relative', flex:1, minWidth:180 }}>
                <input style={{ ...S.input, paddingLeft:34 }} placeholder={`🔍 ${t('search_media')}`} value={search} onChange={e=>setSearch(e.target.value)}/>
                <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', fontSize:14 }}>🔍</span>
              </div>
              <select style={{ background:'#0a0a0f', border:'1px solid #1e1e2e', color:'#e2e8f0', padding:'9px 12px', borderRadius:8, fontSize:12, outline:'none' }} value={sortBy} onChange={e=>setSortBy(e.target.value)}>
                {SORT_OPTIONS.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <div style={{ display:'flex', gap:4 }}>
                {['grid','list'].map(m=>(
                  <button key={m} onClick={()=>setViewMode(m)} style={{ ...S.filterBtn, ...(viewMode===m?S.filterActive:{}), padding:'7px 10px' }}>{m==='grid'?'⊞':'☰'}</button>
                ))}
              </div>
            </div>

            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              <button onClick={()=>setFilter('all')} style={{ ...S.filterBtn, ...(filter==='all'?S.filterActive:{}) }}>{t('all')} ({files.length})</button>
              {Object.entries(FILE_TYPES).map(([key,cfg])=>(
                <button key={key} onClick={()=>setFilter(key)} style={{ ...S.filterBtn, ...(filter===key?{background:`${cfg.color}18`,border:`1px solid ${cfg.color}50`,color:cfg.color}:{}) }}>{cfg.icon} {cfg.label} ({byType[key]||0})</button>
              ))}
            </div>

            {selected.length > 0 && (
              <div style={{ background:'rgba(201,168,76,0.08)', border:'1px solid rgba(201,168,76,0.2)', borderRadius:10, padding:'10px 16px', display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
                <span style={{ color:'#C9A84C', fontWeight:600, fontSize:13 }}>{selected.length} {t('selected')}</span>
                <button onClick={selectAll} style={{ ...S.filterBtn, fontSize:12 }}>{t('select_all')}</button>
                <button onClick={clearSelect} style={{ ...S.filterBtn, fontSize:12 }}>{t('deselect')}</button>
                <button onClick={handleDeleteSelected} style={{ background:'rgba(248,113,113,0.1)', border:'1px solid rgba(248,113,113,0.3)', color:'#f87171', padding:'5px 14px', borderRadius:20, cursor:'pointer', fontSize:12, fontWeight:600, marginLeft:'auto' }}>
                  {t('delete_selected')} ({selected.length})
                </button>
              </div>
            )}

            {loading ? (
              <div style={S.empty}>{t('loading_media')}</div>
            ) : filtered.length === 0 ? (
              <div style={S.empty}>
                <div style={{ fontSize:48, marginBottom:12 }}>📁</div>
                <div style={{ color:'#e2e8f0', fontSize:16, fontWeight:600, marginBottom:6 }}>{t('no_media')}</div>
                <div style={{ color:'#475569', fontSize:13 }}>{t('upload_first')}</div>
              </div>
            ) : viewMode==='grid' ? (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:14 }}>
                {filtered.map(f=><MediaCard key={f.id} file={f} onView={setPreview} onDelete={handleDelete} selected={selected.includes(f.id)} onSelect={toggleSelect}/>)}
              </div>
            ) : (
              <MediaList files={filtered} onView={setPreview} onDelete={handleDelete} selected={selected} onSelect={toggleSelect}/>
            )}
          </>
        )}
      </div>
    </>
  );
}