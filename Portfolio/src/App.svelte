<script>
	import LogRocket from 'logrocket';
LogRocket.init('xz0riz/svelte_profile_dev');
	import Product from "./Product.svelte";
	import Button from './Button.svelte';
	import Cart from "./Cart.svelte";
	import Navbar from "./Navbar.svelte";
	import Para from "./Paragraph.svelte";
	import Imag from "./image.svelte";
	import Homepage from "./Homepage.svelte";
	import Example from "./Examples.svelte";
	function navhandler(event) {
		alert({current});
	}

	let current = 'foo';
	
	
	

</script>

<style>

	section {
		width: 100%;
		margin: auto;
	}	
	#Homepage {
		display: none;
	}
	#About {
		display: none;
	}
	/*.aboutimage {
		margin: auto;
    	width: 50%;
    	max-width: 300px;
    	height: 50%;
    	max-height: 300px;
		padding-bottom: 1.5em;
	} */
	#Contact {
		display: none;
	}
	#Examples {
		display: block;
	}	
	.active {
		background-color: #ff3e00;
		color: white;
	}
	button {
		display: block;
		float: left;
		margin: auto;
	}
</style>

<section>
	<Navbar />	
	</section>
	
	<hr>
	<section id='Homepage'>
	<Homepage />
	</section>

	<section id='About'>
	<about />
	</section>

	<section id="Contact">
	<contact />
		</section>

	<section id="Examples">
	<Example />
<button
	class="{current === 'foo' ? 'active' : ''}"
	on:click="{() => current = 'foo'}"
>foo</button>

<button
	class="{current === 'bar' ? 'active' : ''}"
	on:click="{() => current = 'bar'}"
>bar</button>

<button
	class="{current === 'baz' ? 'active' : ''}"
	on:click="{() => current = 'baz'}"
>baz</button>
	</section>
