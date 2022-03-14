const Categorias = require('../models/categorias.models');

function categoriaDefault() {
    var nombreC = 'DEFAULT'
    var modeloCategorias = new Categorias();

    Categorias.findOne({ nombre: nombreC }, (err, categoriaEncontrada) => {
        if (err) return console.log('Error en la peticion', err);
        if (!categoriaEncontrada) {
            modeloCategorias.nombre = 'DEFAULT';

            modeloCategorias.save((err, categoriasGuardadas) => {
                if (err) return console.log('Error en la peticion')
                if (!categoriasGuardadas) return console.log('Error al guardar categorias')
                return console.log('Categoria Default Creada');
            })
        } else {
            return console.log('Categoria Default ya existente');
        }

    })
}

function agregarCategoria(req, res) {
    var parametros = req.body;
    var modeloCategorias = new Categorias();

    if (parametros.nombre) {
        Categorias.findOne({ nombre: parametros.nombre }, (err, categoriaEncontrada) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if (categoriaEncontrada) {
                return res.status(403).send({ mensaje: 'Categoria ya en uso' });
            } else {
                modeloCategorias.nombre = parametros.nombre;

                modeloCategorias.save((err, categoriasGuardadas) => {
                    if (err) return res.status(500).send({ mensaje: 'Error en la peticion' })
                    if (!categoriasGuardadas) return res.status(403).send({ mensaje: 'Error al guardar Categorias' })
                    return res.status(200).send({ categorias: categoriasGuardadas });
                })
            }
        })
    } else {
        return res.status(404).send({ mensaje: 'Envie los parametros necesarios' });
    }
}

function obtenerCategorias(req, res) {
    Categorias.find({}, (err, categoriasObtenidas) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!categoriasObtenidas) return res.status(403).send({ mensaje: 'Error al obtener categorias' });
        return res.status(200).send({ categorias: categoriasObtenidas });
    })
}

function buscarPorCategorias(req, res) {
    var parametros = req.body;

    if (parametros.nombreC) {
        Categorias.find({ nombre: parametros.nombreC }, (err, categoriasBuscadas) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion 1 ' });
            if (!categoriasBuscadas) {
                return res.status(403).send({ mensaje: 'Error al buscar categoria' });
            } else {
                if (categoriasBuscadas == '') {
                    return res.status(500).send({ mensaje: 'Categoria Inexistente' })
                } else {
                    return res.status(200).send({ categorias: categoriasBuscadas });
                }
            }
        })

    } else if (parametros.nombreC == '') {
        Categorias.find({}).exec((err, categoriasEncontradas) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion 2' });
            if (!categoriasEncontradas) return res.status(403).send({ mensaje: 'Error al encontrar categorias encontradas' });
            return res.status(200).send({ categorias: categoriasEncontradas })
        })
    } else {
        return res.status(500).send({ mensaje: 'Ingrese los parametros necesarios' })
    }

}

function actualizarCategorias(req, res) {
    var idCategorias = req.params.idCategorias;
    var parametros = req.body;

    if (parametros.nombre){
        Categorias.findOne({nombre: parametros.nombre}, (err, categoriaEncontrada) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if (!categoriaEncontrada) {
                Categorias.findByIdAndUpdate(idCategorias, parametros, {new:true}, (err, categoriasEditadas) =>{
                    if (err) return res.status(err).send({mensaje:'Error en la peticion'});
                    if (!categoriasEditadas) {
                        return res.status(403).send({mensaje:'Error al editar categorias'})
                    } else {
                        return res.status(200).send({categorias: categoriasEditadas});
                    }
                })
            } else {
                return res.status(403).send({mensaje: 'Error al encontrar categoria'});
            }
        })
    } else {
        return res.status(500).send({mensaje: 'Envie los parametros necesarios'})
    }
}

function eliminarCategorias(req, res){
    var idCategorias = req.params.idCategorias;
    

    Categorias.findOne({_id: idCategorias}, (err, categoriasEncontradas) => {
        if (err) return res.status(500).send({mensaje: 'Error en la peticion'});
        if (!categoriasEncontradas) {
            return res.status(500).send({mensaje: 'Error en la categoria'});
        } else {
            var prod = categoriasEncontradas.productos;
            Categorias.findOneAndUpdate({nombre: 'DEFAULT'}, {$push:{productos:prod}}, {new:true}, (err, categoriasEliminadas) => {
                if (err) return res.status(500).send({mensaje: 'Error en la peticion'});
                if (!categoriasEliminadas) {
                    return res.status(403).send({mensaje: 'Error al actualizar categorias'});
                } else {
                    Categorias.findByIdAndDelete(idCategorias, (err, categoriasEliminadas) => {
                        if (err) return res.status(500).send({mensaje: 'Error al hacer la peticion'});
                        if (!categoriasEliminadas) return res.status(403).send({mensaje: 'Error al eliminar categorias'})
                        return res.status(200).send({mensaje: 'Categoria eliminada con exito'});
                    })
                }
                
            })
        }
    })
}



module.exports = {
    categoriaDefault,
    agregarCategoria,
    obtenerCategorias,
    buscarPorCategorias,
    actualizarCategorias,
    eliminarCategorias
}