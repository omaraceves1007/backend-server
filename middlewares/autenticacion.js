var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

// ========================================
//      Verificar Token
// ========================================

exports.verifivaToken = function(req, res, next) {

        var token = req.query.token;

        jwt.verify(token, SEED, (err, decoded) => {

            if (err) {
                return res.status(401).json({
                    ok: false,
                    mensaje: 'Token Incorrecto',
                    errors: err
                });
            }

            req.usuario = decoded.usuario;

            next();

        });
    }
    // ========================================
    //      Verificar Admin
    // ========================================

exports.verificaAdminRole = function(req, res, next) {

        var usuario = req.usuario;

        if (usuario.role === 'ADMIN_ROLE') {
            next();
        } else {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token Incorrecto',
                errors: { message: 'No es admin' }
            });
        }
    }
    // ========================================
    //      Verificar Admin o Mismo usuario
    // ========================================

exports.verificaAdminMismoUsuario = function(req, res, next) {

    var usuario = req.usuario;
    var id = req.params.id;

    if (usuario.role === 'ADMIN_ROLE' || usuario._id === id) {
        next();
    } else {
        return res.status(401).json({
            ok: false,
            mensaje: 'Token Incorrecto',
            errors: { message: 'No es admin' }
        });
    }
}