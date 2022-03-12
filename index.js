var http = require('http');
var fs = require('fs');             //required to readfile
//const WebSocket = require('isomorphic-ws');
const { Server }  = require("socket.io");


const server = http.createServer(function(recieve, send){
let count = 0
//send.writeHead(200);
     /*let manager = function (err, data){
        send.write(data);
        count += 1
        if (count === 1){
          send.end()
        }}
      fs.readFile('index.html',manager)
      //fs.readFile('styles.css',manager)*/   
      fs.readFile('index.html', function(err, data){
        send.write(data);
        manager()
      })
      /*fs.readFile('styles.css', function(err, data){
        send.write(data);
        manager()
      })*/    
    function manager(){
        count += 1
        if (count === 1){
        send.end()
    }}          

}).listen(8000);

const connection = new Server(server);

//globals
const array_sockets_with_names = []
const ARRAY_JUST_NAMES = []
chosen_reciever = "all"
let rawID
socketid = ''
let sender_name


connection.on('connection', function(socket){
  console.log('User connected')
  console.log(socket.id)
  socket.emit('userlist', ARRAY_JUST_NAMES)   //global 2nd
  

  socket.on('disconnect', function () {
  console.log('User disconnected')
  })
  
  socket.on('message', function(message, chosen_reciever){
    console.log(message)
    console.log(chosen_reciever)
    global.chosen_reciever = chosen_reciever
    let socketid = socket.id
    global.socketid = socketid
    array_sockets_with_names.forEach(one_at_time_handler)
    //global 1st
    sendmsg(message, chosen_reciever, socketid)
  })
  
  socket.on('name', function(name){
    ARRAY_JUST_NAMES.push(name)
    console.log(name)
    console.log(ARRAY_JUST_NAMES)
    connection.emit('name_update', name)

     //Links recieved name with its address
     NAME_WITH_ADDRESS = name + (socket.id)
     array_sockets_with_names.push(NAME_WITH_ADDRESS)
     console.log(array_sockets_with_names)
     //array_sockets_with_names.filter(something)
  })

    socket.on('textdoc_content', function(message, chosen_reciever){
    console.log(message)
    console.log(chosen_reciever)
    global.chosen_reciever = chosen_reciever
    let socketid = socket.id
    global.socketid = socketid
    array_sockets_with_names.forEach(one_at_time_handler)
    //global 1st
    senddoc(message, chosen_reciever, socketid)
  })
})


//function something(){
//console.log(array_sockets_with_names)       //global 1st
//array_sockets_with_names.filter(one_at_time_handler)

function one_at_time_handler (one_at_time){
console.log(one_at_time)
        if (one_at_time.includes(chosen_reciever)) {
        console.log (one_at_time)
        console.log(chosen_reciever)          //global 3rd
        rawID = one_at_time                   //global 4th
        rawID = rawID.replace(chosen_reciever, "")
        console.log (rawID)
        }

        if (one_at_time.includes(socketid)){
        sender_name = one_at_time             //global 6th
        sender_name = sender_name.replace(socketid, '')
        console.log (sender_name)
  }
}


function sendmsg(message, chosen_reciever, socketid){
  console.log("from", sender_name, message, 'to', chosen_reciever)                            //globals 5 
  
  connection.to(rawID).to(socketid).emit("privatemessage", sender_name, message)
}

function senddoc(message, chosen_reciever, socketid){
  console.log("from", sender_name, message, 'to', chosen_reciever)                            //globals 5 
  
  connection.to(rawID).to(socketid).emit("recievedoc", sender_name, message)
}

/*deperecated code, delete
    /*if (thing.includes(chosen_reciever)) {
    console.log (thing)
    }*/

