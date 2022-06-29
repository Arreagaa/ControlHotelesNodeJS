const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const Room = require('../models/room.model');


function ObtenerRooms (req, res) {

    Room.find((err, roomsObtenidos) => {
        
        if (err) return res.send({ mensaje: "Error: " + err })

        return res.send({ rooms: roomsObtenidos })
    })
}

function ObtenerRoomId(req, res){
    var idRoom = req.params.idRoom

    Room.findById(idRoom,(err,roomEncontrado)=>{
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!roomEncontrado) return res.status(404).send( { mensaje: 'Error al obtener la habitacion' });

        return res.status(200).send({ rooms: roomEncontrado });
    })
}

function agregarRoom(req, res){
    var parametros = req.body;
    var roomModel = new Room();
  
    if(parametros.nombreRoom, parametros.tipo, parametros.precio, parametros.disponibilidad){
        roomModel.nombreRoom = parametros.nombreRoom;
        roomModel.tipo = parametros.tipo;
        roomModel.precio = parametros.precio;
        roomModel.disponibilidad = parametros.disponibilidad;
        roomModel.idHotel = parametros.idHotel;
            Room.find({nombreRoom: parametros.nombreRoom}
                ,(err, roomGuardado)=>{
                if(roomGuardado.length == 0){
                    roomModel.save((err, roomSave) => {
                            if(err) return res.status(500).send({mensaje: 'No se realizo la accion'});
                            if(!roomSave) return res.status(404).send({mensaje: 'No se agrego la habitacion'});
  
                            return res.status(201).send({rooms: roomSave});
                         })
                }else{
                    return res.status(500).send({ mensaje: 'Error en la peticion' });
                }
            })
        }else{
            return res.status(500).send({ mensaje: 'Error en la peticion agregar' });
        }
}

function editarRoom(req, res){
    var idRoom = req.params.idRoom;
    var paramentros = req.body;

    Room.findByIdAndUpdate({_id: idRoom, nombreRoom: paramentros.nombreRoom}, paramentros,{new:true},
        (err, roomEditado)=>{
            if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
            if(!roomEditado) return res.status(400).send({mensaje: 'No se puede editar la habitacion'});
                
            return res.status(200).send({rooms: roomEditado});
    })
}

function eliminarRoom(req, res){
    var idRoom = req.params.idRoom;

    Room.findByIdAndDelete({_id: idRoom},(err, roomEliminado)=>{
                
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
            if(!roomEliminado) return res.status(400).send({mensaje: 'No es puede eliminar la habitacion'});
                
            return res.status(200).send({rooms: roomEliminado});
        })
}


module.exports = {
    agregarRoom,
    editarRoom,
    eliminarRoom,
    ObtenerRooms,
    ObtenerRoomId,
}