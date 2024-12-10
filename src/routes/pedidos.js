const express = require('express');
const router = express.Router();
const pedidosController = require('../controllers/pedidosController');

// Mostrar la lista de pedidos
router.get('/peview', pedidosController.list);

module.exports = router;

