const controller = {};

controller.list = (req,res) => {
    res.render('../views/categorias.ejs');
};

controller.delete = (req,res) => {
    res.send('eliminamos una categoria');
};

controller.save = (req,res) => {
    res.send('agregamos una categoria');
};

module.exports = controller;