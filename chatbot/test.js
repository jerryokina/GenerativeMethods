


// Do setup
document.addEventListener("DOMContentLoaded", function(){
	new Vue({
		el: "#app",
		template: `<div id="app">
			<div class="trace" v-for="trace in traces">
				<pre>{{trace}}</pre>
			</div>
		</div>`,


		computed: {
			grammar() {
				let grammar = tracery.createGrammar(astrologyGrammar)
				grammar.addModifiers(baseEngModifiers)
				return grammar
			},

			traces() {
				let traces = []
				for (var i = 0; i < 30; i++) {
					traces.push(this.grammar.flatten("#origin#"))
				}
				return traces
			}
		},

		data() {
			return {

			}
		}
	})
})
