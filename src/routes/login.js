const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

// Ruta para mostrar el formulario de registro
router.get('/register', (req, res) => {
    res.render('register');
});

// Ruta para manejar el registro
router.post('/register', (req, res) => {
    const { nombre, email, password, telefono, direccion, rol } = req.body;
    
    // Asignar 'cliente' como rol por defecto si no se pasa en el cuerpo de la solicitud
    const userRole = rol || 'cliente';

    const hashedPassword = bcrypt.hashSync(password, 10);
    const sql = 'INSERT INTO usuario (nombre, email, password, telefono, direccion, rol) VALUES (?, ?, ?, ?, ?, ?)';

    req.getConnection((err, conn) => {
        if (err) {
            console.error('Error en la conexión:', err);
            return res.status(500).send('Error en la conexión');
        }

        conn.query(sql, [nombre, email, hashedPassword, telefono, direccion, userRole], (err) => {
            if (err) {
                console.error('Error al registrar:', err);
                return res.status(500).send('Error al registrar');
            }
            res.redirect('/login'); // Redirige al login después de registrar exitosamente
        });
    });
});


// Ruta para mostrar el formulario de login
router.get('/login', (req, res) => {
    res.render('login');
});

// Ruta para manejar el inicio de sesión
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM usuario WHERE email = ?';

    req.getConnection((err, conn) => {
        if (err) {
            console.error('Error en la conexión:', err);
            return res.status(500).send('Error en la conexión');
        }

        conn.query(sql, [email], (err, results) => {
            if (err) {
                console.error('Error al buscar el usuario:', err);
                return res.status(500).send('Error al buscar el usuario');
            }

            if (results.length === 0) {
                return res.status(401).send('Correo o contraseña incorrectos');
            }

            const user = results[0];
            const isPasswordValid = bcrypt.compareSync(password, user.password);

            if (!isPasswordValid) {
                return res.status(401).send('Correo o contraseña incorrectos');
            }

            // Guardar datos del usuario en la sesión
            req.session.user = {
                id: user.id,
                nombre: user.nombre,
                email: user.email,
                rol: user.rol
            };

            // Redirigir según el rol del usuario
            if (user.rol === 'admin') {
                return res.redirect('/inicio');
            } else {
                return res.redirect('/catalogo');
            }
        });
    });
});


// Ruta para manejar el cierre de sesión
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
            return res.status(500).send('Error al cerrar sesión');
        }
        res.redirect('/login'); // Redirige al formulario de login
    });
});


module.exports = router;
