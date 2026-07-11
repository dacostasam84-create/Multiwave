// ─────────────────────────────────────────────
// Register.jsx — Multiwave Inscription
// Auteur : Zahnouni Issam
// ─────────────────────────────────────────────
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { register as registerApi } from '../services/api';
import { useFormValidation, FormField, PasswordStrength, rules } from '../components/useFormValidation';

const ROLES = [
  { value:'user',     icon:'👤', label:'Utilisateur',  desc:'Parcourir, acheter, communiquer' },
  { value:'seller',   icon:'🛍️', label:'Vendeur',      desc:'Vendre sur la Marketplace' },
  { value:'creator',  icon:'🎬', label:'Créateur',     desc:'Publier des vidéos et gagner' },
  { value:'business', icon:'💼', label:'Business',     desc:'Compte professionnel complet' },
];

export default function Register({ onSwitchToLogin }) {
  const { login }   = useAuth();
  const [step,      setStep]    = useState(1);
  const [role,      setRole]    = useState('user');
  const [error,     setError]   = useState('');
  const [loading,   setLoading] = useState(false);

  // ✅ FIX: ne pas utiliser values dans la définition des règles
  const { values, errors, touched, handleChange, handleBlur, validate } = useFormValidation(
    { username:'', email:'', password:'', confirm_password:'', full_name:'', phone:'' },
    {
      username:         [rules.required, rules.username],
      email:            [rules.required, rules.email],
      password:         [rules.required, rules.minLength(6)],
      confirm_password: [rules.required],
      full_name:        [rules.required],
    }
  );

  // Règle confirm password définie séparément après values
  const confirmRule = (val) => val !== values.password ? 'Les mots de passe ne correspondent pas' : null;

  const handleStep1 = () => {
    const isValid = validate();
    const confirmError = confirmRule(values.confirm_password);
    if (!isValid || confirmError) {
      setError(confirmError || 'Veuillez corriger les erreurs');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await registerApi(values.username, values.email, values.password, {
        full_name: values.full_name,
        phone:     values.phone,
        role,
      });
      if (res.data?.token) {
        login(res.data.token, res.data.userId);
      } else {
        setStep(3);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'inscription");
      setStep(1);
    } finally { setLoading(false); }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:24 }}>
          <h1 style={styles.title}>🌊 MULTIWAVE</h1>
          <p style={styles.subtitle}>connect · explore</p>
        </div>

        {/* Steps */}
        <div style={{ display:'flex', justifyContent:'center', gap:8, marginBottom:24 }}>
          {[1,2].map(s => (
            <div key={s} style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{
                width:28, height:28, borderRadius:'50%',
                background: step >= s ? 'linear-gradient(135deg,#C9A84C,#F5D87A)' : '#1e1e2e',
                color: step >= s ? '#1a1200' : '#475569',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:12, fontWeight:700,
              }}>{s}</div>
              {s < 2 && <div style={{ width:40, height:2, background: step > s ? '#C9A84C' : '#1e1e2e' }}/>}
            </div>
          ))}
        </div>

        {error && <div style={styles.error}>⚠️ {error}</div>}

        {/* ÉTAPE 1 */}
        {step === 1 && (
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div style={{ color:'#C9A84C', fontSize:13, fontWeight:700, marginBottom:4 }}>
              Étape 1 — Vos informations
            </div>

            <FormField
              label="Nom complet *" name="full_name" type="text"
              value={values.full_name} error={errors.full_name} touched={touched.full_name}
              onChange={handleChange} onBlur={handleBlur} placeholder="Votre nom complet" required
            />
            <FormField
              label="Nom d'utilisateur *" name="username" type="text"
              value={values.username} error={errors.username} touched={touched.username}
              onChange={handleChange} onBlur={handleBlur} placeholder="ex: zahnouni_issam" required
            />
            <FormField
              label="Email *" name="email" type="email"
              value={values.email} error={errors.email} touched={touched.email}
              onChange={handleChange} onBlur={handleBlur} placeholder="votre@email.com" required
            />
            <FormField
              label="Téléphone" name="phone" type="text"
              value={values.phone} error={errors.phone} touched={touched.phone}
              onChange={handleChange} onBlur={handleBlur} placeholder="+212 6XX XXX XXX"
            />
            <div>
              <FormField
                label="Mot de passe *" name="password" type="password"
                value={values.password} error={errors.password} touched={touched.password}
                onChange={handleChange} onBlur={handleBlur} placeholder="••••••••" required
              />
              <PasswordStrength value={values.password}/>
            </div>
            <div>
              <label style={{ color:'#64748b', fontSize:12, display:'flex', gap:4, marginBottom:4 }}>
                Confirmer le mot de passe <span style={{ color:'#f87171' }}>*</span>
              </label>
              <input
                type="password"
                value={values.confirm_password}
                onChange={e => handleChange('confirm_password', e.target.value)}
                onBlur={() => handleBlur('confirm_password')}
                placeholder="••••••••"
                style={{
                  background:'#0a0a0f',
                  border:`1px solid ${touched.confirm_password && confirmRule(values.confirm_password) ? '#f87171' : values.confirm_password && !confirmRule(values.confirm_password) ? 'rgba(201,168,76,0.3)' : '#1e1e2e'}`,
                  color:'#e2e8f0', padding:'10px 14px', borderRadius:8,
                  fontSize:13, width:'100%', boxSizing:'border-box', outline:'none',
                }}
              />
              {touched.confirm_password && confirmRule(values.confirm_password) && (
                <span style={{ color:'#f87171', fontSize:11 }}>⚠️ {confirmRule(values.confirm_password)}</span>
              )}
              {touched.confirm_password && values.confirm_password && !confirmRule(values.confirm_password) && (
                <span style={{ color:'#4ade80', fontSize:11 }}>✅ OK</span>
              )}
            </div>

            <button style={styles.button} onClick={handleStep1}>Suivant →</button>

            <div style={{ textAlign:'center', color:'#475569', fontSize:13 }}>
              Déjà un compte ?{' '}
              <button onClick={onSwitchToLogin} style={{ background:'none', border:'none', color:'#C9A84C', cursor:'pointer', fontSize:13, fontWeight:700 }}>
                Se connecter
              </button>
            </div>
          </div>
        )}

        {/* ÉTAPE 2 */}
        {step === 2 && (
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div style={{ color:'#C9A84C', fontSize:13, fontWeight:700, marginBottom:4 }}>
              Étape 2 — Choisissez votre rôle
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              {ROLES.map(r => (
                <div key={r.value} onClick={() => setRole(r.value)} style={{
                  border:`2px solid ${role===r.value ? '#C9A84C' : '#1e1e2e'}`,
                  borderRadius:12, padding:14, cursor:'pointer',
                  background: role===r.value ? 'rgba(201,168,76,0.08)' : '#0a0a0f',
                  transition:'all 0.2s',
                }}>
                  <div style={{ fontSize:28, marginBottom:6 }}>{r.icon}</div>
                  <div style={{ color:role===r.value ? '#C9A84C' : '#e2e8f0', fontWeight:700, fontSize:13 }}>{r.label}</div>
                  <div style={{ color:'#475569', fontSize:11, marginTop:3 }}>{r.desc}</div>
                </div>
              ))}
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={() => setStep(1)} style={styles.cancelBtn}>← Retour</button>
              <button onClick={handleSubmit} disabled={loading} style={{ ...styles.button, flex:1 }}>
                {loading ? '⏳ Inscription...' : '🚀 Créer mon compte'}
              </button>
            </div>
          </div>
        )}

        {/* ÉTAPE 3 */}
        {step === 3 && (
          <div style={{ textAlign:'center', padding:20 }}>
            <div style={{ fontSize:64, marginBottom:16 }}>🎉</div>
            <div style={{ color:'#4ade80', fontWeight:800, fontSize:20, marginBottom:8 }}>Compte créé !</div>
            <div style={{ color:'#94a3b8', fontSize:13, marginBottom:24 }}>
              Bienvenue sur Multiwave ! Connectez-vous pour commencer.
            </div>
            <button onClick={onSwitchToLogin} style={styles.button}>🚀 Se connecter</button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#070710', fontFamily:"'Outfit','DM Sans',sans-serif", padding:16 },
  card:      { background:'#13131a', border:'1px solid rgba(201,168,76,0.2)', borderRadius:16, padding:36, width:'100%', maxWidth:420, boxShadow:'0 24px 64px rgba(0,0,0,0.6)' },
  title:     { color:'#C9A84C', fontFamily:"'Georgia',serif", fontSize:22, letterSpacing:4, margin:0 },
  subtitle:  { color:'#475569', fontSize:12, letterSpacing:3, marginTop:4 },
  button:    { width:'100%', padding:'12px', background:'linear-gradient(135deg,#C9A84C,#F5D87A)', color:'#1a1200', border:'none', borderRadius:8, fontSize:14, fontWeight:700, cursor:'pointer' },
  cancelBtn: { padding:'12px 20px', background:'transparent', border:'1px solid #1e1e2e', color:'#64748b', borderRadius:8, cursor:'pointer', fontSize:13 },
  error:     { background:'rgba(248,113,113,0.1)', border:'1px solid rgba(248,113,113,0.3)', color:'#f87171', padding:'10px 16px', borderRadius:8, fontSize:13, marginBottom:8 },
};