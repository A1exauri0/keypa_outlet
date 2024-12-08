const express = require('express');
const router = express.Router();
const marcasController = require('../controllers/marcasController');

// Mostrar la lista de marcas
router.get('/marview', marcasController.list);

// Agregar una nueva marca
router.post('/marsave', marcasController.save);

// Eliminar una marca
router.get('/mardelete/:id', marcasController.delete);

// Obtener los datos a editar de una marca
router.get('/marupdate/:id', marcasController.edit);

// Actualizar los datos de una marca
router.post('/marupdate/:id', marcasController.update);

module.exports = router;

