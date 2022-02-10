<script>

	import Para from "./Paragraph.svelte";
	import Imag from "./image.svelte";

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
	
</script>


<style>
section {
	background: linear-gradient(348deg, #C2D1E8 25%,#2980b9 75%);
}
</style>
<section>
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