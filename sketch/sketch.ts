// GLOBAL VARS & TYPES

let numberOfShapes = 15;
let speed: p5.Element;
let tron: Tron;
let keys: number[];
let socket: SocketIOClient.Socket
let settings: Settings;
let playing = false
let Nplayer = 0
let ROOM_ID = 0
let timer: NodeJS.Timer
let dataUpdated = false
// P5 WILL AUTOMATICALLY USE GLOBAL MODE IF A DRAW() FUNCTION IS DEFINED
function setup() {
  console.log("🚀 - Setup initialized - P5 is running");
  keys = [-1,-1,-1,-1]
  //tron = new Tron([1020,1020],[51,51],2)//ODD
  // FULLSCREEN CANVAS
  addbuttonListeners()
  // SETUP SOME OPTIONS
  // @ts-ignore
  socket = io("ws://192.168.55.192:5000");
  socket.on("joinedRoom",JoinedRoom)
}

function keys_moves():Array<number>{
  if (keyIsDown(65)) {
    keys[Nplayer] = 0
  } else if (keyIsDown(87)) {
    keys[Nplayer] = 1
  } else if (keyIsDown(68)) {
    keys[Nplayer] = 2
  } else if (keyIsDown(83)) {
    keys[Nplayer] = 3
  }else{
    keys[Nplayer] = -1
  }
  return keys

}

// p5 WILL HANDLE REQUESTING ANIMATION FRAMES FROM THE BROWSER AND WIL RUN DRAW() EACH ANIMATION FROME
function draw() {
  // CLEAR BACKGROUND
  background(0);
  if (playing) {
    if (!dataUpdated){
        print("Missed Update")
    }
    tron.step(keys_moves)
    dataUpdated = false
    tron.draw()
    if (tron.bikesAlive.length == 1) {
      keys = [-1, -1, -1, -1]
      let lastAlive = tron.players.indexOf(tron.bikesAlive[0])
      tron.score[lastAlive] += 1;
      console.log(str(lastAlive) + "WON!!!!")
      tron.reset()
      playing = false
      socket.emit("stop",lastAlive)
    }
  
  }
}

// p5 WILL AUTO RUN THIS FUNCTION IF THE BROWSER WINDOW SIZE CHANGES
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
