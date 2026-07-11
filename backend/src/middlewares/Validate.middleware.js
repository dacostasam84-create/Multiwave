// src/middlewares/validate.middleware.js
// Auteur : Zahnouni Issam
'use strict';

// ─────────────────────────────────────────────
// RÈGLES DE VALIDATION
// ─────────────────────────────────────────────
const validators = {
  required: (val) => !val || val.toString().trim() === '',
  email:    (val) => val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
  minLen:   (min) => (val) => val && val.length < min,
  maxLen:   (max) => (val) => val && val.length > max,
  numeric:  (val) => val !== undefined && isNaN(Number(val)),
  positive: (val) => val !== undefined && Number(val) <= 0,
};

// ─────────────────────────────────────────────
// MIDDLEWARE FACTORY
// ─────────────────────────────────────────────
function validate(schema) {
  return (req, res, next) => {
    const errors = [];
    const body   = req.body;

    Object.entries(schema).forEach(([field, rules]) => {
      const val   = body[field];
      const rulesArr = Array.isArray(rules) ? rules : [rules];

      for (const rule of rulesArr) {
        let failed = false;
        let message = '';

        if (rule === 'required') {
          failed  = validators.required(val);
          message = `${field} est requis`;
        } else if (rule === 'email') {
          failed  = validators.email(val);
          message = `${field} doit être un email valide`;
        } else if (rule === 'numeric') {
          failed  = validators.numeric(val);
          message = `${field} doit être un nombre`;
        } else if (rule === 'positive') {
          failed  = validators.positive(val);
          message = `${field} doit être positif`;
        } else if (typeof rule === 'object' && rule.type === 'minLen') {
          failed  = validators.minLen(rule.value)(val);
          message = `${field} doit avoir au moins ${rule.value} caractères`;
        } else if (typeof rule === 'object' && rule.type === 'maxLen') {
          failed  = validators.maxLen(rule.value)(val);
          message = `${field} doit avoir au maximum ${rule.value} caractères`;
        }

        if (failed) { errors.push({ field, message }); break; }
      }
    });

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors,
      });
    }

    next();
  };
}

// ─────────────────────────────────────────────
// SCHÉMAS PRÉDÉFINIS
// ─────────────────────────────────────────────
validate.schemas = {

  // Auth
  register: {
    username: ['required', { type:'minLen', value:3 }, { type:'maxLen', value:30 }],
    email:    ['required', 'email'],
    password: ['required', { type:'minLen', value:6 }],
  },
  login: {
    email:    ['required', 'email'],
    password: ['required'],
  },

  // Posts
  createPost: {
    content:  ['required', { type:'maxLen', value:5000 }],
    user_id:  ['required', 'numeric'],
  },

  // Messages
  sendMessage: {
    content:     ['required', { type:'maxLen', value:2000 }],
    sender_id:   ['required', 'numeric'],
    receiver_id: ['required', 'numeric'],
  },

  // Products
  createProduct: {
    name:    ['required', { type:'maxLen', value:255 }],
    price:   ['required', 'numeric', 'positive'],
    user_id: ['required', 'numeric'],
  },

  // Groups
  createGroup: {
    name:       ['required', { type:'minLen', value:3 }, { type:'maxLen', value:100 }],
    owner_id:   ['required', 'numeric'],
    visibility: ['required'],
  },

  // Jobs
  createJob: {
    title:   ['required', { type:'maxLen', value:255 }],
    user_id: ['required', 'numeric'],
  },

  // Wallet
  deposit: {
    user_id: ['required', 'numeric'],
    amount:  ['required', 'numeric', 'positive'],
  },
  transfer: {
    user_id:     ['required', 'numeric'],
    to_username: ['required'],
    amount:      ['required', 'numeric', 'positive'],
  },
};

module.exports = validate;