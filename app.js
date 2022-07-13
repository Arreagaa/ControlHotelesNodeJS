// IMPORTACIONES
const express = require('express');
const cors = require('cors');
var app = express();

// IMPORTACIONES RUTAS
const UsuarioRutas = require('./src/routes/usuario.routes');
const HotelesRutas = require('./src/routes/hotel.routes');
const RoomRutas = require('./src/routes/room.routes');
const EventoRutas = require('./src/routes/evento.routes');
const ServicioRutas = require('./src/routes/servicio.routes');
const ReservacionRutas = require('./src/routes/reservacion.routes');
const RegistroRutas = require('./src/routes/registro.routes');

// MIDDLEWARES -> INTERMEDIARIOS
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// CABECERAS
app.use(cors());

// CARGA DE RUTAS localhost:3000/api/obtenerProductos
app.use('/api', UsuarioRutas, HotelesRutas, RoomRutas, EventoRutas, ServicioRutas, ReservacionRutas, RegistroRutas);

module.exports = app;