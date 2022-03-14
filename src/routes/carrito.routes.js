const express = require('express');
const carritoController = require('../controllers/carrito.controllers');
const api = express.Router();
const md_Auth = require('../middlewares/autenticacion');

api.put('/agregarACarrito/:idProductos', md_Auth.Auth, carritoController.agregarACarrito);

module.exports = api;