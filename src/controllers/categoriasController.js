const controller = {};

controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM categoria', (err, categorias) => {
            if (err) {
                res.json(err);
            }
            res.render('categorias', {
                categorias,
                data: null,
                titulo: 'Catálogo de categorías',
            });
        });
    });
};


controller.save = (req, res) => {
    const data = req.body;

    req.getConnection((err, conn) => {
        conn.query('INSERT INTO categoria SET ?', [data], (err, rows) => {
            res.redirect('/catview');
        });
    });
};

controller.delete = (req, res) => {
    const { id } = req.params;

    req.getConnection((err, conn) => {
        conn.query('DELETE FROM categoria WHERE idCategoria = ?', [id], (err, rows) => {
            res.redirect('/catview');
        });
    });
};

controller.edit = (req, res) => {
    const { id } = req.params;

    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM categoria WHERE idCategoria = ?', [id], (err, rows) => {
            if (err) {
                res.json(err);
            }
            conn.query('SELECT * FROM categoria', (err, categorias) => {
                if (err) {
                    res.json(err);
                }
                res.render('categorias', {
                    categorias, 
                    data: rows[0],
                    titulo: 'Editar categoría',
                });
            });
        });
    });
};


controller.update = (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    req.getConnection((err, conn) => {
        conn.query('UPDATE categoria SET ? WHERE idCategoria = ?', [updatedData, id], (err, rows) => {
            if (err) {
                res.json(err);
            }
            res.redirect('/catview');
        });
    });
};



module.exports = controller;