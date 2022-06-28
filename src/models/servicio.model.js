const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var servicioSchema = Schema ({
    servicio: String,
    precio: Number,
    idHotel:{type:Schema.Types.ObjectId, ref:'hoteles'}
});

module.exports = mongoose.model('servicios', servicioSchema);