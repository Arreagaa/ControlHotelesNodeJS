const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var roomSchema = Schema ({
    nombreRoom: String,
    tipo:String,
    precio: Number,
    disponibilidad: Boolean,
    idHotel:{type:Schema.Types.ObjectId, ref:'hoteles'}
});

module.exports = mongoose.model('rooms', roomSchema);