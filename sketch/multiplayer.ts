type Settings = {
    playerN: number;
    speed: number;
    size: [number,number]
}
type PlayerData = {
    heading: [number,number]
    location: [number,number]
}
function addbuttonListeners(){
    createCanvas(windowHeight, windowHeight);
    const joinButton = document.getElementById("join")
    joinButton.addEventListener("click", JoinRoom);
    const createButton = document.getElementById("create")
    createButton.addEventListener("click", CreateRoom);
    const startButton = document.getElementById("start")
    startButton.addEventListener("click", startGame);
}
function JoinRoom(){
    // @ts-ignore
    let roomID = document.getElementById("gcode").value
    //console.log(roomID)
    socket.emit("join",roomID)

}
function grabSettings(){
    let settings = <Settings>{};
    settings.playerN = 2
    settings.size = [51,51]
    settings.speed = 15
    return settings
}
function setSettings(Nsettings:Settings){
    settings=Nsettings
}
function CreateRoom(){
    let settings = grabSettings()

    socket.emit("create",settings)
}

function JoinedRoom(args:any){
    //console.log(args.roomID,args.settings)
    setSettings(args.settings)
    ROOM_ID = args.roomID
    Nplayer = args.Nplayer
    socket.on("start",Start)
    document.getElementById('RoomID').innerHTML
        = ROOM_ID.toString();
}
function startGame(){
    socket.emit("start")
}
function Start(args:any){
    console.log("START")
    rectMode(CENTER).noFill().frameRate(settings.speed);
    tron = new Tron([windowHeight,windowHeight], settings.size, settings.playerN)
    timer = setInterval(SendData,1)
    SendData()
    playing = true
    socket.on("data",updateData)
}
function SendData(){
    socket.emit("gameData",{"data":tron.players[Nplayer].generateData(),"playerID":Nplayer,"roomID":ROOM_ID})

}
function updateData(args:any){
    //console.log(args)
    let data:PlayerData[] = args.data
    let index:number = args.index
    //console.log(data[0])
    //console.log(tron.index.toString()+":"+index.toString())
    let i = 0
    for (let player of data) {
        if (i != Nplayer){
            tron.players[i].heading = createVector(player.heading[0], player.heading[1])
            let locVec = createVector(player.location[0], player.location[1])
            if (!tron.players[i].location.equals(locVec)) {
                tron.players[i].location = locVec
            }
        }

        i++;
    }

}