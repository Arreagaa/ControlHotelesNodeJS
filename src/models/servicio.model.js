const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var servicioSchema = Schema ({
    servicio: String,
    precio: Number,
    disponibilidad: Boolean,
    idHotel:{type:Schema.Types.ObjectId, ref:'hoteles'}
});

module.exports = mongoose.model('servicios', servicioSchema);