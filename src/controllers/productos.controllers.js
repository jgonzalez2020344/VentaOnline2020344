const Productos = require('../models/productos.models');
const Categorias = require('../models/categorias.models');

function agregarProductos(req, res){
    var idCategorias = req.params.idCategorias
    var parametros = req.body;
    var modeloProductos = new Productos();

    if(parametros.nombre && parametros.precio && parametros.cantidad ) {
        Categorias.findById(idCategorias, (err, categoriaEncontrada) => {
            if (err) return res.status(500).send({mensaje: 'Error en la peticion'});
            if (!categoriaEncontrada){
                return res.status(403).send({mensaje: 'Error al encontrar categorias'});
            } else {
                Productos.find({nombre: parametros.nombre}, (err, productoEncontrado) => {
                    if (err) return res.status(500).send({mensaje: 'Error en la peticion'});
                    if (!productoEncontrado) {
                        return res.status(403).send({mensaje:'Error al obtener productos'});
                    } else {
                        modeloProductos.nombre = parametros.nombre;
                        modeloProductos.precio = parametros.precio;
                        modeloProductos.cantidad = parametros.cantidad;
                        modeloProductos.save((err, productoEncontrado) => {
                            if (err) return res.status(500).send({mensaje: 'Error en la peticion'});
                            if (!productoEncontrado) {
                                return res.status(403).send({mensaje: 'Error al guardar producto'});
                            } else {
                                Categorias.findByIdAndUpdate(idCategorias, {$push:{productos: productoEncontrado._id}}, {new:true}, (err, categoriaActualizada) =>{
                                    if (err) return res.status(500).send({mensaje: 'Error en la peticion'});
                                    if (!categoriaActualizada) return res.status(403).send({mensaje: 'Error al actualizar categorias'});
                                    return res.status(200).send({productos: productoEncontrado})
                                }) 
                            }
                            
                        }) 
                    }
                })
            }
        })
    } else {
        return res.status(500).send({mensaje: 'Ingrese los parametros necesarios'});
    }
}

function obtenerProductos(req, res){
    Productos.find({}).exec((err, productosObtenidos) => {
        if (err) return res.status(500).send({mensaje: 'Error en la peticion'});
        if (!productosObtenidos) return res.status(404).send({mensaje: 'Error al obtener productos'});
        return res.status(200).send({productos: productosObtenidos});
    })
}

function buscarNProductos(req, res){
    var parametros = req.body;

    if(parametros.nombreP){
        Productos.find({nombre: parametros.nombreP}, (err, productosBuscados) =>{
            if (err) return res.status(500).send({mensaje: 'Error en la peticion'});
            if (!productosBuscados) return res.status(404).send({mensaje: 'Error al buscar productos'});
            return res.status(200).send({productos: productosBuscados});
        })
    } else if (parametros.nombreP == '') {
        Productos.find({}).exec((err, productosEncontrados) => {
            if (err) return res.status(500).send({mensaje: 'Error en la peticion' });
            if (!productosEncontrados) return res.status(404).send({mensaje: 'Error al encontrar productos'});
            return res.status(200).send({productos: productosEncontrados});
        })
    } else {
        return res.status(500).send({mensaje: 'Envie los parametros requeridos'})
    }
}

function actualizarProductos(req, res){
    var idCategorias = req.params.idCategorias;
    var idProductos = req.params.idProductos;
    var parametros = req.body;

    if(parametros.cantidad){
        Productos.findById(idProductos, (err, productosEncontrados) =>{
            if (err) return res.status(500).send({mensaje: 'Error en la peticion'});
            if (!productosEncontrados) {
                return res.status(404).send({mensaje: 'Error al encontrar productos'});
            } else {
                Categorias.find({_id:idCategorias, productos:idProductos}, (err, categoriasEncontradas) => {
                    if (err) return res.status(500).send({mensaje: 'Error en la peticion'});
                    if (!categoriasEncontradas) {
                        return res.status(404).send({mensaje: 'Error al encontrar categoria'});
                    } else {
                        Productos.findByIdAndUpdate(idProductos, parametros,{new:true}, (err, productoActualizado) => {
                            if (err) return res.status(500).send({mensaje: 'Error en la peticion'});
                            if (!productoActualizado) return res.status(403).send({mensaje: 'Error al actualizar productos'});
                            return res.status(200).send({productos: productoActualizado});
                        })
                    }
                })
            }
        })
    } else {
        return res.status(500).send({mensaje: 'Ingrese los parametros necesarios'})
    }
}

function eliminarProductos(req, res){
    var idCategorias = req.params.idCategorias;
    var idProductos = req.params.idProductos;

    Categorias.findOneAndUpdate({_id:idCategorias, productos:idProductos}, {$pull:{productos:idProductos}}, {new:true}, (err, categoriaActualizada) => {
        if (err) return res.status(500).send({mensaje:'Error en la peticion'});
        if (categoriaActualizada) {
            Productos.findByIdAndRemove(idProductos, (err, productoEliminado) => {
                if (err) return res.status(500).send({mensaje:'Error en la peticion'});
                if (!productoEliminado) return res.status(403).send({mensaje:'Error al eliminar productos'})
                return res.status(200).send({mensaje:'Producto eliminado con exito'});
            })
        } else {
            return res.status(500).send({mensaje: 'Error al actualizar categoria'});
        }
    })
}

function cantidadProductos(req, res){
    Productos.find({cantidad: 0}, (err, buscarCantidad) => {
        if (err) return res.status(500).send({mensaje: 'Error en la peticion'});
        if (!buscarCantidad) {
            return res.status(404).send({mensaje: 'Error al buscar cantidad'});
        } else {
            if(buscarCantidad != ''){
                return res.status(200).send({productos: buscarCantidad});
            } else {
                return res.status(404).send({mensaje: 'No esta agotado'});
            }
        }

    })
}

module.exports = {
    agregarProductos,
    obtenerProductos,
    buscarNProductos,
    actualizarProductos,
    eliminarProductos,
    cantidadProductos
}