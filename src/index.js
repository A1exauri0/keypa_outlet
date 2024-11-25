const express =require('express');
const path = require('path');
const morgan = require('morgan');
const mysql =require('mysql')
const myConnection = require('express-myconnection')

const app = express();

// importar rutas
const categoriasRoutes = require('./routes/categorias.js');

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


// routes
app.use('/',categoriasRoutes);


//static files
app.use(express.static(path.join(__dirname, 'public')));


// Inicializar el servidor
app.listen(app.get('port'), () => {
    console.log("Server in port 5000")
})
