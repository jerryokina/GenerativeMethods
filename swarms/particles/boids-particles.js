class BoidsFlock {
	constructor(p) {
			// Do this on startup ONCE

		this.flockColor = [150, 100, 50]

		this.boids = []

		// Track the flock and the velocity
		this.flockVelocity = new Vector(0,0)
		this.flockCenter = new Vector(0,0)

		// Make a lot of particles
		let count = 15;
		for (var i = 0; i < count; i++) {
			// Create a random particle
			let pt = new Vector(Math.random()*p.width, Math.random()*p.height)
			
			
			// Add a velocity and force
			pt.velocity = Vector.polar(30, Math.random()*2*Math.PI)
			pt.force = new Vector(0,0)

			// Boids-specific forces
			// If we track them, we can also visualize them!
			pt.alignment = new Vector(0,0)
			pt.cohesion = new Vector(0,0)
			pt.avoidance = new Vector(0,0)

			// Add to my particles
			this.boids.push(pt)
		}

	}

	getClosest(pt, range) {
		// Get the closest particle to this point
		return Vector.getClosest(pt, this.boids, range)
	}


	
	update(p, time) {
		let center = new Vector(p.width/2, p.height/2)
		this.flockVelocity.setToAverage(this.boids.map(b => b.velocity))
		this.flockCenter.setToAverage(this.boids)

		this.boids.forEach((pt, ptIndex) => {
			// Recalculate forces
			pt.force.mult(0)
		
			// A little bit of a border foce to keep everyone on screen
			let borderForce = .09
			pt.force.addMultiples(center, borderForce, pt, -borderForce)

			//=================================
			// Apply avoidance, cohesion, and alignment to each boid
			
			// Alignment
			let alignmentStrength = 2*sliders.alignment
			pt.alignment.setToAddMultiples(this.flockVelocity, alignmentStrength, pt.velocity, -alignmentStrength)
			
			// Cohesion
			let cohesionStrength = 2*sliders.cohesion
			pt.cohesion.setToAddMultiples(this.flockCenter, cohesionStrength, pt, -cohesionStrength)


			// Avoidance
			let range = 30
			pt.avoidance.mult(0)
			this.boids.forEach(pt2 => {
				if (pt2 !== pt) {
					let offset = Vector.difference(pt, pt2)
					let m = offset.magnitude
					let m2 = range - m
					if (m2 > 0 && m !== 0) {
						pt.avoidance.addMultiples(offset, sliders.avoidance*20*m2/m)
					}
				}
			})
			pt.force.add(pt.avoidance)

			// Thrust (keeps the boids moving and makes motion smoother)
			pt.force.addPolar(140, pt.velocity.angle)
			
			// Wiggle (keeps the boids moving and intersting)
			pt.force.addPolar(40, 20*p.noise(.2*time.t, ptIndex))


			pt.force.add(pt.alignment)
			pt.force.add(pt.cohesion)

			// Apply each particles force to its velocity
			pt.velocity.addMultiples(pt.force, time.dt)
			
			pt.velocity.mult(.97)
			pt.velocity.clampMagnitude(10, 1000)
			
			pt.addMultiples(pt.velocity, time.dt)


			// // Wrap around when offscreen
			// This doesn't work well, because then the flock's location pops (but try it!)
			let border = 100
			pt.wrap(-border, p.width + border, -border, p.height + border)


		})
	}

	draw(p, time) {
		// Draw the particles

		this.boids.forEach((pt, ptIndex) => {
			p.fill(...this.flockColor)
			p.noStroke()

			let angle = pt.velocity.angle
			p.push()

			// Draw this particle translated
			p.translate(...pt)
			p.rotate(angle + Math.PI/2)
			
			let flapRate = pt.velocity.magnitude*.2
			let flap = Math.sin(flapRate*time.t + ptIndex)
			let boidSize = 20
			let wingWidth = .4*boidSize * (1.3 + .5*flap)
			let wingLength = boidSize* (1.3 - .3*flap)
			p.beginShape()
			p.vertex(0, -wingLength*.4)
			p.vertex(wingWidth, .4*wingLength)
			p.vertex(0, .2*wingLength)
			p.vertex(-wingWidth, .4*wingLength)
			p.endShape()
			p.pop()
		
		})
	}

	drawDebug(p, time) {

		p.stroke(...this.flockColor)
		p.noFill()
		this.flockCenter.draw(p, 10)
		// Draw the flock's average velocity
		this.flockVelocity.drawArrow({p, 
			center: this.flockCenter,
			multiple:1, 
			color: this.flockColor
		})

		this.boids.forEach((pt, ptIndex) => {

			pt.velocity.drawArrow({p, 
				center: pt,
				multiple:1, 
				color: [...this.flockColor, .4]
			})
			pt.alignment.drawArrow({p, 
				center: pt,
				multiple:1, 
				color: [280, 100, 50]
			})

			// pt.cohesion.drawArrow({p, 
			// 	center: pt,
			// 	multiple:1, 
			// 	color: [200, 100, 50]
			// })

			// pt.avoidance.drawArrow({p, 
			// 	center: pt,
			// 	multiple:1, 
			// 	color: [40, 100, 50]
			// })

		})
		
	}
	
}