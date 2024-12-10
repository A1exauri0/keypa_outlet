const controller = {};

controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM pedido', (err, pedidos) => {
            if (err) {
                return res.json(err);
            }
            res.render('pedidos', {
                pedidos,
                titulo: 'Catálogo de Pedidos',
            });
        });
    });
};




module.exports = controller;