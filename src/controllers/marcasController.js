const controller = {};

controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM marca', (err, marcas) => {
            if (err) {
                res.json(err);
            }
            res.render('marcas', {
                marcas,
                data: null,
                titulo: 'Catálogo de marcas',
            });
        });
    });
};


controller.save = (req, res) => {
    const data = req.body;

    req.getConnection((err, conn) => {
        conn.query('INSERT INTO marca SET ?', [data], (err, rows) => {
            res.redirect('/marview');
        });
    });
};

controller.delete = (req, res) => {
    const { id } = req.params;

    req.getConnection((err, conn) => {
        conn.query('DELETE FROM marca WHERE idMarca = ?', [id], (err, rows) => {
            res.redirect('/marview');
        });
    });
};

controller.edit = (req, res) => {
    const { id } = req.params;

    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM marca WHERE idMarca = ?', [id], (err, rows) => {
            if (err) {
                res.json(err);
            }
            conn.query('SELECT * FROM marca', (err, marcas) => {
                if (err) {
                    res.json(err);
                }
                res.render('marcas', {
                    marcas, 
                    data: rows[0],
                    titulo: 'Editar marca',
                });
            });
        });
    });
};


controller.update = (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    req.getConnection((err, conn) => {
        conn.query('UPDATE marca SET ? WHERE idMarca = ?', [updatedData, id], (err, rows) => {
            if (err) {
                res.json(err);
            }
            res.redirect('/marview');
        });
    });
};



module.exports = controller;