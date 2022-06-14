//IMPORTACIONES
const express = require('express');
const usuarioController = require('../controllers/usuario.controller');
const md_autentificacion = require('../middlewares/autentificacion');
const md_roles = require('../middlewares/roles');

//ini
var api = express.Router();

//rutas
api.post('/login', usuarioController.login);
api.post('/registrarCliente', usuarioController.registrarCliente);
api.get('/obtenerClientes',[md_autentificacion.Auth],usuarioController.ObtenerClientes);
api.get('/obtenerClienteId/:idCliente',[md_autentificacion.Auth],usuarioController.ObtenerClienteId);
//CLIENTE PERFIL
api.put('/editarClientePerfil/:idUsuario',[md_autentificacion.Auth, md_roles.verCliente],usuarioController.EditarClientePerfil);
api.delete('/eliminarClientePerfil/:idUsuario', [md_autentificacion.Auth, md_roles.verCliente],usuarioController.EliminarClientePerfil);

module.exports = api;