// ─────────────────────────────────────────────
// LikeButton.jsx — Multiwave Like Component
// Auteur : Zahnouni Issam
// ─────────────────────────────────────────────
import React, { useState, useEffect } from 'react';
import api from '../services/api';

// ─────────────────────────────────────────────
// LIKE BUTTON
// ─────────────────────────────────────────────
// Props:
//   userId       — ID de l'utilisateur connecté
//   targetId     — ID du post / vidéo / comment
//   targetType   — 'post' | 'video' | 'comment'
//   initialCount — nombre de likes initial
//   initialLiked — booléen si déjà liké
//   socket       — instance Socket.IO (optionnel)
//   size         — 'sm' | 'md' | 'lg' (défaut: 'md')
//   showCount    — afficher le compteur (défaut: true)
//   onLike       — callback (liked, count)
// ─────────────────────────────────────────────
export default function LikeButton({
  userId,
  targetId,
  targetType = 'post',
  initialCount = 0,
  initialLiked = false,
  socket,
  size = 'md',
  showCount = true,
  onLike,
}) {
  const [liked,     setLiked]     = useState(initialLiked);
  const [count,     setCount]     = useState(initialCount);
  const [animating, setAnimating] = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [particles, setParticles] = useState([]);

  // Sync props externes
  useEffect(() => { setLiked(initialLiked); },  [initialLiked]);
  useEffect(() => { setCount(initialCount); },  [initialCount]);

  // Socket — like en temps réel
  useEffect(() => {
    if (!socket) return;
    socket.on('like-update', (data) => {
      if (data.target_id === targetId && data.target_type === targetType) {
        setCount(data.likes_count);
        if (data.user_id !== userId) {
          // Petit flash si quelqu'un d'autre like
          setAnimating(true);
          setTimeout(() => setAnimating(false), 400);
        }
      }
    });
    return () => socket.off('like-update');
  }, [socket, targetId, targetType, userId]);

  // Taille
  const sizes = {
    sm: { fontSize:14, padding:'4px 8px',  gap:4,  countSize:11 },
    md: { fontSize:18, padding:'6px 14px', gap:6,  countSize:13 },
    lg: { fontSize:24, padding:'8px 18px', gap:8,  countSize:16 },
  };
  const sz = sizes[size] || sizes.md;

  const handleLike = async () => {
    if (loading) return;

    const nextLiked = !liked;
    const nextCount = nextLiked ? count + 1 : Math.max(0, count - 1);

    // Optimistic update
    setLiked(nextLiked);
    setCount(nextCount);

    // Animation
    if (nextLiked) {
      setAnimating(true);
      spawnParticles();
      setTimeout(() => setAnimating(false), 600);
    }

    onLike && onLike(nextLiked, nextCount);

    setLoading(true);
    try {
      if (nextLiked) {
        await api.post('/likes', {
          user_id:     userId,
          target_id:   targetId,
          target_type: targetType,
        });
      } else {
        await api.delete('/likes', {
          data: {
            user_id:     userId,
            target_id:   targetId,
            target_type: targetType,
          },
        });
      }
      // Émet socket
      if (socket) {
        socket.emit('like', {
          user_id:     userId,
          target_id:   targetId,
          target_type: targetType,
          liked:       nextLiked,
          likes_count: nextCount,
        });
      }
    } catch {
      // Rollback si erreur
      setLiked(liked);
      setCount(count);
    } finally {
      setLoading(false);
    }
  };

  // Particules ❤️ qui s'envolent
  const spawnParticles = () => {
    const newParticles = [...Array(6)].map((_, i) => ({
      id:    Date.now() + i,
      angle: (i / 6) * 360,
      size:  8 + Math.random() * 8,
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 700);
  };

  const fmtCount = (n) => {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000)    return (n / 1000).toFixed(1) + 'k';
    return n?.toString() || '0';
  };

  return (
    <div style={{ position:'relative', display:'inline-flex' }}>

      {/* Particules */}
      {particles.map(p => (
        <div key={p.id} style={{
          position:'absolute',
          top:'50%', left:'50%',
          width:p.size, height:p.size,
          fontSize:p.size,
          pointerEvents:'none',
          zIndex:10,
          animation:'likeParticle 0.7s ease-out forwards',
          transformOrigin:'center',
          transform:`rotate(${p.angle}deg) translateY(-20px)`,
        }}>❤️</div>
      ))}

      {/* Bouton */}
      <button
        onClick={handleLike}
        disabled={loading}
        style={{
          display:'flex',
          alignItems:'center',
          gap:sz.gap,
          padding:sz.padding,
          borderRadius:8,
          border:`1px solid ${liked ? 'rgba(248,113,113,0.4)' : '#1e1e2e'}`,
          background: liked ? 'rgba(248,113,113,0.1)' : 'transparent',
          cursor: loading ? 'wait' : 'pointer',
          transition:'all 0.2s',
          outline:'none',
          userSelect:'none',
          transform: animating ? 'scale(1.2)' : 'scale(1)',
        }}
        onMouseEnter={e => {
          if (!liked) {
            e.currentTarget.style.background = 'rgba(248,113,113,0.06)';
            e.currentTarget.style.borderColor = 'rgba(248,113,113,0.2)';
          }
        }}
        onMouseLeave={e => {
          if (!liked) {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = '#1e1e2e';
          }
        }}
      >
        {/* Icône cœur */}
        <span style={{
          fontSize:sz.fontSize,
          display:'block',
          transform: animating && liked ? 'scale(1.3)' : 'scale(1)',
          transition:'transform 0.15s cubic-bezier(0.34,1.56,0.64,1)',
          filter: liked ? 'drop-shadow(0 0 4px rgba(248,113,113,0.6))' : 'none',
          lineHeight:1,
        }}>
          {liked ? '❤️' : '🤍'}
        </span>

        {/* Compteur */}
        {showCount && (
          <span style={{
            fontSize:sz.countSize,
            fontWeight:700,
            color: liked ? '#f87171' : '#64748b',
            transition:'color 0.2s',
            lineHeight:1,
            minWidth:16,
          }}>
            {fmtCount(count)}
          </span>
        )}
      </button>

      <style>{`
        @keyframes likeParticle {
          0%   { opacity:1; transform: rotate(var(--angle)) translateY(0px) scale(1); }
          100% { opacity:0; transform: rotate(var(--angle)) translateY(-30px) scale(0.3); }
        }
      `}</style>
    </div>
  );
}