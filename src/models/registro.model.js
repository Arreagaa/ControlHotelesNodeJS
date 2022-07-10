const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var registroSchema = Schema ({
    nombreCompra:String,
    precio: Number,
    cantidad:Number,
    idUsuario:{type:Schema.Types.ObjectId, ref:'usuarios'}
});

module.exports = mongoose.model('registros', registroSchema);