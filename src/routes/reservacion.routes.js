//IMPORTACIONES
const express = require('express');
const reservacionController = require('../controllers/reservacion.controller');
const md_autentificacion = require('../middlewares/autentificacion');
const md_roles = require('../middlewares/roles');

//ini
var api = express.Router();

api.post('/reservacion/:idRoom', [md_autentificacion.Auth],reservacionController.agregarReservacion);

module.exports = api;