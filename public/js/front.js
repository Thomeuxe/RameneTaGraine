/*******************
 * Helpers
 ******************/

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;


var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);


/*******************
 *
 * Animations (Tweenmax)
 *
 *******************/

// Nuage

var nuage1 = document.getElementById("nuage-1");
var nuage2 = document.getElementById("nuage-2");
var nuage3 = document.getElementById("nuage-3");

nuage1Tween = TweenMax.fromTo(nuage1, 50, {x: -nuage1.offsetWidth, ease: Linear.easeNone}, {x:w, ease: Linear.easeNone, repeat: -1});
TweenMax.set(nuage1, {y: 40});
TweenMax.to(nuage1, 2, {y: 60, ease: Sine.easeInOut, yoyo: true, repeat: -1});
nuage1Tween.seek(30);

nuage2Tween = TweenMax.fromTo(nuage2, 100, {x: -nuage2.offsetWidth, ease: Linear.easeNone}, {x:w, ease: Linear.easeNone, repeat: -1});
TweenMax.set(nuage2, {y: 10});
TweenMax.to(nuage2, 2, {y: 15, ease: Sine.easeInOut, yoyo: true, repeat: -1});
nuage2Tween.seek(25);

nuage3Tween = TweenMax.fromTo(nuage3, 80, {x: w, ease: Linear.easeNone}, {x:-nuage3.offsetWidth, ease: Linear.easeNone, repeat: -1});
TweenMax.set(nuage3, {y: 30});
TweenMax.to(nuage3, 2, {y: 10, ease: Sine.easeInOut, yoyo: true, repeat: -1});
nuage3Tween.seek(20);

////////////// SCROLL ANIMATION //////////////

var controller = new ScrollMagic.Controller();

// build tween
var timeline = new TimelineMax();
timeline.add([
    TweenMax.to('#nuage-wrapper', 10, {y: 300, ease: Linear.easeNone}),
    TweenMax.to('#header-logo', 10, {y: -250, ease: Linear.easeNone}),
    TweenMax.to('#header-graine-1', 10, {y: -280, ease: Linear.easeNone}),
    TweenMax.to('#header-graine-2', 10, {y: -150, ease: Linear.easeNone}),
    TweenMax.to('#header-graine-3', 10, {y: -430, ease: Linear.easeNone})
]);


// build scene
var scene = new ScrollMagic.Scene({triggerElement: "#header-wrapper", duration: '50%', triggerHook: 0})
// animate color and top border in relation to scroll position
    .setTween(timeline) // the tween durtion can be omitted and defaults to 1
    .addTo(controller);

/******************
 *
 * Home menu
 *
 *****************/

function closestEdge(x,y,w,h) {
    var topEdgeDist = distMetric(x,y,w/2,0);
    var bottomEdgeDist = distMetric(x,y,w/2,h);
    var leftEdgeDist = distMetric(x,y,0,h/2);
    var rightEdgeDist = distMetric(x,y,w,h/2);
    var min = Math.min(topEdgeDist,bottomEdgeDist,leftEdgeDist,rightEdgeDist);
    switch (min) {
        case leftEdgeDist:
            return "left";
        case rightEdgeDist:
            return "right";
        case topEdgeDist:
            return "top";
        case bottomEdgeDist:
            return "bottom";
    }
}

function distMetric(x,y,x2,y2) {
    var xDiff = x - x2;
    var yDiff = y - y2;
    return (xDiff * xDiff) + (yDiff * yDiff);
}

var headerGraines = document.querySelectorAll('.header__graine');

for(var i = headerGraines.length - 1; i >= 0; i--){
    headerGraines[i].addEventListener('mouseenter', hoverNav);
    headerGraines[i].hover = false;
    headerGraines[i].tl = new TimelineMax({onComplete: mouseOut.bind(this)});
}

function mouseOut(){
    this.hover = false;
}

function hoverNav(e) {
    var edge = closestEdge(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, $(this).width(), $(this).height());

    this.tl.clear();

    var tl = this.tl;

    if(edge == "bottom") {
        tl.add(TweenMax.to($(this)[0], 0.10, {y: -55, ease: Sine.easeOut}));
        tl.add(TweenMax.to($(this)[0], 0.30, {y: -15, ease: Bounce.easeOut}));
        tl.add(TweenMax.to($(this).closest('li')[0], 0.50, {rotation: 0, ease: Sine.easeOut}), 0);
    }else if(edge == "left"){
        tl.add(TweenMax.to($(this).closest('li')[0], 0.40, {rotation: "-=2", ease: Sine.easeOut}));
        tl.add(TweenMax.to($(this).closest('li')[0], 0.40, {rotation: "+=3", ease: Sine.easeInOut}), 0.40);
        tl.add(TweenMax.to($(this).closest('li')[0], 0.50, {rotation: "-=1.5", ease: Sine.easeInOut}), 0.8);
        tl.add(TweenMax.to($(this).closest('li')[0], 0.50, {rotation: 0, ease: Sine.easeOut}), 1.3);
        tl.add(TweenMax.to($(this)[0], 0.30, {rotation: -20, ease: Sine.easeOut}), 0);
        tl.add(TweenMax.to($(this)[0], 0.70, {rotation: 10, ease: Sine.easeInOut}), 0.30);
        tl.add(TweenMax.to($(this)[0], 0.40, {rotation: -5, ease: Sine.easeInOut}), 1);
        tl.add(TweenMax.to($(this)[0], 0.40, {rotation: 0, ease: Sine.easeInOut}), 1.4);
    }else if(edge == "top"){
        tl.add(TweenMax.to($(this)[0], 0.10, {y: 0, ease: Sine.easeOut}));
        tl.add(TweenMax.to($(this)[0], 0.30, {y: -15, ease: Bounce.easeOut}));
        tl.add(TweenMax.to($(this).closest('li')[0], 0.50, {rotation: 0, ease: Sine.easeOut}), 0);
    }else if(edge == "right"){
        tl.add(TweenMax.to($(this).closest('li')[0], 0.40, {rotation: "+=2", ease: Sine.easeOut}));
        tl.add(TweenMax.to($(this).closest('li')[0], 0.40, {rotation: "-=3", ease: Sine.easeInOut}), 0.40);
        tl.add(TweenMax.to($(this).closest('li')[0], 0.50, {rotation: "+=1.5", ease: Sine.easeInOut}), 0.8);
        tl.add(TweenMax.to($(this).closest('li')[0], 0.50, {rotation: 0, ease: Sine.easeOut}), 1.3);
        tl.add(TweenMax.to($(this)[0], 0.30, {rotation: 20, ease: Sine.easeOut}), 0);
        tl.add(TweenMax.to($(this)[0], 0.70, {rotation: -10, ease: Sine.easeInOut}), 0.30);
        tl.add(TweenMax.to($(this)[0], 0.40, {rotation: 5, ease: Sine.easeInOut}), 1);
        tl.add(TweenMax.to($(this)[0], 0.40, {rotation: 0, ease: Sine.easeInOut}), 1.4);
    }
}

/*******************
 *
 * Le client
 *
 ******************/

var valeursWidth = 0;

$.each($('.valeurs__mot'), function(index, item){
    valeursWidth += item.offsetWidth;
});

console.log(valeursWidth);

//var valeursTween = TweenMax.to('#valeurs-inner', 120, {x: -valeursWidth, ease: Linear.easeNone, yoyo: true, repeat: -1});

$('#valeurs-inner').on('mousedown', moveValeurs);
$('#valeurs-inner').on('mouseup', restartValeurs);

function moveValeurs(e) {
    e.preventDefault();
    valeursTween.kill();
    $('body').on('mousemove', null, {x: e.pageX, startX: $('#valeurs-inner')[0]._gsTransform.x}, dragValeurs);
    $('body').on('mouseup', restartValeurs);
}

function dragValeurs(e) {
    console.log(e.pageX - e.data.x);
    TweenMax.set('#valeurs-inner', {x: (e.data.startX + (e.pageX - e.data.x))});
}

function restartValeurs(e) {
    e.preventDefault();
    $('body').off('mousemove', dragValeurs);
    $('body').off('mouseup', restartValeurs);
    valeursTween = TweenMax.to('#valeurs-inner', 120, {x: -valeursWidth, ease: Linear.easeNone, yoyo: true, repeat: -1});
}


///////////// Les engagements /////////////

var engagementsTl = new TimelineMax({repeat: -1});

$.each($('.ensembleBlocsPartage'), function(i, item) {
    TweenMax.set(item, {opacity: 0, display: "none"});
    engagementsTl.add(TweenMax.to(item, 0.3, {opacity: 1, display: "flex", yoyo: true, repeat: 1, repeatDelay: 1}));
    engagementsTl.add(TweenMax.to(item, 0, {display: "none"}));
});

/******************
 *
 * Notre proposition
 *
 *****************/

var texts = $('#text-swap').attr('data-text');
var textsArray = texts.split(";");

var currentText = 0;
$('#text-swap')[currentText].innerHTML = textsArray[currentText];

var textSwapWidth = $('#text-swap')[0].offsetWidth;

var prev = Date.now();
var now;
var interval = 2000;

var tl = new TimelineMax({repeat: -1, repeatDelay: 1});

function setText() {
    if(tl.repeatDelay() > 0){
        //tl.timeScale(tl.timeScale() * 1.2);
    }

    if(currentText >= textsArray.length -1){
        currentText = 0;
    }else{
        currentText ++;
    }

    if(tl.timeScale() < 12){
        $('#text-swap')[0].innerHTML = textsArray[currentText];
    }else{
        tl.clear();
        TweenMax.set('#text-swap', {fontSize: 100});
        TweenMax.fromTo('#text-swap', 2.5, {y: 150, opacity: 0}, {y: -10, opacity: 1, ease: Sine.easeInOut})
        $('#text-swap')[0].innerHTML = $('#text-swap').attr('data-final');
    }
}

tl.fromTo('#text-swap', 0.3, {y: 0, opacity: 1}, {y: -50, opacity: 0, ease: Sine.easeIn})
    .call(setText)
    .fromTo('#text-swap', 0.3, {y: 50, opacity: 0}, {y: 0, opacity: 1, ease: Sine.easeOut});

// Devices sliders

var tween = TweenMax.to('#imac-image', 50, {y: "-1762px", ease: Sine.easeInOut, yoyo: true, repeat: -1});

var scene = new ScrollMagic.Scene({
    triggerElement: "#introduction"
})
    .setTween(tween) // trigger a TweenMax.to tween
    .addTo(controller);

var timeline = new TimelineMax();
timeline.add([
    TweenMax.from('#introduction-iphone', 10, {y: 300, opacity: 0, ease: Sine.easeOut}),
    TweenMax.from('#introduction-imac', 10, {y: 700, opacity: 0, ease: Sine.easeOut})
]);


// build scene
var scene = new ScrollMagic.Scene({triggerElement: "#introduction", duration: '50%', triggerHook: 0.5})
// animate color and top border in relation to scroll position
    .setTween(timeline) // the tween durtion can be omitted and defaults to 1
    .addTo(controller);

var IphoneSlider = function(){
    this.el = '#iphone-slider';
    this.$el = $(this.el);

    this.slides = [];

    this.speed = 4000;
    this.now = Date.now();
    this.prevNow = Date.now();

    $.each($('#iphone-slider > *'), function(i, val) {
        this.slides.push($(val));
    }.bind(this));

    this.slides[0].addClass('active');

    this.next = function() {
        for(var i = 0; i < this.slides.length; i++){
            if(this.slides[i].is('.active')){
                this.slides[i].removeClass('active');

                setTimeout(function() {
                    if(i < this.slides.length - 1){
                        this.slides[i+1].addClass('active');
                    }else{
                        this.slides[0].addClass('active');
                    }
                }.bind(this), 250);

                return;
            }
        }
    };

    this.prev = function() {
        for(var i = 0; i < this.slides.length; i++){
            if(this.slides[i].is('.active')){
                this.slides[i].removeClass('active');

                setTimeout(function() {
                    if (i > 0) {
                        this.slides[i - 1].addClass('active');
                    } else {
                        this.slides[this.slides.length - 1].addClass('active');
                    }
                }.bind(this), 250);

                return;
            }
        }
    };

    this.render = function() {
        this.now = Date.now();

        if(this.now - this.prevNow >= this.speed){
            this.prevNow = Date.now();
            this.next();
        }

        requestAnimationFrame(this.render);
    }.bind(this);

    requestAnimationFrame(this.render);
};

var iphoneSlider = new IphoneSlider();