//ruta Principal
var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');

var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');

var app = express();

app.use(fileUpload());


app.put('/:tipo/:id', function(req, res, next) {

    var tipo = req.params.tipo;
    var id = req.params.id;

    //Tipos de Coleccion

    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de Colección no es válida',
            errors: { message: 'Tipo de Colección no es válida' }
        });
    }
    // Existen archivos
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada',
            errors: { message: 'debe de seleciconar una imagen' }
        });
    }
    // nombre archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extencionArchivo = nombreCortado[nombreCortado.length - 1];

    // validar Extenciones
    var extencionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extencionesValidas.indexOf(extencionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extencion no valida',
            errors: { message: 'Las extenciones validas son ' + extencionesValidas.join(', ') }
        });
    }

    //Nombre personalizado

    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extencionArchivo}`;

    //Mover Archivo a path especifico

    var path = `./uploads/${tipo}/${nombreArchivo}`;

    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover ARchivo',
                errors: err
            });
        }
    });


    subirPorTipo(tipo, id, nombreArchivo, res);


});

function subirPorTipo(tipo, id, nombreArchivo, res) {

    if (tipo === 'usuarios') {
        Usuario.findById(id, (err, usuario) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No existe Usuario con id: ' + id,
                    errors: err
                });
            }

            var pathViejo = './uploads/usuarios/' + usuario.img;
            // si Existe Elimina imagen anterior
            if (fs.existsSync(pathViejo) && usuario.img.length > 0) {
                fs.unlinkSync(pathViejo);
            }

            usuario.img = nombreArchivo;

            usuario.save((err, usuarioActualizado) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al Actualizar Imagen',
                        errors: err
                    });
                }
                usuarioActualizado.password = '--';
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario Actualizada',
                    usuario: usuarioActualizado

                });
            });
        });
    }
    if (tipo === 'medicos') {
        Medico.findById(id, (err, medico) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No existe medico con id: ' + id,
                    errors: err
                });
            }

            var pathViejo = './uploads/medicos/' + medico.img;
            // si Existe Elimina imagen anterior
            if (fs.existsSync(pathViejo) && medico.img.length > 0) {
                fs.unlinkSync(pathViejo);
            }

            medico.img = nombreArchivo;

            medico.save((err, medicoActualizado) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al Actualizar Imagen',
                        errors: err
                    });
                }

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de medico Actualizada',
                    medico: medicoActualizado

                });
            });
        });
    }
    if (tipo === 'hospitales') {
        Hospital.findById(id, (err, hospital) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No existe hospital con id: ' + id,
                    errors: err
                });
            }

            var pathViejo = './uploads/hospitales/' + hospital.img;
            // si Existe Elimina imagen anterior
            if (fs.existsSync(pathViejo) && hospital.img.length > 0) {
                fs.unlinkSync(pathViejo);
            }

            hospital.img = nombreArchivo;

            hospital.save((err, hospitalActualizado) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al Actualizar Imagen',
                        errors: err
                    });
                }

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de hospital Actualizada',
                    hospital: hospitalActualizado

                });
            });
        });
    }

}



module.exports = app;