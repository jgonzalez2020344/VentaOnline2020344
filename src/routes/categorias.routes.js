const express = require('express');
const categoriasController = require('../controllers/categorias.controllers');
const api = express.Router();
const md_Auth = require('../middlewares/autenticacion');

api.post('/agregarCategorias', [md_Auth.Auth, md_Auth.rol], categoriasController.agregarCategoria);
api.get('/buscarCategorias', [md_Auth.Auth, md_Auth.rol], categoriasController.obtenerCategorias);
api.get('/buscarPorCategorias', [md_Auth.Auth, md_Auth.rol], categoriasController.buscarPorCategorias);
api.put('/actualizarCategorias/:idCategorias', [md_Auth.Auth, md_Auth.rol], categoriasController.actualizarCategorias);
api.delete('/eliminarCategorias/:idCategorias', [md_Auth.Auth, md_Auth.rol], categoriasController.eliminarCategorias);
    
module.exports = api;