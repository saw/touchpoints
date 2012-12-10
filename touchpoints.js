"use strict";
(function(){
    

    var touches = {};
    var killers = {};


    var TRANSITION     = 'transition',
        TRANSFORM      = 'transform',
        TRANSITION_END = 'transitionend',
        TRANSFORM_CSS  = 'transform',
        TRANSITION_CSS = 'transition';

    if(typeof document.body.style.webkitTransform !== "undefined") {
        TRANSITION = 'webkitTransition';
        TRANSFORM = 'webkitTransform';
        TRANSITION_END = 'webkitTransitionEnd';
        TRANSFORM_CSS = '-webkit-transform';
        TRANSITION_CSS = '-webkit-transition'
    }
    

    function Touch(id) {
        this.id = id;
        var touchee = document.createElement('div');
        touchee.className = 'touched';
        touchee.style.opacity = 0;
        touchee.addEventListener(TRANSITION_END, function(){
            touchee.style[TRANSFORM] = '';
        });
        
        document.body.appendChild(touchee);
        this.node = touchee;
    }
    
    Touch.prototype.setPos = function(pos) {

        this.node.style.opacity = 1;
        var x = Math.round(pos[0] - 50)+ 'px';
        var y = Math.round(pos[1] - 50) + 'px';
        this.node.style[TRANSFORM] = "translate3d("+x+","+y+",0)"

    }
    
    Touch.prototype.destroy = function() {
        document.body.removeChild(this.node);
    }
    
    Touch.prototype.fade = function() {
        this.node.style[TRANSITION] = 'opacity .5s ease-in-out';
        this.node.style.opacity = 0;
        
    }
    
    function kill(id) {
        var victim = id;
        touches[victim] && touches[victim].fade();
        killers[victim] = window.setTimeout(function(){
            touches[victim] && touches[victim].destroy();
            delete(touches[victim]);
        },1000);
    }
    
    function rescue(id) {
        window.clearTimeout(killers[id]);
        delete killers[id];
    }
    
    function moverMS(e) {
        if(!touches[e.pointerId]) {
            touches[e.pointerId] = new Touch(e.pointerId);
        }
        rescue(e.pointerId);
        touches[e.pointerId].setPos([e.clientX, e.clientY]);
    }
    
    function mover(e) {
        e.preventDefault();
        var len = e.touches.length, thistouch;
        for (var i=0; i < len; i++) {
            thistouch = e.touches[i];
            if(!touches[thistouch.identifier]) {
                touches[thistouch.identifier] = new Touch(thistouch.identifier);
            }
            rescue(thistouch.identifier);
            touches[thistouch.identifier].setPos([thistouch.pageX, thistouch.pageY]);
        }
    }
    
    function reaper(){
        try{
            var id;
            for(id in touches) {
                kill(id);
            }
        }catch(e){
            log(e.message);
        }

    }
        
    document.addEventListener('touchstart', mover);
    document.addEventListener('touchmove', mover);
    
    document.addEventListener('MSPointerStart', moverMS);
    document.addEventListener('MSPointerMove', moverMS);
    
    document.addEventListener('MSPointerUp', reaper);
    document.addEventListener('touchend', reaper);
}());