const Usuarios = require('../models/usuarios.models');
const Carrito = require('../models/carrito.models');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');

function crearCarrito(usuariosGuardados) {
    var carrito = new Carrito();

    carrito.compra = false;
    carrito.dueño = usuariosGuardados._id;
    carrito.save((err, carritoGuardado) => {
        if (err) return console.log(err);
        if (!carritoGuardado) return console.log('Error al crear Carrito');
        return console.log('Carrito creado', carritoGuardado);
    })
}


function registrarAdmin() {
    var modeloUsuarios = new Usuarios();

    Usuarios.find({ usuario: 'ADMIN' }, (err, nombreEncontrado) => {
        if (nombreEncontrado.length > 0) {
            return console.log('El Admin ya esta creado');
        } else {
            modeloUsuarios.usuario = 'ADMIN';
            modeloUsuarios.email = 'admin@admin.com';
            modeloUsuarios.password = '123456'
            modeloUsuarios.rol = 'ADMIN'

            bcrypt.hash('123456', null, null, (err, passwordEnciptada) => {
                modeloUsuarios.password = passwordEnciptada;

                modeloUsuarios.save((err, adminGuardado) => {
                    if (err) return console.log({ mensaje: 'Error en la peticion' });
                    if (!adminGuardado) {
                        return console.log({ mensaje: 'Error al guardar Admin' });
                    } else { 
                        crearCarrito(adminGuardado);
                        return console.log('Admin:' + ' ' + adminGuardado); 
                    }
                })
            })
        }
    })
}

function login(req, res) {
    var parametros = req.body

    Usuarios.findOne({usuario:parametros.usuario}, (err, adminEncontrado) => {
        if (err) res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!adminEncontrado) {
            return res.status(500).send({ mensaje: 'Error al encontrar usuario' });
        } else {
            bcrypt.compare(parametros.password, adminEncontrado.password, (err, verificacionPassword) => {
                if (err) res.status(500).send({mensaje: 'Error en la peticion'});
                if (!verificacionPassword) res.status(404).send({mensaje: 'Error al verificar contraseña'});
                return res.status(200).send({ token: jwt.crearToken(adminEncontrado) });   
            })
        }
    })
}

function agregarUsuarios(req, res) {
    var parametros = req.body;
    var modeloUsuarios = new Usuarios();

    if (parametros.usuario && parametros.password && parametros.email) {
        Usuarios.findOne({email:parametros.email}, (err, adminEncontrado) => {
            if (err) return res.status(500).send({mensaje: 'Error en la peticion'});
            if (adminEncontrado) {
                return res.send({ mensaje: 'Usuario en Uso' });
            } else {
                bcrypt.hash(parametros.password, null, null, (err, passwordEncriptada) => {
                    if (err) return res.status(500).send({ mensaje: 'Error al encriptar la contraseña' });
                    if (passwordEncriptada) {
                        modeloUsuarios.usuario = parametros.usuario;
                        modeloUsuarios.password = passwordEncriptada;
                        modeloUsuarios.email = parametros.email;
                        if (parametros.rol == 'ADMIN') {
                            modeloUsuarios.rol = 'ADMIN';
                        } else {
                            modeloUsuarios.rol = 'CLIENTE';
                        }

                        modeloUsuarios.save((err, usuariosGuardados) => {
                            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                            if (!usuariosGuardados) {
                                return res.status(404).send({ mensaje: 'Error al guardar Usuario' });
                            } else {
                                crearCarrito(usuariosGuardados);
                                return res.send({ usuarios: usuariosGuardados });
                            }
                        })
                    } else {
                        return res.status(404).send({ mensaje: 'Error al encriptar la contraseña' });
                    }
                })
            }
        })
    } else {
        return res.status(403).send({ mensaje: 'Ingrese los parametros requeridos' });
    }
}

function actualizarUsuarios(req, res) {
    var idUsuarios = req.params.idUsuarios;
    var parametros = req.body;

    if (idUsuarios == req.user.sub) {
        if (parametros.password) return res.send({ mensaje: 'Error al editar Contraseña' });
    } else {
        Usuarios.findById(idUsuarios, (err, usuariosEncontrados) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la petición' });
            if (usuariosEncontrados) {
                if (usuariosEncontrados.rol == 'CLIENTE') {
                    Usuarios.findByIdAndUpdate(idUsuarios, parametros, { new: true }, (err, usuariosActualizados) => {
                        if (err) return res.status(500).send({ mensaje: 'Error en la petición' });
                        if (!usuariosActualizados) return res.status(404).send({ mensaje: 'Error al actualizar Usuarios' });
                        return res.send({ usuarios: usuariosActualizados });
                    })
                } else {
                    return res.status(401).send({ mensaje: 'No puede actualizar a otro Admin' });
                }
            } else {
                return res.status(404).send({ mensaje: 'Error al encontrar usuario' });
            }
        })
    }

}

function eliminarCarrito(usuariosGuardados) {
    Carrito.findOneAndRemove({ dueño: usuariosGuardados._id }, (err, carritoEliminar) => {
        if (err) return console.log('Error al eliminar carrito');
        if (!carritoEliminar) return console.log('No se eliminó el carrito');
        return console.log('Carrito eliminado exitosamente');
    })
}

function eliminarUsuarios(req, res) {
    var idUsuarios = req.params.idUsuarios;

    if (idUsuarios == req.user.sub || req.user.rol == 'ADMIN') {
        Usuarios.findById(idUsuarios, (err, adminEncontrado) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if (!adminEncontrado) return res.status(404).send({ mensaje: 'Error al eliminar usuario'})
            if (adminEncontrado) { 
                if (adminEncontrado.rol == 'CLIENTE') {
                    eliminarCarrito(adminEncontrado);
                    Usuarios.findByIdAndDelete(idUsuarios, (err, usuarioEliminado) => {
                        if (err) return res.status(500).send({ mensaje: 'Error al intentar eliminar' });
                        if (!usuarioEliminado) return res.status(403).send({ mensaje: 'Error al eliminar Usuario' })
                        return res.send({ mensaje: 'Usuario removido exitosamente' });
                    })
                } else {
                    return res.status(401).send({ mensaje: 'No se puede eliminar a otro Admin' });
                }
            } else {
                return res.status(403).send({ mensaje: 'Usuario no encontrado' });
            }
        })
    } else {
        return res.status(401).send({ mensaje: 'No puedes eliminar a este usuario' });
    }
}

module.exports = {
    registrarAdmin,
    login,
    agregarUsuarios,
    actualizarUsuarios,
    eliminarUsuarios
}