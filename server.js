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

var pinchValue = 0;
var connections = {
    Screen : {},
    Mobile : {}
};

io.on('connection', function(socket){

    // get Socket id
    var socketId = socket.id;
    var pinchVars = {
        directionValue : 0,
        lastDirection : 0
    };

    socket.on('auth', function(data){
        // Fill screen or mobile property with socket id
        connections[data].socketId = socketId;
    });



    socket.on('pinch', function(data){

        if(data.direction != pinchVars.lastDirection){
            pinchVars.directionValue = 0;
        }else{
            pinchVars.directionValue += data.direction;
        }
        pinchVars.lastDirection = data.direction;
        socket.to(connections['Screen'].socketId).emit('pinch', pinchVars.directionValue);
    });

    socket.on('voice', function(level){
       socket.to(connections['Screen'].socketId).emit('voice', level.replace('%', ''));
    });


});


http.listen(3000, function(){
    console.log('listening on *:3000');
});
