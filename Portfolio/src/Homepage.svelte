<script>

	import Para from "./Paragraph.svelte";
	import Imag from "./image.svelte";
	
const homepara1 = {
		head: '5 Reasons you need a website',
		text: 'Based on a 2015 study by Verisign¹, here are the top 5 reasons a website is needed for your business.',
		list: 'item1'
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

a {
color: black;
}
p {
        text-align: center;
    }
	
</style>
<section>
	<Para head={homepara1.head} text={homepara1.text} /> 
	<p><strong>9 out of 10 </strong>Consumers will use the internet to find you, while 88% of small businesses will say it makes it easier for customers to find them</p>
	<p><strong>84% </strong>of Consumers believe a business with a website is more credible than a business with only a social media page</p>
	<p><strong>77%</strong> of Small Businesses feel a website is an easier way to find customers</p>
	<p><strong>81% </strong>of Small Businesses believe a website has helped to grow their business</p>
	<p><strong>92%</strong> of Consumers prefer to get information from a business's website over a social media page</p>
	<Imag link={homeimage1.link} alttext={homeimage1.alttext} />
	<Para head={homepara2.head} text={homepara2.text} />
</section>