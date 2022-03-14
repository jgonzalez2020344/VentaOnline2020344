var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var facturasSchema = ({
    nombre: String,
    productos: [{type: Schema.ObjectId, ref:"Productos"}]
})

module.exports = mongoose.model("Facturas", facturasSchema);