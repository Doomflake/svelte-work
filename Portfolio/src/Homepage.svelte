<script>

	import Para from "./Paragraph.svelte";
	import Imag from "./image.svelte";

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
</script>

<style>

</style>

<Para head={homepara1.head} text={homepara1.text} />
	<Imag link={homeimage1.link} alttext={homeimage1.alttext} />
	<Para head={homepara2.head} text={homepara2.text} />