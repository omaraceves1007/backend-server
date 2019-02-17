var mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");

var Schema = mongoose.Schema;

var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un role permitido'
}


var UsuarioSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es Necesario'] },
    email: { type: String, unique: true, required: [true, 'El correo es Necesario'] },
    password: { type: String, required: [true, 'El password es Necesario'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos }
});

UsuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' });

module.exports = mongoose.model('usuario', UsuarioSchema);