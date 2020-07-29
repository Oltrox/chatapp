const messages = document.getElementById('mensajes');
const listado = document.getElementById('listado');
var nombreusuario = '';
var nowContact = '';
var firstSelection = true;
var contactos = [];
var contactosElements = [];

/* Funcion que permite agrear un mensaje al chat, dependiendo si 
es del lado remoto (izquierdo) o no (derecho) */
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

    var nuevosmensajes = document.getElementById('mensajesnuevos');
    nuevosmensajes.appendChild(newMessage);
}

/* Funcion que permite agregar contactos en el listado izquierdo
de la interfaz del usuario, ademas de agregar los nombres al arreglo contactos, y 
los elementos de estos nombres al arreglo contactosElements */
function agregarContacto(contacto){

    var contactoObj = document.getElementById('contacto');
    const newContacto = contactoObj.cloneNode(true);

    newContacto.querySelector('#nombrecontacto').innerHTML = contacto;
    newContacto.style.display = '';
    newContacto.setAttribute('datauser', contacto);
    listado.appendChild(newContacto);

    contactos.push(contacto);
    contactosElements.push(newContacto);

}


/* Funcion que permite mantener el chat siempre en el fondo
cuando hay muchos mensajes */
function scrollToBottom() {
    messages.scrollTop = messages.scrollHeight;
}

/* Funcion que permite limpiar el chat y colocar el nombre del contacto
seleccionado para generar el chat nuevo con ese usuario*/
function selectUser(contacto){
    
    if (firstSelection){
        $('#chatmensaje').css('display','none');
        $('#chattodo').css('display','');
        firstSelection = false;
    }

    if (contacto != nowContact){
        nowContact = contacto;
        $('#mensajesnuevos').empty();
        $('#contactoSeleccionadoText').text(nowContact);
    }else{
        swal.fire({
            title: 'No permitido',
            text: "Ha seleccionado el mismo usuario con el que quiere contactarse",
            icon: "warning"
        });
    }


}

/* Funcion que permite cambiar el CSS de un elemento para 
que parezca seleccionado */
function toggleSelection(element){
    $(element).addClass('selected').siblings().removeClass('selected')
}

$('#nuevoContactoBoton').on('click', function(){

    var nuevoContacto = $('#nuevoContactoTexto').val();

    if (nuevoContacto == nombreusuario){
        swal.fire({
            title: 'No permitido',
            text: "No puedes agregarte tu usuario como contacto",
            icon: "error"
        });
        return;
    }

    if (nuevoContacto != ''){
        agregarContacto(nuevoContacto);
        $('#nuevoContactoTexto').val('');
    }else{
        swal.fire({
            title: 'No permitido',
            text: "Debes ingresar un alias no vacío",
            icon: "error"
        });
    }
    

});


scrollToBottom();





/*
 *
 *    SOCKET.IO
 *
*/

$(function() {

    // Se genera el socket
    var socket = io.connect();
    var $mensaje = $('#nuevo-mensaje');

    /* 
        Al clickear el boton de envio se realiza el envio a través del socket.
        El socket espera una respuesta para saber si su mensaje fue enviado al usuario,
        es decir, saber si el usuario se encontraba ingresado en la plataforma.
    */
    $('#boton-enviar').on('click',function(){

        // Enviar el mensaje
        socket.emit('enviar msg', {
            msg: $mensaje.val(),
            usr: $('#usuario').val(),
            rmtusr: nowContact
        }, function(respuesta){

            if(respuesta.enviado == false){
                swal.fire({
                    title: '¡Atención!',
                    text: "El usuario no ha ingresado a la plataforma aún, por lo tanto no podrá recibir ningún mensaje",
                    icon: "warning"
                });
            }

        });

        // Se agrega al historial
        agregarMensaje($mensaje.val(), $('#usuario').val());

        // Limpiar el textarea
        $mensaje.val('');

        // Hacer scroll hasta el final para mantener mensajes recientes
        scrollToBottom();
    });


    /*
        Al momento de ingresar se emite un mensaje por el socket, que permite
        la asociacion del socket id con el nombre de usuario en el servidor.
        Luego de esta accion, es posible agregar contactos e interactuar con
        los chats.
    */
    $('#ingresarBoton').on('click', function(){

        var username = $('#usuario').val();
    
        if(username != ''){

            socket.emit('registrar usr', {
                usr: username,
                id: socket.id
            }, function(respuesta){
                
                if(respuesta.esta == true){
                    swal.fire({
                        title: 'No permitido',
                        text: "Ya hay un usuario con ese nombre",
                        icon: "error"
                    });
                }else{
                    $('#usuarioForm').css("display","none");
                    $('#chatForm').css("display","");
                    $('#conectadocomo').text(username);
                    nombreusuario = username;
                }

            });


        }else{
            
            swal.fire({
                title: 'No permitido',
                text: "Debe ingresar un nombre de usuario",
                icon: "error"
            });
            
        }
    
    
    })

    /*
        Se reciben los mensajes que son emitidos del servidor.
        Tiene varias situaciones que pueden ocurrir:
        1. Si el usuario no tiene en su lista de contactos a quien envio el mensaje
            este se muestra con una alerta.
        2. Si el usuario tiene al usuario en sus contactos, pero no tiene abierta
            su ventana de chat, y no ha abierto ningun chat, 
            esta se abrira automaticamente mostrando el mensaje
        3. Si el usuario tiene al usuario en sus contactos, pero no tiene abierta
            su ventana de chat, y esta en otro chat, 
            esta se abrira automaticamente mostrando el mensaje eliminando el contenido
            del chat anterior.
    */
    socket.on('nuevo msg', function(data){

        // Comprobacion innecesaria, ya que el propio servidor gestiona
        // a traves del socket id aquien le emite el mensaje.
        if (nombreusuario == data.rmtusr){
            console.log(data.usr, contactos);
            if(contactos.includes(data.usr)){

                if (nowContact != data.usr){
                    selectUser(data.usr);

                    contactosElements.forEach(element => {
                        if(element.attributes.datauser.value == data.usr){
                            toggleSelection(element);
                        }
                    });

                }

                agregarMensaje(data.msg, data.usr, remoto=true);
            }else{
                swal.fire({
                    title: ':D',
                    text: "Has recibido un mensaje de '"+data.usr+"' pero no lo tienes en tus contactos. Debes agregarlo para chatear con ese usuario. El mensaje era: "+data.msg,
                    icon: "info"
                });
            }

            
        }

        scrollToBottom();
    });




})

