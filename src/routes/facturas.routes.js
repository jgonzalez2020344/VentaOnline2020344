const express = require('express');
const facturasController = require('../controllers/facturas.controllers');
const api = express.Router();
const md_Auth = require('../middlewares/autenticacion');

api.put('/crearFacturas', md_Auth.Auth, facturasController.crearFacturas);

module.exports = api;