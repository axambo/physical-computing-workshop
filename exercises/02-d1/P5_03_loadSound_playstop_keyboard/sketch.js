// Anna Xambó

// Basic control of playing a sound with keyboard keys, preload method with successCallback function

var sound;
var isLooping;

function preload(){
  // load sound here
  sound = loadSound("sounds/Prassel_noise_loop_4s.ogg", loaded);
}

function setup(){
  createCanvas(200, 200);
}

function draw(){
  background(0);
}

function loaded() {
  console.log("loaded");
  sound.playMode('restart');
  isLooping = 0;
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    console.log("UP_ARROW: play");
    sound.play();
  } else if (keyCode === DOWN_ARROW) {
    console.log("DOWN_ARROW: stop");
    sound.stop();
  } else if (keyCode === LEFT_ARROW) {
    console.log("LEFT_ARROW: reversed");
    if (!sound.isPlaying()) {
      sound.play();
    };
    sound.rate(-1);
  } else if (keyCode === RIGHT_ARROW) {
    console.log("RIGHT_ARROW: pause");
    sound.pause();
  } else if (keyCode === 76) {
    console.log("L");
    if (isLooping == 0)
    {
      console.log("looping");
      sound.setLoop(true);
      isLooping = 1;
    }
    else if (isLooping == 1) {
      console.log("no looping");
      sound.setLoop(false);
      isLooping = 0;
    }
  }
}
