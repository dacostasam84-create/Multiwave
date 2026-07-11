// ─────────────────────────────────────────────
// SubscriptionPlans.jsx — Multiwave Plans & Abonnements
// Auteur : Zahnouni Issam
// ─────────────────────────────────────────────
import React, { useState, useEffect } from 'react';
import api from '../services/api';

// ─────────────────────────────────────────────
// PLANS MULTIWAVE
// ─────────────────────────────────────────────
const PLANS = [
  {
    id:       'free',
    name:     'Gratuit',
    icon:     '🌊',
    price:    0,
    currency: 'USD',
    period:   'mois',
    color:    '#64748b',
    gradient: 'linear-gradient(135deg,#1e1e2e,#2a2a3e)',
    popular:  false,
    features: [
      { icon:'✅', text:'Feed social illimité' },
      { icon:'✅', text:'Messages privés' },
      { icon:'✅', text:'Marketplace — consultation' },
      { icon:'✅', text:'5 minutes d\'appels/jour' },
      { icon:'✅', text:'Groupes & Channels' },
      { icon:'❌', text:'Marketplace locale' },
      { icon:'❌', text:'Marketplace internationale' },
      { icon:'❌', text:'Speech-to-Speech traduit' },
      { icon:'❌', text:'Support prioritaire' },
    ],
    limits: {
      marketplace:    'none',
      calls_per_day:  5,
      calls_per_month:null,
      international:  false,
      stt_minutes:    5,
    }
  },
  {
    id:       'local',
    name:     'Local',
    icon:     '🏙️',
    price:    20,
    currency: 'USD',
    period:   'mois',
    color:    '#C9A84C',
    gradient: 'linear-gradient(135deg,#C9A84C,#F5D87A)',
    popular:  false,
    features: [
      { icon:'✅', text:'Tout du plan Gratuit' },
      { icon:'✅', text:'Marketplace locale — vente' },
      { icon:'✅', text:'30 min d\'appels/jour' },
      { icon:'✅', text:'Speech-to-Speech 30 min/mois' },
      { icon:'✅', text:'Analytics basiques' },
      { icon:'✅', text:'Support standard' },
      { icon:'❌', text:'Marketplace internationale' },
      { icon:'❌', text:'Appels illimités' },
      { icon:'❌', text:'Support prioritaire VIP' },
    ],
    limits: {
      marketplace:    'local',
      calls_per_day:  30,
      calls_per_month:null,
      international:  false,
      stt_minutes:    30,
    }
  },
  {
    id:       'international',
    name:     'Appels & International',
    icon:     '📞',
    price:    100,
    currency: 'USD',
    period:   'mois',
    color:    '#60a5fa',
    gradient: 'linear-gradient(135deg,#0ea5e9,#8b5cf6)',
    popular:  true,
    badge:    '🔥 Populaire',
    features: [
      { icon:'✅', text:'Tout du plan Local' },
      { icon:'✅', text:'Marketplace internationale' },
      { icon:'✅', text:'Appels illimités' },
      { icon:'✅', text:'Speech-to-Speech illimité' },
      { icon:'✅', text:'Analytics avancés' },
      { icon:'✅', text:'Badge vérifié ✅' },
      { icon:'✅', text:'Support prioritaire' },
      { icon:'❌', text:'API Multiwave' },
      { icon:'❌', text:'Manager dédié' },
    ],
    limits: {
      marketplace:    'international',
      calls_per_day:  null,
      calls_per_month:null,
      international:  true,
      stt_minutes:    null,
    }
  },
  {
    id:       'business',
    name:     'VIP / Business',
    icon:     '👑',
    price:    200,
    currency: 'USD',
    period:   'mois',
    color:    '#a78bfa',
    gradient: 'linear-gradient(135deg,#7c3aed,#C9A84C)',
    popular:  false,
    badge:    '👑 Premium',
    features: [
      { icon:'✅', text:'Tout du plan International' },
      { icon:'✅', text:'Tout illimité sans restriction' },
      { icon:'✅', text:'API Multiwave accès complet' },
      { icon:'✅', text:'Manager dédié 24/7' },
      { icon:'✅', text:'Analytics IA avancés' },
      { icon:'✅', text:'Multi-comptes (5 max)' },
      { icon:'✅', text:'Brand page premium' },
      { icon:'✅', text:'Ads prioritaires' },
      { icon:'✅', text:'SLA 99.9% uptime garanti' },
    ],
    limits: {
      marketplace:    'unlimited',
      calls_per_day:  null,
      calls_per_month:null,
      international:  true,
      stt_minutes:    null,
    }
  },
];

// Comparaison avec concurrents
const COMPETITOR_COMPARE = [
  { feature:'Marketplace locale',       multiwave:'20$/mois', facebook:'30$/mois', linkedin:'N/A' },
  { feature:'Marketplace internationale', multiwave:'100$/mois', facebook:'5$/jour=150$/mois', linkedin:'N/A' },
  { feature:'Appels vidéo traduits',    multiwave:'50$/mois', facebook:'N/A', linkedin:'N/A' },
  { feature:'Speech-to-Speech',         multiwave:'50$/mois', facebook:'N/A', linkedin:'N/A' },
  { feature:'Business illimité',        multiwave:'200$/mois', facebook:'Non dispo', linkedin:'600$/mois' },
];

// ─────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────
const S = {
  container: { display:'flex', flexDirection:'column', gap:24 },
  card:      { background:'#13131a', border:'1px solid #1e1e2e', borderRadius:16, padding:24, position:'relative', overflow:'hidden' },
};

// ─────────────────────────────────────────────
// AGENT INTELLIGENT — Suivi abonnements
// ─────────────────────────────────────────────
function SubscriptionAgent({ userId, currentPlan }) {
  const [usage,    setUsage]    = useState(null);
  const [alerts,   setAlerts]   = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => { loadUsage(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadUsage = async () => {
    try {
      const res = await api.get(`/subscriptions/usage?user_id=${userId}`);
      setUsage(res.data?.data || res.data);
    } catch {
      // Mock usage data
      setUsage({
        calls_today:      12,
        calls_limit_day:  currentPlan === 'free' ? 5 : currentPlan === 'local' ? 30 : null,
        stt_used:         18,
        stt_limit:        currentPlan === 'free' ? 5 : currentPlan === 'local' ? 30 : null,
        marketplace_sales:3,
        renewal_date:     new Date(Date.now() + 15 * 24*60*60*1000).toISOString(),
        days_remaining:   15,
      });
    } finally { setLoading(false); }
  };

  useEffect(() => {
    if (!usage) return;
    const newAlerts = [];

    // Alerte appels
    if (usage.calls_limit_day && usage.calls_today >= usage.calls_limit_day * 0.8) {
      newAlerts.push({ type:'warning', icon:'📞', text:`Vous avez utilisé ${usage.calls_today}/${usage.calls_limit_day} min d'appels aujourd'hui` });
    }
    // Alerte STT
    if (usage.stt_limit && usage.stt_used >= usage.stt_limit * 0.8) {
      newAlerts.push({ type:'warning', icon:'🎤', text:`Speech-to-Speech: ${usage.stt_used}/${usage.stt_limit} min utilisés ce mois` });
    }
    // Alerte renouvellement
    if (usage.days_remaining <= 7) {
      newAlerts.push({ type:'info', icon:'📅', text:`Votre abonnement expire dans ${usage.days_remaining} jours` });
    }

    setAlerts(newAlerts);
  }, [usage]);

  if (loading) return null;

  return (
    <div style={{ ...S.card, background:'linear-gradient(135deg,#0a0a0f,#13131a)', border:'1px solid rgba(201,168,76,0.2)' }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
        <div style={{ width:40, height:40, borderRadius:10, background:'rgba(201,168,76,0.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>🤖</div>
        <div>
          <div style={{ color:'#e2e8f0', fontWeight:700, fontSize:15 }}>Agent Multiwave</div>
          <div style={{ color:'#475569', fontSize:12 }}>Suivi intelligent de votre abonnement</div>
        </div>
        <div style={{ marginLeft:'auto', background:'rgba(74,222,128,0.1)', border:'1px solid #4ade80', color:'#4ade80', padding:'3px 10px', borderRadius:20, fontSize:11 }}>
          🟢 Actif
        </div>
      </div>

      {/* Alertes */}
      {alerts.length > 0 && (
        <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:16 }}>
          {alerts.map((alert, i) => (
            <div key={i} style={{
              display:'flex', alignItems:'center', gap:10, padding:'10px 14px',
              background: alert.type==='warning' ? 'rgba(251,191,36,0.08)' : 'rgba(96,165,250,0.08)',
              border: `1px solid ${alert.type==='warning' ? 'rgba(251,191,36,0.3)' : 'rgba(96,165,250,0.3)'}`,
              borderRadius:8,
            }}>
              <span style={{ fontSize:16 }}>{alert.icon}</span>
              <span style={{ color: alert.type==='warning' ? '#fbbf24' : '#60a5fa', fontSize:13 }}>{alert.text}</span>
            </div>
          ))}
        </div>
      )}

      {/* Usage stats */}
      {usage && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))', gap:10 }}>
          {[
            { icon:'📞', label:'Appels aujourd\'hui', val:`${usage.calls_today} min`, limit:usage.calls_limit_day, color:'#C9A84C' },
            { icon:'🎤', label:'Speech-to-Speech', val:`${usage.stt_used} min`, limit:usage.stt_limit, color:'#a78bfa' },
            { icon:'🛍️', label:'Ventes ce mois', val:usage.marketplace_sales, limit:null, color:'#4ade80' },
            { icon:'📅', label:'Jours restants', val:usage.days_remaining, limit:null, color:'#60a5fa' },
          ].map((stat, i) => (
            <div key={i} style={{ background:'rgba(255,255,255,0.03)', borderRadius:10, padding:12 }}>
              <div style={{ fontSize:18, marginBottom:4 }}>{stat.icon}</div>
              <div style={{ color:stat.color, fontWeight:700, fontSize:16 }}>{stat.val}</div>
              {stat.limit && <div style={{ color:'#475569', fontSize:10 }}>/ {stat.limit} max</div>}
              <div style={{ color:'#334155', fontSize:10, marginTop:2 }}>{stat.label}</div>
              {/* Barre de progression */}
              {stat.limit && (
                <div style={{ height:3, background:'#1e1e2e', borderRadius:2, marginTop:6, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${Math.min((parseInt(stat.val)/stat.limit)*100, 100)}%`, background:stat.color, borderRadius:2 }}/>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// PLAN CARD
// ─────────────────────────────────────────────
function PlanCard({ plan, isCurrentPlan, onSubscribe }) {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (isCurrentPlan) return;
    setLoading(true);
    try {
      await onSubscribe(plan.id);
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      ...S.card,
      outline: isCurrentPlan ? `2px solid ${plan.color}` : 'none',
      transform: plan.popular ? 'scale(1.02)' : 'none',
      boxShadow: plan.popular ? `0 8px 32px ${plan.color}20` : 'none',
    }}>
      {/* Badge populaire */}
      {plan.badge && (
        <div style={{
          position:'absolute', top:-1, right:16,
          background: plan.popular ? plan.gradient : `linear-gradient(135deg,${plan.color},${plan.color}99)`,
          color:'#fff', padding:'4px 12px', borderRadius:'0 0 8px 8px',
          fontSize:11, fontWeight:700,
        }}>{plan.badge}</div>
      )}
      {isCurrentPlan && (
        <div style={{ position:'absolute', top:12, left:16, background:'rgba(74,222,128,0.15)', border:'1px solid #4ade80', color:'#4ade80', padding:'2px 10px', borderRadius:20, fontSize:10, fontWeight:700 }}>
          ✅ Plan actuel
        </div>
      )}

      {/* Header */}
      <div style={{ marginTop: plan.badge ? 16 : 0, marginBottom:20 }}>
        <div style={{ fontSize:36, marginBottom:8 }}>{plan.icon}</div>
        <div style={{ color:'#e2e8f0', fontWeight:800, fontSize:20, marginBottom:4 }}>{plan.name}</div>
        <div style={{ display:'flex', alignItems:'baseline', gap:4 }}>
          <span style={{ color:plan.color, fontWeight:800, fontSize:32 }}>{plan.price === 0 ? 'Gratuit' : `$${plan.price}`}</span>
          {plan.price > 0 && <span style={{ color:'#475569', fontSize:13 }}>/{plan.period}</span>}
        </div>
        {plan.price > 0 && (
          <div style={{ color:'#334155', fontSize:11, marginTop:2 }}>
            Soit ${(plan.price / 30).toFixed(2)}/jour — {plan.id === 'local' ? '33% moins cher que Facebook' : plan.id === 'international' ? '33% moins cher que Facebook' : ''}
          </div>
        )}
      </div>

      {/* Features */}
      <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:20 }}>
        {plan.features.map((f, i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ fontSize:14, flexShrink:0 }}>{f.icon}</span>
            <span style={{ color: f.icon==='✅' ? '#94a3b8' : '#334155', fontSize:13 }}>{f.text}</span>
          </div>
        ))}
      </div>

      {/* Bouton */}
      <button
        onClick={handleSubscribe}
        disabled={isCurrentPlan || loading}
        style={{
          width:'100%', padding:'12px', borderRadius:10, border:'none',
          cursor: isCurrentPlan ? 'default' : 'pointer',
          fontWeight:700, fontSize:14,
          background: isCurrentPlan ? 'rgba(74,222,128,0.1)' : plan.price === 0 ? 'rgba(100,116,139,0.1)' : plan.gradient,
          color: isCurrentPlan ? '#4ade80' : plan.price === 0 ? '#64748b' : '#fff',
          border: isCurrentPlan ? '1px solid #4ade80' : 'none',
          opacity: loading ? 0.7 : 1,
          transition:'all 0.2s',
        }}
      >
        {loading ? '⏳ Traitement...' : isCurrentPlan ? '✅ Plan actuel' : plan.price === 0 ? 'Commencer gratuitement' : `S'abonner — $${plan.price}/mois`}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// SUBSCRIPTION PLANS PRINCIPAL
// ─────────────────────────────────────────────
export default function SubscriptionPlans({ userId }) {
  const [currentPlan,  setCurrentPlan]  = useState('free');
  const [tab,          setTab]          = useState('plans');
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    // Charger le plan actuel
    api.get(`/subscriptions/current?user_id=${userId}`)
      .then(res => setCurrentPlan(res.data?.data?.plan || res.data?.plan || 'free'))
      .catch(() => setCurrentPlan('free'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleSubscribe = async (planId) => {
    try {
      await api.post('/subscriptions/subscribe', { user_id: userId, plan: planId });
      setCurrentPlan(planId);
    } catch (err) {
      console.error('Erreur abonnement:', err);
    }
  };

  return (
    <div style={S.container}>

      {/* Header */}
      <div style={{ textAlign:'center' }}>
        <h2 style={{ color:'#e2e8f0', fontSize:24, fontWeight:800, margin:'0 0 8px' }}>
          🌊 Plans Multiwave
        </h2>
        <p style={{ color:'#475569', fontSize:14 }}>
          Moins cher que Facebook · Plus puissant · Fait pour le monde
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:8, justifyContent:'center' }}>
        {[{ key:'plans', label:'💎 Plans' },{ key:'usage', label:'📊 Mon utilisation' },{ key:'compare', label:'🆚 Comparer' }].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding:'7px 20px', borderRadius:20, cursor:'pointer', fontWeight:600, fontSize:13,
            background: tab===t.key ? 'rgba(201,168,76,0.12)' : 'transparent',
            border: `1px solid ${tab===t.key ? '#C9A84C' : '#1e1e2e'}`,
            color: tab===t.key ? '#C9A84C' : '#64748b',
          }}>{t.label}</button>
        ))}
      </div>

      {/* Plans */}
      {tab === 'plans' && (
        <>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:16, alignItems:'start' }}>
            {PLANS.map(plan => (
              <PlanCard
                key={plan.id}
                plan={plan}
                isCurrentPlan={currentPlan === plan.id}
                onSubscribe={handleSubscribe}
              />
            ))}
          </div>

          {/* Note Stripe */}
          <div style={{ ...S.card, background:'rgba(14,165,233,0.05)', border:'1px solid rgba(14,165,233,0.2)', textAlign:'center' }}>
            <div style={{ color:'#60a5fa', fontSize:14, marginBottom:4 }}>🔒 Paiement 100% sécurisé</div>
            <div style={{ color:'#475569', fontSize:12 }}>Powered by Stripe · Visa · Mastercard · PayPal · Crypto</div>
          </div>
        </>
      )}

      {/* Usage */}
      {tab === 'usage' && (
        <SubscriptionAgent userId={userId} currentPlan={currentPlan}/>
      )}

      {/* Comparaison */}
      {tab === 'compare' && (
        <div style={S.card}>
          <h3 style={{ color:'#e2e8f0', fontSize:17, fontWeight:700, marginBottom:16 }}>🆚 Multiwave vs Concurrents</h3>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ background:'#0d0d18' }}>
                  <th style={{ color:'#475569', padding:'10px 14px', textAlign:'left', fontSize:12, fontWeight:700 }}>Fonctionnalité</th>
                  <th style={{ color:'#C9A84C', padding:'10px 14px', textAlign:'center', fontSize:12, fontWeight:700 }}>🌊 Multiwave</th>
                  <th style={{ color:'#60a5fa', padding:'10px 14px', textAlign:'center', fontSize:12, fontWeight:700 }}>Facebook</th>
                  <th style={{ color:'#a78bfa', padding:'10px 14px', textAlign:'center', fontSize:12, fontWeight:700 }}>LinkedIn</th>
                </tr>
              </thead>
              <tbody>
                {COMPETITOR_COMPARE.map((row, i) => (
                  <tr key={i} style={{ background: i%2===0?'transparent':'rgba(255,255,255,0.01)', borderBottom:'1px solid #0d0d18' }}>
                    <td style={{ color:'#94a3b8', padding:'10px 14px', fontSize:13 }}>{row.feature}</td>
                    <td style={{ color:'#4ade80', padding:'10px 14px', textAlign:'center', fontSize:13, fontWeight:700 }}>{row.multiwave}</td>
                    <td style={{ color:'#f87171', padding:'10px 14px', textAlign:'center', fontSize:13 }}>{row.facebook}</td>
                    <td style={{ color:'#64748b', padding:'10px 14px', textAlign:'center', fontSize:13 }}>{row.linkedin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop:16, padding:14, background:'rgba(74,222,128,0.05)', borderRadius:10, border:'1px solid rgba(74,222,128,0.1)' }}>
            <div style={{ color:'#4ade80', fontWeight:700, fontSize:14, marginBottom:4 }}>✅ Multiwave gagne sur tous les points !</div>
            <div style={{ color:'#475569', fontSize:12, lineHeight:1.6 }}>
              • Marketplace locale <strong style={{ color:'#4ade80' }}>33% moins cher</strong> que Facebook<br/>
              • Marketplace internationale <strong style={{ color:'#4ade80' }}>66% moins cher</strong> que Facebook<br/>
              • Speech-to-Speech traduit en temps réel — <strong style={{ color:'#4ade80' }}>exclusivité Multiwave</strong><br/>
              • Plan Business <strong style={{ color:'#4ade80' }}>66% moins cher</strong> que LinkedIn Premium
            </div>
          </div>
        </div>
      )}

    </div>
  );
}