const express = require('express');
const router = express.Router();
const mangaController = require('../controllers/mangaController');

router.get('/', mangaController.getList);
router.get('/popular', mangaController.getPopular);
router.get('/top-rated', mangaController.getTopRated);
router.get('/recent', mangaController.getRecent);
router.get('/sync/jikan/:id', mangaController.syncJikan);
router.get('/:id', mangaController.getById);
router.get('/:id/chapters', mangaController.getChapters);

module.exports = router;
