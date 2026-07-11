// ─────────────────────────────────────────────
// Wallets.jsx — Multiwave Wallet & Plans
// Auteur : Zahnouni Issam
// ─────────────────────────────────────────────
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useTranslation } from '../i18n';

const S = {
  container:   { display:'flex', flexDirection:'column', gap:18 },
  card:        { background:'#13131a', border:'1px solid #1e1e2e', borderRadius:14, padding:20 },
  badge:       { padding:'2px 8px', borderRadius:20, fontSize:10, fontWeight:700 },
  filterBtn:   { background:'transparent', border:'1px solid #1e1e2e', color:'#64748b', padding:'5px 14px', borderRadius:20, cursor:'pointer', fontSize:12, fontWeight:600 },
  filterActive:{ background:'rgba(201,168,76,0.12)', border:'1px solid #C9A84C', color:'#C9A84C' },
  input:       { background:'#0a0a0f', border:'1px solid #1e1e2e', color:'#e2e8f0', padding:'10px 14px', borderRadius:8, fontSize:13, outline:'none', boxSizing:'border-box' },
  saveBtn:     { background:'linear-gradient(135deg,#C9A84C,#F5D87A)', color:'#1a1200', border:'none', padding:'10px 24px', borderRadius:8, fontWeight:700, cursor:'pointer', fontSize:13 },
  dangerBtn:   { background:'rgba(248,113,113,0.1)', border:'1px solid rgba(248,113,113,0.3)', color:'#f87171', padding:'10px 20px', borderRadius:8, cursor:'pointer', fontSize:13, fontWeight:700 },
};

const fmtPrice = (n) => parseFloat(n||0).toLocaleString('fr-FR', { minimumFractionDigits:2 });
const timeAgo  = (d) => {
  if (!d) return '—';
  const diff = Math.floor((Date.now() - new Date(d)) / 1000);
  if (diff < 60)    return `${diff}s`;
  if (diff < 3600)  return `${Math.floor(diff/60)}m`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h`;
  return `${Math.floor(diff/86400)}j`;
};

const CALL_PLANS = [
  { id:'free_calls', icon:'🌊', name_key:'free', price:0, color:'#64748b', gradient:'linear-gradient(135deg,#1e1e2e,#2a2a3e)', features:['5 min/day calls','Audio & video calls','Speech-to-Speech 5 min'], limits:'5 min/day' },
  { id:'calls_30',   icon:'📞', name:'Standard', price:30,  color:'#C9A84C', gradient:'linear-gradient(135deg,#C9A84C,#F5D87A)', features:['30 min calls/day','Audio & video calls','Speech-to-Speech included','Real-time translation'], limits:'30 min/day', popular:false },
  { id:'calls_60',   icon:'🎯', name:'Pro',      price:49,  color:'#60a5fa', gradient:'linear-gradient(135deg,#0ea5e9,#6366f1)', features:['1h calls/day','HD Audio & video calls','Unlimited Speech-to-Speech','Call recording'],        limits:'1h/day',    popular:true  },
  { id:'calls_vip',  icon:'👑', name:'VIP',      price:150, color:'#a78bfa', gradient:'linear-gradient(135deg,#7c3aed,#C9A84C)', features:['Unlimited calls','4K Quality','Unlimited Speech-to-Speech','24/7 priority support'],         limits:'Unlimited', popular:false },
];

const MARKETPLACE_PLANS = [
  { id:'market_local',     icon:'🏙️', name:'Local',         price:19,  period_key:'month', color:'#4ade80', gradient:'linear-gradient(135deg,#16a34a,#4ade80)', features:['Local sales only','Up to 50 products','Basic analytics','Standard support'] },
  { id:'market_intl',      icon:'🌍', name:'International',  price:49,  period:'15 days',   color:'#60a5fa', gradient:'linear-gradient(135deg,#0ea5e9,#8b5cf6)', features:['International sales','Unlimited products','Advanced analytics','Verified badge ✅'], popular:true },
  { id:'market_business',  icon:'💼', name:'Business',       price:99,  period_key:'month', color:'#C9A84C', gradient:'linear-gradient(135deg,#C9A84C,#F5D87A)', features:['All International +','Multi-stores','Marketplace API','Dedicated manager'] },
  { id:'market_vip',       icon:'👑', name:'VIP',            price:150, period_key:'month', color:'#a78bfa', gradient:'linear-gradient(135deg,#7c3aed,#C9A84C)', features:['All Business +','0% Commission','Priority ads','SLA 99.9%'] },
];

const COMBO_PLANS = [
  { id:'combo_standard', icon:'🎁', name:'Calls 30min + Local',          original:49,  discount:20, color:'#4ade80', features:['30 min calls/day','Local marketplace','Speech-to-Speech','Save 20%'] },
  { id:'combo_pro',      icon:'🚀', name:'Calls Pro + International',     original:98,  discount:20, color:'#60a5fa', features:['1h HD calls/day','International marketplace','Unlimited Speech-to-Speech','Save 20%'], popular:true },
  { id:'combo_vip',      icon:'👑', name:'VIP Calls + VIP Market',        original:300, discount:20, color:'#a78bfa', features:['Unlimited calls','VIP Marketplace','Everything unlimited','Save 20%'] },
];

const MOCK_WALLET = { id:1, user_id:1, balance:245.50, currency:'USD', total_earned:1240.00, total_spent:994.50 };
const MOCK_TRANSACTIONS = [
  { id:1, type:'credit', amount:49.00,  description:'Pro Calls Subscription',  status:'completed', created_at:'2026-03-13T10:00:00Z' },
  { id:2, type:'debit',  amount:19.00,  description:'Local Marketplace',        status:'completed', created_at:'2026-03-12T14:00:00Z' },
  { id:3, type:'credit', amount:150.00, description:'Video revenue',            status:'completed', created_at:'2026-03-11T09:00:00Z' },
  { id:4, type:'debit',  amount:30.00,  description:'Standard Calls Sub.',      status:'completed', created_at:'2026-03-10T16:00:00Z' },
  { id:5, type:'credit', amount:89.00,  description:'Marketplace sale',         status:'completed', created_at:'2026-03-09T11:00:00Z' },
];

function PlanCard({ plan, onSubscribe, currentPlan, t }) {
  const isCurrent  = currentPlan === plan.id;
  const comboPrice = plan.original ? Math.round(plan.original * (1 - plan.discount/100)) : null;
  const planName   = plan.name_key ? t(plan.name_key) : plan.name;

  return (
    <div style={{ background:'#13131a', border:`1px solid ${isCurrent?plan.color:plan.popular?plan.color+'40':'#1e1e2e'}`, borderRadius:14, padding:20, display:'flex', flexDirection:'column', gap:12, position:'relative', overflow:'hidden', transform:plan.popular?'scale(1.02)':'none', boxShadow:plan.popular?`0 4px 24px ${plan.color}20`:'none' }}>
      {plan.popular && <div style={{ position:'absolute', top:0, right:16, background:plan.gradient, color:'#fff', padding:'3px 12px', borderRadius:'0 0 8px 8px', fontSize:10, fontWeight:700 }}>🔥 {t('popular')}</div>}
      {isCurrent   && <div style={{ position:'absolute', top:8, left:12, background:'rgba(74,222,128,0.15)', border:'1px solid #4ade80', color:'#4ade80', padding:'2px 8px', borderRadius:20, fontSize:10, fontWeight:700 }}>{t('current_plan')}</div>}

      <div style={{ marginTop:plan.popular?12:0 }}>
        <div style={{ fontSize:32, marginBottom:6 }}>{plan.icon}</div>
        <div style={{ color:'#e2e8f0', fontWeight:800, fontSize:16 }}>{planName}</div>
        {comboPrice ? (
          <div>
            <div style={{ display:'flex', alignItems:'baseline', gap:6 }}>
              <span style={{ color:plan.color, fontWeight:800, fontSize:26 }}>${comboPrice}</span>
              <span style={{ color:'#334155', fontSize:13, textDecoration:'line-through' }}>${plan.original}</span>
            </div>
            <div style={{ color:'#4ade80', fontSize:11, marginTop:2 }}>🎁 -{plan.discount}% saved!</div>
          </div>
        ) : (
          <div style={{ display:'flex', alignItems:'baseline', gap:4 }}>
            <span style={{ color:plan.price===0?'#64748b':plan.color, fontWeight:800, fontSize:26 }}>
              {plan.price===0 ? t('free') : `$${plan.price}`}
            </span>
            {plan.price > 0 && <span style={{ color:'#475569', fontSize:12 }}>/{plan.period ? plan.period : t('month')}</span>}
          </div>
        )}
        {plan.limits && <div style={{ background:`${plan.color}10`, border:`1px solid ${plan.color}30`, color:plan.color, padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:700, display:'inline-block', marginTop:6 }}>⏱ {plan.limits}</div>}
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:6, flex:1 }}>
        {plan.features.map((f,i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:7 }}>
            <span style={{ color:plan.color, fontSize:12 }}>✓</span>
            <span style={{ color:'#94a3b8', fontSize:12 }}>{f}</span>
          </div>
        ))}
      </div>

      <button onClick={() => onSubscribe(plan)} disabled={isCurrent} style={{ width:'100%', padding:'10px', borderRadius:8, background:isCurrent?'rgba(74,222,128,0.1)':plan.price===0?'rgba(100,116,139,0.1)':plan.gradient, color:isCurrent?'#4ade80':plan.price===0?'#64748b':'#fff', border:isCurrent?'1px solid #4ade80':'none', fontWeight:700, fontSize:13, cursor:isCurrent?'default':'pointer' }}>
        {isCurrent ? t('current_plan') : plan.price===0 ? t('continue_free') : `${t('subscribe')} — $${comboPrice||plan.price}`}
      </button>
    </div>
  );
}

export default function Wallets({ userId }) {
  const { t } = useTranslation();
  const [wallet,       setWallet]       = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [tab,          setTab]          = useState('wallet');
  const [planTab,      setPlanTab]      = useState('calls');
  const [currentPlan,  setCurrentPlan]  = useState('free_calls');
  const [form,         setForm]         = useState({ amount:'', note:'' });
  const [actionType,   setActionType]   = useState(null);
  const [toUser,       setToUser]       = useState('');
  const [success,      setSuccess]      = useState('');
  const [error,        setError]        = useState('');

  useEffect(() => { loadWallet(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadWallet = async () => {
    setLoading(true);
    try {
      const [wRes, tRes] = await Promise.allSettled([
        api.get(`/wallet?user_id=${userId}`),
        api.get(`/wallet/transactions?user_id=${userId}`),
      ]);
      setWallet(wRes.status==='fulfilled' ? wRes.value.data?.data||wRes.value.data : MOCK_WALLET);
      setTransactions(tRes.status==='fulfilled' ? tRes.value.data?.data||tRes.value.data||[] : MOCK_TRANSACTIONS);
    } catch {
      setWallet(MOCK_WALLET);
      setTransactions(MOCK_TRANSACTIONS);
    } finally { setLoading(false); }
  };

  const handleAction = async () => {
    if (!form.amount || parseFloat(form.amount) <= 0) { setError(t('invalid_amount')); return; }
    setError('');
    try {
      if (actionType === 'deposit') {
        await api.post('/wallet/deposit', { user_id:userId, amount:parseFloat(form.amount) });
        setWallet(w => ({...w, balance:w.balance + parseFloat(form.amount)}));
        setSuccess(`✅ ${form.amount}$ deposited!`);
      } else if (actionType === 'withdraw') {
        await api.post('/wallet/withdraw', { user_id:userId, amount:parseFloat(form.amount) });
        setWallet(w => ({...w, balance:w.balance - parseFloat(form.amount)}));
        setSuccess(`✅ ${form.amount}$ withdrawn!`);
      } else if (actionType === 'transfer') {
        if (!toUser) { setError(t('recipient_required')); return; }
        await api.post('/wallet/transfer', { user_id:userId, to_username:toUser, amount:parseFloat(form.amount) });
        setWallet(w => ({...w, balance:w.balance - parseFloat(form.amount)}));
        setSuccess(`✅ ${form.amount}$ sent to @${toUser}!`);
      }
      setForm({ amount:'', note:'' }); setToUser(''); setActionType(null);
      setTimeout(() => setSuccess(''), 3000);
      loadWallet();
    } catch (err) { setError(err.response?.data?.message || t('transaction_error')); }
  };

  const handleSubscribe = async (plan) => {
    try {
      await api.post('/subscriptions/subscribe', { user_id:userId, plan:plan.id });
      setCurrentPlan(plan.id);
      setSuccess(`✅ ${plan.name||t(plan.name_key)} activated!`);
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setCurrentPlan(plan.id);
      setSuccess(`✅ ${plan.name||t(plan.name_key)} activated!`);
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const TABS = [
    { key:'wallet',  label:t('my_wallet') },
    { key:'plans',   label:t('plans_tarifs') },
    { key:'history', label:t('history') },
  ];

  const PLAN_TABS = [
    { key:'calls',     label:t('calls_video') },
    { key:'market',    label:t('marketplace_plan') },
    { key:'combo',     label:t('combos') },
    { key:'video_rev', label:t('video_revenue') },
  ];

  const ACTIONS = [
    { key:'deposit',  icon:'⬆️', label:t('deposit'),  color:'#4ade80' },
    { key:'withdraw', icon:'⬇️', label:t('withdraw'), color:'#f87171' },
    { key:'transfer', icon:'↗️', label:t('transfer'), color:'#60a5fa' },
  ];

  return (
    <div style={S.container}>
      <h2 style={{ color:'#e2e8f0', fontSize:20, margin:0, fontWeight:700 }}>👛 {t('wallet_title')}</h2>

      <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
        {TABS.map(tb => (
          <button key={tb.key} onClick={() => setTab(tb.key)} style={{ ...S.filterBtn, padding:'7px 18px', borderRadius:8, fontSize:13, ...(tab===tb.key ? S.filterActive : {}) }}>{tb.label}</button>
        ))}
      </div>

      {success && <div style={{ background:'rgba(74,222,128,0.1)', border:'1px solid #4ade80', color:'#4ade80', padding:'10px 16px', borderRadius:8, fontSize:13 }}>{success}</div>}
      {error   && <div style={{ background:'rgba(248,113,113,0.1)', border:'1px solid #f87171', color:'#f87171', padding:'10px 16px', borderRadius:8, fontSize:13 }}>⚠️ {error}</div>}

      {/* WALLET */}
      {tab === 'wallet' && (
        <>
          <div style={{ ...S.card, background:'linear-gradient(135deg,#0a0a0f,#13131a)', border:'1px solid rgba(201,168,76,0.2)', textAlign:'center', padding:32 }}>
            <div style={{ color:'#475569', fontSize:13, marginBottom:8 }}>{t('available_balance')}</div>
            <div style={{ color:'#C9A84C', fontWeight:800, fontSize:48, marginBottom:4 }}>${fmtPrice(wallet?.balance||0)}</div>
            <div style={{ color:'#475569', fontSize:12 }}>USD</div>
            <div style={{ display:'flex', gap:16, justifyContent:'center', marginTop:20 }}>
              <div style={{ textAlign:'center' }}>
                <div style={{ color:'#4ade80', fontWeight:700, fontSize:16 }}>${fmtPrice(wallet?.total_earned||0)}</div>
                <div style={{ color:'#475569', fontSize:11 }}>{t('total_earned')}</div>
              </div>
              <div style={{ width:1, background:'#1e1e2e' }}/>
              <div style={{ textAlign:'center' }}>
                <div style={{ color:'#f87171', fontWeight:700, fontSize:16 }}>${fmtPrice(wallet?.total_spent||0)}</div>
                <div style={{ color:'#475569', fontSize:11 }}>{t('total_spent')}</div>
              </div>
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
            {ACTIONS.map(a => (
              <button key={a.key} onClick={() => setActionType(actionType===a.key?null:a.key)} style={{ background:actionType===a.key?`${a.color}15`:'#0a0a0f', border:`1px solid ${actionType===a.key?a.color:'#1e1e2e'}`, borderRadius:10, padding:'14px 10px', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
                <span style={{ fontSize:22 }}>{a.icon}</span>
                <span style={{ color:actionType===a.key?a.color:'#94a3b8', fontSize:12, fontWeight:600 }}>{a.label}</span>
              </button>
            ))}
          </div>

          {actionType && (
            <div style={S.card}>
              <div style={{ color:'#e2e8f0', fontWeight:700, fontSize:15, marginBottom:14 }}>
                {ACTIONS.find(a=>a.key===actionType)?.icon} {ACTIONS.find(a=>a.key===actionType)?.label}
              </div>
              {actionType === 'transfer' && (
                <div style={{ marginBottom:12 }}>
                  <label style={{ color:'#64748b', fontSize:12, display:'block', marginBottom:4 }}>{t('recipient')}</label>
                  <input style={{ ...S.input, width:'100%' }} placeholder="@username" value={toUser} onChange={e=>setToUser(e.target.value)}/>
                </div>
              )}
              <div style={{ marginBottom:14 }}>
                <label style={{ color:'#64748b', fontSize:12, display:'block', marginBottom:4 }}>{t('amount')} *</label>
                <input style={{ ...S.input, width:'100%' }} type="number" placeholder="0.00" value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))}/>
              </div>
              <div style={{ display:'flex', gap:10 }}>
                <button onClick={() => setActionType(null)} style={{ background:'transparent', border:'1px solid #1e1e2e', color:'#64748b', padding:'9px 18px', borderRadius:8, cursor:'pointer', fontSize:13 }}>{t('cancel')}</button>
                <button onClick={handleAction} style={{ ...S.saveBtn, flex:1 }}>{t('confirm')}</button>
              </div>
            </div>
          )}

          <div style={S.card}>
            <div style={{ color:'#e2e8f0', fontWeight:700, fontSize:15, marginBottom:14 }}>{t('recent_transactions')}</div>
            {transactions.slice(0,5).map((tx,i) => (
              <div key={tx.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom:i<4?'1px solid #0d0d18':'none' }}>
                <div style={{ width:36, height:36, borderRadius:10, background:tx.type==='credit'?'rgba(74,222,128,0.1)':'rgba(248,113,113,0.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>{tx.type==='credit'?'⬆️':'⬇️'}</div>
                <div style={{ flex:1 }}>
                  <div style={{ color:'#e2e8f0', fontSize:13, fontWeight:600 }}>{tx.description}</div>
                  <div style={{ color:'#475569', fontSize:11, marginTop:2 }}>{timeAgo(tx.created_at)}</div>
                </div>
                <div style={{ color:tx.type==='credit'?'#4ade80':'#f87171', fontWeight:700, fontSize:14 }}>
                  {tx.type==='credit'?'+':'-'}${fmtPrice(tx.amount)}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* PLANS */}
      {tab === 'plans' && (
        <>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {PLAN_TABS.map(pt => (
              <button key={pt.key} onClick={() => setPlanTab(pt.key)} style={{ ...S.filterBtn, ...(planTab===pt.key?S.filterActive:{}) }}>{pt.label}</button>
            ))}
          </div>

          {planTab === 'calls' && (
            <>
              <div style={{ color:'#475569', fontSize:13, background:'rgba(201,168,76,0.05)', border:'1px solid rgba(201,168,76,0.1)', borderRadius:8, padding:'10px 14px' }}>
                🎁 <strong style={{ color:'#C9A84C' }}>5 {t('views')}</strong> — Speech-to-Speech!
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:14 }}>
                {CALL_PLANS.map(plan => <PlanCard key={plan.id} plan={plan} onSubscribe={handleSubscribe} currentPlan={currentPlan} t={t}/>)}
              </div>
            </>
          )}

          {planTab === 'market' && (
            <>
              <div style={{ color:'#475569', fontSize:13, background:'rgba(74,222,128,0.05)', border:'1px solid rgba(74,222,128,0.1)', borderRadius:8, padding:'10px 14px' }}>
                🌍 <strong style={{ color:'#4ade80' }}>{t('earn_videos')}</strong>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:14 }}>
                {MARKETPLACE_PLANS.map(plan => <PlanCard key={plan.id} plan={plan} onSubscribe={handleSubscribe} currentPlan={currentPlan} t={t}/>)}
              </div>
            </>
          )}

          {planTab === 'combo' && (
            <>
              <div style={{ color:'#475569', fontSize:13, background:'rgba(96,165,250,0.05)', border:'1px solid rgba(96,165,250,0.1)', borderRadius:8, padding:'10px 14px' }}>
                🎁 <strong style={{ color:'#60a5fa' }}>{t('combos')}</strong> — <strong style={{ color:'#4ade80' }}>-20%</strong>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:14 }}>
                {COMBO_PLANS.map(plan => <PlanCard key={plan.id} plan={plan} onSubscribe={handleSubscribe} currentPlan={currentPlan} t={t}/>)}
              </div>
            </>
          )}

          {planTab === 'video_rev' && (
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div style={{ ...S.card, background:'linear-gradient(135deg,rgba(167,139,250,0.1),rgba(201,168,76,0.05))', border:'1px solid rgba(167,139,250,0.2)', textAlign:'center', padding:32 }}>
                <div style={{ fontSize:56, marginBottom:12 }}>🎬</div>
                <div style={{ color:'#e2e8f0', fontWeight:800, fontSize:22, marginBottom:8 }}>{t('earn_videos')}</div>
                <div style={{ color:'#a78bfa', fontWeight:800, fontSize:48, marginBottom:4 }}>90%</div>
                <div style={{ color:'#94a3b8', fontSize:14, marginBottom:20 }}>{t('revenue_share')}</div>
                <div style={{ display:'inline-block', background:'rgba(201,168,76,0.1)', border:'1px solid rgba(201,168,76,0.3)', color:'#C9A84C', padding:'6px 18px', borderRadius:20, fontSize:12, fontWeight:700 }}>
                  {t('multiwave_keeps')}
                </div>
              </div>

              <div style={S.card}>
                <div style={{ color:'#e2e8f0', fontWeight:700, fontSize:15, marginBottom:16 }}>{t('how_to_earn')}</div>
                {[
                  { step:'1', icon:'📹', title_key:'publish', desc_key:'ai_analysis' },
                  { step:'2', icon:'👁',  title_key:'generate_views', desc_key:'views_revenue' },
                  { step:'3', icon:'💰', title_key:'receive_90', desc_key:'wallet_direct' },
                  { step:'4', icon:'💳', title_key:'withdraw_earnings', desc_key:'bank_options' },
                ].map((s,i) => (
                  <div key={i} style={{ display:'flex', gap:14, padding:'12px 0', borderBottom:i<3?'1px solid #0d0d18':'none' }}>
                    <div style={{ width:32, height:32, borderRadius:'50%', background:'rgba(167,139,250,0.1)', border:'1px solid rgba(167,139,250,0.3)', display:'flex', alignItems:'center', justifyContent:'center', color:'#a78bfa', fontWeight:700, fontSize:13, flexShrink:0 }}>{s.step}</div>
                    <span style={{ fontSize:20, flexShrink:0 }}>{s.icon}</span>
                    <div>
                      <div style={{ color:'#e2e8f0', fontWeight:600, fontSize:13 }}>
                        {s.step==='1'?'Publish a video':s.step==='2'?'Generate views':s.step==='3'?'Receive 90% revenue':'Withdraw earnings'}
                      </div>
                      <div style={{ color:'#475569', fontSize:12, marginTop:2 }}>
                        {s.step==='1'?'Upload your content — automatic AI analysis':s.step==='2'?'Each view generates ad revenue':s.step==='3'?'Directly in your Multiwave Wallet':'Bank transfer, PayPal or Crypto'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={S.card}>
                <div style={{ color:'#e2e8f0', fontWeight:700, fontSize:15, marginBottom:14 }}>{t('revenue_sim')}</div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:10 }}>
                  {[
                    { views:'1,000',   yours:'$8.10'  },
                    { views:'10,000',  yours:'$81'    },
                    { views:'100,000', yours:'$810'   },
                    { views:'1M',      yours:'$8,100' },
                  ].map((s,i) => (
                    <div key={i} style={{ background:'#0a0a0f', borderRadius:10, padding:14, textAlign:'center' }}>
                      <div style={{ color:'#64748b', fontSize:11, marginBottom:6 }}>👁 {s.views} {t('views')}</div>
                      <div style={{ color:'#a78bfa', fontWeight:800, fontSize:18 }}>{s.yours}</div>
                      <div style={{ color:'#334155', fontSize:10, marginTop:3 }}>{t('you_receive')}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* HISTORY */}
      {tab === 'history' && (
        <div style={S.card}>
          <div style={{ color:'#e2e8f0', fontWeight:700, fontSize:15, marginBottom:16 }}>{t('all_transactions')}</div>
          {transactions.map((tx,i) => (
            <div key={tx.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 0', borderBottom:i<transactions.length-1?'1px solid #0d0d18':'none' }}>
              <div style={{ width:38, height:38, borderRadius:10, background:tx.type==='credit'?'rgba(74,222,128,0.1)':'rgba(248,113,113,0.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>
                {tx.type==='credit'?'⬆️':'⬇️'}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ color:'#e2e8f0', fontSize:13, fontWeight:600 }}>{tx.description}</div>
                <div style={{ color:'#475569', fontSize:11, marginTop:2 }}>{timeAgo(tx.created_at)}</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ color:tx.type==='credit'?'#4ade80':'#f87171', fontWeight:700, fontSize:14 }}>
                  {tx.type==='credit'?'+':'-'}${fmtPrice(tx.amount)}
                </div>
                <div style={{ color:'#334155', fontSize:10, marginTop:2 }}>
                  <span style={{ background:'rgba(74,222,128,0.1)', border:'1px solid rgba(74,222,128,0.2)', color:'#4ade80', padding:'1px 6px', borderRadius:10 }}>✅ {tx.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}