// src/services/brand
// .service.js
const db = require("../models"); // ton model Brand

class BrandsService {
  // Créer une nouvelle marque
  static async createBrand({ name, description, logo_url, owner_id }) {
    // Vérifier si le nom existe déjà
    const exist = await db.Brand.findOne({ where: { name } });
    if (exist) throw new Error('Nom de marque déjà utilisé');

    // Créer la marque
    return await db.Brand.create({
      name,
      description,
      logo_url,
      owner_id
    });
  }

  // Récupérer toutes les marques actives
  static async getAllBrands() {
    return await db.Brand.findAll({
      where: { status: 'active' },
      order: [['created_at', 'DESC']]
    });
  }

  // Récupérer une marque par ID
  static async getBrandById(id) {
    return await db.Brand.findByPk(id, {
      include: [
        { model: db.Post, as: 'posts' },
        { model: db.Ad, as: 'ads' },
        { model: db.BrandFeed, as: 'feeds' }
      ]
    });
  }

  // Mettre à jour une marque
  static async updateBrand(id, owner_id, data) {
    const brand = await db.Brand.findOne({ where: { id, owner_id } });
    if (!brand) return null;

    await brand.update(data);
    return brand;
  }

  // Désactiver une marque
  static async disableBrand(id, owner_id) {
    const brand = await db.Brand.findOne({ where: { id, owner_id } });
    if (!brand) throw new Error('Marque non trouvée');

    await brand.update({ status: 'inactive' });
    return true;
  }
}

module.exports = BrandsService;

