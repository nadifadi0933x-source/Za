const express = require('express');
const router = express.Router();
const manhwaController = require('../controllers/manhwaController');

router.get('/', manhwaController.getList);
router.get('/popular', manhwaController.getPopular);
router.get('/top-rated', manhwaController.getTopRated);
router.get('/recent', manhwaController.getRecent);
router.get('/sync/jikan/:id', manhwaController.syncJikan);
router.get('/:id', manhwaController.getById);
router.get('/:id/chapters', manhwaController.getChapters);

module.exports = router;
