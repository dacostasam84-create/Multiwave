// ─────────────────────────────────────────────
// useFormValidation.js — Multiwave Form Validation
// Auteur : Zahnouni Issam
// ─────────────────────────────────────────────
import React, { useState, useCallback } from 'react';

// ─────────────────────────────────────────────
// RÈGLES DE VALIDATION
// ─────────────────────────────────────────────
export const rules = {
  required: (val) =>
    !val || val.toString().trim() === '' ? 'Ce champ est requis' : null,

  email: (val) =>
    val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
      ? 'Email invalide'
      : null,

  minLength: (min) => (val) =>
    val && val.length < min ? `Minimum ${min} caractères` : null,

  maxLength: (max) => (val) =>
    val && val.length > max ? `Maximum ${max} caractères` : null,

  password: (val) => {
    if (!val) return null;
    if (val.length < 6) return 'Minimum 6 caractères';
    if (!/[A-Z]/.test(val)) return 'Au moins une majuscule';
    if (!/[0-9]/.test(val)) return 'Au moins un chiffre';
    return null;
  },

  passwordStrength: (val) => {
    if (!val) return { score: 0, label: '', color: '' };
    let score = 0;
    if (val.length >= 6)  score++;
    if (val.length >= 10) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    const levels = [
      { label: 'Très faible', color: '#f87171' },
      { label: 'Faible',      color: '#fb923c' },
      { label: 'Moyen',       color: '#fbbf24' },
      { label: 'Fort',        color: '#4ade80' },
      { label: 'Très fort',   color: '#C9A84C' },
    ];
    return { score, ...levels[Math.min(score, 4)] };
  },

  phone: (val) =>
    val && !/^[+]?[\d\s\-().]{7,15}$/.test(val)
      ? 'Numéro de téléphone invalide'
      : null,

  url: (val) =>
    val && !/^https?:\/\/.+/.test(val)
      ? 'URL invalide (doit commencer par http:// ou https://)'
      : null,

  username: (val) => {
    if (!val) return null;
    if (val.length < 3) return 'Minimum 3 caractères';
    if (val.length > 30) return 'Maximum 30 caractères';
    if (!/^[a-zA-Z0-9_]+$/.test(val)) return 'Lettres, chiffres et _ seulement';
    return null;
  },

  numeric: (val) =>
    val && isNaN(Number(val)) ? 'Doit être un nombre' : null,

  positive: (val) =>
    val && Number(val) <= 0 ? 'Doit être positif' : null,

  match: (otherVal, fieldName = 'champ') => (val) =>
    val !== otherVal ? `Ne correspond pas au ${fieldName}` : null,
};

// ─────────────────────────────────────────────
// HOOK useFormValidation
// ─────────────────────────────────────────────
export function useFormValidation(initialValues, validationRules) {
  const [values,  setValues]  = useState(initialValues);
  const [errors,  setErrors]  = useState({});
  const [touched, setTouched] = useState({});

  const validate = useCallback((vals = values) => {
    const newErrors = {};
    Object.entries(validationRules || {}).forEach(([field, fieldRules]) => {
      const fieldRulesArr = Array.isArray(fieldRules) ? fieldRules : [fieldRules];
      for (const rule of fieldRulesArr) {
        const error = rule(vals[field]);
        if (error) { newErrors[field] = error; break; }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values, validationRules]);

  const handleChange = useCallback((field, value) => {
    const newValues = { ...values, [field]: value };
    setValues(newValues);
    if (touched[field] && validationRules?.[field]) {
      const fieldRules = Array.isArray(validationRules[field])
        ? validationRules[field]
        : [validationRules[field]];
      for (const rule of fieldRules) {
        const error = rule(value);
        if (error) { setErrors(p => ({...p, [field]: error})); break; }
        else { setErrors(p => { const n={...p}; delete n[field]; return n; }); }
      }
    }
  }, [values, touched, validationRules]);

  const handleBlur = useCallback((field) => {
    setTouched(p => ({...p, [field]: true}));
    if (validationRules?.[field]) {
      const fieldRules = Array.isArray(validationRules[field])
        ? validationRules[field]
        : [validationRules[field]];
      for (const rule of fieldRules) {
        const error = rule(values[field]);
        if (error) { setErrors(p => ({...p, [field]: error})); break; }
        else { setErrors(p => { const n={...p}; delete n[field]; return n; }); }
      }
    }
  }, [values, validationRules]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return { values, errors, touched, handleChange, handleBlur, validate, reset, setValues };
}

// ─────────────────────────────────────────────
// COMPOSANT FormField
// ─────────────────────────────────────────────
export function FormField({
  label, name, type = 'text', value, error, touched,
  onChange, onBlur, placeholder, required, style = {}
}) {
  const hasError = touched && error;

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:4, ...style }}>
      {label && (
        <label style={{ color:'#64748b', fontSize:12, display:'flex', gap:4 }}>
          {label}
          {required && <span style={{ color:'#f87171' }}>*</span>}
        </label>
      )}
      <input
        type={type}
        value={value || ''}
        onChange={e => onChange(name, e.target.value)}
        onBlur={() => onBlur(name)}
        placeholder={placeholder}
        style={{
          background:'#0a0a0f',
          border: `1px solid ${hasError ? '#f87171' : value ? 'rgba(201,168,76,0.3)' : '#1e1e2e'}`,
          color:'#e2e8f0', padding:'10px 14px', borderRadius:8,
          fontSize:13, width:'100%', boxSizing:'border-box', outline:'none',
          transition:'border-color 0.2s',
        }}
      />
      {hasError && (
        <span style={{ color:'#f87171', fontSize:11 }}>⚠️ {error}</span>
      )}
      {!hasError && touched && value && (
        <span style={{ color:'#4ade80', fontSize:11 }}>✅ OK</span>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// COMPOSANT PasswordStrength
// ─────────────────────────────────────────────
export function PasswordStrength({ value }) {
  if (!value) return null;
  const strength = rules.passwordStrength(value);

  return (
    <div style={{ marginTop:6 }}>
      <div style={{ display:'flex', gap:4, marginBottom:4 }}>
        {[...Array(5)].map((_, i) => (
          <div key={i} style={{
            flex:1, height:3, borderRadius:2,
            background: i < strength.score ? strength.color : '#1e1e2e',
            transition:'background 0.2s',
          }}/>
        ))}
      </div>
      <span style={{ color: strength.color, fontSize:11 }}>
        {strength.label}
      </span>
    </div>
  );
}

export default useFormValidation;