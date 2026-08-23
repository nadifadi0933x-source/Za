const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware.authenticate, reviewController.create);
router.get('/content/:content_type/:content_id', reviewController.getByContent);
router.get('/user/:userId', reviewController.getByUser);
router.put('/:id', authMiddleware.authenticate, reviewController.updateReview);
router.delete('/:id', authMiddleware.authenticate, reviewController.removeReview);
router.post('/:id/helpful', authMiddleware.authenticate, reviewController.markHelpful);

module.exports = router;
