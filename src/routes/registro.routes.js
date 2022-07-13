const express = require('express');
const registroController = require('../controllers/registro.controller');
const md_autentificacion = require('../middlewares/autentificacion');

var app = express.Router();

app.get("/obtener", md_autentificacion.Auth, registroController.obtenerRegistros);
app.delete("/eliminarRegistro/:registro", md_autentificacion.Auth, registroController.eliminarRegistro);   


 
module.exports = app;