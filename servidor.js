var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

sockets = [];
usuarios = {};

var listener = server.listen(process.env.PORT || 5000);
console.log("Servidor en ejecución el puerto %s", listener.address().port);

app.use('/static', express.static(__dirname + '/static'));

app.get('/', function(request, response){
    response.sendFile(__dirname + "/vistas/index.html");
})


// Funciones disponibles al momento de conectarse
io.sockets.on('connection', function(socket){
    sockets.push(socket);
    console.log('Se ha conectado un usuario');

    // Desconexion
    socket.on('disconnect', function(data){

        // Se elimina de la lista de usuarios registrados
        Object.entries(usuarios).forEach(([key,value]) => {
            if(value == socket.id){
                delete usuarios[key];
                console.log("Se ha ido el usuario '%s' con socket '%s'",key,value);
            }
        })        
        
        // Se elimina de la lista de conexiones activas
        sockets.splice(sockets.indexOf(socket), 1);
        console.log("Usuario desconectado");
    });

    // Para enviar un mensaje, en caso de que el usuario no este en
    // la plataforma retorna una respuesta negativa para el cliente
    socket.on('enviar msg', function(data, callback){
        
        respuesta = {"enviado":true};
        if (usuarios[data.rmtusr]){
            // Emitir solo al usuario especificado
            io.to(usuarios[data.rmtusr]).emit('nuevo msg',data);
            console.log("Nuevo mensaje emitido a '%s' desde '%s': ",data.rmtusr,data.usr,data.msg);
        }else{
            respuesta = {"enviado":false};
            console.log("El usuario '%s' no ha ingresado", data.rmtusr);
        }
        
        callback(respuesta);

    });

    // Cuando se registra un usuario con un alias, es almacenado en memoria
    // para verificar si este esta dentro de la plataforma o no.
    // Se limpia el string para evitar conflicto con caracteres como el salto de linea
    // y se compara y guarda en minusulas
    socket.on('registrar usr', function(data, callback){

        var newUsuarioSave = data.usr.trim().replace(/(\r\n|\n|\r)/gm,"").replace(/ /g,'').toLowerCase();

        respuesta = {"esta":false}
        if(usuarios[newUsuarioSave]){
            respuesta = {"esta":true}
            console.log("Usuario '%s' ya se encuentra registrado como: '%s'", data.usr, newUsuarioSave);
        }else{
            usuarios[newUsuarioSave] = data.id;
            console.log("Usuario '%s' registrado con socket '%s' como: '%s'", data.usr, data.id, newUsuarioSave);
        }

        callback(respuesta);

    });



}) 

