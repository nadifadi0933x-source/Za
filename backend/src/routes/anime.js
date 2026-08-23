const express = require('express');
const router = express.Router();
const animeController = require('../controllers/animeController');

router.get('/', animeController.getList);
router.get('/trending', animeController.getTrending);
router.get('/top-rated', animeController.getTopRated);
router.get('/recent', animeController.getRecent);
router.get('/similar/:id', animeController.getSimilar);
router.get('/sync/anilist/:id', animeController.syncAnilist);
router.get('/sync/jikan/:id', animeController.syncJikan);
router.get('/:id', animeController.getById);
router.get('/:id/episodes', animeController.getEpisodes);

module.exports = router;
