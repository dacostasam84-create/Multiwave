// src/controllers/Brand.controller.js
const BrandService = require("../services/Brand.service");

class BrandController {

  static async createBrand(req, res) {
    try {
      const { name, description, logo_url } = req.body;

      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'Le nom de la marque est requis'
        });
      }

      const brand = await BrandService.createBrand({
        name,
        description,
        logo_url,
        owner_id: req.user.id
      });

      return res.status(201).json({
        success: true,
        message: 'Marque créée',
        data: brand
      });

    } catch (error) {
      console.error('CreateBrand Error:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur serveur'
      });
    }
  }

  static async getAllBrands(req, res) {
    try {
      const brands = await BrandService.getAllBrands();

      return res.json({
        success: true,
        data: brands
      });

    } catch (error) {
      console.error('GetAllBrands Error:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur serveur'
      });
    }
  }

  static async getBrandById(req, res) {
    try {
      const { id } = req.params;

      const brand = await BrandService.getBrandById(id);

      if (!brand) {
        return res.status(404).json({
          success: false,
          message: 'Marque non trouvée'
        });
      }

      return res.json({
        success: true,
        data: brand
      });

    } catch (error) {
      console.error('GetBrandById Error:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur serveur'
      });
    }
  }

  static async updateBrand(req, res) {
    try {
      const { id } = req.params;
      const { name, description, logo_url } = req.body;

      const updatedBrand = await BrandService.updateBrand(
        id,
        req.user.id,
        { name, description, logo_url }
      );

      if (!updatedBrand) {
        return res.status(404).json({
          success: false,
          message: 'Marque non trouvée'
        });
      }

      return res.json({
        success: true,
        message: 'Marque mise à jour',
        data: updatedBrand
      });

    } catch (error) {
      console.error('UpdateBrand Error:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur serveur'
      });
    }
  }

  static async disableBrand(req, res) {
    try {
      await BrandService.disableBrand(req.params.id, req.user.id);

      return res.json({
        success: true,
        message: 'Marque désactivée'
      });

    } catch (error) {
      console.error('DisableBrand Error:', error);
      return res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Erreur serveur'
      });
    }
  }
}

module.exports = BrandController;

