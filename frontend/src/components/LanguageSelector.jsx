import { useState } from "react";

const LANGUAGES = [
  { code: "fr", name: "Francais", flag: "🇫🇷" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "ar", name: "Arabe", flag: "🌍" },
  { code: "ar-MA", name: "Darija (Maroc)", flag: "🇲🇦" },
  { code: "ar-SA", name: "Arabe (Arabie Saoudite)", flag: "🇸🇦" },
  { code: "es", name: "Espanol", flag: "🇪🇸" },
  { code: "pt", name: "Portugues", flag: "🇵🇹" },
  { code: "ru", name: "Russe", flag: "🇷🇺" },
  { code: "ja", name: "Japonais", flag: "🇯🇵" },
  { code: "zh", name: "Chinois", flag: "🇨🇳" },
  { code: "hi", name: "Hindi", flag: "🇮🇳" },
  { code: "he", name: "Hebreu", flag: "🇮🇱" },
  { code: "tr", name: "Turc", flag: "🇹🇷" },
  { code: "no", name: "Norvegien", flag: "🇳🇴" },
  { code: "sv", name: "Suedois", flag: "🇸🇪" },
  { code: "da", name: "Danois", flag: "🇩🇰" },
  { code: "fi", name: "Finnois", flag: "🇫🇮" },
  { code: "de", name: "Allemand", flag: "🇩🇪" },
  { code: "it", name: "Italien", flag: "🇮🇹" },
  { code: "ko", name: "Coreen", flag: "🇰🇷" },
  { code: "nl", name: "Neerlandais", flag: "🇳🇱" },
  { code: "pl", name: "Polonais", flag: "🇵🇱" },
  { code: "el", name: "Grec", flag: "🇬🇷" },
];

export default function LanguageSelector({ value = "fr", onChange }) {
  const [open, setOpen] = useState(false);
  const selected = LANGUAGES.find(l => l.code === value) || LANGUAGES[0];

  return (
    <div style={{ position: "relative", width: "220px", fontFamily: "'Segoe UI', sans-serif" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#1a1a2e",
          color: "#fff",
          border: "1px solid #3a3a5c",
          borderRadius: "12px",
          cursor: "pointer",
          fontSize: "15px",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "22px" }}>{selected.flag}</span>
          <span>{selected.name}</span>
        </span>
        <span style={{ fontSize: "12px", opacity: 0.6 }}>{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div style={{
          position: "absolute",
          top: "110%",
          left: 0,
          right: 0,
          background: "#1a1a2e",
          border: "1px solid #3a3a5c",
          borderRadius: "12px",
          maxHeight: "280px",
          overflowY: "auto",
          zIndex: 1000,
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        }}>
          {LANGUAGES.map(lang => (
            <div
              key={lang.code}
              onClick={() => { onChange(lang.code); setOpen(false); }}
              style={{
                padding: "10px 16px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                cursor: "pointer",
                background: lang.code === value ? "#2a2a4e" : "transparent",
                color: "#fff",
                fontSize: "14px",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#2a2a4e"}
              onMouseLeave={e => e.currentTarget.style.background = lang.code === value ? "#2a2a4e" : "transparent"}
            >
              <span style={{ fontSize: "20px" }}>{lang.flag}</span>
              <span>{lang.name}</span>
              <span style={{ marginLeft: "auto", opacity: 0.4, fontSize: "12px" }}>{lang.code.toUpperCase()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}