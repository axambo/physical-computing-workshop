// Anna Xambó

// Basic play sound, preload method

var sound;

function preload(){
  // load sound here
  sound = loadSound("sounds/Prassel_noise_loop_4s.ogg", loaded);
}

function setup(){
  createCanvas(200, 200);
  sound.play();
  // play or loop sound here

}

function draw(){
  background(0);


function loaded(){
	console.log("success");
}
