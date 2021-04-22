class Tron{
    players:Bike[]
    bikesAlive: Bike[]
    board:Board
    score:[number,number,number,number]
    playerN: number
    SPAWN_POS: p5.Vector[]
    COLOR: p5.Color[]
    SPAWN_HEADINGS: p5.Vector[]
    dim: [number,number]
    index = 0
    constructor(res:[number,number],dim:[number,number],players:number) {
        this.board = new Board(dim,res);
        this.playerN = players
        this.score = [0,0,0,0]
        this.dim = dim
        this.SPAWN_HEADINGS = [createVector(1,0),createVector(-1,0)
                                ,createVector(0,1),createVector(0,-1)]
        this.COLOR = [color(0,0,255),color(255,0,0),color(0,255,0),color(255,0,255)]
        this.SPAWN_POS = [createVector(2,floor(dim[1]/2)),createVector(dim[0]-3,floor(dim[1]/2))
            ,createVector(floor(dim[0]/2),2),createVector(floor(dim[0]/2),dim[1]-3)]
        this.reset()
    }
    reset(){
        this.index = 0
        this.bikesAlive = []
        this.players = []
        for (let i = 0; i < this.playerN; i++){
            //console.log(i)
            let bike = new Bike(this.SPAWN_POS[i].copy(),this.SPAWN_HEADINGS[i].copy(),this.COLOR[i],this.board)
            this.players.push(bike)
            this.bikesAlive.push(bike)
        }
        //console.log(this.bikesAlive.length)

    }
    private number_to_vector(n: number):p5.Vector{
        if (n === 0){
            return createVector(-1,0)
        }
        else if (n === 1){
            return createVector(0,-1)
        }
        else if (n === 2){
            return createVector(1,0)
        }
        else if (n === 3){
            return createVector(0,1)
        }else{
            return null
        }


    }
    step(callback: ()=> Array<number>){
        let moves = callback()
        //console.log(this.players)
        let i:number = 0
        for (let bike of this.bikesAlive){
            let new_heading = this.number_to_vector(moves[i])
            bike.heading = new_heading === null ? bike.heading : new_heading
            bike.move()
            if (bike.check_body_collisions(this.bikesAlive)){
                let index = this.bikesAlive.indexOf(bike, 0);
                if (index > -1) {
                    this.bikesAlive.splice(index, 1);
                }
            }
            i++
        }
        this.check_headons()
        this.index += 1

    }
    draw(){
        for (let bike of this.bikesAlive){
            bike.draw()
        }
    }
    private containsObject(obj:any, list:Array<any>):boolean {
        var i;
        for (i = 0; i < list.length; i++) {
            if (list[i] === obj) {
                return true;
            }
        }

        return false;
    }
    private chooseRI(choices:Array<Bike>): number {
        let index = Math.floor(Math.random() * choices.length);
        return index;
    }
    private check_on_board(loc:p5.Vector): boolean {
        return loc.x < 0 || loc.y < 0 || loc.x > this.dim[0] || loc.y > this.dim[1]
    }

    private check_headons() {
        let dead_bikes: Bike[] = []

        for (let bike of this.bikesAlive){
            if (!this.containsObject(bike,dead_bikes)){
                if (this.check_on_board(bike.location)){
                    let index = this.bikesAlive.indexOf(bike)
                    this.bikesAlive.splice(index,1)
                    continue
                }
                for (let other_bike of this.bikesAlive) {
                    if (bike == other_bike){
                        continue
                    }
                    //console.log(bike.location,other_bike.location)
                    if (bike.location.equals(other_bike.location)) {
                        dead_bikes.push(bike)
                        dead_bikes.push(other_bike)
                        break
                    }
                }
            }
        }
        while (dead_bikes.length > 1){
            let i = this.chooseRI(dead_bikes)
            let index = this.bikesAlive.indexOf(dead_bikes[i])
            this.bikesAlive.splice(index,1)
            dead_bikes.splice(i,1)
        }

    }
}