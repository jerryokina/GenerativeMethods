

class SeaShoreSimulation {
	// Some number of grids
	constructor(mode, dimensions, tileSize) {
		this.idNumber = simCount++
		// Mode can control various factors about the simulation
		this.dimensions = dimensions
		this.mode = mode
		this.tileSize = tileSize

		this.selectedCell = [3, 4]

		
		// Your simulation can have multiple layers, 
		// for example, it might have a 
		//  - a layer of sheep emoji, and a noise field of grass layers and a layer of wind vectors
		//  - a single layer of true/false for Game of Life
		
		this.water = createGrid(...dimensions)
		this.objects = createGrid(...dimensions)
		this.objectsNext = createGrid(...dimensions)
		this.height = createGrid(...dimensions)

		// Set up the grid with its initial values
		this.initialize()
	}


	initialize() {
		// A random place to sample noise from 
		let seedValue = Math.random()*1000

		// setGrid(this.water, (x,y) => {
		// 	// What's the height for this grid?
		// 	// Use the seedValue to make it different each time
		// 	let scale = .2
		// 	return Math.max(0, 1.2 - 2*noise(x*scale,y*scale, seedValue))
		// })

		// setGrid(this.height, (x,y) => {
		// 	// What's the water for this grid?
		// 	let scale = .2
		// 	return noise(x*scale, y*scale + 100, seedValue + 100)
		// })

		if(this.mode == "good" || this.mode == 'std'){
			console.log("init! (mode: good)")
			setGrid(this.objects, (x,y) => {
				// Function that takes (x, y) and returns a thing for it to contain
				// Sheep?
				if (Math.random() < .5)
					return "🌊"
	
				else if (Math.random() < .7)
					return "🧽"
	
				else if (Math.random() < .90)
					return "🌵"
	
				else
					return "🐠"
				// return undefined
			})
		}
		else if(this.mode == "dif"){
			console.log("init! (mode: dif)")
			setGrid(this.objects, (x,y) => {
				// Function that takes (x, y) and returns a thing for it to contain
				// Sheep?
				if (Math.random() < .30)
					return "🌊"
	
				else if (Math.random() < .7)
					return "🧽"
	
				else if (Math.random() < .90)
					return "🌵"
	
				else
					return "🐠"
				// return undefined
			})
		}

	}



	// When we update the simulation, 
	// we want write our next moves into a temporary "next-step" grid
	// And then once all the updates are done, 
	// copy that back into the original grid 

	step() {
		let beach2sea = 0
		let sea2beach = 0

		if (this.mode!='std'){
			beach2sea = 5
			sea2beach = 5
		}
		else{
			beach2sea = 4
			sea2beach = 4
		}

		// Create a temporary grid to store the next positions
		// let tempGrid = createGrid(...this.dimensions)
		
		// Move water downhill
		// setGrid(this.water, (x,y) => {
		// 	let v = this.water[x][y]
		// 	let h = this.height[x][y]
		// 	let neighbors = this.getNearestNeighborPositions(x, y)
		// 	// For each neighbor, flow some water to or from a neighbor
		// 	neighbors.forEach(n => {
				
		// 		let dh = h - this.height[n[0]][n[1]]
		// 		let nWater = this.water[n[0]][n[1]]

		// 		// How much to flow
		// 		let flow = -dh*nWater

		// 		v += flow
		// 	})

		// 	// v = Math.max(0, v)

		// 	// Evaporate water (or not)
		// 	return v
		// })


		// For each object in the world, 
		// decide where you will be in the next step

		// setGrid(this.objectsNext, (x,y) => {
		// 	let obj = this.objects[x][y]

			// if (obj == "🐑") {
			// 	let neighbors = this.getNearestNeighborPositions(x, y)
			// 	let neighborIndex = Math.floor(Math.random()*4)
			// 	let n = neighbors[neighborIndex]
				
			// 	// Can I move here? 
			// 	// If there's not a tree in objects
			// 	// because trees won't move
			// 	if (this.objects[x][y] == "🌲") {
			// 		return obj
			// 	}
		// 	}

		// 	return obj
		// })

		// Keep a separate grid for next-step destinations
		copyGrid(this.objectsNext, this.objects)


		forGrid(this.objectsNext, (x,y) => {
			let obj = this.objects[x][y]

			let neighbors = this.getEightNeighborPositions(x, y)
			let countWater = 0
			let countBeach = 0
			neighbors.forEach(n => {
				let neighborObj = this.objects[n[0]][n[1]]
				if (neighborObj == '🌊' || neighborObj == '🐠'){
					countWater += 1
				}
				else if (neighborObj == '🧽'){
					countBeach += 1
				}
			})

			if (obj == "🌵"){
				if(countWater>=1){
					this.objectsNext[x][y]='🧽'
				}
			}
			else if (obj == "🧽"){
				if(countWater>=beach2sea){
					this.objectsNext[x][y]='🌊'
				}
				else if (countWater==0){
					this.objectsNext[x][y]='🌵'
				}
			}
			// else if (obj == "🌊" || obj == "🐠"){
			// 	if(countBeach>=5){
			// 		this.objectsNext[x][y]='🧽'
			// 	}
			// 	else if(countBeach<5 && Math.random() < 0.05){
			// 		this.objectsNext[x][y]='🐠'
			// 	}
			// 	else{
			// 		this.objectsNext[x][y]='🌊'
			// 	}
			// }
			else if (obj == "🌊" ){
				if(countBeach>=sea2beach){
					this.objectsNext[x][y]='🧽'
				}
				else{
					this.objectsNext[x][y]='🌊'
				}
			}

			// if (obj == "🐑") {
			// 	let neighbors = this.getNearestNeighborPositions(x, y)
			// 	let neighborIndex = Math.floor(Math.random()*4)
			// 	let n = neighbors[neighborIndex]
				
			// 	// Can I move here? 
			// 	// If there's not a tree in objects
			// 	// because trees won't move
			// 	if (this.objects[x][y] == "🌲") {
			// 		return obj
			// 	}

			// 	// OTHERWISE MOVE THE SHEEP
			// 	this.objectsNext[x][y] = undefined
			// 	this.objectsNext[n[0]][n[1]] = "🐑"
				
			// }
		})

		copyGrid(this.objects, this.objectsNext)

		forGrid(this.objectsNext, (x,y) => {
			let obj = this.objects[x][y]

			if (obj == "🐠"){

				let neighbors = this.getEightNeighborPositions(x, y)
				let countWater = 0
				neighbors.forEach(n => {
					let neighborObj = this.objects[n[0]][n[1]]
					if (neighborObj == '🌊' || neighborObj == '🐠'){
						countWater += 1
					}
				})

				if(countWater==0){
					this.objectsNext[x][y]='🌊'
				}
				else {
					let neighbors = this.getEightNeighborPositions(x, y)
					let randomDirections = this.getEightNeighborPositions(x, y)

					let countIdx = 0
					neighbors.forEach(n => {
						let neighborObj = this.objects[n[0]][n[1]]
						if (neighborObj != '🌊' && neighborObj != '🐠'){
							randomDirections.splice(countIdx, 1)
							// console.log("--",randomDirections)
						}
						else{
							countIdx += 1
						}
					})

					let moveTo = int(Math.random()*countWater)
					let moveToX = randomDirections[moveTo][0]
					let moveToY = randomDirections[moveTo][1]
// =
					this.objectsNext[x][y]='🌊'
					this.objectsNext[moveToX][moveToY]='🐠'

					// console.log("fish",x,y,"to",moveToX,moveToY)

				}
			}
		})

		copyGrid(this.objects, this.objectsNext)


		// copyGrid(this.objectsNext, this.objects)






		// let tempObjectGrid = createGrid(...this.dimensions)
		// Make a clone of the current grid
		
		// Update the object grid
		// setGrid(tempObjectGrid, 

		// 	// RETURNS THE NEXT VALUE OF THE GRI AT THIS POINT
		// 	(x,y) => {
		// 		let obj = this.objects[x][y]
		// 		let neighbors = this.getNearestNeighborPositions(x, y)

				
		// 		switch(obj) {
		// 			case undefined: 
		// 				neighbors.forEach(n => {
		// 					let nobj = this.objects[n[0]][n[1]]
		// 					console.log(n, nobj)
		// 					// If no object, spawn a tree?
		// 					if (nobj === "🌲") 
		// 						console.log("SPAWN TREE")
		// 						return "🌲"
		// 				})
		// 				break;

		// 		}
		// 		return obj
		// 	})
		// copyGrid(tempObjectGrid, this.objects)

		// Swap all the buffers: copy the nextGrid into the current grid
		// copyGrid(this.values, tempGrid)
	}



	draw(p) {
		p.background(100, 100, 100)


		// Draw each cell
		let w = this.dimensions[0]
		let h = this.dimensions[1]

		for (var i = 0; i < w; i++) {
			for (var j = 0; j < h; j++) {
				this.drawCell(p, i, j)
			}
		}
		

		// // Draw debug information about the currently selected cell
		// // A useful place to put debug information!
		// if (this.debugMode) {

		// 	p.stroke(100, 100, 50, 1)
		// 	p.strokeWeight(1)
		// 	p.noFill()
		// 	this.drawSquare(p, ...this.selectedCell)
		// // 	let neighbors = this.getNearestNeighborPositions(...this.selectedCell, true)
		// // 	neighbors.forEach((cell,index) => {
		// // 		p.noStroke()
		// // 		p.fill(index*20, 100, 50, .4)
		// // 		this.drawSquare(p, ...cell)
		// // 	})
		// // 	neighbors = this.getCornerNeighborPositions(...this.selectedCell, true)
		// // 	neighbors.forEach((cell,index) => {
		// // 		p.noStroke()
		// // 		p.fill(index*20 + 100, 100, 50, .4)
		// // 		this.drawSquare(p, ...cell)
		// // 	})

		// 	let countWater = 0
		// 	let countBeach = 0
		// 	let neighbors = this.getEightNeighborPositions(this.selectedCell[0], this.selectedCell[1])
		// 	neighbors.forEach(n => {
		// 		let neighborObj = this.objects[n[0]][n[1]]
		// 		if (neighborObj == '🌊' || neighborObj == '🐠'){
		// 			countWater += 1
		// 		}
		// 		else if (neighborObj == '🧽'){
		// 			countBeach += 1
		// 		}
		// 	})
		// 	console.log(this.selectedCell[0], this.selectedCell[1], countWater, countBeach)
		// 	p.stroke(100)
		// 	p.fill(0)
		// 	p.text(countWater, this.selectedCell[0]*this.tileSize,this.selectedCell[1]*this.tileSize)
		// }
	}

	

	// Draw a cell.  Add emoji or color it
	drawCell(p, x, y) {

		// Sample my height map
		// And just draw a square
		// let h = this.height[x][y]
		// let hue = h*100 + 0
		// p.noStroke()
		// p.fill(hue, 100*h, 50)

		// this.drawSquare(p, x, y)

		// p.fill(0)
		// this.drawText(p, x, y, h.toFixed(2) )


		// Draw water as a circle (custom!)
		// Have to figure out in PIXEL SPACE
		// Where it is
		let w = this.tileSize
		let px = (x + .5)*w
		let py = (y + .5)*w

		// let water = this.water[x][y]
		// p.noStroke()
		// p.fill(199, 100, 50)
		// p.circle(px, py, w*water)

		
		// Draw sheep, trees, wolves, etc
		p.textSize(this.tileSize*1.0)
		let object = this.objects[x][y]
		p.text(object, px - w*.4, py + w*.3)
		// this.drawText(p, x, y, object )

		// // Write debug text
		// if (this.debugMode) {
		// 	p.textSize(10)
		// 	p.fill(0)
		// 	p.stroke(100)
		// 	p.text(h.toFixed(2), px - w/2, py)
		// }
		
	}

	//=====================================================
	// Mouse interactions

	select(x, y) {
		// console.log("Select", x, y)
		this.selectedCell = [x, y]
	}

	click(x, y) {
		console.log("Click", x, y)
		
	}

	drag(x, y) {
		// this.values[x][y] = 1
	}



	//=====================================================
	// Utility functions

	toggleDebugInfo() {
		this.debugMode = !this.debugMode
	}

	// Handy utility to draw a single grid 
	drawSquare(p, col, row) {
		let w = this.tileSize
		let x = (col + .5)*w
		let y = (row + .5)*w
		p.rect(x - w/2, y - w/2, w, w)
	}

	// Handy utility to draw text 
	drawText(p, col, row, text) {
		let w = this.tileSize
		let x = (col + .5)*w
		let y = (row + .5)*w
		p.text(text, x - w/2, y - w*.1)
	}

	// Is this cell selected?
	isSelected(x, y) {
		return (this.selectedCell && this.selectedCell[0] == x && this.selectedCell[1] === y)
	}

	//------------------------------------------------
	// Neighbor positions
	getEightNeighborPositions(x1, y1, wrap=true) {
		return [...this.getNearestNeighborPositions(x1, y1, wrap),
		...this.getCornerNeighborPositions(x1, y1, wrap)]
	}

	getNearestNeighborPositions(x1, y1, wrap=true) {
		let w = this.dimensions[0]
		let h = this.dimensions[1]
		let x0 = x1 - 1
		let x2 = x1 + 1
		let y0 = y1 - 1
		let y2 = y1 + 1
		if (wrap)  {
			x0 = (x0 + w)%w
			x2 = (x2 + w)%w
			y0 = (y0 + h)%h
			y2 = (y2 + h)%h
		}
		
		return [[x1,y0],[x2,y1],[x1,y2],[x0,y1]]
	}
	getCornerNeighborPositions(x1, y1, wrap=true) {
		let w = this.dimensions[0]
		let h = this.dimensions[1]
		let x0 = x1 - 1
		let x2 = x1 + 1
		let y0 = y1 - 1
		let y2 = y1 + 1
		if (wrap)  {
			x0 = (x0 + w)%w
			x2 = (x2 + w)%w
			y0 = (y0 + h)%h
			y2 = (y2 + h)%h
		}
		
		return [[x0,y0],[x0,y2],[x2,y2],[x2,y0]]
	}


}