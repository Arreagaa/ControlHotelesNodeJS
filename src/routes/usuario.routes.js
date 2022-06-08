//IMPORTACIONES
const express = require('express');
const usuarioController = require('../controllers/usuario.controller');
const md_autentificacion = require('../middlewares/autentificacion');
const md_roles = require('../middlewares/roles');

//ini
var api = express.Router();

//rutas
api.post('/login', usuarioController.login);

api.post('/registrarHotel', [md_autentificacion.Auth,md_roles.verAdmin],usuarioController.registrarHotel);

api.post('/registrarCliente', usuarioController.registrarCliente);

api.put('/editarHotel/:idHotel',[md_autentificacion.Auth, md_roles.verAdmin],usuarioController.editarHotel);

api.delete('/eliminarHotel/:idHotel', [md_autentificacion.Auth,md_roles.verAdmin],usuarioController.eliminarHotel);

/*REVISAR RUTAS POSTMAN*/

api.get('/obtenerHoteles',usuarioController.ObtenerHoteles);

api.get('/obtenerClientes',[md_autentificacion.Auth, md_roles.verHotel],usuarioController.ObtenerClientes);

api.get('/obtenerHotelId/:idHotel',md_autentificacion.Auth,usuarioController.ObtenerHotelId);

api.get('/obtenerClienteId/:idCliente',[md_autentificacion.Auth, md_roles.verHotel],usuarioController.ObtenerClienteId);

//CLIENTE PERFIL
api.put('/editarClientePerfil/:idUsuario',[md_autentificacion.Auth, md_roles.verCliente],usuarioController.EditarClientePerfil);

api.delete('/eliminarClientePerfil/:idUsuario', [md_autentificacion.Auth, md_roles.verCliente],usuarioController.EliminarClientePerfil);

module.exports = api;