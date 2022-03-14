var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var categoriaSchema = ({
    nombre: String,
    productos: [{type: Schema.ObjectId, ref:"Productos"}]
})

module.exports = mongoose.model("Categorias", categoriaSchema);