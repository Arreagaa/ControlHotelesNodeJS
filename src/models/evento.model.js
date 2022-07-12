const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventoSchema = Schema ({
    evento: String,
    descripcion: String,
    precio: Number,
    disponibilidad: Boolean,
    idHotel:{type:Schema.Types.ObjectId, ref:'hoteles'}
});

module.exports = mongoose.model('eventos', eventoSchema);