const express = require('express');
const router = express.Router();

// Ruta para agregar un producto al carrito
router.post('/agregar-al-carrito', (req, res) => {
    const { idProducto, cantidad } = req.body;
    const idUsuario = req.session.usuarioId;

    if (!idUsuario) {
        return res.status(401).send('Por favor, inicie sesión');
    }

    req.getConnection((err, connection) => {
        if (err) return res.status(500).send('Error en la conexión a la base de datos');

        // Verificar si el usuario ya tiene un carrito activo
        connection.query('SELECT idCarrito FROM carrito WHERE idUsuario = ? AND estado = "activo"', [idUsuario], (err, rows) => {
            if (err) return res.status(500).send('Error al consultar el carrito');

            let carritoId = rows.length ? rows[0].idCarrito : null;

            if (!carritoId) {
                // Si no tiene carrito activo, crear uno nuevo
                connection.query('INSERT INTO carrito (idUsuario, estado) VALUES (?, "activo")', [idUsuario], (err, result) => {
                    if (err) return res.status(500).send('Error al crear el carrito');
                    carritoId = result.insertId;

                    // Añadir el producto al carrito
                    agregarProductoCarrito(connection, carritoId, idProducto, cantidad, res);
                });
            } else {
                // Si tiene carrito activo, añadir el producto al carrito
                agregarProductoCarrito(connection, carritoId, idProducto, cantidad, res);
            }
        });
    });
});

// Función para agregar el producto al carrito
function agregarProductoCarrito(connection, carritoId, idProducto, cantidad, res) {
    connection.query('SELECT * FROM productos_carrito WHERE idCarrito = ? AND idProducto = ?', [carritoId, idProducto], (err, rows) => {
        if (err) return res.status(500).send('Error al consultar productos en el carrito');

        if (rows.length > 0) {
            // Si el producto ya está en el carrito, actualizar la cantidad
            connection.query('UPDATE productos_carrito SET cantidad = cantidad + ? WHERE idCarrito = ? AND idProducto = ?', [cantidad, carritoId, idProducto], (err) => {
                if (err) return res.status(500).send('Error al actualizar la cantidad');
                res.redirect('/carrito'); // Redirigir al carrito
            });
        } else {
            // Si el producto no está en el carrito, agregarlo
            connection.query('INSERT INTO productos_carrito (idCarrito, idProducto, cantidad) VALUES (?, ?, ?)', [carritoId, idProducto, cantidad], (err) => {
                if (err) return res.status(500).send('Error al agregar el producto al carrito');
                res.redirect('/carrito'); // Redirigir al carrito
            });
        }
    });
}

// Ruta para mostrar el carrito
router.get('/carrito', (req, res) => {
    const idUsuario = req.session.usuarioId;

    if (!idUsuario) {
        return res.status(401).send('Por favor, inicie sesión');
    }

    req.getConnection((err, connection) => {
        if (err) return res.status(500).send('Error en la conexión a la base de datos');

        // Buscar el carrito activo del usuario
        connection.query('SELECT c.idCarrito, p.idProducto, p.nombre, p.precio, pc.cantidad FROM carrito c JOIN productos_carrito pc ON c.idCarrito = pc.idCarrito JOIN productos p ON pc.idProducto = p.idProducto WHERE c.idUsuario = ? AND c.estado = "activo"', [idUsuario], (err, rows) => {
            if (err) return res.status(500).send('Error al obtener el carrito');

            let total = 0;
            rows.forEach(item => {
                total += item.precio * item.cantidad;
            });

            res.render('carrito', { productos: rows, total: total });
        });
    });
});

// Ruta para finalizar el carrito
router.post('/finalizar-carrito', (req, res) => {
    const idUsuario = req.session.usuarioId;

    if (!idUsuario) {
        return res.status(401).send('Por favor, inicie sesión');
    }

    req.getConnection((err, connection) => {
        if (err) return res.status(500).send('Error en la conexión a la base de datos');

        // Finalizar el carrito cambiando el estado
        connection.query('UPDATE carrito SET estado = "finalizado" WHERE idUsuario = ? AND estado = "activo"', [idUsuario], (err) => {
            if (err) return res.status(500).send('Error al finalizar el carrito');
            res.send('Carrito finalizado');
        });
    });
});

module.exports = router;
