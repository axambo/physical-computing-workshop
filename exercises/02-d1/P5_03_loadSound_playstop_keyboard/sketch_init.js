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
  // set playmode to restart
  // set Boolean isLooping to false
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
    // if the sound is in stop mode, it does not play reverse, how to avoid it?
    // set it to play if it is not playing!
    // set sound to reversed
  } else if (keyCode === RIGHT_ARROW) {
    console.log("RIGHT_ARROW: pause");
    // set pause sound
  } else if (keyCode === 76) {
    console.log("L");
    if (isLooping == 0)
    {
      console.log("looping");
      // set sound to loop
      // set isLooping to false
    }
    else if (isLooping == 1) {
      console.log("no looping");
      // set sound to no loop
      // set boolean isLooping to true
    }
  }
}
