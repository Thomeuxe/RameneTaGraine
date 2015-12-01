var UserInteraction = function(){
    this.socket = io();
    this.deviceType = ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) ? 'Mobile' : 'Screen';
    this.authenticate();
    this.initEvents();
};

UserInteraction.prototype.authenticate = function(){
    this.socket.emit('auth', this.deviceType );
};

UserInteraction.prototype.initEvents = function(){
    if(this.deviceType == 'Mobile'){
        this.detectPinch();
        this.detectAudio();
    }else{
        this.socket.on('pinch', this.getPinch);
        this.socket.on('voice', this.getVoice);
    }
};

UserInteraction.prototype.detectAudio = function(){
    var _self = this;
    navigator.getUserMedia = ( navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
    navigator.getUserMedia({audio: true}, function(stream) {
        audioContext = new AudioContext();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

        analyser.smoothingTimeConstant = 0.3;
        analyser.fftSize = 1024;

        microphone.connect(analyser);
        analyser.connect(javascriptNode);
        javascriptNode.connect(audioContext.destination);

        javascriptNode.onaudioprocess = function() {

            var array = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(array);
            var values = 0;

            var length = array.length;
            for (var i = 0; i < length; i++) {
                values += array[i];
            }

            var average = values / length,
                level = Math.round(average) + '%';
            _self.socket.emit('voice', level);
        }
    }, function(){alert('pas de media')});
};

UserInteraction.prototype.detectPinch = function(){
    var _self = this;
    var hammertime = new Hammer(document.getElementsByTagName('body')[0]);
    hammertime.get('pinch').set({ enable: true });

    hammertime.on('pinch', function() {
        _self.socket.emit('pinch');
    });
};

UserInteraction.prototype.getPinch = function(PinchNumber){
    document.getElementsByClassName('header__logo')[0].style.transform = "translate(" + (50+PinchNumber/2) + "%, -50%)";
};


UserInteraction.prototype.getVoice = function(level){
    document.getElementsByClassName('header__nuage--1')[0].style.transform = "translate3d(50vw, " + level*10 + "px, 0)";
};


new UserInteraction();

