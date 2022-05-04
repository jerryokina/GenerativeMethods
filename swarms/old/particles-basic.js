// Create a particle system with an initialize, update, and draw function

// let mySystem = new BasicParticleSystem()
// mySystem.update()
// mySystem.draw()

class BasicParticleSystem {
	constructor() {
		console.log("MAKE A PARTICLE SYSTEM", this)
		this.gravity = [0, 100]

		// My array of particles
		this.particles = []

		// Make some particles
		for (var i = 0; i < 10; i++) {
			let particle = {
				idNumber: i,
				position: Vector.polar(i*10, i*.5),
				velocity: new Vector(100, 0),
				borderForce: new Vector(0,0),
				wanderForce: new Vector(0,0),
				mouseAttractorForce: new Vector(0,0)
			}

			// console.log(particle.position[0])
			// Add this to my particles
			this.particles.push(particle)
		}
	}

	update(p) {
		this.gravity = [0, 1000*SLIDER.gravity]


		let mouse = [p.mouseX - p.width/2, p.mouseY - p.height/2]
		let dt = p.deltaTime*.001
		// Don't update more than a tenth of a second at a time, even if we get out of sync
		dt = Math.min(.1, dt)
		let t = p.millis()*.001
		// console.log(t)
		// console.log(SLIDER)
		this.particles.forEach(pt => {

			// Stay inside a circle of "range": 
			// ie: apply an increasing force the farther you get outside the circle
			let dist = pt.position.magnitude
			let range = 50
			let distOutsideBorder = Math.max(0, dist - range)/range
			let borderStrength = 150*distOutsideBorder**2
			if (dist > 0)
				pt.borderForce.setToMultiple(pt.position, -borderStrength/dist)
			
			// Be attracted to the mouse (similar to range)
			pt.mouseAttractorForce.setToDifference(mouse, pt.position)
			pt.mouseAttractorForce.mult(SLIDER.mouseAttraction**2 * 10)

			// Wander around
			let wanderStrength = 300
			let wanderDirection = 15*p.noise(pt.idNumber, t*.2)
			pt.wanderForce.setToPolar(wanderStrength, wanderDirection)
			
			// Add all the forces to the velocity
			pt.velocity.addMultiples(pt.borderForce, dt)
			pt.velocity.addMultiples(pt.wanderForce, dt)
			pt.velocity.addMultiples(pt.mouseAttractorForce, dt)

			// Add some "drag"

			pt.velocity.mult(1 - .1*SLIDER.drag)

			// Update the position
			pt.velocity.addMultiples(this.gravity, dt)
			pt.position.addMultiples(pt.velocity, dt)
			
		})
	}

	drawHeatmap(p, heatmapScale) {
		p.push()
		p.translate(p.width/2, p.height/2)
		p.scale(1/heatmapScale)
		p.noStroke()
		p.fill(0, 0, 256)
		this.particles.forEach(pt => p.circle(...pt.position, 20))
		p.pop()
		// p.filter(p.BLUR, 3);
	}

	draw(p) {

		let debugDraw = DEBUG_DRAW[this.constructor.name]
		// if (debugDraw) {
		// 	debugDrawHeatmap(p)
		// }
		
		p.push()
		p.translate(p.width/2, p.height/2)
		this.particles.forEach(pt => {

			p.fill((pt.idNumber*10)%360,100,50)
			p.circle(...pt.position, 10)


			if (debugDraw) {
				pt.velocity.drawArrow({p, 
					multiple:.4,
					center:pt.position, 
					color:[0,0,0]}) 

				let forceLengthMultiple = .2
				pt.borderForce.drawArrow({p, 
					multiple:forceLengthMultiple,
					center:pt.position, 
					color:[50,100,40]}) 

				pt.mouseAttractorForce.drawArrow({p, 
					multiple:forceLengthMultiple,
					center:pt.position, 
					color:[150,100,40]}) 

				pt.wanderForce.drawArrow({p, 
					multiple:forceLengthMultiple,
					center:pt.position, 
					color:[290,100,50]}) 

			}
		})

		p.pop()
	}
}

