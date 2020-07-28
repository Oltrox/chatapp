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


agregarMensaje("lokiiiitooooo","WENA",remoto=true);
agregarMensaje("lokiiiitooooo","WEN2A");