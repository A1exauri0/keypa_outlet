// routes/carrito.js
const express = require('express');
const router = express.Router();
const mysql = require('mysql');

// Ruta para agregar un producto al carrito
router.post('/agregar-al-carrito', (req, res) => {
    const { idProducto, nombre, precio, imagen } = req.body;

    // Inicializar el carrito si no existe
    if (!req.session.carrito) {
        req.session.carrito = [];
    }

    // Verificar si el producto ya está en el carrito
    const productoExistente = req.session.carrito.find(item => item.idProducto === idProducto);
    if (productoExistente) {
        // Si ya existe, sumar uno al contador
        productoExistente.cantidad += 1;
    } else {
        // Si no existe, agregarlo al carrito
        req.session.carrito.push({
            idProducto,
            nombre,
            precio,
            imagen,
            cantidad: 1
        });
    }

    res.redirect('/catalogo'); // Redirigir de nuevo al catálogo
});

// Ruta para mostrar el carrito
router.get('/carrito', (req, res) => {
    res.render('carrito', {
        carrito: req.session.carrito || []
    });
});

// ruta para hacer un pedido
router.post('/hacer-pedido', (req, res) => {
    const usuarioId = req.session.usuarioId;  // Obtener el ID de usuario desde la sesión

    if (!usuarioId) {
        return res.status(400).send('El ID del usuario es necesario');
    }

    // Supón que tienes el carrito guardado en la sesión también
    const carrito = req.session.carrito;
    const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

    // Insertar el pedido en la base de datos
    req.getConnection((err, connection) => {
        if (err) {
            console.log('Error al obtener la conexión:', err);
            return res.status(500).send('Error al obtener la conexión de la base de datos');
        }

        connection.query('INSERT INTO pedido (usuario_id, total) VALUES (?, ?)', [usuarioId, total], (err, result) => {
            if (err) {
                console.log('Error en la inserción del pedido:', err);
                return res.status(500).send('Error al insertar el pedido');
            }

            const pedidoId = result.insertId;

            // Insertar los detalles del pedido
            const detalles = carrito.map(item => [
                pedidoId,
                item.idProducto,
                item.cantidad,
                item.precio
            ]);

            connection.query('INSERT INTO detalles_pedido (pedido_id, producto_id, cantidad, precio) VALUES ?', [detalles], (err) => {
                if (err) {
                    console.log('Error al insertar los detalles del pedido:', err);
                    return res.status(500).send('Error al insertar los detalles del pedido');
                }

                // Vaciar el carrito después de realizar el pedido
                req.session.carrito = [];
                res.redirect('/pedido-confirmado');
            });
        });
    });
});


module.exports = router;
