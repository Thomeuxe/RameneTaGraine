var app = require('express')();
var http = require('http').Server(app);
var express = require('express');
var io = require('socket.io').listen(http);

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

var pinchEvents = 0;


io.on('connection', function(socket){
    pinchEvents = 0;

    // get Socket id
    var socketId = socket.id;

    socket.on('auth', function(data){
        // Fill screen or mobile property with socket id
        connections[data].socketId = socketId;
    });

    socket.on('pinch', function(){
        pinchEvents ++;
        socket.to(connections['Screen'].socketId).emit('pinch', pinchEvents);
    });

    socket.on('voice', function(level){
       socket.to(connections['Screen'].socketId).emit('voice', level.replace('%', ''));
    });


});


http.listen(3000, function(){
    console.log('listening on *:3000');
});
