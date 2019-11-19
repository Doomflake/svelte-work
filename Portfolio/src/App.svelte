<script>
	import Product from "./Product.svelte";
	import Button from './Button.svelte';
	import Cart from "./Cart.svelte";
	import Navbar from "./Navbar.svelte";
	import Para from "./Paragraph.svelte";
	import Imag from "./image.svelte";

	let title = '';
	let price = 0;
	let description = '';

	let products = [];
	let cartItems = [];

	const home1 = {
		head: 'Some Info about Websites',
		text: 'This is some handy information about websites',
	}
	const imag = {
		link: 'https://images.unsplash.com/photo-1508138221679-760a23a2285b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
		alttext: 'plane in the trees',
}
	const home2 = {
		head: 'What a website will do for you',
		text: 'Your website, simply put, will make you AWESOME!',
	}

</script>

<style>
	section {
		width: 100%;
		margin: auto;
	}	
</style>

<section>
	<Navbar />	
	</section>
	<hr>
	<section id='Homepage'>
	<Para head={home1.head} text={home1.text} />
	<Imag link={imag.link} alttext={imag.alttext} />
	<Para head={home2.head} text={home2.text} />
	</section>