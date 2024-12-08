const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productosController');

// Mostrar la lista de categorías
router.get('/proview', productosController.list);

// Agregar una nueva categoría
router.post('/prosave', productosController.save);

// Eliminar una categoría
router.get('/prodelete/:id', productosController.delete);

// Obtener los datos a editar de una categoría
router.get('/proupdate/:id', productosController.edit);

// Actualizar los datos de una categoría
router.post('/proupdate/:id', productosController.update);

module.exports = router;

