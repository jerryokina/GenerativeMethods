

class LTree {
	// Create a branching system  Each branch can hold other branches
	constructor(aof) {
		
		this.aof = aof
		this.root = new LTreeBranch(this)
		this.center = new Vector(0,0)
		this.flowerColor = new Vector(0,0,0)

		// console.log("CENTER", this.center)
	}


	update(p, t, dt) {

		let hue = this.aof.get("flowerHue")
		// Update this with the current value of the AOF and any other parameters, like time
		let trunkLeaning = this.aof.get("treeLeaning")
		this.root.start.orientation = -Math.PI/2 - Math.PI/20 + trunkLeaning * Math.PI/10
		this.root.update(t, dt)

		this.flowerColor.setTo((300*hue+100)%360, 100, 80)

	}

	draw(p) {
		p.push()
		
		// Draw the root (and recursively, all the branches)
		p.noStroke()
		this.root.draw(p)
		
		p.pop()
	}


}


LTree.drawBackground = function(p) {
	p.background(240, 70, 15)
}

// Static properties for this class
LTree.landmarks = {
	"bouquet": [1.0, 0.0, 0.0, 0.5, 0.06, 0.768, 0.644, 0.58],
	"spreading": [0.493, 1.0, 0.555, 0.5, 1.0, 0.36, 1.0, 0.693],
	"strong": [0.0, 0.484, 1.0, 0.5, 0.343, 0.83, 0.0, 1.0],
	"windmill": [0.0, 1.0, 0.179, 0.5, 0.883, 0.307, 0.0, 0.59],
	"bald": [0.00, 0.75, 0.511, 0.5, 0.316, 0.0, 0.0, 0.0],
}
LTree.labels = ["shining", "trunkColor", "trunkThickness", "treeLeaning", "branchSpread", "flowerHue", "flowerShape", "flowerSize"]

let branchCount = 0

class LTreeBranch {
	constructor(parent) {

		this.idNumber = branchCount++
		
		
		if (parent instanceof LTreeBranch) {
			this.parent = parent
			this.depth = parent.depth + 1
			this.tree = this.parent.tree
		}
		else {
			this.depth = 0
			this.tree = parent
		}

		// let spread = this.tree.aof.get("branchSpread")

		this.start = new LTreeBranchNode()
		this.end = new LTreeBranchNode()
		this.length = 0



	
		this.branches = []

		

		if (this.depth < 4) {
			let numBranches = 2
			for (var i = 0; i < numBranches; i++) {
				
				this.branches.push(new LTreeBranch(this))
			}
		}

	}	

	update(t, dt) {

		let animatedLength = this.length
		this.end.setToPolarOffset(this.start, animatedLength, this.start.orientation)
		// console.log(this.start, this.length, this.start.orientation)
		// console.log(this.end)
		let spread = this.tree.aof.get("branchSpread")
		// let ldie = this.tree.aof.get("length_dieoff")
		let ldie = 0.5
		// let tdie = this.tree.aof.get("thickness_dieoff")
		let tdie = 0.5
		

		this.end.orientation = this.start.orientation


		// Multiply by somewhere between .5  and .9
		
		if (this.parent) {
			this.length = this.parent.length * (.5 + .4*ldie)
			// this.length *= 
		}
		
		else  {

			// TRUNK!
			let trunkColor = this.tree.aof.get("trunkColor")
			let trunkThickness = this.tree.aof.get("trunkThickness")
			this.start.color.setTo( (350+trunkColor*60)%360, 40, 50)
			
			this.start.radius = (.9 - .4*tdie)*(3+trunkThickness*30)
			this.length = 100*(.9 - .4*ldie)
		}

		this.end.radius = this.start.radius * (.5 + .4*tdie)
		this.end.color.copy(this.start.color)

		this.branches.forEach((b, i) => {
			let pct = this.branches.length==1?.5:i/(this.branches.length - 1) - .5

			let waving =  Math.sin(t + this.depth)*.1
			let theta = (2.3*spread + .3)*pct + waving


			b.start.copy(this.end)
			b.start.radius = this.end.radius 
			b.start.color.copy(this.end.color)

			b.start.orientation =  this.end.orientation + theta

			b.update(t, dt)
		})
	}

	draw(p) {
		let theta = this.orientation
		p.fill(...this.start.color)

		// draw tree trunk
		p.stroke(0)
		p.strokeWeight(1)
		p.beginShape()
		Vector.polarOffsetVertex(p, this.start, this.start.radius, this.start.orientation + Math.PI/2)
		Vector.polarOffsetVertex(p, this.end, this.end.radius, this.start.orientation + Math.PI/2)
		Vector.polarOffsetVertex(p, this.end, this.end.radius, this.start.orientation - Math.PI/2)
		Vector.polarOffsetVertex(p, this.start, this.start.radius, this.start.orientation - Math.PI/2)
		p.endShape()

		// draw outline if trunk
		let trunkShining = this.tree.aof.get("shining")
		let shiningWeight = trunkShining*2.0 + 0.7

		let t = p.millis()
		let shiningColor = Math.sin(t/233)*40+70

		p.stroke(0,0,shiningColor)
		p.strokeWeight(shiningWeight)
		p.beginShape()
		Vector.polarOffsetVertex(p, this.start, this.start.radius, this.start.orientation + Math.PI/2)
		Vector.polarOffsetVertex(p, this.end, this.end.radius, this.start.orientation + Math.PI/2)
		Vector.polarOffsetVertex(p, this.end, this.end.radius, this.start.orientation - Math.PI/2)
		Vector.polarOffsetVertex(p, this.start, this.start.radius, this.start.orientation - Math.PI/2)
		p.endShape()

		// this.start.draw(p)
		// this.end.draw(p)
		
		// draw all branches
		this.branches.forEach(b => b.draw(p))

		// Flower
		if (this.branches.length === 0) {
			p.push()

			p.translate(...this.end)
			p.rotate(this.end.orientation)
			

			p.noStroke()
			
			p.fill(...this.tree.flowerColor)
			let flowerShape = this.tree.aof.get("flowerShape")
			let petalSpread = flowerShape*0.5 + 0.3
			let petalBalance = petalSpread*0.5 + 0.3
			let petalCount = 5
			for (var i = 0; i < petalCount; i++) {
				let theta = i*Math.PI*2/petalCount
				let r = this.tree.aof.get("flowerSize")*30 + 0

				p.stroke(this.tree.flowerColor[0], this.tree.flowerColor[1], this.tree.flowerColor[2]-20)
				p.strokeWeight(petalBalance)

				p.beginShape()
				p.vertex(0, 0)
				Vector.polarVertex(p, r*petalBalance+0.1, theta - petalSpread)
				Vector.polarVertex(p, r, theta)
				Vector.polarVertex(p, r*petalBalance+0.1, theta + petalSpread)
				p.vertex(0, 0)
				p.endShape()
			}


			p.pop()
		}
		
	}
}


// Like a Vector but with orientation and radius
class LTreeBranchNode extends Vector {
	constructor() {
		super(0,0)
		this.radius = Math.random()*10 + 10
		this.orientation = Math.random()*6.15
		this.color = new Vector(0, 0, 0)
	}

	draw(p) {

		p.fill(100, 0, 100)
		p.stroke(0, 0, 0)
		p.circle(...this, this.radius)
		let r = this.radius + 10
		p.line(...this, this[0] + r*Math.cos(this.orientation), this[1] + r*Math.sin(this.orientation))
	}
}


