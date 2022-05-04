
// Track the last mouse
let lastMouse = undefined
let mouse = new Vector(0,0)

// We can also store the last N points
let trailPoints = []
let trailPointMax = 60

// How big do you want the canvas?
let canvasSize = [800, 400]

// You can also track how long the user has been drawing
let lastPenDownTime = 0
let distanceTravelled = 0



// Which mode and color do we start with?
// You may want to change these starting values
let tool = {
	color0: [0,100,50],
	color1: [184,83,50],
	
	size: 1,
	mode: "cats",

	clearCanvas(p) {
		p.background(0, 0, 100)
	},

	blackClearCanvas(p) {
		p.background(0, 0, 0)
	},
	userClearCanvas(p) {
		p.background(tool.color1)
	}
}


let tools = {

	cats(p, size, color0, color1) {

		console.log("Cats")

		let emojiOptions = ["😺","😸","😹","😻","😼","😽","🙀","😿","🐱"]
		
		let index = Math.floor(emojiOptions.length*Math.random())
		let emoji = emojiOptions[index]
		
		let x = p.mouseX
		let y = p.mouseY

		x += 17*size*(Math.random() - .5)
		y += 17*size*(Math.random() - .5)

		p.textSize(Math.sqrt(size)*17)

		if (Math.random() < .5)
			p.text(emoji, x, y)
	},

	squares(p, size, color0, color1) {
		let time = p.millis() - lastPenDownTime

		for (var i = 0; i < trailPoints.length; i++) {
			let pct = i/trailPoints.length
			let point = trailPoints[i]
			let colorH = time*0.2%180-90
			if (colorH < 0){
				colorH = -1 * colorH
			}
			p.noFill()
			p.fill(colorH + 180 + (Math.random() - .5)*40, 100, 50, pct)
			p.square(point[0]+(Math.random() - .5)*20, point[1]+(Math.random() - .5)*20, 10*pct)
		}
	},

	bezier(p, size, color0, color1) {
		console.log("bezier",lastMouse[0], lastMouse[1])

		let time = p.millis() - lastPenDownTime

		let lineColor = color0.slice()
		lineColor[2] += (Math.random() - .5)*40
		let pastelShift = p.noise(time*4) - .5
		lineColor[2] += (pastelShift)*180

		let randRange = 100
		ctrlPoint1 = [(p.mouseX+lastMouse[0])*0.5 + (Math.random() - .5)*randRange, (p.mouseY+lastMouse[1])*0.5 + (Math.random() - .5)*randRange]
		ctrlPoint2 = [(p.mouseX+lastMouse[0])*0.5 + (Math.random() - .5)*randRange, (p.mouseY+lastMouse[1])*0.5 + (Math.random() - .5)*randRange]
		
		
		p.noFill()
		p.stroke(...lineColor, 10*Math.random())
		p.strokeWeight(3);
		p.bezier(p.mouseX, p.mouseY, lastMouse[0], lastMouse[1], 300, 200, 500, 200)
	},

	
	pencil(p, size, color0, color1) {

		console.log("Pencil", color0, color1)
		// How far have we gone?
		let d = mouse.getDistanceTo(lastMouse)
		let randColor = [Math.random()*360, 100, 50]
		let pos = mouse
		p.noStroke()
		// p.stroke(...color0)
		p.stroke(randColor)

		p.line(...mouse, ...lastMouse)
		
		p.noStroke()
		p.fill(randColor, 1)

		let randShape = Math.random()
		let shapeSize = 10
		
		if (randShape<0.33){
			p.circle(...pos, shapeSize)
		}
		else {
			p.square(...pos, shapeSize)
		}

	},
	
	// testTool(p, size, color0, color1) {
	// 	console.log("testTool",lastMouse[0], lastMouse[1])

	// 	let time = p.millis() - lastPenDownTime

	// 	let lineColor = color0.slice()
	// 	lineColor[2] += (Math.random() - .5)*40
	// 	let pastelShift = p.noise(time*4) - .5
	// 	lineColor[2] += (pastelShift)*180

	// 	p.noFill()
	// 	p.stroke(...lineColor, 5*Math.random())
	// 	let randRange = 100
	// 	ctrlPoint1 = [(p.mouseX+lastMouse[0])*0.5 + (Math.random() - .5)*randRange, (p.mouseY+lastMouse[1])*0.5 + (Math.random() - .5)*randRange]
	// 	ctrlPoint2 = [(p.mouseX+lastMouse[0])*0.5 + (Math.random() - .5)*randRange, (p.mouseY+lastMouse[1])*0.5 + (Math.random() - .5)*randRange]

	// 	p.bezier(p.mouseX, p.mouseY, lastMouse[0], lastMouse[1], 100, 100, 700, 300)


	// 	// console.log("testTool", color0, color1)

	// 	// let t = p.millis() - lastPenDownTime
	// 	// // console.log(distanceTravelled)

	// 	// p.noStroke()
	// 	// p.fill(Math.random()*360, 100, 50)
		
	// 	// p.fill(...color0, 1)
	// 	// // p.circle(...mouse, 30)

	// 	// p.text("HI🏄🏻‍♂️", ...mouse)

	// 	// // for (var i = 0; i < 20; i++) {
	// 	// // 	let r = 20 + 3*i
	// 	// // 	let theta = i*.1
	// 	// // 	// Draw at a POLAR OFFSET FROM A POINT
	// 	// // 	p.fill(...color1, 1)
	// 	// // 	p.circle(...mouse.clonePolarOffset(r, theta), 3)

	// 	// // }

	// 	// // Draw along a trail
	// 	// for (var i = 0; i < trailPoints.length; i++) {
	// 	// 	let pct = i/trailPoints.length
	// 	// 	let point = trailPoints[i]
	// 	// 	// p.fill((t*.2)%360, 100, 50)
	// 	// 	p.fill(0, 0, 100, .1)
	// 	// 	p.circle(...point, 40)
	// 	// }

	// },
	
	// strawberryCave(p, size, color0, color1) {
	// 	p.fill(...color0, .02)
	// 	p.stroke(...color1, Math.random())
		
	// 	p.beginShape()
	// 	for (var i = 0; i < trailPoints.length; i++) {
	// 		// Get that position
	// 		let pos = trailPoints[i]
	// 		pos[0] += Math.random()
	// 		pos[1] += Math.random()
	// 		p.curveVertex(...pos)
	// 	}
	// 	p.endShape()
	// },

	// smoothPencil(p, size, color0, color1, drawCount) {
	// 	let time = p.millis() - lastPenDownTime

	// 	// Fade as you draw
	// 	if (Math.random() < .1)
	// 		p.background(0, 0, 100, .06)
		
		
	// 	// Make a copy of the color, so we can safely mess with it
	// 	let lineColor = color1.slice()
	// 	// Random colors, or noise?
	// 	// Shift the colors around for visual interest
	// 	lineColor[2] += (Math.random() - .5)*40
	// 	let pastelShift = p.noise(time*4) - .5
	// 	lineColor[2] += (pastelShift)*180

	// 	p.noFill()
	// 	p.stroke(...lineColor, .5*Math.random())
		
	// 	size += 12*p.noise(time*.5)
		
	// 	// Step backwards along the trail
	// 	let jump = 3
	// 	let count = 16
		
	// 	p.beginShape()
	// 	for (var i = 0; i < count; i++) {
	// 		let index = trailPoints.length - 1 - i*jump

	// 		// Is this even *in* our positions?
	// 		if (index > 0) {
	// 			// Make a copy so we can mess with it
	// 			let pos = trailPoints[index].slice()
	// 			// Random scribbles, or noise?
				
	// 			// let scribbleSize = Math.random()*20*p.noise(t)**4
	// 			let scribbleSize = 1
	// 			pos[0] += scribbleSize*size*(Math.random() - .5)*i
	// 			pos[1] += scribbleSize*size*(Math.random() - .5)*i

	// 			// let theta = 20*p.noise(i*.07, t) 
	// 			// let r = 10*p.noise(i*.2, t)
	// 			// pos[0] += scribbleSize*size*r*Math.cos(theta)
	// 			// pos[1] += scribbleSize*size*r*Math.sin(theta)

	// 			// pos[0] += i*size*(p.noise(i) - .5)
	// 			// pos[1] += i*size*(p.noise(i + 10) - .5)
	// 			p.curveVertex(...pos)
	// 		}

	// 		p.endShape()
	// 	}
	// },

	// scatterPencil(p, size, color0, color1) {
		
	// 	// Add a bit of a drop background to help it stand out
	// 	p.noStroke()
	// 	p.fill(0, 0, 100, .1)
	// 	p.circle(...mouse, 20*size*(1 + Math.random()))

		
	// 	// Draw a bunch of splatters
	// 	let splatCount = 10
	// 	for (var i = 0; i < splatCount; i++) {
	// 		let r = (Math.random() + 1)*size*5
	// 		let theta = Math.PI*2 * i/splatCount
	// 		let splatSize = 4*Math.random()*(size + 1)
			
	// 		p.fill(...color1, Math.random())
	// 		if (i%2 == 1)
	// 			p.fill(...color0, Math.random())
			
	// 		p.circle(mouse[0] + r*Math.cos(theta),
	// 			mouse[1] + r*Math.sin(theta), 
	// 			splatSize)
	// 	}
	// },

	// trail(p, size, color0, color1) {
	// 	// Time, or distance
	// 	let time = p.millis() - lastPenDownTime
	// 	// let time = distanceTravelled

	// 	// Use the trail points and 
	// 	// redraw the trail in a new color each time
	// 	for (var i = 0; i < trailPoints.length; i++) {
	// 		let pct = i/trailPoints.length
	// 		let point = trailPoints[i]
	// 		p.fill((time*.2)%360, 100, 50, pct)
	// 		p.circle(...point, 30*pct)
	// 	}

	// 	// And draw a random halo dot each time
	// 	for (var i = 0; i < trailPoints.length; i++) {
	// 		let pct = i/trailPoints.length
	// 		let point = trailPoints[i]
	// 		let r = 23*pct
	// 		let theta = time*.01
	// 		p.fill(0, 0, 0, .3)
	// 		p.circle(...point.clonePolarOffset(r, theta), 3)
	// 	}
	// },

	curve(p, size, color0, color1) {
		drawCount++

		let dx = p.mouseX - mouse[0]
		let dy = p.mouseY - mouse[1]
		let d = Math.sqrt(dx**2 + dy**2)
		
		
		// if (drawCount % 10 == 0) {
		if (d > 50) {
			mouse = [p.mouseX, p.mouseY]

			positions.push(mouse)
			
			// console.log("I have", positions.length, "points")

			// console.log(positions.join(", "))

			p.background(0, 0, 100, 1)
			// positions.forEach((pt) => {
			// 	p.noFill()
			// 	p.stroke(Math.random()*360, 100, 50, 1)
			// 	let radius = Math.random()*40
			// 	p.circle(...pt, radius)
			// }) 
			
			p.noFill()
			p.stroke(240, 100, 50, 1)
			p.beginShape()
			positions.forEach((pt) => {
				p.curveVertex(...pt)
			}) 
			
			p.endShape()

			positions.forEach((pt) => {
				p.fill(0)
				p.circle(...pt, 4)
			})
		}
	},

}