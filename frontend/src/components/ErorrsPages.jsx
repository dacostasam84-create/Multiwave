// ─────────────────────────────────────────────
// ErrorPages.jsx — Multiwave Error Pages
// Auteur : Zahnouni Issam
// ─────────────────────────────────────────────
import React, { Component } from 'react';

// ─────────────────────────────────────────────
// STYLES PARTAGÉS
// ─────────────────────────────────────────────
const S = {
  wrapper: {
    display:'flex', flexDirection:'column', alignItems:'center',
    justifyContent:'center', minHeight:'60vh', gap:20, padding:40,
    textAlign:'center',
  },
  icon:    { fontSize:80, filter:'drop-shadow(0 0 30px rgba(201,168,76,0.3))' },
  title:   { color:'#e2e8f0', fontSize:28, fontWeight:800, margin:0 },
  sub:     { color:'#475569', fontSize:15, lineHeight:1.6, maxWidth:420 },
  code:    { color:'#C9A84C', fontSize:72, fontWeight:800, fontFamily:'monospace', letterSpacing:-2, margin:0, lineHeight:1 },
  btn:     { background:'linear-gradient(135deg,#C9A84C,#F5D87A)', color:'#1a1200', border:'none', padding:'11px 28px', borderRadius:10, fontWeight:700, cursor:'pointer', fontSize:14 },
  btnGhost:{ background:'transparent', border:'1px solid #1e1e2e', color:'#64748b', padding:'11px 28px', borderRadius:10, cursor:'pointer', fontSize:14 },
  card:    { background:'#13131a', border:'1px solid #1e1e2e', borderRadius:16, padding:32, maxWidth:480, width:'100%' },
};

// ─────────────────────────────────────────────
// PAGE 404 — Not Found
// ─────────────────────────────────────────────
export function Page404({ onGoHome }) {
  return (
    <div style={S.wrapper}>
      <div style={{ position:'relative' }}>
        <div style={{ ...S.code, opacity:0.08, fontSize:180, position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', userSelect:'none' }}>404</div>
        <div style={S.icon}>🌊</div>
      </div>
      <div style={S.code}>404</div>
      <h1 style={S.title}>Page introuvable</h1>
      <p style={S.sub}>
        La page que vous cherchez n'existe pas ou a été déplacée.
        Revenez à l'accueil et explorez Multiwave !
      </p>
      <div style={{ display:'flex', gap:12 }}>
        <button onClick={onGoHome || (() => window.history.back())} style={S.btn}>
          🏠 Retour à l'accueil
        </button>
        <button onClick={() => window.history.back()} style={S.btnGhost}>
          ← Retour
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// PAGE 403 — Accès refusé
// ─────────────────────────────────────────────
export function Page403({ onGoHome }) {
  return (
    <div style={S.wrapper}>
      <div style={S.icon}>🔒</div>
      <div style={{ ...S.code, color:'#f87171' }}>403</div>
      <h1 style={S.title}>Accès refusé</h1>
      <p style={S.sub}>
        Vous n'avez pas les permissions nécessaires pour accéder à cette page.
        Connectez-vous ou contactez un administrateur.
      </p>
      <div style={{ display:'flex', gap:12 }}>
        <button onClick={onGoHome || (() => window.history.back())} style={S.btn}>
          🏠 Retour à l'accueil
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// PAGE 500 — Erreur serveur
// ─────────────────────────────────────────────
export function Page500({ onRetry, onGoHome }) {
  return (
    <div style={S.wrapper}>
      <div style={S.icon}>⚡</div>
      <div style={{ ...S.code, color:'#fb923c' }}>500</div>
      <h1 style={S.title}>Erreur serveur</h1>
      <p style={S.sub}>
        Une erreur inattendue s'est produite sur le serveur.
        Notre équipe a été notifiée. Réessayez dans quelques instants.
      </p>
      <div style={{ display:'flex', gap:12 }}>
        <button onClick={onRetry || (() => window.location.reload())} style={S.btn}>
          🔄 Réessayer
        </button>
        <button onClick={onGoHome || (() => window.history.back())} style={S.btnGhost}>
          🏠 Accueil
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// OFFLINE PAGE — Hors ligne
// ─────────────────────────────────────────────
export function PageOffline({ onRetry }) {
  return (
    <div style={S.wrapper}>
      <div style={S.icon}>📡</div>
      <h1 style={S.title}>Vous êtes hors ligne</h1>
      <p style={S.sub}>
        Vérifiez votre connexion internet et réessayez.
        Certaines fonctionnalités peuvent être indisponibles.
      </p>
      <button onClick={onRetry || (() => window.location.reload())} style={S.btn}>
        🔄 Réessayer
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// COMING SOON — Module en construction
// ─────────────────────────────────────────────
export function ComingSoon({ icon = '🚧', title = 'Module', description }) {
  return (
    <div style={S.wrapper}>
      <div style={{ ...S.icon, fontSize:64 }}>{icon}</div>
      <h2 style={{ ...S.title, fontSize:22 }}>{title}</h2>
      <p style={S.sub}>
        {description || 'Ce module est en cours de développement. Revenez bientôt !'}
      </p>
      <div style={{
        background:'#13131a', border:'1px solid #1e1e2e',
        padding:'8px 20px', borderRadius:20,
        color:'#475569', fontSize:13,
      }}>
        🚧 Bientôt disponible
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MODULE ERROR — Erreur de chargement module
// ─────────────────────────────────────────────
export function ModuleError({ title = 'Module', onRetry }) {
  return (
    <div style={S.wrapper}>
      <div style={{ ...S.icon, fontSize:56 }}>⚠️</div>
      <h2 style={{ ...S.title, fontSize:20 }}>Erreur de chargement</h2>
      <p style={S.sub}>
        Impossible de charger le module <strong style={{ color:'#C9A84C' }}>{title}</strong>.
        Vérifiez votre connexion et réessayez.
      </p>
      <div style={{ display:'flex', gap:12 }}>
        <button onClick={onRetry || (() => window.location.reload())} style={S.btn}>
          🔄 Réessayer
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// EMPTY STATE — Liste vide
// ─────────────────────────────────────────────
export function EmptyState({ icon = '📭', title, description, actionLabel, onAction }) {
  return (
    <div style={{ ...S.wrapper, minHeight:300 }}>
      <div style={{ fontSize:56 }}>{icon}</div>
      <h3 style={{ color:'#e2e8f0', fontSize:18, fontWeight:700, margin:0 }}>{title}</h3>
      {description && <p style={{ ...S.sub, fontSize:13 }}>{description}</p>}
      {actionLabel && onAction && (
        <button onClick={onAction} style={S.btn}>{actionLabel}</button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// ERROR BOUNDARY — Capture les erreurs React
// ─────────────────────────────────────────────
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError:false, error:null, errorInfo:null };
  }

  static getDerivedStateFromError(error) {
    return { hasError:true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('ErrorBoundary caught:', error, errorInfo);
    // Ici vous pouvez envoyer l'erreur à un service de monitoring
    // ex: api.post('/analytics/errors', { error: error.message, stack: errorInfo.componentStack })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={S.wrapper}>
          <div style={{ ...S.icon, fontSize:60 }}>💥</div>
          <h2 style={{ ...S.title, fontSize:20 }}>Quelque chose s'est mal passé</h2>
          <p style={S.sub}>
            Une erreur inattendue s'est produite dans ce composant.
          </p>
          {/* Détails erreur (dev mode) */}
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <div style={{
              background:'#0a0a0f', border:'1px solid rgba(248,113,113,0.3)',
              borderRadius:10, padding:16, maxWidth:500, width:'100%',
              textAlign:'left', marginBottom:8,
            }}>
              <div style={{ color:'#f87171', fontSize:12, fontFamily:'monospace', marginBottom:8, fontWeight:700 }}>
                {this.state.error.toString()}
              </div>
              {this.state.errorInfo && (
                <div style={{ color:'#334155', fontSize:10, fontFamily:'monospace', whiteSpace:'pre-wrap', maxHeight:120, overflowY:'auto' }}>
                  {this.state.errorInfo.componentStack}
                </div>
              )}
            </div>
          )}
          <div style={{ display:'flex', gap:12 }}>
            <button
              onClick={() => this.setState({ hasError:false, error:null, errorInfo:null })}
              style={S.btn}
            >🔄 Réessayer</button>
            <button
              onClick={() => window.location.reload()}
              style={S.btnGhost}
            >↺ Recharger</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─────────────────────────────────────────────
// DEFAULT EXPORT — Page 404
// ─────────────────────────────────────────────
export default Page404;