<script>
	import LogRocket from 'logrocket';
LogRocket.init('xz0riz/svelte_profile_dev');
	import Button from './Button.svelte';
	import Cart from "./Cart.svelte";
	import Navbutton from "./Navbutton.svelte";
	import Para from "./Paragraph.svelte";
	import Imag from "./image.svelte";
	import Homepage from "./Homepage.svelte";
	import Example from "./Examples.svelte";
	import Contact from "./Contact.svelte";
	import About from "./About.svelte";
	
	import { createEventDispatcher } from 'svelte';
	let current = "Homepage"
	const dispatch = createEventDispatcher();
	let active = false;
	
</script>

<style>

	section {
		width: 100%;
		margin: auto;
	}
	div {
    margin: auto;
    width: 100%;
    overflow: hidden;
}		
	button {
    display: block;
}

	.active {
		display: block;
	}
	.hidden {
		display: none;
	}
</style>

<section>
	<div>
<Navbutton on:click="{() => current = 'Frontpage'}">Home</Navbutton>
<Navbutton on:click="{() => current = 'Aboutme'}">About</Navbutton>
<Navbutton on:click="{() => current = 'Contactform'}" >Contact</Navbutton>
<Navbutton on:click="{() => current = 'Examples'}">Examples</Navbutton>
</div>	
	</section>

	<hr>
	<section id='Frontpage' class="{current === "Frontpage" ? "active" : "hidden"}">
	<Homepage />
	</section>

<div id='Aboutme' class="{current === "Aboutme" ? "active" : "hidden"}">
	<About />
</div>

<div id="contactform" class="{current === "Contactform" ? "active" : "hidden"}">
	<Contact />
</div>

<div id="Examples" class="{current === "Examples" ? "active" : "hidden"}">
		<Example />
</div>
