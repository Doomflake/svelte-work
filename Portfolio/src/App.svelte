<script>
	import LogRocket from 'logrocket';
LogRocket.init('xz0riz/svelte_profile_dev');
	import Button from './Button.svelte';
	import Cart from "./Cart.svelte";
	import Navbar from "./Navbar.svelte";
	import Para from "./Paragraph.svelte";
	import Imag from "./image.svelte";
	import Homepage from "./Homepage.svelte";
	import Example from "./Examples.svelte";
	import Contact from "./Contact.svelte";
	import About from "./About.svelte";
	
	function handleClick() {
		alert('clicked')
	}
</script>

<style>

	section {
		width: 100%;
		margin: auto;
	}	
	#Frontpage {
		display: block;
	}
	#Aboutme {
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
	#contactform {
		display: none;
	}
	#Examples {
		display: none;
	}	
	
	
</style>

<section>
	<Navbar on:click={handleClick} class="{current === 'foo' ? 'active' : ''}"
	on:click="{() => current = 'foo'}"/>	
	</section>
	
	<hr>
	<section id='Frontpage'>
	<Homepage />
	</section>

<div id='Aboutme'>
	<About />
</div>

<div id="contactform">
	<Contact />
</div>

<div id="Examples">
		<Example />
</div>
