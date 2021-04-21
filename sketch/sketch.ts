// GLOBAL VARS & TYPES
let numberOfShapes = 15;
let speed: p5.Element;
let tron: Tron;
// P5 WILL AUTOMATICALLY USE GLOBAL MODE IF A DRAW() FUNCTION IS DEFINED
function setup() {
  console.log("🚀 - Setup initialized - P5 is running");

  tron = new Tron([500,500],[50,50],2)
  // FULLSCREEN CANVAS
  createCanvas(500, 500);

  // SETUP SOME OPTIONS
  rectMode(CENTER).noFill().frameRate(25);

}
function keys_moves():Array<number>{
  let moves = [-1,-1,-1,-1]

  return moves

}

// p5 WILL HANDLE REQUESTING ANIMATION FRAMES FROM THE BROWSER AND WIL RUN DRAW() EACH ANIMATION FROME
function draw() {
  // CLEAR BACKGROUND
  background(0);
  // TRANSLATE TO CENTER OF SCREEN
  tron.step(keys_moves)
  tron.draw()
}

// p5 WILL AUTO RUN THIS FUNCTION IF THE BROWSER WINDOW SIZE CHANGES
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
