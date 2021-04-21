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
        this.board = new Board(dim, res);
        this.playerN = players;
        this.SPAWN_HEADINGS = [createVector(1, 0), createVector(-1, 0),
            createVector(0, 1), createVector(0, -1)];
        this.COLOR = [color(0, 0, 255), color(255, 0, 0), color(0, 255, 0), color(255, 0, 255)];
        this.SPAWN_POS = [createVector(2, floor(dim[1] / 2)), createVector(dim[0] - 3, floor(dim[1] / 2)),
            createVector(floor(dim[0] / 2), 2), createVector(floor(dim[0] / 2), dim[1] - 3)];
        this.reset();
    }
    Tron.prototype.reset = function () {
        this.bikesAlive = [];
        this.players = [];
        for (var i = 0; i < this.playerN; i++) {
            console.log(i);
            var bike = new Bike(this.SPAWN_POS[i], this.SPAWN_HEADINGS[i], this.COLOR[i], this.board);
            this.players.push(bike);
            this.bikesAlive.push(bike);
        }
        console.log(this.bikesAlive.length);
    };
    Tron.prototype.number_to_vector = function (n) {
        if (n === 0) {
            return createVector(-1, 0);
        }
        else if (n === 1) {
            return createVector(0, 1);
        }
        else if (n === 2) {
            return createVector(1, 0);
        }
        else if (n === 3) {
            return createVector(0, -1);
        }
        else {
            return null;
        }
    };
    Tron.prototype.step = function (callback) {
        var moves = callback();
        console.log(this.players);
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
        if (this.bikesAlive.length == 1) {
            var lastAlive = this.players.indexOf(this.bikesAlive[0]);
            this.score[lastAlive] += 1;
            console.log(str(lastAlive) + "WON!!!!");
        }
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
    Tron.prototype.check_headons = function () {
        var dead_bikes = [];
        for (var _i = 0, _a = this.bikesAlive; _i < _a.length; _i++) {
            var bike = _a[_i];
            if (!this.containsObject(bike, dead_bikes)) {
                for (var _b = 0, _c = this.bikesAlive; _b < _c.length; _b++) {
                    var other_bike = _c[_b];
                    if (bike.location == other_bike.location) {
                        dead_bikes.push(bike);
                        dead_bikes.push(other_bike);
                        break;
                    }
                }
            }
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
    Bike.prototype.draw = function () {
        this.board.draw_cord(this.location);
        for (var _i = 0, _a = this.trail; _i < _a.length; _i++) {
            var step = _a[_i];
            this.board.draw_cord(step);
        }
    };
    Bike.prototype.check_body_collisions = function (bikes) {
        for (var _i = 0, bikes_1 = bikes; _i < bikes_1.length; _i++) {
            var bike = bikes_1[_i];
            if (bike == this) {
                continue;
            }
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
    Board.prototype.draw_cord = function (cord) {
        fill(204, 101, 192, 127);
        stroke(127, 63, 120);
        console.log("here");
        var pixel = this.get_pixel(cord);
        rect(pixel.x + this.segment[0] / 2, pixel.y + this.segment[1] / 2, this.segment[0], this.segment[1]);
        return true;
    };
    return Board;
}());
var numberOfShapes = 15;
var speed;
var tron;
function setup() {
    console.log("🚀 - Setup initialized - P5 is running");
    tron = new Tron([500, 500], [50, 50], 2);
    createCanvas(500, 500);
    rectMode(CENTER).noFill().frameRate(25);
}
function keys_moves() {
    var moves = [-1, -1, -1, -1];
    return moves;
}
function draw() {
    background(0);
    tron.step(keys_moves);
    tron.draw();
}
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
//# sourceMappingURL=../sketch/sketch/build.js.map