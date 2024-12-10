const express = require('express');
const router = express.Router();

// Cambia la ruta de importación para que apunte a la ubicación correcta de isAuthenticated.js
const isAuthenticated = require('../../middleware/isAuthenticated.js');
// Ruta de inicio (solo accesible para usuarios autenticados)
router.get('/inicio', isAuthenticated, (req, res) => {
    // Aquí puedes acceder a los datos del usuario desde la sesión
    if (req.session.user && req.session.user.rol === 'admin') {
        res.render('inicio', { user: req.session.user, titulo: 'Inicio' });
    } else {
        // Si el usuario no es admin, lo redirigimos a otra página
        res.redirect('/catalogo');
    }
});

// Ruta de catálogo (solo accesible para usuarios autenticados)
router.get('/catalogo', isAuthenticated, (req, res) => {
    // Verificar si el usuario tiene rol de cliente
    if (req.session.user && req.session.user.rol === 'cliente') {
        
        // Obtener los parámetros de filtrado (si existen)
        const categoriaSeleccionada = req.query.categoria || '';
        const marcaSeleccionada = req.query.marca || '';

        // Obtener las categorías y marcas desde la base de datos
        req.getConnection((err, connection) => {
            if (err) {
                console.error('Error al obtener conexión:', err);
                return res.status(500).send('Error al obtener conexión');
            }

            // Consulta para obtener las categorías
            connection.query('SELECT * FROM categoria', (err, categorias) => {
                if (err) {
                    console.error('Error al obtener categorías:', err);
                    return res.status(500).send('Error al obtener categorías');
                }

                // Consulta para obtener las marcas
                connection.query('SELECT * FROM marca', (err, marcas) => {
                    if (err) {
                        console.error('Error al obtener marcas:', err);
                        return res.status(500).send('Error al obtener marcas');
                    }

                    // Consulta para obtener los productos filtrados
                    let sql = 'SELECT p.*, c.nombre as categoria, m.nombre as marca FROM producto p ' +
                              'JOIN categoria c ON p.idCategoria = c.idCategoria ' +
                              'JOIN marca m ON p.idMarca = m.idMarca WHERE 1';

                    const params = [];
                    
                    if (categoriaSeleccionada) {
                        sql += ' AND p.idCategoria = ?';
                        params.push(categoriaSeleccionada);
                    }

                    if (marcaSeleccionada) {
                        sql += ' AND p.idMarca = ?';
                        params.push(marcaSeleccionada);
                    }

                    // Ejecutar la consulta de productos
                    connection.query(sql, params, (err, productos) => {
                        if (err) {
                            console.error('Error al obtener productos:', err);
                            return res.status(500).send('Error al obtener productos');
                        }

                        // Pasar los datos a la vista
                        res.render('catalogo', {
                            user: req.session.user,
                            categorias,
                            marcas,
                            productos,
                            categoriaSeleccionada,
                            marcaSeleccionada
                        });
                    });
                });
            });
        });
    } else {
        // Si el usuario no es cliente, lo redirigimos a la página de inicio
        res.redirect('/inicio');
    }
});
module.exports = router;
