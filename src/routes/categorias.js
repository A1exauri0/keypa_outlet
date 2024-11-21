const express = require('express');
const router = express.Router();

const categoriasController = require('../controllers/categoriasController');

router.get('/catview', categoriasController.list); // ver categorias con get
router.get('/catdelete:id', categoriasController.delete); // eliminar categorias con post
router.get('/catsave', categoriasController.save); // ver categorias con get

router.get('/' , (req,res) => {
    res.send('Directorio Home');
});

module.exports = router;