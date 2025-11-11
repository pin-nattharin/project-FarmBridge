// routes/listing.routes.js
const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listing.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { checkRole } = require('../middleware/role.middleware');

router.get('/', listingController.getAll);
router.get('/:id', listingController.getById);

// protected routes
router.post('/', authenticateToken, checkRole('farmer'), listingController.create);
router.put('/:id', authenticateToken, checkRole('farmer'), listingController.update);
router.delete('/:id', authenticateToken, checkRole('farmer'), listingController.remove);

module.exports = router;
