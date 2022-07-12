//IMPORTACIONES
const express = require('express');
const eventoController = require('../controllers/evento.controller');
const md_autentificacion = require('../middlewares/autentificacion');
const md_roles = require('../middlewares/roles');

//ini
var api = express.Router();

api.get('/obtenerEventos/:idHotel?',md_autentificacion.Auth,eventoController.ObtenerEventos);
api.get('/obtenerEventoId/:idEvento',md_autentificacion.Auth,eventoController.ObtenerEventolId);
api.post('/agregarEvento', [md_autentificacion.Auth,md_roles.verHotel],eventoController.agregarEvento);
api.put('/editarEvento/:idEvento',[md_autentificacion.Auth, md_roles.verHotel],eventoController.editarEvento);
api.delete('/eliminarEvento/:idEvento', [md_autentificacion.Auth,md_roles.verHotel],eventoController.eliminarEvento);

api.post('/comprarEvento/:idEvento?', [md_autentificacion.Auth],eventoController.comprarEvento);

module.exports = api;