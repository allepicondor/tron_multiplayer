class Tron{
    players:Bike[]
    bikesAlive: Bike[]
    board:Board
    score:[number,number]
    playerN: number
    SPAWN_POS: p5.Vector[]
    COLOR: p5.Color[]
    SPAWN_HEADINGS: p5.Vector[]
    constructor(res:[number,number],dim:[number,number],players:number) {
        this.board = new Board(dim,res);
        this.playerN = players
        this.SPAWN_HEADINGS = [createVector(1,0),createVector(-1,0)
                                ,createVector(0,1),createVector(0,-1)]
        this.COLOR = [color(0,0,255),color(255,0,0),color(0,255,0),color(255,0,255)]
        this.SPAWN_POS = [createVector(2,floor(dim[1]/2)),createVector(dim[0]-3,floor(dim[1]/2))
            ,createVector(floor(dim[0]/2),2),createVector(floor(dim[0]/2),dim[1]-3)]
        this.reset()
    }
    reset(){
        this.bikesAlive = []
        this.players = []
        for (let i = 0; i < this.playerN; i++){
            console.log(i)
            let bike = new Bike(this.SPAWN_POS[i],this.SPAWN_HEADINGS[i],this.COLOR[i],this.board)
            this.players.push(bike)
            this.bikesAlive.push(bike)
        }
        console.log(this.bikesAlive.length)

    }
    private number_to_vector(n: number):p5.Vector{
        if (n === 0){
            return createVector(-1,0)
        }
        else if (n === 1){
            return createVector(0,1)
        }
        else if (n === 2){
            return createVector(1,0)
        }
        else if (n === 3){
            return createVector(0,-1)
        }else{
            return null
        }


    }
    step(callback: ()=> Array<number>){
        let moves = callback()
        console.log(this.players)
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
        if (this.bikesAlive.length == 1){
            let lastAlive = this.players.indexOf(this.bikesAlive[0])
            this.score[lastAlive] += 1;
            console.log(str(lastAlive)+"WON!!!!")
        }
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
    private check_headons() {
        let dead_bikes:Bike[] = []

        for (let bike of this.bikesAlive){
            if (!this.containsObject(bike,dead_bikes)){
                for (let other_bike of this.bikesAlive) {
                    if (bike.location == other_bike.location) {
                        dead_bikes.push(bike)
                        dead_bikes.push(other_bike)
                        break
                    }
                }
            }
        }
        //while (dead_bikes.length > 0){
        //    console.log(dead_bikes.length)
        //    let i = this.chooseRI(dead_bikes)
        //    this.bikesAlive.splice(i,1)
        //}

    }
}