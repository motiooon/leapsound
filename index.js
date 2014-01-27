#!/usr/bin/env node
var Leap = require("leapjs");
var nexpect = require('nexpect');
var growl = require('growl');


var controller = new Leap.Controller({ enableGestures: true });
var isDoingWork = false;


var OSX= {

    cache:{},

    volume : {
    get: function(cb){
        if(OSX.cache.volume){
            return OSX.cache.volume;
        }else{
            var volume = 0;
            // Get the darn volume
            nexpect.spawn("osascript", ["-e", "output volume of (get volume settings)"])
                .run(function (err, stdout, exitcode) {
                    if (!err) {
                        volume = Math.floor(stdout[0]/10);
                        OSX.cache.volume = volume;
                        if(cb){
                            cb(null, volume);
                        }
                    }
                });
        }
    },
    set: function(direction, cb){
            var arg2 = "set volume";

            var volume  = OSX.cache.volume;

            if(direction === "clockwise"){
                if(volume > 4) { //we don't want to go crazy with the volume
                    volume = 4;
                }else{
                    volume++;
                }

            }else{
                if(volume<0){volume =0}else{
                    volume--;
                }

            }

            arg2+= " " + volume;

            nexpect.spawn("osascript", ["-e", arg2])
                .run(function (err, stdout, exitcode) {
                    if (!err) {
                        var log_text = "Howdy! OSX volume was set to " + volume;
                        console.log(log_text);
                        growl(log_text, {title: "Leap Sound"});
                        OSX.cache.volume = volume;
                        if(cb){
                            cb(null, volume);
                        }
                    }
            });

    }
}};

OSX.volume.get();

controller.on( 'frame' , function( frame ){

    var gestures = frame.gestures,
        circle,
        pointable,
        direction,
        normal;
// Check if is there any gesture going on
    if(gestures.length > 0) {
        // In this example we will focus only on the first gesture, for the sake of simplicity
        if(gestures[0].type == 'circle') {
            circle = gestures[0];
            // Get Pointable object
            circle.pointable = frame.pointable(circle.pointableIds[0]);
            // Reset circle gesture variables as nedded, not really necessary in this case
            if(circle.state == 'start') {
                clockwise = true;
            } else if (circle.state == 'update') {
                direction = circle.pointable.direction;
                // Check if pointable exists
                if(direction) {
                    normal = circle.normal;
                    // Check if product of vectors is going forwards or backwards
                    // Since Leap uses a right hand rule system
                    // forward is into the screen, while backwards is out of it
                    clockwise = Leap.vec3.dot(direction, normal) > 0;
                    if(clockwise) {
                        //Do clockwose stuff

                        if(isDoingWork){
                            return;
                        }
                        isDoingWork = true;
                        OSX.volume.set("clockwise", function(vol){
                            isDoingWork = false;
                        })
                    } else {
                        //Do counterclockwise stuff

                        if(isDoingWork){
                            return;
                        }
                        isDoingWork = true;
                        OSX.volume.set("counter-clockwise", function(vol){
                            isDoingWork = false;
                        })

                    }
                }
            }
        }
    }


});

controller.connect();