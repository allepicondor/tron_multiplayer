class Bike{
    location: p5.Vector;
    heading: p5.Vector;
    trail: Array<p5.Vector>;
    color: p5.Color;
    board: Board;
    constructor(spawn: p5.Vector, initalH: p5.Vector,color: p5.Color,board:Board){
        this.location = spawn;
        this.heading = initalH;
        this.trail = [];
        this.color = color
        this.board = board
    }
    move(){
        this.trail.push(this.location.copy())
        this.location.add(this.heading)

    }
    generateData():PlayerData{
        let data = <PlayerData>{};
        data.location = [tron.players[Nplayer].location.x,tron.players[Nplayer].location.y]
        data.heading = [tron.players[Nplayer].heading.x,tron.players[Nplayer].heading.y]
        return data
    }
    draw(){
        this.board.draw_cord(this.location,this.color)
        for (let step of this.trail){
            this.board.draw_cord(step,this.color)
        }
    }
    check_body_collisions(bikes:Bike[]): boolean{
        for (let bike of bikes){
            for (let step of bike.trail){
                if (step.equals(this.location)){
                    return true
                }
            }
        }
        return false

    }


}