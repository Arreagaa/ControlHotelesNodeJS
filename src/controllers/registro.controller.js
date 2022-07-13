const Registro = require('../models/registro.model');
const Room = require("../models/room.model");
const Hoteles = require("../models/hotel.model");

function obtenerRegistros (req, res) {
    Registro.find({ idUsuario : req.user.sub}, (err, registroEnocntrado) => {
        if (err) return res.status(500).send({ message: 'Error en la petición, intentelo de nuevo mas tarde' });
        if (!registroEnocntrado) return res.status(404).send({ message: 'No hay registros'});

        return res.status(200).send({Registro: registroEnocntrado});
    });
}

function eliminarRegistro (req, res) {
    var registro = req.params.registro;

    Registro.findOneAndDelete({idUsuario: req.user.sub, nombreCompra: registro}, { new: true}, (err, registroEliminado) => {
        if (err) return res.status(500).send({ message: 'Error en la petición, intentelo de nuevo mas tarde' });
        if (!registroEliminado) return res.status(404).send({ message: 'No se encontro el registro' });

        Room.findOne({ nombreRoom: registro }, (err, habitacionEncontrado) => {
            if (err) return res.status(500).send({ message: 'Error en la petición, intentelo de nuevo mas tarde' });
            if (habitacionEncontrado) {
                Room.findOneAndUpdate({ nombreRoom: registro}, {disponibilidad : true}, { new: true }, (err, habitacionEditada) => {
                    if (err) return res.status(500).send({ message: 'Error en la petición, intentelo de nuevo mas tarde' });
                    if (!habitacionEditada) return res.status(404).send({ message: 'No se encontro el registro' });

                    Hoteles.findByIdAndUpdate({ _id: habitacionEditada.idHotel }, {$inc: {cantidadReservaciones: -1}}, { new: true}, (err, hotelEditado) => {
                            if (err) return res.status(500).send({ message: 'Error en la petición, intentelo de nuevo mas tarde' });
                            if (!hotelEditado) return res.status(404).send({ message: 'No se encontro pudo editar la cantidad' });

                    });
                });
            }
        });
    return res.status(200).send({message: 'El registro fue eliminado con exito'});
        
    })
}

module.exports = {
    obtenerRegistros,
    eliminarRegistro
}