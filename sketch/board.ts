class Board{
    dimension: [number,number]
    resolution: [number,number]
    segment: [number,number]
    constructor(dim: [number, number],res: [number,number]){
        this.dimension = dim
        this.resolution = res
        this.segment = [res[0]/dim[0],res[1]/dim[1]]
    }
    get_pixel(cord:p5.Vector): p5.Vector{
        return createVector(cord.x*this.segment[0],cord.y*this.segment[1])


    }
    draw_cord(cord:p5.Vector,color:p5.Color):boolean{
        fill(color);

        //console.log("here")
        let pixel = this.get_pixel(cord)
        rect(pixel.x+this.segment[0]/2,pixel.y+this.segment[1]/2,this.segment[0],this.segment[1])
        return true
    }
}





