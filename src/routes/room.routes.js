//IMPORTACIONES
const express = require('express');
const roomController = require('../controllers/room.controller');
const md_autentificacion = require('../middlewares/autentificacion');
const md_roles = require('../middlewares/roles');

//ini
var api = express.Router();

api.get('/obtenerRooms/:idHotel?',md_autentificacion.Auth, roomController.ObtenerRooms);
api.get('/obtenerRoomId/:idRoom',md_autentificacion.Auth,roomController.ObtenerRoomId);
api.post('/agregarRoom', [md_autentificacion.Auth,md_roles.verHotel],roomController.agregarRoom);
api.put('/editarRoom/:idRoom',[md_autentificacion.Auth, md_roles.verHotel],roomController.editarRoom);
api.delete('/eliminarRoom/:idRoom', [md_autentificacion.Auth,md_roles.verHotel],roomController.eliminarRoom);

module.exports = api;