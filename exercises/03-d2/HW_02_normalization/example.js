var wSize = 128;
var sr = 60;
var fft = new FFT(wSize, sr);
var net;
var currentGesture = 0;
var playing = false;

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
  if(playing)return;
  playing = true;
  //environment.start();
}

function getNN(){
    $.getJSON("nnet.json", function( data ) {
        net = new convnetjs.Net();
        net.fromJSON(data);
        $("#display").text("Touch screen to start...");
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
    var k = 0;
    var prevX=0, prevY=0, prevZ=0;
    var currentvalueX;
    var maxX=0, minX=1;
    var ncurrentvalueX;
    var currentvalueY;
    var maxY=0, minY=1;
    var ncurrentvalueY;

    window.ondevicemotion = function(e) {
        if (net==null || !playing) return;
        var x = e.accelerationIncludingGravity.x;
        var y = e.accelerationIncludingGravity.y;
        var z = e.accelerationIncludingGravity.z;
        accelWin.push([x, y, z]);

        $("#displayx").text(x);
        $("#displayy").text(y);
        $("#displayz").text(z);

        if(accelWin.length > wSize){
                accelWin.shift();
                pred = getPrediction(accelWin);
                if(isStill(x,y,z) || pred[1] < 0.9) {
                  gesture = currentGesture = -1;
                }
                else {
                  if (pred[0] != currentGesture && pred[0] >=0 && pred[0] <3&&pred[1] > 0.9) {
                    gesture = pred[0];
                  }
                  displayGesture(parseInt(gesture));
                  if (currentGesture == 0) {
                  }
                  else if (currentGesture == 1) {
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
