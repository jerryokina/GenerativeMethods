class CoffeeBot {
	constructor() {
		this.coffeeAmount = 0
		this.maxCoffee = 10
		// this.coffeeFlavor = "Folgers Instant"
		// this.coffeeDescription = "boring coffee"

		this.grammar = tracery.createGrammar(coffeeGrammar)
		this.grammar.addModifiers(baseEngModifiers)
		console.log("A type of coffee:", this.grammar.flatten("#coffeeType#"))

		this.cartAmount = 0
		this.cartItems = 0
		this.cart = []
		this.totalPrice = 0
	}

	respondTo(s) {
		console.log("User said", s)
		// return "<img src='https://media.tenor.com/images/eff22afc2220e9df92a7aa2f53948f9f/tenor.gif'></img>"

		if (s.toLowerCase().includes("show cart")) {
			if(this.cartAmount==0){
				return "Your shopping cart is empty now."
			}
			return this.cart
		}

		else if (s.toLowerCase().includes("clear cart")) {
			this.cartAmount = 0
			this.cartItems = 0
			this.cart = []
			return "Done."
		}

		else if (s.toLowerCase().includes("checkout")) {
			if (this.cartAmount==0){
				return "Your shopping cart is empty. Goodbye!"
			}

			this.totalPrice = this.cartAmount
			this.cartAmount = 0
			this.cartItems = 0
			this.cart = []

			return "Your total price is $" + this.totalPrice + ". Have a great day!"
		}

		else if (s.toLowerCase().includes("without")) {
			if (this.cartAmount==0){
				return "Goodbye!"
			}
			else {
				return this.grammar.flatten("#warningResponce#")
			}
		}
		
		else if (s.toLowerCase().includes("thirsty") || s.toLowerCase().includes("drink")) {
			this.cartAmount += 3
			this.cartItems += 1
			this.cart.push("a drink $3")
			return this.grammar.flatten("Here is a cup of #drinkType#. It costs $3.")
		}

		else if (s.toLowerCase().includes("car") || s.toLowerCase().includes("drive")) {
			this.cartAmount += 10000
			this.cartItems += 1
			this.cart.push("a car $1000")
			return this.grammar.flatten("Here is your car #carType#. It costs $10000.")
		}

		else if (s.toLowerCase().includes("hungry") || s.toLowerCase().includes("food") || s.toLowerCase().includes("eat")) {
			this.cartAmount += 20
			this.cartItems += 1
			this.cart.push("seafood $20")
			return this.grammar.flatten("Here is your food #seafoodType# #seafoodType# #seafoodType# 🍴. It costs $20.")
		}

		else if (s.toLowerCase().includes("walking")) {
			return this.grammar.flatten("#walkResponce#")
		}



		// else if (s.toLowerCase().includes("you")) {
		// 	return "there is no I in tea"
			
		// }



		// Brew new coffee
		else if (s.toLowerCase().includes("brew")) {

			// Create new values
			this.coffeeFlavor = this.grammar.flatten("#coffeeName#")
			this.coffeeDescription = this.grammar.flatten("#coffeeDesc#")

			this.post(`Brewing ${this.coffeeFlavor}, ${this.coffeeDescription}`)
					
			let interval = setInterval(() => {
				this.coffeeAmount = Math.min(this.coffeeAmount + 1,  this.maxCoffee)
				if (this.coffeeAmount >= this.maxCoffee) {
					this.post(`coffee is done!  *BING*`)
					clearInterval(interval)
				} else {
					// console.log("post to chat")
					this.post("... ")
				}


				
			}, 200)
			

			return ""

		}

		else if (s.includes(418))
			return `I'm a coffee pot`

		// return `'${s}' isn't a type of coffee`
		return `OK....if you want. Brewing ${s} coffee`
	}
}