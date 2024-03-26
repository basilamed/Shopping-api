const express = require('express');
const TypeController = require('../controllers/typeController');
const router = express.Router();

router.post('/add', TypeController.addType);
router.get('/get-all', TypeController.getAllTypes);

module.exports = router;
