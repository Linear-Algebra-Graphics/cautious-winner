//import { matrixVectorMultiplication } from "./matrixMult"

//Notation
//vector: [a, b, c] is a column vector
//
//        |a|
//        |b|
//        |c|
//
//matrix: [[a,b,c],[d,e,f],[g,h,i]] is the matrix
//
//        |a d g|
//        |b e h|
//        |c f i|
//
class Graph {
    
    /**
     * creates an instance of an R3 graph
     * @param {*} canvas canvas on which the graph is drawn 
     */
    constructor(canvas) {
        this.canvas = canvas
        this.height = canvas.height
        this.width = canvas.width
        this.ctx = canvas.getContext("2d")
        this.graphCenterX = this.canvas.width/2
        this.graphCenterY = this.canvas.height/2
        
        this.drawnObjects = [];

        // This is the number of graph units from edge to edge. E.g if the canvas is 600x600px we want
        // the length of 20 units to be 600 px.
        this.numOfGraphUnitsEdgeToEdge = this.canvas.width / 80;
        this.backgroundColor           = "white"
        // I matrix is default
        this.basis                     = [[1,0,0],[0,1,0],[0,0,1]]
        this.currentZoom               = 1
        this.zoomIncrement             = .01
        //this.basis                     = [[Math.cos(Math.PI/4),Math.sin(Math.PI/4),0],[-1*Math.sin(Math.PI/4),Math.cos(Math.PI/4),0],[0,0,1]]
        
        this.graphAxis                 = new Axis(this)
        this.graphGrid                 = new Grid(this)
        this.showAxis                  = true
        this.showGrid                  = true
        this.infiniteAxis              = true
    }

    zoomIn() {
        let xBasis = this.changeBasisAndZoom([1,0,0]);
        //change to use multiplcation later
        this.currentZoom = this.currentZoom * 1.01
        //console.log(xBasis)
    }

    zoomOut() {
        let xBasis = this.changeBasisAndZoom([1,0,0]);
        //change to use multiplcation later
        //if (this.currentZoom >= this.zoomIncrement) {
            this.currentZoom =this.currentZoom / 1.01
        //}
        console.log(xBasis)
        let axisLength = Math.abs( Math.sqrt( Math.pow(xBasis[0], 2) + Math.pow(xBasis[1], 2)) )
        // console.log(Math.round(1/axisLength))
        // console.log("")
        

    }

    setDefaultZoom() {
        //should be animation back to default zoom
        this.currentZoom = 1
    }

    /**
     * adds new object to be displayed on the graph
     * @param {*} object can be a vector/grid/square/
     */
    addObject(object) {
        this.drawnObjects.push(object)
    }

    /** */
    changePerspective() {

    }

    draw() {
        // Clear screen / add background
        this.ctx.fillStyle = this.backgroundColor
        this.ctx.fillRect(0,0, this.canvas.width, this.canvas.height);
        
        if (this.showGrid) {
            this.graphGrid.draw()
        }
        
        if (this.showAxis) {
            this.graphAxis.draw()
        }
        
        // Draw all objects
        for(let i = 0; i < this.drawnObjects.length; i++) {
            this.drawnObjects[i].draw();
        }
    }
    
    /**
     * draws line from point1 to point2 on the graph canvas
     * @param {*} point1 endpoint 1
     * @param {*} point2 endpoint 2
     * @param {*} color color of line
     * @param {*} lineWidth width of line
     */
    drawLine(point1, point2, color, lineWidth) {
        
        this.ctx.lineWidth = lineWidth
        this.ctx.strokeStyle = color

        this.ctx.beginPath()
            this.ctx.moveTo(point1[0], point1[1])
            this.ctx.lineTo(point2[0], point2[1])
        this.ctx.stroke()
    }

    /**
     * updates vector to be in the current basis and zoom of the graph 
     * @param {*} vector vector to operate on
     * @returns vector in terms of current 
     *          basis and zoom of the graph relative to the canvas
     */
    changeBasisAndZoom(vector) {
        let updatedVector = matrixVectorMultiplication(this.basis, vector)
        updatedVector     = matrixVectorMultiplication([[this.currentZoom, 0, 0],[0, this.currentZoom, 0],[0, 0, this.currentZoom]], updatedVector)
        return updatedVector
    }

}

//me
class Axis {
    /**
     * creates an instance of an Axis
     * @param {*} graph the graph on which the axis are drawn
     */
    constructor(graph) {
        this.graph = graph
        const lineWidth = 6
        
        this._xAxis = new Vector(this.graph, [10,0,0], "blue", lineWidth, false)
        this._yAxis = new Vector(this.graph, [0,10,0], "red", lineWidth, false)
        this._zAxis = new Vector(this.graph, [0,0,10], "green", lineWidth, false)
        
        this._xAxisNeg = new Vector(this.graph, [-10,0,0], "blue", lineWidth, false)
        this._yAxisNeg = new Vector(this.graph, [0,-10,0], "red", lineWidth, false)
        this._zAxisNeg = new Vector(this.graph, [0,0,-10], "green", lineWidth, false)

        //for infinite axis
        const infLen = this.graph.width*this.graph.numOfGraphUnitsEdgeToEdge
        
        this._infxAxis = new Vector(this.graph, [infLen,0,0], "blue", lineWidth, false)
        this._infyAxis = new Vector(this.graph, [0,infLen,0], "red", lineWidth, false)
        this._infzAxis = new Vector(this.graph, [0,0,infLen], "green", lineWidth, false)
        
        this._infxAxisNeg = new Vector(this.graph, [-1*infLen,0,0], "blue", lineWidth, false)
        this._infyAxisNeg = new Vector(this.graph, [0,-1*infLen,0], "red", lineWidth, false)
        this._infzAxisNeg = new Vector(this.graph, [0,0,-1*infLen], "green", lineWidth, false)
    
        // Default
        this.fullAxis     = true
        this.zeroZeroDot  = true
    }
    
    /**
     * draws x, y, z axis
     */
    draw() {
        if(this.graph.infiniteAxis === false) {
            //console.log("trying to draw successful")
            if (this.fullAxis) {
                this._xAxisNeg.draw()
                this._yAxisNeg.draw()
                this._zAxisNeg.draw()
            }
            this._xAxis.draw()
            this._yAxis.draw()
            this._zAxis.draw()

       } else {
            if (this.fullAxis) {
                this._infxAxisNeg.draw()
                this._infyAxisNeg.draw()
                this._infzAxisNeg.draw()
            }
            this._infxAxis.draw()
            this._infyAxis.draw()
            this._infzAxis.draw()
            //remember to set back matrixMultiplcation matix if changed to finite axis
       }
       if (this.zeroZeroDot) {
            //this.graph.ctx.fillRect(this.graph.centerX, this.graph.centerY, 700, 500);
            
            this.graph.ctx.fillStyle = "black"
            this.graph.ctx.strokeStyle = "black"
            this.graph.ctx.beginPath();
                this.graph.ctx.arc(this.graph.graphCenterX, this.graph.graphCenterY, 5, 0, 2 * Math.PI);
                this.graph.ctx.fill();
            this.graph.ctx.stroke();

        }

    }
    
    /**
     * for finite axis case leave for now
     * @param {*} size 
     * @param {*} arrow 
     */
    setAxis(size, arrow) {
        // Update the cords
        this._xAxis.cords = [size, 0, 0]
        this._xAxis.cords = [0, size, 0]
        this._xAxis.cords = [0, 0, size]

        this._xAxisNeg.cords = [-1*size, 0, 0]
        this._yAxisNeg.cords = [0, -1*size, 0]
        this._zAxisNeg.cords = [0, 0, -1*size]

        
        // Update the arrows
        this._xAxis.arrow = arrow
        this._xAxis.arrow = arrow
        this._xAxis.arrow = arrow

        this._xAxisNeg.arrow = arrow
        this._yAxisNeg.arrow = arrow
        this._zAxisNeg.arrow = arrow
    }
}



class Vector {

    /**
     * creates an instance of a vector
     * @param {*} graph graph on which vector is drawn
     * @param {*} cords coordinates (x, y, z) of vector
     * @param {*} color color of vector
     * @param {*} arrow true if vector has arrow at the end
     */
    constructor(graph, cords, color, lineWidth, arrow){
        this.graph    = graph
        this.cords    = cords
        this.color    = color
        this.lineWidth = lineWidth
        this.arrow    = arrow
    }

    /**
     * draws the vector on the graph
     */
    draw() {
        const scale = this.graph.canvas.width / this.graph.numOfGraphUnitsEdgeToEdge
        
        let centerX = this.graph.graphCenterX
        let centerY = this.graph.graphCenterY
        
        // First apply the basis, then the applied matrix. Not sure if this is the correct order for all situations...
        let updatedCords = this.graph.changeBasisAndZoom(this.cords)

        //console.log(updatedCords)

        let finalX  = centerX + scale * updatedCords[0]
        // Flipped because Y axis is zero at the top
        let finalY  = centerY - scale * updatedCords[1]
        // console.log("finalX: " + finalX)
        // console.log("finalY: " + finalY)

        this.graph.drawLine([centerX, centerY],[finalX, finalY], this.color, this.lineWidth)

        if(this.arrow == true) {
            // Draw the arrow
        }
    }
}

class Grid {
    constructor(graph){
        this.graph = graph
    }

    /**
     * 
     */
    draw() {
        let xBasis = this.graph.changeBasisAndZoom([1,0,0]);
        let yBasis = this.graph.changeBasisAndZoom([0,1,0]);

        let neg_xBasis = this.graph.changeBasisAndZoom([-1,0,0]);
        let neg_yBasis = this.graph.changeBasisAndZoom([0,-1,0]);
        
        // Point slope formula
            // y+y1 = m(x-x1)
            // y = m(x-x1)+y1
            // y = mx-mx1+y1
            // y = mx + (y1-mx1)
            // y = mx + b
            // b = (y1-mx1)
        //BEGIN SPAGHETTI CODE
        let scale = this.graph.canvas.width / this.graph.numOfGraphUnitsEdgeToEdge

        let axis = xBasis
        let scaledAxisLength = Math.abs( Math.sqrt( Math.pow(axis[0] * scale, 2) + Math.pow(axis[1]*scale, 2)))
        let xStep = scale * axis[0]
        let yStep = scale * axis[1]
        let iter_x_mult = Number.MAX_VALUE
        let iter_x_div = Number.MAX_VALUE
        //when curr 5x5 box is less than smallest allows, want to scale up
        console.log("x step: " + xStep + " y step: " + yStep)
        if (5*scaledAxisLength < 2.5*scale) {
            iter_x_mult = 0
            while (5*scaledAxisLength < 2.5*scale) {
                scaledAxisLength = scaledAxisLength * 2
                xStep = xStep * 2
                yStep = yStep * 2

                iter_x_mult++
            }
        } else if (5*scaledAxisLength > 5*scale) {
            iter_x_div = 0
            while (5*scaledAxisLength > 5*scale) {
                scaledAxisLength = scaledAxisLength / 2
                xStep = xStep / 2
                yStep = yStep / 2

                iter_x_div++
            }
        }

        axis = yBasis
        scaledAxisLength = Math.abs( Math.sqrt( Math.pow(axis[0] * scale, 2) + Math.pow(axis[1]*scale, 2)))
        xStep = scale * axis[0]
        yStep = scale * axis[1]
        let iter_y_mult = Number.MAX_VALUE
        let iter_y_div = Number.MAX_VALUE
        //when curr 5x5 box is less than smallest allows, want to scale up
        console.log("x step: " + xStep + " y step: " + yStep)
        if (5*scaledAxisLength < 2.5*scale) {
            iter_y_mult = 0
            while (5*scaledAxisLength < 2.5*scale) {
                scaledAxisLength = scaledAxisLength * 2
                xStep = xStep * 2
                yStep = yStep * 2

                iter_y_mult++
            }
        } else if (5*scaledAxisLength > 5*scale) {
            iter_y_div = 0
            while (5*scaledAxisLength > 5*scale) {
                scaledAxisLength = scaledAxisLength / 2
                xStep = xStep / 2
                yStep = yStep / 2
                
                iter_y_div++
            }
        }

        let iter_mult = iter_x_mult
        let iter_div = iter_x_div
        if (iter_y_mult < iter_mult) {
            iter_mult = iter_y_mult
        }
        if (iter_y_div < iter_div) {
            iter_div = iter_y_div
        }
        let lowest_iter = iter_mult
        if (iter_div < lowest_iter) {
            lowest_iter = iter_div
        }
        if (lowest_iter == Number.MAX_VALUE || 
            (iter_x_div == Number.MAX_VALUE && iter_x_mult == Number.MAX_VALUE) ||
            (iter_y_div == Number.MAX_VALUE && iter_y_mult == Number.MAX_VALUE)) {
            lowest_iter = 0
        }
        let multiply = (iter_mult < iter_div)
        //END SPAGHETTI CODE

    
        //looping over x axis
        console.log("+x")
        this.drawHalfAxisGrid(xBasis,yBasis, lowest_iter, multiply)
        console.log("-x")
        this.drawHalfAxisGrid(neg_xBasis,yBasis, lowest_iter, multiply)
        console.log("+y")
        this.drawHalfAxisGrid(yBasis, xBasis, lowest_iter, multiply)
        console.log("-y")
        this.drawHalfAxisGrid(neg_yBasis, xBasis, lowest_iter, multiply)
        
        
    }
    
    /**
     * draws grid lines along half of an axis, in the direction of the vector axis
     * each grid line is defined by the vector gridVector
     * @param {*} axis xBasis originally 
     * @param {*} gridVector vector defining grid lines
     */
    drawHalfAxisGrid(axis, gridVector, iterations, multiply) {
        let x = this.graph.graphCenterX
        let y = this.graph.graphCenterY

        let keepGoing = true
        let lineCount = 0
        
        let scale = this.graph.canvas.width / this.graph.numOfGraphUnitsEdgeToEdge

        //start 
        let axisLength = Math.abs( Math.sqrt( Math.pow(axis[0], 2) + Math.pow(axis[1], 2)))
        
        let scaledAxisLength = Math.abs( Math.sqrt( Math.pow(axis[0] * scale, 2) + Math.pow(axis[1]*scale, 2)))
        let xStep = scale * axis[0]
        let yStep = scale * axis[1]

        //BEGIN SPAGHETTI CODE 
        console.log("x step: " + xStep + " y step: " + yStep)
        if (multiply) {
            for (let i = 0; i < iterations; i++) {
                //scaledAxisLength = scaledAxisLength * 2
                xStep = xStep * 2
                yStep = yStep * 2
            }
        } else {
            for (let i = 0; i < iterations; i++) {
                //scaledAxisLength = scaledAxisLength / 2
                xStep = xStep / 2
                yStep = yStep / 2
            }
        }
        //END SPAGHETTI CODE

        //when curr 5x5 box is less than smallest allows, want to scale up
        // console.log("x step: " + xStep + " y step: " + yStep)
        // if (5*scaledAxisLength < 2.5*scale) {
        //     while (5*scaledAxisLength < 2.5*scale) {
        //         scaledAxisLength = scaledAxisLength * 2
        //         xStep = xStep * 2
        //         yStep = yStep * 2
        //     }
        // } else if (5*scaledAxisLength > 5*scale) {
        //     while (5*scaledAxisLength > 5*scale) {
        //         scaledAxisLength = scaledAxisLength / 2
        //         xStep = xStep / 2
        //         yStep = yStep / 2
        //     }
        // }
        //end
        
        console.log("x step: " + xStep + " y step: " + yStep)
        console.log("")

        while (keepGoing) {
            let startX, startY, endX, endY //points to draw from and to


            // First check if the lines are paralel to get rid of the edge case.
            if (gridVector[0] === 0) {
                //parrallel with y axis case
                startX = x
                startY = this.graph.canvas.height
                endX   = x
                endY   = 0
            } else if (gridVector[1]  === 0) {
                //parrallel with x axis case
                startX = 0
                startY = y
                endX   = this.graph.canvas.width
                endY   = y
            } else {
                // IF WE ARE HERE THERE 4 POINTS
                //calculate and compare 4 points THERE IS NO NULL POINT

                //case ensures that line will always intersect with all 
                //four lines defining boundaries of mxn canvas
                //console.log("3")
                
                //y - y1 = m(x - x1)
                //
                let x1 = x + gridVector[0]
                let y1 = y - gridVector[1]

                let m  = (-1*gridVector[1]) / (gridVector[0])
                let b  = y1 - (m * x1)
                // console.log("m: " + m)
                // console.log("y: " + yBasis[1] + " x: " + yBasis[0])
                
                let point1 = [0, this._getYIntersept(0, m, b)]
                let point2 = [this.graph.canvas.width, this._getYIntersept(this.graph.canvas.width, m, b)]

                let point3 = [this._getXIntersept(0, m, b), 0]
                let point4 = [this._getXIntersept(this.graph.canvas.height, m, b), this.graph.canvas.height]

                let dis_point1 = [this._distToGraphCenter(point1), point1]
                let dis_point2 = [this._distToGraphCenter(point2), point2]
                let dis_point3 = [this._distToGraphCenter(point3), point3]
                let dis_point4 = [this._distToGraphCenter(point4), point4]

                // Either is empty or two points.
                let pointsOnCanvas = this._findTwoClosesPoints([dis_point1, dis_point2, dis_point3, dis_point4])
                
                // If there are no points on canvas end the loop.
                startX = pointsOnCanvas[0][0]
                startY = pointsOnCanvas[0][1]
                endX   = pointsOnCanvas[1][0]
                endY   = pointsOnCanvas[1][1]
            }
            
            // This means the two minimum points are outside the canvas. This means that we do not need to draw the lines anymore so we break the loop.
            if (!this._outSideCanvas([startX, startY]) || !this._outSideCanvas([endX, endY])) {
                // Make every fith line dark
                if (lineCount % 5 == 0) {
                    this.graph.drawLine([startX, startY],[endX, endY], "grey", 3);
                } else {
                    this.graph.drawLine([startX, startY],[endX, endY], "#d3d3d3", 1);
                }
                
                //correct code
                // x += scale * axis[0]
                // y -= scale * axis[1] 
                x += xStep
                y -= yStep
            } else {
                keepGoing = false
            }
            lineCount++
        }
    }

    //returns true if the point (x, y) exists 
    //outside the boundaries of the this.graph.canvas
    // @param point (x, y) point
    // @returns true if outside canvas
    //
    _outSideCanvas(point) {
        return (point[0] < 0 || point[0] > this.graph.canvas.width) || (point[1] < 0 || point[1] > this.graph.canvas.height)
    }

    _distToGraphCenter(point) {
        let x = this.graph.graphCenterX
        let y = this.graph.graphCenterY
        return Math.abs( Math.sqrt( Math.pow(point[0] - x, 2) + Math.pow(point[1] - y, 2)) )
    }

    // returns [point1, poin2] if line has at least an endpoint in the canvas
    // if there are no points returns []
    _findTwoClosesPoints(dis_points) {
        let twoClosestPoints = dis_points.sort(function(a, b) {return a[0] - b[0]})
        return [twoClosestPoints[0][1], twoClosestPoints[1][1]]
    }
    
    // gets y when given x using y = mx+b
    _getYIntersept(x, m, b) { 
        return (m * x) + b
    }
    
    // gets x when given y using y = mx+b
    _getXIntersept(y, m, b) {
        return (y - b) / m
    }

}
