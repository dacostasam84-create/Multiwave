// src/seeders/seed-brands.js
// Auteur : Zahnouni Issam
// Usage : node src/seeders/seed-brands.js

'use strict';

require('dotenv').config();
const sequelize = require('../config/database');
const db = require('../models');

// ─────────────────────────────────────────────
// 50+ MARQUES MONDIALES CÉLÈBRES
// ─────────────────────────────────────────────
const BRANDS = [

  // ── TECH ──────────────────────────────────
  {
    user_id: 1, name: 'Apple', category: 'Tech',
    description: 'Think Different. Leader mondial des smartphones, ordinateurs et services numériques.',
    logo_url: 'https://logo.clearbit.com/apple.com',
    website: 'https://www.apple.com',
    country: 'USA', followers_count: 28400000,
    is_verified: true, is_active: true,
  },
  {
    user_id: 1, name: 'Samsung', category: 'Tech',
    description: 'Innovate for a better future. Électronique grand public, smartphones et semi-conducteurs.',
    logo_url: 'https://logo.clearbit.com/samsung.com',
    website: 'https://www.samsung.com',
    country: 'Corée du Sud', followers_count: 21000000,
    is_verified: true, is_active: true,
  },
  {
    user_id: 1, name: 'Google', category: 'Tech',
    description: 'Organizing the world\'s information. Moteur de recherche, cloud, IA et Android.',
    logo_url: 'https://logo.clearbit.com/google.com',
    website: 'https://www.google.com',
    country: 'USA', followers_count: 18900000,
    is_verified: true, is_active: true,
  },
  {
    user_id: 1, name: 'Microsoft', category: 'Tech',
    description: 'Empower every person on the planet. Windows, Azure, Office et Xbox.',
    logo_url: 'https://logo.clearbit.com/microsoft.com',
    website: 'https://www.microsoft.com',
    country: 'USA', followers_count: 15600000,
    is_verified: true, is_active: true,
  },
  {
    user_id: 1, name: 'Meta', category: 'Tech',
    description: 'Connecting the world. Facebook, Instagram, WhatsApp et réalité virtuelle.',
    logo_url: 'https://logo.clearbit.com/meta.com',
    website: 'https://www.meta.com',
    country: 'USA', followers_count: 14200000,
    is_verified: true, is_active: true,
  },
  {
    user_id: 1, name: 'Tesla', category: 'Tech',
    description: 'Accelerating the world\'s transition to sustainable energy. Voitures électriques et énergie.',
    logo_url: 'https://logo.clearbit.com/tesla.com',
    website: 'https://www.tesla.com',
    country: 'USA', followers_count: 12800000,
    is_verified: true, is_active: true,
  },
  {
    user_id: 1, name: 'Amazon', category: 'Tech',
    description: 'Work hard. Have fun. Make history. E-commerce, AWS et logistique mondiale.',
    logo_url: 'https://logo.clearbit.com/amazon.com',
    website: 'https://www.amazon.com',
    country: 'USA', followers_count: 11400000,
    is_verified: true, is_active: true,
  },
  {
    user_id: 1, name: 'Huawei', category: 'Tech',
    description: 'Building a Fully Connected, Intelligent World. Télécoms et smartphones.',
    logo_url: 'https://logo.clearbit.com/huawei.com',
    website: 'https://www.huawei.com',
    country: 'Chine', followers_count: 9800000,
    is_verified: true, is_active: true,
  },
  {
    user_id: 1, name: 'Sony', category: 'Tech',
    description: 'Be Moved. Électronique, gaming PlayStation et entertainment.',
    logo_url: 'https://logo.clearbit.com/sony.com',
    website: 'https://www.sony.com',
    country: 'Japon', followers_count: 8700000,
    is_verified: true, is_active: true,
  },
  {
    user_id: 1, name: 'Intel', category: 'Tech',
    description: 'Experience What\'s Inside. Leader mondial des processeurs et semi-conducteurs.',
    logo_url: 'https://logo.clearbit.com/intel.com',
    website: 'https://www.intel.com',
    country: 'USA', followers_count: 6200000,
    is_verified: true, is_active: true,
  },

  // ── MODE & LUXE ───────────────────────────
  {
    user_id: 1, name: 'Nike', category: 'Mode',
    description: 'Just Do It. Leader mondial du sportswear et des chaussures de sport.',
    logo_url: 'https://logo.clearbit.com/nike.com',
    website: 'https://www.nike.com',
    country: 'USA', followers_count: 31200000,
    is_verified: true, is_active: true,
  },
  {
    user_id: 1, name: 'Adidas', category: 'Mode',
    description: 'Impossible is Nothing. Sportswear, chaussures et lifestyle.',
    logo_url: 'https://logo.clearbit.com/adidas.com',
    website: 'https://www.adidas.com',
    country: 'Allemagne', followers_count: 24800000,
    is_verified: true, is_active: true,
  },
  {
    user_id: 1, name: 'Louis Vuitton', category: 'Mode',
    description: 'L\'art du voyage depuis 1854. Maroquinerie, mode et luxe français.',
    logo_url: 'https://logo.clearbit.com/louisvuitton.com',
    website: 'https://www.louisvuitton.com',
    country: 'France', followers_count: 19600000,
    is_verified: true, is_active: true,
  },
  {
    user_id: 1, name: 'Gucci', category: 'Mode',
    description: 'Quality is remembered long after price is forgotten. Mode italienne de luxe.',
    logo_url: 'https://logo.clearbit.com/gucci.com',
    website: 'https://www.gucci.com',
    country: 'Italie', followers_count: 17400000,
    is_verified: true, is_active: true,
  },
  {
    user_id: 1, name: 'Zara', category: 'Mode',
    description: 'Loves You. Fast fashion accessible et tendance mondiale.',
    logo_url: 'https://logo.clearbit.com/zara.com',
    website: 'https://www.zara.com',
    country: 'Espagne', followers_count: 14200000,
    is_verified: true, is_active: true,
  },
  {
    user_id: 1, name: 'H&M', category: 'Mode',
    description: 'Fashion and quality at the best price. Mode accessible et durable.',
    logo_url: 'https://logo.clearbit.com/hm.com',
    website: 'https://www.hm.com',
    country: 'Suède', followers_count: 11800000,
    is_verified: true, is_active: true,
  },
  {
    user_id: 1, name: 'Chanel', category: 'Mode',
    description: 'Pour être irremplaçable, il faut toujours être différente. Luxe français.',
    logo_url: 'https://logo.clearbit.com/chanel.com',
    website: 'https://www.chanel.com',
    country: 'France', followers_count: 16800000,
    is_verified: true, is_active: true,
  },

  // ── ALIMENTATION & BOISSONS ───────────────
  {
    user_id: 1, name: 'McDonald\'s', category: 'Alimentation',
    description: 'I\'m Lovin\' It. Leader mondial de la restauration rapide.',
    logo_url: 'https://logo.clearbit.com/mcdonalds.com',
    website: 'https://www.mcdonalds.com',
    country: 'USA', followers_count: 22400000,
    is_verified: true, is_active: true,
  },
  {
    user_id: 1, name: 'Coca-Cola', category: 'Alimentation',
    description: 'Open Happiness. La boisson la plus connue au monde depuis 1886.',
    logo_url: 'https://logo.clearbit.com/coca-cola.com',
    website: 'https://www.coca-cola.com',
    country: 'USA', followers_count: 18900000,
    is_verified: true, is_active: true,
  },
  {
    user_id: 1, name: 'Starbucks', category: 'Alimentation',
    description: 'To inspire and nurture the human spirit. Café premium mondial.',
    logo_url: 'https://logo.clearbit.com/starbucks.com',
    website: 'https://www.starbucks.com',
    country: 'USA', followers_count: 16700000,
    is_verified: true, is_active: true,
  },
  {
    user_id: 1, name: 'Nestlé', category: 'Alimentation',
    description: 'Good Food, Good Life. Leader mondial de l\'alimentation et des boissons.',
    logo_url: 'https://logo.clearbit.com/nestle.com',
    website: 'https://www.nestle.com',
    country: 'Suisse', followers_count: 9400000,
    is_verified: true, is_active: true,
  },

  // ── AUTOMOBILE ────────────────────────────
  {
    user_id: 1, name: 'Toyota', category: 'Auto',
    description: 'Moving Forward. Constructeur automobile japonais leader mondial.',
    logo_url: 'https://logo.clearbit.com/toyota.com',
    website: 'https://www.toyota.com',
    country: 'Japon', followers_count: 12400000,
    is_verified: true, is_active: true,
  },
  {
    user_id: 1, name: 'BMW', category: 'Auto',
    description: 'The Ultimate Driving Machine. Voitures de luxe allemandes.',
    logo_url: 'https://logo.clearbit.com/bmw.com',
    website: 'https://www.bmw.com',
    country: 'Allemagne', followers_count: 14800000,
    is_verified: true, is_active: true,
  },
  {
    user_id: 1, name: 'Mercedes-Benz', category: 'Auto',
    description: 'The Best or Nothing. Luxe automobile allemand depuis 1926.',
    logo_url: 'https://logo.clearbit.com/mercedes-benz.com',
    website: 'https://www.mercedes-benz.com',
    country: 'Allemagne', followers_count: 13200000,
    is_verified: true, is_active: true,
  },

  // ── FINANCE ───────────────────────────────
  {
    user_id: 1, name: 'Visa', category: 'Finance',
    description: 'Everywhere you want to be. Leader mondial des paiements électroniques.',
    logo_url: 'https://logo.clearbit.com/visa.com',
    website: 'https://www.visa.com',
    country: 'USA', followers_count: 8900000,
    is_verified: true, is_active: true,
  },
  {
    user_id: 1, name: 'PayPal', category: 'Finance',
    description: 'New Money. Paiements en ligne sécurisés dans le monde entier.',
    logo_url: 'https://logo.clearbit.com/paypal.com',
    website: 'https://www.paypal.com',
    country: 'USA', followers_count: 7600000,
    is_verified: true, is_active: true,
  },
  {
    user_id: 1, name: 'Binance', category: 'Finance',
    description: 'The world\'s leading blockchain ecosystem. Exchange crypto numéro 1 mondial.',
    logo_url: 'https://logo.clearbit.com/binance.com',
    website: 'https://www.binance.com',
    country: 'Îles Caïmans', followers_count: 11200000,
    is_verified: true, is_active: true,
  },

  // ── SPORT ─────────────────────────────────
  {
    user_id: 1, name: 'Puma', category: 'Sport',
    description: 'Forever Faster. Sportswear et chaussures de performance.',
    logo_url: 'https://logo.clearbit.com/puma.com',
    website: 'https://www.puma.com',
    country: 'Allemagne', followers_count: 8400000,
    is_verified: true, is_active: true,
  },
  {
    user_id: 1, name: 'Under Armour', category: 'Sport',
    description: 'The Only Way is Through. Équipements sportifs haute performance.',
    logo_url: 'https://logo.clearbit.com/underarmour.com',
    website: 'https://www.underarmour.com',
    country: 'USA', followers_count: 6800000,
    is_verified: true, is_active: true,
  },

  // ── BEAUTÉ ────────────────────────────────
  {
    user_id: 1, name: 'L\'Oréal', category: 'Beauté',
    description: 'Because You\'re Worth It. Leader mondial de la beauté et cosmétiques.',
    logo_url: 'https://logo.clearbit.com/loreal.com',
    website: 'https://www.loreal.com',
    country: 'France', followers_count: 12800000,
    is_verified: true, is_active: true,
  },
  {
    user_id: 1, name: 'Dior', category: 'Beauté',
    description: 'J\'adore. Parfums, cosmétiques et mode de luxe français.',
    logo_url: 'https://logo.clearbit.com/dior.com',
    website: 'https://www.dior.com',
    country: 'France', followers_count: 14600000,
    is_verified: true, is_active: true,
  },

  // ── STREAMING & MEDIA ─────────────────────
  {
    user_id: 1, name: 'Netflix', category: 'Tech',
    description: 'See What\'s Next. Leader mondial du streaming vidéo.',
    logo_url: 'https://logo.clearbit.com/netflix.com',
    website: 'https://www.netflix.com',
    country: 'USA', followers_count: 24600000,
    is_verified: true, is_active: true,
  },
  {
    user_id: 1, name: 'Spotify', category: 'Tech',
    description: 'Music for everyone. Streaming musical numéro 1 mondial.',
    logo_url: 'https://logo.clearbit.com/spotify.com',
    website: 'https://www.spotify.com',
    country: 'Suède', followers_count: 18400000,
    is_verified: true, is_active: true,
  },

  // ── MARQUES MAGHREB & AFRIQUE ─────────────
  {
    user_id: 1, name: 'Marjane', category: 'Alimentation',
    description: 'Le plaisir du choix. Grande surface marocaine leader au Maghreb.',
    logo_url: 'https://logo.clearbit.com/marjane.ma',
    website: 'https://www.marjane.ma',
    country: 'Maroc', followers_count: 890000,
    is_verified: true, is_active: true,
  },
  {
    user_id: 1, name: 'Maroc Telecom', category: 'Tech',
    description: 'Connecter le Maroc et l\'Afrique. Opérateur télécom leader au Maroc.',
    logo_url: 'https://logo.clearbit.com/iam.ma',
    website: 'https://www.iam.ma',
    country: 'Maroc', followers_count: 1240000,
    is_verified: true, is_active: true,
  },
  {
    user_id: 1, name: 'OCP Group', category: 'Business',
    description: 'Nourrir la planète. Leader mondial des phosphates et engrais.',
    logo_url: 'https://logo.clearbit.com/ocpgroup.ma',
    website: 'https://www.ocpgroup.ma',
    country: 'Maroc', followers_count: 680000,
    is_verified: true, is_active: true,
  },
  {
    user_id: 1, name: 'Jumia', category: 'Tech',
    description: 'Africa\'s leading e-commerce platform. E-commerce numéro 1 en Afrique.',
    logo_url: 'https://logo.clearbit.com/jumia.com',
    website: 'https://www.jumia.com',
    country: 'Nigeria', followers_count: 2400000,
    is_verified: true, is_active: true,
  },

  // ── MOYEN-ORIENT ──────────────────────────
  {
    user_id: 1, name: 'Emirates', category: 'Auto',
    description: 'Fly Better. Compagnie aérienne de luxe de Dubaï.',
    logo_url: 'https://logo.clearbit.com/emirates.com',
    website: 'https://www.emirates.com',
    country: 'Émirats Arabes Unis', followers_count: 8900000,
    is_verified: true, is_active: true,
  },
  {
    user_id: 1, name: 'Saudi Aramco', category: 'Business',
    description: 'Energy to the world. La plus grande entreprise pétrolière mondiale.',
    logo_url: 'https://logo.clearbit.com/saudiaramco.com',
    website: 'https://www.saudiaramco.com',
    country: 'Arabie Saoudite', followers_count: 3200000,
    is_verified: true, is_active: true,
  },

  // ── ASIE ──────────────────────────────────
  {
    user_id: 1, name: 'Alibaba', category: 'Tech',
    description: 'To make it easy to do business anywhere. E-commerce et cloud chinois.',
    logo_url: 'https://logo.clearbit.com/alibaba.com',
    website: 'https://www.alibaba.com',
    country: 'Chine', followers_count: 14800000,
    is_verified: true, is_active: true,
  },
  {
    user_id: 1, name: 'TikTok', category: 'Tech',
    description: 'Make every second count. Réseau social vidéo court format numéro 1.',
    logo_url: 'https://logo.clearbit.com/tiktok.com',
    website: 'https://www.tiktok.com',
    country: 'Chine', followers_count: 38400000,
    is_verified: true, is_active: true,
  },
];

// ─────────────────────────────────────────────
// SEED FUNCTION
// ─────────────────────────────────────────────
async function seedBrands() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion DB établie');

    // Sync table si nécessaire
    await db.Brand.sync({ alter: true });
    console.log('✅ Table brands synchronisée');

    let created = 0;
    let skipped = 0;

    for (const brand of BRANDS) {
      const existing = await db.Brand.findOne({ where: { name: brand.name } });
      if (existing) {
        console.log(`⏭️  ${brand.name} existe déjà — ignoré`);
        skipped++;
      } else {
        await db.Brand.create(brand);
        console.log(`✅ ${brand.name} créé`);
        created++;
      }
    }

    console.log('\n─────────────────────────────────');
    console.log(`🎉 Seed terminé !`);
    console.log(`✅ Créés  : ${created}`);
    console.log(`⏭️  Ignorés : ${skipped}`);
    console.log(`📦 Total  : ${BRANDS.length}`);
    console.log('─────────────────────────────────\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur seed brands:', err.message);
    process.exit(1);
  }
}

seedBrands();