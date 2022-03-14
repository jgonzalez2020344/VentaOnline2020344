var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var usuariosSchema = Schema ({
    usuario: String,
    password: String,
    email: String,
    rol: String,
    facturas: [{type: Schema.ObjectId, ref:"Facturas"}]
})

module.exports = mongoose.model("Usuarios",usuariosSchema);