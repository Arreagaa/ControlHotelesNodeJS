//IMPORTACIONES
const express = require('express');
const usuarioController = require('../controllers/hotel.controller');
const md_autentificacion = require('../middlewares/autentificacion');
const md_roles = require('../middlewares/roles');

//ini
var api = express.Router();

api.get('/obtenerHoteles',usuarioController.ObtenerHoteles);
api.get('/obtenerHotelId/:idHotel',md_autentificacion.Auth,usuarioController.ObtenerHotelId);
api.post('/registrarHotel', [md_autentificacion.Auth,md_roles.verAdmin],usuarioController.agregarHotel);
api.put('/editarHotel/:idHotel',[md_autentificacion.Auth, md_roles.verAdmin],usuarioController.editarHotel);
api.delete('/eliminarHotel/:idHotel', [md_autentificacion.Auth,md_roles.verAdmin],usuarioController.eliminarHotel);

module.exports = api;