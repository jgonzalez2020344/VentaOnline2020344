const express = require('express');
const usuarioController = require('../controllers/usuarios.controllers');
const api = express.Router();
const md_Auth = require('../middlewares/autenticacion');

api.post('/login',usuarioController.login);
api.post('/agregarUsuarios',usuarioController.agregarUsuarios);
api.put('/actualizarUsuarios/:idUsuarios',[md_Auth.Auth, md_Auth.rol],usuarioController.actualizarUsuarios);
api.delete('/eliminarUsuarios/:idUsuarios',[md_Auth.Auth, md_Auth.rol],usuarioController.eliminarUsuarios);

module.exports = api;