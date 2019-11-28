<script>
	import LogRocket from 'logrocket';
LogRocket.init('xz0riz/svelte_profile_dev');
	import Product from "./Product.svelte";
	import Button from './Button.svelte';
	import Cart from "./Cart.svelte";
	import Navbar from "./Navbar.svelte";
	import Para from "./Paragraph.svelte";
	import Imag from "./image.svelte";

	function handleMessage(event) {
		alert({current});
	}

	export let current = 'Home';
	
	const homepara1 = {
		head: 'Some Info about Websites',
		text: 'This is some handy information about websites',
	}
	const homeimage1 = {
		link: 'https://images.unsplash.com/photo-1530435460869-d13625c69bbf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
		alttext: 'Website picture',
}
	const homepara2 = {
		head: 'What a website will do for you',
		text: 'Your website, simply put, will make you AWESOME!',
	}
	const aboutimage1 = {
		link: 'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80',
		alttext: 'silver iPhone X floating over open palm',
}
	const aboutimage2 = {
		link: 'https://images.unsplash.com/photo-1489389944381-3471b5b30f04?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
		alttext: 'tilt-shift photography of HTML codes',
}
const aboutpara1 = {
		head: 'My Design Approach',
		text: 'I design a website from a mobile-first perspective.  This creates a smooth site on any device.  The contrast of this is desktop first.  Both methods can create a great looking site on any device, but a desktop first site removes features as the site is scaled down.  The result is a jumpy site.  By a mobile first design, I add more advanced elements as the screen gets larger.  Not only does it run smoothly, but in slow connections it can run off the smaller device settings and still perform well!',
	}
	const aboutpara2 = {
		head: 'Languages I Use',
		text: 'Sites I build can use a combination of HTML, CSS, and Javascript.   I will use frameworks to improve the site capabilities, such as Svelte and React.  I love to expand my skillset when needed, but I can usually create what I need with these robust frameworks.',
	}
	const contactpara1 = {
		head: 'Get in touch with me!',
		text: "I would love to talk to you and discuss how I can build a site for your needs.  Please fill out the form below and let's create something amazing together!",
	}
	const exampleimage1 = {
		link: 'https://codepen.io/dewain38/pen/rPPLNz',
		alttext: 'Responsive Product landing',
}
	const examplepara1 = {
		head: 'Responsive product site',
		text: 'This page is an example of what I can build for a product landing page.  It will automatically resize to the device it is on.',
	}
	const examplepara2 = {
		head: 'Local Weather App',
		text: "This is a site I build to tell you the local weather, along with the capability to convert the measurements.  Unlike the previous site, this was not designed in responsive design, so it will look it's best on a computer",
	}
	

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
	.aboutimage {
		margin: auto;
    	width: 50%;
    	max-width: 300px;
    	height: 50%;
    	max-height: 300px;
		padding-bottom: 1.5em;
	}
	#Contact {
		display: none;
	}
	#Examples {
		display: block;
	}	
	
	
</style>

<section>
	<Navbar on:message={handleMessage}/>	
	</section>
	<hr>
	<section id='Homepage'>
	<Para head={homepara1.head} text={homepara1.text} />
	<Imag link={homeimage1.link} alttext={homeimage1.alttext} />
	<Para head={homepara2.head} text={homepara2.text} />
	</section>

	<section id='About'>
	<div class="aboutimage">
	<Imag link={aboutimage1.link} alttext={aboutimage1.alttext} />	
	</div>
	<div>
	<Para head={aboutpara1.head} text={aboutpara1.text} />
	</div>
	<div class="aboutimage">
	<Imag link={aboutimage2.link} alttext={aboutimage2.alttext} />
	</div>
	<Para head={aboutpara2.head} text={aboutpara2.text} />
	</section>

	<section id="Contact">
	<Para head={contactpara1.head} text={contactpara1.text} />
	<iframe title="contact" src="https://docs.google.com/forms/d/e/1FAIpQLSfKhpWL3FSlvs1bBvO7Ip9JLjAnR6BqhoaQQ_PmSycHEgH1ZA/viewform?embedded=true" width="100%" height="1073" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>
	</section>

	<section id="Examples">
	<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="result" data-user="dewain38" data-slug-hash="rPPLNz" data-preview="true" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Responsive Product Landing">
  <span>See the Pen <a href="https://codepen.io/dewain38/pen/rPPLNz">
  Responsive Product Landing</a> by Brian (<a href="https://codepen.io/dewain38">@dewain38</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

<Para head={examplepara1.head} text={examplepara1.text} />

<p class="codepen" data-height="344" data-theme-id="dark" data-default-tab="result" data-user="dewain38" data-slug-hash="ZKmXmN" data-preview="true" style="height: 344px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Local weather app">
  <span>See the Pen <a href="https://codepen.io/dewain38/pen/ZKmXmN">
  Local weather app</a> by Brian (<a href="https://codepen.io/dewain38">@dewain38</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

<Para head={examplepara2.head} text={examplepara2.text} />
	</section>
