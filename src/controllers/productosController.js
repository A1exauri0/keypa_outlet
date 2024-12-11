const path = require('path');
const multer = require('multer');
const controller = {};

// Configurar multer para guardar imágenes en la carpeta `public/uploads`
const storage = multer.diskStorage({
    destination: path.join(__dirname, '../../public/uploads'), // Carpeta correcta
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Nombre único
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb("Error: El archivo debe ser una imagen válida (jpeg, jpg, png, gif)");
    }
}).single('imagen'); // Nombre del campo en el formulario


controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.json(err);
        conn.query('SELECT * FROM producto', (err, productos) => {
            if (err) return res.json(err);
            conn.query('SELECT * FROM marca', (err, marcas) => {
                if (err) return res.json(err);
                conn.query('SELECT * FROM categoria', (err, categorias) => {
                    if (err) return res.json(err);
                    res.render('productos', {
                        productos,
                        marcas,
                        categorias,
                        data: null,
                        titulo: 'Catálogo de productos',
                    });
                });
            });
        });
    });
};

controller.save = (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.json({ error: err });
        }
        const data = req.body;
        if (req.file) {
            data.imagen = `/uploads/${req.file.filename}`; // Guardar la ruta de la imagen
        }

        req.getConnection((err, conn) => {
            conn.query('INSERT INTO producto SET ?', [data], (err, rows) => {
                if (err) return res.json(err);
                res.redirect('/proview');
            });
        });
    });
};

controller.delete = (req, res) => {
    const { id } = req.params;

    req.getConnection((err, conn) => {
        conn.query('DELETE FROM producto WHERE idProducto = ?', [id], (err, rows) => {
            res.redirect('/proview');
        });
    });
};

controller.edit = (req, res) => {
    const { id } = req.params;

    req.getConnection((err, conn) => {
        if (err) return res.json(err);

        conn.query('SELECT * FROM producto WHERE idProducto = ?', [id], (err, rows) => {
            if (err) return res.json(err);

            conn.query('SELECT * FROM marca', (err, marcas) => {
                if (err) return res.json(err);
                conn.query('SELECT * FROM categoria', (err, categorias) => {
                    if (err) return res.json(err);
                    conn.query('SELECT * FROM producto', (err, productos) => {
                        if (err) return res.json(err);

                        res.render('productos', {
                            productos,
                            marcas,
                            categorias,
                            data: rows[0],
                            titulo: 'Editar producto',
                        });
                    });
                });
            });
        });
    });
};

controller.update = (req, res) => {
    const { id } = req.params;

    upload(req, res, (err) => {
        if (err) {
            return res.json({ error: err });
        }
        const updatedData = req.body;
        if (req.file) {
            updatedData.imagen = `/uploads/${req.file.filename}`;
        }

        req.getConnection((err, conn) => {
            conn.query('UPDATE producto SET ? WHERE idProducto = ?', [updatedData, id], (err, rows) => {
                if (err) {
                    res.json(err);
                }
                res.redirect('/proview');
            });
        });
    });
};

module.exports = controller;
