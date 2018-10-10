// Anna Xambó

// Basic play sound, preload method

var sound;

function preload(){
  // load sound here
  sound = loadSound("sounds/Prassel_noise_loop_4s.ogg");
}

function setup(){
  createCanvas(200, 200);
  // play or loop sound here
  sound.play();

}

function draw(){
  background(0);
}
