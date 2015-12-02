var app = require('express')();
var http = require('http').Server(app);
var express = require('express');
var io = require('socket.io').listen(http);
var _ = require('lodash');

// Set static files
app.use(express.static(__dirname + '/public'));

// Router
app.get('/', function(req, res){
    res.sendFile('index.html');
});

var connections = {
    Screen : {},
    Mobile : {}
};

io.on('connection', function(socket){

    // get Socket id
    var socketId = socket.id;

    socket.on('auth', function(data){
        // Fill screen or mobile property with socket id
        connections[data].socketId = socketId;
    });



    socket.on('pinch', _.throttle(function(){
        socket.to(getSocketId('Screen')).emit('pinch');
    }, 50));

    socket.on('voice', function(level){
       socket.to(getSocketId('Screen')).emit('voice', level);
    });

    socket.on('position', function(element){
        socket.to(getSocketId('Mobile')).emit('position', element);
    });
});

function getSocketId(device){
    return connections[device].socketId;
}


http.listen(3000, function(){
    console.log('listening on *:3000');
});
