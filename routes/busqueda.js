//ruta Principal
var express = require('express');

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

var app = express();

// ========================================
//     	Buscar En todas las Colecciones 
// ========================================

app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    Promise.all([buscarHospitales(regex),
            buscarMedicos(regex),
            buscarUsuarios(regex)
        ])
        .then(respuestas => {
            res.status(200).json({
                ok: true,
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2]
            });
        });

});
// ========================================
//     	Buscar por Coleccion 
// ========================================

app.get('/:tabla/:busqueda', (req, res) => {

    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var regex = new RegExp(busqueda, 'i');
    var rebusqueda;

    if (tabla === 'hospitales') {
        rebusqueda = buscarHospitales(regex);
    } else if (tabla === 'medicos') {
        rebusqueda = buscarMedicos(regex);
    } else if (tabla === 'usuarios') {
        rebusqueda = buscarUsuarios(regex);
    } else {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de busqueda invalido'
        });
    }

    rebusqueda.then(respuesta => {
        res.status(200).json({
            ok: true,
            [tabla]: respuesta
        });
    });

});

// ========================================
//     	Buscar en Hospitales 
// ========================================

function buscarHospitales(regex) {

    return new Promise((resolve, reject) => {
        Hospital.find({ 'nombre': regex })
            .populate('usuario', 'nombre email')
            .exec((err, hospitales) => {
                if (err) {
                    reject('Error al cargar hospitales', err);
                } else {
                    resolve(hospitales);
                }
            });
    });

}

// ========================================
//     	Buscar en Medicos 
// ========================================

function buscarMedicos(regex) {

    return new Promise((resolve, reject) => {
        Medico.find({ 'nombre': regex })
            .populate('usuario', 'nombre email')
            .populate('hospital')
            .exec((err, medicos) => {
                if (err) {
                    reject('Error al cargar medicos', err);
                } else {
                    resolve(medicos);
                }
            });
    });

}

// ========================================
//     	Buscar en Usuarios 
// ========================================

function buscarUsuarios(regex) {

    return new Promise((resolve, reject) => {
        Usuario.find({}, 'nombre email role')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('Error al cargar usuarios', err);
                } else {
                    resolve(usuarios);
                }
            });
    });

}

module.exports = app;