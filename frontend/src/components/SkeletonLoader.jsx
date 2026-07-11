// ─────────────────────────────────────────────
// SkeletonLoader.jsx — Multiwave Skeleton Loaders
// Auteur : Zahnouni Issam
// ─────────────────────────────────────────────
import React from 'react';

// ─────────────────────────────────────────────
// BASE SKELETON BLOCK
// ─────────────────────────────────────────────
function Sk({ w = '100%', h = 16, radius = 8, style = {} }) {
  return (
    <div style={{
      width: w, height: h,
      borderRadius: radius,
      background: 'linear-gradient(90deg, #1e1e2e 25%, #2a2a3e 50%, #1e1e2e 75%)',
      backgroundSize: '200% 100%',
      animation: 'skeletonShimmer 1.5s ease-in-out infinite',
      flexShrink: 0,
      ...style,
    }}/>
  );
}

// ─────────────────────────────────────────────
// SKELETON — POST CARD (Feed)
// ─────────────────────────────────────────────
export function SkeletonPost() {
  return (
    <div style={card}>
      {/* Header */}
      <div style={{ display:'flex', gap:12, alignItems:'center', marginBottom:14 }}>
        <Sk w={42} h={42} radius={21}/>
        <div style={{ flex:1, display:'flex', flexDirection:'column', gap:7 }}>
          <Sk w="40%" h={13}/>
          <Sk w="25%" h={10}/>
        </div>
      </div>
      {/* Content */}
      <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:14 }}>
        <Sk w="100%" h={13}/>
        <Sk w="90%"  h={13}/>
        <Sk w="70%"  h={13}/>
      </div>
      {/* Image placeholder */}
      <Sk w="100%" h={180} radius={10} style={{ marginBottom:14 }}/>
      {/* Actions */}
      <div style={{ display:'flex', gap:10 }}>
        <Sk w="30%" h={32} radius={8}/>
        <Sk w="30%" h={32} radius={8}/>
        <Sk w="30%" h={32} radius={8}/>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SKELETON — PRODUCT CARD (Marketplace)
// ─────────────────────────────────────────────
export function SkeletonProduct() {
  return (
    <div style={card}>
      <Sk w="100%" h={180} radius={0} style={{ marginBottom:14 }}/>
      <div style={{ padding:'0 14px 14px', display:'flex', flexDirection:'column', gap:10 }}>
        <Sk w="80%" h={14}/>
        <Sk w="50%" h={11}/>
        <div style={{ display:'flex', gap:8 }}>
          <Sk w={60} h={11}/>
          <Sk w={60} h={11}/>
        </div>
        <Sk w="40%" h={20}/>
        <Sk w="100%" h={36} radius={8}/>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SKELETON — CHANNEL / GROUP CARD
// ─────────────────────────────────────────────
export function SkeletonCard() {
  return (
    <div style={card}>
      <Sk w="100%" h={90} radius={0} style={{ marginBottom:14 }}/>
      <div style={{ padding:'0 16px 16px', display:'flex', flexDirection:'column', gap:10 }}>
        <div style={{ display:'flex', justifyContent:'space-between' }}>
          <Sk w="60%" h={14}/>
          <Sk w={60} h={20} radius={10}/>
        </div>
        <Sk w="90%" h={11}/>
        <Sk w="70%" h={11}/>
        <div style={{ display:'flex', gap:10 }}>
          <Sk w={80} h={11}/>
          <Sk w={80} h={11}/>
        </div>
        <Sk w="100%" h={36} radius={8}/>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SKELETON — CONVERSATION (Messages / WhatsApp)
// ─────────────────────────────────────────────
export function SkeletonConversation() {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px' }}>
      <Sk w={42} h={42} radius={21}/>
      <div style={{ flex:1, display:'flex', flexDirection:'column', gap:7 }}>
        <div style={{ display:'flex', justifyContent:'space-between' }}>
          <Sk w="45%" h={13}/>
          <Sk w={30} h={10}/>
        </div>
        <Sk w="70%" h={11}/>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SKELETON — MESSAGE BUBBLE
// ─────────────────────────────────────────────
export function SkeletonMessage({ isMine = false }) {
  return (
    <div style={{ display:'flex', justifyContent: isMine ? 'flex-end' : 'flex-start', marginBottom:8 }}>
      {!isMine && <Sk w={32} h={32} radius={16} style={{ marginRight:8, flexShrink:0 }}/>}
      <div style={{ display:'flex', flexDirection:'column', gap:4, alignItems: isMine ? 'flex-end' : 'flex-start' }}>
        <Sk w={180 + Math.random()*60} h={40} radius={12}/>
        <Sk w={50} h={9}/>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SKELETON — NOTIFICATION ITEM
// ─────────────────────────────────────────────
export function SkeletonNotification() {
  return (
    <div style={{ display:'flex', alignItems:'flex-start', gap:10, padding:'12px 16px' }}>
      <Sk w={36} h={36} radius={18}/>
      <div style={{ flex:1, display:'flex', flexDirection:'column', gap:7 }}>
        <Sk w="80%" h={12}/>
        <Sk w="50%" h={10}/>
      </div>
      <Sk w={8} h={8} radius={4}/>
    </div>
  );
}

// ─────────────────────────────────────────────
// SKELETON — USER ROW (Suggestions)
// ─────────────────────────────────────────────
export function SkeletonUser() {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
      <Sk w={38} h={38} radius={19}/>
      <div style={{ flex:1, display:'flex', flexDirection:'column', gap:6 }}>
        <Sk w="50%" h={12}/>
        <Sk w="35%" h={10}/>
      </div>
      <Sk w={70} h={28} radius={20}/>
    </div>
  );
}

// ─────────────────────────────────────────────
// SKELETON — JOB CARD
// ─────────────────────────────────────────────
export function SkeletonJob() {
  return (
    <div style={card}>
      <div style={{ padding:18, display:'flex', flexDirection:'column', gap:10 }}>
        <div style={{ display:'flex', justifyContent:'space-between' }}>
          <Sk w={40} h={40} radius={10}/>
          <Sk w={80} h={20} radius={10}/>
        </div>
        <Sk w="70%" h={14}/>
        <Sk w="45%" h={11}/>
        <Sk w="35%" h={11}/>
        <div style={{ display:'flex', gap:6 }}>
          <Sk w={50} h={20} radius={4}/>
          <Sk w={50} h={20} radius={4}/>
          <Sk w={50} h={20} radius={4}/>
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <Sk w="40%" h={16}/>
          <Sk w={90} h={32} radius={7}/>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SKELETON — STAT CARD (Analytics)
// ─────────────────────────────────────────────
export function SkeletonStat() {
  return (
    <div style={card}>
      <div style={{ padding:20, display:'flex', flexDirection:'column', gap:10 }}>
        <Sk w={32} h={32} radius={8}/>
        <Sk w="60%" h={26}/>
        <Sk w="80%" h={13}/>
        <Sk w="50%" h={10}/>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SKELETON — MEDIA CARD
// ─────────────────────────────────────────────
export function SkeletonMedia() {
  return (
    <div style={card}>
      <Sk w="100%" h={140} radius={0}/>
      <div style={{ padding:'10px 12px', display:'flex', flexDirection:'column', gap:7 }}>
        <Sk w="85%" h={12}/>
        <div style={{ display:'flex', justifyContent:'space-between' }}>
          <Sk w="35%" h={10}/>
          <Sk w="25%" h={10}/>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SKELETON — PROFILE
// ─────────────────────────────────────────────
export function SkeletonProfile() {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
      {/* Cover */}
      <Sk w="100%" h={200} radius={14}/>
      {/* Avatar + infos */}
      <div style={card}>
        <div style={{ padding:20 }}>
          <div style={{ display:'flex', gap:16, alignItems:'flex-end', marginBottom:16 }}>
            <Sk w={90} h={90} radius={45}/>
            <div style={{ flex:1, display:'flex', flexDirection:'column', gap:8, paddingBottom:8 }}>
              <Sk w="50%" h={20}/>
              <Sk w="35%" h={13}/>
              <Sk w="70%" h={11}/>
            </div>
            <Sk w={120} h={36} radius={8}/>
          </div>
          {/* Stats */}
          <div style={{ display:'flex', gap:20 }}>
            {[1,2,3].map(i => (
              <div key={i} style={{ display:'flex', flexDirection:'column', gap:6, alignItems:'center' }}>
                <Sk w={40} h={18}/>
                <Sk w={60} h={10}/>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Posts grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:3 }}>
        {[...Array(6)].map((_,i) => <Sk key={i} w="100%" h={120} radius={0}/>)}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SKELETON — TABLE ROW
// ─────────────────────────────────────────────
export function SkeletonTableRow({ cols = 4 }) {
  return (
    <tr>
      {[...Array(cols)].map((_,i) => (
        <td key={i} style={{ padding:'12px' }}>
          <Sk w={i===0?120:i===cols-1?50:'80%'} h={12}/>
        </td>
      ))}
    </tr>
  );
}

// ─────────────────────────────────────────────
// SKELETON — FEED PAGE (liste de posts)
// ─────────────────────────────────────────────
export function SkeletonFeedPage({ count = 3 }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
      {[...Array(count)].map((_,i) => <SkeletonPost key={i}/>)}
    </div>
  );
}

// ─────────────────────────────────────────────
// SKELETON — GRID (Marketplace, Channels, Groups)
// ─────────────────────────────────────────────
export function SkeletonGrid({ count = 6, type = 'card' }) {
  const components = {
    card:    SkeletonCard,
    product: SkeletonProduct,
    job:     SkeletonJob,
    media:   SkeletonMedia,
    stat:    SkeletonStat,
  };
  const Component = components[type] || SkeletonCard;
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:16 }}>
      {[...Array(count)].map((_,i) => <Component key={i}/>)}
    </div>
  );
}

// ─────────────────────────────────────────────
// SKELETON — SIDEBAR CONVERSATIONS
// ─────────────────────────────────────────────
export function SkeletonSidebar({ count = 5 }) {
  return (
    <div style={{ display:'flex', flexDirection:'column' }}>
      {[...Array(count)].map((_,i) => <SkeletonConversation key={i}/>)}
    </div>
  );
}

// ─────────────────────────────────────────────
// SHARED CARD STYLE
// ─────────────────────────────────────────────
const card = {
  background:'#13131a',
  border:'1px solid #1e1e2e',
  borderRadius:14,
  overflow:'hidden',
};

// ─────────────────────────────────────────────
// GLOBAL STYLE (à injecter une fois)
// ─────────────────────────────────────────────
export function SkeletonStyle() {
  return (
    <style>{`
      @keyframes skeletonShimmer {
        0%   { background-position: 200% center; }
        100% { background-position: -200% center; }
      }
    `}</style>
  );
}

// ─────────────────────────────────────────────
// DEFAULT EXPORT — composant générique
// ─────────────────────────────────────────────
export default function SkeletonLoader({ type = 'card', count = 3 }) {
  return (
    <>
      <SkeletonStyle/>
      <SkeletonGrid count={count} type={type}/>
    </>
  );
}