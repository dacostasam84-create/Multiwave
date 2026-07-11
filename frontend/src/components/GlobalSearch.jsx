// ─────────────────────────────────────────────
// GlobalSearch.jsx — Multiwave Recherche Globale
// Auteur : Zahnouni Issam
// ─────────────────────────────────────────────
import React, { useState, useEffect, useRef, useCallback } from 'react';
import api from '../services/api';

// ─────────────────────────────────────────────
// CONFIG CATÉGORIES
// ─────────────────────────────────────────────
const CATEGORIES = [
  { key:'all',      label:'Tout',        icon:'🔍' },
  { key:'users',    label:'Personnes',   icon:'👤' },
  { key:'posts',    label:'Posts',       icon:'📝' },
  { key:'products', label:'Produits',    icon:'🛍️' },
  { key:'jobs',     label:'Jobs',        icon:'💼' },
  { key:'channels', label:'Channels',    icon:'📡' },
  { key:'groups',   label:'Groupes',     icon:'👥' },
  { key:'videos',   label:'Vidéos',      icon:'🎬' },
];

// ─────────────────────────────────────────────
// MOCK RESULTS
// ─────────────────────────────────────────────
const MOCK_RESULTS = {
  users: [
    { id:1, type:'user',    title:'sarah_dz',      sub:'Designer UI/UX · Casablanca',          meta:'👥 1.2k abonnés', verified:true  },
    { id:2, type:'user',    title:'dev_karim',     sub:'Full Stack Developer · Paris',          meta:'👥 920 abonnés',  verified:false },
    { id:3, type:'user',    title:'tech_maroc',    sub:'Tech & Startup · Rabat',                meta:'👥 5.6k abonnés', verified:true  },
  ],
  posts: [
    { id:4, type:'post',    title:'Multiwave v2.0 est là !', sub:'par zahnouni_issam · il y a 2h', meta:'❤️ 124 · 💬 34', verified:false },
    { id:5, type:'post',    title:'React 19 — Nouveautés',   sub:'par dev_karim · il y a 5h',      meta:'❤️ 89 · 💬 12',  verified:false },
  ],
  products: [
    { id:6, type:'product', title:'iPhone 15 Pro Max',       sub:'TechCasa · Casablanca',          meta:'1 199 USD',       verified:true  },
    { id:7, type:'product', title:'Pack Design UI/UX 2026',  sub:'laila_design · Digital',         meta:'29 USD',          verified:false },
  ],
  jobs: [
    { id:8, type:'job',     title:'Développeur React Senior', sub:'TechCasa · Casablanca',         meta:'15k–25k MAD',     verified:true  },
    { id:9, type:'job',     title:'Designer UI/UX',           sub:'CreativeStudio · Remote',       meta:'3k–5k EUR',       verified:false },
  ],
  channels: [
    { id:10, type:'channel', title:'Tech Maroc News',         sub:'📰 News · 21k abonnés',         meta:'🌍 Maroc',        verified:true  },
    { id:11, type:'channel', title:'AI News Daily',           sub:'🤖 IA · 48k abonnés',           meta:'🌍 Monde',        verified:true  },
  ],
  groups: [
    { id:12, type:'group',  title:'React & JavaScript',       sub:'👥 2 600 membres · Technologie', meta:'🌍 Public',       verified:true  },
    { id:13, type:'group',  title:'Startup Maghreb',          sub:'👥 1 800 membres · Business',    meta:'🌍 Public',       verified:true  },
  ],
  videos: [
    { id:14, type:'video',  title:'Tutoriel React 19',        sub:'dev_karim · 4 800 vues',         meta:'⏱ 20:40',        verified:false },
    { id:15, type:'video',  title:'IA et Emploi — Débat',     sub:'tech_maroc · 12 400 vues',       meta:'⏱ 1:00:00',      verified:false },
  ],
};

const TYPE_CONFIG = {
  user:    { icon:'👤', color:'#C9A84C',  bg:'rgba(201,168,76,0.1)',  nav:'profile'   },
  post:    { icon:'📝', color:'#60a5fa',  bg:'rgba(96,165,250,0.1)',  nav:'feed'      },
  product: { icon:'🛍️', color:'#4ade80',  bg:'rgba(74,222,128,0.1)',  nav:'marketplace'},
  job:     { icon:'💼', color:'#a78bfa',  bg:'rgba(167,139,250,0.1)', nav:'jobs'      },
  channel: { icon:'📡', color:'#00e5ff',  bg:'rgba(0,229,255,0.1)',   nav:'channels'  },
  group:   { icon:'👥', color:'#fb923c',  bg:'rgba(251,146,60,0.1)',  nav:'groups'    },
  video:   { icon:'🎬', color:'#f87171',  bg:'rgba(248,113,113,0.1)', nav:'medias'    },
};

// ─────────────────────────────────────────────
// DEBOUNCE HOOK
// ─────────────────────────────────────────────
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

// ─────────────────────────────────────────────
// RESULT ITEM
// ─────────────────────────────────────────────
function ResultItem({ item, onSelect, highlighted }) {
  const cfg = TYPE_CONFIG[item.type] || { icon:'🔍', color:'#64748b', bg:'transparent' };
  return (
    <div
      onClick={() => onSelect(item)}
      style={{
        display:'flex', alignItems:'center', gap:12, padding:'10px 16px',
        cursor:'pointer',
        background: highlighted ? 'rgba(201,168,76,0.06)' : 'transparent',
        borderLeft: `2px solid ${highlighted ? '#C9A84C' : 'transparent'}`,
        transition:'all 0.1s',
      }}
      onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.03)'}
      onMouseLeave={e => e.currentTarget.style.background= highlighted?'rgba(201,168,76,0.06)':'transparent'}
    >
      {/* Icône type */}
      <div style={{
        width:36, height:36, borderRadius:9, flexShrink:0,
        background:cfg.bg, border:`1px solid ${cfg.color}30`,
        display:'flex', alignItems:'center', justifyContent:'center', fontSize:16,
      }}>{cfg.icon}</div>

      {/* Contenu */}
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          <span style={{ color:'#e2e8f0', fontWeight:600, fontSize:13, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
            {item.title}
          </span>
          {item.verified && <span style={{ fontSize:12 }}>✅</span>}
        </div>
        <div style={{ color:'#475569', fontSize:11, marginTop:1 }}>{item.sub}</div>
      </div>

      {/* Meta */}
      <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:3, flexShrink:0 }}>
        <span style={{ color:cfg.color, fontSize:11, fontWeight:600 }}>{item.meta}</span>
        <span style={{
          background:cfg.bg, border:`1px solid ${cfg.color}30`, color:cfg.color,
          padding:'1px 6px', borderRadius:10, fontSize:9, fontWeight:700, textTransform:'uppercase',
        }}>{item.type}</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// RECHERCHE GLOBALE
// ─────────────────────────────────────────────
export default function GlobalSearch({ onNavigate, placeholder = 'Rechercher sur Multiwave...' }) {
  const [query,       setQuery]       = useState('');
  const [open,        setOpen]        = useState(false);
  const [category,    setCategory]    = useState('all');
  const [results,     setResults]     = useState({});
  const [loading,     setLoading]     = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const [recent,      setRecent]      = useState(() => {
    try { return JSON.parse(localStorage.getItem('mw_recent_search') || '[]'); } catch { return []; }
  });

  const debouncedQuery = useDebounce(query, 300);
  const inputRef       = useRef(null);
  const panelRef       = useRef(null);

  // Fermer en cliquant dehors
  useEffect(() => {
    const handleClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Recherche API
  useEffect(() => {
    if (!debouncedQuery.trim() || debouncedQuery.length < 2) {
      setResults({});
      return;
    }
    search(debouncedQuery);
  }, [debouncedQuery, category]);

  // Raccourci clavier Ctrl+K
  useEffect(() => {
    const handleKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  const search = async (q) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ q, category });
      const res = await api.get(`/search?${params}`);
      setResults(res.data?.data || res.data || {});
    } catch {
      // Mock results filtrés
      const filtered = {};
      Object.entries(MOCK_RESULTS).forEach(([key, items]) => {
        const matched = items.filter(item =>
          item.title.toLowerCase().includes(q.toLowerCase()) ||
          item.sub.toLowerCase().includes(q.toLowerCase())
        );
        if (matched.length > 0) filtered[key] = matched;
      });
      // Si aucun match, afficher tout
      setResults(Object.keys(filtered).length > 0 ? filtered : MOCK_RESULTS);
    } finally { setLoading(false); }
  };

  const handleSelect = (item) => {
    // Ajouter aux récents
    const newRecent = [item, ...recent.filter(r => r.id !== item.id)].slice(0, 5);
    setRecent(newRecent);
    try { localStorage.setItem('mw_recent_search', JSON.stringify(newRecent)); } catch {}

    // Naviguer
    const cfg = TYPE_CONFIG[item.type];
    if (cfg?.nav && onNavigate) onNavigate(cfg.nav);

    setOpen(false);
    setQuery('');
  };

  const clearRecent = () => {
    setRecent([]);
    try { localStorage.removeItem('mw_recent_search'); } catch {}
  };

  // Aplatir résultats pour navigation clavier
  const allResults = Object.values(results).flat();

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlighted(h => Math.min(h+1, allResults.length-1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setHighlighted(h => Math.max(h-1, 0)); }
    if (e.key === 'Enter' && highlighted >= 0) handleSelect(allResults[highlighted]);
  };

  const totalResults = allResults.length;
  const hasResults   = totalResults > 0;
  const showRecent   = !query.trim() && recent.length > 0;

  // Filtrer par catégorie
  const displayResults = category === 'all'
    ? results
    : { [category]: results[category] || [] };

  return (
    <div style={{ position:'relative', width:'100%' }} ref={panelRef}>

      {/* Barre de recherche */}
      <div style={{
        display:'flex', alignItems:'center', gap:8,
        background: open ? 'rgba(201,168,76,0.06)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${open ? 'rgba(201,168,76,0.3)' : 'rgba(255,255,255,0.08)'}`,
        borderRadius:20, padding:'6px 14px 6px 10px',
        transition:'all 0.2s',
      }}>
        <span style={{ color: open ? '#C9A84C' : '#475569', fontSize:14 }}>🔍</span>
        <input
          ref={inputRef}
          style={{
            flex:1, background:'transparent', border:'none', color:'#e2e8f0',
            fontSize:13, outline:'none', minWidth:0,
          }}
          placeholder={placeholder}
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); setHighlighted(-1); }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
        />
        {query && (
          <button onClick={() => { setQuery(''); setResults({}); }} style={{ background:'none', border:'none', color:'#475569', cursor:'pointer', fontSize:14, padding:0 }}>✕</button>
        )}
        <span style={{ color:'#334155', fontSize:10, fontFamily:'monospace', flexShrink:0, display:'flex', gap:2 }}>
          <kbd style={{ background:'#1e1e2e', padding:'1px 5px', borderRadius:3 }}>Ctrl</kbd>
          <kbd style={{ background:'#1e1e2e', padding:'1px 5px', borderRadius:3 }}>K</kbd>
        </span>
      </div>

      {/* Panel résultats */}
      {open && (
        <div style={{
          position:'absolute', top:'calc(100% + 8px)', left:0, right:0, zIndex:500,
          background:'#0d0d18', border:'1px solid rgba(201,168,76,0.2)',
          borderRadius:14, boxShadow:'0 16px 48px rgba(0,0,0,0.7)',
          maxHeight:520, display:'flex', flexDirection:'column',
          overflow:'hidden', animation:'searchFadeIn 0.15s ease',
        }}>

          <style>{`
            @keyframes searchFadeIn { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
          `}</style>

          {/* Filtres catégories */}
          <div style={{ padding:'10px 12px', borderBottom:'1px solid #1e1e2e', display:'flex', gap:6, overflowX:'auto', flexShrink:0 }}>
            {CATEGORIES.map(cat => (
              <button key={cat.key} onClick={() => setCategory(cat.key)} style={{
                padding:'4px 12px', borderRadius:20, cursor:'pointer', fontSize:11, fontWeight:600,
                background: category===cat.key ? 'rgba(201,168,76,0.12)' : 'transparent',
                border: `1px solid ${category===cat.key ? '#C9A84C' : '#1e1e2e'}`,
                color: category===cat.key ? '#C9A84C' : '#64748b',
                whiteSpace:'nowrap', flexShrink:0,
              }}>{cat.icon} {cat.label}</button>
            ))}
          </div>

          {/* Contenu */}
          <div style={{ flex:1, overflowY:'auto' }}>

            {/* Loading */}
            {loading && (
              <div style={{ padding:24, display:'flex', flexDirection:'column', gap:10 }}>
                {[...Array(4)].map((_,i) => (
                  <div key={i} style={{ display:'flex', gap:12, alignItems:'center', padding:'0 4px' }}>
                    <div style={{ width:36, height:36, borderRadius:9, background:'linear-gradient(90deg,#1e1e2e 25%,#2a2a3e 50%,#1e1e2e 75%)', backgroundSize:'200% 100%', animation:'skeletonShimmer 1.5s ease-in-out infinite' }}/>
                    <div style={{ flex:1, display:'flex', flexDirection:'column', gap:7 }}>
                      <div style={{ height:12, width:'60%', borderRadius:6, background:'linear-gradient(90deg,#1e1e2e 25%,#2a2a3e 50%,#1e1e2e 75%)', backgroundSize:'200% 100%', animation:'skeletonShimmer 1.5s ease-in-out infinite' }}/>
                      <div style={{ height:10, width:'40%', borderRadius:6, background:'linear-gradient(90deg,#1e1e2e 25%,#2a2a3e 50%,#1e1e2e 75%)', backgroundSize:'200% 100%', animation:'skeletonShimmer 1.5s ease-in-out infinite' }}/>
                    </div>
                  </div>
                ))}
                <style>{`@keyframes skeletonShimmer{0%{background-position:200% center}100%{background-position:-200% center}}`}</style>
              </div>
            )}

            {/* Recherches récentes */}
            {!loading && showRecent && (
              <div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 16px 4px' }}>
                  <span style={{ color:'#475569', fontSize:11, fontWeight:700, letterSpacing:'1px', textTransform:'uppercase' }}>Récents</span>
                  <button onClick={clearRecent} style={{ background:'none', border:'none', color:'#334155', cursor:'pointer', fontSize:11 }}>Effacer</button>
                </div>
                {recent.map((item, i) => (
                  <ResultItem key={item.id} item={item} onSelect={handleSelect} highlighted={highlighted===i}/>
                ))}
              </div>
            )}

            {/* Suggestions si vide */}
            {!loading && !query.trim() && !showRecent && (
              <div style={{ padding:24, textAlign:'center' }}>
                <div style={{ fontSize:36, marginBottom:10 }}>🔍</div>
                <div style={{ color:'#64748b', fontSize:13 }}>Recherchez des personnes, posts, produits...</div>
                <div style={{ color:'#334155', fontSize:11, marginTop:6 }}>Tapez au moins 2 caractères</div>
              </div>
            )}

            {/* Résultats */}
            {!loading && hasResults && (
              <>
                {/* Compteur */}
                <div style={{ padding:'8px 16px', color:'#475569', fontSize:11 }}>
                  {totalResults} résultat(s) pour <span style={{ color:'#C9A84C' }}>"{debouncedQuery}"</span>
                </div>

                {/* Par catégorie */}
                {Object.entries(displayResults).map(([key, items]) => {
                  if (!items || items.length === 0) return null;
                  const cat = CATEGORIES.find(c => c.key === key);
                  return (
                    <div key={key}>
                      <div style={{ padding:'6px 16px 2px', color:'#334155', fontSize:10, fontWeight:700, letterSpacing:'1px', textTransform:'uppercase' }}>
                        {cat?.icon} {cat?.label || key}
                      </div>
                      {items.map((item, i) => {
                        const globalIdx = allResults.findIndex(r => r.id === item.id);
                        return <ResultItem key={item.id} item={item} onSelect={handleSelect} highlighted={highlighted===globalIdx}/>;
                      })}
                    </div>
                  );
                })}
              </>
            )}

            {/* Aucun résultat */}
            {!loading && query.trim().length >= 2 && !hasResults && (
              <div style={{ padding:32, textAlign:'center' }}>
                <div style={{ fontSize:40, marginBottom:10 }}>😕</div>
                <div style={{ color:'#e2e8f0', fontSize:15, fontWeight:600, marginBottom:6 }}>
                  Aucun résultat pour "{query}"
                </div>
                <div style={{ color:'#475569', fontSize:13 }}>Essayez d'autres mots-clés</div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{ padding:'8px 16px', borderTop:'1px solid #1e1e2e', display:'flex', gap:16, flexShrink:0 }}>
            {[['↑↓','Naviguer'],['↵','Sélectionner'],['Esc','Fermer']].map(([key,label]) => (
              <div key={key} style={{ display:'flex', alignItems:'center', gap:4 }}>
                <kbd style={{ background:'#1e1e2e', color:'#64748b', padding:'1px 6px', borderRadius:4, fontSize:10, fontFamily:'monospace' }}>{key}</kbd>
                <span style={{ color:'#334155', fontSize:10 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}