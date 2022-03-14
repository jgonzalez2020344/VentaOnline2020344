const express = require('express');
const productosController = require('../controllers/productos.controllers');
const api = express.Router();
const md_Auth = require('../middlewares/autenticacion');

api.put('/agregarProductos/:idCategorias', [md_Auth.Auth, md_Auth.rol], productosController.agregarProductos);
api.get('/obtenerProductos', [md_Auth.Auth, md_Auth.rol], productosController.obtenerProductos);
api.get('/buscarNProductos', [md_Auth.Auth, md_Auth.rol], productosController.buscarNProductos);
api.put('/:idCategorias/actualizarProductos/:idProductos', [md_Auth.Auth, md_Auth.rol], productosController.actualizarProductos);
api.put('/:idCategorias/eliminarProductos/:idProductos', [md_Auth.Auth, md_Auth.rol], productosController.eliminarProductos);
api.get('/cantidadProductos', [md_Auth.Auth, md_Auth.rol], productosController.cantidadProductos);

module.exports = api;