var UserInteraction = function(){
    this.socket = io();
    this.deviceType = ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) ? 'Mobile' : 'Screen';
    this.authenticate();
    this.getElements();
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
        this.detectAudio();
        this.socket.on('pinch', this.getPinch.bind(this));
        this.socket.on('voice', function(ev){console.log('test')});
        // this.getVoice.bind(this)
    }
};

UserInteraction.prototype.getElements = function(){
  this.els = {
      nuage1: document.getElementById('test1'),
      nuage2: document.getElementById('test2'),
      eolienne: document.getElementById('eolienne')
  };
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
                level = Math.round(average);
            _self.getVoice(level);
            //_self.socket.emit('voice', level);
        }
    }, function(){alert('pas de media')});
};

UserInteraction.prototype.detectPinch = function(){
    var _self = this;
    var hammertime = new Hammer(document.getElementsByTagName('body')[0]);
    hammertime.get('pinch').set({ enable: true });

    hammertime.on('pinchin', function() {
        _self.socket.emit('pinch', {
            direction : 1
        });
    });
    hammertime.on('pinchout', function() {
        _self.socket.emit('pinch', {
            direction : -1
        });
    });
};

UserInteraction.prototype.getPinch = function(direction){
    // direction = 1(zoom) or -1(dezoom)
    TweenMax.to(this.els.nuage1, 0.5, {x: "+=" + direction/2});
    TweenMax.to(this.els.nuage2, 0.5, {x: "-=" + direction/2});
};

UserInteraction.prototype.getVoice = function(level){
    if(level > 50){
        TweenMax.to(this.els.eolienne, 0.3, {rotation : "+=" + level /2});
    }
};


new UserInteraction();

