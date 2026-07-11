// ─────────────────────────────────────────────
// ThemeContext.jsx — Multiwave Dark/Light Mode
// Auteur : Zahnouni Issam
// ─────────────────────────────────────────────
import React, { createContext, useContext, useState, useEffect } from 'react';

// ─────────────────────────────────────────────
// THÈMES
// ─────────────────────────────────────────────
const THEMES = {
  dark: {
    name: 'dark',
    label: '🌙 Sombre',
    // Backgrounds
    bgPrimary:    '#070710',
    bgSecondary:  '#0a0a0f',
    bgCard:       '#13131a',
    bgHover:      'rgba(255,255,255,0.03)',
    // Borders
    border:       '#1e1e2e',
    borderLight:  'rgba(255,255,255,0.05)',
    // Text
    textPrimary:  '#e2e8f0',
    textSecondary:'#94a3b8',
    textMuted:    '#64748b',
    textFaint:    '#334155',
    // Accents
    gold:         '#C9A84C',
    goldLight:    '#F5D87A',
    goldBg:       'rgba(201,168,76,0.12)',
    // Sidebar
    sidebarBg:    'linear-gradient(180deg,#050510 0%,#080420 18%,#0d0828 35%,#120c30 52%,#160e28 68%,#1a0e1e 82%,#1e0e14 100%)',
    // Input
    inputBg:      '#0a0a0f',
    // Scrollbar
    scrollThumb:  '#1e1e3a',
    scrollTrack:  '#070710',
  },
  light: {
    name: 'light',
    label: '☀️ Clair',
    // Backgrounds
    bgPrimary:    '#f0f2f8',
    bgSecondary:  '#ffffff',
    bgCard:       '#ffffff',
    bgHover:      'rgba(0,0,0,0.03)',
    // Borders
    border:       '#e2e8f0',
    borderLight:  'rgba(0,0,0,0.06)',
    // Text
    textPrimary:  '#0f172a',
    textSecondary:'#475569',
    textMuted:    '#94a3b8',
    textFaint:    '#cbd5e1',
    // Accents
    gold:         '#B8882A',
    goldLight:    '#C9A84C',
    goldBg:       'rgba(184,136,42,0.1)',
    // Sidebar
    sidebarBg:    'linear-gradient(180deg,#1a1200 0%,#2a1e00 30%,#1a1200 100%)',
    // Input
    inputBg:      '#f8fafc',
    // Scrollbar
    scrollThumb:  '#cbd5e1',
    scrollTrack:  '#f0f2f8',
  },
};

// ─────────────────────────────────────────────
// CONTEXT
// ─────────────────────────────────────────────
const ThemeContext = createContext({
  theme: THEMES.dark,
  themeName: 'dark',
  toggleTheme: () => {},
  setTheme: () => {},
});

// ─────────────────────────────────────────────
// PROVIDER
// ─────────────────────────────────────────────
export function ThemeProvider({ children }) {
  const [themeName, setThemeName] = useState(() => {
    try { return localStorage.getItem('mw_theme') || 'dark'; } catch { return 'dark'; }
  });

  const theme = THEMES[themeName] || THEMES.dark;

  // Appliquer le thème au body
  useEffect(() => {
    document.body.style.background  = theme.bgPrimary;
    document.body.style.color       = theme.textPrimary;
    document.documentElement.setAttribute('data-theme', themeName);

    // CSS variables globales
    const root = document.documentElement;
    root.style.setProperty('--bg-primary',     theme.bgPrimary);
    root.style.setProperty('--bg-secondary',   theme.bgSecondary);
    root.style.setProperty('--bg-card',        theme.bgCard);
    root.style.setProperty('--border',         theme.border);
    root.style.setProperty('--text-primary',   theme.textPrimary);
    root.style.setProperty('--text-secondary', theme.textSecondary);
    root.style.setProperty('--text-muted',     theme.textMuted);
    root.style.setProperty('--gold',           theme.gold);
    root.style.setProperty('--gold-light',     theme.goldLight);
    root.style.setProperty('--gold-bg',        theme.goldBg);
    root.style.setProperty('--input-bg',       theme.inputBg);
    root.style.setProperty('--scroll-thumb',   theme.scrollThumb);
    root.style.setProperty('--scroll-track',   theme.scrollTrack);

    try { localStorage.setItem('mw_theme', themeName); } catch {}
  }, [themeName, theme]);

  const toggleTheme = () => {
    setThemeName(t => t === 'dark' ? 'light' : 'dark');
  };

  const setTheme = (name) => {
    if (THEMES[name]) setThemeName(name);
  };

  return (
    <ThemeContext.Provider value={{ theme, themeName, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ─────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────
export function useTheme() {
  return useContext(ThemeContext);
}

// ─────────────────────────────────────────────
// TOGGLE BUTTON
// ─────────────────────────────────────────────
export function ThemeToggle({ style = {} }) {
  const { themeName, toggleTheme, theme } = useTheme();
  const isDark = themeName === 'dark';

  return (
    <button
      onClick={toggleTheme}
      title={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
      style={{
        display:'flex', alignItems:'center', gap:8,
        background: isDark ? 'rgba(201,168,76,0.08)' : 'rgba(0,0,0,0.06)',
        border: `1px solid ${isDark ? 'rgba(201,168,76,0.2)' : 'rgba(0,0,0,0.1)'}`,
        borderRadius:20, padding:'5px 12px',
        cursor:'pointer', fontSize:13, fontWeight:600,
        color: isDark ? '#C9A84C' : '#475569',
        transition:'all 0.2s',
        ...style,
      }}
    >
      {/* Toggle track */}
      <div style={{
        width:32, height:18, borderRadius:9, position:'relative',
        background: isDark ? 'rgba(201,168,76,0.3)' : '#cbd5e1',
        transition:'background 0.2s',
      }}>
        <div style={{
          position:'absolute', top:2,
          left: isDark ? 16 : 2,
          width:14, height:14, borderRadius:'50%',
          background: isDark ? '#C9A84C' : '#fff',
          transition:'left 0.2s, background 0.2s',
          boxShadow:'0 1px 4px rgba(0,0,0,0.3)',
        }}/>
      </div>
      <span>{isDark ? '🌙' : '☀️'}</span>
    </button>
  );
}

// ─────────────────────────────────────────────
// DEFAULT EXPORT
// ─────────────────────────────────────────────
export default ThemeContext;