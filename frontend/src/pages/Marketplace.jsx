// ─────────────────────────────────────────────
// Marketplace.jsx — Multiwave Marketplace
// Auteur : Zahnouni Issam
// ─────────────────────────────────────────────
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useTranslation } from '../i18n';

// ─────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────
const S = {
  container:  { display:'flex', flexDirection:'column', gap:18 },
  card:       { background:'#13131a', border:'1px solid #1e1e2e', borderRadius:14, overflow:'hidden' },
  badge:      { padding:'2px 8px', borderRadius:20, fontSize:10, fontWeight:700 },
  input:      { background:'#0a0a0f', border:'1px solid #1e1e2e', color:'#e2e8f0', padding:'9px 14px', borderRadius:8, fontSize:13, outline:'none', boxSizing:'border-box' },
  btn:        { border:'none', padding:'9px 20px', borderRadius:8, cursor:'pointer', fontSize:13, fontWeight:700 },
  filterBtn:  { background:'transparent', border:'1px solid #1e1e2e', color:'#64748b', padding:'5px 14px', borderRadius:20, cursor:'pointer', fontSize:12, fontWeight:600 },
  filterActive:{ background:'rgba(201,168,76,0.12)', border:'1px solid #C9A84C', color:'#C9A84C' },
  grid:       { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:16 },
  avatar:     { width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg,#C9A84C,#F5D87A)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:'#1a1200', flexShrink:0 },
  empty:      { color:'#475569', textAlign:'center', padding:'48px 24px', fontSize:14 },
  label:      { color:'#64748b', fontSize:12, marginBottom:4, display:'block' },
  field:      { display:'flex', flexDirection:'column', gap:4, marginBottom:14 },
  saveBtn:    { background:'linear-gradient(135deg,#C9A84C,#F5D87A)', color:'#1a1200', border:'none', padding:'10px 24px', borderRadius:8, fontWeight:700, cursor:'pointer', fontSize:13 },
  cancelBtn:  { background:'transparent', border:'1px solid #1e1e2e', color:'#64748b', padding:'10px 20px', borderRadius:8, cursor:'pointer', fontSize:13 },
};

const initials = (n) => n ? n.slice(0,2).toUpperCase() : '??';
const fmtPrice = (p, c='USD') => `${parseFloat(p).toLocaleString('fr-FR', {minimumFractionDigits:2})} ${c}`;

// ─────────────────────────────────────────────
// CONSTANTES
// ─────────────────────────────────────────────
const CATEGORIES = ['Électronique','Mode','Maison','Beauté','Sport','Alimentation','Auto','Livres','Digital','Autre'];
const CURRENCIES  = ['USD','EUR','MAD','GBP','CAD','AED','SAR','CNY','JPY','KRW','INR','BRL','RUB','TRY','MXN','SGD','HKD','CHF','SEK','NOK','DKK','ZAR','NGN','EGP','DZD','TND','SAR','QAR','KWD','BHD'];

// Locations mondiales par région
const WORLD_LOCATIONS = {
  '🌍 Afrique du Nord': [
    'Casablanca, Maroc','Rabat, Maroc','Marrakech, Maroc','Fès, Maroc','Tanger, Maroc',
    'Alger, Algérie','Oran, Algérie','Constantine, Algérie',
    'Tunis, Tunisie','Sfax, Tunisie','Sousse, Tunisie',
    'Le Caire, Égypte','Alexandrie, Égypte','Giza, Égypte',
    'Tripoli, Libye','Benghazi, Libye',
    'Khartoum, Soudan',
  ],
  '🌍 Afrique Sub-saharienne': [
    'Lagos, Nigeria','Abuja, Nigeria','Kano, Nigeria',
    'Nairobi, Kenya','Mombasa, Kenya',
    'Accra, Ghana','Kumasi, Ghana',
    'Dakar, Sénégal','Abidjan, Côte d\'Ivoire',
    'Johannesburg, Afrique du Sud','Le Cap, Afrique du Sud','Durban, Afrique du Sud',
    'Addis-Abeba, Éthiopie','Dar es Salaam, Tanzanie','Kampala, Ouganda',
    'Kinshasa, RDC','Douala, Cameroun','Lomé, Togo',
  ],
  '🕌 Moyen-Orient': [
    'Dubaï, Émirats Arabes Unis','Abu Dhabi, Émirats Arabes Unis','Sharjah, EAU',
    'Riyad, Arabie Saoudite','Djeddah, Arabie Saoudite','La Mecque, Arabie Saoudite',
    'Doha, Qatar','Manama, Bahreïn','Koweït City, Koweït',
    'Muscat, Oman','Amman, Jordanie','Beyrouth, Liban',
    'Bagdad, Irak','Téhéran, Iran','Tel Aviv, Israël',
    'Istanbul, Turquie','Ankara, Turquie','Izmir, Turquie',
  ],
  '🌏 Asie': [
    'Pékin, Chine','Shanghai, Chine','Shenzhen, Chine','Guangzhou, Chine','Hong Kong',
    'Tokyo, Japon','Osaka, Japon','Kyoto, Japon',
    'Séoul, Corée du Sud','Busan, Corée du Sud',
    'Mumbai, Inde','Delhi, Inde','Bangalore, Inde','Chennai, Inde','Kolkata, Inde',
    'Singapour','Kuala Lumpur, Malaisie','Jakarta, Indonésie','Bangkok, Thaïlande',
    'Manille, Philippines','Ho Chi Minh Ville, Vietnam','Hanoï, Vietnam',
    'Karachi, Pakistan','Lahore, Pakistan','Dhaka, Bangladesh',
    'Taipei, Taïwan','Colombo, Sri Lanka',
  ],
  '🇪🇺 Europe': [
    'Paris, France','Lyon, France','Marseille, France','Bordeaux, France','Toulouse, France',
    'Londres, Royaume-Uni','Manchester, Royaume-Uni','Birmingham, Royaume-Uni',
    'Berlin, Allemagne','Munich, Allemagne','Hambourg, Allemagne','Francfort, Allemagne',
    'Madrid, Espagne','Barcelone, Espagne','Valence, Espagne','Séville, Espagne',
    'Rome, Italie','Milan, Italie','Naples, Italie','Turin, Italie',
    'Amsterdam, Pays-Bas','Rotterdam, Pays-Bas',
    'Bruxelles, Belgique','Anvers, Belgique',
    'Zürich, Suisse','Genève, Suisse','Berne, Suisse',
    'Vienne, Autriche','Prague, Tchéquie','Varsovie, Pologne','Budapest, Hongrie',
    'Stockholm, Suède','Oslo, Norvège','Copenhague, Danemark','Helsinki, Finlande',
    'Lisbonne, Portugal','Porto, Portugal',
    'Athènes, Grèce','Bucarest, Roumanie','Sofia, Bulgarie',
    'Moscou, Russie','Saint-Pétersbourg, Russie',
  ],
  '🌎 Amériques': [
    'New York, USA','Los Angeles, USA','Chicago, USA','Houston, USA','Miami, USA',
    'San Francisco, USA','Seattle, USA','Boston, USA','Dallas, USA','Atlanta, USA',
    'Toronto, Canada','Montréal, Canada','Vancouver, Canada','Calgary, Canada',
    'Mexico, Mexique','Guadalajara, Mexique','Monterrey, Mexique',
    'São Paulo, Brésil','Rio de Janeiro, Brésil','Brasília, Brésil',
    'Buenos Aires, Argentine','Santiago, Chili','Lima, Pérou','Bogotá, Colombie',
    'Caracas, Venezuela','La Havane, Cuba','Panama City, Panama',
  ],
  '🌏 Océanie': [
    'Sydney, Australie','Melbourne, Australie','Brisbane, Australie','Perth, Australie',
    'Auckland, Nouvelle-Zélande','Wellington, Nouvelle-Zélande',
  ],
  '🌐 En ligne / Digital': [
    'En ligne (Mondial)','En ligne (Europe)','En ligne (Afrique)','En ligne (Asie)','En ligne (Amériques)',
  ],
};
const PAYMENT_METHODS = [
  { value:'card',   label:'💳 Carte bancaire' },
  { value:'paypal', label:'🅿️ PayPal' },
  { value:'wallet', label:'👛 Wallet Multiwave' },
  { value:'cash',   label:'💵 Cash' },
  { value:'crypto', label:'₿ Crypto' },
];


// Pays de livraison disponibles
const SHIPPING_COUNTRIES = {
  '🌍 Afrique du Nord':        ['Maroc','Algérie','Tunisie','Égypte','Libye','Soudan'],
  '🌍 Afrique Sub-saharienne': ['Nigeria','Kenya','Ghana','Sénégal',"Côte d'Ivoire",'Afrique du Sud','Cameroun','Éthiopie','Tanzanie','Ouganda','RDC','Togo'],
  '🕌 Moyen-Orient':           ['Émirats Arabes Unis','Arabie Saoudite','Qatar','Koweït','Bahreïn','Oman','Jordanie','Liban','Irak','Iran','Israël','Turquie'],
  '🇪🇺 Europe Ouest':          ['France','Allemagne','Espagne','Italie','Royaume-Uni','Belgique','Pays-Bas','Suisse','Portugal','Autriche','Grèce'],
  '🇪🇺 Europe Nord':           ['Suède','Norvège','Danemark','Finlande','Islande'],
  '🇪🇺 Europe Est':            ['Russie','Pologne','Tchéquie','Hongrie','Roumanie','Bulgarie','Ukraine','Serbie','Croatie'],
  '🌎 Amérique du Nord':       ['États-Unis','Canada','Mexique'],
  '🌎 Amérique Latine':        ['Brésil','Argentine','Colombie','Chili','Pérou','Venezuela','Uruguay','Équateur','Bolivie'],
  '🌎 Caraïbes':               ['Cuba','Jamaïque','Haïti','République Dominicaine','Porto Rico'],
  '🌏 Asie Est':               ['Chine','Japon','Corée du Sud','Hong Kong','Taïwan','Mongolie'],
  '🌏 Asie Sud':               ['Inde','Pakistan','Bangladesh','Sri Lanka','Népal'],
  '🌏 Asie Sud-Est':           ['Singapour','Malaisie','Indonésie','Thaïlande','Vietnam','Philippines','Myanmar'],
  '🌏 Asie Centrale':          ['Kazakhstan','Ouzbékistan','Azerbaïdjan','Géorgie','Arménie'],
  '🌏 Océanie':                ['Australie','Nouvelle-Zélande','Fidji','Papouasie'],
  '🌐 Mondial':                ['Livraison mondiale'],
};

// Taux de change approximatifs vers USD
const EXCHANGE_RATES = {
  USD:1, EUR:1.08, MAD:0.098, GBP:1.27, CAD:0.74, AED:0.272,
  SAR:0.267, CNY:0.138, JPY:0.0067, KRW:0.00075, INR:0.012,
  BRL:0.20, RUB:0.011, TRY:0.031, MXN:0.058, SGD:0.74,
  HKD:0.128, CHF:1.12, SEK:0.095, NOK:0.093, DKK:0.145,
  ZAR:0.053, NGN:0.00065, EGP:0.032, DZD:0.0074, TND:0.32,
  QAR:0.274, KWD:3.25, BHD:2.65,
};

// Frais de port par zone (en USD)
const SHIPPING_COSTS = {
  'Maroc':                  { standard:5,  express:15  },
  'Algérie':                { standard:8,  express:20  },
  'Tunisie':                { standard:8,  express:20  },
  'Égypte':                 { standard:10, express:25  },
  'France':                 { standard:12, express:30  },
  'Allemagne':              { standard:12, express:30  },
  'Espagne':                { standard:12, express:30  },
  'Italie':                 { standard:12, express:30  },
  'Royaume-Uni':            { standard:15, express:35  },
  'Émirats Arabes Unis':    { standard:20, express:45  },
  'Arabie Saoudite':        { standard:20, express:45  },
  'Qatar':                  { standard:20, express:45  },
  'États-Unis':             { standard:25, express:55  },
  'Canada':                 { standard:22, express:50  },
  'Chine':                  { standard:18, express:40  },
  'Japon':                  { standard:20, express:45  },
  'Inde':                   { standard:15, express:35  },
  'Livraison mondiale':     { standard:30, express:60  },
};

const convertPrice = (price, fromCurrency, toCurrency) => {
  if (fromCurrency === toCurrency) return price;
  const inUSD = price * (EXCHANGE_RATES[fromCurrency] || 1);
  return inUSD / (EXCHANGE_RATES[toCurrency] || 1);
};

const ORDER_STATUS_STYLES = {
  pending:    { color:'#fbbf24', bg:'rgba(251,191,36,0.1)',  border:'#fbbf24',  icon:'⏳' },
  confirmed:  { color:'#60a5fa', bg:'rgba(96,165,250,0.1)', border:'#60a5fa',  icon:'✅' },
  processing: { color:'#a78bfa', bg:'rgba(167,139,250,0.1)',border:'#a78bfa',  icon:'⚙️' },
  shipped:    { color:'#0ea5e9', bg:'rgba(14,165,233,0.1)', border:'#0ea5e9',  icon:'🚚' },
  delivered:  { color:'#4ade80', bg:'rgba(74,222,128,0.1)', border:'#4ade80',  icon:'📦' },
  completed:  { color:'#4ade80', bg:'rgba(74,222,128,0.1)', border:'#4ade80',  icon:'🎉' },
  cancelled:  { color:'#f87171', bg:'rgba(248,113,113,0.1)',border:'#f87171',  icon:'❌' },
  refunded:   { color:'#fb923c', bg:'rgba(251,146,60,0.1)', border:'#fb923c',  icon:'↩️' },
};

// ─────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────
const MOCK_PRODUCTS = [
  { id:1, user_id:2, shipping_countries:['Maroc','Algérie','Tunisie','France','Émirats Arabes Unis','Arabie Saoudite'], name:'iPhone 15 Pro Max 256GB', description:'Neuf, sous blister, garantie 1 an.', price:1199.00, compare_price:1399.00, stock:5, category:'Électronique', brand:'Apple', image_url:'https://picsum.photos/seed/iphone/400/300', rating:4.8, reviews_count:124, sales_count:89, is_digital:false, is_featured:true, currency:'USD', status:'active', location:'Casablanca', delivery_info:'Livraison 24h', seller:{ username:'tech_store_ma' } },
  { id:2, user_id:3, shipping_countries:['Livraison mondiale'], name:'Cours React & Node.js Complet', description:'Formation complète de 0 à expert, 40h de vidéo HD.', price:49.00, compare_price:120.00, stock:999, category:'Digital', brand:null, image_url:'https://picsum.photos/seed/react/400/300', rating:4.9, reviews_count:312, sales_count:1240, is_digital:true, is_featured:true, currency:'USD', status:'active', location:'En ligne', delivery_info:'Accès immédiat', seller:{ username:'dev_karim' } },
  { id:3, user_id:4, shipping_countries:['Maroc','France','Émirats Arabes Unis','Qatar'], name:'Caftan Marocain Brodé', description:'Caftan de luxe, broderie main, taille M/L.', price:2800.00, compare_price:null, stock:3, category:'Mode', brand:null, image_url:'https://picsum.photos/seed/caftan/400/300', rating:4.7, reviews_count:28, sales_count:15, is_digital:false, is_featured:false, currency:'MAD', status:'active', location:'Marrakech', delivery_info:'Livraison 48h', seller:{ username:'artisan_maroc' } },
  { id:4, user_id:5, shipping_countries:['France','Allemagne','Espagne','Italie','Royaume-Uni'], name:'Vélo VTT Carbon 29"', description:'Cadre carbone, Shimano 21 vitesses, freins hydrauliques.', price:3500.00, compare_price:4200.00, stock:2, category:'Sport', brand:'Trek', image_url:'https://picsum.photos/seed/bike/400/300', rating:4.6, reviews_count:19, sales_count:7, is_digital:false, is_featured:false, currency:'EUR', status:'active', location:'Paris', delivery_info:'Livraison 5-7j', seller:{ username:'sport_pro' } },
  { id:5, user_id:6, shipping_countries:['Livraison mondiale'], name:'Pack Design UI/UX 2026', description:'500+ composants Figma, templates, icônes premium.', price:29.00, compare_price:79.00, stock:999, category:'Digital', brand:null, image_url:'https://picsum.photos/seed/design/400/300', rating:4.8, reviews_count:87, sales_count:430, is_digital:true, is_featured:true, currency:'USD', status:'active', location:'En ligne', delivery_info:'Accès immédiat', seller:{ username:'laila_design' } },
  { id:6, user_id:7, name:'Huile d\'Argan Bio 100ml', description:'100% pure, pressée à froid, certifiée bio.', price:180.00, compare_price:220.00, stock:50, category:'Beauté', brand:'BioArgan', image_url:'https://picsum.photos/seed/argan/400/300', rating:4.9, reviews_count:203, sales_count:891, is_digital:false, is_featured:false, currency:'MAD', status:'active', location:'Agadir', delivery_info:'Livraison 3-5j', seller:{ username:'bio_maroc' } },
];

const MOCK_ORDERS = [
  { id:1, product_id:1, user_id:1, quantity:1, unit_price:1199.00, total_price:1199.00, discount:0, shipping_cost:0, status:'shipped', payment_method:'card', payment_status:'paid', tracking_number:'MW2026031301', estimated_delivery:'2026-03-15T00:00:00Z', created_at:'2026-03-13T08:00:00Z', product:{ name:'iPhone 15 Pro Max', image_url:'https://picsum.photos/seed/iphone/400/300', currency:'USD' } },
  { id:2, product_id:2, user_id:1, quantity:1, unit_price:49.00, total_price:49.00, discount:0, shipping_cost:0, status:'completed', payment_method:'paypal', payment_status:'paid', tracking_number:null, created_at:'2026-03-10T14:00:00Z', product:{ name:'Cours React & Node.js', image_url:'https://picsum.photos/seed/react/400/300', currency:'USD' } },
  { id:3, product_id:5, user_id:1, quantity:1, unit_price:29.00, total_price:29.00, discount:5, shipping_cost:0, status:'pending', payment_method:'wallet', payment_status:'unpaid', tracking_number:null, created_at:'2026-03-13T11:00:00Z', product:{ name:'Pack Design UI/UX 2026', image_url:'https://picsum.photos/seed/design/400/300', currency:'USD' } },
];

// ─────────────────────────────────────────────
// STARS RATING
// ─────────────────────────────────────────────
function Stars({ rating, size=12 }) {
  return (
    <span style={{ fontSize:size, letterSpacing:1 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= Math.round(rating) ? '#F5D87A' : '#334155' }}>★</span>
      ))}
    </span>
  );
}

// ─────────────────────────────────────────────
// PRODUCT CARD
// ─────────────────────────────────────────────
function ProductCard({ product, onBuy, onView }) {
  const { t } = useTranslation();
  const discount = product.compare_price
    ? Math.round((1 - product.price / product.compare_price) * 100)
    : null;

  return (
    <div style={{ ...S.card, display:'flex', flexDirection:'column', cursor:'pointer', transition:'transform 0.15s, border-color 0.15s' }}
      onClick={() => onView(product)}
      onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(201,168,76,0.3)'; e.currentTarget.style.transform='translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor='#1e1e2e'; e.currentTarget.style.transform='none'; }}
    >
      {/* Image */}
      <div style={{ position:'relative', height:180, overflow:'hidden', background:'#0a0a0f' }}>
        {product.image_url
          ? <img src={product.image_url} alt={product.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e=>e.target.style.display='none'}/>
          : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:48 }}>🛍️</div>
        }
        {/* Badges */}
        <div style={{ position:'absolute', top:8, left:8, display:'flex', gap:5, flexWrap:'wrap' }}>
          {product.is_featured && <span style={{ ...S.badge, background:'linear-gradient(135deg,#C9A84C,#F5D87A)', color:'#1a1200' }}>⭐ Vedette</span>}
          {discount && <span style={{ ...S.badge, background:'rgba(248,113,113,0.9)', color:'#fff' }}>-{discount}%</span>}
          {product.is_digital && <span style={{ ...S.badge, background:'rgba(167,139,250,0.9)', color:'#fff' }}>💻 Digital</span>}
          {product.shipping_countries?.includes('Livraison mondiale') && <span style={{ ...S.badge, background:'rgba(14,165,233,0.9)', color:'#fff' }}>🌍 International</span>}
        </div>
        {product.stock <= 3 && product.stock > 0 && (
          <div style={{ position:'absolute', bottom:8, right:8 }}>
            <span style={{ ...S.badge, background:'rgba(251,146,60,0.9)', color:'#fff' }}>⚠️ Plus que {product.stock}</span>
          </div>
        )}
        {product.status === 'sold_out' && (
          <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <span style={{ color:'#f87171', fontWeight:700, fontSize:16 }}>{t('sold_out')}</span>
          </div>
        )}
      </div>

      {/* Infos */}
      <div style={{ padding:14, flex:1, display:'flex', flexDirection:'column', gap:8 }}>
        <div>
          <div style={{ color:'#e2e8f0', fontWeight:700, fontSize:14, marginBottom:2, lineHeight:1.4 }}>{product.name}</div>
          {product.brand && <div style={{ color:'#475569', fontSize:11 }}>🏷️ {product.brand}</div>}
          {product.location && <div style={{ color:'#475569', fontSize:11 }}>📍 {product.location}</div>}
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          <Stars rating={product.rating}/>
          <span style={{ color:'#64748b', fontSize:11 }}>({product.reviews_count})</span>
          <span style={{ color:'#334155', fontSize:11 }}>· {product.sales_count} vendus</span>
        </div>

        <div style={{ display:'flex', alignItems:'baseline', gap:8 }}>
          <span style={{ color:'#C9A84C', fontWeight:800, fontSize:17 }}>{fmtPrice(product.price, product.currency)}</span>
          {product.compare_price && <span style={{ color:'#334155', fontSize:12, textDecoration:'line-through' }}>{fmtPrice(product.compare_price, product.currency)}</span>}
        </div>

        {product.delivery_info && <div style={{ color:'#4ade80', fontSize:11 }}>🚚 {product.delivery_info}</div>}

        <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:'auto', paddingTop:4 }}>
          <div style={S.avatar}>{initials(product.seller?.username||'?')}</div>
          <span style={{ color:'#64748b', fontSize:12 }}>{product.seller?.username}</span>
        </div>

        <button
          onClick={e => { e.stopPropagation(); onBuy(product); }}
          disabled={product.status === 'sold_out' || product.stock === 0}
          style={{
            ...S.saveBtn,
            width:'100%', marginTop:4,
            opacity: (product.status==='sold_out'||product.stock===0) ? 0.4 : 1,
            cursor: (product.status==='sold_out'||product.stock===0) ? 'not-allowed' : 'pointer',
          }}
        >
          🛒 {product.is_digital ? t('buy') : t('order')}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// PRODUCT DETAIL MODAL
// ─────────────────────────────────────────────
function ProductModal({ product, onClose, onBuy }) {
  const { t } = useTranslation();
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const images = product.images?.length ? product.images : [product.image_url].filter(Boolean);
  const discount = product.compare_price ? Math.round((1 - product.price / product.compare_price) * 100) : null;

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }} onClick={onClose}>
      <div style={{ background:'#13131a', border:'1px solid #1e1e2e', borderRadius:16, width:'100%', maxWidth:760, maxHeight:'90vh', overflow:'auto' }} onClick={e=>e.stopPropagation()}>

        <div style={{ display:'flex', gap:0, flexWrap:'wrap' }}>
          {/* Images */}
          <div style={{ flex:'0 0 320px', padding:20 }}>
            <div style={{ height:280, background:'#0a0a0f', borderRadius:12, overflow:'hidden', marginBottom:10 }}>
              {images[activeImg]
                ? <img src={images[activeImg]} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:64 }}>🛍️</div>
              }
            </div>
            {images.length > 1 && (
              <div style={{ display:'flex', gap:6 }}>
                {images.map((img,i) => (
                  <div key={i} onClick={() => setActiveImg(i)} style={{ width:52, height:52, borderRadius:6, overflow:'hidden', cursor:'pointer', border:`2px solid ${i===activeImg?'#C9A84C':'transparent'}` }}>
                    <img src={img} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Détails */}
          <div style={{ flex:1, padding:20, minWidth:280 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', gap:6, marginBottom:6, flexWrap:'wrap' }}>
                  {product.category && <span style={{ ...S.badge, background:'rgba(14,165,233,0.1)', border:'1px solid #0ea5e9', color:'#0ea5e9' }}>{product.category}</span>}
                  {product.is_digital && <span style={{ ...S.badge, background:'rgba(167,139,250,0.1)', border:'1px solid #a78bfa', color:'#a78bfa' }}>💻 Digital</span>}
                  {discount && <span style={{ ...S.badge, background:'rgba(248,113,113,0.1)', border:'1px solid #f87171', color:'#f87171' }}>-{discount}%</span>}
                </div>
                <h2 style={{ color:'#e2e8f0', fontSize:18, fontWeight:700, margin:'0 0 6px', lineHeight:1.4 }}>{product.name}</h2>
                {product.brand && <div style={{ color:'#64748b', fontSize:13 }}>🏷️ {product.brand}</div>}
              </div>
              <button onClick={onClose} style={{ background:'none', border:'none', color:'#64748b', cursor:'pointer', fontSize:22, padding:4 }}>✕</button>
            </div>

            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
              <Stars rating={product.rating} size={14}/>
              <span style={{ color:'#64748b', fontSize:12 }}>{product.rating} ({product.reviews_count} avis)</span>
              <span style={{ color:'#334155', fontSize:12 }}>· {product.sales_count} vendus</span>
            </div>

            <div style={{ display:'flex', alignItems:'baseline', gap:10, marginBottom:14 }}>
              <span style={{ color:'#C9A84C', fontWeight:800, fontSize:26 }}>{fmtPrice(product.price, product.currency)}</span>
              {product.compare_price && <span style={{ color:'#334155', fontSize:15, textDecoration:'line-through' }}>{fmtPrice(product.compare_price, product.currency)}</span>}
            </div>

            {product.description && (
              <div style={{ color:'#94a3b8', fontSize:13, lineHeight:1.7, marginBottom:14 }}>{product.description}</div>
            )}

            <div style={{ display:'flex', gap:14, flexWrap:'wrap', marginBottom:14 }}>
              {product.location   && <span style={{ color:'#64748b', fontSize:12 }}>📍 {product.location}</span>}
              {product.delivery_info && <span style={{ color:'#4ade80', fontSize:12 }}>🚚 {product.delivery_info}</span>}
              <span style={{ color: product.stock > 5 ? '#4ade80' : product.stock > 0 ? '#fbbf24' : '#f87171', fontSize:12 }}>
                📦 {product.stock > 0 ? `${product.stock} en stock` : 'Épuisé'}
              </span>
            </div>

            {/* Vendeur */}
            <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', background:'#0a0a0f', borderRadius:8, marginBottom:16 }}>
              <div style={S.avatar}>{initials(product.seller?.username||'?')}</div>
              <div>
                <div style={{ color:'#e2e8f0', fontSize:13, fontWeight:600 }}>{product.seller?.username}</div>
                <div style={{ color:'#475569', fontSize:11 }}>Vendeur vérifié ✅</div>
              </div>
            </div>

            {/* Quantité + Commander */}
            <div style={{ display:'flex', gap:10, alignItems:'center' }}>
              {!product.is_digital && (
                <div style={{ display:'flex', alignItems:'center', border:'1px solid #1e1e2e', borderRadius:8, overflow:'hidden' }}>
                  <button onClick={() => setQty(q => Math.max(1,q-1))} style={{ background:'#0a0a0f', border:'none', color:'#e2e8f0', padding:'9px 14px', cursor:'pointer', fontSize:16 }}>−</button>
                  <span style={{ color:'#e2e8f0', padding:'0 14px', fontSize:14, fontWeight:700 }}>{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.stock,q+1))} style={{ background:'#0a0a0f', border:'none', color:'#e2e8f0', padding:'9px 14px', cursor:'pointer', fontSize:16 }}>+</button>
                </div>
              )}
              <button
                onClick={() => onBuy(product, qty)}
                disabled={product.stock === 0 || product.status === 'sold_out'}
                style={{ ...S.saveBtn, flex:1, opacity: product.stock===0?0.4:1, cursor:product.stock===0?'not-allowed':'pointer' }}
              >
                🛒 {t('order')} · {fmtPrice(product.price * qty, product.currency)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// CHECKOUT MODAL
// ─────────────────────────────────────────────
function CheckoutModal({ product, qty=1, userId, onClose, onSuccess }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({ payment_method:'card', delivery_address:'', notes:'' });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1=infos, 2=confirmation

  const total = (product.price * qty + (product.is_digital ? 0 : 5)).toFixed(2);

  const handleOrder = async () => {
    setLoading(true);
    try {
      await api.post('/marketplace/orders', {
        user_id: userId, product_id: product.id,
        quantity: qty, unit_price: product.price,
        total_price: total, shipping_cost: product.is_digital ? 0 : 5,
        payment_method: form.payment_method,
        delivery_address: form.delivery_address,
        notes: form.notes,
      });
    } catch {}
    setStep(2);
    setLoading(false);
    setTimeout(() => { onSuccess && onSuccess(); onClose(); }, 2500);
  };

  if (step === 2) return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', zIndex:300, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ background:'#13131a', border:'1px solid rgba(74,222,128,0.3)', borderRadius:16, padding:40, textAlign:'center', maxWidth:360 }}>
        <div style={{ fontSize:60, marginBottom:16 }}>🎉</div>
        <div style={{ color:'#4ade80', fontSize:20, fontWeight:700, marginBottom:8 }}>Commande confirmée !</div>
        <div style={{ color:'#64748b', fontSize:13 }}>Votre commande a bien été enregistrée. Vous recevrez une confirmation sous peu.</div>
      </div>
    </div>
  );

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', zIndex:300, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }} onClick={onClose}>
      <div style={{ background:'#13131a', border:'1px solid #1e1e2e', borderRadius:16, padding:24, width:'100%', maxWidth:440 }} onClick={e=>e.stopPropagation()}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
          <span style={{ color:'#e2e8f0', fontWeight:700, fontSize:16 }}>🛒 Commander</span>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'#64748b', cursor:'pointer', fontSize:20 }}>✕</button>
        </div>

        {/* Récap produit */}
        <div style={{ background:'#0a0a0f', borderRadius:10, padding:'12px 14px', marginBottom:18, display:'flex', gap:12, alignItems:'center' }}>
          {product.image_url && <img src={product.image_url} alt="" style={{ width:52, height:52, borderRadius:8, objectFit:'cover' }}/>}
          <div style={{ flex:1 }}>
            <div style={{ color:'#e2e8f0', fontSize:13, fontWeight:600 }}>{product.name}</div>
            <div style={{ color:'#64748b', fontSize:12 }}>Qté: {qty} · {fmtPrice(product.price, product.currency)}/unité</div>
          </div>
          <div style={{ color:'#C9A84C', fontWeight:800, fontSize:16 }}>{fmtPrice(total, product.currency)}</div>
        </div>

        {/* Paiement */}
        <div style={S.field}>
          <label style={S.label}>Méthode de paiement</label>
          <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
            {PAYMENT_METHODS.map(m => (
              <button key={m.value} onClick={() => setForm(f=>({...f,payment_method:m.value}))} style={{
                ...S.filterBtn, ...(form.payment_method===m.value ? S.filterActive : {}), fontSize:11
              }}>{m.label}</button>
            ))}
          </div>
        </div>

        {/* Adresse livraison */}
        {!product.is_digital && (
          <div style={S.field}>
            <label style={S.label}>Adresse de livraison *</label>
            <textarea
              style={{ ...S.input, minHeight:70, resize:'vertical', width:'100%' }}
              placeholder="Rue, ville, code postal, pays..."
              value={form.delivery_address}
              onChange={e => setForm(f=>({...f,delivery_address:e.target.value}))}
            />
          </div>
        )}

        {/* Notes */}
        <div style={S.field}>
          <label style={S.label}>Notes (optionnel)</label>
          <input style={{ ...S.input, width:'100%' }} placeholder="Instructions spéciales..." value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))}/>
        </div>

        {/* Total */}
        <div style={{ background:'#0a0a0f', borderRadius:8, padding:'10px 14px', marginBottom:16 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
            <span style={{ color:'#64748b', fontSize:12 }}>Sous-total</span>
            <span style={{ color:'#94a3b8', fontSize:12 }}>{fmtPrice(product.price * qty, product.currency)}</span>
          </div>
          {!product.is_digital && (
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
              <span style={{ color:'#64748b', fontSize:12 }}>Livraison</span>
              <span style={{ color:'#94a3b8', fontSize:12 }}>{fmtPrice(5, product.currency)}</span>
            </div>
          )}
          <div style={{ display:'flex', justifyContent:'space-between', borderTop:'1px solid #1e1e2e', paddingTop:8, marginTop:4 }}>
            <span style={{ color:'#e2e8f0', fontSize:14, fontWeight:700 }}>Total</span>
            <span style={{ color:'#C9A84C', fontSize:16, fontWeight:800 }}>{fmtPrice(total, product.currency)}</span>
          </div>
        </div>

        <div style={{ display:'flex', gap:10 }}>
          <button style={S.cancelBtn} onClick={onClose}>Annuler</button>
          <button style={{ ...S.saveBtn, flex:1 }} onClick={handleOrder} disabled={loading || (!product.is_digital && !form.delivery_address.trim())}>
            {loading ? '...' : '✦ Confirmer la commande'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MES COMMANDES
// ─────────────────────────────────────────────
function MyOrders({ userId }) {
  const { t } = useTranslation();
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/marketplace/orders?user_id=${userId}`);
        setOrders(res.data?.data || res.data || []);
      } catch { setOrders(MOCK_ORDERS); }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <div style={S.empty}>{t('loading_products')}</div>;
  if (!orders.length) return (
    <div style={S.empty}>
      <div style={{ fontSize:48, marginBottom:12 }}>📦</div>
      <div style={{ color:'#e2e8f0', fontSize:16, fontWeight:600 }}>Aucune commande</div>
      <div style={{ color:'#475569', fontSize:13 }}>Vos achats apparaîtront ici.</div>
    </div>
  );

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
      {orders.map(order => {
        const ss = ORDER_STATUS_STYLES[order.status] || ORDER_STATUS_STYLES.pending;
        return (
          <div key={order.id} style={{ ...S.card, padding:16, display:'flex', gap:14, alignItems:'center', flexWrap:'wrap' }}>
            {order.product?.image_url && (
              <img src={order.product.image_url} alt="" style={{ width:60, height:60, borderRadius:8, objectFit:'cover', flexShrink:0 }}/>
            )}
            <div style={{ flex:1, minWidth:180 }}>
              <div style={{ color:'#e2e8f0', fontWeight:700, fontSize:14, marginBottom:2 }}>{order.product?.name || `Commande #${order.id}`}</div>
              <div style={{ color:'#64748b', fontSize:12 }}>Qté: {order.quantity} · {fmtPrice(order.total_price, order.product?.currency||'USD')}</div>
              {order.tracking_number && <div style={{ color:'#0ea5e9', fontSize:11, marginTop:2 }}>🚚 Tracking: {order.tracking_number}</div>}
              <div style={{ color:'#334155', fontSize:11, marginTop:2 }}>{new Date(order.created_at).toLocaleDateString('fr-FR')}</div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:6 }}>
              <span style={{ ...S.badge, background:ss.bg, border:`1px solid ${ss.border}`, color:ss.color }}>
                {ss.icon} {order.status}
              </span>
              <span style={{ ...S.badge, background: order.payment_status==='paid' ? 'rgba(74,222,128,0.1)' : 'rgba(251,191,36,0.1)', color: order.payment_status==='paid' ? '#4ade80' : '#fbbf24', border:`1px solid ${order.payment_status==='paid'?'#4ade80':'#fbbf24'}` }}>
                {order.payment_status==='paid' ? '💳 Payé' : '⏳ En attente'}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────
// PUBLIER UN PRODUIT
// ─────────────────────────────────────────────
function PublishProduct({ userId, onPublished }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name:'', description:'', price:'', compare_price:'', stock:'', category:'',
    subcategory:'', brand:'', image_url:'', currency:'USD', is_digital:false,
    is_featured:false, delivery_info:'', location:'', status:'active',
    shipping_countries:[], shipping_type:'standard',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handle = async () => {
    if (!form.name.trim() || !form.price) { setError(t('name_price_required')); return; }
    setLoading(true);
    try {
      const res = await api.post('/marketplace/products', { ...form, user_id: userId, price: parseFloat(form.price), compare_price: form.compare_price ? parseFloat(form.compare_price) : null, stock: parseInt(form.stock)||0 });
      onPublished && onPublished(res.data?.data || res.data);
    } catch(err) { setError(err.response?.data?.message || 'Erreur lors de la publication.'); }
    finally { setLoading(false); }
  };

  const F = ({ label, children }) => (
    <div style={S.field}><label style={S.label}>{label}</label>{children}</div>
  );

  return (
    <div style={{ background:'#13131a', border:'1px solid #1e1e2e', borderRadius:14, padding:24, maxWidth:640 }}>
      <h3 style={{ color:'#e2e8f0', fontSize:17, margin:'0 0 20px', fontWeight:700 }}>{t('publish_product')}</h3>
      {error && <div style={{ background:'rgba(248,113,113,0.1)', border:'1px solid #f87171', color:'#f87171', padding:'9px 14px', borderRadius:8, fontSize:13, marginBottom:16 }}>⚠️ {error}</div>}

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        <div style={{ gridColumn:'1/-1' }}>
          <F label="Nom du produit *">
            <input style={{ ...S.input, width:'100%' }} value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Ex: iPhone 15 Pro Max"/>
          </F>
        </div>
        <F label="Prix *">
          <input style={{ ...S.input, width:'100%' }} type="number" value={form.price} onChange={e=>setForm(f=>({...f,price:e.target.value}))} placeholder="0.00"/>
        </F>
        <F label="Prix barré (optionnel)">
          <input style={{ ...S.input, width:'100%' }} type="number" value={form.compare_price} onChange={e=>setForm(f=>({...f,compare_price:e.target.value}))} placeholder="0.00"/>
        </F>
        <F label="Stock">
          <input style={{ ...S.input, width:'100%' }} type="number" value={form.stock} onChange={e=>setForm(f=>({...f,stock:e.target.value}))} placeholder="0"/>
        </F>
        <F label="Devise">
          <select style={{ ...S.input, width:'100%' }} value={form.currency} onChange={e=>setForm(f=>({...f,currency:e.target.value}))}>
            {CURRENCIES.map(c=><option key={c}>{c}</option>)}
          </select>
        </F>
        <F label="Catégorie">
          <select style={{ ...S.input, width:'100%' }} value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>
            <option value="">-- Sélectionner --</option>
            {CATEGORIES.map(c=><option key={c}>{c}</option>)}
          </select>
        </F>
        <F label="Marque">
          <input style={{ ...S.input, width:'100%' }} value={form.brand} onChange={e=>setForm(f=>({...f,brand:e.target.value}))} placeholder="Apple, Nike..."/>
        </F>
        <F label="📍 Marché cible">
          <select style={{ ...S.input, width:'100%' }} value={form.location} onChange={e=>setForm(f=>({...f,location:e.target.value}))}>
            <option value="">-- Sélectionner un marché --</option>
            {Object.entries(WORLD_LOCATIONS).map(([region, cities]) => (
              <optgroup key={region} label={region}>
                {cities.map(city => <option key={city} value={city}>{city}</option>)}
              </optgroup>
            ))}
          </select>
          <span style={{ color:'#475569', fontSize:11, marginTop:3, display:'block' }}>💡 Ciblez le bon marché pour maximiser votre visibilité internationale</span>
        </F>
        <div style={{ gridColumn:'1/-1' }}>
          <F label="URL image principale">
            <input style={{ ...S.input, width:'100%' }} value={form.image_url} onChange={e=>setForm(f=>({...f,image_url:e.target.value}))} placeholder="https://..."/>
          </F>
        </div>
        <div style={{ gridColumn:'1/-1' }}>
          <F label="Info livraison">
            <input style={{ ...S.input, width:'100%' }} value={form.delivery_info} onChange={e=>setForm(f=>({...f,delivery_info:e.target.value}))} placeholder="Livraison 24h, Accès immédiat..."/>
          </F>
        </div>
        <div style={{ gridColumn:'1/-1' }}>
          <F label="Description">
            <textarea style={{ ...S.input, width:'100%', minHeight:80, resize:'vertical' }} value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))}/>
          </F>
        </div>
        <div style={{ gridColumn:'1/-1', display:'flex', gap:20 }}>
          {[['is_digital','💻 Produit digital'],['is_featured','⭐ Mettre en vedette']].map(([key,label])=>(
            <label key={key} style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', color:'#94a3b8', fontSize:13 }}>
              <input type="checkbox" checked={form[key]} onChange={e=>setForm(f=>({...f,[key]:e.target.checked}))} style={{ accentColor:'#C9A84C', width:16, height:16 }}/>
              {label}
            </label>
          ))}
        </div>
      </div>

      <div style={{ display:'flex', gap:10, justifyContent:'flex-end', marginTop:8 }}>
        <button style={S.cancelBtn} onClick={() => onPublished && onPublished(null)}>Annuler</button>
        <button style={S.saveBtn} onClick={handle} disabled={loading}>
          {loading ? '...' : t('publish_btn')}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MARKETPLACE PRINCIPAL
// ─────────────────────────────────────────────
export default function Marketplace({ userId }) {
  const { t } = useTranslation();
  const [products,    setProducts]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [tab,         setTab]         = useState('browse');
  const [search,      setSearch]      = useState('');
  const [deliverTo,   setDeliverTo]   = useState('');
  const [countrySearch, setCountrySearch] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [category,    setCategory]    = useState('');
  const [sortBy,      setSortBy]      = useState('featured');
  const [viewProduct, setViewProduct] = useState(null);
  const [buyProduct,  setBuyProduct]  = useState(null);
  const [buyQty,      setBuyQty]      = useState(1);

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/marketplace/products');
      setProducts(res.data?.data || res.data || []);
    } catch { setProducts(MOCK_PRODUCTS); }
    finally { setLoading(false); }
  };

  const handleBuy = (product, qty=1) => {
    setViewProduct(null);
    setBuyProduct(product);
    setBuyQty(qty);
  };

  const handlePublished = (product) => {
    if (product) setProducts(p => [product, ...p]);
    setTab('browse');
  };

  // Filtrage + tri
  // Tous les pays disponibles à plat
  const ALL_COUNTRIES = Object.values(SHIPPING_COUNTRIES).flat();
  const filteredCountries = countrySearch
    ? ALL_COUNTRIES.filter(c => c.toLowerCase().includes(countrySearch.toLowerCase()))
    : ALL_COUNTRIES;

  let filtered = products.filter(p => {
    const matchSearch  = p.name.toLowerCase().includes(search.toLowerCase()) || (p.description||'').toLowerCase().includes(search.toLowerCase());
    const matchCat     = !category || p.category === category;
    const matchDeliver = !deliverTo || !p.shipping_countries || p.shipping_countries.includes('Livraison mondiale') || p.shipping_countries.includes(deliverTo);
    return matchSearch && matchCat && matchDeliver;
  });

  if (sortBy === 'featured')   filtered = [...filtered].sort((a,b) => b.is_featured - a.is_featured);
  if (sortBy === 'price_asc')  filtered = [...filtered].sort((a,b) => a.price - b.price);
  if (sortBy === 'price_desc') filtered = [...filtered].sort((a,b) => b.price - a.price);
  if (sortBy === 'rating')     filtered = [...filtered].sort((a,b) => b.rating - a.rating);
  if (sortBy === 'sales')      filtered = [...filtered].sort((a,b) => b.sales_count - a.sales_count);

  const TABS = [
    { key:'browse',  label:t('explore') },
    { key:'orders',  label:t('my_orders') },
    { key:'publish', label:t('sell') },
  ];

  return (
    <>
      {/* Modals */}
      {viewProduct && <ProductModal product={viewProduct} onClose={() => setViewProduct(null)} onBuy={handleBuy}/>}
      {buyProduct  && <CheckoutModal product={buyProduct} qty={buyQty} userId={userId} onClose={() => setBuyProduct(null)} onSuccess={loadProducts}/>}

      <div style={S.container}>
        {/* Header tabs */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
          <h2 style={{ color:'#e2e8f0', fontSize:20, margin:0, fontWeight:700 }}>🛍️ {t('marketplace_title')}</h2>
          <div style={{ display:'flex', gap:8 }}>
            {TABS.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)} style={{
                ...S.filterBtn, ...(tab===t.key ? S.filterActive : {}), padding:'7px 18px', borderRadius:8, fontSize:13
              }}>{t.label}</button>
            ))}
          </div>
        </div>

        {/* Browse */}
        {tab === 'browse' && (
          <>
            {/* Barre recherche + filtres */}
            <div style={{ display:'flex', gap:10, flexWrap:'wrap', alignItems:'center' }}>
              <div style={{ position:'relative', flex:1, minWidth:200 }}>
                <input
                  style={{ ...S.input, width:'100%', paddingLeft:36 }}
                  placeholder={`🔍 ${t('search_product')}`}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', fontSize:14 }}>🔍</span>
              </div>
              <select style={{ ...S.input, width:160 }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="featured">{t('featured')}</option>
                <option value="price_asc">{t('price_asc')}</option>
                <option value="price_desc">{t('price_desc')}</option>
                <option value="rating">{t('best_rated')}</option>
                <option value="sales">{t('best_sellers')}</option>
              </select>
            </div>

            {/* Filtre livraison */}
            <div style={{ display:'flex', gap:10, flexWrap:'wrap', alignItems:'center' }}>
              <div style={{ position:'relative' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, background:'#13131a', border:`1px solid ${deliverTo ? '#C9A84C' : '#1e1e2e'}`, borderRadius:8, padding:'6px 12px', cursor:'pointer' }}
                  onClick={() => setShowCountryDropdown(v => !v)}
                >
                  <span style={{ fontSize:14 }}>🚚</span>
                  <span style={{ color: deliverTo ? '#C9A84C' : '#64748b', fontSize:12, minWidth:120 }}>
                    {deliverTo || t('deliver_to')}
                  </span>
                  {deliverTo && (
                    <button onClick={e => { e.stopPropagation(); setDeliverTo(''); setCountrySearch(''); }} style={{ background:'none', border:'none', color:'#f87171', cursor:'pointer', fontSize:14, padding:0 }}>✕</button>
                  )}
                </div>
                {showCountryDropdown && (
                  <div style={{ position:'absolute', top:'calc(100% + 4px)', left:0, zIndex:100, background:'#0d0d18', border:'1px solid #1e1e2e', borderRadius:10, width:260, maxHeight:300, overflow:'hidden', boxShadow:'0 8px 24px rgba(0,0,0,0.5)' }}
                    onMouseLeave={() => setShowCountryDropdown(false)}
                  >
                    <div style={{ padding:8 }}>
                      <input
                        style={{ background:'#13131a', border:'1px solid #1e1e2e', color:'#e2e8f0', padding:'7px 12px', borderRadius:6, fontSize:12, width:'100%', outline:'none', boxSizing:'border-box' }}
                        placeholder="🔍 Norvège, Australie, Brésil..."
                        value={countrySearch}
                        onChange={e => setCountrySearch(e.target.value)}
                        onClick={e => e.stopPropagation()}
                        autoFocus
                      />
                    </div>
                    <div style={{ overflowY:'auto', maxHeight:240 }}>
                      <div onClick={() => { setDeliverTo(''); setShowCountryDropdown(false); setCountrySearch(''); }} style={{ padding:'8px 14px', color:'#64748b', fontSize:12, cursor:'pointer', borderBottom:'1px solid #1e1e2e' }}>
                        {t('all_countries')}
                      </div>
                      {filteredCountries.map(country => (
                        <div key={country} onClick={() => { setDeliverTo(country); setShowCountryDropdown(false); setCountrySearch(''); }}
                          style={{ padding:'8px 14px', color: deliverTo===country ? '#C9A84C' : '#94a3b8', fontSize:12, cursor:'pointer', background: deliverTo===country ? 'rgba(201,168,76,0.08)' : 'transparent' }}
                          onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.04)'}
                          onMouseLeave={e => e.currentTarget.style.background=deliverTo===country?'rgba(201,168,76,0.08)':'transparent'}
                        >
                          {deliverTo===country ? '✅ ' : ''}{country}
                        </div>
                      ))}
                      {filteredCountries.length === 0 && (
                        <div style={{ padding:'16px', color:'#475569', fontSize:12, textAlign:'center' }}>{t('no_country')}</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              {deliverTo && (
                <span style={{ background:'rgba(201,168,76,0.1)', border:'1px solid rgba(201,168,76,0.3)', color:'#C9A84C', padding:'4px 12px', borderRadius:20, fontSize:11 }}>
                  {t('delivery_to')} : {deliverTo}
                </span>
              )}
            </div>

            {/* Catégories */}
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              <button onClick={() => setCategory('')} style={{ ...S.filterBtn, ...(category===''?S.filterActive:{}) }}>{t('all_categories')}</button>
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => setCategory(c)} style={{ ...S.filterBtn, ...(category===c?S.filterActive:{}) }}>{c}</button>
              ))}
            </div>

            {/* Stats rapides */}
            <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
              {[
                { label:`${products.length} produits`, color:'#64748b' },
                { label:`${products.filter(p=>p.is_featured).length} en vedette`, color:'#C9A84C' },
                { label:`${products.filter(p=>p.is_digital).length} digitaux`, color:'#a78bfa' },
                { label:`${products.filter(p=>p.status==='sold_out').length} épuisés`, color:'#f87171' },
              ].map((s,i) => (
                <div key={i} style={{ background:'#13131a', border:'1px solid #1e1e2e', borderRadius:20, padding:'4px 14px', color:s.color, fontSize:12 }}>{s.label}</div>
              ))}
            </div>

            {/* Grille produits */}
            {loading ? (
              <div style={S.empty}>{t('loading_products')}</div>
            ) : filtered.length === 0 ? (
              <div style={S.empty}>
                <div style={{ fontSize:48, marginBottom:12 }}>🔍</div>
                <div style={{ color:'#e2e8f0', fontSize:16, fontWeight:600 }}>{t('no_product')}</div>
              </div>
            ) : (
              <div style={S.grid}>
                {filtered.map(p => (
                  <ProductCard key={p.id} product={p} onBuy={handleBuy} onView={setViewProduct}/>
                ))}
              </div>
            )}
          </>
        )}

        {/* Mes commandes */}
        {tab === 'orders' && <MyOrders userId={userId} t={t}/>}

        {/* Publier */}
        {tab === 'publish' && <PublishProduct userId={userId} onPublished={handlePublished} t={t}/>}
      </div>
    </>
  );
}