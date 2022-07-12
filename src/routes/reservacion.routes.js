//IMPORTACIONES
const express = require('express');
const reservacionController = require('../controllers/reservacion.controller');
const md_autentificacion = require('../middlewares/autentificacion');
const md_roles = require('../middlewares/roles');

//ini
var api = express.Router();

api.post('/reservacion/:idRoom', [md_autentificacion.Auth],reservacionController.agregarReservacion);

api.get('/ObtenerReservaciones',[md_autentificacion.Auth],reservacionController.ObtenerReservaciones);

api.get('/ObtenerReservacionId/:idReservacion?',md_autentificacion.Auth,reservacionController.ObtenerReservacionId);

api.get('/obtenerReservacionesHotel/:idHotel?',md_autentificacion.Auth,reservacionController.obtenerReservacionesHotel);

//PDF
api.get('/makePDF',md_autentificacion.Auth, reservacionController.reservacionesHotel);

module.exports = api;