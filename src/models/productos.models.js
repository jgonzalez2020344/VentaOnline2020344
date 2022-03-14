var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var productosSchema = Schema({
    nombre: String,
    precio: Number,
    cantidad: Number
})

module.exports = mongoose.model("Productos", productosSchema);