// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');


// inicializar variables

var app = express();


// CORS

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
});

// body parser

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
    // parse application/json
app.use(bodyParser.json())



//importar ruta
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var hospitalRoutes = require('./routes/hospital');
var medicoRoutes = require('./routes/medico');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenes');



//Conexion a l abase de datos

mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) throw err;
    // console.log('Base de Datos: \x1b[34m%s\x1b', 'online');
    console.log('Base de Datos: online');
});

// Server index config muestra archivos de la carpeta
// var serveIndex = require('serve-index');
// app.use(express.static(__dirname + '/'));
// app.use('/uploads', serveIndex(__dirname + '/uploads'));

// Rutas
app.use('/imagenes', imagenesRoutes);
app.use('/upload', uploadRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/medico', medicoRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);



// Escuchar peticiones

app.listen(3000, () => {
    // console.log('Express Server Corriendo en 3000: \x1b[32m %s\x1b', ' online ');
    console.log('Express Server Corriendo en 3000: online ');

});

// Colores Consola
// Reset = "\x1b[0m"

// Bright = "\x1b[1m"

// Dim = "\x1b[2m"

// Underscore = "\x1b[4m"

// Blink = "\x1b[5m"

// Reverse = "\x1b[7m"

// Hidden = "\x1b[8m"

// FgBlack = "\x1b[30m"

// FgRed = "\x1b[31m"

// FgGreen = "\x1b[32m"

// FgYellow = "\x1b[33m"

// FgBlue = "\x1b[34m"

// FgMagenta = "\x1b[35m"

// FgCyan = "\x1b[36m"

// FgWhite = "\x1b[37m"

// BgBlack = "\x1b[40m"

// BgRed = "\x1b[41m"

// BgGreen = "\x1b[42m"

// BgYellow = "\x1b[43m"

// BgBlue = "\x1b[44m"

// BgMagenta = "\x1b[45m"

// BgCyan = "\x1b[46m"

// BgWhite = "\x1b[47m"