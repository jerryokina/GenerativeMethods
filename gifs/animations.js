
let trails = 0.7

function drawMiniClock(p, loopPct) {
	let r = 30

	p.noStroke()
	p.fill((loopPct*360 + 40)%360, 30, 40, .6)
	p.circle(r/2, r/2, r)

	p.fill(loopPct*360, 40, 80, (1 -loopPct))
	p.arc(r/2, r/2, r, r, 0, loopPct*Math.PI*2);
}

let animations = {

	mygif1: {
		skip: false,
		title: "GIF #1",
		caption:  "Circles of Circles",

		draw(p, loopPct) {

			p.noStroke()
			p.background(210, 40, 90, 1-trails)

			p.push()
			p.translate(p.width/2, p.height/2)

			p.fill(0)

			// let r = 100
			// let theta = loopPct*2*Math.PI // Radians!
			// let x = r*Math.cos(theta)
			// let y = r*Math.sin(theta)	
			// p.circle(x, y, 100)

			
			function drawCircle(r) {
				let count = 15

				for (var i = 1; i < count+1; i++) {

					let pct = i/count

					theta = 2*Math.PI*pct
					x = r*Math.cos(theta)
					y = r*Math.sin(theta)	
					radiusCircle = 15

					let hue = (150 + pct*100 + loopPct*360)%360
					let colorPop = pct*100
					// let colorPop = p.noise(pct*100)
					
					p.fill(hue, colorPop*100, 40)
					p.circle(x, y, radiusCircle)


					// let pct = i/count
					// r = 20 + pct * 250

					// radiusCircle = 10 + pct*12

					// cycleCount = 2
					// theta = loopPct*cycleCount*Math.PI // Radians!
					// let offset = .2 + .2*Math.sin(Math.PI*2*loopPct)
					// theta += pct*10*offset

					// x = r*Math.cos(theta)
					// y = r*Math.sin(theta)	

					// let hue = (150 + pct*100 + loopPct*360)%360

					// let colorPop = p.noise(pct*100)

					// p.fill(hue, colorPop*100, 50)
					// // p.strokeWeight(3)
					// // p.stroke(hue, 100, 40)
					// p.circle(x, y, radiusCircle)
				}
			}

			let spiralCount = 5
			for (let i = 0; i < spiralCount; i++) {
				let spiralPct = i/(spiralCount - 1)
				let maxRadius = 100
				p.push()
				// p.rotate(Math.PI*spiralPct/2)
				p.rotate(Math.PI*2*loopPct)
				drawCircle(maxRadius*spiralPct + 10)

				p.pop()
			}
			

			// // Using sine waves, which have a period of 2*PI 
			// // (or any integer multiple of that)
			// let r = 40
			// let x0 = 100*Math.sin(loopPct*Math.PI*2) 
			// let y0 =  20*Math.cos(loopPct*Math.PI*4) + 120

			// p.fill(320, 50, 60)
			// p.circle(x0, y0, r, r)

			// let theta = Math.PI*2*loopPct
			// let radius = 10*Math.sin(5*theta) + 70
				
			// p.fill(180, 50, 60)
			// p.circle(radius*Math.sin(theta), radius*Math.cos(theta) - 50, r)

			p.pop()

			// p.fill(0)
			// p.circle(0, 0, 100)
			// drawMiniClock(p, loopPct)
		}
	},

	mygif2: {
		skip: false,
		title: "GIF #2",
		caption: "Lines",
		draw(p) {
			p.background(0, 0, 100, .11)
			let t = p.millis()*.001
			// How many seconds long is our loop?  You can use that to time your gifs
			let loopTime = 4
			let cyclePct = (t/loopTime)%1
			// If we drive *everything* off the cyclePct and not use random or time
			// we can notice if it loops perfectly

			// Output the cycle in the top left corner to visualize it
			// p.text("cycle: " + cyclePct.toFixed(2), 20, 20)

			for (var i = 0; i < 25; i++) {
				// How many times do we go across the screen in a loop?
				// let xSpeed = i%3 + 1 + .3
				let xSpeed = 5
				let x = i*21 + (cyclePct*xSpeed)*p.width
				let y = i*72 + cyclePct*p.height
				x %= p.width
				y %= p.height

				p.noStroke()
				let hue = i*999%90
				p.fill(hue, 100, 50)
				p.stroke(hue, 100, 20)
				p.circle(x, y, 10)
			}

			// drawMiniClock(p, loopPct)
		}	
	},

	mygif3: {
		skip: false,
		title: "GIF #3",
		caption: "Noise Waves",
		draw(p) {
			let t = p.millis()*.001
			let length = 6
			let loopPct = (t/length)%1
			let thetaPct = loopPct*Math.PI*2

			p.background("white")
			p.noiseDetail(6, 0.4);

			// // Output the current time
			// p.fill(0)
			// p.text(loopPct.toFixed(2), 10, 10)
			// p.stroke(0)

			// // Draw a little clock
			// p.push()
			// p.translate(20, 30)
			// p.noFill()
			// p.circle(0, 0, 20)
			// p.line(0, 0, 10*Math.sin(thetaPct), -10*Math.cos(thetaPct))
			// p.pop()

			let count = 100
			let n_shapes = 10
			for (var j = 0; j < n_shapes; j++) {
				p.stroke(j*10 + 150, 100, 50)
				p.fill(j*10 + 150, 100, 50, .3)

				p.beginShape()
				for (var i = 0; i < count; i++) {
					let pct = i/count
					let y = p.noise(pct, Math.sin(thetaPct), j*.1)*(5*p.height/n_shapes)+j*(p.height/n_shapes)
					let x = pct*p.width
					p.vertex(x, y)
					// p.rect(x, p.height, p.width/count,  - y)

				}
				p.endShape()
			}

			//----------------------------------
			// Draw a circle moving back and forth, but looping!

			// p.push()
			// p.translate(p.width/2, p.height/2)


			// p.noiseDetail(3, 0.5);
			// for (var i = 0; i < 20; i++) {

			// 	p.fill((i*30 + 50)%360, 100, 50, .3)
			// 	let offset = i*.1
			// 	let radius = getLoopingNoise({
			// 		p:p,
			// 		loopPct: loopPct,
			// 		radius: .1,
			// 		offset: offset
			// 	})

			// 	let x = getLoopingNoise({
			// 		p:p,
			// 		loopPct: loopPct,
			// 		radius: .4,
			// 		offset: offset + 10
			// 	}) - .5 // Subtracting .5 centers the noise around 0 instead of .5

			// 	let y = getLoopingNoise({
			// 		p:p,
			// 		loopPct: loopPct,
			// 		radius: 1,
			// 		offset: offset + 20
			// 	}) - .5 // Subtracting .5 centers the noise around 0 instead of .5

			// 	p.circle(x*400, y*150 + 90, 90*radius)

			// }

			// p.pop()

		}

	},

	noise: {
		skip: true,
		title: "Show noise",
		caption:  "",

		draw(p, loopPct) {
			p.background(210, 40, 90, 1-trails)

			p.push()
			// p.translate(p.width/2, p.height/2)

			// for (var i = 0; i< 20; i++) {
			// 	let x = 400*(p.noise(loopPct*10, i*.02) - .5)
			// 	let y = i*20 -100
			// 	p.circle(x, y, 50)

			// }
			

			count = 20
			let noiseScale = .01
			for (var i = 0; i < count; i++) {
				for (var j = 0; j < count; j++) {
					let x = 300*i/count
					let y = 300*j/count
					p.noStroke()
					p.fill(0, 0, 100*p.noise(x*noiseScale, y*noiseScale, loopPct*20))
					p.rect(x, y, 20, 20)
				}
			}

			p.pop()
		}
	},
	move: {
		skip: true,
		title: "Move back to the current spot",
		caption:  "We can loop seamlessly by returning to the same spot. One easy way to do this is to go around a circle, <pre>x=r*sin(theta), y=r*cos*(theta)</pre>You can also change the radius of the circle as a function of the period, or the period of theta, to create different patterns",

		draw(p, loopPct) {
			p.background(210, 40, 90, 1-trails)


			p.push()
			p.translate(p.width/2, p.height/2)

			p.fill(0)

			// let r = 100
			// let theta = loopPct*2*Math.PI // Radians!
			// let x = r*Math.cos(theta)
			// let y = r*Math.sin(theta)	
			// p.circle(x, y, 100)

			
			function drawSpiral() {
				let count = 40

				for (var i = 0; i < count; i++) {
					let pct = i/count
					r = 20 + pct * 250

					radiusCircle = 10 + pct*12

					cycleCount = 2
					theta = loopPct*cycleCount*Math.PI // Radians!
					let offset = .2 + .2*Math.sin(Math.PI*2*loopPct)
					theta += pct*10*offset

					x = r*Math.cos(theta)
					y = r*Math.sin(theta)	

					let hue = (150 + pct*100 + loopPct*360)%360

					let colorPop = p.noise(pct*100)

					p.fill(hue, colorPop*100, 50)
					// p.strokeWeight(3)
					// p.stroke(hue, 100, 40)
					p.circle(x, y, radiusCircle)
				}
			}

			let spiralCount = 6
			for (let i = 0; i < spiralCount; i++) {
				let spiralPct = i/(spiralCount - 1)
				

				p.push()
				p.rotate(Math.PI*2*spiralPct)
				drawSpiral()

				p.pop()
			}
			

			// // Using sine waves, which have a period of 2*PI 
			// // (or any integer multiple of that)
			// let r = 40
			// let x0 = 100*Math.sin(loopPct*Math.PI*2) 
			// let y0 =  20*Math.cos(loopPct*Math.PI*4) + 120

			// p.fill(320, 50, 60)
			// p.circle(x0, y0, r, r)

			// let theta = Math.PI*2*loopPct
			// let radius = 10*Math.sin(5*theta) + 70
				
			// p.fill(180, 50, 60)
			// p.circle(radius*Math.sin(theta), radius*Math.cos(theta) - 50, r)

			p.pop()

			p.fill(0)
			p.circle(0, 0, 100)


			drawMiniClock(p, loopPct)
		}
		
	},

	moveNew: {
		skip: true,
		title: "Move to a new position",
		caption:  "Move to a new position, but one that loops around the space",

		draw(p, loopPct) {
			p.background(210, 40, 90, 1-trails)
			p.fill(0, 0, 40)
			let r = 140
			let x = p.width*loopPct - r
			let y = p.height/2
			p.circle(x, y, r)
			// Draw it twice, for when it needs to be on both the left and the right
			p.circle(x + p.width, y, r)
			drawMiniClock(p, loopPct)
		}

		
	},


	colorChange: {
		skip: true,
		
		title: "Color Change",
		caption:  "Instead of changing position, change the point in <b>color space</b>",

		draw(p, loopPct) {
			let bgHue = (loopPct*360)

			p.background(bgHue, 50, 90, 1-trails)
			let r = 140
			let x = p.width*loopPct - r
			let y = p.height/2
			
			let circleHue = (loopPct*360 + 100)%360
			let strokeHue = (loopPct*360 + 150)%360
			p.strokeWeight(5)
			p.fill(circleHue, 70, 50)
			p.stroke(strokeHue, 100, 40)


			p.circle(x, y, r, r)
			// Draw it twice, for when it needs to be on both the left and the right
			p.circle(x + p.width, y, r, r)
			drawMiniClock(p, loopPct)
		}
	
	},

	moveOneStep: {
		skip: true,
		title: "Move one step",
		caption:  "To imply a longer animation, the circle doesn't need to return all the way to its starting point. If you have multiple steps, each 'step' only needs to get to the next index",

		draw(p, loopPct) {
			
			p.background(210, 40, 90, 1-trails)
			
			p.push()
			p.translate(p.width/2, p.height/2)

			
			let steps = 120
			for (let i = 0; i < steps; i++) {

				let step = (i + loopPct)
				// Where does this step need to get to?
				let dTheta = Math.PI*2/steps
				let theta = dTheta*step
				let radius = 70*(Math.sin(theta*3) + 1.2)
				let r = 10*(Math.sin(theta*2) + 2)

				let hue = 180*theta/Math.PI

				// Add a bit of twirl
				// theta += .002*radius*(Math.sin(Math.PI*2*loopPct))
			
				p.fill(hue, 40, 80 - .4*radius)
				p.circle(radius*Math.cos(theta), radius*Math.sin(theta), r)

			}
			p.pop()
			
			drawMiniClock(p, loopPct)
		}
	
	},

}