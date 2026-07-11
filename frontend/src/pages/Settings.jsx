// ─────────────────────────────────────────────
// Settings.jsx — Multiwave Paramètres
// Auteur : Zahnouni Issam
// ─────────────────────────────────────────────
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useTranslation, LANGUAGES } from '../i18n';

const S = {
  container:   { display:'flex', flexDirection:'column', gap:18, maxWidth:700, margin:'0 auto' },
  card:        { background:'#13131a', border:'1px solid #1e1e2e', borderRadius:14, overflow:'hidden' },
  cardHeader:  { padding:'16px 20px', borderBottom:'1px solid #1e1e2e', display:'flex', alignItems:'center', gap:10 },
  cardBody:    { padding:20 },
  input:       { background:'#0a0a0f', border:'1px solid #1e1e2e', color:'#e2e8f0', padding:'10px 14px', borderRadius:8, fontSize:13, width:'100%', boxSizing:'border-box', outline:'none' },
  label:       { color:'#64748b', fontSize:12, marginBottom:4, display:'block' },
  saveBtn:     { background:'linear-gradient(135deg,#C9A84C,#F5D87A)', color:'#1a1200', border:'none', padding:'10px 24px', borderRadius:8, fontWeight:700, cursor:'pointer', fontSize:13 },
  cancelBtn:   { background:'transparent', border:'1px solid #1e1e2e', color:'#64748b', padding:'10px 20px', borderRadius:8, cursor:'pointer', fontSize:13 },
  dangerBtn:   { background:'rgba(248,113,113,0.1)', border:'1px solid rgba(248,113,113,0.3)', color:'#f87171', padding:'10px 20px', borderRadius:8, cursor:'pointer', fontSize:13, fontWeight:700 },
  toggle:      { width:44, height:24, borderRadius:12, position:'relative', cursor:'pointer', transition:'background 0.2s', flexShrink:0 },
  toggleKnob:  { position:'absolute', top:3, width:18, height:18, borderRadius:'50%', background:'#fff', transition:'left 0.2s', boxShadow:'0 1px 4px rgba(0,0,0,0.3)' },
  row:         { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:'1px solid #0d0d18' },
  sectionIcon: { fontSize:20, width:36, height:36, borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(201,168,76,0.1)', flexShrink:0 },
};

function Toggle({ value, onChange }) {
  return (
    <div onClick={() => onChange(!value)} style={{ ...S.toggle, background: value ? '#C9A84C' : '#1e1e2e' }}>
      <div style={{ ...S.toggleKnob, left: value ? 23 : 3 }}/>
    </div>
  );
}

// ─────────────────────────────────────────────
// PROFIL
// ─────────────────────────────────────────────
function ProfileSettings({ userId }) {
  const { t } = useTranslation();
  const [form, setForm]     = useState({ username:'', full_name:'', email:'', bio:'', phone:'', website:'', location:'' });
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);

  useEffect(() => {
    api.get(`/users/${userId}`).then(res => {
      const u = res.data?.data || res.data;
      setForm({ username:u.username||'', full_name:u.full_name||'', email:u.email||'', bio:u.bio||'', phone:u.phone||'', website:u.website||'', location:u.location||'' });
    }).catch(() => {});
  }, [userId]);

  const handleSave = async () => {
    setSaving(true);
    try { await api.put(`/users/${userId}`, form); setSaved(true); setTimeout(() => setSaved(false), 3000); }
    catch {} finally { setSaving(false); }
  };

  const fields = [
    { key:'username',  label:t('username'),  type:'text' },
    { key:'full_name', label:t('full_name'), type:'text' },
    { key:'phone',     label:t('phone'),     type:'text' },
    { key:'website',   label:t('website'),   type:'text' },
    { key:'location',  label:t('location'),  type:'text' },
  ];

  return (
    <div style={S.card}>
      <div style={S.cardHeader}>
        <div style={S.sectionIcon}>👤</div>
        <div>
          <div style={{ color:'#e2e8f0', fontWeight:700, fontSize:15 }}>{t('profile_title')}</div>
          <div style={{ color:'#475569', fontSize:12 }}>{t('profile_desc')}</div>
        </div>
      </div>
      <div style={S.cardBody}>
        <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:20, padding:14, background:'rgba(201,168,76,0.04)', borderRadius:10, border:'1px solid rgba(201,168,76,0.1)' }}>
          <div style={{ width:64, height:64, borderRadius:'50%', background:'linear-gradient(135deg,#C9A84C,#F5D87A)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, fontWeight:700, color:'#1a1200' }}>
            {form.username?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <div style={{ color:'#e2e8f0', fontWeight:600, fontSize:14 }}>{form.username || 'Utilisateur'}</div>
            <div style={{ color:'#475569', fontSize:12, marginTop:2 }}>{form.email}</div>
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
          {fields.map(f => (
            <div key={f.key}>
              <label style={S.label}>{f.label}</label>
              <input style={S.input} type={f.type} value={form[f.key]} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))}/>
            </div>
          ))}
        </div>

        <div style={{ marginBottom:20 }}>
          <label style={S.label}>{t('bio')}</label>
          <textarea style={{ ...S.input, minHeight:80, resize:'vertical' }} value={form.bio} onChange={e=>setForm(p=>({...p,bio:e.target.value}))} placeholder={t('bio_placeholder')}/>
        </div>

        <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
          <button style={S.saveBtn} onClick={handleSave} disabled={saving}>
            {saving ? t('saving') : saved ? t('saved') : t('save')}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SÉCURITÉ
// ─────────────────────────────────────────────
function SecuritySettings({ userId }) {
  const { t } = useTranslation();
  const [form, setForm]     = useState({ current_password:'', new_password:'', confirm_password:'' });
  const [error, setError]   = useState('');
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);

  const handleSave = async () => {
    setError('');
    if (!form.current_password) { setError(t('current_pwd_required')); return; }
    if (form.new_password.length < 6) { setError(t('pwd_too_short')); return; }
    if (form.new_password !== form.confirm_password) { setError(t('pwd_no_match')); return; }
    setSaving(true);
    try {
      await api.put(`/users/${userId}`, { password: form.new_password });
      setSaved(true); setForm({ current_password:'', new_password:'', confirm_password:'' });
      setTimeout(() => setSaved(false), 3000);
    } catch { setError(t('pwd_error')); }
    finally { setSaving(false); }
  };

  return (
    <div style={S.card}>
      <div style={S.cardHeader}>
        <div style={S.sectionIcon}>🔒</div>
        <div>
          <div style={{ color:'#e2e8f0', fontWeight:700, fontSize:15 }}>{t('security_title')}</div>
          <div style={{ color:'#475569', fontSize:12 }}>{t('security_desc')}</div>
        </div>
      </div>
      <div style={S.cardBody}>
        {error && <div style={{ background:'rgba(248,113,113,0.1)', border:'1px solid rgba(248,113,113,0.3)', color:'#f87171', padding:'9px 14px', borderRadius:8, fontSize:13, marginBottom:16 }}>⚠️ {error}</div>}
        {saved && <div style={{ background:'rgba(74,222,128,0.1)', border:'1px solid #4ade80', color:'#4ade80', padding:'9px 14px', borderRadius:8, fontSize:13, marginBottom:16 }}>{t('password_changed')}</div>}

        {[
          { key:'current_password', label:t('current_password') },
          { key:'new_password',     label:t('new_password') },
          { key:'confirm_password', label:t('confirm_password') },
        ].map(f => (
          <div key={f.key} style={{ marginBottom:14 }}>
            <label style={S.label}>{f.label}</label>
            <input style={S.input} type="password" value={form[f.key]} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))} placeholder="••••••••"/>
          </div>
        ))}

        <div style={{ display:'flex', justifyContent:'flex-end' }}>
          <button style={S.saveBtn} onClick={handleSave} disabled={saving}>{saving ? '...' : t('change_password')}</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// NOTIFICATIONS
// ─────────────────────────────────────────────
function NotificationSettings() {
  const { t } = useTranslation();
  const [settings, setSettings] = useState({
    likes:true, comments:true, follows:true, messages:true, calls:true,
    mentions:true, debates:false, marketing:false, push:true, email_notifs:false,
  });

  const items = [
    { key:'likes',        icon:'❤️', label:t('likes_notif'),    desc:t('likes_desc') },
    { key:'comments',     icon:'💬', label:t('comments_notif'), desc:t('comments_desc') },
    { key:'follows',      icon:'👥', label:t('follows_notif'),  desc:t('follows_desc') },
    { key:'messages',     icon:'📩', label:t('messages_notif'), desc:t('messages_desc') },
    { key:'calls',        icon:'📞', label:t('calls_notif'),    desc:t('calls_desc') },
    { key:'mentions',     icon:'📢', label:t('mentions_notif'), desc:t('mentions_desc') },
    { key:'debates',      icon:'⚔️', label:t('debates_notif'),  desc:t('debates_desc') },
    { key:'marketing',    icon:'📣', label:t('marketing_notif'),desc:t('marketing_desc') },
    { key:'push',         icon:'🔔', label:t('push_notif'),     desc:t('push_desc') },
    { key:'email_notifs', icon:'📧', label:t('email_notif'),    desc:t('email_desc') },
  ];

  return (
    <div style={S.card}>
      <div style={S.cardHeader}>
        <div style={S.sectionIcon}>🔔</div>
        <div>
          <div style={{ color:'#e2e8f0', fontWeight:700, fontSize:15 }}>{t('notifs_title')}</div>
          <div style={{ color:'#475569', fontSize:12 }}>{t('notifs_desc')}</div>
        </div>
      </div>
      <div style={S.cardBody}>
        {items.map((item, i) => (
          <div key={item.key} style={{ ...S.row, borderBottom: i===items.length-1?'none':S.row.borderBottom }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <span style={{ fontSize:18 }}>{item.icon}</span>
              <div>
                <div style={{ color:'#e2e8f0', fontSize:13, fontWeight:600 }}>{item.label}</div>
                <div style={{ color:'#475569', fontSize:11 }}>{item.desc}</div>
              </div>
            </div>
            <Toggle value={settings[item.key]} onChange={val=>setSettings(p=>({...p,[item.key]:val}))}/>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// LANGUE & THÈME
// ─────────────────────────────────────────────
function LanguageSettings({ userId }) {
  const { t, lang: currentLang, changeLang } = useTranslation();
  const [selectedLang, setSelectedLang] = useState(currentLang);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    changeLang(selectedLang);
    try { await api.put(`/users/${userId}`, { preferred_language: selectedLang }); } catch {}
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const THEMES = [
    { val:'dark',  icon:'🌙', label:t('dark') },
    { val:'light', icon:'☀️', label:t('light') },
  ];

  return (
    <div style={S.card}>
      <div style={S.cardHeader}>
        <div style={S.sectionIcon}>🌍</div>
        <div>
          <div style={{ color:'#e2e8f0', fontWeight:700, fontSize:15 }}>{t('lang_title')}</div>
          <div style={{ color:'#475569', fontSize:12 }}>{t('lang_desc')}</div>
        </div>
      </div>
      <div style={S.cardBody}>
        <div style={{ marginBottom:20 }}>
          <label style={{ ...S.label, fontSize:13, color:'#94a3b8', marginBottom:10 }}>🌍 {t('pref_language')}</label>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {LANGUAGES.map(l => (
              <button key={l.value} onClick={() => setSelectedLang(l.value)} style={{
                padding:'7px 14px', borderRadius:20, cursor:'pointer', fontSize:12, fontWeight:600,
                background: selectedLang===l.value ? 'rgba(201,168,76,0.12)' : 'transparent',
                border: `1px solid ${selectedLang===l.value ? '#C9A84C' : '#1e1e2e'}`,
                color: selectedLang===l.value ? '#C9A84C' : '#64748b',
              }}>{l.flag} {l.label}</button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom:20 }}>
          <label style={{ ...S.label, fontSize:13, color:'#94a3b8', marginBottom:10 }}>🎨 {t('theme_label')}</label>
          <div style={{ display:'flex', gap:10 }}>
            {THEMES.map(th => (
              <button key={th.val} style={{
                flex:1, padding:'12px', borderRadius:10, cursor:'pointer', fontWeight:600, fontSize:13,
                background: th.val==='dark' ? 'rgba(201,168,76,0.1)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${th.val==='dark' ? '#C9A84C' : '#1e1e2e'}`,
                color: th.val==='dark' ? '#C9A84C' : '#64748b',
              }}>{th.icon} {th.label}</button>
            ))}
          </div>
        </div>

        {saved && <div style={{ color:'#4ade80', fontSize:13, marginBottom:10 }}>{t('saved')}</div>}
        <div style={{ display:'flex', justifyContent:'flex-end' }}>
          <button style={S.saveBtn} onClick={handleSave}>{t('save')}</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// CONFIDENTIALITÉ
// ─────────────────────────────────────────────
function PrivacySettings() {
  const { t } = useTranslation();
  const [settings, setSettings] = useState({
    profile_public:true, show_online:true, show_last_seen:true,
    allow_messages:true, allow_calls:true, show_followers:true, data_analytics:false,
  });

  const items = [
    { key:'profile_public', icon:'👁',  label:t('profile_public'),  desc:t('profile_public_desc') },
    { key:'show_online',    icon:'🟢', label:t('show_online'),     desc:t('show_online_desc') },
    { key:'show_last_seen', icon:'⏱',  label:t('show_last_seen'),  desc:t('show_last_seen_desc') },
    { key:'allow_messages', icon:'💬', label:t('allow_messages'),  desc:t('allow_messages_desc') },
    { key:'allow_calls',    icon:'📞', label:t('allow_calls'),     desc:t('allow_calls_desc') },
    { key:'show_followers', icon:'👥', label:t('show_followers'),  desc:t('show_followers_desc') },
    { key:'data_analytics', icon:'📊', label:t('data_analytics'),  desc:t('data_analytics_desc') },
  ];

  return (
    <div style={S.card}>
      <div style={S.cardHeader}>
        <div style={S.sectionIcon}>🛡️</div>
        <div>
          <div style={{ color:'#e2e8f0', fontWeight:700, fontSize:15 }}>{t('privacy_title')}</div>
          <div style={{ color:'#475569', fontSize:12 }}>{t('privacy_desc')}</div>
        </div>
      </div>
      <div style={S.cardBody}>
        {items.map((item, i) => (
          <div key={item.key} style={{ ...S.row, borderBottom: i===items.length-1?'none':S.row.borderBottom }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <span style={{ fontSize:18 }}>{item.icon}</span>
              <div>
                <div style={{ color:'#e2e8f0', fontSize:13, fontWeight:600 }}>{item.label}</div>
                <div style={{ color:'#475569', fontSize:11 }}>{item.desc}</div>
              </div>
            </div>
            <Toggle value={settings[item.key]} onChange={val=>setSettings(p=>({...p,[item.key]:val}))}/>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// DANGER ZONE
// ─────────────────────────────────────────────
function DangerSettings({ userId, onLogout }) {
  const { t } = useTranslation();
  const [confirm,  setConfirm]  = useState('');
  const [deleting, setDeleting] = useState(false);
  const confirmWord = t('delete_confirm_word');

  const handleDelete = async () => {
    if (confirm !== confirmWord) return;
    setDeleting(true);
    try { await api.delete(`/users/${userId}`); onLogout && onLogout(); }
    catch { setDeleting(false); }
  };

  return (
    <div style={{ ...S.card, border:'1px solid rgba(248,113,113,0.2)' }}>
      <div style={{ ...S.cardHeader, borderBottom:'1px solid rgba(248,113,113,0.1)' }}>
        <div style={{ ...S.sectionIcon, background:'rgba(248,113,113,0.1)' }}>⚠️</div>
        <div>
          <div style={{ color:'#f87171', fontWeight:700, fontSize:15 }}>{t('danger_title')}</div>
          <div style={{ color:'#475569', fontSize:12 }}>{t('danger_desc')}</div>
        </div>
      </div>
      <div style={S.cardBody}>
        <div style={S.row}>
          <div>
            <div style={{ color:'#e2e8f0', fontSize:13, fontWeight:600 }}>{t('logout_label')}</div>
            <div style={{ color:'#475569', fontSize:11 }}>{t('logout_desc')}</div>
          </div>
          <button style={S.dangerBtn} onClick={onLogout}>{t('logout_btn')}</button>
        </div>

        <div style={{ marginTop:20, padding:16, background:'rgba(248,113,113,0.05)', borderRadius:10, border:'1px solid rgba(248,113,113,0.15)' }}>
          <div style={{ color:'#f87171', fontWeight:700, fontSize:14, marginBottom:8 }}>{t('delete_account')}</div>
          <div style={{ color:'#64748b', fontSize:12, marginBottom:14, lineHeight:1.6 }}>{t('delete_warning')}</div>
          <div style={{ marginBottom:10 }}>
            <label style={S.label}>{t('type_to_confirm')} : <strong style={{ color:'#f87171' }}>{confirmWord}</strong></label>
            <input
              style={{ ...S.input, borderColor: confirm===confirmWord ? '#f87171' : '#1e1e2e' }}
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder={confirmWord}
            />
          </div>
          <button
            style={{ ...S.dangerBtn, opacity: confirm===confirmWord ? 1 : 0.4, cursor: confirm===confirmWord ? 'pointer' : 'default' }}
            onClick={handleDelete}
            disabled={confirm !== confirmWord || deleting}
          >
            {deleting ? '...' : t('delete_btn')}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SETTINGS PRINCIPAL
// ─────────────────────────────────────────────
export default function Settings({ userId, onLogout }) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('profile');

  const TABS = [
    { key:'profile',  icon:'👤', label:t('tab_profile') },
    { key:'security', icon:'🔒', label:t('tab_security') },
    { key:'notifs',   icon:'🔔', label:t('tab_notifs') },
    { key:'language', icon:'🌍', label:t('tab_language') },
    { key:'privacy',  icon:'🛡️', label:t('tab_privacy') },
    { key:'danger',   icon:'⚠️', label:t('tab_account') },
  ];

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
      <h2 style={{ color:'#e2e8f0', fontSize:20, margin:0, fontWeight:700 }}>⚙️ {t('settings_title')}</h2>

      <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
        {TABS.map(tb => (
          <button key={tb.key} onClick={() => setActiveTab(tb.key)} style={{
            padding:'7px 16px', borderRadius:8, cursor:'pointer', fontWeight:600, fontSize:13,
            background: activeTab===tb.key ? 'rgba(201,168,76,0.12)' : 'transparent',
            border: `1px solid ${activeTab===tb.key ? '#C9A84C' : '#1e1e2e'}`,
            color: activeTab===tb.key ? '#C9A84C' : '#64748b',
          }}>{tb.icon} {tb.label}</button>
        ))}
      </div>

      <div style={S.container}>
        {activeTab === 'profile'  && <ProfileSettings userId={userId}/>}
        {activeTab === 'security' && <SecuritySettings userId={userId}/>}
        {activeTab === 'notifs'   && <NotificationSettings/>}
        {activeTab === 'language' && <LanguageSettings userId={userId}/>}
        {activeTab === 'privacy'  && <PrivacySettings/>}
        {activeTab === 'danger'   && <DangerSettings userId={userId} onLogout={onLogout}/>}
      </div>
    </div>
  );
}