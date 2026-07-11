// ─────────────────────────────────────────────
// AvatarUpload.jsx — Multiwave Avatar Upload
// Auteur : Zahnouni Issam
// ─────────────────────────────────────────────
import React, { useState, useRef } from 'react';
import api from '../services/api';

export default function AvatarUpload({ userId, currentAvatar, username, onUpload }) {
  const [preview,    setPreview]    = useState(currentAvatar || null);
  const [uploading,  setUploading]  = useState(false);
  const [error,      setError]      = useState('');
  const [success,    setSuccess]    = useState(false);
  const [dragging,   setDragging]   = useState(false);
  const inputRef = useRef(null);

  const initials = username ? username.slice(0, 2).toUpperCase() : '??';

  const handleFile = async (file) => {
    if (!file) return;

    // Vérifications
    if (!file.type.startsWith('image/')) {
      setError('Seules les images sont acceptées (JPG, PNG, GIF...)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image trop lourde (max 5MB)');
      return;
    }

    // Preview local
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    // Upload
    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('user_id', userId);

      const res = await api.post('/uploads/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const avatarUrl = res.data?.url || res.data?.data?.path || preview;

      // Mettre à jour le profil
      await api.put(`/users/${userId}`, { avatar: avatarUrl });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      onUpload && onUpload(avatarUrl);
    } catch (err) {
      setError('Erreur lors de l\'upload. Réessayez.');
      setPreview(currentAvatar || null);
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e) => handleFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleRemove = async () => {
    try {
      await api.put(`/users/${userId}`, { avatar: null });
      setPreview(null);
      onUpload && onUpload(null);
    } catch {}
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:16 }}>

      {/* Zone drag & drop */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        style={{
          position:'relative', cursor:'pointer',
          width:120, height:120, borderRadius:'50%',
          border: `3px solid ${dragging ? '#C9A84C' : 'rgba(201,168,76,0.3)'}`,
          boxShadow: dragging ? '0 0 20px rgba(201,168,76,0.4)' : 'none',
          transition:'all 0.2s',
          overflow:'hidden',
          background:'linear-gradient(135deg,#C9A84C,#F5D87A)',
          display:'flex', alignItems:'center', justifyContent:'center',
        }}
      >
        {/* Avatar ou initiales */}
        {preview ? (
          <img src={preview} alt="avatar" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
        ) : (
          <span style={{ fontSize:36, fontWeight:700, color:'#1a1200' }}>{initials}</span>
        )}

        {/* Overlay hover */}
        <div style={{
          position:'absolute', inset:0,
          background:'rgba(0,0,0,0.5)',
          display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
          opacity: uploading ? 1 : 0,
          transition:'opacity 0.2s',
        }}
          onMouseEnter={e => !uploading && (e.currentTarget.style.opacity = 1)}
          onMouseLeave={e => !uploading && (e.currentTarget.style.opacity = 0)}
        >
          {uploading ? (
            <div style={{ color:'#fff', fontSize:12 }}>⏳ Upload...</div>
          ) : (
            <>
              <span style={{ fontSize:24 }}>📷</span>
              <span style={{ color:'#fff', fontSize:11, marginTop:4 }}>Changer</span>
            </>
          )}
        </div>
      </div>

      {/* Input caché */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display:'none' }}
        onChange={handleChange}
      />

      {/* Boutons */}
      <div style={{ display:'flex', gap:8 }}>
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          style={{
            background:'linear-gradient(135deg,#C9A84C,#F5D87A)',
            color:'#1a1200', border:'none',
            padding:'7px 16px', borderRadius:8,
            fontWeight:700, cursor:'pointer', fontSize:12,
            opacity: uploading ? 0.6 : 1,
          }}
        >
          {uploading ? '⏳ Upload...' : '📷 Changer'}
        </button>

        {preview && (
          <button
            onClick={handleRemove}
            style={{
              background:'rgba(248,113,113,0.1)',
              border:'1px solid rgba(248,113,113,0.3)',
              color:'#f87171', padding:'7px 16px',
              borderRadius:8, cursor:'pointer', fontSize:12,
            }}
          >
            🗑️ Supprimer
          </button>
        )}
      </div>

      {/* Messages */}
      {error && (
        <div style={{ color:'#f87171', fontSize:12, textAlign:'center', maxWidth:200 }}>
          ⚠️ {error}
        </div>
      )}
      {success && (
        <div style={{ color:'#4ade80', fontSize:12 }}>
          ✅ Avatar mis à jour !
        </div>
      )}

      <div style={{ color:'#475569', fontSize:11, textAlign:'center' }}>
        JPG, PNG, GIF · Max 5MB
        <br/>Glissez-déposez ou cliquez
      </div>
    </div>
  );
}