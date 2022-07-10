const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var reservacionSchema = Schema ({
    idHotel:{type:Schema.Types.ObjectId, ref:'hoteles'},
    idUsuario:{type:Schema.Types.ObjectId, ref:'usuarios'},
    idRoom:{type:Schema.Types.ObjectId, ref:'rooms'},
    fechaInicio:String,
    totalNoches:Number
});

module.exports = mongoose.model('reservaciones', reservacionSchema);