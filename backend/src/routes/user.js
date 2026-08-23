const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/profile', authMiddleware.authenticate, userController.getProfile);
router.put('/profile', authMiddleware.authenticate, userController.updateProfile);
router.put('/password', authMiddleware.authenticate, userController.changePassword);
router.get('/watchlist', authMiddleware.authenticate, userController.getWatchlist);
router.post('/watchlist', authMiddleware.authenticate, userController.addToWatchlist);
router.delete('/watchlist/:id', authMiddleware.authenticate, userController.removeFromWatchlist);
router.get('/reading-list', authMiddleware.authenticate, userController.getReadingList);
router.post('/reading-list', authMiddleware.authenticate, userController.addToReadingList);
router.delete('/reading-list/:id', authMiddleware.authenticate, userController.removeFromReadingList);

module.exports = router;
