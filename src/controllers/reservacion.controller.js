const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const Reservacion = require('../models/reservacion.model');
const Usuario = require('../models/usuario.model');
const Room = require('../models/room.model');
const Registro = require('../models/registro.model');
const Hotel = require('../models/hotel.model');

//PDF
const fs = require('fs');
const Pdfmake = require('pdfmake');

function agregarReservacion(req, res) {
    var parametros = req.body;
    var reservacionModel = new Reservacion();
    var registroModel = new Registro();
    var idRoom = req.params.idRoom;

    if (parametros.fechaInicio && parametros.totalNoches){
        Room.findOne({_id:idRoom}, (err, result)=>{
            console.log(idRoom);
            if (err || result === null) return res.status(500).send({message: "habitacion inexistente"})
            reservacionModel.idHotel = parametros.idHotel;
            reservacionModel.idRoom = idRoom;
            reservacionModel.idUsuario = req.user.sub;
            reservacionModel.fechaInicio = parametros.fechaInicio;
            reservacionModel.totalNoches = parametros.totalNoches;
            reservacionModel.save((err, reservacionGuardada) =>{
                console.log(reservacionModel);
                console.log(parametros.idHotel);
                if(err) return res.status(500).send({message: "Error en la peticion reservacionModel"});
                if(!reservacionGuardada) return res.status(404).send({message: "no se guardo la reservacion"});
                Room.findByIdAndUpdate({_id: idRoom},{ disponibilidad: false},{new:true}, (err, roomGuardado)=>{
                    if(err) return res.status(500).send({message: "Error en la peticion roomGuardado"});
                    if(!roomGuardado) return res.status(404).send({message: "no se guardo la habitacion editada"});

                    Room.findOne({_id:idRoom}, (err, roomEncontrado)=>{
                        registroModel.idUsuario = req.user.sub;
                        registroModel.nombreCompra = roomEncontrado.nombreRoom;
                        registroModel.cantidad = reservacionGuardada.totalNoches;
                        registroModel.precio = roomEncontrado.precio*reservacionGuardada.totalNoches;
                        registroModel.save((err, registroGuardado)=>{
                            if(err) return res.status(500).send({message: "Error en la peticion registroModel"});
                            if(!registroGuardado) return res.status(404).send({message: "no se guardo el registro"});

                            return res.status(200).send({reservacion: reservacionGuardada})
                        })
                    })


                })

            })

        })
    }else {
        return res.status(500).send({message: "campos vacios"})
    }
}

function ObtenerReservaciones (req, res) {

    Reservacion.find((err, reservacionesObtenidas) => {
        
        if (err) return res.send({ mensaje: "Error: " + err })

        return res.send({ reservaciones: reservacionesObtenidas })
    })
}

function ObtenerReservacionId(req, res){
    var idReservacion = req.params.idReservacion;

    Reservacion.findById(idReservacion,(err,reservacionObtenida)=>{
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion de Reserva por Id' });
        if (!reservacionObtenida) return res.status(404).send( { mensaje: 'Error al obtener el hotel' });

        return res.status(200).send({ reservaciones: reservacionObtenida });
    })
}

function obtenerReservacionesHotel(req, res) {
    var idHotel = req.params.idHotel;

    Usuario.findById({_id: req.user.sub}, (err, usuarioEncontrado)=>{
        if (err) return res.status(400).send({ message: 'idUsuario Encontrado' });
        if (!usuarioEncontrado) return res.status(400).send({ message: 'No se encontro ningun usuario con ese id.' })

        Reservacion.find({ idHotel: usuarioEncontrado.idHotel }, (err, reservacionesEncontradas) => {
            if (err) return res.status(500).send({ message: 'Error en la petición' });
            if (!reservacionesEncontradas) return res.status(404).send({ message: 'No cuenta con reservaciones' });
            return res.status(200).send({ reservaciones: reservacionesEncontradas });
        });
    })
}

//PDF
function reservacionesHotel(req, res) {
    //const usuarioLogueado = req.user.sub;
    var idHotel = req.params.idHotel;

    Usuario.findById({_id: req.user.sub}, (err, usuarioEncontrado)=>{
        if (err) return res.status(400).send({ message: 'idUsuario Encontrado' });
        if (!usuarioEncontrado) return res.status(400).send({ message: 'No se encontro ningun usuario con ese id.' })

        Reservacion.find({ idHotel: usuarioEncontrado.idHotel }, (err, reservacionesEncontradas) => {
            if (err) return res.status(500).send({ message: 'Error en la petición' });
            if (!reservacionesEncontradas) return res.status(404).send({ message: 'No cuenta con reservaciones' });
            //return res.status(200).send({ reservaciones: reservacionesEncontradas });
      
    

    var fonts = {
        Roboto: {
            normal: './fonts/Roboto/Roboto-Regular.ttf',
            bold: './fonts/Roboto/Roboto-Medium.ttf',
            italics: './fonts/Roboto/Roboto-Italic.ttf',
            bolditalics: './fonts/Roboto/Roboto-MediumItalic.ttf'
        }
    };
    let pdfmake = new Pdfmake(fonts);
    let content = [{
        text: 'Reporte De Reservaciones', alignment:'center', fontSize:20, color:'#6793F4', bold:true, marginBottom: 40
    }]

    for (let i=0; i < reservacionesEncontradas.length ; i++) {
        content.push({
            text:'Identificación de la Habitación: '+  reservacionesEncontradas[i].idRoom, alignment:'center'
        })
        content.push({
            text:' ', 
        })
        content.push({
            text:'Inicia su Hospedaje: '+  reservacionesEncontradas[i].fechaInicio, alignment:'center'
        })
        content.push({
            text:'Se Hospeda por: '+  reservacionesEncontradas[i].totalNoches + ' noches', alignment:'center'
        })
        content.push({
            text:'Cliente ID: '+  reservacionesEncontradas[i].idUsuario, alignment:'center'
        })
        content.push({
            text:' '
        })
        content.push({
            text:' '
        })
    }

    let docDefinition = {
        content: content,
        background: function(){
            return {canvas: [{type:'rect', x: 570, y: 0, w:35, h: 840, color: '#37517e'}]
            }
        }	
    }

    let documentPDF = pdfmake.createPdfKitDocument(docDefinition, {});
    documentPDF.pipe(fs.createWriteStream('reservasReporte.pdf'));
    //documentPDF.save(fs.createWriteStream('reservasReporte.pdf'));
    documentPDF.end();
    return res.status(200).send({mensaje:'El reporte de reservas ya fue creado'});    
})  })
}

module.exports = {
    agregarReservacion,
    ObtenerReservaciones,
    ObtenerReservacionId,
    obtenerReservacionesHotel,
    reservacionesHotel
}