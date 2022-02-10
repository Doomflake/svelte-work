<script>

	import Para from "./Paragraph.svelte";
	import Imag from "./image.svelte";


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
	background: linear-gradient(233deg, #C2D1E8 25%,#2980b9 75%);
}
</style>
<section>
<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="result" data-user="dewain38" data-slug-hash="rPPLNz" data-preview="true" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Responsive Product Landing">
  <span>See the Pen <a href="https://codepen.io/dewain38/pen/rPPLNz">
  Responsive Product Landing</a> by Brian (<a href="https://codepen.io/dewain38">@dewain38</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>

<script async src="https://static.codepen.io/assets/embed/ei.js"></script>
</p>
<Para head={examplepara1.head} text={examplepara1.text} />

<p class="codepen" data-height="344" data-theme-id="dark" data-default-tab="result" data-user="dewain38" data-slug-hash="ZKmXmN" data-preview="true" style="height: 344px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Local weather app">
  <span>See the Pen <a href="https://codepen.io/dewain38/pen/ZKmXmN">
  Local weather app</a> by Brian (<a href="https://codepen.io/dewain38">@dewain38</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>

<script async src="https://static.codepen.io/assets/embed/ei.js"></script>
</p>
<Para head={examplepara2.head} text={examplepara2.text} />
</section>