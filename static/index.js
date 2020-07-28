const messages = document.getElementById('mensajes');
const listado = document.getElementById('listado');
var contactos = [];

function agregarMensaje(mensaje, usuario, remoto=false) {
    if(remoto){
        var message = document.getElementsByClassName('chat-left')[0];
    }else{
        var message = document.getElementsByClassName('chat-right')[0];
    }

    const newMessage = message.cloneNode(true);
    newMessage.style.display = '';
    newMessage.querySelector('#chat-texto').innerHTML = mensaje;
    newMessage.querySelector('#chat-usuario').innerHTML = usuario;
    messages.appendChild(newMessage);
}

function agregarContacto(contacto){

    var contactoObj = document.getElementById('contacto');
    const newContacto = contactoObj.cloneNode(true);

    newContacto.querySelector('#nombrecontacto').innerHTML = contacto;
    newContacto.style.display = '';
    listado.appendChild(newContacto);

}

function getMessages() {
	// Prior to getting your messages.
  shouldScroll = messages.scrollTop + messages.clientHeight === messages.scrollHeight;
  /*
   * Get your messages, we'll just simulate it by appending a new one syncronously.
   */
  appendMessage();
  // After getting your messages.
  if (!shouldScroll) {
      scrollToBottom();
  }
}

function scrollToBottom() {
    messages.scrollTop = messages.scrollHeight;
}

$('#ingresarBoton').on('click', function(){

    var username = $('#usuario').val();

    if(username != ''){
        $('#usuarioForm').css("display","none");
        $('#chatForm').css("display","");
    }else{
        alert("Debe ingresar un nombre de usuario");
    }


})

$('#nuevoContactoBoton').on('click', function(){

    var nuevoContacto = $('#nuevoContactoTexto').val();

    if (nuevoContacto != ''){
        agregarContacto(nuevoContacto);
        $('#nuevoContactoTexto').val('');
    }else{
        alert("Debe ingresar un alias no vacío");
    }
    

});


scrollToBottom();






/*
 *
 *    SOCKET.IO
 *
*/

$(function() {
    var socket = io.connect();
    var $mensaje = $('#nuevo-mensaje');

    $('#boton-enviar').on('click',function(){
        // Enviar el mensaje
        socket.emit('enviar msg', {
            msg: $mensaje.val(),
            usr: $('#usuario').val()
        });

        // Se agrega al historial
        agregarMensaje($mensaje.val(), $('#usuario').val());

        // Limpiar el textarea
        $mensaje.val('');

        // Hacer scroll hasta el final para mantener mensajes recientes
        scrollToBottom();
    });


    socket.on('nuevo msg', function(data){

        if ($('#usuario').val() == data.usr){
            agregarMensaje(data.msg, data.usr, remoto=true);
        }

        
        scrollToBottom();
    });



})

