// controllers/listing.controller.js
const db = require('../models');
const Listings = db.Listings;
const Farmers = db.Farmers;

// GET /api/listings
exports.getAll = async (req, res) => {
  try {
    const rows = await Listings.findAll({
      include: [{ model: Farmers, as: 'seller', attributes: ['id', 'fullname', 'email', 'phone', 'profile_image_base64'] }]
    });
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch listings', error: err.message });
  }
};

// GET /api/listings/:id
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listings.findByPk(id, {
      include: [{ model: Farmers, as: 'seller', attributes: ['id', 'fullname', 'email', 'phone'] }]
    });
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: 'Error', error: err.message });
  }
};

// POST /api/listings  (farmer only)
exports.create = async (req, res) => {
  try {
    const identity = req.identity; // from auth middleware
    if (!identity || identity.role !== 'farmer') return res.status(403).json({ message: 'Only farmers can create listings' });

    const payload = req.body;
    // ensure seller_id = identity.id
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
      location_geom: payload.location_geom ? { type: 'Point', coordinates: [payload.location_geom.lng, payload.location_geom.lat] } : null
    });

    res.status(201).json({ message: 'Listing created', listing: newListing });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Create failed', error: err.message });
  }
};

// PUT /api/listings/:id
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
    if (payload.location_geom) {
      payload.location_geom = { type: 'Point', coordinates: [payload.location_geom.lng, payload.location_geom.lat] };
    }

    await listing.update(payload);
    res.json({ message: 'Listing updated', listing });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};

// DELETE /api/listings/:id
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
