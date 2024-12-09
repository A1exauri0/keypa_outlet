const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');

// Mostrar la lista de usuario
router.get('/usview', usuariosController.list);

// Agregar un nuevo usuario
router.post('/ussave', usuariosController.save);

// Eliminar un usuario
router.get('/usdelete/:id', usuariosController.delete);

// Obtener los datos a editar de un usuario
router.get('/usupdate/:id', usuariosController.edit);

// Actualizar los datos de un usuario
router.post('/usupdate/:id', usuariosController.update);

module.exports = router;

