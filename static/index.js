const messages = document.getElementById('mensajes');

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
        socket.emit('enviar msg', $mensaje.val());

        // Se agrega al historial
        agregarMensaje($mensaje.val(), 'sin usuario');

        // Limpiar el textarea
        $mensaje.val('');

        // Hacer scroll hasta el final para mantener mensajes recientes
        scrollToBottom();
    });


    socket.on('nuevo msg', function(data){
        agregarMensaje(data.mensaje, 'sin usuario', remoto=true);

        scrollToBottom();
    });

})

