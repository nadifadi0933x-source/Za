const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

router.get('/query', searchController.searchContent);
router.get('/suggestions', searchController.getSuggestions);
router.get('/filters', searchController.getFilters);
router.get('/trending', searchController.getTrending);
router.get('/recent', searchController.getRecent);

module.exports = router;
