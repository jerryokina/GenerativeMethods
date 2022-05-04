

let possiblePatterns = ["111", "110", "101", "100", "011", "010", "001", "000"]
class DustSimulation {
	// Some number of grids
	constructor(mode, dimensions, tileSize) {
		this.idNumber = simCount++
		// Mode can control various factors about the simulation
		this.dimensions = dimensions
		this.mode = mode
		this.tileSize = tileSize
		this.selectedCell = [3, 4]

		this.debugMode = false
		
		// Your simulation can have multiple layers, 
		// for example, it might have a 
		//  - a layer of sheep emoji, and a noise field of grass layers and a layer of wind vectors
		//  - a single layer of true/false for Game of Life
		
		this.values = createGrid(...this.dimensions)

		// Set up the grid with its initial values
		this.initialize()
		this.pattern = ["110", "100", "011", "001"]
	}

	randomPattern() {
		this.pattern = possiblePatterns.filter(s => Math.random() > .5)
	}

	initialize() {
		
		setGrid(this.values, (x, y) => {
			// Given x, y, set this cell to something
			if (y === 0)
				return (Math.random() > .5)?0:1
			return 0
		})

	}


	getPattern(x, y) {
		let w = this.dimensions[0]
		let h = this.dimensions[1]
		let x0 = (x+w-1)%w
		let x1 = ((x+1)%w)
		y = (y -1  + h)%h
	
		let pattern = [	this.values[x0][y],
						this.values[x][y],
						this.values[x1][y]
						]
		return pattern
	}

	// When we update the simulation, 
	// we want write our next moves into a temporary "next-step" grid
	// And then once all the updates are done, 
	// copy that back into the original grid 

	step() {
		
		// Create a temporary grid to store the next positions
		let tempGrid = createGrid(...this.dimensions)
		
		setGrid(tempGrid, (x, y) => {
			// my current value
			if (y === 0)
				return this.values[x][y]
			let pattern = this.getPattern(x, y).join("")
			if (this.pattern.includes(pattern) )
				return 1
			return 0
			
		})


		// Swap all the buffers: copy the nextGrid into the current grid
		copyGrid(this.values, tempGrid)
	}



	//=====================================================
	// Drawing

	draw(p) {
		p.background(196, 100, 80)
		// Draw each cell
		let w = this.dimensions[0]
		let h = this.dimensions[1]

		for (var i = 0; i < w; i++) {
			for (var j = 0; j < h; j++) {
				this.drawCell(p, i, j)
			}
		}
		

		// Draw debug information about the currently selected cell
		// A useful place to put debug information!
		if (this.debugMode) {

			p.stroke(100, 100, 50, 1)
			p.strokeWeight(4)
			p.noFill()
			this.drawSquare(p, ...this.selectedCell)
			let pattern = this.getPattern(...this.selectedCell)
			p.stroke(100)
			p.fill(0)
			this.drawText(p, ...this.selectedCell, pattern)
		}
	}

	

	// Draw a cell.  Add emoji or color it
	drawCell(p, x, y) {

		// Alive or dead?
		let value = this.values[x][y]

		// Draw the black or white square
		p.strokeWeight(1)
		p.stroke(0, 0, 0, .1)
		p.fill(0, 0, 100 - value*100, .7)
		this.drawSquare(p, x, y)
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
		this.values[x][y] = 1
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
	getEightNeighborPositions(x1, y1, wrap) {
		return [...this.getNearestNeighborPositions(x1, y1, wrap),
		...this.getCornerNeighborPositions(x1, y1, wrap)]
	}

	getNearestNeighborPositions(x1, y1, wrap) {
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
	getCornerNeighborPositions(x1, y1, wrap) {
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