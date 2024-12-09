const controller = {};

controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM usuario', (err, usuarios) => {
            if (err) {
                res.json(err);
            }
            res.render('usuarios', {
                usuarios,
                data: null,
                titulo: 'Catálogo de usuarios',
            });
        });
    });
};


controller.save = (req, res) => {
    const data = req.body;

    req.getConnection((err, conn) => {
        conn.query('INSERT INTO usuario SET ?', [data], (err, rows) => {
            res.redirect('/usview');
        });
    });
};

controller.delete = (req, res) => {
    const { id } = req.params;

    req.getConnection((err, conn) => {
        conn.query('DELETE FROM usuario WHERE idUsuario = ?', [id], (err, rows) => {
            res.redirect('/usview');
        });
    });
};

controller.edit = (req, res) => {
    const { id } = req.params;

    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM usuario WHERE idUsuario = ?', [id], (err, rows) => {
            if (err) {
                res.json(err);
            }
            conn.query('SELECT * FROM usuario', (err, usuarios) => {
                if (err) {
                    res.json(err);
                }
                res.render('usuarios', {
                    usuarios, 
                    data: rows[0],
                    titulo: 'Editar usuario',
                });
            });
        });
    });
};


controller.update = (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    req.getConnection((err, conn) => {
        conn.query('UPDATE usuario SET ? WHERE idUsuario = ?', [updatedData, id], (err, rows) => {
            if (err) {
                res.json(err);
            }
            res.redirect('/usview');
        });
    });
};



module.exports = controller;