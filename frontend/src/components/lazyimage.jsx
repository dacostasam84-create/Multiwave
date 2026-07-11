// ─────────────────────────────────────────────
// LazyImage.jsx — Multiwave Lazy Image Loading
// Auteur : Zahnouni Issam
// ─────────────────────────────────────────────
import React, { useState, useEffect, useRef } from 'react';

// ─────────────────────────────────────────────
// LAZY IMAGE COMPONENT
// ─────────────────────────────────────────────
// Props:
//   src         — URL de l'image
//   alt         — texte alternatif
//   width       — largeur (défaut: '100%')
//   height      — hauteur (défaut: 200)
//   radius      — border-radius (défaut: 0)
//   objectFit   — cover | contain | fill (défaut: 'cover')
//   placeholder — emoji ou texte si pas d'image
//   fallback    — URL image de fallback si erreur
//   onClick     — callback au clic
//   style       — styles additionnels
//   className   — classe CSS
// ─────────────────────────────────────────────
export default function LazyImage({
  src,
  alt = '',
  width = '100%',
  height = 200,
  radius = 0,
  objectFit = 'cover',
  placeholder = '🖼️',
  fallback = null,
  onClick,
  style = {},
  showSkeleton = true,
}) {
  const [loaded,  setLoaded]  = useState(false);
  const [error,   setError]   = useState(false);
  const [visible, setVisible] = useState(false);
  const imgRef  = useRef(null);
  const wrapRef = useRef(null);

  // IntersectionObserver — charge l'image seulement quand visible
  useEffect(() => {
    if (!wrapRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin:'200px', threshold:0.01 }
    );

    observer.observe(wrapRef.current);
    return () => observer.disconnect();
  }, []);

  // Reset si src change
  useEffect(() => {
    setLoaded(false);
    setError(false);
  }, [src]);

  const handleLoad  = () => setLoaded(true);
  const handleError = () => {
    setError(true);
    setLoaded(true);
  };

  const wrapStyle = {
    position:'relative',
    width, height,
    borderRadius:radius,
    overflow:'hidden',
    background:'#0a0a0f',
    flexShrink:0,
    cursor: onClick ? 'pointer' : 'default',
    ...style,
  };

  return (
    <div ref={wrapRef} style={wrapStyle} onClick={onClick}>

      {/* Skeleton shimmer — affiché pendant le chargement */}
      {showSkeleton && !loaded && (
        <div style={{
          position:'absolute', inset:0,
          background:'linear-gradient(90deg,#1e1e2e 25%,#2a2a3e 50%,#1e1e2e 75%)',
          backgroundSize:'200% 100%',
          animation:'lazyShimmer 1.5s ease-in-out infinite',
          zIndex:1,
        }}/>
      )}

      {/* Image réelle */}
      {visible && src && !error && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            width:'100%', height:'100%',
            objectFit,
            display:'block',
            opacity: loaded ? 1 : 0,
            transition:'opacity 0.3s ease',
            position:'absolute', inset:0,
            zIndex:2,
          }}
        />
      )}

      {/* Fallback image si erreur */}
      {error && fallback && (
        <img
          src={fallback}
          alt={alt}
          style={{ width:'100%', height:'100%', objectFit, display:'block', position:'absolute', inset:0, zIndex:2 }}
        />
      )}

      {/* Placeholder si pas d'image ou erreur sans fallback */}
      {(!src || (error && !fallback)) && loaded !== false && (
        <div style={{
          position:'absolute', inset:0, zIndex:2,
          display:'flex', alignItems:'center', justifyContent:'center',
          background:'#13131a',
          color:'#334155', fontSize: typeof height === 'number' ? Math.min(height/3, 48) : 32,
        }}>
          {placeholder}
        </div>
      )}

      <style>{`
        @keyframes lazyShimmer {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────
// LAZY AVATAR
// ─────────────────────────────────────────────
export function LazyAvatar({ src, username, size = 40, style = {} }) {
  const initials = username ? username.slice(0,2).toUpperCase() : '??';
  const [loaded, setLoaded]  = useState(false);
  const [error,  setError]   = useState(false);

  return (
    <div style={{
      width:size, height:size, borderRadius:'50%',
      background:'linear-gradient(135deg,#C9A84C,#F5D87A)',
      display:'flex', alignItems:'center', justifyContent:'center',
      fontSize:size*0.35, fontWeight:700, color:'#1a1200',
      overflow:'hidden', flexShrink:0, position:'relative',
      ...style,
    }}>
      {/* Initiales (fallback) */}
      {(!src || error) && (
        <span style={{ position:'absolute', zIndex:1 }}>{initials}</span>
      )}
      {/* Photo */}
      {src && !error && (
        <img
          src={src}
          alt={username}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          style={{
            width:'100%', height:'100%', objectFit:'cover',
            position:'absolute', inset:0, zIndex:2,
            opacity: loaded ? 1 : 0,
            transition:'opacity 0.2s',
          }}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// LAZY BACKGROUND
// ─────────────────────────────────────────────
export function LazyBackground({ src, children, style = {}, radius = 0 }) {
  const [loaded,  setLoaded]  = useState(false);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { rootMargin:'200px' }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || !src) return;
    const img = new Image();
    img.onload  = () => setLoaded(true);
    img.onerror = () => setLoaded(true);
    img.src = src;
  }, [visible, src]);

  return (
    <div ref={ref} style={{
      position:'relative', overflow:'hidden', borderRadius:radius,
      backgroundImage: loaded ? `url(${src})` : 'none',
      backgroundSize:'cover', backgroundPosition:'center',
      transition:'background-image 0.3s ease',
      ...style,
    }}>
      {/* Shimmer pendant chargement */}
      {!loaded && (
        <div style={{
          position:'absolute', inset:0,
          background:'linear-gradient(90deg,#1e1e2e 25%,#2a2a3e 50%,#1e1e2e 75%)',
          backgroundSize:'200% 100%',
          animation:'lazyShimmer 1.5s ease-in-out infinite',
        }}/>
      )}
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────
// LAZY IMAGE GRID
// ─────────────────────────────────────────────
export function LazyImageGrid({ images = [], columns = 3, gap = 3, height = 120, onImageClick }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:`repeat(${columns},1fr)`, gap }}>
      {images.map((img, i) => (
        <LazyImage
          key={i}
          src={typeof img === 'string' ? img : img.url}
          alt={typeof img === 'object' ? img.alt : ''}
          height={height}
          radius={0}
          onClick={() => onImageClick && onImageClick(img, i)}
          style={{ cursor: onImageClick ? 'pointer' : 'default' }}
        />
      ))}
    </div>
  );
}