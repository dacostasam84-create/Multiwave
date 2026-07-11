// C:\Multiwave\frontend\src\pages\Login.js
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { login as loginApi } from '../services/api';
import { useFormValidation, FormField, PasswordStrength, rules } from '../components/useFormValidation';

export default function Login({ onSwitchToRegister, onSwitchToForgot }) {
  const { login }   = useAuth();
  const [error,     setError]   = useState('');
  const [loading,   setLoading] = useState(false);

  const { values, errors, touched, handleChange, handleBlur, validate } = useFormValidation(
    { email:'', password:'' },
    {
      email:    [rules.required, rules.email],
      password: [rules.required, rules.minLength(6)],
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError('');
    try {
      const res = await loginApi(values.email, values.password);
      login(res.data.token, res.data.userId);
    } catch (err) {
      setError('Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:24 }}>
          <h1 style={styles.title}>🌊 MULTIWAVE</h1>
          <p style={styles.subtitle}>connect · explore</p>
        </div>

        {error && <div style={styles.error}>⚠️ {error}</div>}

        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:14 }}>

          <FormField
            label="Email"
            name="email"
            type="email"
            value={values.email}
            error={errors.email}
            touched={touched.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="votre@email.com"
            required
          />

          <div>
            <FormField
              label="Mot de passe"
              name="password"
              type="password"
              value={values.password}
              error={errors.password}
              touched={touched.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="••••••••"
              required
            />
            <PasswordStrength value={values.password}/>
          </div>

          <button style={{
            ...styles.button,
            opacity: loading ? 0.7 : 1,
            marginTop: 8,
          }} type="submit" disabled={loading}>
            {loading ? '⏳ Connexion...' : '🚀 Se connecter'}
          </button>

          {/* Mot de passe oublié */}
          <div style={{ textAlign:'right', marginTop:4 }}>
            <button
              type="button"
              onClick={onSwitchToForgot}
              style={{ background:'none', border:'none', color:'#475569', cursor:'pointer', fontSize:12 }}
            >
              Mot de passe oublié ?
            </button>
          </div>

          {/* Lien inscription */}
          <div style={{ textAlign:'center', color:'#475569', fontSize:13, marginTop:4, borderTop:'1px solid #1e1e2e', paddingTop:14 }}>
            Pas encore de compte ?{' '}
            <button
              type="button"
              onClick={onSwitchToRegister}
              style={{ background:'none', border:'none', color:'#C9A84C', cursor:'pointer', fontSize:13, fontWeight:700 }}
            >
              S'inscrire gratuitement
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#070710', fontFamily:"'Outfit','DM Sans',sans-serif" },
  card:      { background:'#13131a', border:'1px solid rgba(201,168,76,0.2)', borderRadius:16, padding:40, width:380, boxShadow:'0 24px 64px rgba(0,0,0,0.6)' },
  title:     { color:'#C9A84C', fontFamily:"'Georgia',serif", fontSize:24, letterSpacing:4, margin:0 },
  subtitle:  { color:'#475569', fontSize:12, letterSpacing:3, marginTop:4 },
  button:    { width:'100%', padding:'12px', background:'linear-gradient(135deg,#C9A84C,#F5D87A)', color:'#1a1200', border:'none', borderRadius:8, fontSize:15, fontWeight:700, cursor:'pointer', transition:'opacity 0.2s' },
  error:     { background:'rgba(248,113,113,0.1)', border:'1px solid rgba(248,113,113,0.3)', color:'#f87171', padding:'10px 16px', borderRadius:8, fontSize:13 },
};