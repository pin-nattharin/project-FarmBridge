// controllers/listing.controller.js
const db = require('../models');
const Listings = db.Listings;
const Farmers = db.Farmers;
const { geocodeAddress } = require('../utils/geocode');
const { Op } = require('sequelize');

// GET all listings (with optional filters: product_name, nearby lat/lng & radius, status)
exports.getAll = async (req, res) => {
  try {
    const { product_name, status } = req.query;
    const where = {};
    if (product_name) where.product_name = { [Op.iLike]: `%${product_name}%` };
    if (status) where.status = status;

    const rows = await Listings.findAll({
      where,
      include: [{ model: Farmers, as: 'seller', attributes: ['id','fullname','email','phone','address'] }],
      order: [['createdAt','DESC']]
    });

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch listings', error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listings.findByPk(id, {
      include: [{ model: Farmers, as: 'seller', attributes: ['id','fullname','email','phone','address'] }]
    });
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: 'Error', error: err.message });
  }
};

// CREATE listing (เฉพาะเกษตรกร)
exports.create = async (req, res) => {
  try {
    const identity = req.identity;
    if (!identity || identity.role !== 'farmer') return res.status(403).json({ message: 'Only farmers can create listings' });

    const payload = req.body;

    // ถ้ามี address ให้แปลงเป็นพิกัด
    if (payload.address && !payload.location_geom) {
      const coords = await geocodeAddress(payload.address);
      if (coords) payload.location_geom = { type: 'Point', coordinates: [coords.lng, coords.lat] };
    }

    // quantity_available default to quantity_total if not provided
    if (!payload.quantity_available && payload.quantity_total) payload.quantity_available = payload.quantity_total;

    const newListing = await Listings.create({
      seller_id: identity.id,
      product_name: payload.product_name,
      grade: payload.grade || null,
      quantity_total: payload.quantity_total || null,
      quantity_available: payload.quantity_available || payload.quantity_total || null,
      unit: payload.unit || null,
      price_per_unit: payload.price_per_unit || null,
      market_price_low: payload.market_price_low || null,
      market_price_high: payload.market_price_high || null,
      description: payload.description || null,
      image_url: payload.image_url || null,
      pickup_date: payload.pickup_date || null,
      pickup_time: payload.pickup_time || null,
      status: payload.status || 'available',
      location_geom: payload.location_geom || null,
      address: payload.address || null
    });

    res.status(201).json({ message: 'Listing created', listing: newListing });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Create failed', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const identity = req.identity;
    const listing = await Listings.findByPk(id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    if (identity.role !== 'farmer' || Number(listing.seller_id) !== Number(identity.id)) {
      return res.status(403).json({ message: 'Not authorized to update this listing' });
    }

    const payload = req.body;
    if (payload.address && !payload.location_geom) {
      const coords = await geocodeAddress(payload.address);
      if (coords) payload.location_geom = { type: 'Point', coordinates: [coords.lng, coords.lat] };
    }

    // if quantity_total changed and no quantity_available, try keep difference
    if (payload.quantity_total && !payload.quantity_available) {
      const diff = payload.quantity_total - (listing.quantity_total || 0);
      payload.quantity_available = (listing.quantity_available || 0) + diff;
      if (payload.quantity_available < 0) payload.quantity_available = 0;
    }

    await listing.update(payload);

    // if quantity_available goes to 0 => mark sold
    if (listing.quantity_available !== null && Number(listing.quantity_available) <= 0) {
      await listing.update({ status: 'sold' });
    }

    res.json({ message: 'Listing updated', listing });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const identity = req.identity;
    const listing = await Listings.findByPk(id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    if (identity.role !== 'farmer' || Number(listing.seller_id) !== Number(identity.id)) {
      return res.status(403).json({ message: 'Not authorized to delete this listing' });
    }

    await listing.destroy();
    res.json({ message: 'Listing deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
};

/**
 * Market price suggestion:
 * /api/listings/market-suggestion?product_name=mango&days=5
 * -> returns average, min, max price_per_unit from listings created in last `days`
 */
exports.marketSuggestion = async (req, res) => {
  try {
    const { product_name, days = 7 } = req.query;
    if (!product_name) return res.status(400).json({ message: 'product_name is required' });

    const since = new Date();
    since.setDate(since.getDate() - Number(days));

    const rows = await Listings.findAll({
      where: {
        product_name: { [Op.iLike]: `%${product_name}%` },
        createdAt: { [Op.gte]: since },
        price_per_unit: { [Op.ne]: null }
      },
      attributes: ['price_per_unit', 'createdAt']
    });

    if (!rows || rows.length === 0) return res.json({ message: 'No recent trades found', count: 0, avg: null });

    const prices = rows.map(r => Number(r.price_per_unit));
    const avg = prices.reduce((a,b)=>a+b,0)/prices.length;
    const min = Math.min(...prices);
    const max = Math.max(...prices);

    res.json({ count: prices.length, avg: Number(avg.toFixed(2)), low: min, high: max, sample_count: prices.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Suggestion failed', error: err.message });
  }
};
