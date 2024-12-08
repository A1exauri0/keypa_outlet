const controller = {};

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
    const data = req.body;
    console.log(data);
    req.getConnection((err, conn) => {
        conn.query('INSERT INTO producto SET ?', [data], (err, rows) => {
            res.redirect('/proview');
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
    const updatedData = req.body;

    req.getConnection((err, conn) => {
        conn.query('UPDATE producto SET ? WHERE idProducto = ?', [updatedData, id], (err, rows) => {
            if (err) {
                res.json(err);
            }
            res.redirect('/proview');
        });
    });
};



module.exports = controller;