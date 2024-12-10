const express =require('express');
const path = require('path');
const morgan = require('morgan');
const mysql =require('mysql')
const myConnection = require('express-myconnection')
const session = require('express-session');

const app = express();

// importar rutas
const categoriasRoutes = require('./routes/categorias.js');
const marcasRoutes = require('./routes/marcas.js');
const productosRoutes = require('./routes/productos.js');
const usuariosRoutes = require('./routes/usuarios.js');
const indexRoutes = require('./routes/index.js');
const loginRoutes = require('./routes/login.js');
const carritoRoutes = require('./routes/carrito.js');
const pedidosRoutes = require('./routes/pedidos.js');


// Settings
app.set('port', process.env.PORT ||3000);
app.set('view engine','ejs');
app.set("views",path.join(__dirname,'views'));

// middleware
app.use(morgan('dev'));
app.use (myConnection(mysql, {
    host: 'localhost',
    user: 'root',
    password : 'Alexauri0',
    port : 3306,
    database: 'keypa_outlet'
}))
// middleware para parsear datos de formularios
app.use(express.urlencoded({extended: false}))
app.use(session({
    secret: 'alexauri0', // clave secreta única
    resave: false,
    saveUninitialized: false}));

// routes
app.use('/',categoriasRoutes);
app.use('/',marcasRoutes);
app.use('/',productosRoutes);
app.use('/',usuariosRoutes);
app.use('/',indexRoutes);
app.use('/',loginRoutes);
app.use('/',carritoRoutes);
app.use('/',pedidosRoutes);

//static files
app.use(express.static('public'));


// Inicializar el servidor
app.listen(app.get('port'), () => {
    console.log("Server in port 5000")
})
