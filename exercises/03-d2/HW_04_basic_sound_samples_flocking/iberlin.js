var wSize = 128;
var sr = 60;
var fft = new FFT(wSize, sr);
var net;
var currentGesture = 0;
var isplaying = false;

let environment = flock.init();
let synth = new Array(12);
let index_raw;
let index_synth;
let numSynths = 12;

function setSound() {
  synth[0] = flock.synth({
    synthDef: {
      id: "playbuf",
      ugen: "flock.ugen.playBuffer",
      buffer: {
          id: "stream1",
          url: "snd/69250__reinsamba__numbers-german-male.mp3"
      },
      loop: 1,
      start: 0,
      speed: 1,
      trigger: 0
    },
    addToEnvironment: true
});
synth[1] = flock.synth({
  synthDef: {
    id: "playbuf",
    ugen: "flock.ugen.playBuffer",
    buffer: {
        id: "stream2",
        url: "snd/69248__reinsamba__colours-german-male.mp3"
    },
    loop: 1,
    start: 0,
    speed: 1,
    trigger: 0
  },
  addToEnvironment: true
});
synth[2] = flock.synth({
  synthDef: {
    id: "playbuf",
    ugen: "flock.ugen.playBuffer",
    buffer: {
        id: "stream3",
        url: "snd/178937__laureci__motzstrasse2.mp3"
    },
    loop: 1,
    start: 0,
    speed: 1,
    trigger: 0
  },
  addToEnvironment: true
});
synth[3] = flock.synth({
  synthDef: {
    id: "playbuf",
    ugen: "flock.ugen.playBuffer",
    buffer: {
        id: "stream4",
        url: "snd/164297__adneonlux__night-train-to-berlin.mp3"
    },
    loop: 1,
    start: 0,
    speed: 1,
    trigger: 0
  },
  addToEnvironment: true
});
synth[4] = flock.synth({
  synthDef: {
    id: "playbuf",
    ugen: "flock.ugen.playBuffer",
    buffer: {
        id: "stream5",
        url: "snd/172605__holophonicaudiolab__berlin-raindrops.mp3"
    },
    loop: 1,
    start: 0,
    speed: 1,
    trigger: 0
  },
  addToEnvironment: true
});
synth[5] = flock.synth({
  synthDef: {
    id: "playbuf",
    ugen: "flock.ugen.playBuffer",
    buffer: {
        id: "stream6",
        url: "snd/193532__datwilightz__eins-zwei-voice-sample.mp3"
    },
    loop: 1,
    start: 0,
    speed: 1,
    trigger: 0
  },
  addToEnvironment: true
});
synth[6] = flock.synth({
  synthDef: {
    id: "playbuf",
    ugen: "flock.ugen.playBuffer",
    buffer: {
        id: "stream7",
        url: "snd/209672__renmaid__dogs-berlin.mp3"
    },
    loop: 1,
    start: 0,
    speed: 1,
    trigger: 0
  },
  addToEnvironment: true
});
synth[7] = flock.synth({
  synthDef: {
    id: "playbuf",
    ugen: "flock.ugen.playBuffer",
    buffer: {
        id: "stream8",
        url: "snd/242496__uair01__berlin-beggars-busking.mp3"
    },
    loop: 1,
    start: 0,
    speed: 1,
    trigger: 0
  },
  addToEnvironment: true
});
synth[8] = flock.synth({
  synthDef: {
    id: "playbuf",
    ugen: "flock.ugen.playBuffer",
    buffer: {
        id: "stream9",
        url: "snd/396676__dbspin__u-bahn-journey-day.mp3"
    },
    loop: 1,
    start: 0,
    speed: 1,
    trigger: 0
  },
  addToEnvironment: true
});
synth[9] = flock.synth({
  synthDef: {
    id: "playbuf",
    ugen: "flock.ugen.playBuffer",
    buffer: {
        id: "stream10",
        url: "snd/396680__dbspin__berlin-cafe-day-quiet-2.mp3"
    },
    loop: 1,
    start: 0,
    speed: 1,
    trigger: 0
  },
  addToEnvironment: true
});
synth[10] = flock.synth({
  synthDef: {
    id: "playbuf",
    ugen: "flock.ugen.playBuffer",
    buffer: {
        id: "stream11",
        url: "snd/396682__dbspin__walking-in-berlin-at-night-with-traffic.mp3"
    },
    loop: 1,
    start: 0,
    speed: 1,
    trigger: 0
  },
  addToEnvironment: true
});
synth[11] = flock.synth({
  synthDef: {
    id: "playbuf",
    ugen: "flock.ugen.playBuffer",
    buffer: {
        id: "stream12",
        url: "snd/435001__laspaziale__testing-dato-duo.mp3"
    },
    loop: 1,
    start: 0,
    speed: 1,
    trigger: 0
  },
  addToEnvironment: true
});
}

function argmax(arr){
    maxVal = 0;
    maxIdx = null;
    for(var i in arr){
        if (arr[i] > maxVal){
            maxIdx = i;
            maxVal = arr[i]
        }
    }
    return maxIdx;
}

var prevX = 0;
var prevY = 0;
var prevZ = 0;
var th = 0.02;

var isStill = function(x,y,z){
    var result =
        (Math.abs(x - prevX) < th) &&
        (Math.abs(y - prevY) < th) &&
        (Math.abs(z - prevZ) < th)
    prevX = x; prevY = y; prevZ = z;
    return result;
}

function xl2color(val){return parseInt(127*(1+(val/20)))};

function getPrediction(data){
    var point = Array();
    var x = Array();
    var y = Array();
    var z = Array();

    for (var i = 0; i < data.length; i ++){
            var accelPoint = data[i];
            x.push(accelPoint[0]);
            y.push(accelPoint[1]);
            z.push(accelPoint[2]);
    }

    fft.forward(x);
    point = point.concat(Array.prototype.slice.call(fft.spectrum));
    fft.forward(y);
    point = point.concat(Array.prototype.slice.call(fft.spectrum));
    fft.forward(z);
    point = point.concat(Array.prototype.slice.call(fft.spectrum));

    var vol = new convnetjs.Vol(point);
    var result = net.forward(vol, false);
    var pred = argmax(result.w);
    return [pred, result.w[pred]]
}


function touchStart(event) {
  console.log("hello!"+isplaying);
//debugger;
  if(isplaying) {
    return;
  } else {
    environment.start();
    currentPlayer = synth[0];
    //console.log(currentPlayer);
    //currentPlayer.set("playbuf.trigger", 1);
    isplaying = true;
    index_raw = -1;
  }
}

function getNN(){

    $.getJSON("nnet.json", function( data ) {
        net = new convnetjs.Net();
        net.fromJSON(data);
        $("#display").text("Touch screen to start...");
        console.log("attaching event");
        document.addEventListener('touchstart', touchStart, false);
    });

}


function isFlat(x,y,z){
    var th = 0.1;
    return
        Math.abs(x) < th && Math.abs(y) < th && Math.abs(10-z) < th;
}

function displayGesture(gesture){
  switch (gesture){
    case -1:
      showColor(0,0,0);$("#display").text("");
      break;
    case 0:
      showColor(256,0,0);$("#display").text("Left/Right");
      break;
    case 1:
      showColor(0,256,0);$("#display").text("Up/Down");
      break;
    case 2:
      showColor(0,0,256);$("#display").text("Tilt");
      break;
    default: break;
  }
}

function showColor(r,g,b){
    $(".colourme").css("background-color", "rgb(" + r+ "," + g + "," + b + ")");
}

function normalize(val, max, min) { return (val - min) / (max - min); }

$(function(){
    var accelWin = [];
    $("#display").text("loading, please wait...");
    getNN(); // to execute getNN asynchronously
    setSound();
    var k = 0;
    var prevX=0, prevY=0, prevZ=0;
    var currentvalueX;
    var maxX=0, minX=1;
    var ncurrentvalueX;
    var currentvalueY;
    var maxY=0, minY=1;
    var ncurrentvalueY;
    var currentvalueZ;
    var maxZ=0, minZ=1;
    var ncurrentvalueZ;

    window.ondevicemotion = function(e) {

        if (net==null || !isplaying) return;
        var x = e.accelerationIncludingGravity.x;
        var y = e.accelerationIncludingGravity.y;
        var z = e.accelerationIncludingGravity.z;
        accelWin.push([x, y, z]);

        //$("#displayx").text(x);
        //$("#displayy").text(y);
        $("#displayz").text(z);

        // Normalize X value
        // We will need to know currentvalueX, minX and maxX

        currentvalueX = Math.abs(x);
        if(currentvalueX > maxX){
          maxX = currentvalueX;
        }
        if(currentvalueX < minX){
          minX = currentvalueX;
        }
        var ncurrentvalueX = normalize(currentvalueX, maxX, minX);
        $("#displayx").text(ncurrentvalueX);

        // Normalize Z value
        // We will need to know currentvalueZ, minZ and maxZ

        currentvalueY = Math.abs(y);
        if(currentvalueY > maxY){
          maxY = currentvalueY;
        }
        if(currentvalueY < minY){
          minY = currentvalueY;
        }

        var ncurrentvalueY = normalize(currentvalueY, maxY, minY);
        $("#displayy").text(ncurrentvalueY);

        // Normalize Z value
        // We will need to know currentvalueZ, minZ and maxZ

        currentvalueZ = Math.abs(z);
        if(currentvalueZ > maxZ){
          maxZ = currentvalueZ;
        }
        if(currentvalueZ < minZ){
          minZ = currentvalueZ;
        }

        var ncurrentvalueZ = normalize(currentvalueZ, maxZ, minZ);
        $("#displayz").text(ncurrentvalueZ);


        if(accelWin.length > wSize){
                accelWin.shift();
                pred = getPrediction(accelWin);
                if(isStill(x,y,z) || pred[1] < 0.9) {
                  gesture = currentGesture = -1;
                  //currentPlayer.pause();
                }
                else { // if in motion...
                  if (pred[0] != currentGesture && pred[0] >=0 && pred[0] <3&&pred[1] > 0.9) {
                    gesture = pred[0];
                    currentGesture = gesture;


                    if (currentGesture == 0) {
                      currentPlayer.pause();
                      index_raw = index_raw + 1;
                      index_synth = index_raw%numSynths;
                      currentPlayer = synth[index_synth];
                      currentPlayer.play();
                      currentPlayer.set("playbuf.trigger",1);
                    }

                    }
                  // displayGesture(parseInt(gesture));
                  else {

                    displayGesture(parseInt(currentGesture));

                    if (currentGesture == 0) {
                      currentPlayer.set({
                        //"playbuf.trigger": 1,
                        "playbuf.mul": 1,
                        "playbuf.speed": 1
                      });
                    }
                    else if (currentGesture == 1) {
                      currentPlayer.set({
                        "playbuf.mul": ncurrentvalueY
                      });
                    }
                    else if (currentGesture == 2) {
                      currentPlayer.set({
                        "playbuf.speed": ncurrentvalueZ,
                        "playbuf.mul": 1-ncurrentvalueY
                      });
                    }

                  }

                }

        } else {
            $("#display").text(wSize - accelWin.length); // when eq 0 is ready to predict gestures
        }
        prevX = x;
        prevY = y;
        prevZ = z;
    }
});
