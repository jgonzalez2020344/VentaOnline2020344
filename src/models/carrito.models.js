var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var carritoSchema = ({
    compra: Boolean,
    dueño: {type: Schema.ObjectId, ref:"Usuarios"},
    productos: [{type: Schema.ObjectId, ref:"Productos"}],
    cantidad: [Number]
})

module.exports = mongoose.model("Carrito", carritoSchema);