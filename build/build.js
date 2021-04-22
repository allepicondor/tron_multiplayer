var ColorHelper = (function () {
    function ColorHelper() {
    }
    ColorHelper.getColorVector = function (c) {
        return createVector(red(c), green(c), blue(c));
    };
    ColorHelper.rainbowColorBase = function () {
        return [
            color('red'),
            color('orange'),
            color('yellow'),
            color('green'),
            color(38, 58, 150),
            color('indigo'),
            color('violet')
        ];
    };
    ColorHelper.getColorsArray = function (total, baseColorArray) {
        var _this = this;
        if (baseColorArray === void 0) { baseColorArray = null; }
        if (baseColorArray == null) {
            baseColorArray = ColorHelper.rainbowColorBase();
        }
        var rainbowColors = baseColorArray.map(function (x) { return _this.getColorVector(x); });
        ;
        var colours = new Array();
        for (var i = 0; i < total; i++) {
            var colorPosition = i / total;
            var scaledColorPosition = colorPosition * (rainbowColors.length - 1);
            var colorIndex = Math.floor(scaledColorPosition);
            var colorPercentage = scaledColorPosition - colorIndex;
            var nameColor = this.getColorByPercentage(rainbowColors[colorIndex], rainbowColors[colorIndex + 1], colorPercentage);
            colours.push(color(nameColor.x, nameColor.y, nameColor.z));
        }
        return colours;
    };
    ColorHelper.getColorByPercentage = function (firstColor, secondColor, percentage) {
        var firstColorCopy = firstColor.copy();
        var secondColorCopy = secondColor.copy();
        var deltaColor = secondColorCopy.sub(firstColorCopy);
        var scaledDeltaColor = deltaColor.mult(percentage);
        return firstColorCopy.add(scaledDeltaColor);
    };
    return ColorHelper;
}());
var Tron = (function () {
    function Tron(res, dim, players) {
        this.index = 0;
        this.board = new Board(dim, res);
        this.playerN = players;
        this.score = [0, 0, 0, 0];
        this.dim = dim;
        this.SPAWN_HEADINGS = [createVector(1, 0), createVector(-1, 0),
            createVector(0, 1), createVector(0, -1)];
        this.COLOR = [color(0, 0, 255), color(255, 0, 0), color(0, 255, 0), color(255, 0, 255)];
        this.SPAWN_POS = [createVector(2, floor(dim[1] / 2)), createVector(dim[0] - 3, floor(dim[1] / 2)),
            createVector(floor(dim[0] / 2), 2), createVector(floor(dim[0] / 2), dim[1] - 3)];
        this.reset();
    }
    Tron.prototype.reset = function () {
        this.index = 0;
        this.bikesAlive = [];
        this.players = [];
        for (var i = 0; i < this.playerN; i++) {
            var bike = new Bike(this.SPAWN_POS[i].copy(), this.SPAWN_HEADINGS[i].copy(), this.COLOR[i], this.board);
            this.players.push(bike);
            this.bikesAlive.push(bike);
        }
    };
    Tron.prototype.number_to_vector = function (n) {
        if (n === 0) {
            return createVector(-1, 0);
        }
        else if (n === 1) {
            return createVector(0, -1);
        }
        else if (n === 2) {
            return createVector(1, 0);
        }
        else if (n === 3) {
            return createVector(0, 1);
        }
        else {
            return null;
        }
    };
    Tron.prototype.step = function (callback) {
        var moves = callback();
        var i = 0;
        for (var _i = 0, _a = this.bikesAlive; _i < _a.length; _i++) {
            var bike = _a[_i];
            var new_heading = this.number_to_vector(moves[i]);
            bike.heading = new_heading === null ? bike.heading : new_heading;
            bike.move();
            if (bike.check_body_collisions(this.bikesAlive)) {
                var index = this.bikesAlive.indexOf(bike, 0);
                if (index > -1) {
                    this.bikesAlive.splice(index, 1);
                }
            }
            i++;
        }
        this.check_headons();
        this.index += 1;
    };
    Tron.prototype.draw = function () {
        for (var _i = 0, _a = this.bikesAlive; _i < _a.length; _i++) {
            var bike = _a[_i];
            bike.draw();
        }
    };
    Tron.prototype.containsObject = function (obj, list) {
        var i;
        for (i = 0; i < list.length; i++) {
            if (list[i] === obj) {
                return true;
            }
        }
        return false;
    };
    Tron.prototype.chooseRI = function (choices) {
        var index = Math.floor(Math.random() * choices.length);
        return index;
    };
    Tron.prototype.check_on_board = function (loc) {
        return loc.x < 0 || loc.y < 0 || loc.x > this.dim[0] || loc.y > this.dim[1];
    };
    Tron.prototype.check_headons = function () {
        var dead_bikes = [];
        for (var _i = 0, _a = this.bikesAlive; _i < _a.length; _i++) {
            var bike = _a[_i];
            if (!this.containsObject(bike, dead_bikes)) {
                if (this.check_on_board(bike.location)) {
                    var index = this.bikesAlive.indexOf(bike);
                    this.bikesAlive.splice(index, 1);
                    continue;
                }
                for (var _b = 0, _c = this.bikesAlive; _b < _c.length; _b++) {
                    var other_bike = _c[_b];
                    if (bike == other_bike) {
                        continue;
                    }
                    if (bike.location.equals(other_bike.location)) {
                        dead_bikes.push(bike);
                        dead_bikes.push(other_bike);
                        break;
                    }
                }
            }
        }
        while (dead_bikes.length > 1) {
            var i = this.chooseRI(dead_bikes);
            var index = this.bikesAlive.indexOf(dead_bikes[i]);
            this.bikesAlive.splice(index, 1);
            dead_bikes.splice(i, 1);
        }
    };
    return Tron;
}());
var Bike = (function () {
    function Bike(spawn, initalH, color, board) {
        this.location = spawn;
        this.heading = initalH;
        this.trail = [];
        this.color = color;
        this.board = board;
    }
    Bike.prototype.move = function () {
        this.trail.push(this.location.copy());
        this.location.add(this.heading);
    };
    Bike.prototype.generateData = function () {
        var data = {};
        data.location = [tron.players[Nplayer].location.x, tron.players[Nplayer].location.y];
        data.heading = [tron.players[Nplayer].heading.x, tron.players[Nplayer].heading.y];
        return data;
    };
    Bike.prototype.draw = function () {
        this.board.draw_cord(this.location, this.color);
        for (var _i = 0, _a = this.trail; _i < _a.length; _i++) {
            var step = _a[_i];
            this.board.draw_cord(step, this.color);
        }
    };
    Bike.prototype.check_body_collisions = function (bikes) {
        for (var _i = 0, bikes_1 = bikes; _i < bikes_1.length; _i++) {
            var bike = bikes_1[_i];
            for (var _a = 0, _b = bike.trail; _a < _b.length; _a++) {
                var step = _b[_a];
                if (step.equals(this.location)) {
                    return true;
                }
            }
        }
        return false;
    };
    return Bike;
}());
var Board = (function () {
    function Board(dim, res) {
        this.dimension = dim;
        this.resolution = res;
        this.segment = [res[0] / dim[0], res[1] / dim[1]];
    }
    Board.prototype.get_pixel = function (cord) {
        return createVector(cord.x * this.segment[0], cord.y * this.segment[1]);
    };
    Board.prototype.draw_cord = function (cord, color) {
        fill(color);
        var pixel = this.get_pixel(cord);
        rect(pixel.x + this.segment[0] / 2, pixel.y + this.segment[1] / 2, this.segment[0], this.segment[1]);
        return true;
    };
    return Board;
}());
function addbuttonListeners() {
    createCanvas(windowHeight, windowHeight);
    var joinButton = document.getElementById("join");
    joinButton.addEventListener("click", JoinRoom);
    var createButton = document.getElementById("create");
    createButton.addEventListener("click", CreateRoom);
    var startButton = document.getElementById("start");
    startButton.addEventListener("click", startGame);
}
function JoinRoom() {
    var roomID = document.getElementById("gcode").value;
    socket.emit("join", roomID);
}
function grabSettings() {
    var settings = {};
    settings.playerN = 2;
    settings.size = [51, 51];
    settings.speed = 15;
    return settings;
}
function setSettings(Nsettings) {
    settings = Nsettings;
}
function CreateRoom() {
    var settings = grabSettings();
    socket.emit("create", settings);
}
function JoinedRoom(args) {
    setSettings(args.settings);
    ROOM_ID = args.roomID;
    Nplayer = args.Nplayer;
    socket.on("start", Start);
    document.getElementById('RoomID').innerHTML
        = ROOM_ID.toString();
}
function startGame() {
    socket.emit("start");
}
function Start(args) {
    console.log("START");
    rectMode(CENTER).noFill().frameRate(settings.speed);
    tron = new Tron([windowHeight, windowHeight], settings.size, settings.playerN);
    timer = setInterval(SendData, 1);
    SendData();
    playing = true;
    socket.on("data", updateData);
}
function SendData() {
    socket.emit("gameData", { "data": tron.players[Nplayer].generateData(), "playerID": Nplayer, "roomID": ROOM_ID });
}
function updateData(args) {
    var data = args.data;
    var index = args.index;
    var i = 0;
    for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
        var player = data_1[_i];
        if (i != Nplayer) {
            tron.players[i].heading = createVector(player.heading[0], player.heading[1]);
            var locVec = createVector(player.location[0], player.location[1]);
            if (!tron.players[i].location.equals(locVec)) {
                tron.players[i].location = locVec;
            }
        }
        i++;
    }
}
var numberOfShapes = 15;
var speed;
var tron;
var keys;
var socket;
var settings;
var playing = false;
var Nplayer = 0;
var ROOM_ID = 0;
var timer;
function setup() {
    console.log("🚀 - Setup initialized - P5 is running");
    keys = [-1, -1, -1, -1];
    addbuttonListeners();
    socket = io("ws://192.168.55.192:5000");
    socket.on("joinedRoom", JoinedRoom);
}
function keys_moves() {
    if (keyIsDown(65)) {
        keys[Nplayer] = 0;
    }
    else if (keyIsDown(87)) {
        keys[Nplayer] = 1;
    }
    else if (keyIsDown(68)) {
        keys[Nplayer] = 2;
    }
    else if (keyIsDown(83)) {
        keys[Nplayer] = 3;
    }
    else {
        keys[Nplayer] = -1;
    }
    return keys;
}
function draw() {
    background(0);
    if (playing) {
        tron.step(keys_moves);
        tron.draw();
        if (tron.bikesAlive.length == 1) {
            keys = [-1, -1, -1, -1];
            var lastAlive = tron.players.indexOf(tron.bikesAlive[0]);
            tron.score[lastAlive] += 1;
            console.log(str(lastAlive) + "WON!!!!");
            tron.reset();
            playing = false;
            socket.emit("stop", lastAlive);
        }
    }
}
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
//# sourceMappingURL=../sketch/sketch/build.js.map