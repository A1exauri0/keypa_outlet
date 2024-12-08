const express = require('express');
const router = express.Router();
const categoriasController = require('../controllers/categoriasController');

// Mostrar la lista de categorías
router.get('/catview', categoriasController.list);

// Agregar una nueva categoría
router.post('/catsave', categoriasController.save);

// Eliminar una categoría
router.get('/catdelete/:id', categoriasController.delete);

// Obtener los datos a editar de una categoría
router.get('/catupdate/:id', categoriasController.edit);

// Actualizar los datos de una categoría
router.post('/catupdate/:id', categoriasController.update);

module.exports = router;

