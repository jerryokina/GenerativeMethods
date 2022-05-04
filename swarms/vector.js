/**
 * @namespace Vector
 */

 function test() {

 }

// Define UMD module for both AMD and browser.
((root, factory) => {
	// Detects AMD/RequireJS"s define function.
	if (typeof define === "function" && define.amd) {
		// Is AMD/RequireJS. Call factory with AMD/RequireJS"s define function.
		define("Vector", [], factory);
	} else {
		// Is Browser. Directly call factory.
		// Imported dependencies are global variables(properties of window object).
		// Exported module is also a global variable(property of window object)
		root.Vector = factory();
	}
})(typeof self !== "undefined" ? self : this, () => {


	function getDimension() {
		let d = undefined
		for (var i = 0; i < arguments.length; i++) {
			if (!Array.isArray(arguments[i]))
				throw("Unexpected non-array argument: " + arguments[i])
			let d2 =  arguments[i].length
			if (d == undefined)
				d = d2
			if (d2 != d) {
				d = Math.min(d, d2)
				console.warn("Unequal vector lengths:", d, d2)
			}
		}
		return d
	}

	function lerp(a, b, pct) {
		return a*(1-pct) + b*pct
 	}



   /** Class representing a point in space
	*  which is an extended Array (see https://javascript.info/extend-natives)
	* @memberof Vector
	* */
	class Vector extends Array {


 		constructor() {
 			/**
			* Constructs a Vector
			*
			* @memberof Vector
			* @param {...number} var_args
			* @param {string} [o] - A optional string param
			* @param {string} [d=DefaultValue] - A optional string param
			* @return {string} A good string
			*
			* @example
			*
			*	foo('hello')
			*/
			let arr = arguments
			// Is the argument a vector? If so, clone it
			if (Array.isArray(arguments[0])) {
				// Clone a vector?
				arr = arguments[0]
			}

			super(...arr);
			if (this.length == 0) {
				this.push(0)
				this.push(0)
			}

			// Check for validity
			for (var i = 0; i < arr.length; i++) {
				if (isNaN(arr[i]))
					throw(`NaN argument for Vector constructor: ${arr[i]}(${typeof arr[i]})`)
			}
		}

		// Check if this vector is broken in some way
		isValid() {
			/**
			* Constructs a Vector
			*
			* @memberof Vector
			* @param {...number} var_args
			* @param {string} [o] - A optional string param
			* @param {string} [d=DefaultValue] - A optional string param
			* @return {boolean} true if this contains NaN or undefined
			*
			* @example
			*
			*	foo('hello')
			*/
			for (var i = 0; i < this.length; i++) {
				if (this[i] === undefined || this[i] === null|| isNaN(this[i]))
					return false
			}
			return true
		}

		checkIfValid() {
			/**
			* Throws an error if this is not valid
			*/
			for (var i = 0; i < this.length; i++) {
				if (this[i] === undefined || this[i] === null|| isNaN(this[i]))
					throw(`Invalid vector: ${this}`)
			}
		}

		print() {
			console.log(this.toString())
		}

		toString() {
			return "(" + this.toFixed(2) + ")"
		}
		
		toFixed(length) {
			return this.map(s => s.toFixed(length)).join(",")
		}

		//=============================================================
		// clone

		
		clone() {
			let v = new Vector(this)
			return v
		}

		clonePolarOffset(r, theta) {
			if (isNaN(r))
				throw(`Non-number radius: '${r}' type:${typeof r}`)
			if (isNaN(theta))
				throw(`Non-number theta: '${theta}' type:${typeof theta} `)
			let v = new Vector(this)
			v.addPolar(r, theta)
			return v
		}

		getOffsetTo(v) {
			return Vector.difference(v, this)
		}

		getNormal() {
			return Vector.getNormal(this)
		}

		getNormalized() {
			return (new Vector(this)).normalize()
		}

		//=============================================================
		// Setting this vector

		setTo() {
			let arr = Array.isArray(arguments[0])?arguments[0]:arguments
			
			for (var i = 0; i < Math.max(this.length, arr.length); i++) {
				this[i] = arr[i]
			}
			this.checkIfValid()
			return this
		}


		setToLerp(v0, v1, pct) {
			if (!Array.isArray(v0))
				throw(`Non-array variable: '${v0}' type:${typeof v0}`)
			if (!Array.isArray(v1))
				throw(`Non-array variable: '${v1}' type:${typeof v1}`)
			

			for (var i = 0; i < Math.min(v0.length, v1.length); i++) {
				this[i] = lerp(v0[i], v1[i], pct)
			}
			return this
		}

		setToDifference(v1, v0) {
			if (!Array.isArray(v0))
				throw(`Non-array v0: '${v0}' type:${typeof v0}`)
			if (!Array.isArray(v1))
				throw(`Non-array v1: '${v1}' type:${typeof v1}`)
			
			for (var i = 0; i < Math.min(v0.length, v1.length); i++) {
				this[i] = v1[i] - v0[i] 
			}
			this.checkIfValid()
			return this
		}

		setToMultiple(v, m) {
			if (!Array.isArray(v))
				throw(`Non-array v: '${v}' type:${typeof v}`)	
			if (isNaN(m))
				throw(`Non-number m: '${m}' type:${typeof m} `)
			
			for (var i = 0; i < v.length; i++) {
				this[i] = v[i]*m			
			}
			this.checkIfValid()
			return this
		}

		setToAddMultiples( ) {
			for (var j = 0; j < this.length; j++) {
				this[j] = 0
				for (var i = 0; i < arguments.length/2; i++) {
					let v = arguments[i*2] || arguments[i*2]
					let m = arguments[i*2 + 1]
					if (!Array.isArray(v))
						throw(`Non-array v: '${v}' type:${typeof v}`)	
					if (isNaN(m))
						throw(`Non-number m: '${m}' type:${typeof m} `)
					
					this[j] += v[j]*m	
				}
			}
			this.checkIfValid()
			return this
		}

		setToNormal(v) {
			if (!Array.isArray(v))
				throw(`Non-array v: '${v}' type:${typeof v}`)	
					
			v = v.coords || v
			let m = Math.sqrt(v[0]*v[0] + v[1]*v[1])
			this[0] = v[1]/m
			this[1] = -v[0]/m
			this.checkIfValid()
			return this
		}

		setToAverage() {
			let arr = arguments[0]


			this.mult(0)
			for (var i = 0; i < arr.length; i++) {
				let v = arr[i]
				if (!Array.isArray(v))
					throw(`Non-array v: '${v}' type:${typeof v}`)	
			
				this.add(arr[i])
			}
			this.div(arr.length)
			
			return this
		}



		setToPolar(r, theta) {
			if (isNaN(r) || r === undefined)
				throw(`Non-number radius: '${r}' type:${typeof r}`)
			if (isNaN(theta) ||  theta === undefined)
				throw(`Non-number theta: '${theta}' type:${typeof theta} `)
			
			this[0] = r*Math.cos(theta)
			this[1] = r*Math.sin(theta)

			this.checkIfValid()
			return this
		}


		setToPolarOffset(v, r, theta) {
			if (isNaN(r) || r === undefined)
				throw(`Non-number radius: '${r}' type:${typeof r}`)
			if (isNaN(theta) ||  theta === undefined)
				throw(`Non-number theta: '${theta}' type:${typeof theta} `)
			
			this[0] = v[0] + r*Math.cos(theta)
			this[1] = v[1] + r*Math.sin(theta)
			for (var i = 2; i < v.length; i++) {
				this[i] = v[i]
			}
			this.checkIfValid()
			return this
		}
		
		
		//=============================================================
		// Multiplications
		mult(m) {
			let arr = Array.isArray(arguments[0])?arguments[0]:arguments
			if (isNaN(m))
				throw(`Invalid NaN multiplier ${m}`)

			for (var i = 0; i < this.length; i++) {
				this[i] *= m
			}
			this.checkIfValid()
			return this
		}

		div(m) {
			if (isNaN(m))
				throw(`Invalid NaN multiplier ${m}`)
			if (m === 0) {
				throw(`Can't divide by 0 `)
			}

			for (var i = 0; i < this.length; i++) {
				this[i] /= m
			}
			this.checkIfValid()
			return this
		}
		
		
		addPolar(r, theta) {
			if (isNaN(r) || r === undefined)
				throw(`Non-number radius: '${r}' type:${typeof r}`)
			if (isNaN(theta) ||  theta === undefined)
				throw(`Non-number theta: '${theta}' type:${typeof theta} `)
			
			this[0] += r*Math.cos(theta)
			this[1] += r*Math.sin(theta)
			
			this.checkIfValid()
			return this
		}
		
		add() {
			// Is this an array of arrays? or are the arguments numbers?
			let arr = Array.isArray(arguments[0])?arguments:[arguments]
			
			for (var i = 0; i < arr.length; i++) {
				let v = arr[i]
				
				// Only add what dimensions we both have
				for (var j = 0; j < Math.min(this.length, v.length); j++) {
					this[j] += v[j]
				}
			}
			
			this.checkIfValid()
			return this
		}


		sub() {
			// Is this an array of arrays? or are the arguments numbers?
			let arr = Array.isArray(arguments[0])?arguments:[arguments]
			
			for (var i = 0; i < arr.length; i++) {
				let v = arr[i]
				
				// Only add what dimensions we both have
				for (var j = 0; j < Math.min(this.length, v.length); j++) {
					this[j] -= v[j]
				}
			}
			
			this.checkIfValid()
			return this
		}



		addMultiples() {

			let count = arguments.length/2

			for (var i = 0; i < this.length; i++) {

				for (var j = 0; j < count; j++) {

					const v = arguments[j*2]

					// Ignore vectors that too short
					//   assume they are 0 in this dimension
					if (v.length > i) {
						const m = arguments[j*2 + 1]
						if (isNaN(m)) {
							throw(`addMultiples: NaN scalar multiple ${m}`)
						}
						if (isNaN(v[i])) {
							console.log(v, v[i])
							throw(`addMultiples: NaN element of vector ${v}`)
						}
						this[i] += v[i] * m
					}
				}
			}
			
			this.checkIfValid()
			return this
		}

		//=============================================================
		// Magnitude operations

		get magnitude() {
			let sum = 0
			for (var i = 0; i < this.length; i++) {
				sum += this[i]**2
			}
			
			return Math.sqrt(sum)
		}

		get angle() {
			return Math.atan2(this[1], this[0])
		}

		getDistanceTo(v){
			return Vector.getDistance(v, this)
		}


		getClosest(arr, range) {
			return Vector.getClosest(this, arr, range)
		}


		angleTo(v) {
			v = v.coords || v
			return Math.atan2(this[1] - v[1], this[0] - v[0])
		}

		normalize() {
			let m = this.magnitude
			if (m  > 0) {
				for (var i = 0; i < this.length; i++) {
					this[i] /= m
				}
				
				this.checkIfValid()
			}
			return this
		}

		clampMagnitude(min, max) {
			let m = this.magnitude
			if (m !== 0)
				this.mult(Math.max(Math.min(max, m), min)/m)
			return this
		}

		wrap(x0, x1, y0, y1, z0, z1) {
			if (this[0] < x0) {
				// Teleport to x1
				this[0] = x1
			} else if (this[0] > x1) {
				// Teleport to x1
				this[0] = x0
			}

			if (this[1] < y0) {
				// Teleport to x1
				this[1] = y1
			} else if (this[1] > y1) {
				// Teleport to x1
				this[1] = y0
			}

			return this
		}

		clamp() {
			for (let i = 0; i < arguments.length/2; i++) {
				this[i] = Math.max(arguments[i*2], Math.min(arguments[i*2 + 1], this[i]))
			}	
			return this
		}

		//=============================================================
		// Drawing

		vertex(p) {
			if (p== undefined || !p.line)
				throw("Remember to include P5 object as the p argument")

			p.vertex(...this)
		}
		curveVertex(p) {
			if (p== undefined || !p.line)
				throw("Remember to include P5 object as the p argument")

			p.curveVertex(...this)
		}
		bezierVertex(p, cp0, cp1) {
			if (p== undefined || !p.line)
				throw("Remember to include P5 object as the p argument")

			cp0 = cp0.coords || cp0
			cp1 = cp1.coords || cp1
			p.bezierVertex(...cp0, ...cp1, ...this)
		}

		

		polarOffsetVertex(p, r, theta) {
			if (p== undefined || !p.line)
				throw("Remember to include P5 object as the p argument")

			if (isNaN(r) || r === undefined)
				throw(`Non-number radius: '${r}' type:${typeof r}`)
			if (isNaN(theta) ||  theta === undefined)
				throw(`Non-number theta: '${theta}' type:${typeof theta} `)
			
			p.vertex(this[0] + r*Math.cos(theta), this[1] + r*Math.sin(theta))
		}

		polarOffsetCurveVertex(p, r, theta) {
			if (p== undefined || !p.line)
				throw("Remember to include P5 object as the p argument")

			if (isNaN(r) || r === undefined)
				throw(`Non-number radius: '${r}' type:${typeof r}`)
			if (isNaN(theta) ||  theta === undefined)
				throw(`Non-number theta: '${theta}' type:${typeof theta} `)
			
			p.curveVertex(this[0] + r*Math.cos(theta), this[1] + r*Math.sin(theta))
		}

		draw(p, radius = 1) {
			if (p== undefined || !p.line)
				throw("Remember to include P5 object as the p argument")

			p.circle(...this, radius)
		}

		drawPolarOffsetCircle(p, r, theta, radius = 1) {
			if (p== undefined || !p.line)
				throw("Remember to include P5 object as the p argument")
			if (isNaN(r) || r === undefined)
				throw(`Non-number radius: '${r}' type:${typeof r}`)
			if (isNaN(theta) ||  theta === undefined)
				throw(`Non-number theta: '${theta}' type:${typeof theta} `)

			p.circle(this[0]+r*Math.cos(theta),this[1]+r*Math.sin(theta), radius)
		}

		drawLine({p, 
			center=[0,0,0], 
			multiple=1,
			offsetNormal=0, 
			paddingEnd=0,
			paddingStart=0}) {


			if (p== undefined || !p.line)
				throw("Remember to include P5 object as the p argument")

			let mag = this.magnitude
			let nx = this[1]*offsetNormal/mag
			let ny = -this[0]*offsetNormal/mag

			let mx = this[0]/mag
			let my = this[1]/mag

			p.line(
				center[0] + nx + mx*paddingStart,
				center[1] + ny + my*paddingStart,
				center[0] + this[0]*multiple + nx - mx*paddingEnd,
				center[1] + this[1]*multiple + ny - my*paddingEnd
			)
		}

		drawLineTo({p, 
			v,
			offsetNormal=0, 
			paddingEnd=0,
			paddingStart=0}) {


			if (p== undefined || !p.line)
				throw("Remember to include P5 object as the p argument")

			let x = v[0] - this[0]
			let y = v[1] - this[1]

			let mag = Math.sqrt(x*x+ y*y)
			x/= mag
			y/= mag
			let nx = y*offsetNormal
			let ny = -x*offsetNormal

			let mx = this[0]/mag
			let my = this[1]/mag

			p.line(
				this[0] + nx - mx*paddingStart,
				this[1] + ny - my*paddingStart,
				v[0] + nx + mx*paddingEnd,
				v[1] + ny + my*paddingEnd
			)
		}


		drawArrow({p, 
			center=[0,0,0], 
			multiple=1,
			arrowSize=10, 
			arrowWidth=1,
			arrowIndent=.2,
			color=[0,0,0], 
			offsetNormal=0, 
			paddingEnd=0,
			paddingStart=0}) {

			let m = this.magnitude*multiple
			p.push()
			if (center)
				p.translate(...center)

			p.rotate(this.angle)
			p.translate(0, -offsetNormal)


			p.noFill()
			p.stroke(color)
			p.line(paddingStart, 0, m - arrowSize - paddingEnd, 0)

			p.translate(m - paddingEnd, 0)

			p.noStroke()
			p.fill(color)
			
			p.beginShape()
			p.vertex(0, 0)
			p.vertex(-arrowSize*(1 + arrowIndent), arrowSize*.5*arrowWidth)
			p.vertex(-arrowSize, 0)
			p.vertex(-arrowSize*(1 + arrowIndent), -arrowSize*.5*arrowWidth)
			p.endShape(p.CLOSE)
			
			p.pop()
		}

		drawBlurryCircle({p, color=[0,0,0], layers=3, shade=0, radiusDieoff=1, opacityDieoff=1, radius=10, innerRadius=0, opacity=1}) {
			// Get the opacity from the color, or prespecified opacity (or 1)
			let targetL = shade>0?100:0
			opacity = color[3]==undefined? opacity:color[3]
			for (var i = 0; i < layers; i++) {
				let pctOpacity = ((i+1)/layers)**opacityDieoff *opacity
				let pctR = (1 - (i/layers))**radiusDieoff

				let r = (radius - innerRadius)*pctR + innerRadius
				
				let l = lerp(color[2], targetL, pctOpacity*Math.abs(shade))
				let drawColor = [...color.slice(0,2), l, pctOpacity*opacity]
				p.fill(drawColor)
				p.noStroke()
				// p.stroke(0)
				p.circle(...this, r)
			}
		}

	}


	//=============================================================
	// Other ways to create vectors

	// Create an empty vector
	Vector.empty = function(dimension=3) {
		let v =  []
		for (var i = 0; i < dimension; i++) {
			v.push(0)
		}
		return new Vector(...v)
	}

	// Create a random vector 
	// random([0,0,0], [100, 100, 100])
	Vector.random = function() {
		let min = [0,0,0]
		let max = [1,1,1]
		if (arguments.length == 2) {
			min = arguments[0]
			max = arguments[1]
		} else if (arguments.length == 1) {
			max = arguments[0]
		}

		if (!Array.isArray(min))
			throw(`Non-array variable: '${min}' type:${typeof min}`)
		if (!Array.isArray(max))
			throw(`Non-array variable: '${max}' type:${typeof max}`)
			

		dimension = min.length


		let v =  []
		for (var i = 0; i < dimension; i++) {
		

			v[i] = Math.random()*(max[i] - min[i]) + min[i]
		}

		return new Vector(...v)
	}


	// Create a random polar coordinate
	Vector.randomPolar = function() {
		min = 0
		max = 1
		if (arguments.length == 2) {
			max = arguments[1]
			min = arguments[0]
		}
		else if (arguments.length == 1) {
			min = arguments[0]
			max = arguments[0]
		}
		r = Math.random()*(max-min) + min
		let theta = Math.PI*2*Math.random()
		return new Vector(r*Math.cos(theta), r*Math.sin(theta))
	}

	// Add several vectors
	Vector.average = function() {
		let v = Vector.empty(arguments[0]?arguments[0].length:2)
		v.setToAverage.apply(v, arguments);  
	}

	Vector.lerp = function() {
		return (Vector.empty(arguments[0].length)).setToLerp(...arguments)
	}

	Vector.difference = function() {
		return (new Vector()).setToDifference(...arguments)
	}

	Vector.multiple = function() {
		return (new Vector()).multiple(...arguments)
	}

	Vector.addMultiples = function() {
		return (new Vector()).addMultiples(...arguments)
	}

	Vector.normal = function(v) {
		return new Vector(v[1], -v[0])
	}

	Vector.average = function() {
		return (new Vector()).setToAverage(...arguments)
	}

	Vector.polar = function() {
		return (new Vector()).setToPolar(...arguments)
	}

	Vector.polarOffset = function() {
		return (new Vector()).setToPolarOffset(...arguments)
	}


	// =================
	
	Vector.getDistance = function(a, b) {
		let sum = 0
		let d = getDimension(a, b)
		for (var i = 0; i < d; i++) {
			sum += (a[i] - b[i])**2
		}

		return Math.sqrt(sum)
	}

	// =================
	// Drawing


	Vector.polarOffsetVertex = function(p, v, r, theta) {
		v = v.coords || v
		p.vertex(v[0] + r*Math.cos(theta), v[1] + r*Math.sin(theta))
	}

	Vector.polarVertex = function(p,  r, theta) {
		p.vertex(r*Math.cos(theta), r*Math.sin(theta))
	}

	Vector.polarCurveVertex = function(p,  r, theta) {
		p.curveVertex(r*Math.cos(theta), r*Math.sin(theta))
	}

	Vector.bezierVertex = function(p, cp0, cp1, v) {
		v = v.coords || v
		cp0 = cp0.coords || cp0
		cp1 = cp1.coords || cp1
		p.bezierVertex(...cp0, ...cp1, ...v)
	}

	Vector.lerpVertex = function(p, v0, v1, pct=.5, n=0) {
		v0 = v0.coords || v0
		v1 = v1.coords || v1
		let dx = v1[0] - v0[0]
		let dy = v1[1] - v0[1]
		let m = Math.sqrt(dx*dx + dy*dy)
		let x = v0[0] + pct*dx + dy*n/m
		let y = v0[1] + pct*dy + -dx*n/m
		p.vertex(x, y)
	}

	Vector.lerpCircle = function(p, v0, v1, pct=.5, r, n=0) {
		v0 = v0.coords || v0
		v1 = v1.coords || v1
		let dx = v1[0] - v0[0]
		let dy = v1[1] - v0[1]
		let m = Math.sqrt(dx*dx + dy*dy)
		let x = v0[0] + pct*dx + dy*n/m
		let y = v0[1] + pct*dy + -dx*n/m
		p.circle(x, y,r )
	}

	Vector.lerpLine = function(p, v0, v1, pct=.5, n=0, offset0=0, offset1=0) {
		v0 = v0.coords || v0
		v1 = v1.coords || v1
		let dx = v1[0] - v0[0]
		let dy = v1[1] - v0[1]
		let m = Math.sqrt(dx*dx + dy*dy)
		let x = v0[0] + pct*dx + dy*n/m
		let y = v0[1] + pct*dy + -dx*n/m
		p.line(v0[0],v0[1], x, y)
	}

	


	Vector.drawLineBetween = function({p,v0,v1,multiple=1,offsetStart=0, offsetEnd=0}) {

		let dx = v1[0]-v0[0]
		let dy = v1[1]-v0[1]

		let m = Math.sqrt(dx**2 + dy**2)


		p.line(
			v0[0] + dx*offsetStart/m,
			v0[1] + dy*offsetStart/m,
			v1[0] - dx*offsetEnd/m,
			v1[1] - dy*offsetEnd/m,


			)
	}

	Vector.getClosest = function(pt, arr, range=100) {
		if (!Array.isArray(arr))
			throw(`Non-array vector for getClosest {arr}`)
		// Return the closest vector as a dist/vector pair
		let bestDist = range
		let best = undefined
		arr.forEach(v => {
			// Get the distance (offset by the radius, if available)
			let d = pt.getDistanceTo(v) - ((v.radius?v.radius:0) + (pt.radius?pt.radius:0))
			
			if (d < bestDist) {
				bestDist = d
				best = v
			}
		})
		if (best)
			return [best,bestDist]
	}
	
	return Vector

});