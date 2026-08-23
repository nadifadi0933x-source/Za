const express = require('express');
const router = express.Router();
const episodeController = require('../controllers/episodeController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware.authenticate, episodeController.create);
router.get('/:id', episodeController.getById);
router.put('/:id', authMiddleware.authenticate, episodeController.update);
router.delete('/:id', authMiddleware.authenticate, episodeController.remove);
router.get('/:id/stream', episodeController.streamVideo);

module.exports = router;
