var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

sockets = [];


server.listen(process.env.PORT || 5000);

app.use('/static', express.static(__dirname + '/static'));

app.get('/', function(request, response){
    response.sendFile(__dirname + "/vistas/index.html");
})

io.sockets.on('connection', function(socket){
    sockets.push(socket);
    console.log('Se ha conectado un usuario');

    // Desconexion
    // sockets.splice(sockets.indexOf(socket),1);

}) 