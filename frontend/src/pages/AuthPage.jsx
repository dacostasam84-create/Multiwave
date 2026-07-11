// ─────────────────────────────────────────────
// AuthPage.jsx — Multiwave Auth Router
// Auteur : Zahnouni Issam
// ─────────────────────────────────────────────
import React, { useState } from 'react';
import Login    from './Login';
import Register from './Register';

export default function AuthPage() {
  const [page, setPage] = useState('login');

  if (page === 'register') {
    return <Register onSwitchToLogin={() => setPage('login')}/>;
  }

  return <Login onSwitchToRegister={() => setPage('register')}/>;
}