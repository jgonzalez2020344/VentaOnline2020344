const Carrito = require('../models/carrito.models');
const Productos = require('../models/productos.models');

function agregarACarrito (req, res){
    var idProductos = req.params.idProductos;
    var idUsuarios = req.user.sub;
    var parametros = req.body;

    if(parametros.cantidad){
        Productos.findById(idProductos,(err, productosEncontrados) =>{
            if (err) return res.status(500).send({mensaje: 'Error en la peticion 1'});
            if (!productosEncontrados) {
                return res.status(404).send({mensaje: 'Error al encontrar productos'});
            } else {
                if(parametros.cantidad > productosEncontrados.cantidad){
                    return res.status(404).send({mensaje: 'Cantidad mayor a lo existente'});
                } else {
                    Carrito.findOneAndUpdate({dueño: idUsuarios}, {$push:{productos: productosEncontrados._id, cantidad: parametros.cantidad}}, {new:true}, (err, carritoActualizado) => {
                        if (err) return res.status(500).send({mensaje: 'Error en la peticion 2'});
                        if (!carritoActualizado) return res.status(404).send({mensaje: 'Error al actualizar carrito'});
                        return res.status(200).send({carrito: carritoActualizado});
                    });
                } 
            } 

        })
    } else {
        return res.status(500).send({mensaje: 'Envie los parametros necesarios'});
    }
}

module.exports = {
    agregarACarrito
} 