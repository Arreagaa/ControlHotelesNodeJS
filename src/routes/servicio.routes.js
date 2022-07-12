//IMPORTACIONES
const express = require('express');
const servicioController = require('../controllers/servicio.controller');
const md_autentificacion = require('../middlewares/autentificacion');
const md_roles = require('../middlewares/roles');

//ini
var api = express.Router();

api.get('/obtenerServicios/:idHotel?',md_autentificacion.Auth,servicioController.ObtenerServicios);
api.get('/obtenerServicioId/:idServicio',md_autentificacion.Auth,servicioController.ObtenerServicioId);
api.post('/agregarServicio', [md_autentificacion.Auth,md_roles.verHotel],servicioController.agregarServicio);
api.put('/editarServicio/:idServicio',[md_autentificacion.Auth, md_roles.verHotel],servicioController.editarServicio);
api.delete('/eliminarServicio/:idServicio', [md_autentificacion.Auth,md_roles.verHotel],servicioController.eliminarServicio);

api.post('/comprarServicio/:idServicio?', [md_autentificacion.Auth],servicioController.comprarServicio);

module.exports = api;