const express = require('express');
const router = express.Router();
const chapterController = require('../controllers/chapterController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware.authenticate, chapterController.create);
router.get('/:id', chapterController.getById);
router.put('/:id', authMiddleware.authenticate, chapterController.update);
router.delete('/:id', authMiddleware.authenticate, chapterController.remove);

module.exports = router;
