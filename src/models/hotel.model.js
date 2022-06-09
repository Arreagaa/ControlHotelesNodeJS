const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var hotelSchema = Schema ({
    nombreHotel: String,
    email: String,
    direccion: String,
    telefono: String,
    pais: String,
    precioHabitacion: Number,
    idAdmin:{type:Schema.Types.ObjectId, ref:'usuarios'}
});

module.exports = mongoose.model('hoteles', hotelSchema);